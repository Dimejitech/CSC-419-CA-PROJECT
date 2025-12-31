import { useState } from 'react';
import { Home, Calendar, FileText, FlaskConical, CreditCard, User, HelpCircle, LogOut, Search, Bell, FileStack} from 'lucide-react';
import logo from "/Users/paulairabor/Documents/year4-sem1/advances/CSC-419-CA-PROJECT/Vector.png";

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src={logo} alt="icon" className="w-6 h-6 rounded" />
            <span className="text-2xl font-semibold text-gray-800">CityCare</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase mb-3">Main</h3>
            <nav className="space-y-1">
              <NavItem icon={<Home size={20} />} label="Home" />
              <NavItem icon={<Calendar size={20} />} label="Appointments" />
              <NavItem icon={<FileText size={20} />} label="Medical Records" active />
              <NavItem icon={<FileStack size={20} />} label="Prescriptions" />
              <NavItem icon={<FlaskConical size={20} />} label="Lab Results" />
              <NavItem icon={<CreditCard size={20} />} label="Billing" badge />
            </nav>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase mb-3">Secondary</h3>
            <nav className="space-y-1">
              <NavItem icon={<User size={20} />} label="Profile" />
              <NavItem icon={<HelpCircle size={20} />} label="Help / Support" />
            </nav>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={24} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="John Doe"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-800">John Doe</div>
                  <div className="text-sm text-teal-600">Patient</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-2">
              Medical Records › Overview
            </div>

            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
              <p className="text-gray-600">A summary of your health information from your clinic visits.</p>
            </div>

            {/* Patient Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="John Doe"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">John Doe</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Date of Birth: <span className="font-medium text-gray-900">Feb 15, 1985</span></span>
                    <span className="text-gray-300">|</span>
                    <span>Blood Group: <span className="font-medium text-gray-900">O+</span></span>
                  </div>
                </div>
              </div>

              {/* Allergy Warning */}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">Allergies - </span>
                  <span className="text-gray-700">Penicillin</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Visit History
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Diagnoses Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnoses</h3>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Hypertension</div>
                    <div className="text-sm text-gray-600">High Blood Pressure</div>
                  </div>
                </div>
              </div>

              {/* Current Medications Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                <div className="text-gray-500 text-sm">No current medications</div>
              </div>

              {/* Recent Lab Results Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Lab Results</h3>
                <div className="text-gray-500 text-sm">No recent lab results</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge = false }: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  badge?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition-colors relative ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {badge && (
        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}