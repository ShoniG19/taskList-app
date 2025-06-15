import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { login } from '../api/auth';

import type { LoginData } from '../types/auth';

import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import Mail from '@mui/icons-material/Mail';
import Lock from '@mui/icons-material/Lock';
import Eye from '@mui/icons-material/Visibility';
import EyeOff from '@mui/icons-material/VisibilityOff';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await login(formData)
      if (response?.token) {
        localStorage.setItem('token', response.token)
        toast.success(t('login_successful'));
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error: unknown) {
      let message = 'Error desconocido al iniciar sesión';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message || message;
      }
      setError(message)
      setFormData({
        email: '',
        password: '',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='*:min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <FactCheckOutlinedIcon className='text-emerald-600' fontSize='large' />
            <span className='text-3xl font-bold text-slate-800'>TaskList</span>
          </div>
          <p className='text-slate-600'>{t('welcome_back')}</p>
        </div>

        {/* Login Form */}
        <div className='shadow-xl border-0 rounded-lg'>
          <div className='space-y-1 pb-6'>
            <h2 className='text-2xl font-bold text-center'>{t('sign_in')}</h2>
            <p className='text-center'>{t('credentials')}</p>
          </div>
          <div className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Email Field */}
              <div className='space-y-2'>
                <h1>{t('email')}</h1>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400' fontSize='small' />
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder={t('placeholder_email')}
                    value={formData.email}
                    onChange={handleInputChange}
                    className='pl-10  p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <h1>{t('password')}</h1>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400' fontSize='small' />
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('placeholder_password')}
                    value={formData.password}
                    onChange={handleInputChange}
                    className='pl-10 pr-10 p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
                  >
                    {showPassword ? <EyeOff fontSize='small' /> : <Eye fontSize='small' />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className='flex justify-end'>
                <Link to='/forgot-password' className='text-sm text-emerald-600 hover:text-emerald-700 hover:underline'>
                  {t('forgot_password')}
                </Link>
              </div>

              {/* Submit Button */}
              <button type='submit' className='w-full rounded-lg text-white font-semibold bg-emerald-600 hover:bg-emerald-700 h-11' disabled={isLoading}>
                {isLoading ? <><RotateRightIcon className='animate-spin mr-2'/>{t('loading')}</>: t('sign_in')}
              </button>
              {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
            </form>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className='text-center mt-6'>
          <p className='text-slate-600'>
            {t('not_account')}
            <Link to='/register' className='text-emerald-600 hover:text-emerald-700 font-semibold hover:underline ml-2'>
              {t('sign_free')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
