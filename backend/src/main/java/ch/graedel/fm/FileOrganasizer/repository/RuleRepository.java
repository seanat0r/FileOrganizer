package ch.graedel.fm.FileOrganasizer.repository;

import ch.graedel.fm.FileOrganasizer.model.AppConfig;
import ch.graedel.fm.FileOrganasizer.model.Rule;

import java.util.List;
import java.util.Optional;

public interface RuleRepository {

    // RULES
    void add(Rule rule);

    void delete(Long id);

    void removeAllRules();

    List<Rule> findAll();

    Optional<Rule> findById(Long id);

    Optional<Rule> findByName(String name);

    // GLOBAL PATHS
    void addGlobalPath(String path);

    void removeGlobalPath(Long id);

    void removeAllGlobalPaths();

    AppConfig findAllGlobalPaths();
}