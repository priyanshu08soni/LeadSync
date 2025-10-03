import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNotification } from "../../contexts/NotificationContext";
import { Phone, Mail, Users, FileText, TrendingUp, UserCheck } from "lucide-react";

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
      call: <Phone size={16} className="text-blue-600" />,
      email: <Mail size={16} className="text-green-600" />,
      meeting: <Users size={16} className="text-purple-600" />,
      note: <FileText size={16} className="text-yellow-600" />,
      status_change: <TrendingUp size={16} className="text-orange-600" />,
      assignment: <UserCheck size={16} className="text-pink-600" />,
    };
    return icons[type] || <FileText size={16} className="text-gray-600" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "bg-blue-100",
      email: "bg-green-100",
      meeting: "bg-purple-100",
      note: "bg-yellow-100",
      status_change: "bg-orange-100",
      assignment: "bg-pink-100",
    };
    return colors[type] || "bg-gray-100";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText size={48} className="mx-auto mb-4 text-gray-400" />
        <p>No activities recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity._id} className="flex gap-4">
          {/* Timeline Line */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 my-2"></div>
            )}
          </div>

          {/* Activity Content */}
          <div className="flex-1 pb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 capitalize">
                  {activity.type.replace("_", " ")}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{activity.description}</p>
              
              {/* Metadata */}
              {activity.metadata && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  {activity.metadata.duration && (
                    <p>Duration: {activity.metadata.duration} minutes</p>
                  )}
                  {activity.metadata.outcome && (
                    <p className="capitalize">Outcome: {activity.metadata.outcome.replace("_", " ")}</p>
                  )}
                  {activity.metadata.old_status && activity.metadata.new_status && (
                    <p>
                      Changed from <span className="font-medium">{activity.metadata.old_status}</span> to{" "}
                      <span className="font-medium">{activity.metadata.new_status}</span>
                    </p>
                  )}
                </div>
              )}

              {/* User Info */}
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-2">
                  {activity.user_id?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <span>{activity.user_id?.name || "Unknown User"}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}