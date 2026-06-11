package ch.graedel.fm.FileOrganasizer.repository.sqlite;

import ch.graedel.fm.FileOrganasizer.model.Log;
import ch.graedel.fm.FileOrganasizer.model.Logtype;
import ch.graedel.fm.FileOrganasizer.repository.LogRepository;
import ch.graedel.fm.FileOrganasizer.utils.DatabaseManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SQLiteLogRepository implements LogRepository {

    /**
     * Add a Log. If more than 50 log exists, remove the last log.
     *
     * @param log The log to save
     */
    @Override
    public void addLog(Log log) {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql_add = """
                    INSERT INTO logs (rule_name, message, status)
                    VALUES (?, ?, ?)
                    """;

            PreparedStatement statement_add = conn.prepareStatement(sql_add);
            statement_add.setString(1, log.ruleName());
            statement_add.setString(2, log.message());
            statement_add.setString(3, log.type().toString());

            statement_add.execute();

        } catch (SQLException e) {
            throw new RuntimeException("Could not save the log: " + e);
        }
    }

    /**
     * Remove the first log
     * 1 Log, 2 Log , 3 Log, ...
     * Removes Log 1
     */
    @Override
    public void removeFirstLog() {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql = """
                            DELETE FROM logs
                            WHERE id IN (
                                SELECT id
                                FROM logs
                                ORDER BY timestamp
                                LIMIT 1
                            );
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            int affected = statement.executeUpdate();
            if (affected == 0) {
                throw new RuntimeException("Could not delete the first log");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Could not delete: " + e);
        }
    }

    /**
     * <strong>WARNING DELETES ALL LOGS!</strong>
     */
    @Override
    public void removeAllLogs() {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql = "DELETE FROM logs";

            PreparedStatement statement = conn.prepareStatement(sql);
            statement.execute();

        } catch (SQLException e) {
            throw new RuntimeException("Could not delete: " + e);
        }
    }

    /**
     * Returns all Log
     *
     * @return Log
     */
    @Override
    public List<Log> getAllLogs() {
        List<Log> logs = new ArrayList<>();
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql = """
                    SELECT *
                    FROM logs
                    ORDER BY timestamp;
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                logs.add(new Log(
                        resultSet.getLong("id"),
                        resultSet.getTimestamp("timestamp").toLocalDateTime(),
                        resultSet.getString("rule_name"),
                        resultSet.getString("message"),
                        Logtype.valueOf(resultSet.getString("status").toUpperCase())
                ));
            }

            return logs;

        } catch (SQLException e) {
            throw new RuntimeException("Could not get all logs: " + e);
        }
    }

    @Override
    public void cleanup(int limit) {
        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            String sql = """
                                DELETE FROM logs
                                WHERE id <= (
                                    SELECT id
                                    FROM logs
                                    ORDER BY timestamp DESC
                                    LIMIT 1
                                    OFFSET ?
                                );
                    """;
            PreparedStatement statement = conn.prepareStatement(sql);
            statement.setInt(1, limit);

            statement.execute();

        } catch (SQLException e) {
            throw new RuntimeException("Could not cleanup: " + e);
        }
    }
}
