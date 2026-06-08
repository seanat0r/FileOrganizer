package ch.graedel.fm.FileOrganasizer.checker;

import ch.graedel.fm.FileOrganasizer.model.Rule;

import java.io.File;

/**
 * Parent Class of the checker class.
 */
public abstract class FileChecker {
    /**
     * The rules from config.json
     */
    protected final Rule rule;

    public FileChecker(Rule rule) {
        this.rule = rule;
    }

    /**
     * The methode everyone needs to have!
     *
     * @param file file name to check
     * @return ture or false. true check OK. false NOT ok
     */
    public abstract boolean check(File file);

}
