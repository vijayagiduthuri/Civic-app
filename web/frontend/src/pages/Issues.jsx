"use client"

import { useState } from "react"
import {
  Eye,
  UserCheck,
  X,
  Search,
  MapPin,
  Calendar,
  User,
  Star,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Navigation,
  ExternalLink,
  Trash2,
  AlertTriangle,
  Droplets,
} from "lucide-react"

const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-sky-600 text-white hover:bg-sky-700",
    outline: "border border-sky-600 text-sky-600 hover:bg-sky-50",
    ghost: "text-sky-600 hover:bg-sky-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-sky-100 text-sky-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-sky-200 text-sky-800",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  )
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Select = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
    </div>
  )
}

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>

const DialogHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">{children}</div>
)

const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
)

export default function Issues() {
  // Define current page for navigation highlighting
  const currentPage = "issues"
  
  const [issues, setIssues] = useState([
    {
      id: "SAN-2024-001",
      photo:
        "https://images.stockcake.com/public/f/b/4/fb45bb5c-79c3-47c3-aa3b-88cf36aa3352_large/urban-waste-overflow-stockcake.jpg",
      location: "MG Road & Brigade Road Junction",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      dateReported: "2024-01-15",
      citizenName: "Rajesh Kumar",
      citizenEmail: "rajesh.kumar@gmail.com",
      status: "Open",
      assignedWorker: null,
      priority: "High",
      category: "Waste Management",
      description:
        "Large garbage bin overflowing with waste, attracting pests and creating unsanitary conditions. Garbage scattered around the area.",
    },
    {
      id: "SAN-2024-002",
      photo:
        "https://img.freepik.com/premium-photo/storm-drain-clogged-with-trash-debris-causing-flooding-contamination_974629-202395.jpg",
      location: "Koramangala 4th Block & 80 Feet Road",
      coordinates: { lat: 12.9352, lng: 77.6245 },
      dateReported: "2024-01-14",
      citizenName: "Priya Sharma",
      citizenEmail: "priya.sharma@gmail.com",
      status: "In Progress",
      assignedWorker: "Suresh Patil",
      priority: "Medium",
      category: "Drainage System",
      description:
        "Storm drain completely blocked with leaves, debris, and litter. Water pooling during rain, creating potential flooding risk.",
    },
    {
      id: "SAN-2024-003",
      photo: "https://www.shutterstock.com/image-photo/dirty-public-toilet-room-600nw-1111510655.jpg",
      location: "Cubbon Park Public Restroom",
      coordinates: { lat: 12.9698, lng: 77.5906 },
      dateReported: "2024-01-13",
      citizenName: "Amit Patel",
      citizenEmail: "amit.patel@yahoo.com",
      status: "Resolved",
      assignedWorker: "Lakshmi Devi",
      priority: "High",
      category: "Public Restrooms",
      description:
        "Public restroom in extremely unsanitary condition. Broken fixtures, no soap, and poor maintenance affecting public health.",
    },
    {
      id: "SAN-2024-004",
      photo:
        "https://circularphiladelphia.org/staging/wp-content/uploads/2022/10/Construction_debris_dumped_709x399.jpg",
      location: "Whitefield Industrial Area - Service Road",
      coordinates: { lat: 12.9698, lng: 77.7499 },
      dateReported: "2024-01-12",
      citizenName: "Deepika Reddy",
      citizenEmail: "deepika.reddy@hotmail.com",
      status: "In Progress",
      assignedWorker: "Ravi Kumar",
      priority: "High",
      category: "Illegal Dumping",
      description:
        "Large pile of construction debris and household waste illegally dumped in service road. Environmental hazard and blocking access.",
    },
    {
      id: "SAN-2024-005",
      photo:
        "https://media.istockphoto.com/id/1248462267/photo/close-up-of-ruptured-sewer-rusty-pipeline-which-cause-sewage-leakage-stream-and-pollution-old.jpg?s=612x612&w=0&k=20&c=fFaVqjGjC-wVGNc0b7fJtZ7E5cl4AOzM1__QETSlZ5k=",
      location: "Jayanagar 4th Block - 11th Main Road",
      coordinates: { lat: 12.9279, lng: 77.5937 },
      dateReported: "2024-01-11",
      citizenName: "Vikram Singh",
      citizenEmail: "vikram.singh@gmail.com",
      status: "Open",
      assignedWorker: null,
      priority: "Medium",
      category: "Sewer System",
      description:
        "Broken sewer cover creating safety hazard and potential for sewer gas leakage. Cover partially collapsed into opening.",
    },
    {
      id: "SAN-2024-006",
      photo: "https://tse4.mm.bing.net/th/id/OIP.B04dWyGds6Tlp1SP0YZPDQHaDt?pid=Api&P=0&h=180",
      location: "Forum Mall - Hosur Road",
      coordinates: { lat: 12.9279, lng: 77.6271 },
      dateReported: "2024-01-10",
      citizenName: "Anita Gupta",
      citizenEmail: "anita.gupta@rediffmail.com",
      status: "Resolved",
      assignedWorker: "Manoj Yadav",
      priority: "Low",
      category: "Recycling Management",
      description:
        "Multiple recycling bins overflowing with materials scattered by wind. Affecting cleanliness of shopping area.",
    },
  ])

  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const [selectedWorker, setSelectedWorker] = useState("")
  const [assignmentNote, setAssignmentNote] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")

  const workers = ["Suresh Patil", "Lakshmi Devi", "Ravi Kumar", "Manoj Yadav", "Pradeep Sharma"]

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.citizenName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "All" || issue.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue)
    setShowDetailModal(true)
  }

  const handleAssignWorker = (issue) => {
    setSelectedIssue(issue)
    setShowAssignModal(true)
  }

  const handleStatusUpdate = (issue) => {
    setSelectedIssue(issue)
    setShowStatusModal(true)
  }

  const handlePhotoClick = (photo, index = 0) => {
    setSelectedPhoto(photo)
    setCurrentPhotoIndex(index)
    setShowPhotoModal(true)
  }

  const updateIssueStatus = (issueId, newStatus, note, assignedWorker = null) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) => {
        if (issue.id === issueId) {
          const updatedIssue = {
            ...issue,
            status: newStatus,
          }
          if (assignedWorker) {
            updatedIssue.assignedWorker = assignedWorker
          }
          return updatedIssue
        }
        return issue
      }),
    )
  }

  const handleAssignWorkerSubmit = () => {
    if (selectedWorker && selectedIssue) {
      updateIssueStatus(selectedIssue.id, "In Progress", assignmentNote || "Worker assigned", selectedWorker)
      setSelectedWorker("")
      setAssignmentNote("")
      setShowAssignModal(false)
    }
  }

  const handleStatusUpdateSubmit = () => {
    if (newStatus && selectedIssue) {
      updateIssueStatus(selectedIssue.id, newStatus, statusNote || "Status updated")
      setNewStatus("")
      setStatusNote("")
      setShowStatusModal(false)
    }
  }

  const FunctionalMap = ({ coordinates, location }) => {
    const [mapZoom, setMapZoom] = useState(15)

    const openInGoogleMaps = () => {
      const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
      window.open(url, "_blank")
    }

    const getDirections = () => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
      window.open(url, "_blank")
    }

    return (
      <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg p-6 border border-sky-200">
        <div className="text-center mb-4">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <MapPin className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <h4 className="font-semibold text-sky-900 mb-1">Issue Location</h4>
          <p className="text-sm text-sky-700 mb-2">{location}</p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={getDirections} className="text-xs bg-transparent">
              <Navigation className="h-3 w-3 mr-1" />
              Directions
            </Button>
            <Button size="sm" variant="outline" onClick={openInGoogleMaps} className="text-xs bg-transparent">
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Maps
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 shadow-xl border-b border-sky-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Trash2 className="h-5 w-5 text-sky-600 group-hover:text-sky-700 transition-colors duration-300" />
                </div>
                <span className="text-white font-bold text-lg tracking-wide drop-shadow-sm">Gov Portal</span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-2">
                <a
                  href="/home"
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    currentPage === "home"
                      ? "text-white bg-white/10 backdrop-blur-sm font-semibold border-b-2 border-sky-300 shadow-sm"
                      : "text-sky-100 hover:text-white hover:bg-white/10 backdrop-blur-sm font-medium hover:border-b-2 hover:border-sky-300 hover:shadow-md transform hover:-translate-y-0.5"
                  }`}
                >
                  Home
                </a>
                <a
                  href="/issues"
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    currentPage === "issues"
                      ? "text-white bg-white/10 backdrop-blur-sm font-semibold border-b-2 border-sky-300 shadow-sm"
                      : "text-sky-100 hover:text-white hover:bg-white/10 backdrop-blur-sm font-medium hover:border-b-2 hover:border-sky-300 hover:shadow-md transform hover:-translate-y-0.5"
                  }`}
                >
                  Issues
                </a>
                <a
                  href="/workers"
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    currentPage === "workers"
                      ? "text-white bg-white/10 backdrop-blur-sm font-semibold border-b-2 border-sky-300 shadow-sm"
                      : "text-sky-100 hover:text-white hover:bg-white/10 backdrop-blur-sm font-medium hover:border-b-2 hover:border-sky-300 hover:shadow-md transform hover:-translate-y-0.5"
                  }`}
                >
                  Workers
                </a>
                <a
                  href="/overview"
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    currentPage === "overview"
                      ? "text-white bg-white/10 backdrop-blur-sm font-semibold border-b-2 border-sky-300 shadow-sm"
                      : "text-sky-100 hover:text-white hover:bg-white/10 backdrop-blur-sm font-medium hover:border-b-2 hover:border-sky-300 hover:shadow-md transform hover:-translate-y-0.5"
                  }`}
                >
                  Overview
                </a>
              </div>
            </div>

            {/* Right side - User info */}
            <div className="flex items-center space-x-4 group">
              <div className="text-white text-sm">
                <span className="font-semibold drop-shadow-sm">Sanitation Department</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ring-2 ring-white/20 group-hover:ring-white/40">
                <User className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Filters and Search */}
        <Card className="mb-8 shadow-lg border-sky-100">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 h-5 w-5" />
                <Input
                  placeholder="Search sanitation issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </Select>
              <div className="flex items-center justify-between bg-sky-50 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-sky-700">
                  {filteredIssues.length} issue{filteredIssues.length !== 1 ? "s" : ""} found
                </span>
                <Droplets className="h-5 w-5 text-sky-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              className="shadow-lg border-sky-100 hover:shadow-xl transition-all duration-300 hover:border-sky-200"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Fixed Image Section with proper padding and aspect ratio */}
                  <div className="lg:w-80 lg:flex-shrink-0 p-4">
                    <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={issue.photo || "/placeholder.svg"}
                        alt="Sanitation Issue"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => handlePhotoClick(issue.photo)}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getPriorityColor(issue.priority)} shadow-lg`}>
                          {issue.priority} Priority
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className={`${getStatusColor(issue.status)} shadow-lg`}>{issue.status}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between h-full">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-sky-900">{issue.id}</h3>
                            <Badge variant="outline" className="text-sky-600 border-sky-200">
                              {issue.category}
                            </Badge>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{issue.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-sky-500" />
                              <span className="text-sm font-medium text-gray-700">Location:</span>
                              <span className="text-sm text-gray-600">{issue.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-sky-500" />
                              <span className="text-sm font-medium text-gray-700">Reported:</span>
                              <span className="text-sm text-gray-600">{issue.dateReported}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-sky-500" />
                              <span className="text-sm font-medium text-gray-700">Citizen:</span>
                              <span className="text-sm text-gray-600">{issue.citizenName}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <UserCheck className="h-4 w-4 text-sky-500" />
                              <span className="text-sm font-medium text-gray-700">Assigned:</span>
                              <span className="text-sm text-gray-600">{issue.assignedWorker || "Unassigned"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 mt-4 lg:mt-0 lg:ml-6">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(issue)}
                          className="border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignWorker(issue)}
                          className="border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(issue)}
                          className="bg-sky-600 text-white hover:bg-sky-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredIssues.length === 0 && (
          <Card className="shadow-lg border-sky-100">
            <CardContent className="text-center py-12">
              <Droplets className="h-16 w-16 text-sky-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sanitation issues found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Issue Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Issue Details - {selectedIssue?.id}</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-sky-900">Issue Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Location</Label>
                      <p className="text-sm text-gray-900 flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {selectedIssue.location}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Date Reported</Label>
                      <p className="text-sm text-gray-900 flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {selectedIssue.dateReported}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Category</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedIssue.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Priority</Label>
                      <Badge className={`${getPriorityColor(selectedIssue.priority)} mt-1`}>
                        {selectedIssue.priority}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <Badge className={`${getStatusColor(selectedIssue.status)} mt-1`}>{selectedIssue.status}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-sky-900">Citizen Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Name</Label>
                      <p className="text-sm text-gray-900 flex items-center mt-1">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        {selectedIssue.citizenName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedIssue.citizenEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Assigned Worker</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedIssue.assignedWorker || "Not assigned"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-sky-900">Description</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedIssue.description}</p>
              </div>

              {/* Single Photo with proper padding */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-sky-900">Issue Photo</h3>
                <div className="w-full max-w-md p-2 bg-gray-50 rounded-lg">
                  <img
                    src={selectedIssue.photo || "/placeholder.svg"}
                    alt="Issue photo"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    onClick={() => handlePhotoClick(selectedIssue.photo)}
                  />
                </div>
              </div>

              {/* Interactive Map */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-sky-900">Location Map</h3>
                <FunctionalMap coordinates={selectedIssue.coordinates} location={selectedIssue.location} />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleAssignWorker(selectedIssue)
                  }}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Assign Worker
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleStatusUpdate(selectedIssue)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Worker Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Worker - {selectedIssue?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="worker">Select Worker</Label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectItem value="">Select a worker...</SelectItem>
                {workers.map((worker) => (
                  <SelectItem key={worker} value={worker}>
                    {worker}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="note">Assignment Note</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this assignment..."
                className="mt-1"
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignWorkerSubmit} disabled={!selectedWorker}>
                Assign Worker
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status - {selectedIssue?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectItem value="">Select new status...</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusNote">Status Update Note</Label>
              <Textarea
                id="statusNote"
                placeholder="Add details about this status update..."
                className="mt-1"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusUpdateSubmit} disabled={!newStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Gallery Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Photo View</span>
              <Button variant="ghost" size="icon" onClick={() => setShowPhotoModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedPhoto || "/placeholder.svg"}
                  alt="Issue photo"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
