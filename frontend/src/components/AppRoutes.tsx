import {Navigate, Route, Routes} from "react-router-dom";
import {StatusSite} from "./statusSite/StatusSite.tsx";
import {ActiveRulesSite} from "./ActiveRulesSite.tsx";
import {ChangeRulePage} from "./changeRuleSite/ChangeRulePage.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/status" replace/>}/>

            <Route path="/status" element={<StatusSite/>}/>
            <Route path="/active-rules" element={<ActiveRulesSite/>}/>
            <Route path="/change-rules" element={<ChangeRulePage/>}/>

            <Route path="*" element={<Navigate to="/status" replace/>}/>
        </Routes>
    )
}