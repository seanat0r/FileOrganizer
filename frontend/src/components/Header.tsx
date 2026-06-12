import {type BackendStatus, getStatus} from "../api/backend.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {Aside} from "./Aside.tsx";

export function Header() {
    const [status, setStatus] = useState<BackendStatus>({
        running: false,
        message: "Loading...",
    });
    const [isOpen, setIsOpen] = useState<boolean>(false);


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

    const toggleMenu = () => {
        setIsOpen(!isOpen);

    }

    return (
        <>
            <Aside isOpen={isOpen}/>
            <div className="sticky top-0 z-50">
                {/* h-20 gibt dem Header eine feste Höhe. flex und items-center zentrieren alles perfekt vertikal. */}
                <header className="relative w-full h-20 flex items-center px-6 md:px-8">

                    <button
                        onClick={toggleMenu}
                        // 'fixed' und 'absolute' wurden hier entfernt.
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5
                        cursor-pointer bg-bg-base border border-border rounded-xl transition-all duration-200 hover:bg-bg-hover"
                        aria-label="Menü umschalten">

                        <span className={`block w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out 
                        ${isOpen ? 'rotate-45 translate-y-2 bg-accent-blue' : 'bg-text-primary'}`}/>

                        <span className={`block w-6 h-0.5 bg-text-primary rounded-full transition-all duration-300 ease-in-out 
                         ${isOpen ? 'opacity-0 translate-x-3' : ''}`}/>

                        <span className={`block w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out 
                        ${isOpen ? '-rotate-45 -translate-y-2 bg-accent-blue' : 'bg-text-primary'}`}/>
                    </button>

                    <button
                        // 'absolute', 'top-5' und 'right-8' wurden entfernt.
                        // 'ml-auto' schiebt den Button stattdessen konsequent nach rechts.
                        className={`ml-auto flex items-center gap-2 border border-border-DEFAULT bg-bg-base text-text-secondary 
                        px-4 py-2 rounded-[20px] text-sm font-semibold transition-all duration-200 min-h-11
                        hover:bg-bg-surface-hover hover:text-text-primary
                        ${status.running ? 'border-border shadow-2xl' : 'border-border shadow-2xl'}`}
                        onClick={loadStatus}
                    >
                        <span
                            className={`w-2.5 h-2.5 rounded-full animate-pulse-glow ${status.running ? 'bg-status-online' : 'bg-status-offline'}`}
                            style={{
                                '--glow-color': status.running
                                    ? 'var(--color-status-online)'
                                    : 'var(--color-status-offline)'
                            } as React.CSSProperties}></span>
                        {status.running ? "Online" : "Offline"}
                    </button>
                </header>
            </div>
        </>
    );
}