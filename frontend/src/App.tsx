// src/App.tsx
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import {Header} from './components/Header';
import {ActiveRulesSite} from './components/ActiveRulesSite';
import {StatusSite} from "./components/StatusSite.tsx";
import {ChangeRulePage} from "./components/changeRuleSite/ChangeRulePage.tsx";

function App() {
    return (
        <Router>
            <div className="app-layout">
                <Header/>
                <main className="content-container">
                    <Routes>
                        <Route path="/" element={<Navigate to="/status" replace/>}/>

                        <Route path="/status" element={<StatusSite/>}/>
                        <Route path="/active-rules" element={<ActiveRulesSite/>}/>
                        <Route path="/change-rules" element={<ChangeRulePage/>}/>

                        <Route path="*" element={<Navigate to="/status" replace/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;