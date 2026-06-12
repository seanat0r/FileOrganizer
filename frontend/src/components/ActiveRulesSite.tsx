import {useEffect, useState} from "react";
import type {AppConfig, Rule} from "../types";
import {getConfig} from "../api/backend.ts";
import {RuleCard} from "./RuleCard.tsx";

export function ActiveRulesSite() {

    const [config, setConfig] = useState<AppConfig>({id: 0, startLocationsGlobal: []});
    const [rules, setRules] = useState<Rule[]>([]);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const getAppResponse = await getConfig();

                setConfig(getAppResponse.globalPaths);
                setRules(getAppResponse.rules);

            } catch (error) {
                console.error("Fehler beim Laden:", error);
                setConfig({id: 0, startLocationsGlobal: []});
                setRules([]);
            }
        };
        void fetchRules();
    }, []);

    if (!config || !Array.isArray(config.startLocationsGlobal)) {
        return (
            <div className="active-rules-layout">
                <div className="loading-state">
                    <span className="loading-spinner"></span>
                    <p>Loading configuration...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-6 min-w-0 w-full">
            <header className="border-b border-border pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary truncate">Active File Management
                    Rules</h2>
                <p className="text-sm sm:text-base text-text-secondary mt-1 break-words">Overview of your current file
                    routing and filtering configurations.</p>
            </header>

            {!config ? (
                <div
                    className="flex flex-col sm:flex-row items-center justify-center p-12 bg-bg-surface border border-border rounded-xl shadow-md gap-4 min-w-0">
                    <span
                        className="animate-spin h-8 w-8 border-4 border-accent-blue border-t-transparent rounded-full shrink-0"></span>
                    <p className="text-text-secondary font-medium text-base">Loading configuration...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6 min-w-0 w-full">
                    {/* Global Source Locations Section */}
                    <section
                        className="bg-accent-hover/7 border border-accent-blue/20 rounded-xl p-5 sm:p-6 shadow-md min-w-0 w-full">
                        <div className="border-b border-border pb-3 mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary truncate">Global Source
                                Directories</h3>
                        </div>
                        <div className="min-w-0">
                            {config.startLocationsGlobal?.length > 0 ? (
                                <ul className="flex flex-col gap-3 min-w-0">
                                    {config.startLocationsGlobal?.map((location, index) => (
                                        <li key={`global-${index}`}
                                            className="flex items-center gap-3 p-3 sm:p-4 bg-bg-base border border-border rounded-lg min-w-0 w-full">
                                            <span className="text-xl shrink-0">📁</span>
                                            <span
                                                className="text-sm sm:text-base text-text-primary break-all">{location}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-text-secondary italic">No global directories defined.</p>
                            )}
                        </div>
                    </section>

                    {/* Specific Rules */}
                    <section className="min-w-0 w-full">
                        <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4 truncate">Specific Rules</h3>
                        {rules?.length === 0 ? (
                            <div
                                className="bg-bg-surface border border-border rounded-xl p-8 shadow-md text-center min-w-0">
                                <p className="text-text-secondary italic text-base">No specific rules defined yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0 w-full">
                                {rules?.map((rule, index) => (
                                    <RuleCard key={`rule-${index}`} rule={rule} index={index}/>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}