const port = window.electronAPI?.backendPort ?? '9999';
const BASE_URL = `http://127.0.0.1:${port}`;
console.log("Connecting to backend on port:", port);
/**
 * Get the Status for the Server in JSON Format.<br>
 * @return {<br>
 * running: Is the Server Running? True yes, False no <br>
 * message: String message.
 * <br>}
 */
export const getStatus = async () => {
    try {
        console.log("getStatus called");
        const response = await fetch(`${BASE_URL}/api/status`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Backend not reachable: " + error);
        return {
            running: false,
            message: "Backend offline"
        };
    }
};
/**
 * Get the config from the Server, the config.json file, where the rules are.
 * @return the config.json
 */
export const getConfig = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/config`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Backend not reachable: " + error);
        return {
            startLocationsGlobal: [],
            rules: [],
        };
    }
};
/**
 * Starts the Backend.
 * @return true its succeed. Otherwise false
 */
export const startBackend = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/watcher/start`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return true;
    }
    catch (error) {
        console.error("Backend not reachable: " + error);
        return false;
    }
};
/**
 * Stops the server.
 * @return true it's stopped. False error occurred.
 */
export const stopBackend = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/watcher/stop`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return true;
    }
    catch (error) {
        console.error("Backend not reachable: " + error);
        return false;
    }
};
/**
 * Post the new rules for the config.json
 * @param AppConfig the new rules.
 * @return true succeed sending the new config.json.
 */
export const postNewConfig = async (AppConfig) => {
    try {
        const response = await fetch(`${BASE_URL}/api/config`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(AppConfig),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return true;
    }
    catch (error) {
        console.error("Backend not reachable: " + error);
        return false;
    }
};
export const getLogs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/logs`);
        if (!response.ok) {
            return [];
        }
        return await response.json();
    }
    catch (error) {
        return [`> No Connection to the backend... : ${error}`];
    }
};
