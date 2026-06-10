package ch.graedel.fm.FileOrganasizer.api;

import ch.graedel.fm.FileOrganasizer.Main;
import ch.graedel.fm.FileOrganasizer.model.AppResponse;
import ch.graedel.fm.FileOrganasizer.model.Log;
import ch.graedel.fm.FileOrganasizer.model.Logtype;
import ch.graedel.fm.FileOrganasizer.model.Rule;
import ch.graedel.fm.FileOrganasizer.mover.FileMover;
import ch.graedel.fm.FileOrganasizer.repository.sqlite.SQLiteLogRepository;
import ch.graedel.fm.FileOrganasizer.repository.sqlite.SQLiteRuleRepository;
import io.javalin.Javalin;
import io.javalin.plugin.bundled.CorsPluginConfig;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.util.Map;

/**
 * Main API CLASS
 * Api Server for the Frontend
 */
public class ApiServer {
    /**
     * Holds the ConfigParser
     */
    private final SQLiteRuleRepository sqlRule;
    /**
     * Holds the FileMover
     */
    private final FileMover mover;

    private final SQLiteLogRepository sqlLog;

    /**
     * Holds the $HOME directory to access the file everywhere
     */
    private final String homeDir;
    /**
     * Holds the port.txt file
     */
    private final File portFile;
    /**
     * Holds the Thread
     */
    private Thread watcherThread;
    /**
     * Checks if the Watcher is running
     */
    private volatile boolean isWatcherRunning = false;

    /**
     * Constructor to start the ConfigParser and FileMover
     *
     * @param sqlRule SQLiteRuleRepository
     * @param mover   FileMover
     */
    public ApiServer(SQLiteRuleRepository sqlRule, SQLiteLogRepository sqlLog, FileMover mover) throws URISyntaxException {
        this.sqlLog = sqlLog;
        this.sqlRule = sqlRule;
        this.mover = mover;
        this.homeDir = System.getProperty("user.home");
        this.portFile = new File(homeDir + File.separator + ".fileorganizer" + File.separator + "port.txt");
    }

    /**
     * Stop the watcher
     */
    private void stopWatcher() {
        isWatcherRunning = false;
        if (watcherThread != null) {
            watcherThread.interrupt();
            watcherThread = null;
        }
    }

    /**
     * Start the watcher
     */
    private void startWatcher() {
        if (isWatcherRunning) return;
        isWatcherRunning = true;
        watcherThread = new Thread(() -> {
            Main.startProgram(sqlRule, mover);
            Main.watchService(sqlRule, mover);
        });
        watcherThread.start();

    }

    /**
     * Starts the server on port 8080<br>
     * Handles all the REST API calls
     */
    public void start() throws IOException {
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(CorsPluginConfig.CorsRule::anyHost);
            });
        }).start("127.0.0.1", 0); // OS select port on 127.0.0.1

        int port = app.port();
        System.out.println("Server running on Port: " + port);
        Files.writeString(portFile.toPath(), String.valueOf(port));

        app.get("/api/config", ctx -> {
            var rules = sqlRule.findAll();
            var path = sqlRule.findAllGlobalPaths();

            ctx.json(new AppResponse(rules, path));
        });

        // Get the status of the service
        app.get("/api/status", ctx -> {
            ctx.status(200).json(Map.of(
                    "running", isWatcherRunning,
                    "message", isWatcherRunning ? "Watcher is active" : "Watcher is sleeping"
            ));
        });

        // updating config.json
        app.post("/api/config", ctx -> {
            try {
                AppResponse newConfig = ctx.bodyAsClass(AppResponse.class);

                boolean wasRunning = isWatcherRunning;
                if (wasRunning) stopWatcher();

                // deletes All Configuration
                sqlRule.removeAllRules();
                sqlRule.removeAllGlobalPaths();

                // Add all the old and the new rules and global Paths
                for (Rule rule : newConfig.rules()) {
                    sqlRule.add(rule);
                }

                for (String path : newConfig.globalPaths().startLocationsGlobal()) {
                    sqlRule.addGlobalPath(path);
                }

                if (wasRunning) startWatcher();

                sqlLog.addLog(new Log(
                        "Config",
                        "Config reloaded successfully",
                        Logtype.SUCCESS
                ));

                ctx.status(200).result("Configuration updated and Watcher restarted!");
            } catch (Exception e) {
                System.err.println("Failed to update configuration! " + e.getMessage());
                ctx.status(500).result("Failed to update configuration! " + e.getMessage());
            }
        });

        // Start the service
        app.post("/api/watcher/start", ctx -> {
            if (isWatcherRunning) {
                ctx.status(400).result("Watcher is already running!");
                return;
            }
            sqlLog.addLog(new Log(
                    "Server",
                    "Service is starting",
                    Logtype.INFO
            ));

            startWatcher();

            ctx.status(200).result("Started watcher!");
        });

        // Stop the Service
        app.post("/api/watcher/stop", ctx -> {
            if (!isWatcherRunning) {
                ctx.status(400).result("Watcher is not running!");
                return;
            }

            sqlLog.addLog(new Log(
                    "Server",
                    "Service is stopping",
                    Logtype.INFO
            ));

            stopWatcher();

            ctx.status(200).result("Watcher stopped!");
        });

        // get the Logs
        app.get("/api/logs", ctx -> {
            sqlLog.cleanup(50);
            ctx.status(200).json(sqlLog.getAllLogs());
        });
    }
}
