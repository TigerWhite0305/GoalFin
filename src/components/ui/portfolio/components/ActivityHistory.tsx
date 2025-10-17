// src/components/ui/portfolio/components/ActivityHistory.tsx
import React from 'react';
import { History, MoreVertical, Trash2, Plus, Edit, DollarSign, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../hooks/portfolioUtils';
import type { ActivityHistoryItem } from '../hooks/usePortfolioData';

interface ActivityHistoryProps {
  activityHistory: ActivityHistoryItem[];
  theme: any;
  openMenuId: string | null;
  onToggleMenu: (menuId: string | null) => void;
  onDeleteActivity: (activityId: number) => void;
}

// Icon mapping for activity types
const getActivityIcon = (iconName: string) => {
  switch (iconName) {
    case 'Plus': return Plus;
    case 'Edit': return Edit;
    case 'Trash2': return Trash2;
    case 'DollarSign': return DollarSign;
    case 'ArrowLeftRight': return ArrowLeftRight;
    case 'ArrowUpRight': return ArrowUpRight;
    default: return History;
  }
};

const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  activityHistory,
  theme,
  openMenuId,
  onToggleMenu,
  onDeleteActivity
}) => {
  return (
    <div className={`${theme.background.card} ${theme.border.card} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
      <div className="p-4 border-b border-gray-700/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/25">
            <History className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Storico Attività</h3>
        </div>
      </div>
      
      <div className="h-80 overflow-y-auto p-4">
        <div className="space-y-3">
          {activityHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className={`w-12 h-12 ${theme.text.muted} mx-auto mb-3`} />
              <p className={`${theme.text.muted} text-sm`}>Nessuna attività registrata</p>
            </div>
          ) : (
            activityHistory.slice(0, 20).map((activity) => {
              const IconComponent = getActivityIcon(activity.icon);
              
              return (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 ${theme.background.secondary}/30 rounded-lg hover:bg-gray-700/30 transition-colors group`}
                >
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ 
                      backgroundColor: `${activity.color}20`, 
                      borderColor: `${activity.color}40`,
                    }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: activity.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`${theme.text.primary} text-sm font-medium leading-tight`}>
                      {activity.description}
                    </p>
                    <p className={`${theme.text.muted} text-xs mt-1`}>
                      {formatDate(activity.timestamp)} alle {formatTime(activity.timestamp)}
                    </p>
                  </div>
                  
                  {activity.amount && (
                    <div 
                      className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0`} 
                      style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
                    >
                      {formatCurrency(activity.amount)}
                    </div>
                  )}
                  
                  <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onToggleMenu(activity.id.toString())}
                      className={`p-1 ${theme.text.muted} hover:text-gray-50 transition-colors rounded hover:bg-gray-700/50`}
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>
                    
                    {openMenuId === activity.id.toString() && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => onToggleMenu(null)} />
                        <div className={`absolute top-6 right-0 z-50 w-36 ${theme.background.card} ${theme.border.card} border rounded-lg shadow-xl overflow-hidden`}>
                          <button
                            onClick={() => onDeleteActivity(activity.id)}
                            className={`w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                          >
                            <Trash2 className="w-3 h-3" />
                            Elimina Log
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {activityHistory.length > 20 && (
        <div className="p-4 border-t border-gray-700/30 text-center">
          <button className={`text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors`}>
            Mostra tutte le attività ({activityHistory.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityHistory;