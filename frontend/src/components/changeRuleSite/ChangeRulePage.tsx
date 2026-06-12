import type {AppConfig, AppResponse, Rule} from "../../types";
import {useEffect, useState} from "react";
import {ChangeGlobalPaths} from "./ChangeGlobalPaths";
import {RuleSection} from "./RuleSection";
import {getConfig, postNewConfig} from "../../api/backend.ts";
import {createPortal} from "react-dom";

export function ChangeRulePage() {
    const [rules, setRules] = useState<Rule[]>([]);

    const [globalPaths, setGlobalPaths] = useState<AppConfig>({id: 0, startLocationsGlobal: []});

    const [activeRule, setActiveRule] = useState<Rule | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await getConfig();

                setRules(config.rules);
                setGlobalPaths(config.globalPaths);
            } catch (error) {
                console.error(error);
            }
        }
        void fetchConfig();
    }, []);

    // --- GLOBAL PATH LOGIC ---
    // handels deleting, editing and adding
    const handleDeleteGlobalPath = (indexToDelete: number) => {
        const newGlobalPaths: string[] = globalPaths?.startLocationsGlobal.filter((_, index) => index !== indexToDelete) || [];
        setGlobalPaths({id: globalPaths?.id, startLocationsGlobal: newGlobalPaths});
        setHasUnsavedChanges(true);
    };

    const handleEditGlobalPath = (indexToEdit: number, newPath: string) => {
        const newGlobalPaths = globalPaths?.startLocationsGlobal.map((path, index) =>
            index === indexToEdit ? newPath : path
        ) || [];
        setGlobalPaths({id: globalPaths?.id, startLocationsGlobal: newGlobalPaths});
        setHasUnsavedChanges(true);
    };

    const handleAddGlobalPath = (newPath: string) => {
        const newGlobalPaths = [...globalPaths.startLocationsGlobal, newPath];
        setGlobalPaths({id: globalPaths?.id, startLocationsGlobal: newGlobalPaths});
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
            const configToSave: AppResponse = {
                rules: rules,
                globalPaths: globalPaths
            }
            console.table(configToSave);

            await postNewConfig(configToSave);
            alert("Config saved successfully.");

            setHasUnsavedChanges(false);


        } catch (error) {
            alert("Error adding new Config! Is service online?");
            console.error("Failed to send new Config: " + error);
        }
    }
    return (
        <div className="flex flex-col gap-6 min-w-0 w-full relative pb-20">
            <header className="border-b border-border pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary truncate">Configuration & Rules
                    Editor</h2>
                <p className="text-sm sm:text-base text-text-secondary mt-1 break-words">Manage your global source
                    directories and define specific routing rules.</p>
            </header>

            <ChangeGlobalPaths
                globalPaths={globalPaths.startLocationsGlobal}
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

            {/* Flying Button*/}
            {createPortal(
                <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-9999">
                    <button
                        className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 border
                            ${hasUnsavedChanges
                            ? 'bg-accent-blue text-text-primary border-accent-blue cursor-pointer ' +
                            'shadow-[0_0_40px_rgb(26, 113, 255, 0.8)] hover:-translate-y-1.5 hover:shadow-[0_0_40px_#1a71ff]'
                            : 'bg-bg-surface text-text-secondary border-border opacity-60 cursor-not-allowed shadow-md'}`}
                        onClick={handleSaveAll}
                        disabled={!hasUnsavedChanges}
                    >
                        <span className="text-2xl">💾</span>
                        <span>Save All Changes</span>
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
}