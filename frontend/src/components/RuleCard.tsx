import type {Rule} from "../types";

interface RuleCardProps {
    rule: Rule;
    index: number;
}

export function RuleCard({rule, index}: RuleCardProps) {
    const STATUS_INACTIVE = "Not in use";

    return (
        <article className="rule-card card">
            <div className="rule-card-header">
                <h4>{rule.ruleName}</h4>
                <span className="rule-badge">{`Rule #${index + 1}`}</span>
            </div>

            <div className="rule-card-body">
                {/* Visual Path Display */}
                <div className="rule-path-group">
                    <div className="path-item">
                        <span className="path-label">Source Location</span>
                        <span className="path-value source-path">
                            {rule.startLocation?.join(", ") || "Follows Global Directory"}
                        </span>
                    </div>
                    <div className="path-connector">➔</div>
                    <div className="path-item">
                        <span className="path-label">Destination Path</span>
                        <span className="path-value destination-path">
                            {rule.destination || "Not specified"}
                        </span>
                    </div>
                </div>

                {/* Filter Data Grid */}
                <div className="rule-filters-group">
                    <h5 className="group-title">Filters & Execution</h5>
                    <div className="filter-grid">
                        <div className="filter-item">
                            <span className="filter-label">Exact Match</span>
                            <span className={`filter-value ${!rule.name ? 'inactive' : ''}`}>
                                {rule.name || STATUS_INACTIVE}
                            </span>
                        </div>
                        <div className="filter-item">
                            <span className="filter-label">Contains Name</span>
                            <span className={`filter-value ${!rule.nameContains ? 'inactive' : ''}`}>
                                {rule.nameContains || STATUS_INACTIVE}
                            </span>
                        </div>
                        <div className="filter-item full-width">
                            <span className="filter-label">Extensions</span>
                            <span className={`filter-value ${!rule.extensions ? 'inactive' : ''}`}>
                                {rule.extensions?.join(", ") || STATUS_INACTIVE}
                            </span>
                        </div>
                        <div className="filter-item">
                            <span className="filter-label">Duplicate Handling</span>
                            <span className="filter-value highlighted">{rule.sameName || "Ignore"}</span>
                        </div>
                        <div className="filter-item">
                            <span className="filter-label">Content Hash</span>
                            <span className={`filter-badge ${rule.hash ? 'badge-enabled' : 'badge-disabled'}`}>
                                {rule.hash ? "Enabled" : "Disabled"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}