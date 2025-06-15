import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { requestPasswordReset } from "../api/auth";

import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import MailIcon from '@mui/icons-material/Mail';
import SendIcon from '@mui/icons-material/Send';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { t } = useTranslation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("")

     if (!email.trim()) {
      setError(t("email_required"))
      setIsLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("email_invalid"));
      setIsLoading(false);
      return;
    }

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      toast.error(t("error_password"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

    if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FactCheckOutlinedIcon className="w-10 h-10 text-emerald-600" />
              <span className="text-3xl font-bold text-slate-800">TaskList</span>
            </div>
          </div>

          {/* Success Card */}
          <div className="shadow-xl border-0 rounded-sm bg-white/40 p-8">
            <div className="pt-8 pb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TaskAltOutlinedIcon className="text-emerald-600" fontSize="large"/>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-4">{t("check_email")}</h2>

                <p className="text-slate-600 mb-6">
                  {t("reset_link")} <span className="font-medium text-slate-800">{email}</span>
                </p>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-600">
                    <strong>{t("receive_email")}</strong>
                    <br />
                    {t("spam")}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                    className="w-full outline-0 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold h-11 rounded-lg"
                  >
                    {t("different_email")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Remember your password?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FactCheckOutlinedIcon className="w-10 h-10 text-emerald-600" />
            <span className="text-3xl font-bold text-slate-800">TaskList</span>
          </div>
          <p className="text-slate-600">{t("reset_password")}</p>
        </div>
        <div className="shadow-xl border-0 rounded bg-white/40 p-8">
          <div className="space-y-1 pb-6">
            <h1 className="text-2xl font-bold text-center">{t("forgot_password")}</h1>
            <p className="text-center text-slate-500">
              {t("enter_email")}
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <h1 className="font-semibold">{t("email")}</h1>
                <div className="relative mt-1">
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("placeholder_email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${error ? "border-red-500" : ""} border rounded-md h-11 w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent`}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">{t("send_password_reset")}</p>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 rounded" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RotateRightIcon className="animate-spin w-4 h-4 mr-2" />
                    {t("sending_reset")}
                  </>
                ) : (
                  <>
                    <SendIcon className="w-4 h-4 mr-2" />
                    {t("send_reset_link")}
                  </>
                )}
              </button>
                {error && (
                    <p className="bg-red-50/40 text-red-700 border-red-200 rounded-sm justify-center text-center">
                    {error}
                    </p>
                )}
              {/* Back to Login */}
              <div className="text-center pt-4">
                <button className="text-slate-600 hover:text-slate-800">
                  <Link to="/login" className="flex items-center gap-1">
                    <ArrowLeftIcon fontSize="medium" />
                    {t("back_to_sign_in")}
                  </Link>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            {"Don't have an account? "}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
              {t("sign_free")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
