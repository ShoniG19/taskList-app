import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from "react-i18next";

import type { RegisterData } from '../types/auth';
import { register } from '../api/auth';

import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import User from '@mui/icons-material/Person';
import Mail from '@mui/icons-material/Mail';
import Lock from '@mui/icons-material/Lock';
import Eye from '@mui/icons-material/Visibility';
import EyeOff from '@mui/icons-material/VisibilityOff';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { toast } from 'react-toastify';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
   const [error, setError] = useState<string | null>(null)

  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*/\-_=+<>?])[A-Za-z0-9!@#$%^&*/\-_=+<>?]{8,}$/;

    if (!formData.name?.trim()) {
      newErrors.name = t('name_required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email_invalid');
    }
        
    if (!formData.password) {
      newErrors.password = t('password_required');
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = t('password_invalid');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('not_match');
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try{
        const response = await register(formData)
        if(response) {
          toast.success(t('account_created'));
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
    } catch (error: unknown) {
      let message = 'Error desconocido al iniciar sesión';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message || message;
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <FactCheckOutlinedIcon className='text-emerald-600' fontSize='large' />
            <span className='text-3xl font-bold text-slate-800'>TaskList</span>
          </div>
          <p className='text-slate-600'>{t('create_account')}</p>
        </div>

        {/* Register Form */}
        <div className='shadow-xl border-0 rounded-lg'>
          <div className='space-y-1 pb-6'>
            <h2 className='text-2xl font-bold text-center'>{t('create')}</h2>
            <p className='text-center'>{t('sign_to_start')}</p>
          </div>
          <div className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Name Field */}
              <div className='space-y-2'>
                <h1 >{t('full_name')}</h1>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400' fontSize='small' />
                  <input
                    id='name'
                    name='name'
                    type='text'
                    placeholder={t('placeholder_full_name')}
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 p-2 w-full ${errors.name ? 'border-red-500' : ''}  border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    required
                  />
                </div>
                {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
              </div>

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
                    className={`pl-10 p-2 w-full ${errors.email ? 'border-red-500' : ''}  border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    required
                  />
                </div>
                {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
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
                    className={`pl-10 pr-10 p-2 w-full ${errors.password ? 'border-red-500' : ''}  border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
                  >
                    {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
                {errors.password && <p className='text-sm text-red-500'>{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className='space-y-2'>
                <h1>{t('confirm_password')}</h1>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400' fontSize='small' />
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('placeholder_confirm_password')}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 p-2 w-full ${errors.confirmPassword ? 'border-red-500' : ''}  border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
                  >
                    {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
                {errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword}</p>}
              </div>

              <button type='submit' className='w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-white font-semibold rounded-lg' disabled={isLoading}>
                {isLoading ? <><RotateRightIcon className="animate-spin mr-2"/><span>{t('loading')}</span></> : t('create')}
              </button>
                {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
            </form>
          </div>
        </div>

        {/* Sign In Link */}
        <div className='text-center mt-6'>
          <p className='text-slate-600'>
            {t('already_account')}{' '}
            <Link to='/login' className='text-emerald-600 hover:text-emerald-700 font-semibold hover:underline'>
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;