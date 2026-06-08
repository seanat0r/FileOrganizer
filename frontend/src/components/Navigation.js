import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
export function Navigation() {
    return (_jsxs("nav", { className: "app-nav", children: [_jsx(NavLink, { to: "/status", className: ({ isActive }) => isActive ? "nav-item active" : "nav-item", children: "Status" }), _jsx(NavLink, { to: "/active-rules", className: ({ isActive }) => isActive ? "nav-item active" : "nav-item", children: "Active Rules" }), _jsx(NavLink, { to: "/change-rules", className: ({ isActive }) => isActive ? "nav-item active" : "nav-item", children: "Change Rules" })] }));
}
