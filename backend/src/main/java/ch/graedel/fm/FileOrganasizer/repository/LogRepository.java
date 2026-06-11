package ch.graedel.fm.FileOrganasizer.repository;

import ch.graedel.fm.FileOrganasizer.model.Log;

import java.util.List;

public interface LogRepository {

    void addLog(Log Log);

    void removeFirstLog();

    void removeAllLogs();

    List<Log> getAllLogs();

    void cleanup(int limit);
}
