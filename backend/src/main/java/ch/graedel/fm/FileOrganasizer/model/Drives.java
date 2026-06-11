package ch.graedel.fm.FileOrganasizer.model;

/**
 * Drive space
 *
 * @param driveName  drive name
 * @param totalSpace total space of the drive in bytes
 * @param freeSpace  free space of the drive in bytes
 * @param inUseSpace in use of the dive in bytes
 */
public record Drives(
        String driveName,
        long totalSpace,
        long freeSpace,
        long inUseSpace
) {
}
