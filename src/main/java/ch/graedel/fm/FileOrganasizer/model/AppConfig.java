package ch.graedel.fm.FileOrganasizer.model;

import java.util.List;

/**
 * Config.json structure. Level 1
 *
 * @param id                   An id for the db.
 * @param startLocationsGlobal Global Path for all rule*
 *
 */
public record AppConfig(
        Long id,
        List<String> startLocationsGlobal
) {
}
