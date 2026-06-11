package ch.graedel.fm.FileOrganasizer.checker;

import ch.graedel.fm.FileOrganasizer.model.Rule;

import java.io.File;

public class ExtensionChecker extends FileChecker {
    public ExtensionChecker(Rule rule) {
        super(rule);
    }

    /**
     * Check if one of the endings applies.
     *
     * @param file The file to check.
     * @return True: If it has the ending. False: If it does not have the ending.
     */
    @Override
    public boolean check(File file) {
        String fileName = file.getName();

        if (rule.extensions().isEmpty() || rule.extensions() == null) {
            return true;
        }

        for (String ext : rule.extensions()) {
            if (fileName.endsWith("." + ext)) {
                return true;
            }
        }
        return false;
    }
}
