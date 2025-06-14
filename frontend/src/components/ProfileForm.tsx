import React, { useEffect, useState, useRef } from "react";
import { AxiosError } from "axios";

import { useTranslation } from "react-i18next";
import i18n from "../i18n"; 

import { getCurrentUser, updateUser, deleteUser, updatePassword, uploadAvatar } from "../api/auth";
import DeleteModal from "./DeleteModal";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import MailIcon from "@mui/icons-material/Mail";
import LanguageIcon from "@mui/icons-material/Language";
import LockIcon from "@mui/icons-material/Lock";
import Eye from "@mui/icons-material/Visibility";
import EyeOff from "@mui/icons-material/VisibilityOff";
import RotateRightIcon from "@mui/icons-material/RotateRight";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { toast } from "react-toastify";

const ProfileForm = () => {
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    language: "",
    avatar: "",
    isActive: false,
    createdAt: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorMatchPassword, setErrorMatchPassword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);    

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getCurrentUser();
        setProfileForm({
          name: user.name || t("anonymous"),
          email: user.email || "",
          language: user.language || "",
          avatar: user.avatar || "",
          isActive: user.isActive || false,
          createdAt: new Date(user.createdAt).toISOString().split("T")[0] || "",
        });
        setCurrentLanguage(user.language || "");
        if (user?.language) {
          i18n.changeLanguage(user.language);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      name: event.target.value,
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      email: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        await uploadAvatar(formData);
      }
      await updateUser(profileForm);

      if (profileForm.language && profileForm.language !== currentLanguage) {
        await i18n.changeLanguage(profileForm.language);
      }
      toast.success(t("user_updated"));
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      currentPassword: event.target.value,
    });
  };

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({
        ...passwordForm,
        newPassword: event.target.value,
        });
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({
        ...passwordForm,
        confirmPassword: event.target.value,
        });
    }

    const handleSubmitPassword = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true);
        setError(null);
        setErrorMatchPassword(null);
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setErrorMatchPassword(t("not_match"));
            setIsLoading(false);
            return;   
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*/\-_=+<>?])[A-Za-z0-9!@#$%^&*/\-_=+<>?]{8,}$/;

        if (!passwordRegex.test(passwordForm.newPassword)) {
            setErrorMatchPassword(t("password_invalid"));
            setIsLoading(false);
            return;
        }

        try {
            await updatePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setError(null);
            setErrorMatchPassword(null);
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            toast.success(t("password_updated"));
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            if(error.response && error.response.status === 400) {
                setError(t("current_incorrect"));
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = () => {
        setShowModal(true);
    }

    const confirmDelete = async () => {
        setShowModal(false);
        setDeleteLoading(true);
        try {
            await deleteUser();
            toast.success(t("user_deleted"));
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(t("failed_delete_user"));
        } finally {
            setDeleteLoading(false);
        }
    }

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Header */}
        <div className="md:w-1/3 h-1/3 bg-white rounded-lg shadow-md p-6">
          <div>
            <div className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                 {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview avatar"
                      className="w-24 h-24 rounded-full object-cover border border-gray-300"
                    />
                  ) : profileForm.avatar ? (
                    <img
                      src={profileForm.avatar}
                      alt="User avatar"
                      className="w-24 h-24 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <AccountCircleIcon sx={{ fontSize: 100 }} />
                  )}
                  <button 
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleUploadClick}  
                  >
                    <UploadIcon className="w-4 h-4" />
                    <span className="sr-only">Upload avatar</span>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <h2 className="text-xl font-bold">{profileForm.name}</h2>
                <p className="text-slate-500 text-sm">{profileForm.email}</p>

                <div className="w-full mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">{t("account_status")}</span>
                    <span
                      className={`font-medium ${
                        profileForm.isActive
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {profileForm.isActive ? t("active") : t("inactive")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t("member_since")}</span>
                    <span className="text-slate-700">
                      {profileForm.createdAt}
                    </span>
                  </div>
                </div>

                <hr className="w-full my-6 border-slate-200" />

                <button onClick={handleDelete} className="gap-2 flex items-center border rounded-md bg-red-600 text-white hover:bg-red-700 px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                    {deleteLoading ? (
                        <>
                        <RotateRightIcon className="animate-spin mr-2" />
                        {t("deleting")}
                        </>
                    ) : (
                        <>
                        <DeleteIcon className="w-4 h-4" />
                        {t("delete_account")}
                        </>
                    )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 bg-white rounded-lg shadow-md p-6">
          <div>
            <div>
              <h1 className="text-xl font-bold">{t("account_settings")}</h1>
              <p className="text-slate-500 mt-1">
                {t("manage_profile")}
              </p>
            </div>

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                setActiveTab(newValue);
              }}
              centered
              className="mt-4 w-full"
              TabIndicatorProps={{ style: { backgroundColor: "#10B981" } }}
            >
              <Tab label={t("profile")} style={{ color: "#10B981" }} />
              <Tab label={t("security")} style={{ color: "#10B981" }} />
            </Tabs>
            {activeTab === 0 && (
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h1 className="font-semibold">{t("full_name")}</h1>
                      <div className="relative">
                        <AccountCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          id="name"
                          name="name"
                          value={profileForm.name}
                          placeholder={t("placeholder_full_name")}
                          onChange={handleNameChange}
                          className="pl-10 border border-slate-300 rounded-md w-full py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="font-semibold">{t("email")}</h1>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={profileForm.email}
                          placeholder={t("placeholder_email")}
                          onChange={handleEmailChange}
                          className="pl-10 border border-slate-300 rounded-md w-full py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h1 className="font-semibold">{t("language")}</h1>
                      <div className="relative flex items-between">
                        <LanguageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                          value={profileForm.language}
                          onChange={(event) =>
                            setProfileForm({
                              ...profileForm,
                              language: event.target.value,
                            })
                          }
                          className="pl-10 border border-slate-300 rounded-md w-full py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="" disabled>
                            {t("select_language")}
                          </option>
                          <option value="en">{t("english")}</option>
                          <option value="es">{t("spanish")}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-semibold px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={isLoading}
                  >
                    {isLoading ? <><RotateRightIcon className="animate-spin mr-2" /> {t("saving")}...</> : t("save_changes")}
                  </button>
                </div>
              </form>
            )}
            {activeTab === 1 && (
              <form onSubmit={handleSubmitPassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1>{t("current_password")}</h1>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        placeholder={t("placeholder_current_password")}
                        value={passwordForm.currentPassword}
                        onChange={handleCurrentPasswordChange}
                        className="pl-10 rounded border border-slate-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h1>{t("new_password")}</h1>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder={t("placeholder_new_password")}
                        value={passwordForm.newPassword}
                        onChange={handleNewPasswordChange}
                        className="pl-10 rounded border border-slate-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      {t("password_invalid")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h1>{t("confirm_new_password")}</h1>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type= {showConfirmPassword ? "text" : "password"}
                        required
                        placeholder={t("placeholder_confirm_new_password")}
                        value={passwordForm.confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="pl-10 rounded border border-slate-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errorMatchPassword && (
                        <p className="text-red-500 text-sm">{errorMatchPassword}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-semibold px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isLoading}
                >
                  {isLoading ? <><RotateRightIcon className="animate-spin mr-2" /> {t("updating")}...</> : t("update_password")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <DeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message={t("user")}
      />
    </div>
  );
};

export default ProfileForm;
