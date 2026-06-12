import { NavLink } from "react-router-dom";

export function Navigation() {
    return (
        <nav className="flex flex-col gap-2 w-full">
            <NavLink
                to="/status"
                className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                        ? "bg-[rgba(26,113,255,0.15)] text-accent-blue font-semibold shadow-sm" 
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:translate-x-1"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {/* Active vertical glow indicator bar */}
                        <span className={`absolute left-0 top-1/4 bottom-1/4 w-[4px] rounded-r-md bg-accent-blue transition-all duration-300
                            ${isActive ? 'h-1/2 opacity-100' : 'h-0 opacity-0 group-hover:h-1/3 group-hover:opacity-50'}`} 
                        />
                        
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                        </svg>
                        <span>Status</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/active-rules"
                className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                        ? "bg-[rgba(26,113,255,0.15)] text-accent-blue font-semibold shadow-sm" 
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:translate-x-1"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <span className={`absolute left-0 top-1/4 bottom-1/4 w-[4px] rounded-r-md bg-accent-blue transition-all duration-300
                            ${isActive ? 'h-1/2 opacity-100' : 'h-0 opacity-0 group-hover:h-1/3 group-hover:opacity-50'}`} 
                        />
                        
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <span>Active Rules</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/change-rules"
                className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                        ? "bg-[rgba(26,113,255,0.15)] text-accent-blue font-semibold shadow-sm" 
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:translate-x-1"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <span className={`absolute left-0 top-1/4 bottom-1/4 w-[4px] rounded-r-md bg-accent-blue transition-all duration-300
                            ${isActive ? 'h-1/2 opacity-100' : 'h-0 opacity-0 group-hover:h-1/3 group-hover:opacity-50'}`} 
                        />
                        
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span>Change Rules</span>
                    </>
                )}
            </NavLink>
        </nav>
    );
}