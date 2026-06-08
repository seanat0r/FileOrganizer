import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RuleForm } from "./RuleForm";
import { RuleList } from "./RuleList";
export function RuleSection({ rules, activeRule, onDeleteClick, onEditSave, onAddSave, onSelectForEdit, onCancelEdit }) {
    const activeRuleIndex = activeRule ? rules.indexOf(activeRule) : null;
    return (_jsxs("div", { className: "rules-split-layout", children: [_jsxs("section", { className: "rule-form-section card", children: [_jsx("h3", { children: activeRule !== null ? "Edit Rule" : "Add new rule" }), _jsx(RuleForm, { activeRule: activeRule, activeRuleIndex: activeRuleIndex, onAddSave: onAddSave, onEditSave: onEditSave, onCancelEdit: onCancelEdit })] }), _jsxs("section", { className: "rules-list-section card", children: [_jsx("h3", { children: "Current rules" }), _jsx(RuleList, { rules: rules, onDeleteClick: onDeleteClick, onSelectForEdit: onSelectForEdit })] })] }));
}
