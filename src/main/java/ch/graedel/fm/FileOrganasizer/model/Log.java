package ch.graedel.fm.FileOrganasizer.model;

import java.time.LocalDateTime;

/**
 * Log record to store one log
 *
 * @param timestamp time and date (LocalDateTime)
 * @param ruleName  which rule is affected (String)
 * @param message   the message, what happens? (String)
 * @param type      the type of the log. (enum: Logtype)
 */
public record Log(
        LocalDateTime timestamp,
        String ruleName,
        String message,
        Logtype type
) {
}
