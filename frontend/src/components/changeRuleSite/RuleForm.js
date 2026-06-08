import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useEffect, useState } from "react";
export function RuleForm({ activeRule, activeRuleIndex, onAddSave, onEditSave, onCancelEdit }) {
    // FORMS STATE
    const [startLocArray, setStartLocArray] = useState("");
    const [name, setName] = useState("");
    const [extension, setExtension] = useState("");
    const [nameContains, setNameContains] = useState("");
    const [destination, setDestination] = useState("");
    const [sameName, setSameName] = useState("");
    const [hash, setHash] = useState(false);
    const [formError, setFormError] = useState(null);
    useEffect(() => {
        if (activeRule) {
            // EDIT MODE:
            setStartLocArray(activeRule.startLocation ? activeRule.startLocation.join(", ") : "");
            setName(activeRule.name || "");
            setExtension(activeRule.extensions ? activeRule.extensions.join(", ") : "");
            setNameContains(activeRule.nameContains || "");
            setDestination(activeRule.destination || "");
            setSameName(activeRule.sameName || "");
            setHash(activeRule.hash || false);
        }
        else {
            // ADD MODE:
            setStartLocArray("");
            setName("");
            setExtension("");
            setNameContains("");
            setDestination("");
            setSameName("");
            setHash(false);
        }
    }, [activeRule]);
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);
        const isValidPath = (pathStr) => {
            if (pathStr.trim() === "")
                return true;
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
        const ruleObject = {
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
        }
        else {
            onAddSave(ruleObject);
            setStartLocArray("");
            setName("");
            setExtension("");
            setNameContains("");
            setDestination("");
            setSameName("");
            setHash(false);
        }
    };
    return (_jsxs("form", { className: "rule-form-container", onSubmit: handleSubmit, children: [formError && (_jsxs("div", { className: "form-error-alert", children: [_jsx("span", { className: "error-icon", children: "\u26A0\uFE0F" }), _jsx("span", { children: formError })] })), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: ["Exact Name Match ", _jsx("span", { className: "label-hint", children: "(Leave empty if unused)" })] }), _jsx("input", { type: "text", className: "form-input", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. invoice" })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: ["Specific Source Paths ", _jsx("span", { className: "label-hint", children: "(Comma-separated, optional)" })] }), _jsx("textarea", { className: "form-input form-textarea", value: startLocArray, onChange: (e) => setStartLocArray(e.target.value), placeholder: "/User/folder1/, C://User/folder2/", rows: 2 })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: ["Destination Path ", _jsx("span", { className: "required-asterisk", children: "*" })] }), _jsx("textarea", { className: "form-input form-textarea", value: destination, onChange: (e) => setDestination(e.target.value), placeholder: "/directory/target/", required: true, rows: 2 })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: ["Extensions ", _jsx("span", { className: "label-hint", children: "(Without dot, comma-separated)" })] }), _jsx("input", { type: "text", className: "form-input", value: extension, onChange: (e) => setExtension(e.target.value), placeholder: "jpg, png, pdf" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Contains Name" }), _jsx("input", { type: "text", className: "form-input", value: nameContains, onChange: (e) => setNameContains(e.target.value), placeholder: "e.g. sbb" })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: ["Action for Existing Files ", _jsx("span", { className: "required-asterisk", children: "*" })] }), _jsx("input", { type: "text", className: "form-input", value: sameName, onChange: (e) => setSameName(e.target.value), placeholder: "rename or ignore" })] }), _jsxs("div", { className: "form-group checkbox-group", children: [_jsx("input", { type: "checkbox", className: "form-checkbox", id: "hashCheck", checked: hash, onChange: (e) => setHash(e.target.checked) }), _jsx("label", { htmlFor: "hashCheck", className: "checkbox-label", children: "Use deep content check (Hash) to identify identical duplicates?" })] }), _jsxs("div", { className: "form-actions-row", children: [_jsx("button", { type: "submit", className: "btn-primary btn-flex", children: activeRule ? "💾 Update Rule" : "➕ Create Rule" }), activeRule && (_jsx("button", { type: "button", onClick: onCancelEdit, className: "btn-secondary btn-flex", children: "Cancel" }))] })] }));
}
