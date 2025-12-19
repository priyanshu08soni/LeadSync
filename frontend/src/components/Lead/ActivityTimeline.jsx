import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNotification } from "../../contexts/NotificationContext";
import { Phone, Mail, Users, FileText, TrendingUp, UserCheck, Clock, MessageSquare } from "lucide-react";

export default function ActivityTimeline({ leadId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (leadId) {
      fetchActivities();
    }
  }, [leadId]);

  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activities/lead/${leadId}`);
      setActivities(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      showNotification("Failed to load activities", "error");
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: <Phone size={16} />,
      email: <Mail size={16} />,
      meeting: <Users size={16} />,
      note: <FileText size={16} />,
      status_change: <TrendingUp size={16} />,
      assignment: <UserCheck size={16} />,
    };
    return icons[type] || <FileText size={16} />;
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "bg-blue-500/20 text-blue-400 border-blue-500/20",
      email: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
      meeting: "bg-purple-500/20 text-purple-400 border-purple-500/20",
      note: "bg-amber-500/20 text-amber-400 border-amber-500/20",
      status_change: "bg-rose-500/20 text-rose-400 border-rose-500/20",
      assignment: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
    };
    return colors[type] || "bg-slate-500/20 text-slate-400 border-slate-500/20";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 glass-card rounded-2xl mx-2 border border-white/5">
        <MessageSquare size={40} className="mx-auto mb-3 text-slate-700" />
        <p className="text-slate-400 font-medium">No active history found</p>
        <p className="text-slate-600 text-xs mt-1">Activities will appear here once recorded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2">
      {activities.map((activity, index) => (
        <div key={activity._id} className="flex gap-4 group">
          {/* Timeline Line */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getActivityColor(activity.type)} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
              {getActivityIcon(activity.type)}
            </div>
            {index < activities.length - 1 && (
              <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent my-2"></div>
            )}
          </div>

          {/* Activity Content */}
          <div className="flex-1 pb-8">
            <div className="glass-card rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <h4 className="font-bold text-white capitalize flex items-center gap-2">
                  {activity.type.replace("_", " ")}
                  {activity.metadata?.outcome && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 uppercase tracking-wider">
                      {activity.metadata.outcome}
                    </span>
                  )}
                </h4>
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                  <Clock size={12} />
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{activity.description}</p>

              {/* Metadata */}
              {(activity.metadata?.duration || (activity.metadata?.old_status && activity.metadata?.new_status)) && (
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activity.metadata.duration && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Duration: <span className="text-slate-200 font-medium">{activity.metadata.duration} mins</span>
                    </div>
                  )}
                  {activity.metadata.old_status && activity.metadata.new_status && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 sm:col-span-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Status: <span className="text-slate-500 line-through">{activity.metadata.old_status}</span>
                      <TrendingUp size={12} className="text-slate-600" />
                      <span className="text-emerald-400 font-bold">{activity.metadata.new_status}</span>
                    </div>
                  )}
                </div>
              )}

              {/* User Info */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-400">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-[10px] shadow-lg">
                    {activity.user_id?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="font-medium text-slate-300">{activity.user_id?.name || "System"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
