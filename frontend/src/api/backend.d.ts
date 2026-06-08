import type { AppConfig } from "../types";
export interface BackendStatus {
    running: boolean;
    message: string;
}
/**
 * Get the Status for the Server in JSON Format.<br>
 * @return {<br>
 * running: Is the Server Running? True yes, False no <br>
 * message: String message.
 * <br>}
 */
export declare const getStatus: () => Promise<BackendStatus>;
/**
 * Get the config from the Server, the config.json file, where the rules are.
 * @return the config.json
 */
export declare const getConfig: () => Promise<AppConfig>;
/**
 * Starts the Backend.
 * @return true its succeed. Otherwise false
 */
export declare const startBackend: () => Promise<boolean>;
/**
 * Stops the server.
 * @return true it's stopped. False error occurred.
 */
export declare const stopBackend: () => Promise<boolean>;
/**
 * Post the new rules for the config.json
 * @param AppConfig the new rules.
 * @return true succeed sending the new config.json.
 */
export declare const postNewConfig: (AppConfig: AppConfig) => Promise<boolean>;
export declare const getLogs: () => Promise<string[]>;
