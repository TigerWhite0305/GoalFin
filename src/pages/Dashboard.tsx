import React from "react";
import { TotalBalanceCard } from "../components/dashboard/TotalBalanceCard";
import { IncomeCard } from "../components/dashboard/IncomeCard";
import { ExpensesCard } from "../components/dashboard/ExpensesCard";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { ExpensesPieChart } from "../components/dashboard/ExpensesPieChart";
import { TransactionsList } from "../components/dashboard/TransactionsList";
import { Goals } from "../components/dashboard/GoalsList";
import Investments from "../components/dashboard/Investments";
import { useTheme } from "../context/ThemeContext";

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      {/* Container principale con padding responsive */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">

        {/* Griglia principale redesignata */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-6">

          {/* TotalBalanceCard - Card principale */}
          <div className="col-span-1 md:col-span-2 2xl:col-span-3 2xl:row-span-2 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
              <TotalBalanceCard />
            </div>
          </div>

          {/* IncomeCard - In alto a destra */}
          <div className="col-span-1 2xl:col-start-4 2xl:row-start-1 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
              <IncomeCard />
            </div>
          </div>

          {/* ExpensesCard - Sotto IncomeCard */}
          <div className="col-span-1 2xl:col-start-4 2xl:row-start-2 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
              <ExpensesCard />
            </div>
          </div>

          {/* Goals - Sezione obiettivi */}
          <div className="col-span-1 2xl:col-start-5 2xl:row-start-1 2xl:col-span-2 2xl:row-span-2 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden`}>
              <Goals />
            </div>
          </div>

          {/* RevenueChart - Grafico entrate */}
          <div className="col-span-1 2xl:col-start-1 2xl:row-start-3 2xl:col-span-2 2xl:row-span-3 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden`}>
              <RevenueChart />
            </div>
          </div>

          {/* ExpensesPieChart - Grafico spese */}
          <div className="col-span-1 2xl:col-start-3 2xl:row-start-3 2xl:col-span-2 2xl:row-span-3 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden`}>
              <ExpensesPieChart />
            </div>
          </div>

          {/* TransactionsList - Lista transazioni */}
          <div className="col-span-1 2xl:col-start-5 2xl:row-start-3 2xl:col-span-2 2xl:row-span-3 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden`}>
              <TransactionsList />
            </div>
          </div>

          {/* Investments - Sezione investimenti full width */}
          <div className="col-span-1 md:col-span-2 2xl:col-start-1 2xl:row-start-6 2xl:col-span-6 2xl:row-span-1 h-full">
            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden`}>
              <Investments />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;