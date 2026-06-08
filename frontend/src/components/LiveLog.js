import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { getLogs } from "../api/backend.ts";
export function LiveLog() {
    const [logs, setLogs] = useState([]);
    const endOfLogRef = useRef(null);
    useEffect(() => {
        const fetchLogs = async () => {
            const currentLogs = await getLogs();
            setLogs(currentLogs);
        };
        void fetchLogs();
        const IntervalId = setInterval(fetchLogs, 2000);
        return () => clearInterval(IntervalId);
    }, []);
    useEffect(() => {
        endOfLogRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);
    return (_jsxs("section", { className: "live-log-section card", children: [_jsx("div", { className: "card-header", children: _jsx("h2", { children: "Activity Logs" }) }), _jsxs("div", { className: "live-log-container", children: [_jsx("ul", { className: "live-log-list", children: logs.length === 0 ? (_jsx("li", { className: "log-item log-waiting", children: "Wait for system events..." })) : (logs.map((log, index) => {
                            // Ersetzt Inline-Farben durch Klassennamen
                            let logClass = "log-default";
                            if (log.includes("ERROR")) {
                                logClass = "log-error";
                            }
                            else if (log.includes("SUCCESS")) {
                                logClass = "log-success";
                            }
                            else if (log.includes("INFO")) {
                                logClass = "log-info";
                            }
                            return (_jsx("li", { className: `log-item ${logClass}`, children: log }, index));
                        })) }), _jsx("div", { ref: endOfLogRef })] })] }));
}
