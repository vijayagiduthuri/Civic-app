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
  Phone,
  Mail,
  Award,
  Briefcase,
  Users,
  TrendingUp,
  Trash2,
  Filter,
  Badge as BadgeIcon,
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
    success: "bg-green-100 text-green-800",
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
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
)

export default function Workers() {
  // Define current page for navigation highlighting
  const currentPage = "workers"
  
  const [workers] = useState([
    {
      id: "WRK-001",
      name: "Arjun Singh",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      phone: "+91 98765 43210",
      completedIssues: 45,
      resolvedIssues: [
        {
          id: "SAN-2024-001",
          location: "MG Road & Brigade Road Junction",
          category: "Waste Management",
          completedDate: "2024-01-17",
          priority: "High",
          description: "Resolved overflowing garbage bin issue by implementing larger capacity bins and more frequent collection schedule. Coordinated with municipal team for permanent solution.",
        },
        {
          id: "SAN-2024-008",
          location: "Koramangala 4th Block Market",
          category: "Waste Management", 
          completedDate: "2024-01-12",
          priority: "Medium",
          description: "Cleaned commercial area waste accumulation during festival season. Established temporary collection points for vendors.",
        },
        {
          id: "SAN-2024-015",
          location: "Indiranagar 12th Main Road",
          category: "Waste Management",
          completedDate: "2024-01-08",
          priority: "Low",
          description: "Routine maintenance of residential waste bins and optimization of morning collection routes.",
        },
        {
          id: "SAN-2024-023",
          location: "Commercial Street Shopping Area",
          category: "Waste Management",
          completedDate: "2024-01-04",
          priority: "High",
          description: "Emergency cleanup of street waste during heavy footfall weekend. Deployed additional collection vehicles.",
        }
      ]
    },
    {
      id: "WRK-002",
      name: "Priya Sharma",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      phone: "+91 98765 43211", 
      completedIssues: 52,
      resolvedIssues: [
        {
          id: "SAN-2024-003",
          location: "Cubbon Park Public Restroom",
          category: "Public Restrooms",
          completedDate: "2024-01-15",
          priority: "High",
          description: "Completely renovated public restroom facilities. Replaced broken fixtures, installed new soap dispensers, and improved ventilation system.",
        },
        {
          id: "SAN-2024-011",
          location: "Lalbagh Main Gate Restroom",
          category: "Public Restrooms",
          completedDate: "2024-01-09",
          priority: "Medium", 
          description: "Deep cleaning and sanitization of public restroom. Repaired plumbing issues and restocked supplies including toilet paper and hand sanitizer.",
        },
        {
          id: "SAN-2024-017",
          location: "Vidhana Soudha Visitor Restroom",
          category: "Public Restrooms",
          completedDate: "2024-01-05",
          priority: "High",
          description: "Emergency repair of water supply and waste management system in government building restroom during peak visiting hours.",
        }
      ]
    },
    {
      id: "WRK-003", 
      name: "Vikram Reddy",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      phone: "+91 98765 43212",
      completedIssues: 38,
      resolvedIssues: [
        {
          id: "SAN-2024-002",
          location: "HSR Layout Sector 2 - Main Road", 
          category: "Drainage System",
          completedDate: "2024-01-16",
          priority: "High",
          description: "Major drainage pipe burst causing street flooding. Repaired pipe infrastructure and restored normal drainage flow within 6 hours.",
        },
        {
          id: "SAN-2024-009",
          location: "Marathahalli Bridge Underpass",
          category: "Drainage System",
          completedDate: "2024-01-11",
          priority: "Medium",
          description: "Cleared blocked storm drains under bridge. Removed accumulated debris and improved water flow during monsoon season.",
        },
        {
          id: "SAN-2024-016",
          location: "Electronic City Main Road",
          category: "Drainage System", 
          completedDate: "2024-01-06",
          priority: "Low",
          description: "Preventive maintenance of roadside drainage channels. Cleaned manholes and ensured proper water discharge.",
        }
      ]
    },
    {
      id: "WRK-004",
      name: "Anjali Desai",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
      phone: "+91 98765 43213",
      completedIssues: 41,
      resolvedIssues: [
        {
          id: "SAN-2024-004",
          location: "Whitefield Industrial Area - Service Road",
          category: "Illegal Dumping",
          completedDate: "2024-01-14", 
          priority: "High",
          description: "Removed large pile of construction debris and household waste. Coordinated with legal team for penalty enforcement against violators.",
        },
        {
          id: "SAN-2024-012",
          location: "Old Airport Road - Vacant Plot",
          category: "Illegal Dumping",
          completedDate: "2024-01-10",
          priority: "Medium",
          description: "Cleared illegally dumped electronic waste. Arranged proper disposal through certified e-waste recycling facility.",
        },
        {
          id: "SAN-2024-020",
          location: "Outer Ring Road - Construction Site",
          category: "Illegal Dumping",
          completedDate: "2024-01-02",
          priority: "High", 
          description: "Major cleanup operation of construction debris dumped on public land. Installed warning signage and CCTV surveillance.",
        }
      ]
    },
    {
      id: "WRK-005",
      name: "Ravi Patel",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      phone: "+91 98765 43214",
      completedIssues: 29,
      resolvedIssues: [
        {
          id: "SAN-2024-005",
          location: "Jayanagar 4th Block - 11th Main Road",
          category: "Sewer System",
          completedDate: "2024-01-13",
          priority: "Medium",
          description: "Replaced broken sewer cover and reinforced surrounding infrastructure to prevent future collapses. Applied safety protocols during repair.",
        },
        {
          id: "SAN-2024-013",
          location: "Basavanagudi 2nd Stage Residential Area", 
          category: "Sewer System",
          completedDate: "2024-01-07",
          priority: "High",
          description: "Emergency repair of major sewer line blockage causing backflow issues. Restored sanitation services to 200+ households.",
        },
        {
          id: "SAN-2024-021",
          location: "JP Nagar 3rd Phase Main Road",
          category: "Sewer System",
          completedDate: "2024-01-01",
          priority: "Medium",
          description: "Routine maintenance of sewer line connections and manholes. Prevented potential blockages during monsoon preparedness.",
        }
      ]
    },
    {
      id: "WRK-006", 
      name: "Kavita Nair",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      phone: "+91 98765 43215",
      completedIssues: 36,
      resolvedIssues: [
        {
          id: "SAN-2024-006",
          location: "Forum Mall - Hosur Road",
          category: "Recycling Management", 
          completedDate: "2024-01-12",
          priority: "Low",
          description: "Reorganized recycling collection system and educated mall management on proper waste segregation practices. Implemented color-coded bin system.",
        },
        {
          id: "SAN-2024-014",
          location: "UB City Mall - Recycling Center",
          category: "Recycling Management",
          completedDate: "2024-01-08",
          priority: "Medium",
          description: "Upgraded recycling infrastructure and implemented new sorting mechanisms for plastic, paper, and metal waste separation.",
        },
        {
          id: "SAN-2024-022",
          location: "Phoenix Marketcity - Waste Management Area",
          category: "Recycling Management",
          completedDate: "2023-12-30",
          priority: "Low",
          description: "Routine maintenance of recycling equipment and training of facility staff on proper waste handling procedures.",
        }
      ]
    },
    {
      id: "WRK-007",
      name: "Suresh Kumar",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      phone: "+91 98765 43216", 
      completedIssues: 33,
      resolvedIssues: [
        {
          id: "SAN-2024-007",
          location: "Rajajinagar Metro Station",
          category: "Public Restrooms",
          completedDate: "2024-01-11",
          priority: "High",
          description: "Complete overhaul of metro station restroom facilities. Installed new fixtures, improved accessibility, and enhanced lighting.",
        },
        {
          id: "SAN-2024-018",
          location: "Malleswaram Circle Public Facility",
          category: "Public Restrooms", 
          completedDate: "2024-01-03",
          priority: "Medium",
          description: "Preventive maintenance and deep sanitization of high-traffic public restroom. Replaced damaged tiles and faucets.",
        }
      ]
    },
    {
      id: "WRK-008",
      name: "Deepika Joshi",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      phone: "+91 98765 43217",
      completedIssues: 44,
      resolvedIssues: [
        {
          id: "SAN-2024-010",
          location: "Chickpet Commercial Market",
          category: "Waste Management",
          completedDate: "2024-01-10",
          priority: "High", 
          description: "Managed major cleanup drive in busy commercial area during festival period. Coordinated with vendor associations for waste segregation.",
        },
        {
          id: "SAN-2024-019",
          location: "Gandhi Bazaar Vegetable Market",
          category: "Waste Management",
          completedDate: "2024-01-01",
          priority: "Medium",
          description: "Organized daily waste collection from vegetable market. Set up composting system for organic waste management.",
        }
      ]
    }
  ])

  const [selectedWorker, setSelectedWorker] = useState(null)
  const [showWorkerModal, setShowWorkerModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Navigation items with their page identifiers
  const navigationItems = [
    { href: "/home", label: "Home", page: "home" },
    { href: "/issues", label: "Issues", page: "issues" },
    { href: "/workers", label: "Workers", page: "workers" },
    { href: "/overview", label: "Overview", page: "overview" },
  ]

  const departments = ["All", "Waste Management", "Drainage System", "Public Restrooms", "Illegal Dumping", "Recycling Management", "Sewer System"]

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleViewResolvedIssues = (worker, e) => {
    e.stopPropagation() // Prevent card click event
    setSelectedWorker(worker)
    setShowWorkerModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "On Leave":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
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

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star className="h-4 w-4 fill-yellow-200 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 shadow-xl border-b border-sky-500/20 backdrop-blur-sm flex-shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Trash2 className="h-5 w-5 text-sky-600 group-hover:text-sky-700 transition-colors duration-300" />
                </div>
                <span className="text-white font-bold text-lg tracking-wide drop-shadow-sm">Gov Portal</span>
              </div>

              <div className="hidden md:flex items-center space-x-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.page}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 relative group ${
                      currentPage === item.page 
                        ? "text-white font-semibold" 
                        : "text-sky-100 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-sky-300 transform transition-transform duration-300 ${
                        currentPage === item.page 
                          ? "scale-x-100" 
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                ))}
              </div>
            </div>

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
        {/* Search Only */}
        <Card className="mb-8 shadow-lg border-sky-100">
          <CardContent className="pt-6">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 h-5 w-5" />
                <Input
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers Cards with Resolved Issues Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <Card
              key={worker.id}
              className="shadow-lg border-sky-100 hover:shadow-xl transition-all duration-300 hover:border-sky-200"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Profile Section */}
                  <div className="text-center space-y-3">
                    <div className="relative">
                      <img
                        src={worker.photo}
                        alt={worker.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-sky-100 shadow-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-sky-900">{worker.name}</h3>
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="h-4 w-4 text-sky-500" />
                        <span className="text-sm text-gray-700">{worker.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Resolved Issues Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <Button
                      onClick={(e) => handleViewResolvedIssues(worker, e)}
                      variant="outline"
                      className="w-full flex items-center justify-center space-x-2 hover:bg-sky-50 border-sky-200 text-sky-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>View Resolved Issues</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkers.length === 0 && (
          <Card className="shadow-lg border-sky-100">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-sky-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Worker Resolved Issues Modal */}
      <Dialog open={showWorkerModal} onOpenChange={setShowWorkerModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Issues Resolved by {selectedWorker?.name}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowWorkerModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-6">
              {/* Worker Summary */}
              <div className="flex items-center space-x-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <img
                  src={selectedWorker.photo}
                  alt={selectedWorker.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-sky-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-sky-900">{selectedWorker.name}</h3>
                  <p className="text-sm text-gray-600">{selectedWorker.phone}</p>
                </div>
              </div>

              {/* Resolved Issues List */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-sky-900 border-b border-sky-200 pb-2">
                  Resolved Issues History
                </h4>
                
                {selectedWorker.resolvedIssues.map((issue) => (
                  <Card key={issue.id} className="border-sky-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h5 className="font-semibold text-sky-900 text-lg">{issue.id}</h5>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority} Priority
                            </Badge>
                            <Badge variant="outline" className="text-sky-600 border-sky-200">
                              {issue.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-sky-500" />
                            <span className="font-medium">Location:</span>
                            <span>{issue.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Completed:</span>
                            <span>{issue.completedDate}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {selectedWorker.resolvedIssues.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No resolved issues found for this worker.</p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowWorkerModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}