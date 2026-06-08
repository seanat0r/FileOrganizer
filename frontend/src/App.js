import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { ActiveRulesSite } from './components/ActiveRulesSite';
import { StatusSite } from "./components/StatusSite.tsx";
import { ChangeRulePage } from "./components/changeRuleSite/ChangeRulePage.tsx";
function App() {
    return (_jsx(Router, { children: _jsxs("div", { className: "app-layout", children: [_jsx(Header, {}), _jsx("main", { className: "content-container", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/status", element: _jsx(StatusSite, {}) }), _jsx(Route, { path: "/active-rules", element: _jsx(ActiveRulesSite, {}) }), _jsx(Route, { path: "/change-rules", element: _jsx(ChangeRulePage, {}) })] }) })] }) }));
}
export default App;
