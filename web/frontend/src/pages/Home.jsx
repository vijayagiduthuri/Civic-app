import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Trash2, UserPlus, Calendar, CheckCircle, Users, Search, User, X, BarChart3, TrendingUp, Filter, ChevronDown } from 'lucide-react';

const Home = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Mock data for civic issues with upvote counts
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
      contactNumber: '+91-9876543210',
      upvotes: 45
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
      assignedWorker: 'Ram Kumar',
      upvotes: 78
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
      resolvedDate: '2025-09-13',
      upvotes: 23
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
      department: 'Water',
      reportedBy: 'Sarah Wilson',
      priority: 'Critical',
      contactNumber: '+91-9876543213',
      upvotes: 92
    },
    {
      id: 5,
      title: 'Illegal Dumping',
      description: 'Construction waste dumped illegally behind shopping center. Environmental concern and violation of city rules.',
      location: 'Shopping Center, Rear Parking',
      latitude: 28.6119,
      longitude: 77.2070,
      status: 'resolved',
      date: '2025-09-12',
      time: '04:30 PM',
      photo: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=200&fit=crop',
      department: 'Sanitation',
      reportedBy: 'Robert Brown',
      priority: 'Medium',
      contactNumber: '+91-9876543214',
      resolvedBy: 'Hari Prasad',
      resolvedDate: '2025-09-13',
      upvotes: 67
    },
    {
      id: 6,
      title: 'Drain Blockage',
      description: 'Main drainage system blocked causing water logging during recent rains. Immediate attention required.',
      location: 'Market Street, Near Bus Stop',
      latitude: 28.6135,
      longitude: 77.2085,
      status: 'in-progress',
      date: '2025-09-13',
      time: '10:15 AM',
      photo: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deec?w=300&h=200&fit=crop',
      department: 'Sanitation',
      reportedBy: 'Priya Sharma',
      priority: 'High',
      contactNumber: '+91-9876543215',
      assignedWorker: 'Manoj Yadav',
      upvotes: 34
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

  // Filter issues based on selected status
  const filteredIssues = statusFilter === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === statusFilter);

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

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Issues', count: issues.length },
    { value: 'pending', label: 'Pending', count: issues.filter(i => i.status === 'pending').length },
    { value: 'in-progress', label: 'In Progress', count: issues.filter(i => i.status === 'in-progress').length },
    { value: 'resolved', label: 'Resolved', count: issues.filter(i => i.status === 'resolved').length }
  ];

  // Load Leaflet library
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L && !leafletLoaded) {
        try {
          // Load CSS first
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          document.head.appendChild(link);

          // Load JavaScript
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // Wait a bit more to ensure everything is loaded
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setLeafletLoaded(true);
        } catch (error) {
          console.error('Failed to load Leaflet:', error);
        }
      } else if (window.L) {
        setLeafletLoaded(true);
      }
    };

    loadLeaflet();
  }, [leafletLoaded]);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (leafletLoaded && window.L && mapRef.current && !mapInstance.current) {
      try {
        mapInstance.current = window.L.map(mapRef.current, {
          center: [28.6139, 77.2090],
          zoom: 13,
          zoomControl: true
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(mapInstance.current);

        console.log('Map initialized successfully');
        
        // Initial marker load
        updateMapMarkers();
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapInstance.current = null;
        markersRef.current = [];
      }
    };
  }, [leafletLoaded]);

  // Update map markers when filter changes
  useEffect(() => {
    if (leafletLoaded && mapInstance.current && window.L) {
      console.log(`Filter changed to: ${statusFilter}, updating markers...`);
      updateMapMarkers();
    }
  }, [statusFilter, leafletLoaded, issues]); // Added issues dependency

  // Safe marker update function
  const updateMapMarkers = () => {
    if (!mapInstance.current || !window.L || !leafletLoaded) {
      console.log('Map not ready for marker updates');
      return;
    }

    try {
      // Clear existing markers
      markersRef.current.forEach(({ marker }) => {
        try {
          if (marker && mapInstance.current && mapInstance.current.hasLayer(marker)) {
            mapInstance.current.removeLayer(marker);
          }
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      markersRef.current = [];

      // Get current filtered issues
      const currentFilteredIssues = statusFilter === 'all' 
        ? issues 
        : issues.filter(issue => issue.status === statusFilter);

      console.log(`Filter: ${statusFilter}`);
      console.log(`Total issues: ${issues.length}`);
      console.log(`Filtered issues: ${currentFilteredIssues.length}`);
      console.log('Filtered issues:', currentFilteredIssues.map(i => `${i.title} (${i.status})`));

      // Create new markers for filtered issues
      currentFilteredIssues.forEach((issue, index) => {
        try {
          const lat = parseFloat(issue.latitude);
          const lng = parseFloat(issue.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for issue: ${issue.title} - lat: ${lat}, lng: ${lng}`);
            return;
          }

          console.log(`Creating marker ${index + 1} for: ${issue.title} at [${lat}, ${lng}] - Status: ${issue.status}`);

          let marker;

          if (issue.upvotes > 50) {
            // High community interest marker (crowded area)
            console.log(`Creating high interest marker for: ${issue.title} with ${issue.upvotes} upvotes`);
            const crowdedIcon = window.L.divIcon({
              html: `
                <div style="position: relative; width: 40px; height: 40px;">
                  <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; background: ${getStatusColor(issue.status)}; border: 3px solid white; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div style="position: absolute; top: 0; left: 15px; width: 12px; height: 12px; background: ${getStatusColor(issue.status)}; border: 2px solid white; border-radius: 50%; opacity: 0.8;"></div>
                  <div style="position: absolute; top: 15px; left: 0; width: 10px; height: 10px; background: ${getStatusColor(issue.status)}; border: 2px solid white; border-radius: 50%; opacity: 0.6;"></div>
                  <div style="position: absolute; top: -3px; left: 18px; background: #dc2626; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; border: 2px solid white;">
                    ${issue.upvotes}
                  </div>
                </div>
              `,
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            });
            
            marker = window.L.marker([lat, lng], { icon: crowdedIcon });
          } else {
            // Regular circular marker
            console.log(`Creating regular marker for: ${issue.title} with ${issue.upvotes} upvotes`);
            marker = window.L.circleMarker([lat, lng], {
              radius: 12,
              fillColor: getStatusColor(issue.status),
              color: '#ffffff',
              weight: 3,
              opacity: 1,
              fillOpacity: 0.9
            });
          }

          if (marker && mapInstance.current) {
            marker.addTo(mapInstance.current);
            console.log(`✓ Successfully added marker for: ${issue.title}`);
            
            // Add tooltip
            const tooltipContent = `
              <div style="font-family: Arial, sans-serif; min-width: 200px;">
                <strong style="color: #1f2937;">${issue.title}</strong><br>
                <span style="font-size: 12px; color: #6b7280;">${issue.location}</span><br>
                <span style="font-size: 11px; color: #9ca3af;">Status: ${getStatusText(issue.status)}</span><br>
                <span style="font-size: 11px; color: #3b82f6;">${issue.upvotes} upvotes</span>
                ${issue.upvotes > 50 ? '<br><span style="font-size: 10px; color: #d97706; font-weight: bold;">⭐ High Community Interest</span>' : ''}
              </div>
            `;
            
            marker.bindTooltip(tooltipContent, {
              direction: 'top',
              offset: [0, -10]
            });

            // Add click handler
            marker.on('click', () => {
              console.log(`Marker clicked: ${issue.title}`);
              setSelectedIssue(issue);
              // Also focus the map when marker is clicked
              focusMapOnIssue(issue);
            });

            markersRef.current.push({ marker, issue });
          } else {
            console.error(`Failed to create marker for: ${issue.title}`);
          }
        } catch (markerError) {
          console.error('Error creating marker for issue:', issue.title, markerError);
        }
      });

      console.log(`🎯 SUMMARY: Created ${markersRef.current.length} markers on map for filter "${statusFilter}"`);
      console.log('Active markers:', markersRef.current.map(m => m.issue.title));
      
    } catch (error) {
      console.error('Error in updateMapMarkers:', error);
    }
  };

  const handleLocationSearch = async () => {
    if (!searchLocation.trim() || !mapInstance.current || !window.L || !leafletLoaded) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        if (!isNaN(latNum) && !isNaN(lonNum)) {
          mapInstance.current.setView([latNum, lonNum], 16);
          
          const searchMarker = window.L.marker([latNum, lonNum])
            .addTo(mapInstance.current)
            .bindPopup(`<b>Searched Location:</b><br>${data[0].display_name || 'Unknown location'}`)
            .openPopup();

          setTimeout(() => {
            if (mapInstance.current && searchMarker) {
              try {
                mapInstance.current.removeLayer(searchMarker);
              } catch (error) {
                console.warn('Error removing search marker:', error);
              }
            }
          }, 5000);
        }
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
  };

  const handleUpvote = (issueId) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    ));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
    }
  };

  // Function to reset map to overview of all issues
  const resetMapView = () => {
    if (!mapInstance.current || !leafletLoaded) return;
    
    try {
      // Reset to default view showing all issues
      mapInstance.current.setView([28.6139, 77.2090], 13, {
        animate: true,
        duration: 0.8
      });
      
      console.log('Map view reset to overview');
    } catch (error) {
      console.error('Error resetting map view:', error);
    }
  };

  // Function to focus map on a specific issue
  const focusMapOnIssue = (issue) => {
    if (!mapInstance.current || !leafletLoaded || !issue.latitude || !issue.longitude) return;
    
    try {
      const lat = parseFloat(issue.latitude);
      const lng = parseFloat(issue.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;
      
      // Set view to the issue location with higher zoom level for focus
      mapInstance.current.setView([lat, lng], 16, {
        animate: true,
        duration: 1.0
      });
      
      // Find and highlight the corresponding marker
      const targetMarker = markersRef.current.find(m => m.issue.id === issue.id);
      if (targetMarker && targetMarker.marker) {
        // Open tooltip for the focused marker
        setTimeout(() => {
          if (targetMarker.marker && targetMarker.marker.openTooltip) {
            targetMarker.marker.openTooltip();
          }
        }, 1000); // Delay to allow map animation to complete
      }
      
      console.log(`Map focused on: ${issue.title} at [${lat}, ${lng}]`);
    } catch (error) {
      console.error('Error focusing map on issue:', error);
    }
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    focusMapOnIssue(issue);
  };

  const renderIssueCard = (issue) => (
    <div 
      key={issue.id} 
      className={`bg-gray-50 rounded-lg p-3 border-l-4 cursor-pointer hover:shadow-md transition-all ${
        selectedIssue?.id === issue.id ? 'border-sky-500 bg-sky-50' : 'border-gray-300'
      }`}
      onClick={() => handleIssueClick(issue)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{issue.title}</h4>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">{issue.upvotes}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-2 line-clamp-1">{issue.location}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{issue.date}</span>
        <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(issue.priority)}`}>
          {issue.priority}
        </span>
      </div>
      {issue.upvotes > 50 && (
        <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-flex items-center">
          <Users className="h-3 w-3 mr-1" />
          High Interest Area
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-sky-50 to-white flex flex-col overflow-hidden">
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
                {[
                  { href: "/home", label: "Home", page: "home" },
                  { href: "/issues", label: "Issues", page: "issues" },
                  { href: "/workers", label: "Workers", page: "workers" },
                  { href: "/overview", label: "Overview", page: "overview" },
                ].map((item) => (
                  <a
                    key={item.page}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 relative group ${
                      "home" === item.page 
                        ? "text-white font-semibold" 
                        : "text-sky-100 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-sky-300 transform transition-transform duration-300 ${
                        "home" === item.page 
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
                <span className="font-semibold drop-shadow-sm">
                  {selectedIssue?.department ? `${selectedIssue.department} Department` : 'Sanitation Department'}
                </span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ring-2 ring-white/20 group-hover:ring-white/40">
                <User className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className={`flex-1 w-full px-4 py-4 flex gap-4 min-h-0 transition-all duration-300 ${showAssignModal ? 'blur-sm' : ''}`}>
        {/* Left Panel - Issues */}
        <div className="w-1/3 flex flex-col min-h-0">
          <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedIssue ? 'Issue Details' : `Issues (${filteredIssues.length})`}
              </h2>
              <div className="flex items-center space-x-2">
                {selectedIssue && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedIssue(null);
                        resetMapView();
                      }}
                      className="text-sky-600 hover:text-sky-800 text-sm font-medium"
                    >
                      ← Back to Overview
                    </button>
                  </div>
                )}
                {!selectedIssue && (
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center space-x-2 px-3 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors text-sm font-medium"
                    >
                      <Filter className="h-4 w-4" />
                      <span>{filterOptions.find(opt => opt.value === statusFilter)?.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {showFilterDropdown && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                        {filterOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              console.log(`Filter changing to: ${option.value}`);
                              setStatusFilter(option.value);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm ${
                              statusFilter === option.value ? 'bg-sky-50 text-sky-700 font-medium' : 'text-gray-700'
                            } ${option.value === filterOptions[0].value ? 'rounded-t-lg' : ''} ${
                              option.value === filterOptions[filterOptions.length - 1].value ? 'rounded-b-lg' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{option.label}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {option.count}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {selectedIssue ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={selectedIssue.photo} 
                      alt={selectedIssue.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs shadow-lg">
                        <TrendingUp className="h-3 w-3" />
                        <span className="font-medium">{selectedIssue.upvotes}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{selectedIssue.title}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{selectedIssue.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-sky-600 mr-2" />
                      <span className="text-gray-700">{selectedIssue.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-sky-600 mr-2" />
                      <span className="text-gray-700">{selectedIssue.date} at {selectedIssue.time}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
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
                    
                    {selectedIssue.upvotes > 50 && (
                      <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-orange-700">
                          <Users className="h-4 w-4" />
                          <span className="font-medium text-sm">High Community Interest Area</span>
                        </div>
                        <p className="text-xs text-orange-600 mt-1">
                          This issue has received significant community attention with {selectedIssue.upvotes} upvotes
                        </p>
                      </div>
                    )}
                    
                    {selectedIssue.assignedWorker && (
                      <div className="bg-orange-50 p-2 rounded-lg">
                        <span className="text-orange-700 font-medium text-sm">Assigned Worker:</span>
                        <p className="text-orange-600 text-sm">{selectedIssue.assignedWorker}</p>
                      </div>
                    )}

                    {selectedIssue.status === 'resolved' && selectedIssue.resolvedBy && (
                      <div className="bg-green-50 p-2 rounded-lg">
                        <span className="text-green-700 font-medium text-sm">Resolved by:</span>
                        <p className="text-green-600 text-sm">{selectedIssue.resolvedBy} on {selectedIssue.resolvedDate}</p>
                      </div>
                    )}
                  </div>

                  {selectedIssue.status !== 'resolved' && (
                    <div className="space-y-2 pt-2 border-t">
                      {selectedIssue.status === 'pending' && (
                        <button 
                          onClick={() => handleAssignWorker(selectedIssue)}
                          className="w-full bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center text-sm"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Worker
                        </button>
                      )}

                      <div className="flex gap-2">
                        {selectedIssue.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(selectedIssue.id, 'in-progress')}
                            className="flex-1 bg-orange-100 text-orange-700 px-2 py-2 rounded-lg hover:bg-orange-200 transition-colors text-xs"
                          >
                            Mark In Progress
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusUpdate(selectedIssue.id, 'resolved')}
                          className="flex-1 bg-green-100 text-green-700 px-2 py-2 rounded-lg hover:bg-green-200 transition-colors text-xs"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => renderIssueCard(issue))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Filter className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No issues found for the selected filter</p>
                      <p className="text-xs text-gray-400 mt-1">Try selecting a different status filter</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-2/3 flex flex-col min-h-0">
          <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Live Issues Map ({filteredIssues.length} issues)
                </h2>
                {selectedIssue && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Focused: {selectedIssue.title}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Resolved</span>
                </div>
                <div className="flex items-center border-l border-gray-300 pl-4 ml-2">
                  <Users className="w-3 h-3 text-orange-600 mr-2" />
                  <span className="text-orange-600">High Interest (50+ upvotes)</span>
                </div>
              </div>
            </div>

            {/* Location Search */}
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search location on map..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                  />
                </div>
                <button 
                  onClick={handleLocationSearch}
                  className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors text-sm"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Map Status */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  Showing {filteredIssues.filter(i => i.upvotes > 50).length} high interest areas, 
                  {' '}{filteredIssues.filter(i => i.upvotes <= 50).length} regular issues
                </span>
                <span className="font-medium">
                  Filter: {filterOptions.find(opt => opt.value === statusFilter)?.label}
                </span>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 min-h-0 relative">
              {!leafletLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-500">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
                    <p className="text-sm">Loading map...</p>
                  </div>
                </div>
              )}
              <div 
                ref={mapRef} 
                className="w-full h-full"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Assign Worker Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden relative z-[10000]">
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
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 p-4 bg-sky-50 rounded-xl border border-sky-100">
                <p className="text-sm font-medium text-sky-900 mb-1">Issue: <span className="font-bold">{selectedIssue?.title}</span></p>
                <p className="text-sm text-sky-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedIssue?.location}
                </p>
                <p className="text-sm text-sky-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {selectedIssue?.upvotes} community upvotes
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">Select Worker</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2">
                  {workers.filter(worker => worker.status === 'available').map((worker) => (
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
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{worker.name}</p>
                            <p className="text-xs text-gray-500">{worker.phone}</p>
                          </div>
                        </div>
                        {selectedWorker === worker.name && (
                          <div className="w-5 h-5 bg-sky-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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

      {/* Filter dropdown overlay */}
      {showFilterDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
};

export default Home;
