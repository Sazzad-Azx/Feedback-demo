import React, { useState, useMemo } from "react";
import DateRangePicker from "./DateRangePicker";

// ─── Mock Data ───────────────────────────────────────────────────
const MOCK_FEEDBACK = [
  { id: "FB-001", chatId: "CNV-88234", date: "2026-03-26", headline: "Login issues after password reset on mobile app", fullText: "Customer reported that after resetting their password through the mobile app, they were unable to log back in for over 30 minutes. The session token wasn't refreshing properly. They suggested adding a 'force logout all devices' option during password reset.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Under Review", type: "feedback", common_topic: "Login fails after password reset" },
  { id: "FB-002", chatId: "CNV-88190", date: "2026-03-26", headline: "Requested dark mode for the trading dashboard", fullText: "Customer mentioned eye strain during late-night trading sessions and suggested implementing a dark mode toggle for the main trading dashboard. They referenced competitor platforms that already offer this.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", common_topic: "Add dark mode to dashboard" },
  { id: "FB-003", chatId: "CNV-88102", date: "2026-03-25", headline: "Payout processing time is too slow compared to competitors", fullText: "Customer expressed frustration that payouts take 3-5 business days while competitors offer 24-hour processing. Suggested partnering with faster payment processors or offering crypto payout options for instant withdrawal.", category: "Payout Related Issue", sentiment: "Negative", priority: "High", status: "Escalated", type: "feedback", common_topic: "Slow payout processing" },
  { id: "FB-004", chatId: "CNV-87998", date: "2026-03-25", headline: "Appreciated the quick resolution of account verification", fullText: "Customer praised the support team for resolving their KYC verification issue within 10 minutes. They suggested this level of service should be highlighted in marketing materials.", category: "KYC_Issue", sentiment: "Positive", priority: "Low", status: "Acknowledged", type: "feedback", common_topic: "Praise for quick KYC resolution" },
  { id: "FB-005", chatId: "CNV-87845", date: "2026-03-24", headline: "Coupon code not applying at checkout for scaling plan", fullText: "Multiple customers have reported that promotional coupon codes for the scaling plan are not being applied correctly at checkout. The discount shows briefly then disappears when the payment page loads.", category: "Offers & Coupons", sentiment: "Negative", priority: "High", status: "In Progress", type: "feedback", common_topic: null },
  { id: "FB-006", chatId: "CNV-87790", date: "2026-03-24", headline: "Suggestion to add MT5 platform support", fullText: "Customer strongly suggested adding MetaTrader 5 support alongside MT4. They mentioned that many professional traders prefer MT5 for its advanced charting and multi-asset capabilities.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "Under Review", type: "suggestion", common_topic: "Add MetaTrader 5 support" },
  { id: "FB-007", chatId: "CNV-87701", date: "2026-03-23", headline: "Scaling rules documentation is confusing and outdated", fullText: "Customer found the scaling rules documentation contradictory and hard to follow. Specific sections about profit targets and drawdown limits had conflicting information. Suggested a visual flowchart instead of text-heavy docs.", category: "Rules & Scaling", sentiment: "Negative", priority: "Medium", status: "In Progress", type: "feedback", common_topic: "Scaling rules unclear or contradictory" },
  { id: "FB-008", chatId: "CNV-87650", date: "2026-03-23", headline: "Refund policy needs clearer communication upfront", fullText: "Customer was surprised by the refund policy terms after purchase. They suggested displaying refund conditions more prominently on the pricing page and during checkout, not just in fine print.", category: "Payment & Refunds", sentiment: "Negative", priority: "Medium", status: "New", type: "suggestion", common_topic: "Refund policy not visible before purchase" },
  { id: "FB-009", chatId: "CNV-87588", date: "2026-03-22", headline: "Live chat wait times have improved significantly", fullText: "Returning customer noted that live chat response times have dropped from 15+ minutes to under 3 minutes over the past month. They appreciated the improvement and suggested maintaining this standard.", category: "Support", sentiment: "Positive", priority: "Low", status: "Acknowledged", type: "feedback", common_topic: "Improved live chat response times" },
  { id: "FB-010", chatId: "CNV-87490", date: "2026-03-22", headline: "Account dashboard shows incorrect balance after trade close", fullText: "Customer reported a UI bug where their account balance didn't update immediately after closing a profitable trade. The correct balance only appeared after a manual page refresh. This caused anxiety about whether the trade was properly recorded.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Escalated", type: "feedback", common_topic: null },
  { id: "FB-011", chatId: "CNV-87402", date: "2026-03-21", headline: "Need better notification system for margin calls", fullText: "Customer nearly missed a margin call because the only notification was an in-app popup they didn't see. Suggested adding email, SMS, and push notification options for critical account alerts.", category: "Platform & Trading", sentiment: "Negative", priority: "High", status: "Under Review", type: "suggestion", common_topic: "Better margin call notifications needed" },
  { id: "FB-012", chatId: "CNV-87355", date: "2026-03-21", headline: "KYC re-verification process is unnecessarily repetitive", fullText: "Long-time customer was asked to re-verify KYC documents they had already submitted. The process required uploading the same documents again. Suggested implementing a document retention policy for verified users.", category: "KYC_Issue", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", common_topic: "Repetitive KYC re-verification" },
  { id: "FB-013", chatId: "CNV-87290", date: "2026-03-20", headline: "Suggest adding a demo/paper trading mode for new users", fullText: "New customer suggested offering a paper trading or demo mode so users can familiarize themselves with the platform before committing real capital. This would reduce early churn and support tickets from confused newcomers.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", common_topic: "Add demo or paper trading mode" },
  { id: "FB-014", chatId: "CNV-87200", date: "2026-03-20", headline: "Weekend support availability is needed for global traders", fullText: "Customer in a different timezone emphasized the need for weekend support since markets they trade are open on weekends. Suggested at least limited weekend chat hours or an AI chatbot for common issues.", category: "Support", sentiment: "Neutral", priority: "Medium", status: "Under Review", type: "suggestion", common_topic: "Weekend support for global traders" },
  { id: "FB-015", chatId: "CNV-87120", date: "2026-03-19", headline: "Promotional email promised discount not honored at checkout", fullText: "Customer received a promotional email with a 20% discount code but the code was rejected at checkout. Support confirmed the promotion had ended the day before the email was sent. Customer suggested better coordination between marketing and system teams.", category: "Offers & Coupons", sentiment: "Negative", priority: "High", status: "Escalated", type: "feedback", common_topic: "Coupon codes not working at checkout" },
  { id: "FB-016", chatId: "CNV-87050", date: "2026-03-19", headline: "Can't log in after changing my password on phone", fullText: "After updating my password using the mobile browser, I kept getting 'invalid credentials' for almost an hour. Had to clear cookies and try again. Very frustrating experience.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "New", type: "feedback", common_topic: null },
  { id: "FB-017", chatId: "CNV-86990", date: "2026-03-18", headline: "Password reset didn't work — stuck on login screen", fullText: "Reset my password via email link but the new password wasn't accepted on the login page. Tried multiple browsers. Eventually worked after 45 minutes. Please fix this.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Under Review", type: "feedback", common_topic: null },
  { id: "FB-018", chatId: "CNV-86920", date: "2026-03-18", headline: "Payout took 5 days, competitors do it in 24 hours", fullText: "I've been waiting 5 business days for my payout. Other prop firms process withdrawals within a day. This is unacceptable for a platform of this size. Need faster payment rails.", category: "Payout Related Issue", sentiment: "Negative", priority: "High", status: "New", type: "feedback", common_topic: "Slow payout processing" },
  { id: "FB-019", chatId: "CNV-86880", date: "2026-03-18", headline: "Withdrawal processing is way too slow", fullText: "My withdrawal request has been pending for 4 days now. This is really slow compared to what other platforms offer. Please consider adding instant payout options.", category: "Payout Related Issue", sentiment: "Negative", priority: "High", status: "Under Review", type: "feedback", common_topic: "Slow payout processing" },
  { id: "FB-020", chatId: "CNV-86800", date: "2026-03-17", headline: "Discount code from newsletter didn't work at checkout", fullText: "Got a 15% off coupon in the weekly newsletter but it shows 'invalid code' when I try to apply it at checkout. This has happened twice now with different codes.", category: "Offers & Coupons", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", common_topic: null },
  { id: "FB-021", chatId: "CNV-86750", date: "2026-03-17", headline: "Balance not updating after closing trades", fullText: "Closed three profitable trades but my balance still shows the old amount. Had to refresh the page manually each time. The dashboard should update in real-time.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "In Progress", type: "feedback", common_topic: null },
  { id: "FB-022", chatId: "CNV-86700", date: "2026-03-17", headline: "Please add MetaTrader 5 — MT4 feels outdated", fullText: "MT4 is great but MT5 has so many more features. Advanced charting, more timeframes, better backtesting. Most serious traders have moved to MT5. Please add support.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", common_topic: "Add MetaTrader 5 support" },
  { id: "FB-023", chatId: "CNV-86650", date: "2026-03-16", headline: "Suggestion: Add a practice/demo account for beginners", fullText: "As a new trader, I'd love a demo mode to learn the platform without risking real money. It would help reduce confusion and support tickets from new users.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "Under Review", type: "suggestion", common_topic: "Add demo or paper trading mode" },
  { id: "FB-024", chatId: "CNV-86600", date: "2026-03-16", headline: "Dark mode option would be great for night trading", fullText: "Trading late at night with the bright interface causes eye strain. A dark theme toggle on the dashboard would be really helpful. Many competitors already have this.", category: "Platform & Trading", sentiment: "Neutral", priority: "Low", status: "New", type: "suggestion", common_topic: "Add dark mode to dashboard" },
  { id: "FB-025", chatId: "CNV-86550", date: "2026-03-16", headline: "Need SMS/email alerts for margin calls, not just popup", fullText: "I almost missed a margin call because it was only shown as an in-app notification. Please add SMS and email alerts for critical account events.", category: "Platform & Trading", sentiment: "Negative", priority: "High", status: "New", type: "suggestion", common_topic: "Better margin call notifications needed" },
  { id: "FB-026", chatId: "CNV-86500", date: "2026-03-15", headline: "Refund terms should be shown before purchase, not after", fullText: "I only found out about the strict refund policy after paying. This information should be clearly visible on the pricing page, not buried in terms and conditions.", category: "Payment & Refunds", sentiment: "Negative", priority: "Medium", status: "New", type: "suggestion", common_topic: "Refund policy not visible before purchase" },
  { id: "FB-027", chatId: "CNV-86450", date: "2026-03-15", headline: "Weekend live chat support needed for international traders", fullText: "Markets I trade are open on weekends but support is closed. At least a chatbot or limited weekend hours would help. Many of us trade from different timezones.", category: "Support", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", common_topic: "Weekend support for global traders" },
  { id: "FB-028", chatId: "CNV-86400", date: "2026-03-15", headline: "Paper trading feature would help new users get started", fullText: "A simulated trading environment would be amazing for onboarding. Let new users try the platform risk-free before committing funds. This would also reduce early churn.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", common_topic: "Add demo or paper trading mode" },
  { id: "FB-029", chatId: "CNV-86350", date: "2026-03-14", headline: "KYC documents requested again after already being verified", fullText: "I verified my identity 6 months ago and now I'm being asked to upload everything again. Why don't you retain verified documents? This is a waste of time.", category: "KYC_Issue", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", common_topic: "Repetitive KYC re-verification" },
  { id: "FB-030", chatId: "CNV-86300", date: "2026-03-14", headline: "Scaling rules page has contradictory information", fullText: "The profit target section says 8% but later says 10%. The drawdown rules are also confusing. Please create a simple visual guide instead of walls of text.", category: "Rules & Scaling", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", common_topic: "Scaling rules unclear or contradictory" },
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

const PRIORITY_COLORS = {
  "High": { bg: "rgba(239,68,68,0.15)", text: "#ef4444", dot: "#ef4444" },
  "Medium": { bg: "rgba(234,179,8,0.15)", text: "#eab308", dot: "#eab308" },
  "Low": { bg: "rgba(34,197,94,0.15)", text: "#22c55e", dot: "#22c55e" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [activeTab, setActiveTab] = useState("feedback");
  const [expandedTheme, setExpandedTheme] = useState(null);
  const ITEMS_PER_PAGE = 8;

  const allData = useMemo(() => {
    return [...feedbackData];
  }, [feedbackData]);

  const filtered = useMemo(() => {
    let d = allData.filter(f => f.type === activeTab);
    if (filterCategory !== "All") d = d.filter(f => f.category === filterCategory);
    if (filterPriority !== "All") d = d.filter(f => f.priority === filterPriority);
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
  }, [allData, activeTab, filterCategory, filterPriority, searchQuery, dateFrom, dateTo, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Category ranking (scoped to active tab)
  const tabData = useMemo(() => allData.filter(f => f.type === activeTab), [allData, activeTab]);

  const categoryRanking = useMemo(() => {
    const counts = {};
    tabData.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => ({ category: cat, count, meta: CATEGORIES_META[cat] || { color: "#64748b", icon: "📋" } }));
  }, [tabData]);

  const maxCatCount = categoryRanking[0]?.count || 1;

  // Summary metrics (scoped to active tab)
  const metrics = useMemo(() => {
    const total = tabData.length;
    const highPriority = tabData.filter(f => f.priority === "High").length;
    return { total, highPriority };
  }, [tabData]);

  // ─── Common topics grouping (from AI-assigned common_topic field) ──
  const commonThemes = useMemo(() => {
    const groups = {};
    tabData.forEach(item => {
      const topic = item.common_topic;
      if (!topic) return;
      if (!groups[topic]) groups[topic] = { theme: topic, count: 0, items: [] };
      groups[topic].count++;
      groups[topic].items.push(item);
    });
    return Object.values(groups)
      .filter(g => g.count >= 2)
      .sort((a, b) => b.count - a.count);
  }, [tabData]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(field); setSortDir("desc"); }
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

        {/* Tab Switcher */}
        <div style={{
          display: "inline-flex",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          padding: 3,
          marginBottom: 24,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            { key: "feedback", label: "Feedback" },
            { key: "suggestion", label: "Suggestions" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setFilterCategory("All"); setExpandedTheme(null); }}
              style={{
                padding: "8px 24px",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === tab.key ? "rgba(99,102,241,0.2)" : "transparent",
                color: activeTab === tab.key ? "#818cf8" : "#64748b",
                boxShadow: activeTab === tab.key ? "0 0 12px rgba(99,102,241,0.1)" : "none",
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 8,
                fontSize: 11,
                padding: "2px 7px",
                borderRadius: 6,
                background: activeTab === tab.key ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)",
                color: activeTab === tab.key ? "#a5b4fc" : "#475569",
              }}>
                {allData.filter(f => f.type === tab.key).length}
              </span>
            </button>
          ))}
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
        </div>

        {/* Main Grid: Feedback Table + Category Ranking */}
        <div style={styles.sectionGrid}>
          {/* Feedback Table */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>📋</span>
                {activeTab === "feedback" ? "Feedback" : "Suggestions"}
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
                    <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("priority")}>Priority <SortArrow field="priority" /></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={5} style={styles.emptyState}>No feedback found matching your filters.</td></tr>
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
                        <span style={styles.badge(PRIORITY_COLORS[fb.priority].bg, PRIORITY_COLORS[fb.priority].text)}>
                          <span style={styles.dotPulse(PRIORITY_COLORS[fb.priority].dot)}></span>
                          {fb.priority}
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
          <div style={{ ...styles.card, display: "flex", flexDirection: "column", maxHeight: 600 }}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🏆</span>
                Top Feedback Areas
                <span style={{ fontSize: 11, color: "#475569", fontWeight: 400, marginLeft: 4 }}>{categoryRanking.length}</span>
              </div>
            </div>
            {/* Search within categories */}
            <div style={{ padding: "10px 16px 6px" }}>
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  color: "#cbd5e1",
                  padding: "7px 12px",
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
              />
            </div>
            {/* Scrollable list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
              {categoryRanking
                .filter(item => item.category.toLowerCase().includes(categorySearch.toLowerCase()))
                .map((item, i) => {
                  const originalIndex = categoryRanking.indexOf(item);
                  return (
                <div
                  key={item.category}
                  style={{
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    background: filterCategory === item.category ? "rgba(99,102,241,0.08)" : "transparent",
                  }}
                  onClick={() => { setFilterCategory(filterCategory === item.category ? "All" : item.category); setCurrentPage(1); }}
                  onMouseOver={e => e.currentTarget.style.background = filterCategory === item.category ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.02)"}
                  onMouseOut={e => e.currentTarget.style.background = filterCategory === item.category ? "rgba(99,102,241,0.08)" : "transparent"}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: originalIndex === 0 ? "rgba(234,179,8,0.15)" : originalIndex === 1 ? "rgba(148,163,184,0.12)" : originalIndex === 2 ? "rgba(180,120,60,0.12)" : "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                    color: originalIndex === 0 ? "#eab308" : originalIndex === 1 ? "#94a3b8" : originalIndex === 2 ? "#b4783c" : "#475569",
                    flexShrink: 0,
                  }}>
                    {originalIndex + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{item.meta.icon}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.category}</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={styles.rankBar((item.count / maxCatCount) * 100, item.meta.color)} />
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: item.meta.color, minWidth: 32, textAlign: "right" }}>
                    {item.count}
                  </div>
                </div>
                );
              })}
              {categoryRanking.filter(item => item.category.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "#475569" }}>No categories found</div>
              )}
            </div>
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "#475569", textAlign: "center" }}>
                {filterCategory !== "All" ? (
                  <span>Filtered by <span style={{ color: "#818cf8" }}>{filterCategory}</span> — <span style={{ cursor: "pointer", color: "#f87171" }} onClick={() => { setFilterCategory("All"); setCurrentPage(1); }}>clear</span></span>
                ) : "Click a category to filter the feedback table"}
              </div>
            </div>
          </div>
        </div>

        {/* Common Feedback / Suggestion Table */}
        {commonThemes.length > 0 && (
          <div style={{ ...styles.card, marginBottom: 24 }}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🔁</span>
                Common {activeTab === "feedback" ? "Feedback" : "Suggestions"}
                <span style={{ fontSize: 12, color: "#475569", fontWeight: 400, marginLeft: 8 }}>
                  {commonThemes.length} recurring {commonThemes.length === 1 ? "pattern" : "patterns"} detected
                </span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: 40 }}>#</th>
                    <th style={styles.th}>Recurring Topic</th>
                    <th style={{ ...styles.th, width: 100, textAlign: "center" }}>Occurrences</th>
                    <th style={{ ...styles.th, width: 200 }}>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {commonThemes.map((t, i) => {
                    const maxCount = commonThemes[0]?.count || 1;
                    const pct = (t.count / maxCount) * 100;
                    const barColor = i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : i === 2 ? "#3b82f6" : "#6366f1";
                    const isExpanded = expandedTheme === t.theme;
                    return (
                      <React.Fragment key={t.theme}>
                      <tr
                        style={{ transition: "background 0.15s", cursor: "pointer", background: isExpanded ? "rgba(99,102,241,0.06)" : "transparent" }}
                        onClick={() => setExpandedTheme(isExpanded ? null : t.theme)}
                        onMouseOver={e => { if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseOut={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ ...styles.td, textAlign: "center", fontWeight: 700, fontSize: 14, color: i === 0 ? "#eab308" : i === 1 ? "#94a3b8" : i === 2 ? "#b4783c" : "#475569" }}>
                          {i + 1}
                        </td>
                        <td style={{ ...styles.td, fontWeight: 500, color: "#e2e8f0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 10, color: "#64748b", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                            {t.theme}
                          </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          <span style={{
                            display: "inline-block",
                            background: `${barColor}22`,
                            color: barColor,
                            fontWeight: 700,
                            fontSize: 14,
                            padding: "4px 14px",
                            borderRadius: 20,
                            minWidth: 32,
                          }}>
                            {t.count}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                              <div style={{
                                height: "100%",
                                borderRadius: 4,
                                background: `linear-gradient(90deg, ${barColor}, ${barColor}88)`,
                                width: `${pct}%`,
                                transition: "width 0.5s ease",
                              }} />
                            </div>
                            <span style={{ fontSize: 11, color: "#64748b", minWidth: 32, textAlign: "right" }}>
                              {((t.count / tabData.length) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={4} style={{ padding: 0, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <div style={{
                              background: "rgba(0,0,0,0.2)",
                              padding: "12px 16px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                            }}>
                              {t.items.map(item => (
                                <div
                                  key={item.id}
                                  style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 10,
                                    padding: "14px 18px",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s, background 0.2s",
                                  }}
                                  onClick={(e) => { e.stopPropagation(); setSelectedFeedback(item); }}
                                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                      <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{item.id}</span>
                                      <span style={{ fontSize: 11, color: "#475569" }}>{item.date}</span>
                                      <span style={{ fontSize: 11, color: CATEGORIES_META[item.category]?.color || "#64748b" }}>
                                        {CATEGORIES_META[item.category]?.icon} {item.category}
                                      </span>
                                    </div>
                                    <span style={styles.badge(PRIORITY_COLORS[item.priority].bg, PRIORITY_COLORS[item.priority].text)}>
                                      <span style={styles.dotPulse(PRIORITY_COLORS[item.priority].dot)}></span>
                                      {item.priority}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", marginBottom: 4 }}>
                                    {item.headline}
                                  </div>
                                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {item.fullText}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Section: Pipeline Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 24 }}>
          {/* Pipeline Overview */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>📊</span>
                Feedback Pipeline Overview
              </div>
            </div>
            <div style={{ padding: "20px 22px" }}>
              {/* Priority Breakdown */}
              <div>
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
