import type {AppConfig, Rule} from "../../types";
import {useEffect, useState} from "react";
import {ChangeGlobalPaths} from "./ChangeGlobalPaths";
import {RuleSection} from "./RuleSection";
import {getConfig, postNewConfig} from "../../api/backend.ts";

export function ChangeRulePage() {
    const [rules, setRules] = useState<Rule[]>([]);

    const [globalPaths, setGlobalPaths] = useState<string[]>([]);

    const [activeRule, setActiveRule] = useState<Rule | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await getConfig();

                setRules(config.rules);
                setGlobalPaths(config.globalPaths.startLocationsGlobal);
            } catch (error) {
                console.error(error);
            }
        }
        void fetchConfig();
    }, []);

    /**
     * Helper function to make a delay
     * @param ms Time in Milliseconds
     */
        // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // --- GLOBAL PATH LOGIC ---
        // handels deleting, editing and adding
    const handleDeleteGlobalPath = (indexToDelete: number) => {
            const newGlobalPaths = globalPaths.filter((_, index) => index !== indexToDelete);
            setGlobalPaths(newGlobalPaths);
            setHasUnsavedChanges(true);
        };

    const handleEditGlobalPath = (indexToEdit: number, newPath: string) => {
        const newGlobalPaths = globalPaths.map((path, index) =>
            index === indexToEdit ? newPath : path
        );
        setGlobalPaths(newGlobalPaths);
        setHasUnsavedChanges(true);
    };

    const handleAddGlobalPath = (newPath: string) => {
        const newGlobalPaths = [...globalPaths, newPath];
        setGlobalPaths(newGlobalPaths);
        setHasUnsavedChanges(true);
    };

    // --- RULE LOGIC ---
    // handels deleting, editing and adding
    const handleDeleteRule = (indexToDelete: number) => {
        const newRules = rules.filter((_, index) => index !== indexToDelete);
        setRules(newRules);
        setHasUnsavedChanges(true);
    };

    const handleEditRule = (indexToEdit: number, newRule: Rule) => {
        const newRules = rules.map((rule, index) =>
            index === indexToEdit ? newRule : rule
        );
        setRules(newRules);
        setHasUnsavedChanges(true);
    };

    const handleAddRule = (newRule: Rule) => {
        const newRules = [...rules, newRule];
        setRules(newRules);
        setHasUnsavedChanges(true);
    };

    const handleSelectForEdit = (indexToEdit: number) => {
        setActiveRule(rules[indexToEdit]);
    };

    const handleCancelEdit = () => {
        setActiveRule(null);
    }

    //--- SAVE LOGIC ---
    /**
     * Save all the new config configuration
     */
    const handleSaveAll = async () => {
        try {
            console.log("Sending new Config");
            const configToSave: AppConfig = {
                startLocationsGlobal: globalPaths,
            }
            console.table(configToSave);

            await postNewConfig(configToSave);
            alert("Config saved successfully.");

            setHasUnsavedChanges(false);

            /*
            // restart the server, to reload the config.json
            try {
                await stopBackend();
                await delay(2000);
                await startBackend();
            } catch (error) {
                alert("Error at reloading! Try reloading the service manually.")
                console.error("Error at restarting the backend: " + error);
            }
             */

        } catch (error) {
            alert("Error adding new Config! Is service online?");
            console.error("Failed to send new Config: " + error);
        }
    }
    return (
        <div className="change-rules-layout">
            <header className="page-header">
                <h2>Configuration & Rules Editor</h2>
                <p className="page-subtitle">Manage your global source directories and define specific routing
                    rules.</p>
            </header>

            <ChangeGlobalPaths
                globalPaths={globalPaths}
                onDeleteClick={handleDeleteGlobalPath}
                onEditClick={handleEditGlobalPath}
                onAddClick={handleAddGlobalPath}
            />

            <RuleSection
                rules={rules}
                activeRule={activeRule}
                onDeleteClick={handleDeleteRule}
                onEditSave={handleEditRule}
                onAddSave={handleAddRule}
                onSelectForEdit={handleSelectForEdit}
                onCancelEdit={handleCancelEdit}
            />

            <button
                className={`floating-save-btn ${hasUnsavedChanges ? 'is-active' : 'is-disabled'}`}
                onClick={handleSaveAll}
                disabled={!hasUnsavedChanges}
            >
                <span className="save-icon">💾</span>
                <span>Save All Changes</span>
            </button>
        </div>
    );
}