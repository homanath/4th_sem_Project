import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getMenuConfig } from '../../utils/navigation';

function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = getMenuConfig(role);

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Icons.Scale className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-bold">LawSystem</span>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-gray-800 text-white' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors mt-auto absolute bottom-8"
      >
        <Icons.LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}

Sidebar.propTypes = {
  role: PropTypes.oneOf(['super_admin', 'lawyer', 'client']).isRequired,
};

export default Sidebar;