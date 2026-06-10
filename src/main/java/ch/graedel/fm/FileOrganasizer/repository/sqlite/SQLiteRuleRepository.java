package ch.graedel.fm.FileOrganasizer.repository.sqlite;

import ch.graedel.fm.FileOrganasizer.model.AppConfig;
import ch.graedel.fm.FileOrganasizer.model.Rule;
import ch.graedel.fm.FileOrganasizer.repository.RuleRepository;
import ch.graedel.fm.FileOrganasizer.utils.DatabaseManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class SQLiteRuleRepository implements RuleRepository {

    /**
     * The hash in the Rule record is a boolean and the in the sql an int, we need to change that.
     *
     * @param hash the boolean
     * @return return 1 or 0 for true/false.
     */
    private int changeHashValue(boolean hash) {
        if (hash) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * SQLite cannot save array. We seperate each value with a "," and convert it to a String
     *
     * @param list Those List in the rules
     * @return The List as an array, comma separated
     */
    private String listToString(List<String> list) {
        return String.join(",", list);
    }

    /**
     * SQLite safe our List in String, so we need to convert back to a List.
     *
     * @param string The string from the query
     * @return A list
     */
    private List<String> stringToList(String string) {
        if (string == null || string.isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(string.split(", ")));
    }

    /**
     * Create a Rule record.
     *
     * @param query from the SELECT
     * @return a rule
     * @throws SQLException error
     */
    private Rule queryToRule(ResultSet query) throws SQLException {
        return new Rule(
                query.getLong("id"),
                query.getString("rule_name"),
                stringToList(query.getString("start_location")),
                query.getString("exact_name"),
                stringToList(query.getString("extension")),
                query.getString("name_contains"),
                query.getString("destination_path"),
                query.getString("same_name"),
                query.getInt("hash") == 1  //set 1 to true, 0 to false
        );
    }

    /**
     * Add a new rule in the db. It's safe the RULE record
     *
     * @param rule The Rule record.
     */
    @Override
    public void add(Rule rule) {
        if (rule == null) throw new NullPointerException("rule can't be null");
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            int sqlHash = changeHashValue(rule.hash());
            String sqlStartLocation = listToString(rule.startLocation());
            String sqlExtension = listToString(rule.extensions());

            String sql =
                    """
                            INSERT INTO RULES ( rule_name, start_location, exact_name, extension, destination_path, same_name, deep_content_check)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                            """;

            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setString(1, rule.ruleName());
            statement.setString(2, sqlStartLocation);
            statement.setString(3, rule.name());
            statement.setString(4, sqlExtension);
            statement.setString(5, rule.destination());
            statement.setString(6, rule.sameName());
            statement.setInt(7, sqlHash);
            statement.execute();
        } catch (SQLException e) {
            throw new RuntimeException("Could not save rule", e);
        }
    }

    /**
     * Deleted a rule. It deletes a Rule record
     *
     * @param id The ID from Rule
     */
    @Override
    public void delete(Long id) {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("id must be non-negative");
            }

            String sql = """
                    DELETE FROM RULES
                    WHERE id = ?;
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setLong(1, id);
            int affectedRows = statement.executeUpdate();

            if (affectedRows == 0) {
                throw new RuntimeException("Could not delete rule: " + id);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Could not delete rule with id: " + id, e);
        }

    }

    /**
     * WARNING IT DELETES ALL DATA ON THE DATABASE!
     */
    public void removeAllRules() {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            conn.createStatement().execute("DELETE FROM rules");
        } catch (SQLException e) {
            throw new RuntimeException("Could not clear rules", e);
        }
    }

    /**
     * Select all Items in the Database. Rule table.
     *
     * @return A list of Rule
     */
    @Override
    public List<Rule> findAll() {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            List<Rule> rules = new ArrayList<>();
            String sql = """
                            SELECT *
                            FROM RULES
                            ORDER BY rule_name;
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {

                rules.add(queryToRule(resultSet));
            }

            return rules;
        } catch (SQLException e) {
            throw new RuntimeException("Could not get all rules", e);
        }
    }

    /**
     * Find specific rule with the id.
     *
     * @param id the long value to search
     * @return a rule or nothing if it's not exits
     */
    @Override
    public Optional<Rule> findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("id must be non-negative");
        }
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql = """
                            SELECT *
                            FROM RULES
                            WHERE id = ?;
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setLong(1, id);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {

                return Optional.of(queryToRule(resultSet));
            }

            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("Could not get all rules", e);
        }
    }

    /**
     * Search the database for the name of the Rule
     *
     * @param name Rule Name to search
     * @return a Rule.
     */
    @Override
    public Optional<Rule> findByName(String name) {
        if (name == null || name.isEmpty()) throw new IllegalArgumentException("name must not be empty");

        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql = """
                                    SELECT *
                                    FROM RULES
                                    WHERE rule_name = ?
                                    ORDER BY rule_name;
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setString(1, name);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return Optional.of(queryToRule(resultSet));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("Could not get the rule by name.", e);
        }
    }

    /*
    ========================
           GLOBAL PATH
    ========================
     */

    /**
     * Add a new global path
     *
     * @param path the path to add.
     */
    @Override
    public void addGlobalPath(String path) {
        if (path == null || path.isEmpty()) throw new IllegalArgumentException("path must not be empty");

        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql = """
                                        INSERT INTO global_paths (path)
                                        VALUES (?);
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setString(1, path);
            statement.execute();

        } catch (SQLException e) {
            throw new RuntimeException("Could not add global path. " + path + e);
        }
    }

    /**
     * Remove a global Path which it's ID
     *
     * @param id the global Path to remove
     */
    @Override
    public void removeGlobalPath(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("id must be non-negative");
        }

        try (Connection conn = DatabaseManager.getDatabaseConnection()) {


            String sql = """
                    DELETE FROM global_paths
                    WHERE id = ?;
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setLong(1, id);
            int affectedRows = statement.executeUpdate();

            if (affectedRows == 0) {
                throw new RuntimeException("Could not delete rule: " + id);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Could not remove global path with id: " + id, e);
        }
    }

    /**
     * WARNING IT DELETES ALL DATA ON THE DATABASE!
     */
    public void removeAllGlobalPaths() {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            conn.createStatement().execute("DELETE FROM global_paths");
        } catch (SQLException e) {
            throw new RuntimeException("Could not clear global paths", e);
        }
    }

    /**
     * Get all the Global path
     *
     * @return returns the list of the global Path
     */
    @Override
    public AppConfig findAllGlobalPaths() {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            List<String> paths = new ArrayList<>();

            String sql = """
                    SELECT path
                    FROM global_paths
                    ORDER BY path
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                paths.add(resultSet.getString("path"));
            }

            return new AppConfig(0L, paths);
        } catch (SQLException e) {
            throw new RuntimeException("Could not get global paths.", e);
        }
    }
}
