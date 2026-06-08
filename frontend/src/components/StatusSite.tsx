import {useEffect, useState} from "react";
import {getStatus, startBackend, stopBackend} from "../api/backend.ts";
import {LiveLog} from "./LiveLog.tsx";

export function StatusSite() {
    const [isServerRunning, setIsServerRunning] = useState<boolean>(false);

    useEffect(() => {
        const checkInitialStatus = async () => {
            try {
                const currentServer = await getStatus();
                setIsServerRunning(currentServer.running);
            } catch (error) {
                console.error(error);
                setIsServerRunning(false);
            }
        };
        void checkInitialStatus();
    }, []);

    const handleStart = async () => {
        const success = await startBackend();
        setIsServerRunning(success);
    };

    const handleStop = async () => {
        const success = await stopBackend();
        setIsServerRunning(!success);
    };

    return (
        <div className="status-page-layout">
            <section className="status-control card">
                <div className="card-header">
                    <h2>Server Control Panel</h2>
                </div>

                <div className={`prominent-status-box ${isServerRunning ? "is-online" : "is-offline"}`}>
                    <div className="status-icon">
                        {isServerRunning ? "✓" : "✕"}
                    </div>
                    <div className="status-details">
                        <h2 className="status-title">
                            {isServerRunning ? "System Online" : "System Offline"}
                        </h2>
                        <span className="status-subtitle">
                            {isServerRunning ? "File monitoring is actively running in the background." : "All background services are currently stopped."}
                        </span>
                    </div>
                </div>

                <div className="unified-controls">
                    <h3 className="controls-heading">Power Controls</h3>
                    <div className="massive-button-container">
                        <button className="btn-massive btn-start" onClick={handleStart} disabled={isServerRunning}>
                            START SERVICE
                        </button>
                        <button className="btn-massive btn-stop" onClick={handleStop} disabled={!isServerRunning}>
                            STOP SERVICE
                        </button>
                    </div>
                </div>
            </section>

            <LiveLog/>
        </div>
    );
}
