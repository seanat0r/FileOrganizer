package ch.graedel.fm.FileOrganasizer.model;

import java.util.List;

/**
 * The specific rule
 *
 * @param ruleName      Name of the rule.
 * @param startLocation When in use, ignore global Directory and use this Directory.
 * @param name          Only move file with the exact same name.
 * @param extensions    like pdf, png, docx etc. Use it without a dot!
 * @param nameContains  Only move file when it contains "xxx" in the filename. Before and After!
 * @param destination   Where should it move?
 * @param sameName      Has a "rename" or "ignore" Value. When in the directory already the same file exist do rename it.
 * @param hash          Use hash to compare file. When the same hash exist (a 1 to 1 copy) don't move, if true.
 */
public record Rule(
        Long id,
        String ruleName,
        List<String> startLocation,
        String name,
        List<String> extensions,
        String nameContains,
        String destination,
        String sameName,
        boolean hash
) {
}
