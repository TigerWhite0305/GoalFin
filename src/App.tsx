import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Transactions from "./pages/Transactions";
import Portfolio from "./pages/Portfolio";
import {InvestmentsPage} from "./pages/InvestmentsPage";
import Navbar from "./components/Navbar";
import { FinanceProvider } from "./contexts/FinanceContext";

function App() {
  return (
    <FinanceProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 p-6 .background-gradient">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/investments" element={<InvestmentsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;