import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Trash2, UserPlus, Calendar, CheckCircle, Users, Search, User, X, BarChart3, TrendingUp, Filter, ChevronDown, Droplets, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';

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

  // Updated issues data to match the Issues page exactly
  const [issues, setIssues] = useState([
    {
      id: "SAN-2024-001",
      title: "Overflowing Garbage Bin at MG Road Junction",
      photo: "https://images.stockcake.com/public/f/b/4/fb45bb5c-79c3-47c3-aa3b-88cf36aa3352_large/urban-waste-overflow-stockcake.jpg",
      location: "MG Road & Brigade Road Junction",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      latitude: 12.9716,
      longitude: 77.5946,
      dateReported: "2024-01-15",
      date: "2024-01-15",
      time: "09:30 AM",
      citizenName: "Rajesh Kumar",
      citizenEmail: "rajesh.kumar@gmail.com",
      reportedBy: "Rajesh Kumar",
      contactNumber: "+91-9876543210",
      status: "Open",
      assignedWorker: null,
      priority: "High",
      category: "Waste Management",
      department: "Sanitation",
      description: "Large garbage bin overflowing with waste, attracting pests and creating unsanitary conditions. Garbage scattered around the area.",
      upvotes: 78
    },
    {
      id: "SAN-2024-002",
      title: "Blocked Sewage Drain in Koramangala",
      photo: "https://img.freepik.com/premium-photo/storm-drain-clogged-with-trash-debris-causing-flooding-contamination_974629-202395.jpg",
      location: "Koramangala 4th Block & 80 Feet Road",
      coordinates: { lat: 12.9352, lng: 77.6245 },
      latitude: 12.9352,
      longitude: 77.6245,
      dateReported: "2024-01-14",
      date: "2024-01-14",
      time: "02:15 PM",
      citizenName: "Priya Sharma",
      citizenEmail: "priya.sharma@gmail.com",
      reportedBy: "Priya Sharma",
      contactNumber: "+91-9876543211",
      status: "In Progress",
      assignedWorker: "Suresh Patil",
      priority: "Medium",
      category: "Sewage & Drainage",
      department: "Sanitation",
      description: "Sewage drain completely blocked with solid waste and debris. Raw sewage overflow causing health hazards and foul smell in the area.",
      upvotes: 92
    },
    {
      id: "SAN-2024-003",
      title: "Unsanitary Public Restroom at Cubbon Park",
      photo: "https://www.shutterstock.com/image-photo/dirty-public-toilet-room-600nw-1111510655.jpg",
      location: "Cubbon Park Public Restroom",
      coordinates: { lat: 12.9698, lng: 77.5906 },
      latitude: 12.9698,
      longitude: 77.5906,
      dateReported: "2024-01-13",
      date: "2024-01-13",
      time: "11:45 AM",
      citizenName: "Amit Patel",
      citizenEmail: "amit.patel@yahoo.com",
      reportedBy: "Amit Patel",
      contactNumber: "+91-9876543212",
      status: "Resolved",
      assignedWorker: "Lakshmi Devi",
      resolvedBy: "Lakshmi Devi",
      resolvedDate: "2024-01-15",
      priority: "High",
      category: "Public Toilet Maintenance",
      department: "Sanitation",
      description: "Public restroom in extremely unsanitary condition. Broken fixtures, clogged toilets, no soap, and poor maintenance affecting public health.",
      upvotes: 34
    },
    {
      id: "SAN-2024-004",
      title: "Illegal Waste Dumping Site",
      photo: "https://circularphiladelphia.org/staging/wp-content/uploads/2022/10/Construction_debris_dumped_709x399.jpg",
      location: "Whitefield Industrial Area - Service Road",
      coordinates: { lat: 12.9698, lng: 77.7499 },
      latitude: 12.9698,
      longitude: 77.7499,
      dateReported: "2024-01-12",
      date: "2024-01-12",
      time: "04:30 PM",
      citizenName: "Deepika Reddy",
      citizenEmail: "deepika.reddy@hotmail.com",
      reportedBy: "Deepika Reddy",
      contactNumber: "+91-9876543213",
      status: "In Progress",
      assignedWorker: "Ravi Kumar",
      priority: "High",
      category: "Illegal Waste Dumping",
      department: "Sanitation",
      description: "Large pile of household waste and construction debris illegally dumped. Creating breeding ground for diseases and blocking proper waste management.",
      upvotes: 67
    },
    {
      id: "SAN-2024-005",
      title: "Broken Sewer Manhole Cover",
      photo: "https://media.istockphoto.com/id/1248462267/photo/close-up-of-ruptured-sewer-rusty-pipeline-which-cause-sewage-leakage-stream-and-pollution-old.jpg?s=612x612&w=0&k=20&c=fFaVqjGjC-wVGNc0b7fJtZ7E5cl4AOzM1__QETSlZ5k=",
      location: "Jayanagar 4th Block - 11th Main Road",
      coordinates: { lat: 12.9279, lng: 77.5937 },
      latitude: 12.9279,
      longitude: 77.5937,
      dateReported: "2024-01-11",
      date: "2024-01-11",
      time: "07:20 AM",
      citizenName: "Vikram Singh",
      citizenEmail: "vikram.singh@gmail.com",
      reportedBy: "Vikram Singh",
      contactNumber: "+91-9876543214",
      status: "Open",
      assignedWorker: null,
      priority: "High",
      category: "Sewer System Maintenance",
      department: "Sanitation",
      description: "Broken sewer manhole cover creating safety hazard and sewer gas leakage. Raw sewage exposure posing serious health risks to pedestrians.",
      upvotes: 45
    },
    {
      id: "SAN-2024-006",
      title: "Street Sweeping Required on Commercial Street",
      photo: "https://tse4.mm.bing.net/th/id/OIP.B04dWyGds6Tlp1SP0YZPDQHaDt?pid=Api&P=0&h=180",
      location: "Commercial Street - Central Bangalore",
      coordinates: { lat: 12.9279, lng: 77.6271 },
      latitude: 12.9279,
      longitude: 77.6271,
      dateReported: "2024-01-10",
      date: "2024-01-10",
      time: "10:15 AM",
      citizenName: "Anita Gupta",
      citizenEmail: "anita.gupta@rediffmail.com",
      reportedBy: "Anita Gupta",
      contactNumber: "+91-9876543215",
      status: "Resolved",
      assignedWorker: "Manoj Yadav",
      resolvedBy: "Manoj Yadav",
      resolvedDate: "2024-01-12",
      priority: "Medium",
      category: "Street Cleaning",
      department: "Sanitation",
      description: "Commercial street heavily littered with food waste, plastic bags, and debris. Requires immediate cleaning and regular maintenance schedule.",
      upvotes: 23
    }
  ]);

  // Worker data with availability status (updated to match issues page workers)
  const [workers] = useState([
    { id: 1, name: 'Suresh Patil', status: 'available', currentTask: null, phone: '+91-9876543301' },
    { id: 2, name: 'Lakshmi Devi', status: 'busy', currentTask: 'Public toilet maintenance', phone: '+91-9876543302' },
    { id: 3, name: 'Ravi Kumar', status: 'available', currentTask: null, phone: '+91-9876543303' },
    { id: 4, name: 'Manoj Yadav', status: 'available', currentTask: null, phone: '+91-9876543304' },
    { id: 5, name: 'Pradeep Sharma', status: 'available', currentTask: null, phone: '+91-9876543305' }
  ]);

  // Convert status format between pages
  const convertStatusFromIssuesPage = (status) => {
    switch (status) {
      case 'Open': return 'pending';
      case 'In Progress': return 'in-progress';
      case 'Resolved': return 'resolved';
      default: return 'pending';
    }
  };

  const convertStatusToIssuesPage = (status) => {
    switch (status) {
      case 'pending': return 'Open';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Open';
    }
  };

  // Filter issues based on selected status (convert from issues page format)
  const filteredIssues = statusFilter === 'all' 
    ? issues 
    : issues.filter(issue => convertStatusFromIssuesPage(issue.status) === statusFilter);

  const getStatusColor = (status) => {
    const convertedStatus = typeof status === 'string' && ['Open', 'In Progress', 'Resolved'].includes(status)
      ? convertStatusFromIssuesPage(status)
      : status;
    
    switch (convertedStatus) {
      case 'pending': return '#ef4444';
      case 'in-progress': return '#f97316';
      case 'resolved': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    const convertedStatus = typeof status === 'string' && ['Open', 'In Progress', 'Resolved'].includes(status)
      ? convertStatusFromIssuesPage(status)
      : status;
    
    switch (convertedStatus) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown';
    }
  };

  const getStatusBgColor = (status) => {
    const convertedStatus = typeof status === 'string' && ['Open', 'In Progress', 'Resolved'].includes(status)
      ? convertStatusFromIssuesPage(status)
      : status;
    
    switch (convertedStatus) {
      case 'pending': return 'bg-red-500';
      case 'in-progress': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter options (updated to use converted status counts)
  const filterOptions = [
    { value: 'all', label: 'All Issues', count: issues.length },
    { value: 'pending', label: 'Pending', count: issues.filter(i => convertStatusFromIssuesPage(i.status) === 'pending').length },
    { value: 'in-progress', label: 'In Progress', count: issues.filter(i => convertStatusFromIssuesPage(i.status) === 'in-progress').length },
    { value: 'resolved', label: 'Resolved', count: issues.filter(i => convertStatusFromIssuesPage(i.status) === 'resolved').length }
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
        // Center map on Bangalore coordinates (matching the issues locations)
        mapInstance.current = window.L.map(mapRef.current, {
          center: [12.9716, 77.5946], // MG Road junction coordinates
          zoom: 12,
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
  }, [statusFilter, leafletLoaded, issues]);

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
        : issues.filter(issue => convertStatusFromIssuesPage(issue.status) === statusFilter);

      console.log(`Filter: ${statusFilter}`);
      console.log(`Total issues: ${issues.length}`);
      console.log(`Filtered issues: ${currentFilteredIssues.length}`);

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
          status: 'In Progress' 
        } : issue
      ));
      
      setSelectedWorker('');
      setAssignmentNote('');
      setShowAssignModal(false);
    }
  };

  const handleStatusUpdate = (issueId, newStatus) => {
    const issuesPageStatus = convertStatusToIssuesPage(newStatus);
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { 
        ...issue, 
        status: issuesPageStatus,
        ...(newStatus === 'resolved' ? { resolvedDate: '2024-01-15', resolvedBy: 'Admin' } : {})
      } : issue
    ));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => ({ 
        ...prev, 
        status: issuesPageStatus,
        ...(newStatus === 'resolved' ? { resolvedDate: '2024-01-15', resolvedBy: 'Admin' } : {})
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
      // Reset to Bangalore overview
      mapInstance.current.setView([12.9716, 77.5946], 12, {
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
        }, 1000);
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
        <span>{issue.dateReported}</span>
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
      {/* Use Navbar Component */}
      <Navbar currentPage="home" selectedIssue={selectedIssue} />

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
                      <span className="text-gray-700">{selectedIssue.dateReported} at {selectedIssue.time}</span>
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

                    {selectedIssue.status === 'Resolved' && selectedIssue.resolvedBy && (
                      <div className="bg-green-50 p-2 rounded-lg">
                        <span className="text-green-700 font-medium text-sm">Resolved by:</span>
                        <p className="text-green-600 text-sm">{selectedIssue.resolvedBy} on {selectedIssue.resolvedDate}</p>
                      </div>
                    )}
                  </div>

                  {selectedIssue.status !== 'Resolved' && (
                    <div className="space-y-2 pt-2 border-t">
                      {selectedIssue.status === 'Open' && (
                        <button 
                          onClick={() => handleAssignWorker(selectedIssue)}
                          className="w-full bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center text-sm"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Worker
                        </button>
                      )}

                      <div className="flex gap-2">
                        {selectedIssue.status === 'Open' && (
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
                  <span>Open</span>
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
