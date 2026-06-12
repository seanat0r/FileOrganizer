import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {StatusSite} from "./statusSite/StatusSite.tsx";
import {ActiveRulesSite} from "./ActiveRulesSite.tsx";
import {ChangeRulePage} from "./changeRuleSite/ChangeRulePage.tsx";

export function AppRoutes() {
    const location = useLocation();

    return (
        <div className="">
            <div
                key={location.pathname}
                className="route-animate-container h-full"
            >
                <Routes location={location}>
                    <Route path="/" element={<Navigate to="/status" replace/>}/>

                    <Route path="/status" element={<StatusSite/>}/>
                    <Route path="/active-rules" element={<ActiveRulesSite/>}/>
                    <Route path="/change-rules" element={<ChangeRulePage/>}/>

                    <Route path="*" element={<Navigate to="/status" replace/>}/>
                </Routes>
            </div>
        </div>
    )
}