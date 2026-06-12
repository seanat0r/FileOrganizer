import type {Rule} from "../types";

interface RuleCardProps {
    rule: Rule;
    index: number;
}

export function RuleCard({rule, index}: RuleCardProps) {
    const STATUS_INACTIVE = "Not in use";

    return (
        <article
            className="bg-bg-surface border border-border rounded-xl p-5 shadow-md flex flex-col min-w-0 w-full transition-shadow hover:shadow-lg">

            <div className="flex justify-between items-center border-b border-border pb-4 mb-5 gap-3 min-w-0">
                <h4 className="text-xl font-bold text-text-primary truncate" title={rule.ruleName}>
                    {rule.ruleName}
                </h4>
                <span
                    className="px-3 py-1 bg-accent-blue/10 text-accent-blue text-xs font-bold rounded-full shrink-0 border border-accent-blue/20 uppercase tracking-widest">
                    {`Rule ${index + 1}`}
                </span>
            </div>

            <div className="flex flex-col gap-6 min-w-0 w-full">

                <div className="border border-border rounded-lg p-4 w-full min-w-0 flex flex-col gap-3 bg-bg-base">

                    <div className="flex flex-col min-w-0 gap-1">
                        <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">Source Location</span>
                        <span className="text-sm font-mono text-text-primary break-all leading-relaxed">
                            {rule.startLocation?.join(", ") || "Follows Global Directory"}
                        </span>
                    </div>

                    <div className="flex justify-center w-full py-1">
                        <span className="text-text-secondary opacity-50 text-lg">➔</span>
                    </div>

                    <div className="flex flex-col min-w-0 gap-1">
                        <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">Destination Path</span>
                        <span className="text-sm font-mono text-accent-blue break-all leading-relaxed">
                            {rule.destination || "Not specified"}
                        </span>
                    </div>

                </div>

                <div className="min-w-0 w-full">
                    <h5 className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Filters
                        & Execution</h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 w-full">

                        <div
                            className="bg-bg-base border border-border rounded-lg p-3 sm:p-4 min-w-0 flex flex-col gap-1.5 justify-center">
                            <span className="text-xs text-text-secondary">Exact Match</span>
                            <span
                                className={`text-sm truncate ${!rule.name ? 'text-text-secondary opacity-70 italic' : 'text-text-primary font-medium'}`}>
                                {rule.name || STATUS_INACTIVE}
                            </span>
                        </div>

                        {/* Contains Name */}
                        <div
                            className="bg-bg-base border border-border rounded-lg p-3 sm:p-4 min-w-0 flex flex-col gap-1.5 justify-center">
                            <span className="text-xs text-text-secondary">Contains Name</span>
                            <span
                                className={`text-sm truncate ${!rule.nameContains ? 'text-text-secondary opacity-70 italic' : 'text-text-primary font-medium'}`}>
                                {rule.nameContains || STATUS_INACTIVE}
                            </span>
                        </div>

                        {/* Extensions (nimmt beide Spalten ein) */}
                        <div
                            className="sm:col-span-2 bg-bg-base border border-border rounded-lg p-3 sm:p-4 min-w-0 flex flex-col gap-1.5 justify-center">
                            <span className="text-xs text-text-secondary">Extensions</span>
                            <span
                                className={`text-sm break-words ${!rule.extensions ? 'text-text-secondary opacity-70 italic' : 'text-text-primary font-medium'}`}>
                                {rule.extensions?.join(", ") || STATUS_INACTIVE}
                            </span>
                        </div>

                        <div
                            className="bg-bg-base border border-border rounded-lg p-3 sm:p-4 min-w-0 flex flex-col gap-1.5 justify-center">
                            <span className="text-xs text-text-secondary">Duplicate Handling</span>
                            <span className="text-sm font-medium text-yellow-500 truncate">
                                {rule.sameName || "Ignore"}
                            </span>
                        </div>
                        
                        <div
                            className="bg-bg-base border border-border rounded-lg p-3 sm:p-4 min-w-0 flex flex-col gap-2 justify-center">
                            <span className="text-xs text-text-secondary">Content Hash</span>
                            <div>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                    rule.hash
                                        ? 'bg-status-online/10 text-status-online border border-status-online/20'
                                        : 'bg-status-offline/10 text-status-offline border border-status-offline/20'
                                }`}>
                                    {rule.hash ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </article>
    );
}