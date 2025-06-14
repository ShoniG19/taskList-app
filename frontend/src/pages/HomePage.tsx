import React from 'react';

import { useTranslation } from "react-i18next";

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BoltIcon from '@mui/icons-material/Bolt';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AddIcon from '@mui/icons-material/Add';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';


const Home = () => {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <header className='container mx-auto px-4 py-6'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FactCheckOutlinedIcon className='text-emerald-600' fontSize='large' />
            <span className='text-2xl font-bold text-slate-800'>TaskList</span>
          </div>
          <div className='flex items-center gap-4 font-semibold'>
            <button onClick={() => {window.location.href='/login'}} className='text-slate-600 hover:text-slate-800 rounded-xl p-2'>
              {t('sign_in')}
            </button>
            <button onClick={() => {window.location.href='/register'}} className='bg-emerald-600 hover:bg-emerald-700 rounded-xl p-2 text-white'>
              {t('get_started')}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          <h1 className='text-5xl md:text-6xl font-bold text-slate-800 mb-6'>
            {t('h1_title')}
            <span className='text-emerald-600 ml-1'>{t('span_title')}</span>
          </h1>
          <p className='text-xl text-slate-600 mb-8 max-w-2xl mx-auto'>
            {t('p_title')}
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16 font-semibold'>
            <button onClick={() => {window.location.href='/register'}} className='bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3 rounded-xl text-white'>
              {t('start')}
            </button>
          </div>
        </div>

        <div className='max-w-2xl mx-auto mb-20'>
          <div className='shadow-2xl border-0 bg-white'>
            <div className='p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-semibold text-slate-800'>
                  {t('today_tasks')}
                </h3>
                <button className='bg-emerald-600 hover:bg-emerald-700 rounded-xl p-2 text-white font-semibold items-center flex'>
                  <AddIcon className='mr-2' fontSize='small' />
                  {t('add_task')}
                </button>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                  <TaskAltIcon className='w-8 h-8 text-emerald-600' />
                  <span className='text-slate-600 line-through'>
                    {t('review_project')}
                  </span>
                </div>
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                  <div className='w-5 h-5 border-2 border-slate-300 rounded-full'></div>
                  <span className='text-slate-800'>
                    {t('prepare_slides')}
                  </span>
                  <span className='ml-auto text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded'>
                    {t('high')}
                  </span>
                </div>
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                  <div className='w-5 h-5 border-2 border-slate-300 rounded-full'></div>
                  <span className='text-slate-800'>
                    {t('call_client')}
                  </span>
                  <span className='ml-auto text-sm text-green-600 bg-green-100 px-2 py-1 rounded'>
                    {t('low')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20 mt-16'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <AdjustOutlinedIcon className='text-emerald-600' fontSize='large' />
              </div>
              <h3 className='text-xl font-semibold text-slate-800 mb-2'>
                {t('stay_focused')}
              </h3>
              <p className='text-slate-600'>
                {t('prioritize_tasks')}
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CalendarTodayIcon className='text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-slate-800 mb-2'>
                {t('never_miss')}
              </h3>
              <p className='text-slate-600'>
                {t('set_due')}
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <BoltIcon className='text-emerald-600' fontSize='large' />
              </div>
              <h3 className='text-xl font-semibold text-slate-800 mb-2'>
                {t('lightning_fast')}
              </h3>
              <p className='text-slate-600'>
                {t('add_edit_complete')}
              </p>
            </div>
          </div>
        </div>

        <div className='text-center bg-emerald-600 rounded-2xl p-12 text-white'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            {t('ready_to_organized')}
          </h2>
          <p className='text-xl text-emerald-100 mb-8 max-w-2xl mx-auto'>
            {t('join_thousands')}
          </p>
          <button onClick={() => {window.location.href='/register'}} className='text-lg px-8 py-3 bg-white text-emerald-600 hover:bg-slate-50 rounded-xl'>
            {t('start_account')}
          </button>
          <p className='text-sm text-emerald-200 mt-4'>
            {t('no_credit')}
          </p>
        </div>
      </main>

      <footer className='container mx-auto px-4 py-8 mt-20 border-t border-slate-200'>
        <div className='flex flex-col md:flex-row items-center justify-between text-slate-600'>
          <div className='flex items-center gap-2 mb-4 md:mb-0'>
            <FactCheckOutlinedIcon className='text-emerald-600' fontSize='medium' />
            <span className='font-semibold'>TaskList</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
