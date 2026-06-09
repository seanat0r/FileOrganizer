package ch.graedel.fm.FileOrganasizer.repository;

import ch.graedel.fm.FileOrganasizer.model.Rule;

public interface RuleRepository {
    void addRule(Rule rule);

    void removeRule(Rule rule);

    void updateRule(Rule rule);
}
