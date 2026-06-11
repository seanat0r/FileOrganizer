package ch.graedel.fm.FileOrganasizer.checker;

import ch.graedel.fm.FileOrganasizer.model.Rule;

import java.io.File;


public class NameContainsChecker extends FileChecker {

    public NameContainsChecker(Rule rule) {
        super(rule);
    }

    /**
     * Checks if the given Rule has the String in the name.<br/>
     * Rule says contains "abc": <br/>
     * filename: imCoolabc --> true! <br/>
     * filename: abcimCool --> true! <br/>
     * filename: imabcCool --> true! <br/>
     * filename: aimbCoolc --> FALSE
     *
     * @param file file name to check
     * @return
     */
    @Override
    public boolean check(File file) {
        if (rule.nameContains() == null || rule.nameContains().isEmpty()) {
            return true;
        }

        String name = file.getName();

        return name.contains(rule.nameContains());
    }
}
