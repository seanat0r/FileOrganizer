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

export interface AppConfig {
    id?: number
    startLocationsGlobal: string[],
}

export interface AppResponse {
    rules: Rule[],
    globalPaths: AppConfig,
}

export interface Log {
    id?: number,
    timestamp: string,
    ruleName: string,
    message: string,
    type: "SUCCESS" | "ERROR" | "INFO" | "SKIP" | "WARNING"
}