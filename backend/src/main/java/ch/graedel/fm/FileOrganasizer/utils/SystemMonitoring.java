package ch.graedel.fm.FileOrganasizer.utils;

import ch.graedel.fm.FileOrganasizer.model.Drives;
import ch.graedel.fm.FileOrganasizer.model.SystemStatus;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.software.os.OSFileStore;

import java.util.ArrayList;
import java.util.List;

/**
 * Collects Memory usage, CPU usage and Drive Size
 */
public class SystemMonitoring {

    /**
     * SystemInfo to get RAM data
     */
    private final SystemInfo si = new SystemInfo();
    /**
     * HardwareAbstractionLayer to get the CPU and Drives data
     */
    private final HardwareAbstractionLayer hal = si.getHardware();

    /**
     * Save the last Tick of the CPU.
     */
    private long[] prevTicks = new long[CentralProcessor.TickType.values().length];

    /**
     * Get the total memory, raw
     *
     * @return total memory
     */
    private long getTotalMemory() {
        return si.getHardware().getMemory().getTotal();
    }

    /**
     * Get the free memory
     *
     * @return free memory
     */
    private long getFreeMemory() {
        return si.getHardware().getMemory().getAvailable();
    }

    /**
     * get the used memory from total and free
     *
     * @param total total memory usage
     * @param free  free memory
     * @return current used memory
     */
    private long getUsedMemory(Long total, long free) {
        return total - free;
    }

    /**
     * Calculate the load of the CPU and return it.
     *
     * @return the load of the cpu, double
     */
    private double cpuLoad() {
        double usage = hal.getProcessor().getSystemCpuLoadBetweenTicks(prevTicks) * 100;

        prevTicks = hal.getProcessor().getSystemCpuLoadTicks();

        return usage;
    }

    /**
     * Get all the Drives Info (total, free, used and name)
     *
     * @return a List of Drives record
     */
    private List<Drives> getDrives() {
        var fileSystem = si.getOperatingSystem().getFileSystem();
        List<OSFileStore> stores = fileSystem.getFileStores();
        List<Drives> drives = new ArrayList<>();

        for (OSFileStore store : stores) {
            long total = store.getTotalSpace();
            long free = store.getFreeSpace();
            long used = total - free;

            Drives drive = new Drives(
                    store.getName(),
                    total,
                    free,
                    used
            );
            drives.add(drive);
        }
        return drives;
    }

    /**
     * Collects all SystemInfo, memory, cpu and disk space
     *
     * @return a SystemStatus
     */
    public SystemStatus getSystemInfo() {
        long totalMemory = getTotalMemory();
        long freeMemory = getFreeMemory();
        long usedMemory = getUsedMemory(totalMemory, freeMemory);
        double cpuLoad = cpuLoad();
        List<Drives> drives = getDrives();

        return new SystemStatus(
                totalMemory,
                freeMemory,
                usedMemory,
                cpuLoad,
                drives
        );
    }
}
