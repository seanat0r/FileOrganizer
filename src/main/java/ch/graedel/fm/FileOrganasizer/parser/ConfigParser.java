package ch.graedel.fm.FileOrganasizer.parser;

import ch.graedel.fm.FileOrganasizer.model.AppConfig;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;

/**
 * Prase the config.json file
 */
public class ConfigParser {
    String homeDir = System.getProperty("user.home");
    private final String PATH = homeDir + File.separator + ".fileorganizer" + File.separator + "config.json";
    private AppConfig config;

    /**
     * Create in the $HOME Directory a private Directory to store the config.json
     *
     * @throws URISyntaxException An Error
     */
    public ConfigParser() throws URISyntaxException {
        File configFile = new File(PATH);
        File configDir = configFile.getParentFile();


        if (!configDir.exists()) {
            if (!configDir.mkdirs()) {
                throw new RuntimeException("Could not create directory: " + configDir.getAbsolutePath());
            }
        }

        if (!configFile.exists()) {
            try {
                InputStream in = getClass().getResourceAsStream("/config.json");
                assert in != null;
                Files.copy(in, configFile.toPath());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        parseJSON();
    }

    /**
     * parses from the PATH the JSON file into the AppConfig config variable.
     */
    private synchronized void parseJSON() {
        try {
            // create Class to read the JSON file
            ObjectMapper objectMapper = new ObjectMapper();

            // parses the JSON and  parse it to the records
            config = objectMapper.readValue(new File(PATH), AppConfig.class);

        } catch (IOException e) {
            System.err.println("Error reading config.json: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    /**
     * Get the config from the JSON file as a Rule
     *
     * @return get the JSON rule
     */
//    public List<Rule> getRules() {
//        return this.config.rules();
//    }

    /**
     * Get the config.json
     *
     * @return returns config.json
     */
    public AppConfig getConfig() {
        return this.config;
    }

    /**
     * Reread the config.json (updating it)
     */
    public synchronized void reloadConfig() {
        parseJSON();
        IO.println("Reloading configuration");
    }
}
