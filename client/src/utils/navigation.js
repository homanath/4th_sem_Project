// Menu configurations for different user roles
export const getMenuConfig = (role) => ({
  admin: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/lawyers', label: 'Lawyers', icon: 'Users' },
    { path: '/cases', label: 'Cases', icon: 'Scale' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
  lawyer: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/cases', label: 'Cases', icon: 'Scale' },
    { path: '/schedules', label: 'Schedules', icon: 'Calendar' },
    { path: '/clients', label: 'Clients', icon: 'Users' },
    { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    { path: '/profile', label: 'Profile', icon: 'User' },
  ],
  client: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/my-cases', label: 'My Cases', icon: 'Scale' },
    { path: '/schedules', label: 'Schedules', icon: 'Calendar' },
    { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    { path: '/profile', label: 'Profile', icon: 'User' },
  ],
})[role] || [];