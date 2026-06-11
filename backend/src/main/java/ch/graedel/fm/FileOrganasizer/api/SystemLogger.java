package ch.graedel.fm.FileOrganasizer.api;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Stores Logs
 */
public class SystemLogger {
    /**
     * Location where the stores logs
     */
    public static final List<String> logs = new CopyOnWriteArrayList<>();

    /**
     * Add a new Logs. If the Logs exceed 50, delete the first one and add the new one
     *
     * @param message Log Message.
     */
    public static void addLog(String message) {
        String time = LocalTime.now().withNano(0).toString();
        String date = LocalDate.now().toString();
        logs.add(String.format(date + " - " + time + " - " + message));

        if (logs.size() > 50) {
            logs.removeFirst();
        }
    }
}
