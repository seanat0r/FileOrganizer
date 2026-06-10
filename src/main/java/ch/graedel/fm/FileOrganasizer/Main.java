package ch.graedel.fm.FileOrganasizer;

import ch.graedel.fm.FileOrganasizer.api.ApiServer;
import ch.graedel.fm.FileOrganasizer.checker.*;
import ch.graedel.fm.FileOrganasizer.model.AppConfig;
import ch.graedel.fm.FileOrganasizer.model.Rule;
import ch.graedel.fm.FileOrganasizer.mover.FileMover;
import ch.graedel.fm.FileOrganasizer.repository.sqlite.SQLiteRuleRepository;
import ch.graedel.fm.FileOrganasizer.utils.DatabaseManager;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

/**
 * Start the programm and the Server.
 * First it start the API server and then cleanse the Global Location.
 */
public class Main {
    /**
     * Initialize all ConfigParser, FileMover and ApiServer.
     * start the programm.
     */
    static void main() {
        try {
            //ConfigParser parser = new ConfigParser();
            SQLiteRuleRepository sqliteDbRepo = new SQLiteRuleRepository();
            FileMover mover = new FileMover();
            ApiServer api = new ApiServer(sqliteDbRepo, mover);

            DatabaseManager.createDatabase();
            IO.println("--- Database created ---");

            api.start();
            IO.println("--- API Server Online ---");

            IO.println("--- Start cleaning Files ---");
            startProgram(sqliteDbRepo, mover);
        } catch (Exception e) {
            e.printStackTrace();

            if (e.getCause() != null) {
                e.getCause().printStackTrace();
            } else {
                System.err.println("No other Cause exists.");
            }
        }


    }

    /**
     * Returns all Files in a Folder
     *
     * @param path the Path to the Folder
     * @return An Array of Files
     */
    private static File[] getAllFiles(String path) {
        File folder = new File(path);
        File[] files = folder.listFiles();
        if (files == null) {
            throw new IllegalArgumentException("Path invalid or not a Directory: " + path);
        }
        return files;
    }

    /**
     * Checks if all rule is true.
     *
     * @param rule            the Rule Class
     * @param file            the File Class
     * @param globalLocations The Global Location of the config
     * @return true, all rules apply -> do move. false, a rule does not apply -> don't move.
     */
    private static boolean checkRules(Rule rule, File file, List<String> globalLocations) {
        FileChecker extensionChecker = new ExtensionChecker(rule);
        FileChecker exactNameChecker = new ExactNameChecker(rule);
        FileChecker containsChecker = new NameContainsChecker(rule);
        FileChecker locationChecker = new LocationChecker(rule, globalLocations);

        return extensionChecker.check(file) &&
                exactNameChecker.check(file) &&
                containsChecker.check(file) &&
                locationChecker.check(file);

    }

    /**
     * Starts the programm for an initial clean up.
     *
     * @param sql   SQLiteRuleRepository
     * @param mover FileMover
     */
    public static void startProgram(SQLiteRuleRepository sql, FileMover mover) {
        List<Rule> rules = sql.findAll();
        AppConfig config = sql.findAllGlobalPaths();

        List<String> startFolders = config.startLocationsGlobal();

        // Loop through the Global Path
        for (String folderPath : startFolders) {
            File[] files = getAllFiles(folderPath);

            for (File file : files) {
                processSingleFile(file, rules, mover, config.startLocationsGlobal());
            }
        }

        // Loop through the rules specific Start Location ( Rules x Directory x Files )
        for (Rule rule : rules) {
            for (String folderPath : rule.startLocation()) {
                File[] files = getAllFiles(folderPath);
                for (File file : files) {
                    processSingleFile(file, rules, mover, config.startLocationsGlobal());
                }
            }
        }
        IO.println("Done.");
    }

    /**
     * Process a File. Checks the current file and if all checks return true, move it!
     *
     * @param file            the file to check and move
     * @param rules           all the Rule from config.json
     * @param mover           FileMover
     * @param globalLocations all GlobalLocation paths from config.json. Its is a List<String>!
     */
    private static void processSingleFile(File file, List<Rule> rules, FileMover mover, List<String> globalLocations) {
        // ignore system- and hidden files
        if (file.isDirectory() || file.isHidden() ||
                file.getName().equals(".DS_Store") || file.getName().equals("Thumbs.db") ||
                file.getName().equals("desktop.ini") || file.getName().startsWith("~$") ||
                file.getName().equals(".localized")) {
            return;
        }

        for (Rule currentRule : rules) {
            if (!checkRules(currentRule, file, globalLocations)) {
                IO.println("Mismatch: " + file);
                continue;
            }

            IO.println("Match! " + file);
            mover.moveFile(file, currentRule);
            break;
        }
    }

    /**
     * Set up a WatchService and looks for any changes in the directory and if it sees a change proceed to processSingleFile
     *
     * @param sql   SQLiteRuleRepository
     * @param mover FileMover
     */
    public static void watchService(SQLiteRuleRepository sql, FileMover mover) {
        List<Rule> rules = sql.findAll();
        List<String> startLocations = sql.findAllGlobalPaths().startLocationsGlobal();

        try {
            WatchService watcher = FileSystems.getDefault().newWatchService();

            // watch out all Files in the global Position
            for (String startLocation : startLocations) {
                Path path = Paths.get(startLocation);
                path.register(watcher, StandardWatchEventKinds.ENTRY_CREATE);
            }

            // watch out for specific rules location
            for (Rule rule : rules) {
                if (rule.startLocation() == null || rule.startLocation().isEmpty()) {
                    continue;
                }
                for (String startLocation : rule.startLocation()) {
                    Path path = Paths.get(startLocation);
                    path.register(watcher, StandardWatchEventKinds.ENTRY_CREATE);
                }
            }

            IO.println("Watcher is active.");

            while (!Thread.currentThread().isInterrupted()) {
                WatchKey key = watcher.take();
                Path dir = (Path) key.watchable();

                for (WatchEvent<?> event : key.pollEvents()) {
                    Path file = (Path) event.context();
                    Path finishFile = dir.resolve(file.getFileName());

                    processSingleFile(finishFile.toFile(), rules, mover, startLocations);
                }
                boolean valid = key.reset();
                if (!valid) {
                    System.err.println("WatchKey is no longer valid.");
                    break;
                }
            }

        } catch (IOException | InterruptedException e) {
            System.err.println("Watcher interrupted: " + e.getMessage());
            Thread.currentThread().interrupt();
        }

    }
}
