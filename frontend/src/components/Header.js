import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getStatus } from "../api/backend.ts";
import { Navigation } from "./Navigation.tsx";
import { useEffect, useState } from "react";
export function Header() {
    const [status, setStatus] = useState({
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
    return (_jsxs("header", { className: "app-header", children: [_jsx("div", { className: "header-brand", children: _jsx("h1", { children: "File Organizer" }) }), _jsx(Navigation, {}), _jsx("div", { className: "header-actions", children: _jsxs("button", { className: `status-badge ${status.running ? 'online' : 'offline'}`, onClick: loadStatus, title: "Click to refresh status", children: [_jsx("span", { className: "status-dot" }), status.running ? "Online" : "Offline"] }) })] }));
}
