"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Droplets,
  Star,
  Calendar,
  Filter,
  Eye,
  UserCheck,
  Award,
  Target,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Pie,
} from "recharts";
import Navbar from "../components/Navbar";

const Overview = () => {
  const currentPage = "overview";

  const [department, setDepartment] = useState("");

  useEffect(() => {
    const email = sessionStorage.getItem("adminEmail");
    if (email) {
      axios
        .post("http://localhost:9000/api/admin/get-department", { email })
        .then((res) => {
          if (res.data.success && res.data.data.department) {
            let dept = res.data.data.department;

            // Convert to title case
            dept = dept.replace(
              /\w\S*/g,
              (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );

            // Ensure "Department" word is included
            if (!dept.toLowerCase().includes("department")) {
              dept = `${dept} Department`;
            }

            setDepartment(dept);
          } else {
            setDepartment("Unknown Department");
          }
        })
        .catch((err) => {
          console.error("Error fetching department:", err);
          setDepartment("Unknown Department");
        });
    }
  }, []);

  // Data from the analyzed files
  const issuesData = [
    {
      id: "SAN-2024-001",
      title: "Overflowing Garbage Bin at MG Road Junction",
      status: "Open",
      priority: "High",
      category: "Waste Management",
      dateReported: "2024-01-15",
      upvotes: 78,
    },
    {
      id: "SAN-2024-002",
      title: "Blocked Sewage Drain in Koramangala",
      status: "In Progress",
      priority: "Medium",
      category: "Sewage & Drainage",
      dateReported: "2024-01-14",
      upvotes: 92,
    },
    {
      id: "SAN-2024-003",
      title: "Unsanitary Public Restroom at Cubbon Park",
      status: "Resolved",
      priority: "High",
      category: "Public Toilet Maintenance",
      dateReported: "2024-01-13",
      upvotes: 34,
    },
    {
      id: "SAN-2024-004",
      title: "Illegal Waste Dumping Site",
      status: "In Progress",
      priority: "High",
      category: "Illegal Waste Dumping",
      dateReported: "2024-01-12",
      upvotes: 67,
    },
    {
      id: "SAN-2024-005",
      title: "Broken Sewer Manhole Cover",
      status: "Open",
      priority: "High",
      category: "Sewer System Maintenance",
      dateReported: "2024-01-11",
      upvotes: 45,
    },
    {
      id: "SAN-2024-006",
      title: "Street Sweeping Required on Commercial Street",
      status: "Resolved",
      priority: "Medium",
      category: "Street Cleaning",
      dateReported: "2024-01-10",
      upvotes: 23,
    },
  ];

  const workersData = [
    {
      name: "Suresh Patil",
      department: "Sewage & Drainage",
      resolvedCount: 1,
      status: "available",
    },
    {
      name: "Lakshmi Devi",
      department: "Public Toilet Maintenance",
      resolvedCount: 2,
      status: "busy",
    },
    {
      name: "Ravi Kumar",
      department: "Waste Enforcement",
      resolvedCount: 1,
      status: "available",
    },
    {
      name: "Manoj Yadav",
      department: "Street Cleaning",
      resolvedCount: 1,
      status: "available",
    },
    {
      name: "Pradeep Sharma",
      department: "Waste Management",
      resolvedCount: 1,
      status: "available",
    },
    {
      name: "Anita Reddy",
      department: "Public Health",
      resolvedCount: 1,
      status: "available",
    },
  ];

  // Calculate metrics
  const totalIssues = issuesData.length;
  const openIssues = issuesData.filter(
    (issue) => issue.status === "Open"
  ).length;
  const inProgressIssues = issuesData.filter(
    (issue) => issue.status === "In Progress"
  ).length;
  const resolvedIssues = issuesData.filter(
    (issue) => issue.status === "Resolved"
  ).length;
  const highPriorityIssues = issuesData.filter(
    (issue) => issue.priority === "High"
  ).length;
  const totalWorkers = workersData.length;
  const availableWorkers = workersData.filter(
    (worker) => worker.status === "available"
  ).length;
  //const totalResolvedByWorkers = workersData.reduce((sum, worker) => sum + worker.resolvedCount, 0);
  const avgResolutionTime = 2.3; // days
  const communityEngagement = issuesData.reduce(
    (sum, issue) => sum + issue.upvotes,
    0
  );

  // Chart data
  const statusChartData = [
    { name: "Open", value: openIssues, color: "#ef4444" },
    { name: "In Progress", value: inProgressIssues, color: "#f97316" },
    { name: "Resolved", value: resolvedIssues, color: "#22c55e" },
  ];

  const categoryChartData = [
    {
      category: "Waste Management",
      count: issuesData.filter((i) => i.category === "Waste Management").length,
    },
    {
      category: "Sewage & Drainage",
      count: issuesData.filter((i) => i.category === "Sewage & Drainage")
        .length,
    },
    {
      category: "Public Toilets",
      count: issuesData.filter(
        (i) => i.category === "Public Toilet Maintenance"
      ).length,
    },
    {
      category: "Street Cleaning",
      count: issuesData.filter((i) => i.category === "Street Cleaning").length,
    },
    {
      category: "Illegal Dumping",
      count: issuesData.filter((i) => i.category === "Illegal Waste Dumping")
        .length,
    },
    {
      category: "Sewer System",
      count: issuesData.filter((i) => i.category === "Sewer System Maintenance")
        .length,
    },
  ];

  const monthlyTrendData = [
    { month: "Oct", reported: 8, resolved: 6 },
    { month: "Nov", reported: 12, resolved: 9 },
    { month: "Dec", reported: 15, resolved: 13 },
    { month: "Jan", reported: 6, resolved: 2 },
  ];

  const topPerformersData = workersData
    .sort((a, b) => b.resolvedCount - a.resolvedCount)
    .slice(0, 3);

  const priorityDistribution = [
    {
      name: "High",
      value: issuesData.filter((i) => i.priority === "High").length,
      color: "#dc2626",
    },
    {
      name: "Medium",
      value: issuesData.filter((i) => i.priority === "Medium").length,
      color: "#d97706",
    },
    {
      name: "Low",
      value: issuesData.filter((i) => i.priority === "Low").length || 1,
      color: "#16a34a",
    },
  ];

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = "sky",
  }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border border-${color}-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex items-center justFify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
            {trend && (
              <div
                className={`flex items-center text-xs ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend === "up" ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}
        >
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border border-sky-100 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar currentPage={currentPage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {department ? `${department} Management Overview` : "Loading..."}
          </h1>
          <p className="text-gray-600">
            Comprehensive dashboard for monitoring city{" "}
            {department ? department.toLowerCase() : ""} operations
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Issues"
            value={totalIssues}
            subtitle="Active reports"
            icon={Droplets}
            trend="up"
            trendValue="12%"
            color="sky"
          />
          <MetricCard
            title="High Priority"
            value={highPriorityIssues}
            subtitle="Urgent attention needed"
            icon={AlertTriangle}
            color="red"
          />
          <MetricCard
            title="Available Workers"
            value={availableWorkers}
            subtitle={`of ${totalWorkers} total`}
            icon={Users}
            color="green"
          />
          <MetricCard
            title="Avg Resolution"
            value={`${avgResolutionTime}d`}
            subtitle="Average days to resolve"
            icon={Clock}
            trend="down"
            trendValue="0.5d"
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Issue Status Distribution */}
          <ChartCard title="Issue Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {statusChartData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Issues by Category */}
          <ChartCard title="Issues by Category">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Monthly Trend and Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <ChartCard title="Monthly Issue Trends">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="reported"
                  stroke="#ef4444"
                  fill="#fef2f2"
                  name="Reported"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#22c55e"
                  fill="#f0fdf4"
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Priority Distribution */}
          <ChartCard title="Priority Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={priorityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {priorityDistribution.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.name} Priority
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Bottom Row - Top Performers and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <ChartCard title="Top Performing Workers">
            <div className="space-y-4">
              {topPerformersData.map((worker, index) => (
                <div
                  key={worker.name}
                  className="flex items-center justify-between p-4 bg-sky-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-sky-600 text-white rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{worker.name}</p>
                      <p className="text-xs text-gray-500">
                        {worker.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-green-600">
                        {worker.resolvedCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">resolved</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Community Engagement */}
          <ChartCard title="Community Engagement Metrics">
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {communityEngagement}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Total Community Upvotes
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>High Interest: 2 issues (50+ upvotes)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">83%</div>
                  <p className="text-xs text-gray-600">Citizen Satisfaction</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1.2k</div>
                  <p className="text-xs text-gray-600">Active Citizens</p>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  );
};

export default Overview;
