import {useEffect, useState} from "react";
import type {AppConfig} from "../types";
import {getConfig} from "../api/backend.ts";
import {RuleCard} from "./RuleCard.tsx";

export function ActiveRulesSite() {
    const [config, setConfig] = useState<AppConfig>();

    useEffect(() => {
        const fetchRules = async () => {
            const currentRules = await getConfig();
            setConfig(currentRules);
        };
        void fetchRules();
    }, []);

    return (
        <div className="active-rules-layout">
            <header className="page-header">
                <h2>Active File Management Rules</h2>
                <p className="page-subtitle">Overview of your current file routing and filtering configurations.</p>
            </header>

            {!config ? (
                <div className="loading-state">
                    <span className="loading-spinner"></span>
                    <p>Loading configuration...</p>
                </div>
            ) : (
                <div className="rules-content">
                    {/* Global Source Locations Section */}
                    <section className="global-locations-card card">
                        <div className="card-header">
                            <h3>Global Source Directories</h3>
                        </div>
                        <div className="card-body">
                            {config.startLocationsGlobal.length > 0 ? (
                                <ul className="directory-list">
                                    {config.startLocationsGlobal.map((location, index) => (
                                        <li key={`global-${index}`} className="directory-item">
                                            <span className="folder-icon">📁</span>
                                            <span className="path-text">{location}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-state-text">No global directories defined.</p>
                            )}
                        </div>
                    </section>

                    {/* Specific Rules */}
                    <section className="specific-rules-section">
                        <h3 className="section-title">Specific Rules</h3>
                        {config.rules.length === 0 ? (
                            <div className="card empty-state-card">
                                <p>No specific rules defined yet.</p>
                            </div>
                        ) : (
                            <div className="rules-grid">
                                {config.rules.map((rule, index) => (
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