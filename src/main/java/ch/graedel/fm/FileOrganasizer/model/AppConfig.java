package ch.graedel.fm.FileOrganasizer.model;

import java.util.List;

/**
 * Config.json structure. Level 1
 *
 * @param startLocationsGlobal Global Path for all rule*
 * @param rules                The rule when and where to move
 */
public record AppConfig(
        List<String> startLocationsGlobal,
        List<Rule> rules
) {
}
