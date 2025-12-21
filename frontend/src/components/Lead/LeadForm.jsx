import React from "react";
import { X, User, Mail, Phone, Building2, MapPin, Globe, Star, Wallet, Users, Send, Activity } from "lucide-react";
import CustomDropdown from "../common/CustomDropdown";

export default function LeadForm({
  showForm,
  salesReps,
  editLead,
  formData,
  onInputChange,
  onSubmit,
  onClose,
}) {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-4 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shadow-lg ${editLead ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>
              {editLead ? <Send size={24} /> : <Users size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-50 uppercase tracking-tight">
                {editLead ? "Update Lead Details" : "Create New Lead"}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Professional Input Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="lead-form" onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4 md:col-span-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-white/5 pb-2">
                Personal Information
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={onInputChange}
                    required
                    className="glass-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={onInputChange}
                    className="glass-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={onInputChange}
                    required
                    className="glass-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={onInputChange}
                    className="glass-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="company"
                    placeholder="Acme Inc."
                    value={formData.company}
                    onChange={onInputChange}
                    className="glass-input pl-10 w-full"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4 md:col-span-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-white/5 pb-2 mt-4">
                Location
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={onInputChange}
                    className="glass-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">State / Region</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={onInputChange}
                    className="glass-input pl-10 w-full"
                  />
                </div>
              </div>

              {/* Classification */}
              <div className="space-y-4 md:col-span-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-white/5 pb-2 mt-4">
                Lead Classification
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Source</label>
                <div className="relative z-30">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" size={18} />
                  <CustomDropdown
                    value={formData.source}
                    onChange={(value) => onInputChange({ target: { name: 'source', value } })}
                    options={[
                      { value: "website", label: "Website" },
                      { value: "facebook_ads", label: "Facebook Ads" },
                      { value: "google_ads", label: "Google Ads" },
                      { value: "referral", label: "Referral" },
                      { value: "events", label: "Events" },
                      { value: "other", label: "Other" }
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <div className="relative z-20">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" size={18} />
                  <CustomDropdown
                    value={formData.status}
                    onChange={(value) => onInputChange({ target: { name: 'status', value } })}
                    options={[
                      { value: "new", label: "New" },
                      { value: "contacted", label: "Contacted" },
                      { value: "qualified", label: "Qualified" },
                      { value: "lost", label: "Lost" },
                      { value: "won", label: "Won" }
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lead Score (0-100)</label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="number"
                    name="score"
                    min="0"
                    max="100"
                    placeholder="85"
                    value={formData.score}
                    onChange={onInputChange}
                    className="glass-input pl-10 w-full font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lead Value ($)</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="number"
                    name="lead_value"
                    min="0"
                    placeholder="5000"
                    value={formData.lead_value}
                    onChange={onInputChange}
                    className="glass-input pl-10 w-full font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Sales Representative</label>
                <div className="relative z-10">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" size={18} />
                  <CustomDropdown
                    value={formData.assigned_to?._id || formData.assigned_to || ""}
                    onChange={(value) => onInputChange({ target: { name: 'assigned_to', value } })}
                    options={[
                      { value: "", label: "-- Select Representative --" },
                      ...salesReps.map((rep) => ({
                        value: rep._id,
                        label: `${rep.name} (${rep.email})`
                      }))
                    ]}
                    placeholder="-- Select Representative --"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="glass-button-secondary py-2.5 px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="lead-form"
            className="glass-button py-2.5 px-8"
          >
            {editLead ? "Save Changes" : "Create Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

