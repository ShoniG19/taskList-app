import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import LoginPage from './components/LoginForm';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from './pages/ProfilePage';
import RequestResetPage from './pages/RequestResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path='/forgot-password' element={<RequestResetPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
