"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import axios from "axios"
import {
  Eye,
  Users,
  Phone,
  CheckCircle,
  MapPin,
  X,
} from "lucide-react"

// UI Components
const Button = ({ children, onClick, variant = "default", size = "default", className = "", disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-sky-600 text-white hover:bg-sky-700",
    outline: "border border-sky-600 text-sky-600 hover:bg-sky-50",
    ghost: "text-sky-600 hover:bg-sky-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }
  const sizes = { default: "h-10 px-4 py-2", sm: "h-9 px-3", lg: "h-11 px-8", icon: "h-10 w-10" }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
const CardContent = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = { default: "bg-sky-100 text-sky-800", secondary: "bg-gray-100 text-gray-800", destructive: "bg-red-100 text-red-800", outline: "border border-sky-200 text-sky-800", success: "bg-green-100 text-green-800" }
  return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>{children}</div>
}
const Input = ({ className = "", ...props }) => <input className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">{children}</div>
    </div>
  )
}
const DialogContent = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>
const DialogHeader = ({ children }) => <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">{children}</div>
const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>

export default function Workers() {
  const [workers, setWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [showWorkerModal, setShowWorkerModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch technicians dynamically
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const adminEmail = sessionStorage.getItem("adminEmail")
        if (!adminEmail) return

        const response = await axios.post(
          "http://localhost:9000/api/technicians/all-technicians-by-department",
          { email: adminEmail }
        )

        if (response.data.success) {
          const techsWithPhoto = response.data.data.map((tech) => {
            const initials = tech.name.split(" ").map(n => n[0]).join("").toUpperCase()
            const colors = [
              "bg-gradient-to-br from-blue-500 to-blue-600",
              "bg-gradient-to-br from-green-500 to-green-600",
              "bg-gradient-to-br from-purple-500 to-purple-600",
              "bg-gradient-to-br from-orange-500 to-orange-600",
              "bg-gradient-to-br from-teal-500 to-teal-600",
              "bg-gradient-to-br from-indigo-500 to-indigo-600",
              "bg-gradient-to-br from-rose-500 to-rose-600",
              "bg-gradient-to-br from-cyan-500 to-cyan-600",
            ]
            const colorIndex = tech.name.length % colors.length
            return { ...tech, profilePhoto: { initials, color: colors[colorIndex] }, resolvedIssues: tech.resolvedIssues || [] }
          })

          setWorkers(techsWithPhoto)
        } else {
          console.error("No technicians found")
        }
      } catch (err) {
        console.error("Error fetching technicians:", err)
      }
    }

    fetchTechnicians()
  }, [])

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewResolvedIssues = (worker, e) => {
    e.stopPropagation()
    setSelectedWorker(worker)
    setShowWorkerModal(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar currentPage="workers" selectedIssue={selectedWorker} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <Card className="mb-8 shadow-lg border-sky-100">
          <CardContent className="pt-6">
            <div className="max-w-md">
              <div className="relative">
                <Input
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="shadow-lg border-sky-100 hover:shadow-xl transition-all duration-300 hover:border-sky-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center mt-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white hover:ring-sky-200 transition-all duration-300 ${worker.profilePhoto.color}`}>
                      {worker.profilePhoto.initials}
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <h3 className="text-xl font-bold text-sky-900">{worker.name}</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4 text-sky-500" />
                      <span className="text-sm text-gray-700">{worker.phone}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{worker.resolvedIssues.length} issues resolved</span>
                    </div>

                    <Button
                      onClick={(e) => handleViewResolvedIssues(worker, e)}
                      variant="default"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
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
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Worker Details Modal */}
      <Dialog open={showWorkerModal} onOpenChange={setShowWorkerModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Worker Profile - {selectedWorker?.name}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowWorkerModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedWorker && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white ${selectedWorker.profilePhoto.color}`}>
                  {selectedWorker.profilePhoto.initials}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-sky-900 mb-2">{selectedWorker.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-sky-500" />
                    <span className="text-gray-700">{selectedWorker.phone}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{selectedWorker.resolvedIssues.length}</div>
                  <div className="text-sm text-gray-600">Issues Resolved</div>
                </div>
              </div>
              {/* Additional resolved issues section can be added here */}
              <div className="flex justify-end pt-6 border-t">
                <Button variant="outline" onClick={() => setShowWorkerModal(false)} className="px-8">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
