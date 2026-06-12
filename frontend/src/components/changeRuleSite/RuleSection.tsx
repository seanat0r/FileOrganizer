import type {Rule} from "../../types";
import {RuleForm} from "./RuleForm";
import {RuleList} from "./RuleList";

interface RuleSectionProps {
    rules: Rule[];
    activeRule: Rule | null;

    onDeleteClick: (index: number) => void;
    onEditSave: (index: number, updatedRule: Rule) => void;
    onAddSave: (newRule: Rule) => void;

    onSelectForEdit: (index: number) => void;
    onCancelEdit: () => void;
}

export function RuleSection({
                                rules,
                                activeRule,
                                onDeleteClick,
                                onEditSave,
                                onAddSave,
                                onSelectForEdit,
                                onCancelEdit
                            }: RuleSectionProps) {
    const activeRuleIndex = activeRule ? rules.indexOf(activeRule) : null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0 w-full">

            {/* Left Side */}
            <section
                className="bg-bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-md min-w-0 flex flex-col">
                <div className="border-b border-border pb-3 mb-5">
                    <h3 className="text-lg font-bold text-text-primary truncate">
                        {activeRule !== null ? "Edit Rule" : "Add New Rule"}
                    </h3>
                </div>

                <RuleForm
                    activeRule={activeRule}
                    activeRuleIndex={activeRuleIndex}
                    onAddSave={onAddSave}
                    onEditSave={onEditSave}
                    onCancelEdit={onCancelEdit}
                />
            </section>

            {/* Right Side*/}
            <section
                className="bg-bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-md min-w-0 flex flex-col">
                <div className="border-b border-border pb-3 mb-5">
                    <h3 className="text-lg font-bold text-text-primary truncate">Current Rules</h3>
                </div>

                <RuleList
                    rules={rules}
                    onDeleteClick={onDeleteClick}
                    onSelectForEdit={onSelectForEdit}
                />
            </section>

        </div>
    );
}