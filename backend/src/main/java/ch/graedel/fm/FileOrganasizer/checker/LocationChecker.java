package ch.graedel.fm.FileOrganasizer.checker;

import ch.graedel.fm.FileOrganasizer.model.Rule;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class LocationChecker extends FileChecker {
    private final List<String> globalLocations;

    public LocationChecker(Rule rule, List<String> globalLocations) {
        super(rule);
        this.globalLocations = globalLocations;
    }

    /**
     * Checks if the file in the right start location. Checks Global and rule specific. Rule specific wins!
     *
     * @param file file name to check
     * @return true the file is in the right location. false when NOT in the right location.
     */
    @Override
    public boolean check(File file) {
        Path currentDir = file.getParentFile().toPath().toAbsolutePath();


        if (rule.startLocation() != null && !rule.startLocation().isEmpty()) {
            for (String specificPath : rule.startLocation()) {
                Path specificDir = Paths.get(specificPath).toAbsolutePath();
                if (specificDir.equals(currentDir)) {
                    return true;
                }
            }
            return false;
        }

        for (String globalLocation : globalLocations) {
            Path globalDir = Paths.get(globalLocation).toAbsolutePath();
            if (globalDir.equals(currentDir)) {
                return true;
            }
        }
        return false;
    }
}
