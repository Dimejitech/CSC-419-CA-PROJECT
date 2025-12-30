import React from 'react';

type MoreHorizProps = {
  className?: string;
};

function MoreHoriz({ className }: MoreHorizProps) {
  return (
    <div className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="12" r="1.5" fill="#4a4a4a"/>
        <circle cx="12" cy="12" r="1.5" fill="#4a4a4a"/>
        <circle cx="18" cy="12" r="1.5" fill="#4a4a4a"/>
      </svg>
    </div>
  );
}

export default function LabResults() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Lab Results</h1>
        <p className="text-xs text-gray-600 mt-1">
          Results from your clinic visits, reviewed by your care team.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div className="bg-[rgba(222,243,255,0.5)] border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-800 mb-2">Total Tests</p>
          <p className="text-2xl font-bold text-gray-800">14</p>
        </div>
        <div className="bg-[rgba(202,255,233,0.5)] border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-[#158058] mb-2">Normal</p>
          <p className="text-2xl font-bold text-[#158058]">10</p>
        </div>
        <div className="bg-[rgba(255,189,195,0.5)] border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-[#880e19] mb-2">Abnormal</p>
          <p className="text-2xl font-bold text-[#880e19]">4</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 justify-end mb-4">
        <button className="px-7 py-3 bg-white border border-gray-200 rounded-lg text-sm flex items-center gap-1">
          All Tests
          <span>▼</span>
        </button>
        <button className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm flex items-center gap-1">
          Last 30 days
          <span>▼</span>
        </button>
        <button className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm flex items-center gap-1">
          Sort: Severity
          <span>▼</span>
        </button>
      </div>

      {/* Lab Results List */}
      <div className="space-y-4">
        {/* Cholesterol Test Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              <h3 className="text-sm font-semibold text-gray-800">Cholesterol Test</h3>
              <span className="px-2 py-1 bg-[#ffd269] text-[#b96f00] text-xs rounded">
                Needs follow-up
              </span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs">
                <span className="text-gray-400">Last Tested:</span>{' '}
                <span className="text-gray-800">May 10, 2025</span>
              </p>
              <MoreHoriz className="cursor-pointer" />
            </div>
          </div>

          {/* Test Details */}
          <div className="grid grid-cols-4 gap-16 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Result:</p>
              <p className="text-sm font-bold text-gray-800">240mg /dL</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Normal Range:</p>
              <p className="text-sm text-gray-800">Below 200mg /dL</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Status:</p>
              <p className="text-sm text-gray-800 flex items-center gap-1">
                <span className="text-red-500">↑</span>
                Above normal
              </p>
            </div>
            <div className="bg-[rgba(171,224,255,0.53)] border border-gray-200 rounded h-full"></div>
          </div>

          {/* Doctor's Notes */}
          <div className="flex items-center justify-between">
            <div className="bg-[#fff7ec] border border-[#ffecd3] rounded-lg p-3 flex items-center gap-2 flex-1 mr-4">
              <span className="text-yellow-500">📄</span>
              <p className="text-sm text-gray-800">
                <strong>Doctor's Notes</strong>: This value is slightly higher than normal. We recommend diet changes and a repeat.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                Download PDF
              </button>
              <button className="px-4 py-2 bg-[#03a5ff] text-white rounded-lg text-sm hover:bg-blue-600">
                Ask a question
              </button>
            </div>
          </div>
        </div>

        {/* Blood Sugar Test Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Blood Sugar Test</h3>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                <span className="text-sm font-semibold text-gray-800">Normal</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-blue-500">→</span>
                <span className="text-sm font-semibold text-gray-800">Stable since last result</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-400">
                Last Tested: <span className="text-gray-800">March 25, 2025</span>
              </p>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Another Blood Sugar Test Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Blood Sugar Test</h3>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                <span className="text-sm font-semibold text-gray-800">Normal</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-blue-500">→</span>
                <span className="text-sm font-semibold text-gray-800">Stable since last result</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-400">
                Last Tested: <span className="text-gray-800">March 25, 2025</span>
              </p>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}