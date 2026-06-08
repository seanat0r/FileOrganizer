import {useEffect, useRef, useState} from "react";
import {getLogs} from "../api/backend.ts";

export function LiveLog() {
    const [logs, setLogs] = useState<string[]>([]);

    const logsRef = useRef<string[]>([]);
    const endOfLogRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); // Die Scroll-Box
    const isAutoScrollEnabled = useRef(true);

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
        // When logs length and our referenz same is, move display down.
        const isSame = logs.length === logsRef.current.length &&
            logs.every((log, i) => log === logsRef.current[i]);

        if (isSame) return;

        logsRef.current = logs;

        // the original logic to move down
        const container = containerRef.current;
        if (container && isAutoScrollEnabled.current) {
            endOfLogRef.current?.scrollIntoView({behavior: "smooth"});
        }
    }, [logs]);

    return (
        <section className="live-log-section card">
            <div className="card-header">
                <h2>Activity Logs</h2>
            </div>

            <div className="live-log-container">
                <ul className="live-log-list">
                    {logs.length === 0 ? (
                        <li className="log-item log-waiting">Wait for system events...</li>
                    ) : (
                        logs.map((log, index) => {
                            // Ersetzt Inline-Farben durch Klassennamen
                            let logClass = "log-default";

                            if (log.includes("ERROR")) {
                                logClass = "log-error";
                            } else if (log.includes("SUCCESS")) {
                                logClass = "log-success";
                            } else if (log.includes("INFO")) {
                                logClass = "log-info";
                            }

                            return (
                                <li key={index} className={`log-item ${logClass}`}>
                                    {log}
                                </li>
                            );
                        })
                    )}
                </ul>
                <div ref={endOfLogRef}/>
            </div>
        </section>
    );
}