import { useState, useMemo } from "react";
import DateRangePicker from "./DateRangePicker";

// ─── Mock Data ───────────────────────────────────────────────────
const MOCK_FEEDBACK = [
  { id: "FB-001", chatId: "CNV-88234", date: "2026-03-26", headline: "Login issues after password reset on mobile app", fullText: "Customer reported that after resetting their password through the mobile app, they were unable to log back in for over 30 minutes. The session token wasn't refreshing properly. They suggested adding a 'force logout all devices' option during password reset.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Under Review" },
  { id: "FB-002", chatId: "CNV-88190", date: "2026-03-26", headline: "Requested dark mode for the trading dashboard", fullText: "Customer mentioned eye strain during late-night trading sessions and suggested implementing a dark mode toggle for the main trading dashboard. They referenced competitor platforms that already offer this.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New" },
  { id: "FB-003", chatId: "CNV-88102", date: "2026-03-25", headline: "Payout processing time is too slow compared to competitors", fullText: "Customer expressed frustration that payouts take 3-5 business days while competitors offer 24-hour processing. Suggested partnering with faster payment processors or offering crypto payout options for instant withdrawal.", category: "Payout Related Issue", sentiment: "Negative", priority: "High", status: "Escalated" },
  { id: "FB-004", chatId: "CNV-87998", date: "2026-03-25", headline: "Appreciated the quick resolution of account verification", fullText: "Customer praised the support team for resolving their KYC verification issue within 10 minutes. They suggested this level of service should be highlighted in marketing materials.", category: "KYC_Issue", sentiment: "Positive", priority: "Low", status: "Acknowledged" },
  { id: "FB-005", chatId: "CNV-87845", date: "2026-03-24", headline: "Coupon code not applying at checkout for scaling plan", fullText: "Multiple customers have reported that promotional coupon codes for the scaling plan are not being applied correctly at checkout. The discount shows briefly then disappears when the payment page loads.", category: "Offers & Coupons", sentiment: "Negative", priority: "High", status: "In Progress" },
  { id: "FB-006", chatId: "CNV-87790", date: "2026-03-24", headline: "Suggestion to add MT5 platform support", fullText: "Customer strongly suggested adding MetaTrader 5 support alongside MT4. They mentioned that many professional traders prefer MT5 for its advanced charting and multi-asset capabilities.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "Under Review" },
  { id: "FB-007", chatId: "CNV-87701", date: "2026-03-23", headline: "Scaling rules documentation is confusing and outdated", fullText: "Customer found the scaling rules documentation contradictory and hard to follow. Specific sections about profit targets and drawdown limits had conflicting information. Suggested a visual flowchart instead of text-heavy docs.", category: "Rules & Scaling", sentiment: "Negative", priority: "Medium", status: "In Progress" },
  { id: "FB-008", chatId: "CNV-87650", date: "2026-03-23", headline: "Refund policy needs clearer communication upfront", fullText: "Customer was surprised by the refund policy terms after purchase. They suggested displaying refund conditions more prominently on the pricing page and during checkout, not just in fine print.", category: "Payment & Refunds", sentiment: "Negative", priority: "Medium", status: "New" },
  { id: "FB-009", chatId: "CNV-87588", date: "2026-03-22", headline: "Live chat wait times have improved significantly", fullText: "Returning customer noted that live chat response times have dropped from 15+ minutes to under 3 minutes over the past month. They appreciated the improvement and suggested maintaining this standard.", category: "Support", sentiment: "Positive", priority: "Low", status: "Acknowledged" },
  { id: "FB-010", chatId: "CNV-87490", date: "2026-03-22", headline: "Account dashboard shows incorrect balance after trade close", fullText: "Customer reported a UI bug where their account balance didn't update immediately after closing a profitable trade. The correct balance only appeared after a manual page refresh. This caused anxiety about whether the trade was properly recorded.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Escalated" },
  { id: "FB-011", chatId: "CNV-87402", date: "2026-03-21", headline: "Need better notification system for margin calls", fullText: "Customer nearly missed a margin call because the only notification was an in-app popup they didn't see. Suggested adding email, SMS, and push notification options for critical account alerts.", category: "Platform & Trading", sentiment: "Negative", priority: "High", status: "Under Review" },
  { id: "FB-012", chatId: "CNV-87355", date: "2026-03-21", headline: "KYC re-verification process is unnecessarily repetitive", fullText: "Long-time customer was asked to re-verify KYC documents they had already submitted. The process required uploading the same documents again. Suggested implementing a document retention policy for verified users.", category: "KYC_Issue", sentiment: "Negative", priority: "Medium", status: "New" },
  { id: "FB-013", chatId: "CNV-87290", date: "2026-03-20", headline: "Suggest adding a demo/paper trading mode for new users", fullText: "New customer suggested offering a paper trading or demo mode so users can familiarize themselves with the platform before committing real capital. This would reduce early churn and support tickets from confused newcomers.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New" },
  { id: "FB-014", chatId: "CNV-87200", date: "2026-03-20", headline: "Weekend support availability is needed for global traders", fullText: "Customer in a different timezone emphasized the need for weekend support since markets they trade are open on weekends. Suggested at least limited weekend chat hours or an AI chatbot for common issues.", category: "Support", sentiment: "Neutral", priority: "Medium", status: "Under Review" },
  { id: "FB-015", chatId: "CNV-87120", date: "2026-03-19", headline: "Promotional email promised discount not honored at checkout", fullText: "Customer received a promotional email with a 20% discount code but the code was rejected at checkout. Support confirmed the promotion had ended the day before the email was sent. Customer suggested better coordination between marketing and system teams.", category: "Offers & Coupons", sentiment: "Negative", priority: "High", status: "Escalated" },
];

const CATEGORIES_META = {
  "Account Related Issue": { color: "#60a5fa", icon: "👤" },
  "Platform & Trading": { color: "#f472b6", icon: "📊" },
  "Offers & Coupons": { color: "#fb923c", icon: "🎟️" },
  "Rules & Scaling": { color: "#34d399", icon: "📏" },
  "Payment & Refunds": { color: "#a78bfa", icon: "💳" },
  "Support": { color: "#38bdf8", icon: "🎧" },
  "Payout Related Issue": { color: "#4ade80", icon: "💸" },
  "KYC_Issue": { color: "#c084fc", icon: "🪪" },
};

const STATUS_COLORS = {
  "New": { bg: "rgba(96,165,250,0.15)", text: "#60a5fa" },
  "Under Review": { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
  "In Progress": { bg: "rgba(52,211,153,0.15)", text: "#34d399" },
  "Escalated": { bg: "rgba(248,113,113,0.15)", text: "#f87171" },
  "Acknowledged": { bg: "rgba(148,163,184,0.15)", text: "#94a3b8" },
};

const PRIORITY_COLORS = {
  "High": { bg: "rgba(239,68,68,0.15)", text: "#ef4444", dot: "#ef4444" },
  "Medium": { bg: "rgba(234,179,8,0.15)", text: "#eab308", dot: "#eab308" },
  "Low": { bg: "rgba(34,197,94,0.15)", text: "#22c55e", dot: "#22c55e" },
};

const SENTIMENT_MAP = {
  "Positive": { color: "#22c55e", icon: "▲" },
  "Neutral": { color: "#94a3b8", icon: "●" },
  "Negative": { color: "#ef4444", icon: "▼" },
};

// ─── Styles ──────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f14",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: 0,
    margin: 0,
  },
  header: {
    background: "linear-gradient(135deg, rgba(16,24,36,0.95), rgba(15,20,30,0.98))",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  headerIcon: {
    fontSize: 22,
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "0.02em",
    color: "#e2e8f0",
  },
  content: {
    padding: "24px 28px",
    maxWidth: 1440,
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#f1f5f9",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: "4px 0 0",
    fontWeight: 400,
  },
  filterBar: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 24,
    alignItems: "center",
  },
  filterSelect: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    color: "#cbd5e1",
    padding: "8px 14px",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
    minWidth: 140,
  },
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    background: "linear-gradient(145deg, rgba(17,24,39,0.9), rgba(15,20,30,0.95))",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "20px 22px",
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f1f5f9",
    lineHeight: 1.1,
  },
  metricSub: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 20,
    marginBottom: 24,
  },
  card: {
    background: "linear-gradient(145deg, rgba(17,24,39,0.9), rgba(15,20,30,0.95))",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    overflow: "hidden",
  },
  cardHeader: {
    padding: "18px 22px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardTitleIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  th: {
    textAlign: "left",
    padding: "10px 16px",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#475569",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 16px",
    fontSize: 13,
    color: "#cbd5e1",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    verticalAlign: "middle",
  },
  trHover: {
    cursor: "pointer",
    transition: "background 0.15s",
  },
  badge: (bg, text) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    color: text,
    whiteSpace: "nowrap",
  }),
  chatLink: {
    color: "#38bdf8",
    textDecoration: "none",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 12,
    cursor: "pointer",
    transition: "color 0.15s",
  },
  headline: {
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
    transition: "color 0.15s",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
  },
  modalContent: {
    position: "relative",
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: "28px 32px",
    maxWidth: 600,
    width: "90%",
    maxHeight: "80vh",
    overflow: "auto",
    zIndex: 1,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "rgba(255,255,255,0.06)",
    border: "none",
    color: "#94a3b8",
    width: 32,
    height: 32,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rankBar: (pct, color) => ({
    height: 8,
    borderRadius: 4,
    background: `linear-gradient(90deg, ${color}, ${color}88)`,
    width: `${pct}%`,
    transition: "width 0.5s ease",
  }),
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    color: "#e2e8f0",
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    color: "#e2e8f0",
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    resize: "vertical",
    minHeight: 90,
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    letterSpacing: "0.02em",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    color: "#475569",
    fontSize: 14,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  pageBtn: (active) => ({
    background: active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
    border: active ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.06)",
    color: active ? "#22c55e" : "#64748b",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 500,
  }),
  dotPulse: (color) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
    display: "inline-block",
    marginRight: 6,
  }),
  fullWidth: {
    gridColumn: "1 / -1",
  },
};

// ─── Component ───────────────────────────────────────────────────
export default function FeedbackAndSuggestion() {
  const [feedbackData] = useState(MOCK_FEEDBACK);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewingChat, setViewingChat] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSentiment, setFilterSentiment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [manualFeedback, setManualFeedback] = useState({ headline: "", category: "Account Related Issue", description: "", priority: "Medium", source: "Internal Observation" });
  const [manualEntries, setManualEntries] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const ITEMS_PER_PAGE = 8;

  const allData = useMemo(() => [...feedbackData, ...manualEntries], [feedbackData, manualEntries]);

  const filtered = useMemo(() => {
    let d = allData;
    if (filterCategory !== "All") d = d.filter(f => f.category === filterCategory);
    if (filterPriority !== "All") d = d.filter(f => f.priority === filterPriority);
    if (filterStatus !== "All") d = d.filter(f => f.status === filterStatus);
    if (filterSentiment !== "All") d = d.filter(f => f.sentiment === filterSentiment);
    if (searchQuery.trim()) d = d.filter(f => f.headline.toLowerCase().includes(searchQuery.toLowerCase()));
    if (dateFrom) d = d.filter(f => f.date >= dateFrom);
    if (dateTo) d = d.filter(f => f.date <= dateTo);
    d.sort((a, b) => {
      if (sortBy === "date") return sortDir === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
      if (sortBy === "priority") {
        const order = { High: 3, Medium: 2, Low: 1 };
        return sortDir === "desc" ? (order[b.priority] - order[a.priority]) : (order[a.priority] - order[b.priority]);
      }
      return 0;
    });
    return d;
  }, [allData, filterCategory, filterPriority, filterStatus, filterSentiment, searchQuery, dateFrom, dateTo, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Category ranking
  const categoryRanking = useMemo(() => {
    const counts = {};
    allData.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => ({ category: cat, count, meta: CATEGORIES_META[cat] || { color: "#64748b", icon: "📋" } }));
  }, [allData]);

  const maxCatCount = categoryRanking[0]?.count || 1;

  // Summary metrics
  const metrics = useMemo(() => {
    const total = allData.length;
    const highPriority = allData.filter(f => f.priority === "High").length;
    const negative = allData.filter(f => f.sentiment === "Negative").length;
    const actionable = allData.filter(f => ["New", "Under Review"].includes(f.status)).length;
    const resolved = allData.filter(f => ["Acknowledged", "In Progress"].includes(f.status)).length;
    return { total, highPriority, negative, actionable, resolved };
  }, [allData]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(field); setSortDir("desc"); }
  };

  const handleSubmitManual = () => {
    if (!manualFeedback.headline.trim() || !manualFeedback.description.trim()) return;
    const entry = {
      id: `MF-${String(manualEntries.length + 1).padStart(3, "0")}`,
      chatId: "MANUAL",
      date: new Date().toISOString().slice(0, 10),
      headline: manualFeedback.headline,
      fullText: manualFeedback.description,
      category: manualFeedback.category,
      sentiment: "Neutral",
      priority: manualFeedback.priority,
      status: "New",
      source: manualFeedback.source,
    };
    setManualEntries(prev => [entry, ...prev]);
    setManualFeedback({ headline: "", category: "Account Related Issue", description: "", priority: "Medium", source: "Internal Observation" });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const SortArrow = ({ field }) => (
    <span style={{ marginLeft: 4, opacity: sortBy === field ? 1 : 0.3, fontSize: 10 }}>
      {sortBy === field && sortDir === "asc" ? "▲" : "▼"}
    </span>
  );

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>💡</span>
        <span style={styles.headerTitle}>Feedback and Suggestion</span>
      </div>

      <div style={styles.content}>
        {/* Page Title */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={styles.pageTitle}>Feedback and Suggestions</h1>
          <p style={styles.pageSubtitle}>AI-identified customer insights and manually submitted feedback for product improvement.</p>
        </div>

        {/* Filter Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 280 }}>
            <input
              type="text"
              placeholder="🔍  Search feedback..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ ...styles.input, paddingLeft: 14, height: 38 }}
            />
          </div>
          <select style={styles.filterSelect} value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Categories</option>
            {Object.keys(CATEGORIES_META).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select style={styles.filterSelect} value={filterPriority} onChange={e => { setFilterPriority(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select style={styles.filterSelect} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Acknowledged">Acknowledged</option>
          </select>
          <select style={styles.filterSelect} value={filterSentiment} onChange={e => { setFilterSentiment(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>

          {/* Spacer to push date filter right */}
          <div style={{ flex: "1 1 0", minWidth: 0 }} />

          {/* Date Filter */}
          <DateRangePicker
            dateFrom={dateFrom}
            dateTo={dateTo}
            onApply={(from, to) => { setDateFrom(from); setDateTo(to); setCurrentPage(1); }}
          />
        </div>

        {/* Metrics Row */}
        <div style={styles.metricsRow}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Total Feedback</div>
            <div style={styles.metricValue}>{metrics.total}</div>
            <div style={styles.metricSub}>AI-detected + manual entries</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>High Priority</div>
            <div style={{ ...styles.metricValue, color: "#ef4444" }}>{metrics.highPriority}</div>
            <div style={styles.metricSub}>{((metrics.highPriority / metrics.total) * 100).toFixed(0)}% of total feedback</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Negative Sentiment</div>
            <div style={{ ...styles.metricValue, color: "#f87171" }}>{metrics.negative}</div>
            <div style={styles.metricSub}>{((metrics.negative / metrics.total) * 100).toFixed(0)}% negative signals</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Awaiting Action</div>
            <div style={{ ...styles.metricValue, color: "#fbbf24" }}>{metrics.actionable}</div>
            <div style={styles.metricSub}>New + Under Review</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Being Addressed</div>
            <div style={{ ...styles.metricValue, color: "#22c55e" }}>{metrics.resolved}</div>
            <div style={styles.metricSub}>In Progress + Acknowledged</div>
          </div>
        </div>

        {/* Main Grid: Feedback Table + Category Ranking */}
        <div style={styles.sectionGrid}>
          {/* Feedback Table */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>📋</span>
                AI-Identified Feedback & Suggestions
                <span style={{ fontSize: 12, color: "#475569", fontWeight: 400, marginLeft: 8 }}>{filtered.length} results</span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("date")}>Date <SortArrow field="date" /></th>
                    <th style={styles.th}>Feedback Headline</th>
                    <th style={styles.th}>Chat ID</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Sentiment</th>
                    <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("priority")}>Priority <SortArrow field="priority" /></th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} style={styles.emptyState}>No feedback found matching your filters.</td></tr>
                  ) : paginated.map((fb, i) => (
                    <tr
                      key={fb.id}
                      style={{ ...styles.trHover, background: hoveredRow === i ? "rgba(255,255,255,0.02)" : "transparent" }}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={{ ...styles.td, whiteSpace: "nowrap", fontSize: 12, color: "#64748b" }}>{fb.date}</td>
                      <td style={styles.td}>
                        <span style={styles.headline} onClick={() => setSelectedFeedback(fb)} onMouseOver={e => e.target.style.color = "#22c55e"} onMouseOut={e => e.target.style.color = "#e2e8f0"}>
                          {fb.headline}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {fb.chatId === "MANUAL" ? (
                          <span style={{ ...styles.badge("rgba(148,163,184,0.12)", "#64748b") }}>Manual</span>
                        ) : (
                          <span style={styles.chatLink} onClick={() => setViewingChat(fb)} onMouseOver={e => e.target.style.color = "#7dd3fc"} onMouseOut={e => e.target.style.color = "#38bdf8"}>
                            {fb.chatId}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: 12, color: CATEGORIES_META[fb.category]?.color || "#64748b" }}>
                          {CATEGORIES_META[fb.category]?.icon} {fb.category}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: SENTIMENT_MAP[fb.sentiment]?.color, fontSize: 12 }}>
                          {SENTIMENT_MAP[fb.sentiment]?.icon} {fb.sentiment}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge(PRIORITY_COLORS[fb.priority].bg, PRIORITY_COLORS[fb.priority].text)}>
                          <span style={styles.dotPulse(PRIORITY_COLORS[fb.priority].dot)}></span>
                          {fb.priority}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge(STATUS_COLORS[fb.status].bg, STATUS_COLORS[fb.status].text)}>
                          {fb.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <span style={{ fontSize: 12, color: "#475569" }}>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={styles.pageBtn(false)} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} style={styles.pageBtn(currentPage === i + 1)} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  ))}
                  <button style={styles.pageBtn(false)} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
                </div>
              </div>
            )}
          </div>

          {/* Category Ranking */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🏆</span>
                Top Feedback Areas
              </div>
            </div>
            <div style={{ padding: "8px 0" }}>
              {categoryRanking.map((item, i) => (
                <div
                  key={item.category}
                  style={{
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom: i < categoryRanking.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onClick={() => { setFilterCategory(item.category); setCurrentPage(1); }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: i === 0 ? "rgba(234,179,8,0.15)" : i === 1 ? "rgba(148,163,184,0.12)" : i === 2 ? "rgba(180,120,60,0.12)" : "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                    color: i === 0 ? "#eab308" : i === 1 ? "#94a3b8" : i === 2 ? "#b4783c" : "#475569",
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{item.meta.icon}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.category}</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                      <div style={styles.rankBar((item.count / maxCatCount) * 100, item.meta.color)} />
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: item.meta.color, minWidth: 36, textAlign: "right" }}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 11, color: "#475569", textAlign: "center" }}>Click a category to filter the feedback table</div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Manual Submission + Action Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* Manual Feedback Submission */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>✍️</span>
                Submit Manual Feedback
              </div>
            </div>
            <div style={{ padding: "20px 22px" }}>
              {showSuccess && (
                <div style={{
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 16,
                  fontSize: 13,
                  color: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  ✅ Feedback submitted successfully!
                </div>
              )}
              <div style={styles.formGroup}>
                <label style={styles.label}>Feedback Headline *</label>
                <input
                  style={styles.input}
                  placeholder="Brief summary of the feedback..."
                  value={manualFeedback.headline}
                  onChange={e => setManualFeedback(p => ({ ...p, headline: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select style={{ ...styles.filterSelect, width: "100%", height: 40 }} value={manualFeedback.category} onChange={e => setManualFeedback(p => ({ ...p, category: e.target.value }))}>
                    {Object.keys(CATEGORIES_META).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select style={{ ...styles.filterSelect, width: "100%", height: 40 }} value={manualFeedback.priority} onChange={e => setManualFeedback(p => ({ ...p, priority: e.target.value }))}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Source</label>
                <select style={{ ...styles.filterSelect, width: "100%", height: 40 }} value={manualFeedback.source} onChange={e => setManualFeedback(p => ({ ...p, source: e.target.value }))}>
                  <option value="Internal Observation">Internal Observation</option>
                  <option value="Customer Call">Customer Call</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Email">Email</option>
                  <option value="App Review">App Review</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Detailed Description *</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Describe the feedback or suggestion in detail..."
                  value={manualFeedback.description}
                  onChange={e => setManualFeedback(p => ({ ...p, description: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <button
                style={{
                  ...styles.submitBtn,
                  opacity: manualFeedback.headline.trim() && manualFeedback.description.trim() ? 1 : 0.4,
                  cursor: manualFeedback.headline.trim() && manualFeedback.description.trim() ? "pointer" : "not-allowed",
                }}
                onClick={handleSubmitManual}
                disabled={!manualFeedback.headline.trim() || !manualFeedback.description.trim()}
              >
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Action Status Overview */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>📊</span>
                Feedback Pipeline Overview
              </div>
            </div>
            <div style={{ padding: "20px 22px" }}>
              {/* Status Funnel */}
              {Object.entries(STATUS_COLORS).map(([status, colors]) => {
                const count = allData.filter(f => f.status === status).length;
                const pct = allData.length > 0 ? (count / allData.length) * 100 : 0;
                return (
                  <div key={status} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{status}</span>
                      <span style={{ fontSize: 13, color: "#64748b" }}>{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, height: 10, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${colors.text}, ${colors.text}88)`,
                        width: `${pct}%`,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })}

              {/* Sentiment Breakdown */}
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 14 }}>Sentiment Breakdown</div>
                <div style={{ display: "flex", gap: 12 }}>
                  {["Positive", "Neutral", "Negative"].map(s => {
                    const count = allData.filter(f => f.sentiment === s).length;
                    return (
                      <div key={s} style={{
                        flex: 1,
                        background: `${SENTIMENT_MAP[s].color}11`,
                        border: `1px solid ${SENTIMENT_MAP[s].color}22`,
                        borderRadius: 10,
                        padding: "14px 12px",
                        textAlign: "center",
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: SENTIMENT_MAP[s].color }}>{count}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Priority Breakdown */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 14 }}>Priority Distribution</div>
                <div style={{ display: "flex", gap: 12 }}>
                  {["High", "Medium", "Low"].map(p => {
                    const count = allData.filter(f => f.priority === p).length;
                    return (
                      <div key={p} style={{
                        flex: 1,
                        background: PRIORITY_COLORS[p].bg,
                        border: `1px solid ${PRIORITY_COLORS[p].text}22`,
                        borderRadius: 10,
                        padding: "14px 12px",
                        textAlign: "center",
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: PRIORITY_COLORS[p].text }}>{count}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{p}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Feedback Detail */}
      {selectedFeedback && (
        <div style={styles.modal}>
          <div style={styles.modalOverlay} onClick={() => setSelectedFeedback(null)} />
          <div style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={() => setSelectedFeedback(null)}>✕</button>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={styles.badge(PRIORITY_COLORS[selectedFeedback.priority].bg, PRIORITY_COLORS[selectedFeedback.priority].text)}>
                  {selectedFeedback.priority} Priority
                </span>
                <span style={styles.badge(STATUS_COLORS[selectedFeedback.status].bg, STATUS_COLORS[selectedFeedback.status].text)}>
                  {selectedFeedback.status}
                </span>
                <span style={{ fontSize: 12, color: SENTIMENT_MAP[selectedFeedback.sentiment]?.color }}>
                  {SENTIMENT_MAP[selectedFeedback.sentiment]?.icon} {selectedFeedback.sentiment}
                </span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1.4 }}>{selectedFeedback.headline}</h2>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#64748b" }}>
                <span>📅 {selectedFeedback.date}</span>
                <span style={{ color: CATEGORIES_META[selectedFeedback.category]?.color }}>
                  {CATEGORIES_META[selectedFeedback.category]?.icon} {selectedFeedback.category}
                </span>
                {selectedFeedback.chatId !== "MANUAL" && (
                  <span style={{ ...styles.chatLink }} onClick={() => { setSelectedFeedback(null); setViewingChat(selectedFeedback); }}>
                    🔗 {selectedFeedback.chatId}
                  </span>
                )}
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              padding: "16px 18px",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#cbd5e1",
            }}>
              {selectedFeedback.fullText}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Chat Viewer */}
      {viewingChat && (
        <div style={styles.modal}>
          <div style={styles.modalOverlay} onClick={() => setViewingChat(null)} />
          <div style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={() => setViewingChat(null)}>✕</button>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9", margin: "0 0 4px" }}>Chat Transcript</h2>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {viewingChat.chatId} · {viewingChat.date}
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              padding: "20px",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#94a3b8",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>💬</div>
              <div style={{ fontWeight: 500, color: "#cbd5e1", marginBottom: 4 }}>Chat Transcript Viewer</div>
              <div>In production, clicking <span style={{ color: "#38bdf8", fontFamily: "monospace" }}>{viewingChat.chatId}</span> will load the full conversation from Intercom here.</div>
              <div style={{ marginTop: 16 }}>
                <button
                  style={{
                    background: "rgba(56,189,248,0.12)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    color: "#38bdf8",
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => window.open(`https://app.intercom.com/a/apps/YOUR_APP_ID/conversations/${viewingChat.chatId}`, '_blank')}
                >
                  Open in Intercom ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
