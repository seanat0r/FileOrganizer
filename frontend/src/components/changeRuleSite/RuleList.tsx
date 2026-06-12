import type {Rule} from "../../types";

interface RuleListProps {
    rules: Rule[];
    onDeleteClick: (index: number) => void;
    onSelectForEdit: (index: number) => void;
}

export function RuleList({rules, onDeleteClick, onSelectForEdit}: RuleListProps) {
    return (
        <div className="min-w-0 w-full flex flex-col h-full">
            {rules.length === 0 ? (
                <div
                    className="bg-bg-base border border-border border-dashed rounded-xl p-8 text-center flex-1
                     flex items-center justify-center min-w-0">
                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                        No rules defined yet.<br/>Create your first rule on the left side!
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3 min-w-0 overflow-y-auto max-h-150 xl:max-h-200 pr-1">
                    {rules.map((rule, index) => (
                        <li key={index}
                            className="bg-bg-base border border-border rounded-lg p-4 flex flex-col sm:flex-row
                             justify-between items-start sm:items-center gap-4 min-w-0 transition-all hover:border-accent-blue/50">

                            <div className="flex flex-col min-w-0 gap-1.5 w-full sm:w-auto flex-1">
                                <strong className="text-base font-bold text-text-primary truncate"
                                        title={rule.ruleName}>
                                    {rule.ruleName}
                                </strong>
                                <div className="flex flex-col min-w-0">
                                    <span
                                        className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                        Destination:</span>
                                    <span className="text-xs sm:text-sm font-mono text-accent-blue truncate"
                                          title={rule.destination}>
                                    {rule.destination || "No destination defined"}
                                </span>
                                </div>
                            </div>

                            <div className="flex gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    className="flex-1 sm:flex-none bg-bg-surface border border-border
                                     text-text-primary px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                                      hover:bg-bg-hover hover:-translate-y-1 hover:shadow-lg hover:shadow-text-primary/10"
                                    onClick={() => onSelectForEdit(index)}>Edit
                                </button>
                                <button
                                    className="flex-1 sm:flex-none bg-log-error/10 border border-log-error/20
                                     text-log-error px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                                      hover:bg-log-error/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-log-error/30"
                                    onClick={() => onDeleteClick(index)}>Del
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}