import React from 'react';
import { Trash2, User } from 'lucide-react';

const Navbar = ({ currentPage = "home", selectedIssue = null }) => {
  const navigationItems = [
    { href: "/home", label: "Home", page: "home" },
    { href: "/issues", label: "Issues", page: "issues" },
    { href: "/workers", label: "Workers", page: "workers" },
    { href: "/overview", label: "Overview", page: "overview" },
  ];

  return (
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
  );
};

export default Navbar;