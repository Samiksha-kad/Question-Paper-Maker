import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './Components/ErrorBoundry';
import './App.css';
const Login = lazy(() => import('./pages/Login/Login'))
const Registration = lazy(() => import('./pages/Register/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const PaperMaker = lazy(() => import('./pages/PaperMaker/PaperMaker'))
const Preview = lazy(() => import('./pages/Preview/Preview'))

function App() {
  return (
    <div className="App">

      <Router>

        <ErrorBoundary>
          <Suspense fallback={
            <img src="https://cdn.dribbble.com/users/2973561/screenshots/5757826/loading__.gif" alt="..." className="loading" style={{ marginLeft: "350px", marginTop: "80px" }}></img>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<PaperMaker />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="*" element={
                <div>
                  <img src="https://cdn.dribbble.com/users/781820/screenshots/2573496/minions-yellow-bg.gif" alt="not found"
                  />
                </div>

              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router >
    </div >
  );
}

export default App;
