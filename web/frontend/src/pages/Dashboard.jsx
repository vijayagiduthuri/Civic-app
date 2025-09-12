import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data
  const issueData = [
    { category: 'Potholes', open: 45, inProgress: 23, resolved: 67 },
    { category: 'Garbage', open: 32, inProgress: 18, resolved: 89 },
    { category: 'Streetlights', open: 28, inProgress: 15, resolved: 34 },
    { category: 'Water Supply', open: 19, inProgress: 12, resolved: 56 },
    { category: 'Sewage', open: 15, inProgress: 8, resolved: 23 }
  ];

  const pieData = [
    { name: 'Open', value: 139, color: '#ef4444' },
    { name: 'In Progress', value: 76, color: '#f59e0b' },
    { name: 'Resolved', value: 269, color: '#10b981' }
  ];

  const trendData = [
    { month: 'Jan', issues: 120 },
    { month: 'Feb', issues: 135 },
    { month: 'Mar', issues: 148 },
    { month: 'Apr', issues: 162 },
    { month: 'May', issues: 145 },
    { month: 'Jun', issues: 178 }
  ];

  const recentIssues = [
    { id: '#2024-001', category: 'Pothole', location: 'Main Road, Ward 15', priority: 'High', status: 'Open', reported: '2 hours ago' },
    { id: '#2024-002', category: 'Garbage', location: 'Market Street, Ward 8', priority: 'Medium', status: 'In Progress', reported: '4 hours ago' },
    { id: '#2024-003', category: 'Streetlight', location: 'Park Avenue, Ward 3', priority: 'Low', status: 'Open', reported: '6 hours ago' },
    { id: '#2024-004', category: 'Water Supply', location: 'Colony Road, Ward 12', priority: 'High', status: 'Resolved', reported: '1 day ago' }
  ];

  const workers = [
    { name: 'Rajesh Kumar', department: 'Public Works', assigned: 12, completed: 8, rating: 4.5 },
    { name: 'Priya Sharma', department: 'Sanitation', assigned: 15, completed: 13, rating: 4.7 },
    { name: 'Anil Singh', department: 'Electrical', assigned: 9, completed: 7, rating: 4.2 },
    { name: 'Meera Patel', department: 'Water Works', assigned: 11, completed: 9, rating: 4.6 }
  ];

  const wards = [
    { ward: 'Ward 1', totalIssues: 23, resolved: 18, pending: 5, avgTime: '3.2 days' },
    { ward: 'Ward 2', totalIssues: 31, resolved: 25, pending: 6, avgTime: '2.8 days' },
    { ward: 'Ward 3', totalIssues: 19, resolved: 15, pending: 4, avgTime: '4.1 days' },
    { ward: 'Ward 4', totalIssues: 28, resolved: 22, pending: 6, avgTime: '3.5 days' },
    { ward: 'Ward 5', totalIssues: 35, resolved: 28, pending: 7, avgTime: '2.9 days' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-50';
      case 'In Progress': return 'text-yellow-600 bg-yellow-50';
      case 'Resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-sky-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-white">
                <h1 className="text-xl font-semibold">Municipal Civic Management System</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">District Collector Office</span>
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-sky-500 font-medium text-sm">AD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['dashboard', 'issues', 'workers', 'wards', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">Monitor and manage civic issues across all wards</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl font-bold text-red-600">139</div>
                <div className="text-gray-600">Open Issues</div>
                <div className="text-sm text-gray-400 mt-1">+12 from yesterday</div>
              </div>
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">76</div>
                <div className="text-gray-600">In Progress</div>
                <div className="text-sm text-gray-400 mt-1">-5 from yesterday</div>
              </div>
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl font-bold text-green-600">269</div>
                <div className="text-gray-600">Resolved</div>
                <div className="text-sm text-gray-400 mt-1">+23 from yesterday</div>
              </div>
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl font-bold text-sky-600">3.2</div>
                <div className="text-gray-600">Avg Resolution Time</div>
                <div className="text-sm text-gray-400 mt-1">days</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Issues by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={issueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="open" fill="#ef4444" name="Open" />
                    <Bar dataKey="inProgress" fill="#f59e0b" name="In Progress" />
                    <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Overall Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Issues */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Issues</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.reported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Issues</h2>
                <p className="text-gray-600">Manage and assign civic issues</p>
              </div>
              <div className="flex space-x-3">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Categories</option>
                  <option>Potholes</option>
                  <option>Garbage</option>
                  <option>Streetlights</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {issue.status === 'Open' ? 'Unassigned' : 'Rajesh Kumar'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-sky-600 hover:text-sky-900">View</button>
                          <button className="text-sky-600 hover:text-sky-900">Assign</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workers' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Worker Management</h2>
              <p className="text-gray-600">Monitor worker performance and task assignments</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Tasks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workers.map((worker, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{worker.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{worker.assigned}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{worker.completed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            {worker.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-sky-600 hover:text-sky-900">View Profile</button>
                          <button className="text-sky-600 hover:text-sky-900">Assign Task</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wards' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ward-wise Analysis</h2>
              <p className="text-gray-600">Monitor performance across different wards</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Issues</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Resolution Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wards.map((ward, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ward.ward}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ward.totalIssues}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{ward.resolved}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{ward.pending}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ward.avgTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(ward.resolved / ward.totalIssues) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round((ward.resolved / ward.totalIssues) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
              <p className="text-gray-600">Detailed insights and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Monthly Issue Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="issues" stroke="#0ea5e9" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900">Citizen Satisfaction</h4>
                <div className="text-3xl font-bold text-green-600 mt-2">4.2/5</div>
                <p className="text-gray-600 text-sm">Based on 1,245 ratings</p>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900">Response Time</h4>
                <div className="text-3xl font-bold text-sky-600 mt-2">2.4hrs</div>
                <p className="text-gray-600 text-sm">Average first response</p>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900">Most Reported</h4>
                <div className="text-xl font-bold text-gray-900 mt-2">Potholes</div>
                <p className="text-gray-600 text-sm">35% of all issues</p>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900">Resolution Rate</h4>
                <div className="text-3xl font-bold text-green-600 mt-2">78%</div>
                <p className="text-gray-600 text-sm">Issues resolved this month</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;