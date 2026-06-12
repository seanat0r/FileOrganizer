// src/App.tsx
import {HashRouter as Router} from 'react-router-dom';
import {Header} from './components/Header';
import {AppRoutes} from "./components/AppRoutes.tsx";

function App() {
    return (
        <Router>
            <div className="bg-bg-base min-h-screen w-full text-text-primary">
                <Header/>
                <main className="md:ml-67 ml-2 mt-3 mr-2 mb-3 bg-bg-base min-h-screen w-full text-text-primary">
                    <AppRoutes/>
                </main>
            </div>
        </Router>
    );
}

export default App;