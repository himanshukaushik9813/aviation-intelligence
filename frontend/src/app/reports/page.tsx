"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Globe,
  BarChart3,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  X,
  Grid3x3,
  List,
  Star,
  Eye,
  Share2,
} from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Weekly Disruption Summary",
    description: "Comprehensive overview of global aviation disruptions for the past 7 days including real-time tracking and predictive analytics",
    date: "Mar 09, 2026",
    timestamp: "2026-03-09T14:30:00",
    type: "Weekly",
    status: "Ready",
    icon: Calendar,
    color: "#3B82F6",
    gradient: "from-[#3B82F6] to-[#2563EB]",
    size: "2.4 MB",
    downloads: 156,
    priority: "Medium",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Airline Impact Assessment Q1",
    description: "Quarterly carrier impact analysis with financial implications and trend projections across major carriers",
    date: "Mar 07, 2026",
    timestamp: "2026-03-07T10:15:00",
    type: "Quarterly",
    status: "Ready",
    icon: BarChart3,
    color: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#7C3AED]",
    size: "5.1 MB",
    downloads: 243,
    priority: "High",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Geopolitical Risk Forecast",
    description: "ML-generated risk forecast for upcoming 30-day period across all monitored regions with predictive modeling",
    date: "Mar 06, 2026",
    timestamp: "2026-03-06T16:45:00",
    type: "Monthly",
    status: "Ready",
    icon: TrendingUp,
    color: "#06B6D4",
    gradient: "from-[#06B6D4] to-[#0891B2]",
    size: "3.7 MB",
    downloads: 189,
    priority: "High",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Critical Incident Report — Ukraine FIR",
    description: "Detailed incident analysis of airspace closure escalation and flight rerouting impact with operational recommendations",
    date: "Mar 05, 2026",
    timestamp: "2026-03-05T08:20:00",
    type: "Incident",
    status: "Ready",
    icon: AlertTriangle,
    color: "#EF4444",
    gradient: "from-[#EF4444] to-[#DC2626]",
    size: "1.8 MB",
    downloads: 412,
    priority: "Critical",
    isFavorite: true,
  },
  {
    id: 5,
    title: "Airspace Restriction Changes",
    description: "Monthly report on NOTAM updates, airspace status changes, and regulatory impacts across global regions",
    date: "Mar 01, 2026",
    timestamp: "2026-03-01T12:00:00",
    type: "Monthly",
    status: "Ready",
    icon: Globe,
    color: "#10B981",
    gradient: "from-[#10B981] to-[#059669]",
    size: "4.2 MB",
    downloads: 198,
    priority: "Medium",
    isFavorite: false,
  },
  {
    id: 6,
    title: "Security Assessment — Middle East",
    description: "Regional security assessment covering Iran, Iraq, Syria, Lebanon, and Yemen corridors with threat analysis",
    date: "Feb 28, 2026",
    timestamp: "2026-02-28T15:30:00",
    type: "Special",
    status: "Ready",
    icon: Shield,
    color: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#D97706]",
    size: "6.3 MB",
    downloads: 267,
    priority: "High",
    isFavorite: true,
  },
];

const filterOptions = ["All", "Weekly", "Monthly", "Quarterly", "Incident", "Special"];
const sortOptions = [
  { label: "Newest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
  { label: "Most Downloaded", value: "downloads" },
  { label: "Priority", value: "priority" },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [favorites, setFavorites] = useState<number[]>([2, 4, 6]);
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

  const handleExportReport = (report: typeof reports[0], format: 'txt' | 'json' = 'txt') => {
    try {
      if (format === 'json') {
        const reportData = {
          id: report.id,
          title: report.title,
          description: report.description,
          date: report.date,
          timestamp: report.timestamp,
          type: report.type,
          status: report.status,
          size: report.size,
          downloads: report.downloads,
          priority: report.priority,
          generatedAt: new Date().toISOString(),
          data: {
            summary: "Comprehensive aviation disruption analysis",
            metrics: {
              totalFlights: 48729,
              affectedFlights: 3214,
              disruptionRate: 6.6,
              airlinesImpacted: 127,
              routesDisrupted: 2847,
            },
            analysis: {
              trends: "Increasing disruption in Eastern European corridors",
              recommendations: [
                "Implement alternative routing strategies",
                "Increase buffer times for affected routes",
                "Monitor geopolitical developments",
              ],
            },
          },
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Report exported as JSON', {
          description: `${report.title} has been downloaded`,
        });
      } else {
        const pdfContent = `
╔════════════════════════════════════════════════════════════════════════════════╗
║                  AVIATION DISRUPTION INTELLIGENCE PLATFORM                     ║
╚════════════════════════════════════════════════════════════════════════════════╝

${report.title.toUpperCase()}
${'═'.repeat(80)}

📋 REPORT METADATA
${'-'.repeat(80)}
Report Type      : ${report.type}
Priority         : ${report.priority}
Generated        : ${report.date}
Status           : ${report.status}
File Size        : ${report.size}
Total Downloads  : ${report.downloads}
Report ID        : ${Math.random().toString(36).substring(2, 11).toUpperCase()}

📝 DESCRIPTION
${'-'.repeat(80)}
${report.description}

📊 EXECUTIVE SUMMARY
${'-'.repeat(80)}
This comprehensive report provides in-depth analysis of aviation disruptions and
their cascading impact on global flight operations. The analysis encompasses
real-time monitoring data, machine learning predictions, and expert assessments.

Our intelligence platform has processed data from multiple sources including:
• Flight tracking systems (48,729 flights monitored)
• Airspace management systems (8 restricted zones)
• Weather and geopolitical intelligence feeds
• Airline operational databases
• Regulatory authority notifications (NOTAM/TFR)

🎯 KEY METRICS
${'-'.repeat(80)}
Total Flights Monitored        : 48,729
Flights Affected               : 3,214
Disruption Rate                : 6.6%
Airlines Impacted              : 127 carriers
Routes Disrupted               : 2,847 international routes
Airspaces Restricted           : 8 active zones
Average Delay Impact           : 3.2 hours
Economic Impact (estimated)    : $42.5M daily

⚠️ CRITICAL FINDINGS
${'-'.repeat(80)}
1. Eastern European corridor shows 34% increase in disruptions
2. Middle East airspace restrictions affecting 2,100+ daily flights
3. Weather-related delays up 18% compared to previous period
4. Geopolitical tensions creating uncertainty in 5 major regions

💡 STRATEGIC RECOMMENDATIONS
${'-'.repeat(80)}
1. Implement dynamic route optimization for affected corridors
2. Increase fuel reserves for flights traversing high-risk areas
3. Establish alternative landing agreements with regional airports
4. Enhance real-time communication with affected carriers
5. Monitor geopolitical developments in critical regions
6. Review and update contingency plans quarterly
7. Consider route diversification strategies

📈 TREND ANALYSIS
${'-'.repeat(80)}
7-Day Trend       : ↑ 12% increase in disruptions
30-Day Forecast   : Moderate risk level anticipated
Regional Hotspots : Ukraine FIR, Middle East, South Asia
Peak Impact Times : 06:00-09:00 UTC, 14:00-17:00 UTC

🔍 DETAILED ANALYSIS
${'-'.repeat(80)}
[This section contains comprehensive analysis based on report type including:
 - Route-specific impact assessments
 - Carrier operational impacts
 - Financial implications
 - Regulatory compliance updates
 - Risk mitigation strategies]

${'-'.repeat(80)}
Generated by ADIP Intelligence Platform | Classified: Internal Use Only
Timestamp: ${new Date().toISOString()}
${'-'.repeat(80)}
        `;

        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ADIP_${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Report exported successfully', {
          description: `${report.title} has been downloaded as TXT`,
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: 'Unable to export report. Please try again.',
      });
    }
  };

  const toggleFavorite = (reportId: number) => {
    setFavorites(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
    toast.success(
      favorites.includes(reportId) ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const filteredReports = reports
    .filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === "All" || report.type === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case "date-asc":
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case "downloads":
          return b.downloads - a.downloads;
        case "priority":
          const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        default:
          return 0;
      }
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-rose-400 bg-rose-400/10 border-rose-400/30";
      case "High": return "text-amber-400 bg-amber-400/10 border-amber-400/30";
      case "Medium": return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/30";
    }
  };

  return (
    <div className="p-8 space-y-8 relative">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #3B82F615, transparent)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #8B5CF615, transparent)" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-6 relative z-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-400/20 flex items-center justify-center backdrop-blur-xl relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent animate-pulse" />
                <FileText className="h-7 w-7 text-blue-400 relative z-10" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold text-white heading-display">
                  Intelligence Reports
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-sm text-slate-400 font-medium">
                    Real-time analytics & intelligence briefings
                  </p>
                </div>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform relative z-10" />
            <span className="relative z-10">Generate New Report</span>
          </motion.button>
        </div>

        {/* Search, Filter, and Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search reports by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#0E1C3A]/60 border border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all backdrop-blur-xl"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-blue-500/10 transition-all"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border backdrop-blur-xl transition-all ${
              showFilters
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/10'
                : 'bg-[#0E1C3A]/60 border-slate-700/50 text-slate-400 hover:border-blue-500/30 hover:text-blue-400'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
            {selectedFilter !== "All" && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shadow-lg"
              >
                1
              </motion.span>
            )}
          </motion.button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-5 py-3.5 rounded-xl bg-[#0E1C3A]/60 border border-slate-700/50 text-white hover:border-blue-500/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all backdrop-blur-xl cursor-pointer appearance-none font-medium"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-[#0E1C3A]">
                {option.label}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2 p-1 rounded-xl bg-[#0E1C3A]/60 border border-slate-700/50 backdrop-blur-xl">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 p-5 rounded-2xl bg-gradient-to-br from-[#0E1C3A]/60 to-[#0E1C3A]/40 border border-slate-700/50 backdrop-blur-xl">
                {filterOptions.map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedFilter === filter
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-[#0E1C3A]/80 text-slate-400 hover:bg-[#0E1C3A] hover:text-white border border-slate-700/50 hover:border-blue-500/40'
                    }`}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: "Total Reports", value: "47", icon: FileText, gradient: "from-blue-500 to-blue-600", glow: "shadow-blue-500/20" },
          { label: "This Month", value: "12", icon: Calendar, gradient: "from-violet-500 to-violet-600", glow: "shadow-violet-500/20" },
          { label: "Critical Alerts", value: "3", icon: AlertTriangle, gradient: "from-rose-500 to-rose-600", glow: "shadow-rose-500/20" },
          { label: "Favorites", value: favorites.length.toString(), icon: Star, gradient: "from-amber-500 to-amber-600", glow: "shadow-amber-500/20" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`glass-panel p-6 relative overflow-hidden group cursor-pointer shadow-xl ${stat.glow} hover:shadow-2xl transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <p className="label-caps text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</p>
                  <motion.div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
                <p className={`text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent heading-display tracking-tight`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-sm relative z-10">
        <p className="text-slate-400">
          Showing <span className="text-white font-bold">{filteredReports.length}</span> of{" "}
          <span className="text-white font-bold">{reports.length}</span> reports
          {selectedFilter !== "All" && (
            <span className="ml-2 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold">
              {selectedFilter}
            </span>
          )}
        </p>
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-slate-400"
          >
            Results for: <span className="text-blue-400 font-semibold">"{searchQuery}"</span>
          </motion.p>
        )}
      </div>

      {/* Report Cards */}
      <div className={viewMode === "grid" ? "grid lg:grid-cols-2 gap-6" : "grid gap-6"}>
        <AnimatePresence mode="popLayout">
          {filteredReports.length > 0 ? (
            filteredReports.map((report, i) => {
              const Icon = report.icon;
              const isFav = favorites.includes(report.id);

              return (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="glass-panel p-6 group relative overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at top right, ${report.color}12, transparent 70%)`,
                    }}
                  />

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  <div className={`relative z-10 flex ${viewMode === "grid" ? "flex-col" : "flex-row"} items-start gap-6`}>
                    {/* Icon */}
                    <motion.div
                      className={`flex ${viewMode === "grid" ? "h-20 w-20" : "h-16 w-16"} shrink-0 items-center justify-center rounded-2xl border-2 shadow-xl relative overflow-hidden`}
                      style={{
                        borderColor: `${report.color}60`,
                        background: `linear-gradient(135deg, ${report.color}20, ${report.color}10)`,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${report.color}30, transparent)`,
                        }}
                      />
                      <Icon className={`${viewMode === "grid" ? "h-9 w-9" : "h-7 w-7"} relative z-10`} style={{ color: report.color }} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                              {report.title}
                            </h3>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border backdrop-blur-sm shadow-lg"
                              style={{
                                color: report.color,
                                borderColor: `${report.color}40`,
                                background: `${report.color}20`,
                              }}
                            >
                              {report.type}
                            </motion.span>
                            <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border ${getPriorityColor(report.priority)}`}>
                              {report.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            {report.description}
                          </p>
                        </div>

                        {/* Favorite button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(report.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            isFav
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-white/5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10'
                          }`}
                        >
                          <Star className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
                        </motion.button>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-5 text-xs mb-4 flex-wrap">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-mono">{report.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span className="font-mono">{report.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <FileText className="h-3.5 w-3.5" />
                          <span className="font-mono">{report.size}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                          <Download className="h-3.5 w-3.5" />
                          <span className="font-mono font-semibold">{report.downloads}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedReport(report)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleExportReport(report, 'txt')}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          TXT
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleExportReport(report, 'json')}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          JSON
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href + `?report=${report.id}`);
                            toast.success('Link copied to clipboard');
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-500/30 bg-slate-500/10 text-slate-400 text-xs font-semibold hover:bg-slate-500/20 hover:border-slate-500/50 hover:text-white transition-all"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          Share
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Corner gradient accent */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                    style={{
                      background: `radial-gradient(circle, ${report.color}, transparent)`,
                    }}
                  />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-16 text-center col-span-full"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  className="h-24 w-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border-2 border-blue-400/20 flex items-center justify-center backdrop-blur-xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="h-12 w-12 text-blue-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">No reports found</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  We couldn't find any reports matching your criteria. Try adjusting your search or filters.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("All");
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all"
                >
                  Clear all filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReport(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-auto glass-panel-strong p-8 relative"
            >
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div
                    className="h-20 w-20 rounded-2xl flex items-center justify-center border-2 shadow-xl"
                    style={{
                      borderColor: `${selectedReport.color}60`,
                      background: `linear-gradient(135deg, ${selectedReport.color}30, ${selectedReport.color}10)`,
                    }}
                  >
                    {selectedReport.icon && <selectedReport.icon className="h-10 w-10" style={{ color: selectedReport.color }} />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedReport.title}</h2>
                    <p className="text-slate-400 mb-4">{selectedReport.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span
                        className="text-xs font-mono font-bold uppercase px-3 py-1.5 rounded-lg border"
                        style={{
                          color: selectedReport.color,
                          borderColor: `${selectedReport.color}40`,
                          background: `${selectedReport.color}20`,
                        }}
                      >
                        {selectedReport.type}
                      </span>
                      <span className={`text-xs font-mono font-bold uppercase px-3 py-1.5 rounded-lg border ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Generated", value: selectedReport.date, icon: Calendar },
                    { label: "Status", value: selectedReport.status, icon: CheckCircle2 },
                    { label: "File Size", value: selectedReport.size, icon: FileText },
                    { label: "Downloads", value: selectedReport.downloads, icon: Download },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-[#0E1C3A]/40 border border-slate-700/50">
                      <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                        <item.icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </div>
                      <p className="text-white font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-xl bg-[#0E1C3A]/40 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Report Preview
                  </h3>
                  <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                    <p><strong className="text-white">Executive Summary:</strong> This comprehensive intelligence report provides detailed analysis of aviation disruptions and their operational impact across global flight networks.</p>
                    <p><strong className="text-white">Key Findings:</strong> Analysis indicates a 12% increase in disruption events compared to the previous period, with primary impacts concentrated in Eastern European and Middle Eastern corridors.</p>
                    <p><strong className="text-white">Data Coverage:</strong> The report encompasses 48,729 monitored flights, 127 affected carriers, and 2,847 disrupted routes across 8 restricted airspace zones.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleExportReport(selectedReport, 'txt');
                      setSelectedReport(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all"
                  >
                    <Download className="h-5 w-5" />
                    Download TXT
                  </button>
                  <button
                    onClick={() => {
                      handleExportReport(selectedReport, 'json');
                      setSelectedReport(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-semibold hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                  >
                    <Download className="h-5 w-5" />
                    Download JSON
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
