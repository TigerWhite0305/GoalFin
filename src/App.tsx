import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Transactions from "./pages/Transactions";
import Portfolio from "./pages/Portfolio";
import { InvestmentsPage } from "./pages/InvestmentsPage"; // ✅ CORRETTO
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/ui/Toast";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 p-6 .background-gradient">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/investments" element={<InvestmentsPage />} /> {/* ✅ CORRETTO */}
              </Routes>
            </div>
          </div>
          <ToastContainer />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;