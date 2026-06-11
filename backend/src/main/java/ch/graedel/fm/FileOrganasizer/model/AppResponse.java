package ch.graedel.fm.FileOrganasizer.model;

import java.util.List;

public record AppResponse(
        List<Rule> rules,
        AppConfig globalPaths
) {
}
