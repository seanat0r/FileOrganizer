import {Navigation} from "./Navigation.tsx";
import {useState} from "react";

interface AsideProps {
    isOpen: boolean;
}

export function Aside({isOpen}: AsideProps) {
    const [today] = useState(new Date());

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-bg-surface border-r border-border w-64
             p-6 pt-20 shadow-2xl transition-transform duration-300 ease-in-out 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="mb-8">
                <h1 className="text-xl font-bold text-text-primary">File Organizer</h1>
            </div>

            <div className="flex-1">
                <Navigation/>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
                <footer className="text-sm text-text-secondary">
                    <p>{today.toLocaleDateString('default')}</p>
                    <p>Current Version: 1.1.23, Apache License 2.0</p>
                </footer>
            </div>
        </aside>
    );
}