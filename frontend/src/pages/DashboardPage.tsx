import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Dashboard from "../components/Dashboard";
import OptionsPopover from "../components/OptionsPopover";

import { getCurrentUser } from "../api/auth";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

const DashboardPage = () => {
      const [currentUser, setCurrentUser] = useState<{
        email: string;
        name: string;
        avatar: string | undefined;
      } | null>(null);

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        const fetchCurrentUser = async () => {
              const user = await getCurrentUser();
              setCurrentUser({
                email: user.email,
                name: user.name,
                avatar: user.avatar !== undefined ? user.avatar : undefined,
              });
        };
        fetchCurrentUser();
    }, []);

    const handleAvatarClick = () => {
      if (currentUser?.avatar) {
        setShowAvatarModal(true);
      }
    };

    const closeAvatarModal = () => {
      setShowAvatarModal(false);
    };

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
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer"
                    onClick={handleAvatarClick}
                  />
                ) : (
                  <AccountCircleIcon
                    fontSize="large"
                    className="text-slate-600"
                  />
                )}
                <span className="text-sm text-slate-600">
                  {currentUser?.name || t("anonymous")}
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
      
      {showAvatarModal && currentUser?.avatar && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeAvatarModal}
        >
          <div className="relative max-w-2xl max-h-[90vh] p-4">
            <button
              onClick={closeAvatarModal}
              className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <CloseIcon className="w-6 h-6 text-gray-600" />
            </button>
            <img
              src={currentUser.avatar}
              alt="User avatar enlarged"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
