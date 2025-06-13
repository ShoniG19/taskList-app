import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import OptionsPopover from "../components/OptionsPopover";

import { getCurrentUser } from "../api/auth";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const DashboardPage = () => {
      const [currentUser, setCurrentUser] = useState<{
        email: string;
        name: string;
      } | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
              const user = await getCurrentUser();
              setCurrentUser(user);
        };
        fetchCurrentUser();
    }, []);

  return (
    <div>
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FactCheckOutlinedIcon className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-800">TaskList</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <AccountCircleIcon
                  fontSize="large"
                  className="text-slate-600"
                />
                <span className="text-sm text-slate-600">
                  {currentUser?.name || "Anonimo"}
                </span>
              </div>

              <div className="relative">
                <OptionsPopover />
              </div>
            </div>
          </div>
        </div>
      </header>

      <Dashboard />

    </div>
  );
};

export default DashboardPage;
