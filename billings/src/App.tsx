import { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  FileText, 
  CreditCard, 
  TestTube, 
  User, 
  HelpCircle, 
  LogOut, 
  Home, 
  Menu, 
  Search 
} from 'lucide-react';
import logo from "/Users/paulairabor/Documents/year4-sem1/advances/CSC-419-CA-PROJECT/Vector.png";

interface Invoice {
  id: string;
  description: string;
  date: string;
  amount: string;
  amountColor: string;
}

interface Payment {
  id: string;
  method: string;
  amount: string;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const recentInvoices: Invoice[] = [
    {
      id: '#00258',
      description: 'For diabetes management',
      date: 'April 19, 2025',
      amount: '₦50,000',
      amountColor: 'text-red-500'
    },
    {
      id: '#00258',
      description: 'Annual Check-up',
      date: 'Feb 10, 2025',
      amount: '₦100,000',
      amountColor: 'text-green-500'
    },
    {
      id: '#00258',
      description: 'Cardiology Consultation',
      date: 'January 20, 2025',
      amount: '₦50,000',
      amountColor: 'text-green-500'
    },
    {
      id: '#00258',
      description: 'Amlodipine 500mg',
      date: 'April 19, 2025',
      amount: '₦20,000',
      amountColor: 'text-green-500'
    },
    {
      id: '#00258',
      description: 'For diabetes management',
      date: 'April 19, 2025',
      amount: '₦50,000',
      amountColor: 'text-green-500'
    }
  ];

  const paymentHistory: Payment[] = [
    { id: '#00258', method: 'Credit Card', amount: '₦50,000' },
    { id: '#00258', method: 'Credit Card', amount: '₦50,000' },
    { id: '#00258', method: 'Online Payment', amount: '₦50,000' },
    { id: '#00258', method: 'Credit Card', amount: '₦50,000' },
    { id: '#00258', method: 'Credit Card', amount: '₦50,000' }
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
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
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
              <a href="#" className="flex items-center gap-3 px-3 py-2 bg-cyan-500 text-white rounded-lg">
                <CreditCard className="w-5 h-5" />
                <span>Billing</span>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Billing</h1>

          {/* Outstanding Balance Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 mb-2">Outstanding Balance</div>
                <div className="text-4xl font-bold text-red-500">₦120,000</div>
              </div>
              <button className="px-8 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium">
                Pay Now
              </button>
            </div>
          </div>

          {/* Recent Invoices and Payment History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Invoices</h2>
              
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm text-gray-500">
                <div className="col-span-3">Invoice ID</div>
                <div className="col-span-6">Description</div>
                <div className="col-span-3 text-right">Amount</div>
              </div>

              {/* Table Body */}
              <div className="space-y-4 mt-4">
                {recentInvoices.map((invoice, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-3 text-gray-800 font-medium">{invoice.id}</div>
                    <div className="col-span-6">
                      <div className="text-gray-800">{invoice.description}</div>
                      <div className="text-gray-500 text-xs mt-1">{invoice.date}</div>
                    </div>
                    <div className={`col-span-3 text-right font-semibold ${invoice.amountColor}`}>
                      {invoice.amount}
                    </div>
                  </div>
                ))}
              </div>

              <button className="text-cyan-500 text-sm font-medium mt-6 hover:text-cyan-600 transition-colors">
                View All Invoices &gt;&gt;
              </button>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>
              
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm text-gray-500">
                <div className="col-span-4">Payment ID</div>
                <div className="col-span-4">Method</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>

              {/* Table Body */}
              <div className="space-y-4 mt-4">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-4 text-gray-800 font-medium">{payment.id}</div>
                    <div className="col-span-4 text-gray-800">{payment.method}</div>
                    <div className="col-span-4 text-right text-gray-800 font-semibold">
                      {payment.amount}
                    </div>
                  </div>
                ))}
              </div>

              <button className="text-cyan-500 text-sm font-medium mt-6 hover:text-cyan-600 transition-colors">
                View All Payments &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;