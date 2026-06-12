import type {Rule} from "../../types";
import * as React from "react";
import {useEffect, useState} from "react";
import {isValidPath} from "../../utils/checkValidPath.ts";


interface RuleFormProps {
    activeRule: Rule | null;
    activeRuleIndex: number | null;
    onAddSave: (newRule: Rule) => void;
    onEditSave: (index: number, updatedRule: Rule) => void;
    onCancelEdit: () => void;

}

export function RuleForm({
                             activeRule,
                             activeRuleIndex,
                             onAddSave,
                             onEditSave,
                             onCancelEdit
                         }: RuleFormProps) {
    // FORMS STATE
    const [ruleName, setRuleName] = useState("");
    const [startLocArray, setStartLocArray] = useState("");
    const [name, setName] = useState("");
    const [extension, setExtension] = useState("");
    const [nameContains, setNameContains] = useState("");
    const [destination, setDestination] = useState("");
    const [sameName, setSameName] = useState("");
    const [hash, setHash] = useState<boolean>(false);

    const [formError, setFormError] = useState<string | null>(null);


    useEffect(() => {
        if (activeRule) {
            // EDIT MODE:
            setRuleName(activeRule.ruleName || "");
            setStartLocArray(activeRule.startLocation ? activeRule.startLocation.join(", ") : "");
            setName(activeRule.name || "");
            setExtension(activeRule.extensions ? activeRule.extensions.join(", ") : "");
            setNameContains(activeRule.nameContains || "");
            setDestination(activeRule.destination || "");
            setSameName(activeRule.sameName || "");
            setHash(activeRule.hash || false);
        } else {
            // ADD MODE:
            setRuleName("");
            setStartLocArray("");
            setName("");
            setExtension("");
            setNameContains("");
            setDestination("");
            setSameName("");
            setHash(false);
        }
    }, [activeRule]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (ruleName.trim() === "") {
            setFormError("Rule Name is required");
            return;
        }

        // startLocArray should be able to be empty! But if not empty it should be somewhat a valid path.
        if (startLocArray.trim() !== "" && !isValidPath(startLocArray)) {
            setFormError("Cannot be a valid Path. Enter full Path (with / or C:\\) or nothing");
            return;
        }

        const systemFiles = [".DS_Store", "Thumbs.db", "desktop.ini", "~$", ".localized"];
        if (systemFiles.includes(name.trim()) || systemFiles.includes(nameContains.trim())) {
            setFormError("Cannot be a system or temporary file");
            return;
        }

        if (extension.includes(".")) {
            setFormError("Please remove the dot (.). Example: jpg, docx.");
            return;
        }

        if (!isValidPath(destination)) {
            setFormError("Cannot be a valid Path. Enter full path (with / or C:\\). Mandatory.");
            return;
        }

        const sameNameInput = sameName.toLowerCase().trim();
        if (sameNameInput !== "rename" && sameNameInput !== "ignore" && sameNameInput !== "") {
            setFormError("Please enter \"rename\" or \"ignore\".");
            return;
        }

        const parsedStartLocArray = startLocArray.split(",").map(s => s.trim()).filter(s => s !== "");
        const extArray = extension.split(",").map(s => s.trim()).filter(s => s !== "");

        const ruleObject: Rule = {
            ruleName: ruleName,
            name: name.trim(),
            startLocation: parsedStartLocArray.length > 0 ? parsedStartLocArray : [],
            extensions: extArray.length > 0 ? extArray : [],
            nameContains: nameContains.trim(),
            destination: destination.trim(),
            sameName: sameNameInput,
            hash: hash
        };

        if (activeRule && activeRuleIndex !== null) {
            onEditSave(activeRuleIndex, ruleObject);
        } else {
            onAddSave(ruleObject);
            setStartLocArray("");
            setName("");
            setExtension("");
            setNameContains("");
            setDestination("");
            setSameName("");
            setHash(false);
        }
    }


    return (
        <form className="flex flex-col gap-5 min-w-0 w-full" onSubmit={handleSubmit}>

            {formError && (
                <div
                    className="flex items-center gap-2 bg-log-error/10 border border-log-error/30 text-log-error px-4 py-3 rounded-lg text-sm font-medium min-w-0">
                    <span className="shrink-0">⚠️</span>
                    <span className="break-words">{formError}</span>
                </div>
            )}

            <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-sm font-semibold text-text-primary">Rule Name <span
                    className="text-log-error">*</span></label>
                <input
                    type="text"
                    className="bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2.5 text-sm text-text-primary w-full min-w-0 placeholder:text-text-secondary/50 transition-colors"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="Name your Rule"
                />
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-sm font-semibold text-text-primary">Exact Name Match <span
                    className="text-xs text-text-secondary font-normal">(Leave empty if unused)</span></label>
                <input
                    type="text"
                    className="bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2.5 text-sm text-text-primary w-full min-w-0 placeholder:text-text-secondary/50 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. invoice"
                />
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-sm font-semibold text-text-primary">Specific Source Paths <span
                    className="text-xs text-text-secondary font-normal">(Comma-separated, optional)</span></label>
                <textarea
                    className="bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2.5 text-sm text-text-primary w-full min-w-0 placeholder:text-text-secondary/50 transition-colors resize-y min-h-[80px]"
                    value={startLocArray}
                    onChange={(e) => setStartLocArray(e.target.value)}
                    placeholder="/User/folder1/, C://User/folder2/"
                    rows={2}
                />
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-sm font-semibold text-text-primary">Destination Path <span
                    className="text-log-error">*</span></label>
                <textarea
                    className="bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2.5 text-sm font-mono text-accent-blue w-full min-w-0 placeholder:text-text-secondary/50 transition-colors resize-y min-h-[80px]"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="/directory/target/"
                    rows={2}
                />
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-sm font-semibold text-text-primary">Extensions <span
                    className="text-xs text-text-secondary font-normal">(Without dot, comma-separated)</span></label>
                <input
                    type="text"
                    className="bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2.5 text-sm text-text-primary w-full min-w-0 placeholder:text-text-secondary/50 transition-colors"
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    placeholder="jpg, png, pdf"
                />
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-sm font-semibold text-text-primary">Contains Name <span
                    className="text-xs text-text-secondary font-normal">(Leave empty if unused)</span></label>
                <input
                    type="text"
                    className="bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2.5 text-sm text-text-primary w-full min-w-0 placeholder:text-text-secondary/50 transition-colors"
                    value={nameContains}
                    onChange={(e) => setNameContains(e.target.value)}
                    placeholder="e.g. sbb"
                />
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-sm font-semibold text-text-primary">Action for Existing Files <span
                    className="text-log-error">*</span></label>
                <input
                    type="text"
                    className="bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2.5 text-sm text-text-primary w-full min-w-0 placeholder:text-text-secondary/50 transition-colors"
                    value={sameName}
                    onChange={(e) => setSameName(e.target.value)}
                    placeholder="rename or ignore"
                    required
                />
            </div>

            <div className="flex items-start gap-3 mt-2 min-w-0 bg-bg-base p-4 rounded-lg border border-border">
                <input
                    type="checkbox"
                    className="mt-1 shrink-0 w-4 h-4 accent-accent-blue cursor-pointer"
                    id="hashCheck"
                    checked={hash}
                    onChange={(e) => setHash(e.target.checked)}
                />
                <label htmlFor="hashCheck" className="text-sm text-text-primary cursor-pointer leading-tight">
                    Use deep content check (Hash) to identify identical duplicates?
                </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-border min-w-0">
                <button type="submit"
                        className="flex-1 bg-accent-blue text-text-primary py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-blue/40">
                    {activeRule ? "💾 Update Rule" : "➕ Create Rule"}
                </button>

                {activeRule && (
                    <button type="button" onClick={onCancelEdit}
                            className="flex-1 bg-bg-base border border-border text-text-primary py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-bg-hover hover:-translate-y-1 hover:shadow-lg hover:shadow-text-primary/10">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}