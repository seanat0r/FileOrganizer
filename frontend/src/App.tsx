// src/App.tsx
import {HashRouter as Router} from 'react-router-dom';
import {Header} from './components/Header';
import {AppRoutes} from "./components/AppRoutes.tsx";

function App() {
    return (
        <Router>
            <div className="app-layout">
                <Header/>
                <main className="content-container">
                    <AppRoutes/>
                </main>
            </div>
        </Router>
    );
}

export default App;