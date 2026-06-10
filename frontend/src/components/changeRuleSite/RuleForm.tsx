import type {Rule} from "../../types";
import * as React from "react";
import {useEffect, useState} from "react";


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

        const isValidPath = (pathStr: string) => {
            if (pathStr.trim() === "") return true;

            const paths = pathStr.split(",").map(p => p.trim());
            return paths.every(p => p.startsWith("/") || /^[A-Za-z]:\\/.test(p));
        };

        if (!isValidPath(startLocArray)) {
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
            setFormError("Cannot be a valid Path. Enter full path or nothing.");
            return;
        }

        const sameNameInput = sameName.toLowerCase().trim(); // <-- NEU: Hier definieren wir die Variable!
        if (sameNameInput !== "rename" && sameNameInput !== "ignore" && sameNameInput !== "") {
            setFormError("Please enter \"rename\" or \"ignore\".");
            return;
        }

        const parsedStartLocArray = startLocArray.split(",").map(s => s.trim()).filter(s => s !== "");
        const extArray = extension.split(",").map(s => s.trim()).filter(s => s !== "");

        const ruleObject: Rule = {
            ruleName: "",
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
        <form className="rule-form-container" onSubmit={handleSubmit}>

            {formError && (
                <div className="form-error-alert">
                    <span className="error-icon">⚠️</span>
                    <span>{formError}</span>
                </div>
            )}
            <div className="form-group">
                <label className="form-label">Rule Name<span className="required-asterisk">*</span></label>
                <input
                    type="text"
                    className="form-input"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="Name your Rule"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Exact Name Match <span
                    className="label-hint">(Leave empty if unused)</span></label>
                <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. invoice"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Specific Source Paths <span className="label-hint">(Comma-separated, optional)</span></label>
                <textarea
                    className="form-input form-textarea"
                    value={startLocArray}
                    onChange={(e) => setStartLocArray(e.target.value)}
                    placeholder="/User/folder1/, C://User/folder2/"
                    rows={2}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Destination Path <span className="required-asterisk">*</span></label>
                <textarea
                    className="form-input form-textarea"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="/directory/target/"
                    required
                    rows={2}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Extensions <span
                    className="label-hint">(Without dot, comma-separated)</span></label>
                <input
                    type="text"
                    className="form-input"
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    placeholder="jpg, png, pdf"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Contains Name<span
                    className="label-hint">(Leave empty if unused)</span></label>
                <input
                    type="text"
                    className="form-input"
                    value={nameContains}
                    onChange={(e) => setNameContains(e.target.value)}
                    placeholder="e.g. sbb"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Action for Existing Files <span
                    className="required-asterisk">*</span></label>
                <input
                    type="text"
                    className="form-input"
                    value={sameName}
                    onChange={(e) => setSameName(e.target.value)}
                    placeholder="rename or ignore"
                />
            </div>

            <div className="form-group checkbox-group">
                <input
                    type="checkbox"
                    className="form-checkbox"
                    id="hashCheck"
                    checked={hash}
                    onChange={(e) => setHash(e.target.checked)}
                />
                <label htmlFor="hashCheck" className="checkbox-label">
                    Use deep content check (Hash) to identify identical duplicates?
                </label>
            </div>

            <div className="form-actions-row">
                <button type="submit" className="btn-primary btn-flex">
                    {activeRule ? "💾 Update Rule" : "➕ Create Rule"}
                </button>

                {activeRule && (
                    <button type="button" onClick={onCancelEdit} className="btn-secondary btn-flex">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}