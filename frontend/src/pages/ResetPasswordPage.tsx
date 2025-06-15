import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";

import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import LockIcon from '@mui/icons-material/Lock';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Eye from '@mui/icons-material/Visibility';
import EyeOff from '@mui/icons-material/VisibilityOff';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*/\-_=+<>?])[A-Za-z0-9!@#$%^&*/\-_=+<>?]{8,}$/;

    if (formData.password !== formData.confirmPassword) {
      setErrors({
        confirmPassword: t("not_match"),
      });
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setErrors({
        password: t("password_invalid"),
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token!, formData.password);
      toast.success(t("password_reset_success"));
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); 
    } catch (error) {
      toast.error(t("failed_reset_password"));
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FactCheckOutlinedIcon className="w-10 h-10 text-emerald-600" />
            <span className="text-3xl font-bold text-slate-800">TaskFlow</span>
          </div>
          <p className="text-slate-600">{t("create_password")}</p>
        </div>

        <div className="shadow-xl border-0 rounded-lg bg-white/40 p-8">
          <div className="space-y-1 pb-6">
            <h1 className="text-2xl font-bold text-center">{t("reset_password")}</h1>
            <p className="text-center">
              {t("enter_new_password")}
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <h1 className="font-semibold">{t("new_password")}</h1>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholder_new_password")}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""} border rounded-md h-11 w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <h1 className="font-semibold">{t("confirm_password")}</h1>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("placeholder_confirm_password")}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""} border rounded-md h-11 w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 rounded-md" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RotateRightIcon className="animate-spin w-4 h-4 mr-2" />
                    {t("resetting_password")}
                  </>
                ) : (
                  t("reset_password_btn")
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            {t("remember_password")}{" "}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
              {t("sign_in")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
