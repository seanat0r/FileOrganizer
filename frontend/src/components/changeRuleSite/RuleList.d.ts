import type { Rule } from "../../types";
interface RuleListProps {
    rules: Rule[];
    onDeleteClick: (index: number) => void;
    onSelectForEdit: (index: number) => void;
}
export declare function RuleList({ rules, onDeleteClick, onSelectForEdit }: RuleListProps): import("react").JSX.Element;
export {};
