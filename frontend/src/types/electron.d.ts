export interface ElectronAPI {
    backendPort: string;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}