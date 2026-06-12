import {useEffect, useState} from "react";
import {getStatus, startBackend, stopBackend} from "../../api/backend.ts";
import {LiveLog} from "./LiveLog.tsx";
import {SystemMonitoring} from "./SystemMonitoring.tsx";

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
        // Hier ist deine Breitenberechnung eingebaut (greift ab Desktop-Grösse)
        <div className="flex flex-col gap-6 min-w-0 w-full lg:w-screen">
            <section className="bg-bg-surface border border-border rounded-xl p-6 shadow-md min-w-0">
                <div className="border-b border-border pb-4 mb-6">
                    <h2 className="text-l sm:text-2xl font-bold ml-9 text-text-primary truncate">Server Control
                        Panel</h2>
                </div>

                <div
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-xl border mb-6 min-w-0 ${isServerRunning ? "bg-status-online/10 border-status-online/30" : "bg-status-offline/10 border-status-offline/30"}`}>
                    <div
                        className={`flex items-center justify-center h-14 w-14 rounded-full font-bold text-3xl shrink-0 ${isServerRunning ? "bg-status-online text-bg-base" : "bg-status-offline text-bg-base"}`}>
                        {isServerRunning ? "✓" : "✕"}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h2 className={`text-lg sm:text-xl font-bold truncate ${isServerRunning ? "text-status-online" : "text-status-offline"}`}>
                            {isServerRunning ? "System Online" : "System Offline"}
                        </h2>
                        <span className="text-sm sm:text-base text-text-secondary break-words mt-1">
                        {isServerRunning ? "File monitoring is actively running in the background." : "All background services are currently stopped."}
                    </span>
                    </div>
                </div>

                <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-text-secondary uppercase tracking-wider mb-4 truncate">Power
                        Controls</h3>
                    <button
                        className={`w-full py-4 px-6 rounded-lg font-bold text-base transition-all border min-w-0 truncate
                    ${isServerRunning
                            ? 'bg-status-offline/10 border-status-offline/30 text-status-offline hover:bg-status-offline/20'
                            : 'bg-status-online/10 border-status-online/30 text-status-online hover:bg-status-online/20'}`}
                        onClick={isServerRunning ? handleStop : handleStart}
                    >
                        {isServerRunning ? "STOP SERVICE" : "START SERVICE"}
                    </button>
                </div>
            </section>

            <SystemMonitoring/>
            <LiveLog/>
        </div>
    );
}
