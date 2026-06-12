import {useEffect, useRef, useState} from "react";
import {getLogs} from "../../api/backend.ts";
import type {Log} from "../../types";

export function LiveLog() {
    const [logs, setLogs] = useState<Log[]>([]);

    const logsRef = useRef<Log[]>([]);
    const endOfLogRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
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
        <section
            className="bg-bg-surface border border-border rounded-xl shadow-md flex flex-col min-w-0 overflow-hidden max-h-[500px] sm:max-h-[600px] w-full">
            <div className="p-5 border-b border-border bg-bg-surface shrink-0">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary truncate">Activity Logs</h2>
            </div>

            <div className="p-3 sm:p-5 bg-bg-base overflow-y-auto flex-1 min-w-0">
                <ul className="flex flex-col gap-3">
                    {logs.length === 0 ? (
                        <li className="text-center text-text-secondary italic py-8 text-base">Wait for system
                            events...</li>
                    ) : (
                        logs.map((log, index) => {
                            let logClass = "border-border text-text-secondary";

                            if (log.type === ("ERROR")) {
                                logClass = "border-log-error text-log-error";
                            } else if (log.type === ("SUCCESS")) {
                                logClass = "border-log-success text-log-success";
                            } else if (log.type === ("INFO")) {
                                logClass = "border-log-info text-log-info";
                            } else if (log.type === ("SKIP")) {
                                logClass = "border-log-skip text-log-skip";
                            } else if (log.type === ("WARNING")) {
                                logClass = "border-log-warning text-log-warning";
                            }

                            return (
                                <li key={index}
                                    className={`flex flex-col xl:flex-row xl:items-start gap-2 xl:gap-4 p-4 border-l-4 bg-bg-surface rounded-r-lg text-sm sm:text-base min-w-0 transition-colors hover:bg-bg-hover ${logClass}`}>

                                    <div
                                        className="flex flex-row items-center gap-3 xl:flex-col xl:items-start xl:gap-2 shrink-0">
                                        <span
                                            className="opacity-75 whitespace-nowrap">{new Date(log.timestamp).toLocaleString('de-CH')}</span>
                                        <span
                                            className="font-bold border border-current px-2 py-1 rounded text-xs sm:text-sm tracking-wider shrink-0">{log.type}</span>
                                    </div>

                                    <div
                                        className="flex-1 min-w-0 mt-2 xl:mt-0 break-all sm:break-words leading-relaxed">
                                        <span className="font-semibold text-text-primary">{log.ruleName}:</span> <span
                                        className="text-text-primary opacity-90">{log.message}</span>
                                    </div>

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