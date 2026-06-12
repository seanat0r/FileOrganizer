// src/App.tsx
import {HashRouter as Router} from 'react-router-dom';
import {Header} from './components/Header';
import {AppRoutes} from "./components/AppRoutes.tsx";

function App() {
    return (
        <Router>
            <div className="bg-bg-base min-h-screen w-full text-text-primary">
                <Header/>
                <main className="md:ml-64 mb-2 flex-1 min-w-0 mt-3 px-2 md:px-6 w-full md:max-w-[calc(100vw-16rem)]">
                    <AppRoutes/>
                </main>
            </div>
        </Router>
    );
}

export default App;