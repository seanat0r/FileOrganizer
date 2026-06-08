import type { Rule } from "../../types";
interface RuleSectionProps {
    rules: Rule[];
    activeRule: Rule | null;
    onDeleteClick: (index: number) => void;
    onEditSave: (index: number, updatedRule: Rule) => void;
    onAddSave: (newRule: Rule) => void;
    onSelectForEdit: (index: number) => void;
    onCancelEdit: () => void;
}
export declare function RuleSection({ rules, activeRule, onDeleteClick, onEditSave, onAddSave, onSelectForEdit, onCancelEdit }: RuleSectionProps): import("react").JSX.Element;
export {};
