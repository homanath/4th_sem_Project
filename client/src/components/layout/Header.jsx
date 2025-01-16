import React from 'react';
import PropTypes from 'prop-types';
import { Bell, Search } from 'lucide-react';
import { userPropType } from '../../utils/propTypes';

function Header({ user }) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: userPropType.isRequired,
};

export default Header;