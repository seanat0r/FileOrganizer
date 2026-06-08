import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ChangeGlobalPaths } from "./ChangeGlobalPaths";
import { RuleSection } from "./RuleSection";
import { getConfig, postNewConfig, startBackend, stopBackend } from "../../api/backend.ts";
export function ChangeRulePage() {
    const [rules, setRules] = useState([]);
    const [globalPaths, setGlobalPaths] = useState([]);
    const [activeRule, setActiveRule] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await getConfig();
                setRules(config.rules);
                setGlobalPaths(config.startLocationsGlobal);
            }
            catch (error) {
                console.error(error);
            }
        };
        void fetchConfig();
    }, []);
    /**
     * Helper function to make a delay
     * @param ms Time in Milliseconds
     */
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // --- GLOBAL PATH LOGIC ---
    // handels deleting, editing and adding
    const handleDeleteGlobalPath = (indexToDelete) => {
        const newGlobalPaths = globalPaths.filter((_, index) => index !== indexToDelete);
        setGlobalPaths(newGlobalPaths);
        setHasUnsavedChanges(true);
    };
    const handleEditGlobalPath = (indexToEdit, newPath) => {
        const newGlobalPaths = globalPaths.map((path, index) => index === indexToEdit ? newPath : path);
        setGlobalPaths(newGlobalPaths);
        setHasUnsavedChanges(true);
    };
    const handleAddGlobalPath = (newPath) => {
        const newGlobalPaths = [...globalPaths, newPath];
        setGlobalPaths(newGlobalPaths);
        setHasUnsavedChanges(true);
    };
    // --- RULE LOGIC ---
    // handels deleting, editing and adding
    const handleDeleteRule = (indexToDelete) => {
        const newRules = rules.filter((_, index) => index !== indexToDelete);
        setRules(newRules);
        setHasUnsavedChanges(true);
    };
    const handleEditRule = (indexToEdit, newRule) => {
        const newRules = rules.map((rule, index) => index === indexToEdit ? newRule : rule);
        setRules(newRules);
        setHasUnsavedChanges(true);
    };
    const handleAddRule = (newRule) => {
        const newRules = [...rules, newRule];
        setRules(newRules);
        setHasUnsavedChanges(true);
    };
    const handleSelectForEdit = (indexToEdit) => {
        setActiveRule(rules[indexToEdit]);
    };
    const handleCancelEdit = () => {
        setActiveRule(null);
    };
    //--- SAVE LOGIC ---
    /**
     * Save all the new config configuration
     */
    const handleSaveAll = async () => {
        try {
            console.log("Sending new Config");
            const configToSave = {
                startLocationsGlobal: globalPaths,
                rules: rules,
            };
            console.table(configToSave);
            await postNewConfig(configToSave);
            alert("Config saved successfully.");
            setHasUnsavedChanges(false);
            // restart the server, to reload the config.json
            try {
                await stopBackend();
                await delay(2000);
                await startBackend();
            }
            catch (error) {
                alert("Error at reloading! Try reloading the service manually.");
                console.error("Error at restarting the backend: " + error);
            }
        }
        catch (error) {
            alert("Error adding new Config! Is service online?");
            console.error("Failed to send new Config: " + error);
        }
    };
    return (_jsxs("div", { className: "change-rules-layout", children: [_jsxs("header", { className: "page-header", children: [_jsx("h2", { children: "Configuration & Rules Editor" }), _jsx("p", { className: "page-subtitle", children: "Manage your global source directories and define specific routing rules." })] }), _jsx(ChangeGlobalPaths, { globalPaths: globalPaths, onDeleteClick: handleDeleteGlobalPath, onEditClick: handleEditGlobalPath, onAddClick: handleAddGlobalPath }), _jsx(RuleSection, { rules: rules, activeRule: activeRule, onDeleteClick: handleDeleteRule, onEditSave: handleEditRule, onAddSave: handleAddRule, onSelectForEdit: handleSelectForEdit, onCancelEdit: handleCancelEdit }), _jsxs("button", { className: `floating-save-btn ${hasUnsavedChanges ? 'is-active' : 'is-disabled'}`, onClick: handleSaveAll, disabled: !hasUnsavedChanges, children: [_jsx("span", { className: "save-icon", children: "\uD83D\uDCBE" }), _jsx("span", { children: "Save All Changes" })] })] }));
}
