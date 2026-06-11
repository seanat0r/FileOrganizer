package ch.graedel.fm.FileOrganasizer.model;

import java.util.List;

/**
 * System Stats
 *
 * @param totalRAM total RAM (Bytes)
 * @param freeRAM  free RAM, not in use (Bytes)
 * @param usedRAM  used RAM from the programm (Bytes)
 * @param cpuLoad  Misses the load of the cpu
 * @param drives   holds all the Drive Information in Record Drives
 */
public record SystemStatus(
        long totalRAM,
        long freeRAM,
        long usedRAM,
        double cpuLoad,
        List<Drives> drives
) {
}
