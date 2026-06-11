/**
 * @param id db
 * @param ruleName Name of the rule
 * @param startLocation where the watcher is searching for files
 * @param name (RULE!) does it have the exact same name?
 * @param extensions A string of extension, without a dot!
 * @param nameContains does the word has in the file name?
 * @param destination WHERE the files goes.
 * @param sameName what to do, when two files has the same name? ignore: nothing, rename: rename me (this file)
 * @param hash using hash to check if the file is same.
 */
export interface Rule {
    id?: number,
    ruleName: string,
    startLocation: string[],
    name: string,
    extensions: string[],
    nameContains: string,
    destination: string,
    sameName: string,
    hash: boolean,
}

/**
 * Global Path! No config here
 * @param id db
 * @param startLocationsGlobal The global path for every Rule where to start
 */
export interface AppConfig {
    id?: number
    startLocationsGlobal: string[],
}

/**
 * The response from the backend
 * @param Rule[] a array full of a Rule
 * @param globalPaths the misleading AppConfig (global paths)
 */
export interface AppResponse {
    rules: Rule[],
    globalPaths: AppConfig,
}

/**
 * Log interface
 * @param id db
 * @param timestamp timestamp of the log
 * @param ruleName the broadly type of the log, where happens
 * @param message detailed description of it
 * @param type can be SUCCESS, ERROR, INFO, SKIP, WARNING - the type of the log
 */
export interface Log {
    id?: number,
    timestamp: string,
    ruleName: string,
    message: string,
    type: "SUCCESS" | "ERROR" | "INFO" | "SKIP" | "WARNING"
}