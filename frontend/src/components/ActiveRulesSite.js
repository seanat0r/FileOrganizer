import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getConfig } from "../api/backend.ts";
import { RuleCard } from "./RuleCard.tsx";
export function ActiveRulesSite() {
    const [config, setConfig] = useState();
    useEffect(() => {
        const fetchRules = async () => {
            const currentRules = await getConfig();
            setConfig(currentRules);
        };
        void fetchRules();
    }, []);
    return (_jsxs("div", { className: "active-rules-layout", children: [_jsxs("header", { className: "page-header", children: [_jsx("h2", { children: "Active File Management Rules" }), _jsx("p", { className: "page-subtitle", children: "Overview of your current file routing and filtering configurations." })] }), !config ? (_jsxs("div", { className: "loading-state", children: [_jsx("span", { className: "loading-spinner" }), _jsx("p", { children: "Loading configuration..." })] })) : (_jsxs("div", { className: "rules-content", children: [_jsxs("section", { className: "global-locations-card card", children: [_jsx("div", { className: "card-header", children: _jsx("h3", { children: "Global Source Directories" }) }), _jsx("div", { className: "card-body", children: config.startLocationsGlobal.length > 0 ? (_jsx("ul", { className: "directory-list", children: config.startLocationsGlobal.map((location, index) => (_jsxs("li", { className: "directory-item", children: [_jsx("span", { className: "folder-icon", children: "\uD83D\uDCC1" }), _jsx("span", { className: "path-text", children: location })] }, `global-${index}`))) })) : (_jsx("p", { className: "empty-state-text", children: "No global directories defined." })) })] }), _jsxs("section", { className: "specific-rules-section", children: [_jsx("h3", { className: "section-title", children: "Specific Rules" }), config.rules.length === 0 ? (_jsx("div", { className: "card empty-state-card", children: _jsx("p", { children: "No specific rules defined yet." }) })) : (_jsx("div", { className: "rules-grid", children: config.rules.map((rule, index) => (_jsx(RuleCard, { rule: rule, index: index }, `rule-${index}`))) }))] })] }))] }));
}
