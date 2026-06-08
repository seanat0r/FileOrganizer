import {NavLink} from "react-router-dom";

export function Navigation() {
    return (
        <nav className="app-nav">
            <NavLink
                to="/status"
                className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
            >
                Status
            </NavLink>
            <NavLink
                to="/active-rules"
                className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
            >
                Active Rules
            </NavLink>
            <NavLink
                to="/change-rules"
                className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
            >
                Change Rules
            </NavLink>
        </nav>
    );
}