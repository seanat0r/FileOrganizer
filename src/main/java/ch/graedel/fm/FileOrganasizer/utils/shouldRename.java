package ch.graedel.fm.FileOrganasizer.utils;

import ch.graedel.fm.FileOrganasizer.model.Rule;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

public class shouldRename {
    /**
     * Do we need to change the Name, when the name already exist?
     *
     * @param rule       the JSON config file
     * @param targetDir  the directory
     * @param fileToMove the file
     * @return true: rename it; false: don't rename it and don't move.
     */
    public boolean isCheckSameName(Rule rule, Path targetDir, File fileToMove) {
        Path targetFile = targetDir.resolve(fileToMove.getName());


        if (!Files.exists(targetFile)) {
            return false;
        }

        String ruleToApply = rule.sameName();
        if (ruleToApply == null || ruleToApply.isEmpty()) {
            ruleToApply = "ignore";
        }

        return switch (ruleToApply) {
            case "rename" -> true;
            case "ignore" -> false;
            default -> throw new RuntimeException("Unsupported rule: " + ruleToApply);
        };
    }

}
