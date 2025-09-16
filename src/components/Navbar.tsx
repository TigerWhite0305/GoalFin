import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings, User, Moon, Sun, Search, ChevronDown, LogOut, CreditCard, Wallet } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Statistiche", path: "/statistics" },
  { name: "Transazioni", path: "/transactions" },
  { name: "Portafoglio", path: "/portfolio" },
  { name: "Investimenti", path: "/investments" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Aggiorna activeItem in base al path corrente
  useEffect(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [location.pathname]);

  const handleNavigation = (item: { name: string; path: string }) => {
    setActiveItem(item.name);
    navigate(item.path);
    setIsOpen(false); // Chiude il menu mobile
  };

  const notifications = [
    { id: 1, title: "Nuovo dividendo ricevuto", amount: "+€12.50", time: "2 min fa", type: "income" },
    { id: 2, title: "PAC ETF eseguito", amount: "-€300.00", time: "1 ora fa", type: "investment" },
    { id: 3, title: "Obiettivo raggiunto!", description: "Vacanza in Giappone al 70%", time: "3 ore fa", type: "goal" }
  ];

  return (
    <header className="w-full backdrop-blur-md bg-gray-900/80 border-b border-gray-800 relative z-50">
      <div className="mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - cliccabile per tornare alla dashboard */}
        <button 
          onClick={() => handleNavigation({ name: "Dashboard", path: "/" })}
          className="flex items-center gap-3 hover:scale-105 transition-transform"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">FinanceDash</span>
        </button>

        {/* Menu Desktop */}
        <div className="hidden lg:flex flex-1 justify-center">
          <nav className="relative flex space-x-6 bg-white/10 rounded-full px-6 py-4 backdrop-blur-sm border border-white/20">
            {navItems.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <button 
                  key={item.name} 
                  onClick={() => handleNavigation(item)}
                  className="relative px-6 py-2 text-white text-lg font-medium transition-colors hover:text-gray-200"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-lg"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className={isActive ? "relative text-gray-900 font-semibold" : "relative"}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Area destra (Desktop) */}
        <div className="hidden lg:flex items-center space-x-3">
          
          {/* Search Button */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/60 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-14 w-80 bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-4 z-[9999]"
                >
                  <input
                    type="text"
                    placeholder="Cerca transazioni, investimenti..."
                    className="w-full bg-gray-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-600/50 focus:border-blue-500/50 focus:outline-none"
                  />
                  <div className="mt-3 space-y-2">
                    <div className="text-gray-400 text-sm font-medium">Ricerche recenti</div>
                    <div className="space-y-1">
                      {["Tesla TSLA", "PAC Settembre", "Spese alimentari"].map((search) => (
                        <button key={search} className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors text-sm">
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/60 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-14 w-96 bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-4 z-[9999]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">Notifiche</h3>
                    <button className="text-blue-400 text-sm hover:text-blue-300">Segna tutte come lette</button>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{notification.title}</div>
                            {notification.description && (
                              <div className="text-gray-400 text-sm mt-1">{notification.description}</div>
                            )}
                            <div className="text-gray-500 text-xs mt-2">{notification.time}</div>
                          </div>
                          {notification.amount && (
                            <div className={`font-semibold text-sm ${
                              notification.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {notification.amount}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-700/50">
                    <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Vedi tutte le notifiche
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/60 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 rounded-full p-2 text-gray-300 hover:text-white transition-all backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-14 w-64 bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-4 z-[9999]"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Mario Rossi</div>
                      <div className="text-gray-400 text-sm">mario@email.com</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      <span>Il mio profilo</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Impostazioni</span>
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-700/50">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          <button className="w-10 h-10 bg-gray-800/60 rounded-full flex items-center justify-center text-gray-300">
            <Bell className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-800/95 backdrop-blur-lg border-t border-gray-700/50"
          >
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = activeItem === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-white font-medium transition-colors ${
                      isActive 
                        ? "bg-white text-gray-900" 
                        : "bg-gray-700/50 hover:bg-gray-700/70"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              
              <div className="pt-3 mt-3 border-t border-gray-700/50">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors">
                  <User className="w-5 h-5" />
                  <span>Profilo</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Impostazioni</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay per chiudere dropdown */}
      {(showNotifications || showProfile || showSearch) && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
            setShowSearch(false);
          }}
        />
      )}
    </header>
  );
};

export default Navbar;