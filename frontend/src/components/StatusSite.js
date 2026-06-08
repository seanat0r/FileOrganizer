import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getStatus, startBackend, stopBackend } from "../api/backend.ts";
import { LiveLog } from "./LiveLog.tsx";
export function StatusSite() {
    const [isServerRunning, setIsServerRunning] = useState(false);
    useEffect(() => {
        const checkInitialStatus = async () => {
            try {
                const currentServer = await getStatus();
                setIsServerRunning(currentServer.running);
            }
            catch (error) {
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
    return (_jsxs("div", { className: "status-page-layout", children: [_jsxs("section", { className: "status-control card", children: [_jsx("div", { className: "card-header", children: _jsx("h2", { children: "Server Control Panel" }) }), _jsxs("div", { className: `prominent-status-box ${isServerRunning ? "is-online" : "is-offline"}`, children: [_jsx("div", { className: "status-icon", children: isServerRunning ? "✓" : "✕" }), _jsxs("div", { className: "status-details", children: [_jsx("h2", { className: "status-title", children: isServerRunning ? "System Online" : "System Offline" }), _jsx("span", { className: "status-subtitle", children: isServerRunning ? "File monitoring is actively running in the background." : "All background services are currently stopped." })] })] }), _jsxs("div", { className: "unified-controls", children: [_jsx("h3", { className: "controls-heading", children: "Power Controls" }), _jsxs("div", { className: "massive-button-container", children: [_jsx("button", { className: "btn-massive btn-start", onClick: handleStart, disabled: isServerRunning, children: "START SERVICE" }), _jsx("button", { className: "btn-massive btn-stop", onClick: handleStop, disabled: !isServerRunning, children: "STOP SERVICE" })] })] })] }), _jsx(LiveLog, {})] }));
}
