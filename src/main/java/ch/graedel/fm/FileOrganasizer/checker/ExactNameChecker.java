package ch.graedel.fm.FileOrganasizer.checker;

import ch.graedel.fm.FileOrganasizer.model.Rule;

import java.io.File;

public class ExactNameChecker extends FileChecker {
    public ExactNameChecker(Rule rule) {
        super(rule);
    }

    /**
     * Check if the rule is correct. If the rule is null or "", then the rule is not in effect.
     *
     * @param file The file to check.
     * @return True: if the rule applies or the rule is not in effect. False: if the rule does not apply.
     */
    @Override
    public boolean check(File file) {
        if (rule.name() == null || rule.name().isEmpty()) {
            return true;
        }
        String fileName = file.getName();

        int dotIndex = fileName.lastIndexOf('.');

        if (dotIndex > 0) {
            fileName = fileName.substring(0, dotIndex);
        }

        return fileName.equals(rule.name());
    }
}
