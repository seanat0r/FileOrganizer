import {type BackendStatus, getStatus} from "../api/backend.ts";
import {Navigation} from "./Navigation.tsx";
import {useEffect, useState} from "react";

export function Header() {
    const [status, setStatus] = useState<BackendStatus>({
        running: false,
        message: "Loading...",
    });

    const loadStatus = async () => {
        const currentStatus = await getStatus();
        setStatus(currentStatus);
    };

    useEffect(() => {
        let active = true;
        const fetchStatus = async () => {
            const currentStatus = await getStatus();
            if (active) {
                setStatus(currentStatus);
            }
        };
        void fetchStatus();
        const IntervalId = setInterval(fetchStatus, 2000);

        return () => {
            active = false;
            clearInterval(IntervalId);
        };
    }, []);

    return (
        <header className="app-header">
            <div className="header-brand">
                <h1>File Organizer</h1>
            </div>

            <Navigation/>

            <div className="header-actions">
                <button
                    className={`status-badge ${status.running ? 'online' : 'offline'}`}
                    onClick={loadStatus}
                    title="Click to refresh status"
                >
                    <span className="status-dot"></span>
                    {status.running ? "Online" : "Offline"}
                </button>
            </div>
        </header>
    );
}