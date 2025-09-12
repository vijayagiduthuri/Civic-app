import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Trash2, UserPlus, Calendar, CheckCircle, Users, Search, User, X } from 'lucide-react';

const Home = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Mock data for civic issues
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Broken Street Light',
      description: 'Street light on Main Street is not working since yesterday. Residents are concerned about safety during night hours.',
      location: 'Main Street, Block A',
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'pending',
      date: '2025-09-13',
      time: '09:30 AM',
      photo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      department: 'Public Works',
      reportedBy: 'John Doe',
      priority: 'Medium',
      contactNumber: '+91-9876543210'
    },
    {
      id: 2,
      title: 'Garbage Collection Missed',
      description: 'Garbage has not been collected for 3 days in residential area. Creating hygiene issues and bad smell.',
      location: 'Residential Area, Block B',
      latitude: 28.6129,
      longitude: 77.2080,
      status: 'in-progress',
      date: '2025-09-12',
      time: '02:15 PM',
      photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop',
      department: 'Sanitation',
      reportedBy: 'Jane Smith',
      priority: 'High',
      contactNumber: '+91-9876543211',
      assignedWorker: 'Ram Kumar'
    },
    {
      id: 3,
      title: 'Pothole on Highway',
      description: 'Large pothole causing traffic issues and vehicle damage. Multiple complaints received from commuters.',
      location: 'Highway 101, Mile 5',
      latitude: 28.6149,
      longitude: 77.2100,
      status: 'resolved',
      date: '2025-09-11',
      time: '11:45 AM',
      photo: 'https://images.unsplash.com/photo-1615906627571-6c3c1e0cc5d6?w=300&h=200&fit=crop',
      department: 'Public Works',
      reportedBy: 'Mike Johnson',
      priority: 'High',
      contactNumber: '+91-9876543212',
      resolvedBy: 'Shyam Singh',
      resolvedDate: '2025-09-13'
    },
    {
      id: 4,
      title: 'Water Leak',
      description: 'Water pipe burst near the park entrance causing water wastage and making the area slippery.',
      location: 'Central Park, Gate 2',
      latitude: 28.6159,
      longitude: 77.2110,
      status: 'pending',
      date: '2025-09-13',
      time: '07:20 AM',
      photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
      department: 'Water Department',
      reportedBy: 'Sarah Wilson',
      priority: 'Critical',
      contactNumber: '+91-9876543213'
    },
    {
      id: 5,
      title: 'Illegal Dumping',
      description: 'Construction waste dumped illegally behind shopping center. Environmental concern and violation of city rules.',
      location: 'Shopping Center, Rear Parking',
      latitude: 28.6119,
      longitude: 77.2070,
      status: 'in-progress',
      date: '2025-09-12',
      time: '04:30 PM',
      photo: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=200&fit=crop',
      department: 'Sanitation',
      reportedBy: 'Robert Brown',
      priority: 'Medium',
      contactNumber: '+91-9876543214',
      assignedWorker: 'Hari Prasad'
    },
    {
      id: 6,
      title: 'Drain Blockage',
      description: 'Main drainage system blocked causing water logging during recent rains. Immediate attention required.',
      location: 'Market Street, Near Bus Stop',
      latitude: 28.6135,
      longitude: 77.2085,
      status: 'pending',
      date: '2025-09-13',
      time: '10:15 AM',
      photo: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deec?w=300&h=200&fit=crop',
      department: 'Sanitation',
      reportedBy: 'Priya Sharma',
      priority: 'High',
      contactNumber: '+91-9876543215'
    }
  ]);

  // Worker data with availability status
  const [workers] = useState([
    { id: 1, name: 'Ram Kumar', status: 'available', currentTask: null, phone: '+91-9876543301' },
    { id: 2, name: 'Shyam Singh', status: 'busy', currentTask: 'Road repair on Highway 15', phone: '+91-9876543302' },
    { id: 3, name: 'Hari Prasad', status: 'available', currentTask: null, phone: '+91-9876543303' },
    { id: 4, name: 'Lakshmi Devi', status: 'not-available', currentTask: 'On medical leave', phone: '+91-9876543304' },
    { id: 5, name: 'Ravi Kumar', status: 'busy', currentTask: 'Cleaning drainage system', phone: '+91-9876543305' },
    { id: 6, name: 'Manoj Yadav', status: 'available', currentTask: null, phone: '+91-9876543306' }
  ]);

  // Calculate statistics
  const todayStats = {
    total: issues.filter(issue => issue.date === '2025-09-13').length,
    pending: issues.filter(issue => issue.status === 'pending').length,
    inProgress: issues.filter(issue => issue.status === 'in-progress').length,
    resolved: issues.filter(issue => issue.status === 'resolved').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ef4444';
      case 'in-progress': return '#f97316';
      case 'resolved': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-500';
      case 'in-progress': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWorkerStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-700 bg-green-100';
      case 'busy': return 'text-orange-700 bg-orange-100';
      case 'not-available': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  // Initialize Leaflet map
  useEffect(() => {
    const loadLeaflet = async () => {
      if (window.L) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      
      return new Promise((resolve) => {
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    loadLeaflet().then(() => {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = window.L.map(mapRef.current).setView([28.6139, 77.2090], 14);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        issues.forEach(issue => {
          const marker = window.L.circleMarker([issue.latitude, issue.longitude], {
            radius: 8,
            fillColor: getStatusColor(issue.status),
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapInstance.current);

          marker.bindTooltip(`<strong>${issue.title}</strong><br>${issue.location}`, {
            permanent: false,
            direction: 'top'
          });

          marker.on('click', () => {
            setSelectedIssue(issue);
          });

          markersRef.current.push({ marker, issue });
        });
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  const handleLocationSearch = async () => {
    if (!searchLocation.trim() || !mapInstance.current) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapInstance.current.setView([parseFloat(lat), parseFloat(lon)], 16);
        
        // Add a temporary marker for searched location
        const searchMarker = window.L.marker([parseFloat(lat), parseFloat(lon)])
          .addTo(mapInstance.current)
          .bindPopup(`<b>Searched Location:</b><br>${data[0].display_name}`)
          .openPopup();

        // Remove the search marker after 5 seconds
        setTimeout(() => {
          mapInstance.current.removeLayer(searchMarker);
        }, 5000);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleAssignWorker = (issue) => {
    setSelectedIssue(issue);
    setShowAssignModal(true);
  };

  const handleAssignWorkerSubmit = () => {
    if (selectedWorker && selectedIssue) {
      setIssues(prev => prev.map(issue => 
        issue.id === selectedIssue.id ? { 
          ...issue, 
          assignedWorker: selectedWorker, 
          status: 'in-progress' 
        } : issue
      ));
      
      const markerObj = markersRef.current.find(m => m.issue.id === selectedIssue.id);
      if (markerObj) {
        markerObj.marker.setStyle({ fillColor: getStatusColor('in-progress') });
      }

      setSelectedWorker('');
      setAssignmentNote('');
      setShowAssignModal(false);
    }
  };

  const handleStatusUpdate = (issueId, newStatus) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { 
        ...issue, 
        status: newStatus,
        ...(newStatus === 'resolved' ? { resolvedDate: '2025-09-13', resolvedBy: 'Admin' } : {})
      } : issue
    ));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => ({ 
        ...prev, 
        status: newStatus,
        ...(newStatus === 'resolved' ? { resolvedDate: '2025-09-13', resolvedBy: 'Admin' } : {})
      }));
    }
    const markerObj = markersRef.current.find(m => m.issue.id === issueId);
    if (markerObj) {
      markerObj.marker.setStyle({ fillColor: getStatusColor(newStatus) });
    }
  };

  const renderIssueCard = (issue) => (
    <div 
      key={issue.id} 
      className={`bg-gray-50 rounded-lg p-4 border-l-4 cursor-pointer hover:shadow-md transition-all ${
        selectedIssue?.id === issue.id ? 'border-sky-500 bg-sky-50' : 'border-gray-300'
      }`}
      onClick={() => setSelectedIssue(issue)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{issue.title}</h4>
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusBgColor(issue.status)}`}>
          {getStatusText(issue.status)}
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-2">{issue.location}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{issue.date} • {issue.time}</span>
        <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(issue.priority)}`}>
          {issue.priority}
        </span>
      </div>
    </div>
  );

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

              <div className="hidden md:flex items-center space-x-2">
                <a
                  href="/home"
                  className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border-b-2 border-sky-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Home
                </a>
                <a
                  href="/issues"
                  className="text-sky-100 hover:text-white hover:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:border-b-2 hover:border-sky-300 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Issues
                </a>
                <a
                  href="/workers"
                  className="text-sky-100 hover:text-white hover:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:border-b-2 hover:border-sky-300 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Workers
                </a>
                <a
                  href="/overview"
                  className="text-sky-100 hover:text-white hover:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:border-b-2 hover:border-sky-300 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Overview
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="text-white text-sm">
                <span className="font-semibold drop-shadow-sm">Admin User</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ring-2 ring-white/20 group-hover:ring-white/40">
                <User className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="bg-white border-b border-sky-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-sky-900">Sanitation Department Dashboard</h1>
                    <p className="text-sm text-sky-600">Government Administration Portal</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-sky-50 text-sky-700 border border-sky-200 px-4 py-2 rounded-full text-sm font-medium">
                Admin Dashboard
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* Enhanced Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Issues Card */}
          <div className="relative bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative p-4">
              <div>
                <p className="text-blue-100 font-medium text-sm">Total Issues</p>
                <p className="text-2xl font-bold text-white">{todayStats.total}</p>
              </div>
            </div>
          </div>

          {/* Pending Issues Card */}
          <div className="relative bg-gradient-to-br from-red-400 to-red-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative p-4">
              <div>
                <p className="text-red-100 font-medium text-sm">Pending Issues</p>
                <p className="text-2xl font-bold text-white">{todayStats.pending}</p>
              </div>
            </div>
          </div>

          {/* In Progress Card */}
          <div className="relative bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative p-4">
              <div>
                <p className="text-orange-100 font-medium text-sm">In Progress</p>
                <p className="text-2xl font-bold text-white">{todayStats.inProgress}</p>
              </div>
            </div>
          </div>

          {/* Resolved Issues Card */}
          <div className="relative bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative p-4">
              <div>
                <p className="text-green-100 font-medium text-sm">Resolved Issues</p>
                <p className="text-2xl font-bold text-white">{todayStats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className={`flex gap-6 transition-all duration-300 ${showAssignModal ? 'blur-sm' : ''}`}>
          {/* Left Panel - Issues Card Only */}
          <div className="w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedIssue ? 'Issue Details' : `All Issues (${issues.length})`}
                </h2>
                {selectedIssue && (
                  <button 
                    onClick={() => setSelectedIssue(null)}
                    className="text-sky-600 hover:text-sky-800 text-sm font-medium"
                  >
                    ← Back to All
                  </button>
                )}
              </div>
              
              {selectedIssue ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={selectedIssue.photo} 
                      alt={selectedIssue.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusBgColor(selectedIssue.status)}`}>
                      {getStatusText(selectedIssue.status)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedIssue.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm">{selectedIssue.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-sky-600 mr-2" />
                      <span className="text-gray-700">{selectedIssue.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-sky-600 mr-2" />
                      <span className="text-gray-700">{selectedIssue.date} at {selectedIssue.time}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Reported by:</span>
                        <p className="font-medium text-gray-700">{selectedIssue.reportedBy}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <p className="font-medium text-gray-700">{selectedIssue.contactNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-500 mr-2">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedIssue.priority)}`}>
                          {selectedIssue.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 mr-2">Department:</span>
                        <span className="font-medium text-gray-700">{selectedIssue.department}</span>
                      </div>
                    </div>
                    
                    {selectedIssue.assignedWorker && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <span className="text-orange-700 font-medium">Assigned Worker:</span>
                        <p className="text-orange-600">{selectedIssue.assignedWorker}</p>
                      </div>
                    )}

                    {selectedIssue.status === 'resolved' && selectedIssue.resolvedBy && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="text-green-700 font-medium">Resolved by:</span>
                        <p className="text-green-600">{selectedIssue.resolvedBy} on {selectedIssue.resolvedDate}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    {selectedIssue.status !== 'resolved' && (
                      <>
                        <button 
                          onClick={() => handleAssignWorker(selectedIssue)}
                          className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {selectedIssue.assignedWorker ? 'Reassign Worker' : 'Assign Worker'}
                        </button>

                        <div className="flex gap-2">
                          {selectedIssue.status === 'pending' && (
                            <button 
                              onClick={() => handleStatusUpdate(selectedIssue.id, 'in-progress')}
                              className="flex-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                            >
                              Mark In Progress
                            </button>
                          )}
                          <button 
                            onClick={() => handleStatusUpdate(selectedIssue.id, 'resolved')}
                            className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {issues.map(issue => renderIssueCard(issue))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Map View */}
          <div className="w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Live Issues Map</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Pending ({issues.filter(i => i.status === 'pending').length})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>In Progress ({issues.filter(i => i.status === 'in-progress').length})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Resolved ({issues.filter(i => i.status === 'resolved').length})</span>
                  </div>
                </div>
              </div>

              {/* Location Search */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search location on map..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={handleLocationSearch}
                    className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Leaflet Map Container */}
              <div 
                ref={mapRef} 
                className="w-full h-96 rounded-lg border-2 border-gray-200"
                style={{ minHeight: '400px' }}
              />

              <div className="mt-4 text-sm text-gray-600 bg-sky-50 p-3 rounded-lg">
                <p className="font-medium text-sky-700 mb-1">Map Instructions:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Click on any colored marker to view issue details</li>
                  <li>• Search for locations using the search box above</li>
                  <li>• Hover over markers to see quick info</li>
                  <li>• Use mouse wheel to zoom in/out</li>
                  <li>• Drag to pan around the map</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Assign Worker Modal */}
      {/* Enhanced Assign Worker Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Assign Worker</h3>
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Issue Info */}
              <div className="mb-6 p-4 bg-sky-50 rounded-xl border border-sky-100">
                <p className="text-sm font-medium text-sky-900 mb-1">Issue: <span className="font-bold">{selectedIssue?.title}</span></p>
                <p className="text-sm text-sky-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedIssue?.location}
                </p>
              </div>

              {/* Worker Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">Select Worker</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2">
                  {workers.map((worker) => (
                    <div
                      key={worker.id}
                      className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedWorker === worker.name 
                          ? 'border-sky-500 bg-sky-50 shadow-md transform scale-[1.02]' 
                          : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedWorker(worker.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">{worker.name}</p>
                              <p className="text-xs text-gray-500">{worker.phone}</p>
                            </div>
                          </div>
                          {worker.currentTask && (
                            <p className="text-xs text-gray-500 mt-2 ml-11 truncate">Current: {worker.currentTask}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkerStatusColor(worker.status)}`}>
                            {worker.status === 'available' ? 'Available' : 
                             worker.status === 'busy' ? 'Busy' : 'Not Available'}
                          </span>
                          {selectedWorker === worker.name && (
                            <div className="w-5 h-5 bg-sky-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

             
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex-shrink-0 p-6 pt-0">
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAssignWorkerSubmit}
                  disabled={!selectedWorker}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-sky-700 text-white px-6 py-3 rounded-xl hover:from-sky-700 hover:to-sky-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  Assign Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;