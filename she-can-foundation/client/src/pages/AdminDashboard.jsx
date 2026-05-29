import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const CATEGORY_COLORS = {
  'Full Stack': 'bg-blue-100 text-blue-700',
  'AI Engineer': 'bg-purple-100 text-purple-700',
  'UI/UX':       'bg-pink-100 text-pink-700',
  'Outreach':    'bg-green-100 text-green-700',
  'General':     'bg-gray-100 text-gray-600',
};

const LEVEL_COLORS = {
  Beginner:     'text-green-600',
  Intermediate: 'text-orange-500',
  Advanced:     'text-red-500',
};

const STATUS_COLORS = {
  'Pending':              'bg-yellow-100 text-yellow-700',
  'Under Review':         'bg-orange-100 text-orange-700',
  'Shortlisted':          'bg-blue-100 text-blue-700',
  'Interview Scheduled':  'bg-purple-100 text-purple-700',
  'Selected':             'bg-green-100 text-green-700',
  'Rejected':             'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const { admin, logout }         = useAuth();
  const navigate                  = useNavigate();
  const [applications, setApps]   = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [chartsData, setChartsData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [selected, setSelected]   = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [interviewFields, setInterviewFields] = useState({ interviewDate: '', interviewTime: '', meetingLink: '', joiningInstructions: '' });
  const [savingInterview, setSavingInterview] = useState(false);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)               params.search   = search;
      if (filterCat !== 'All')  params.category = filterCat;
      const { data } = await api.get('/applications', { params });
      setApps(data.data);
      setAnalytics(data.analytics);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [search, filterCat]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [chartsRes, recsRes] = await Promise.all([
        api.get('/analytics/charts'),
        api.get('/analytics/recommendations')
      ]);
      setChartsData(chartsRes.data.data);
      setRecommendations(recsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard analytics');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApps();
      fetchDashboardData();
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchApps, fetchDashboardData]);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const confirmDelete = async () => {
    try {
      await api.delete(`/applications/${deleteId}`);
      toast.success('Application deleted');
      setDeleteId(null);
      fetchApps();
      fetchDashboardData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchApps();
      fetchDashboardData();
      if (selected && selected._id === id) {
        setSelected({ ...selected, status: newStatus });
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openModal = (app) => {
    setSelected(app);
    setInterviewFields({
      interviewDate:        app.interviewDate        || '',
      interviewTime:        app.interviewTime        || '',
      meetingLink:          app.meetingLink          || '',
      joiningInstructions:  app.joiningInstructions  || '',
    });
  };

  const saveInterviewDetails = async () => {
    if (!selected) return;
    setSavingInterview(true);
    try {
      const payload = { status: selected.status || 'Pending', ...interviewFields };
      await api.patch(`/applications/${selected._id}/status`, payload);
      toast.success('Interview details saved!');
      setSelected({ ...selected, ...interviewFields });
      fetchApps();
    } catch {
      toast.error('Failed to save interview details');
    } finally {
      setSavingInterview(false);
    }
  };

  const analyticsCards = [
    { label: 'Total Applications', value: analytics.total     ?? 0, icon: '📋', color: 'from-rose to-rose-dark' },
    { label: 'Recent (7 Days)',    value: chartsData?.recentCount ?? 0, icon: '⏳', color: 'from-blue-400 to-blue-600' },
    { label: 'AI Engineers',       value: analytics.aiEng     ?? 0, icon: '🤖', color: 'from-purple-400 to-purple-600' },
    { label: 'UI/UX Designers',    value: analytics.uiux      ?? 0, icon: '🎨', color: 'from-pink-400 to-pink-600' },
    { label: 'Outreach',           value: analytics.outreach  ?? 0, icon: '📣', color: 'from-green-400 to-green-600' },
  ];

  const pieColors = ['#e8476a', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#64748b', '#06b6d4', '#ec4899'];

  return (
    <div className="min-h-screen bg-[#f5f5f8] font-body">

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-60 bg-[#1e1b4b] text-white flex flex-col z-40 hidden lg:flex">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-display text-lg font-black text-rose">
            She<span className="text-white">Can</span>
          </div>
          <div className="text-xs text-white/40 mt-0.5">Admin Portal</div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {[
            { icon: '📊', label: 'Dashboard' },
            { icon: '📋', label: 'Applications' },
          ].map((item) => (
            <div key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                activeTab === item.label
                  ? 'bg-rose text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/10">
          <div className="text-xs text-white/40 mb-1">Logged in as</div>
          <div className="text-sm text-white font-medium truncate">{admin?.email}</div>
          <button onClick={handleLogout}
            className="mt-3 text-xs text-white/40 hover:text-rose transition-colors flex items-center gap-1">
            ← Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-60">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-display text-xl font-bold text-charcoal">{activeTab}</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-charcoal/40 hidden sm:block">{admin?.email}</span>
            <button onClick={handleLogout}
              className="text-xs font-semibold text-rose border border-rose/20 px-3 py-1.5 rounded-lg hover:bg-rose-light/30 transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="px-6 py-8">
          
          {/* ──────────────── DASHBOARD TAB ──────────────── */}
          <div className={`${activeTab === 'Dashboard' ? '' : 'hidden'}`}>
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
              {analyticsCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-3`}>
                    {card.icon}
                  </div>
                  <div className="text-2xl font-display font-black text-charcoal">{card.value}</div>
                  <div className="text-xs text-charcoal/50 mt-0.5 font-medium">{card.label}</div>
                </motion.div>
              ))}
            </div>

            {/* AI Recommendations */}
            <div className="mb-8">
              <h3 className="font-display text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                ✨ AI Recommended Candidates
              </h3>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {recommendations.map((rec, i) => (
                  <motion.div 
                    key={rec._id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-5 rounded-2xl border border-rose/10 shadow-sm relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-charcoal text-lg">{rec.firstName} {rec.lastName}</div>
                        <div className="text-xs text-charcoal/50 font-medium truncate max-w-[150px]">{rec.areaOfInterest}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-rose">{rec.matchScore}%</div>
                        <div className="text-[9px] uppercase tracking-wider font-bold text-charcoal/30">Match Score</div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mb-4 overflow-hidden">
                      <motion.div 
                        initial={{width:0}} 
                        animate={{width:`${rec.matchScore}%`}} 
                        transition={{duration: 1, ease: 'easeOut'}}
                        className="bg-gradient-to-r from-rose to-rose-dark h-full rounded-full" 
                      />
                    </div>
                    {/* Top skills badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {rec.topSkills.map((s, idx) => (
                        s ? <span key={idx} className="text-[10px] font-bold px-2 py-1 bg-rose/5 text-rose rounded-md">{s}</span> : null
                      ))}
                    </div>
                    <a href={`/uploads/${rec.resumePath}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-500 hover:underline">
                      📄 View Resume
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Line Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                 <h3 className="font-bold text-charcoal mb-4">Applications Trend (30 Days)</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartsData?.timeline || []}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                       <XAxis dataKey="_id" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                       <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                       <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}/>
                       <Line type="monotone" dataKey="count" stroke="#e8476a" strokeWidth={3} dot={{r: 4, fill: '#e8476a', strokeWidth: 0}} activeDot={{r: 6}} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                 <h3 className="font-bold text-charcoal mb-4">Roles Distribution</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={chartsData?.roles || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                         {chartsData?.roles?.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                         ))}
                       </Pie>
                       <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}/>
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm lg:col-span-2">
                 <h3 className="font-bold text-charcoal mb-4">Status Overview</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartsData?.status || []}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                       <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                       <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                       <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}/>
                       <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={50}>
                         {chartsData?.status?.map((entry, index) => {
                           // Try to match bar color with our status colors
                           const colorMap = { Pending: '#eab308', Shortlisted: '#3b82f6', Selected: '#10b981', Rejected: '#ef4444' };
                           return <Cell key={`cell-${index}`} fill={colorMap[entry.name] || '#3b82f6'} />;
                         })}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            </div>
          </div>


          {/* ──────────────── APPLICATIONS TAB ──────────────── */}
          <div className={`${activeTab === 'Applications' ? '' : 'hidden'}`}>
            {/* Filters */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-50 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 text-sm">🔍</span>
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, college, skills…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-100 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All', 'Full Stack', 'AI Engineer', 'UI/UX', 'Outreach', 'General'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                      filterCat === cat
                        ? 'bg-rose text-white shadow-sm'
                        : 'bg-gray-100 text-charcoal/60 hover:bg-rose-light hover:text-rose'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <div className="w-8 h-8 border-4 border-rose border-t-transparent rounded-full animate-spin" />
                </div>
              ) : applications.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <div className="text-charcoal/40 text-sm font-medium">No applications found</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50 text-left">
                        {['Applicant','College','Role','Level','Status','Date','Actions'].map((h) => (
                          <th key={h} className="px-5 py-4 text-xs font-bold text-charcoal/40 uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, i) => (
                        <motion.tr
                          key={app._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-gray-50 hover:bg-rose-light/10 transition-colors group"
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {app.firstName[0]}{app.lastName[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-charcoal">{app.firstName} {app.lastName}</div>
                                <div className="text-xs text-charcoal/40">{app.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-charcoal/70 max-w-[140px] truncate">{app.college}</td>
                          <td className="px-5 py-4 text-charcoal/70 whitespace-nowrap text-xs">
                            <span className={`px-2 py-1 rounded-full ${CATEGORY_COLORS[app.category] || CATEGORY_COLORS['General']}`}>{app.category}</span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`text-xs font-semibold ${LEVEL_COLORS[app.experienceLevel]}`}>
                              {app.experienceLevel}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status || 'Pending']}`}>
                              {app.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-xs text-charcoal/40">
                            {new Date(app.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openModal(app)}
                                className="text-xs font-semibold text-rose hover:underline">
                                View
                              </button>
                              {app.resumePath && (
                                <a
                                  href={`/uploads/${app.resumePath}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="text-xs font-semibold text-blue-500 hover:underline"
                                >
                                  Resume
                                </a>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-charcoal/40 text-right">
              Showing {applications.length} result{applications.length !== 1 ? 's' : ''}
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center text-white text-lg font-bold">
                    {selected.firstName[0]}{selected.lastName[0]}
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-black text-charcoal">
                      {selected.firstName} {selected.lastName}
                    </h2>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[selected.category]}`}>
                      {selected.category}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-charcoal/30 hover:text-charcoal text-xl leading-none">✕</button>
              </div>

              <div className="space-y-4 text-sm">
                
                {/* Status Updater */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex gap-3 items-center">
                    <span className="text-charcoal/60 font-bold text-xs uppercase tracking-wider w-28 flex-shrink-0">Status</span>
                    <select
                      value={selected.status || 'Pending'}
                      onChange={(e) => updateStatus(selected._id, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-rose bg-white text-charcoal shadow-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Interview / Joining Details */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-xs font-bold text-charcoal/50 uppercase tracking-wider mb-3">Interview &amp; Joining Details</div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider block mb-1">Interview Date</label>
                        <input
                          type="date"
                          value={interviewFields.interviewDate}
                          onChange={(e) => setInterviewFields(p => ({ ...p, interviewDate: e.target.value }))}
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-rose bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider block mb-1">Interview Time</label>
                        <input
                          type="time"
                          value={interviewFields.interviewTime}
                          onChange={(e) => setInterviewFields(p => ({ ...p, interviewTime: e.target.value }))}
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-rose bg-white"
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider block mb-1">Meeting Link</label>
                      <input
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={interviewFields.meetingLink}
                        onChange={(e) => setInterviewFields(p => ({ ...p, meetingLink: e.target.value }))}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-rose bg-white"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider block mb-1">Joining Instructions</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Please report to office on Day 1 at 9 AM…"
                        value={interviewFields.joiningInstructions}
                        onChange={(e) => setInterviewFields(p => ({ ...p, joiningInstructions: e.target.value }))}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-rose bg-white resize-none"
                      />
                    </div>
                    <button
                      onClick={saveInterviewDetails}
                      disabled={savingInterview}
                      className="w-full text-xs font-bold bg-[#1e1b4b] text-white py-2 rounded-lg hover:bg-[#2d2a6e] transition-colors disabled:opacity-60"
                    >
                      {savingInterview ? 'Saving…' : '💾 Save Interview Details'}
                    </button>
                  </div>
                </div>

                {[
                  ['Email',          selected.email],
                  ['Phone',          selected.phone || '—'],
                  ['College',        selected.college],
                  ['Skills',         selected.skills],
                  ['Area',           selected.areaOfInterest],
                  ['Level',          selected.experienceLevel],
                  ['LinkedIn',       selected.linkedIn || '—'],
                  ['Applied On',     new Date(selected.createdAt).toLocaleString('en-IN')],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="text-charcoal/40 font-medium w-24 flex-shrink-0">{k}</span>
                    <span className="text-charcoal break-all">{v}</span>
                  </div>
                ))}
                
                {selected.message && (
                  <div className="mt-4 p-4 bg-cream rounded-xl text-charcoal/70 leading-relaxed text-sm">
                    "{selected.message}"
                  </div>
                )}
                
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  {selected.resumePath && (
                    <a href={`/uploads/${selected.resumePath}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 btn-primary justify-center py-2.5">
                      📄 View Resume
                    </a>
                  )}
                  <button onClick={() => setDeleteId(selected._id)}
                    className="flex-1 btn-outline justify-center py-2.5 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500">
                    🗑️ Delete App
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="font-display text-xl font-black text-charcoal mb-2">Delete Application?</h3>
              <p className="text-charcoal/50 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 btn-outline py-2.5 justify-center text-sm">Cancel</button>
                <button onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white rounded-full py-2.5 text-sm font-semibold hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
