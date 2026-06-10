package ch.graedel.fm.FileOrganasizer.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseManager {
    private static final String DATABASE_URL = "jdbc:sqlite:data/file_organasizer.db";

    public static void createDatabase() {
        String createRuleDatabase = """
                CREATE TABLE IF NOT EXISTS rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rule_name TEXT NOT NULL UNIQUE,
                start_location TEXT,
                exact_name TEXT,
                extension TEXT,
                destination_path TEXT NOT NULL,
                same_name TEXT NOT NULL DEFAULT 'ignore' CHECK (same_name IN ('rename', 'ignore')),
                deep_content_check INTEGER DEFAULT 0
                );
                """;

        String createGlobalPathDatabase = """
                CREATE TABLE IF NOT EXISTS global_paths (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                path TEXT UNIQUE
                );
                """;

        String createLogDatabase = """
                CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT DEFAULT (datetime('now','localtime')),
                rule_name TEXT,
                message TEXT,
                status TEXT NOT NULL DEFAULT 'INFO' CHECK (status IN ('SUCCESS', 'ERROR', 'INFO', 'SKIP', 'WARNING'))
                 );
                """;

        try (Connection conn = DatabaseManager.getDatabaseConnection()) {
            Statement stmt = conn.createStatement();
            stmt.execute(createRuleDatabase);
            stmt.execute(createGlobalPathDatabase);
            stmt.execute(createLogDatabase);
        } catch (SQLException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static Connection getDatabaseConnection() throws SQLException {
        return DriverManager.getConnection(DATABASE_URL);
    }
}
