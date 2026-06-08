package ch.graedel.fm.FileOrganasizer.mover;

import ch.graedel.fm.FileOrganasizer.api.SystemLogger;
import ch.graedel.fm.FileOrganasizer.model.Rule;
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
    /**
     * Checks if the path exist
     *
     * @param path the path to the file destination
     */
    private void existPath(Path path) {
        try {
            if (!Files.exists(path)) {
                SystemLogger.addLog("INFO: Path: " + path + " does not exist. Creating it.");
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            SystemLogger.addLog("ERROR: Cannot create directory: " + path + ". Reason: " + e.getMessage());
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
                    SystemLogger.addLog("SKIP (Same File Content): " + fileToMove.getName());
                    return;
                }
            }
            if (ruleSameName.isCheckSameName(rule, targetDir, fileToMove)) {
                targetFile = generateNewName(targetFile);

            } else if (Files.exists(targetFile)) {
                SystemLogger.addLog("SKIP (Conflict): " + fileToMove.getName());
                return;
            }

            Files.move(fileToMove.toPath(), targetFile, StandardCopyOption.REPLACE_EXISTING);
            SystemLogger.addLog("SUCCESS: The file " + fileToMove.getName() + " has been moved to " + targetFile);

        } catch (Exception e) {
            SystemLogger.addLog("ERROR: Failed to move file from: " + fileToMove.getName() + ": " + e.getMessage());
            System.err.println("ERROR: Failed to move file from: " + fileToMove.getName() + ": " + e.getMessage());
        }
    }

}
