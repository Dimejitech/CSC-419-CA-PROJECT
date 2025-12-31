import React, { useState } from 'react';
import { Bell, Calendar, FileText, CreditCard, TestTube, User, HelpCircle, LogOut, Home, Menu, Search } from 'lucide-react';
import logo from "/Users/paulairabor/Documents/year4-sem1/advances/CSC-419-CA-PROJECT/Vector.png";


interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  status: 'upcoming' | 'completed';
  image: string;
}

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      date: 'Thursday, January 15, 2026',
      time: '10:00 A.M.',
      doctor: 'Dr Sarah Lee',
      department: 'Cardiology Department',
      status: 'upcoming',
      image: '👩‍⚕️'
    }
  ];

  const pastAppointments: Appointment[] = [
    {
      id: '2',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      doctor: 'Dr James Blake',
      department: 'General Medicine',
      status: 'completed',
      image: '👨‍⚕️'
    },
    {
      id: '3',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      doctor: 'Dr James Blake',
      department: 'General Medicine',
      status: 'completed',
      image: '👨‍⚕️'
    },
    {
      id: '4',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      doctor: 'Dr James Blake',
      department: 'General Medicine',
      status: 'completed',
      image: '👨‍⚕️'
    },
    {
      id: '5',
      date: 'Monday, April 15, 2025',
      time: '1:00 P.M.',
      doctor: 'Dr James Blake',
      department: 'General Medicine',
      status: 'completed',
      image: '👨‍⚕️'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src={logo} alt="icon" className="w-6 h-6 rounded" />
            <span className="text-xl font-bold text-gray-800">CityCare</span>
          </div>

          {/* Navigation Header */}
          <div className="flex items-center gap-3 mb-4 px-3">
            <Menu className="w-5 h-5 text-gray-600" />
            <span className="text-cyan-500 font-semibold">Navigation</span>
          </div>

          {/* Main Navigation */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 mb-3 px-3">Main</div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 bg-cyan-500 text-white rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>Appointments</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FileText className="w-5 h-5" />
                <span>Medical Records</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FileText className="w-5 h-5" />
                <span>Prescriptions</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <TestTube className="w-5 h-5" />
                <span>Lab Results</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <CreditCard className="w-5 h-5" />
                <span>Billing</span>
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
              </a>
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-3 px-3">Secondary</div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span>Help / Support</span>
              </a>
            </nav>
          </div>

          {/* Logout */}
          <button className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-8 w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500"></div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">John Doe</div>
                  <div className="text-sm text-cyan-500">Patient</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
            <button className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium">
              Book Appointment
            </button>
          </div>

          {/* Upcoming Appointments */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-cyan-500 mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-cyan-500" />
                  </div>
                  <span className="font-semibold text-gray-800">{appointment.date} | {appointment.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                      {appointment.image}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{appointment.doctor}</div>
                      <div className="text-sm text-gray-500">{appointment.department}</div>
                    </div>
                  </div>
                  <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium">
                    View Details
                  </button>
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Reschedule
                  </button>
                  <button className="px-6 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Past Appointments */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-cyan-500">Past Appointments</h2>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View More
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                        {appointment.image}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{appointment.date}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="font-semibold text-gray-800">{appointment.doctor}</div>
                    <div className="text-sm text-gray-500">{appointment.department}</div>
                  </div>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    View Summary
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;