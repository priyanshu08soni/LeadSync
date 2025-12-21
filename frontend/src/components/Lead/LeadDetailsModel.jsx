import React from "react";
import { X, User, Mail, Phone, Building2, MapPin, Globe, Star, Wallet, Users, Calendar, Info, Clock } from "lucide-react";

export default function LeadDetailsModal({ selectedLead, onClose }) {
  if (!selectedLead) return null;

  const DetailItem = ({ icon: Icon, label, value, colorClass = "text-blue-500" }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
      <div className={`p-2.5 rounded-xl bg-opacity-10 ${colorClass.replace("text-", "bg-")} ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="dark:text-white text-slate-900 font-medium mt-0.5">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-4 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden border dark:border-white/10 border-slate-200 shadow-2xl flex flex-col max-h-[90vh] dark:bg-slate-950/80 bg-white">
        {/* Header */}
        <div className="p-6 border-b dark:border-white/5 border-slate-200 flex justify-between items-center dark:bg-slate-900/60 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-500/20">
              {selectedLead.first_name[0]}{selectedLead.last_name[0]}
            </div>
            <div>
              <h3 className="text-2xl font-black dark:text-slate-50 text-slate-900 leading-tight tracking-tight">
                {selectedLead.first_name} {selectedLead.last_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current ${selectedLead.status === 'won' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  selectedLead.status === 'lost' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                  {selectedLead.status}
                </span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-2">
                  <Clock size={12} className="text-slate-600" />
                  Joined {new Date(selectedLead.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-500 dark:hover:text-white hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-8 h-[1px] dark:bg-slate-800 bg-slate-200"></div>
                Contact Details
                <div className="flex-1 h-[1px] dark:bg-slate-800 bg-slate-200"></div>
              </h4>
            </div>
            <DetailItem icon={Mail} label="Email Address" value={selectedLead.email} colorClass="text-blue-400" />
            <DetailItem icon={Phone} label="Phone Number" value={selectedLead.phone} colorClass="text-emerald-400" />
            <DetailItem icon={Building2} label="Company" value={selectedLead.company} colorClass="text-purple-400" />
            <DetailItem icon={MapPin} label="Location" value={`${selectedLead.city || ""}${selectedLead.city && selectedLead.state ? ", " : ""}${selectedLead.state || ""}`} colorClass="text-rose-400" />

            <div className="md:col-span-2 mt-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-8 h-[1px] dark:bg-slate-800 bg-slate-200"></div>
                Pipeline Information
                <div className="flex-1 h-[1px] dark:bg-slate-800 bg-slate-200"></div>
              </h4>
            </div>
            <DetailItem icon={Wallet} label="Expected Value" value={`$${selectedLead.lead_value?.toLocaleString() || 0}`} colorClass="text-amber-400" />
            <DetailItem icon={Star} label="Lead Score" value={`${selectedLead.score || 0}/100`} colorClass="text-yellow-400" />
            <DetailItem icon={Globe} label="Lead Source" value={selectedLead.source?.replace("_", " ")} colorClass="text-cyan-400" />
            <DetailItem icon={Users} label="Sales Owner" value={selectedLead.assigned_to?.name} colorClass="text-indigo-400" />

            <div className="md:col-span-2 mt-6 p-4 rounded-2xl dark:bg-slate-900/40 bg-slate-100 border dark:border-white/5 border-slate-200 text-slate-400 text-xs font-bold flex items-center gap-3">
              <Calendar size={18} className="text-slate-600 shrink-0" />
              <span className="uppercase tracking-wider">System Log: Registered on {new Date(selectedLead.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t dark:border-white/5 border-slate-200 dark:bg-slate-900/60 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="glass-button py-2.5 px-8 text-sm font-black uppercase tracking-widest"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
