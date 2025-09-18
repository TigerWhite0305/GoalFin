import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings, User, Moon, Sun, Search, ChevronDown, LogOut, Wallet } from "lucide-react";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { useTheme } from "../../context/ThemeContext";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Hook per il tema
  const { toggleTheme, isDarkMode } = useTheme();

  // Hook per la ricerca globale
  const { 
    searchTerm, 
    setSearchTerm, 
    isOpen: showSearch, 
    setIsOpen: setShowSearch, 
    searchResults, 
    hasResults 
  } = useGlobalSearch();

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
    setIsOpen(false);
  };

  const handleSearchResultClick = (result: any) => {
    navigate(result.url);
    setShowSearch(false);
    setSearchTerm('');
  };

  const notifications = [
    { id: 1, title: "Nuovo dividendo ricevuto", amount: "+€12.50", time: "2 min fa", type: "income" },
    { id: 2, title: "PAC ETF eseguito", amount: "-€300.00", time: "1 ora fa", type: "investment" },
    { id: 3, title: "Obiettivo raggiunto!", description: "Vacanza in Giappone al 70%", time: "3 ore fa", type: "goal" }
  ];

  return (
    <header className={`w-full backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90' : 'bg-white/90'} border-b ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200/50'} relative z-50 transition-colors duration-300`}>
      <div className="mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={() => handleNavigation({ name: "Dashboard", path: "/" })}
          className="flex items-center gap-3 hover:scale-105 transition-transform group"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-bold text-xl hidden sm:block transition-colors`}>GoalFin</span>
        </button>

        {/* Menu Desktop */}
        <div className="hidden lg:flex flex-1 justify-center">
          <nav className={`relative flex space-x-2 ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-200/70'} rounded-2xl px-2 py-2 backdrop-blur-md border ${isDarkMode ? 'border-slate-700/30' : 'border-slate-300/50'}`}>
            {navItems.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <button 
                  key={item.name} 
                  onClick={() => handleNavigation(item)}
                  className={`relative px-6 py-3 ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} text-sm md:text-base font-medium transition-all rounded-xl`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-xl shadow-lg shadow-indigo-500/25"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className={`relative ${isActive ? 'text-white font-semibold' : ''} transition-colors`}>
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
              className={`w-12 h-12 ${isDarkMode ? 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white border-slate-700/30' : 'bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 hover:text-slate-900 border-slate-300/30'} rounded-xl flex items-center justify-center transition-all backdrop-blur-sm border shadow-lg hover:shadow-xl`}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-14 w-96 ${isDarkMode ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-slate-200/50'} backdrop-blur-xl rounded-2xl shadow-2xl border p-6 z-[9999]`}
                >
                  <input
                    type="text"
                    placeholder="Cerca transazioni, portfolio, obiettivi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full ${isDarkMode ? 'bg-slate-700/50 text-white placeholder-slate-400 border-slate-600/30' : 'bg-slate-100/50 text-slate-900 placeholder-slate-500 border-slate-300/30'} rounded-xl px-4 py-3 text-sm md:text-base border focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all`}
                    autoFocus
                  />
                  
                  {/* Risultati di ricerca */}
                  {searchTerm && (
                    <div className="mt-4 max-h-80 overflow-y-auto">
                      {hasResults ? (
                        <>
                          <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs md:text-sm font-medium mb-3`}>
                            {searchResults.length} risultat{searchResults.length === 1 ? 'o' : 'i'}
                          </div>
                          <div className="space-y-2">
                            {searchResults.map((result) => (
                              <button
                                key={result.id}
                                onClick={() => handleSearchResultClick(result)}
                                className={`w-full text-left px-4 py-3 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100/50'} rounded-xl transition-all group border border-transparent`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{result.icon}</span>
                                  <div className="flex-1">
                                    <div className={`${isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'} font-medium transition-colors text-sm md:text-base`}>
                                      {result.title}
                                    </div>
                                    <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs md:text-sm`}>
                                      {result.subtitle}
                                    </div>
                                  </div>
                                  {result.amount && (
                                    <div className="text-right">
                                      <div className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-semibold text-sm md:text-base`}>
                                        €{result.amount.toLocaleString()}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm md:text-base">Nessun risultato trovato</p>
                          <p className="text-xs md:text-sm">Prova con termini diversi</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Ricerche recenti */}
                  {!searchTerm && (
                    <div className="mt-4">
                      <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs md:text-sm font-medium mb-3`}>Ricerche recenti</div>
                      <div className="space-y-1">
                        {["Stipendio", "Affitto", "Netflix", "Vacanza Giappone"].map((search) => (
                          <button 
                            key={search} 
                            onClick={() => setSearchTerm(search)}
                            className={`w-full text-left px-3 py-2 ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'} rounded-lg transition-colors text-xs md:text-sm`}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-12 h-12 ${isDarkMode ? 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white border-slate-700/30' : 'bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 hover:text-slate-900 border-slate-300/30'} rounded-xl flex items-center justify-center transition-all backdrop-blur-sm border shadow-lg hover:shadow-xl relative`}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
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
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-14 w-96 ${isDarkMode ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-slate-200/50'} backdrop-blur-xl rounded-2xl shadow-2xl border p-6 z-[9999]`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-semibold text-base md:text-lg`}>Notifiche</h3>
                    <button 
                      onClick={() => {
                        console.log('Mark all as read - funzionalità da implementare');
                      }}
                      className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} text-xs md:text-sm font-medium transition-colors`}
                    >
                      Segna tutte come lette
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 ${isDarkMode ? 'bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/20' : 'bg-slate-100/50 hover:bg-slate-200/50 border-slate-300/20'} rounded-xl transition-colors cursor-pointer border`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-medium text-sm md:text-base`}>{notification.title}</div>
                            {notification.description && (
                              <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs md:text-sm mt-1`}>{notification.description}</div>
                            )}
                            <div className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-xs mt-2`}>{notification.time}</div>
                          </div>
                          {notification.amount && (
                            <div className={`font-semibold text-sm md:text-base ${
                              notification.amount.startsWith('+') ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')
                            }`}>
                              {notification.amount}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                    <button className={`w-full text-center ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} text-xs md:text-sm font-medium transition-colors`}>
                      Vedi tutte le notifiche
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-12 h-12 ${isDarkMode ? 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 border-slate-700/30' : 'bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 border-slate-300/30'} hover:text-amber-400 hover:border-amber-500/30 rounded-xl flex items-center justify-center transition-all backdrop-blur-sm border shadow-lg hover:shadow-xl`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className={`flex items-center gap-2 ${isDarkMode ? 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white border-slate-700/30' : 'bg-slate-200/60 hover:bg-slate-300/80 text-slate-600 hover:text-slate-900 border-slate-300/30'} rounded-xl p-2 transition-all backdrop-blur-sm border shadow-lg hover:shadow-xl`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
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
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-14 w-64 ${isDarkMode ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-slate-200/50'} backdrop-blur-xl rounded-2xl shadow-2xl border p-6 z-[9999]`}
                >
                  <div className={`flex items-center gap-3 mb-4 pb-4 border-b ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-semibold text-sm md:text-base`}>Mario Rossi</div>
                      <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs md:text-sm`}>mario@email.com</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <button 
                      onClick={() => console.log('Navigate to profile')}
                      className={`w-full flex items-center gap-3 px-3 py-3 ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'} rounded-xl transition-colors`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-xs md:text-sm font-medium">Il mio profilo</span>
                    </button>
                    <button 
                      onClick={() => console.log('Navigate to settings')}
                      className={`w-full flex items-center gap-3 px-3 py-3 ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'} rounded-xl transition-colors`}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-xs md:text-sm font-medium">Impostazioni</span>
                    </button>
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                    <button 
                      onClick={() => console.log('Logout - funzionalità da implementare')}
                      className={`w-full flex items-center gap-3 px-3 py-3 ${isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:text-red-700 hover:bg-red-500/5'} rounded-xl transition-colors`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-xs md:text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          <button className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800/60 text-slate-400' : 'bg-slate-200/60 text-slate-600'} rounded-xl flex items-center justify-center shadow-lg`}>
            <Bell className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${isDarkMode ? 'text-white hover:bg-slate-700/50' : 'text-slate-900 hover:bg-slate-200/50'} focus:outline-none p-2 rounded-xl transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            transition={{ duration: 0.2 }}
            className={`lg:hidden ${isDarkMode ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-slate-200/50'} backdrop-blur-lg border-t`}
          >
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = activeItem === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item)}
                    className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm md:text-base ${
                      isActive 
                        ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg" 
                        : (isDarkMode ? "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:text-white" : "bg-slate-100/50 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900")
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              
              <div className={`pt-3 mt-3 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} space-y-2`}>
                <button className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'} rounded-xl transition-colors text-sm md:text-base`}>
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profilo</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'} rounded-xl transition-colors text-sm md:text-base`}>
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Impostazioni</span>
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