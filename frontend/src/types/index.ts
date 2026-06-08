export interface Rule {
    startLocation: string[],
    name: string,
    extensions: string[],
    nameContains: string,
    destination: string,
    sameName: string,
    hash: boolean,
}

export interface AppConfig {
    startLocationsGlobal: string[],
    rules: Rule[],
}
