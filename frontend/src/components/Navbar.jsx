import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Home, User, ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Shield className="h-8 w-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-50 transition-colors">
                BlockGuard
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-slate-800 text-blue-400' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              {user && (user.role === 'CITIZEN' || user.role === 'ADMIN') && (
                <Link
                  to="/user"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/user') ? 'bg-slate-800 text-blue-400' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Citizen Portal</span>
                </Link>
              )}
              
              {user && (user.role === 'POLICE' || user.role === 'ADMIN') && (
                <Link
                  to="/police"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/police') ? 'bg-slate-800 text-blue-400' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Police Portal</span>
                </Link>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login') ? 'bg-slate-800 text-blue-400' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
