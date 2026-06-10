package ch.graedel.fm.FileOrganasizer.mover;

import ch.graedel.fm.FileOrganasizer.model.Log;
import ch.graedel.fm.FileOrganasizer.model.Logtype;
import ch.graedel.fm.FileOrganasizer.model.Rule;
import ch.graedel.fm.FileOrganasizer.repository.sqlite.SQLiteLogRepository;
import ch.graedel.fm.FileOrganasizer.utils.FileHasher;
import ch.graedel.fm.FileOrganasizer.utils.shouldRename;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * Moves files
 */
public class FileMover {
    private final SQLiteLogRepository sqlLog;

    public FileMover(SQLiteLogRepository sqlLog) {
        this.sqlLog = sqlLog;
    }

    /**
     * Checks if the path exist
     *
     * @param path the path to the file destination
     */
    private void existPath(Path path) {
        try {
            if (!Files.exists(path)) {
                sqlLog.addLog(new Log(
                        "PATH",
                        "The path doesnt exist, trying to create it: " + path,
                        Logtype.INFO));
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            sqlLog.addLog(new Log(
                    "PATH",
                    "An error occurred while creating the file " + path + ": " + e.getMessage(),
                    Logtype.ERROR
            ));
            IO.println("ERROR: An error occurred while creating the file " + path + ": " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    /**
     * Rename the file where the renaming actually happens
     *
     * @param orginalPath the file to rename
     * @return the new name of the file with path!
     */
    private Path generateNewName(Path orginalPath) {
        String fileName = orginalPath.getFileName().toString();
        String nameWithoutExtension = fileName;
        String extension = "";

        int dotIndex = fileName.lastIndexOf('.');

        if (dotIndex > 0) {
            nameWithoutExtension = fileName.substring(0, dotIndex);
            extension = fileName.substring(dotIndex);
        }

        int counter = 1;
        Path newPath = orginalPath;
        Path parentDir = orginalPath.getParent();

        while (Files.exists(newPath)) {
            String newName = nameWithoutExtension + "_" + counter + extension;
            newPath = parentDir.resolve(newName);
            counter++;
        }

        return newPath;

    }

    /**
     * Main Method. Checks all things. When everything is OK, move file.
     *
     * @param fileToMove the file to move
     * @param rule       Rule class
     */
    public void moveFile(File fileToMove, Rule rule) {
        try {
            Path targetDir = Paths.get(rule.destination());

            existPath(targetDir);

            Path targetFile = targetDir.resolve(fileToMove.getName());

            shouldRename ruleSameName = new shouldRename();

            if (Files.exists(targetFile) && rule.hash()) {
                FileHasher hasher = new FileHasher();
                boolean isSameContent = hasher.compareFiles(fileToMove.toPath(), targetFile);
                if (isSameContent) {
                    sqlLog.addLog(new Log(
                            "Hash",
                            "Same Content: " + fileToMove.getName(),
                            Logtype.SKIP
                    ));
                    return;
                }
            }
            if (ruleSameName.isCheckSameName(rule, targetDir, fileToMove)) {
                targetFile = generateNewName(targetFile);

            } else if (Files.exists(targetFile)) {
                sqlLog.addLog(new Log(
                        "Same Name",
                        "File Exists",
                        Logtype.SKIP
                ));
                return;
            }

            Files.move(fileToMove.toPath(), targetFile, StandardCopyOption.REPLACE_EXISTING);
            sqlLog.addLog(new Log(
                    "Moved",
                    "The file " + fileToMove.getName() + " has been moved to " + targetFile,
                    Logtype.SUCCESS
            ));

        } catch (Exception e) {
            sqlLog.addLog(new Log(
                    "Moved",
                    "Failed to move file from: " + fileToMove.getName() + ": " + e.getMessage(),
                    Logtype.ERROR
            ));
            System.err.println("ERROR: Failed to move file from: " + fileToMove.getName() + ": " + e.getMessage());
        }
    }

}
