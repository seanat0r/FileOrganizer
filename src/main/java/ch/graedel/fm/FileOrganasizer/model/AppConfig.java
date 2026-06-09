package ch.graedel.fm.FileOrganasizer.model;

import java.util.List;

/**
 * Config.json structure. Level 1
 *
 * @param startLocationsGlobal Global Path for all rule*
 * @param rules                The rule when and where to move
 */
public record AppConfig(
        Long id,
        List<String> startLocationsGlobal,
        List<Rule> rules
) {
}
