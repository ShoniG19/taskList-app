import { Link } from 'react-router-dom';

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ArrowLeft from "@mui/icons-material/ArrowBackIosNew";
import ProfileForm from '../components/ProfileForm';

const ProfilePage = () => {
  return (
<div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container px-4 py-4 mx-px">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-0 mr-2">
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  <span className="sr-only">Back to Dashboard</span>
                </Link>
              </button>
              <FactCheckOutlinedIcon className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-800">TaskList</h1>
            </div>
          </div>
        </div>
      </header>

      <ProfileForm />
      
    </div>
  )
}

export default ProfilePage
