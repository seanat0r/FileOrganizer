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
        <div className="rules-split-layout">

            <section className="rule-form-section card">
                <h3>
                    {activeRule !== null ? "Edit Rule" : "Add new rule"}
                </h3>

                <RuleForm
                    activeRule={activeRule}
                    activeRuleIndex={activeRuleIndex}
                    onAddSave={onAddSave}
                    onEditSave={onEditSave}
                    onCancelEdit={onCancelEdit}
                />
            </section>

            <section className="rules-list-section card">
                <h3>Current rules</h3>

                <RuleList
                    rules={rules}
                    onDeleteClick={onDeleteClick}
                    onSelectForEdit={onSelectForEdit}
                />
            </section>

        </div>
    );
}