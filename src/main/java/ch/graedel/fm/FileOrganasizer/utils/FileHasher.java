package ch.graedel.fm.FileOrganasizer.utils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class FileHasher {
    /**
     * Compare two files based of their hashes
     *
     * @param file1 first file
     * @param file2 second file
     * @return true: it's the same file; false: different file
     */
    public boolean compareFiles(Path file1, Path file2) {
        try {
            byte[] hash1 = calculateHash(file1);
            byte[] hash2 = calculateHash(file2);

            return Arrays.equals(hash1, hash2);
        } catch (Exception e) {
            System.err.println("Error while calculating hashes for " + file1 + " and " + file2 + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Create the hash
     *
     * @param path the file
     * @return return the hashes
     * @throws IOException              Error
     * @throws NoSuchAlgorithmException Error
     */
    private byte[] calculateHash(Path path) throws IOException, NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");

        try (InputStream is = Files.newInputStream(path)) {
            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = is.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }
        }
        return digest.digest();
    }
}
