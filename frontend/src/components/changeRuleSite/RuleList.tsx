import type {Rule} from "../../types";

interface RuleListProps {
    rules: Rule[];
    onDeleteClick: (index: number) => void;
    onSelectForEdit: (index: number) => void;
}

export function RuleList({rules, onDeleteClick, onSelectForEdit}: RuleListProps) {
    return (
        <div className="rules-list-wrapper">
            {rules.length === 0 ? (
                <div className="empty-state-card">
                    <p>No rules defined yet.<br/>Create your first rule on the left side!</p>
                </div>
            ) : (
                <ul className="editable-rules-list">
                    {rules.map((rule, index) => (
                        <li key={index} className="editable-rule-item">
                            <div className="rule-item-details">
                                <strong className="rule-item-title">{rule.ruleName}</strong>
                                <span className="rule-item-dest">
                                    <span
                                        className="dest-label">Dest:</span> {rule.destination || "No destination defined"}
                                </span>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-secondary btn-small"
                                        onClick={() => onSelectForEdit(index)}>Edit
                                </button>
                                <button className="btn-danger btn-small" onClick={() => onDeleteClick(index)}>Del
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}