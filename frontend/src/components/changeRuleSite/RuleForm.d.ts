import type { Rule } from "../../types";
import * as React from "react";
interface RuleFormProps {
    activeRule: Rule | null;
    activeRuleIndex: number | null;
    onAddSave: (newRule: Rule) => void;
    onEditSave: (index: number, updatedRule: Rule) => void;
    onCancelEdit: () => void;
}
export declare function RuleForm({ activeRule, activeRuleIndex, onAddSave, onEditSave, onCancelEdit }: RuleFormProps): React.JSX.Element;
export {};
