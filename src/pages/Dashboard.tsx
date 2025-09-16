import React from "react";
import { TotalBalanceCard } from "../components/components_dashboard/TotalBalanceCard";
import { IncomeCard } from "../components/components_dashboard/IncomeCard";
import { ExpensesCard } from "../components/components_dashboard/ExpensesCard";
import { RevenueChart } from "../components/components_dashboard/RevenueChart";
import { ExpensesPieChart } from "../components/components_dashboard/ExpensesPieChart";
import { TransactionsList } from "../components/components_dashboard/TransactionsList";
import { Goals } from "../components/components_dashboard/GoalsList";
import Investments from "../components/components_dashboard/Investments";

const Dashboard: React.FC = () => {
  return (
    <div className="grid gap-5 text-white p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(200px,auto)]">

      {/* TotalBalanceCard - Grande card principale */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-2 h-full rounded-3xl">
        <TotalBalanceCard />
      </div>

      {/* IncomeCard - In alto a destra */}
      <div className="col-span-1 lg:col-start-4 lg:row-start-1 h-full rounded-3xl">
        <IncomeCard />
      </div>

      {/* ExpensesCard - Sotto IncomeCard */}
      <div className="col-span-1 lg:col-start-4 lg:row-start-2 h-full rounded-3xl">
        <ExpensesCard />
      </div>

      {/* Goals - Ridotta a 2 righe invece di 3 */}
      <div className="col-span-1 lg:col-start-5 lg:row-start-1 lg:col-span-2 lg:row-span-2 rounded-3xl h-full">
        <Goals />
      </div>

      {/* RevenueChart - Grafico lineare */}
      <div className="col-span-1 lg:col-start-1 lg:row-start-3 lg:col-span-2 lg:row-span-3 h-full rounded-3xl">
        <RevenueChart />
      </div>

      {/* ExpensesPieChart - Grafico a torta */}
      <div className="col-span-1 lg:col-start-3 lg:row-start-3 lg:col-span-2 lg:row-span-3 h-full rounded-3xl">
        <ExpensesPieChart />
      </div>

      {/* TransactionsList - Lista transazioni, più spazio verticale */}
      <div className="col-span-1 lg:col-start-5 lg:row-start-3 lg:col-span-2 lg:row-span-3 h-full rounded-3xl">
        <TransactionsList />
      </div>

      {/* Investments - In fondo, full width */}
      <div className="col-span-1 md:col-span-2 lg:col-start-1 lg:row-start-6 lg:col-span-6 lg:row-span-1 rounded-3xl h-full">
        <Investments />
      </div>

    </div>
  );
};

export default Dashboard;