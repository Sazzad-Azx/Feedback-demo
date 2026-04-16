import React, { useState, useMemo, useRef, useEffect } from "react";
import DateRangePicker from "./DateRangePicker";
import AthenaIcon from "./AthenaIcon";

// ─── Custom Dropdown Component ───────────────────────────────────
function PillDropdown({ icon, label, value, options, onChange, searchable = true, multi = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && searchable && searchInputRef.current) searchInputRef.current.focus();
    if (!open) setSearch("");
  }, [open, searchable]);

  // Multi-select: value is an array; single-select: value is a string
  const displayText = multi
    ? (value.length === 0 || value.length === options.length ? label : `${value.length} selected`)
    : (options.find(o => o.value === value)?.label || label);

  const filtered = searchable
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const handleMultiToggle = (val) => {
    const isSelected = value.includes(val);
    const next = isSelected ? value.filter(v => v !== val) : [...value, val];
    onChange(next);
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(10,15,25,0.85)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 30,
          height: 44,
          padding: "4px 6px 4px 16px",
          minWidth: 170,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 15, flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          height: "100%",
          background: "rgba(30,41,59,0.75)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 24,
          padding: "0 14px",
          gap: 10,
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {displayText}
          </span>
          <svg width="8" height="8" viewBox="0 0 10 10" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
            <path fill="#94a3b8" d="M1 3.5l4 4 4-4z" />
          </svg>
        </div>
      </div>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          minWidth: "100%",
          maxWidth: 320,
          background: "rgba(15,20,32,0.98)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          zIndex: 100,
          overflow: "hidden",
          padding: 6,
        }}>
          {searchable && (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(30,41,59,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                color: "#cbd5e1",
                padding: "8px 12px",
                fontSize: 12,
                outline: "none",
                marginBottom: 6,
                boxSizing: "border-box",
              }}
            />
          )}
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: 12, color: "#475569", textAlign: "center" }}>No matches</div>
            ) : multi ? filtered.map(o => {
              const isChecked = value.includes(o.value);
              return (
                <div
                  key={o.value}
                  onClick={() => handleMultiToggle(o.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    color: isChecked ? "#e2e8f0" : "#cbd5e1",
                    background: isChecked ? "rgba(56,189,248,0.06)" : "transparent",
                    transition: "background 0.12s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseOver={e => e.currentTarget.style.background = isChecked ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.04)"}
                  onMouseOut={e => e.currentTarget.style.background = isChecked ? "rgba(56,189,248,0.06)" : "transparent"}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    border: isChecked ? "1.5px solid #38bdf8" : "1.5px solid rgba(255,255,255,0.15)",
                    background: isChecked ? "rgba(56,189,248,0.15)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {isChecked && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {o.label}
                </div>
              );
            }) : filtered.map(o => {
              const isSelected = o.value === value;
              return (
                <div
                  key={o.value}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? "#38bdf8" : "#cbd5e1",
                    background: isSelected ? "rgba(56,189,248,0.08)" : "transparent",
                    transition: "background 0.12s",
                  }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  {o.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mock Data ───────────────────────────────────────────────────
const MOCK_FEEDBACK = [
  { id: "FB-001", chatId: "CNV-88234", date: "2026-03-26", headline: "Login issues after password reset on mobile app", fullText: "Customer reported that after resetting their password through the mobile app, they were unable to log back in for over 30 minutes. The session token wasn't refreshing properly. They suggested adding a 'force logout all devices' option during password reset.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Under Review", type: "feedback", product: "CFD", common_topic: "Login fails after password reset" },
  { id: "FB-002", chatId: "CNV-88190", date: "2026-03-26", headline: "Requested dark mode for the trading dashboard", fullText: "Customer mentioned eye strain during late-night trading sessions and suggested implementing a dark mode toggle for the main trading dashboard. They referenced competitor platforms that already offer this.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", product: "CFD", common_topic: "Add dark mode to dashboard" },
  { id: "FB-003", chatId: "CNV-88102", date: "2026-03-25", headline: "Payout processing time is too slow compared to competitors", fullText: "Customer expressed frustration that payouts take 3-5 business days while competitors offer 24-hour processing. Suggested partnering with faster payment processors or offering crypto payout options for instant withdrawal.", category: "Payout Related Issue", sentiment: "Negative", priority: "High", status: "Escalated", type: "feedback", product: "Futures", common_topic: "Slow payout processing" },
  { id: "FB-004", chatId: "CNV-87998", date: "2026-03-25", headline: "Appreciated the quick resolution of account verification", fullText: "Customer praised the support team for resolving their KYC verification issue within 10 minutes. They suggested this level of service should be highlighted in marketing materials.", category: "KYC_Issue", sentiment: "Positive", priority: "Low", status: "Acknowledged", type: "feedback", product: "CFD", common_topic: "Praise for quick KYC resolution" },
  { id: "FB-005", chatId: "CNV-87845", date: "2026-03-24", headline: "Coupon code not applying at checkout for scaling plan", fullText: "Multiple customers have reported that promotional coupon codes for the scaling plan are not being applied correctly at checkout. The discount shows briefly then disappears when the payment page loads.", category: "Offers & Coupons", sentiment: "Negative", priority: "High", status: "In Progress", type: "feedback", product: "CFD", common_topic: null },
  { id: "FB-006", chatId: "CNV-87790", date: "2026-03-24", headline: "Suggestion to add MT5 platform support", fullText: "Customer strongly suggested adding MetaTrader 5 support alongside MT4. They mentioned that many professional traders prefer MT5 for its advanced charting and multi-asset capabilities.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "Under Review", type: "suggestion", product: "Futures", common_topic: "Add MetaTrader 5 support" },
  { id: "FB-007", chatId: "CNV-87701", date: "2026-03-23", headline: "Scaling rules documentation is confusing and outdated", fullText: "Customer found the scaling rules documentation contradictory and hard to follow. Specific sections about profit targets and drawdown limits had conflicting information. Suggested a visual flowchart instead of text-heavy docs.", category: "Rules & Scaling", sentiment: "Negative", priority: "Medium", status: "In Progress", type: "feedback", product: "Futures", common_topic: "Scaling rules unclear or contradictory" },
  { id: "FB-008", chatId: "CNV-87650", date: "2026-03-23", headline: "Refund policy needs clearer communication upfront", fullText: "Customer was surprised by the refund policy terms after purchase. They suggested displaying refund conditions more prominently on the pricing page and during checkout, not just in fine print.", category: "Payment & Refunds", sentiment: "Negative", priority: "Medium", status: "New", type: "suggestion", product: "CFD", common_topic: "Refund policy not visible before purchase" },
  { id: "FB-009", chatId: "CNV-87588", date: "2026-03-22", headline: "Live chat wait times have improved significantly", fullText: "Returning customer noted that live chat response times have dropped from 15+ minutes to under 3 minutes over the past month. They appreciated the improvement and suggested maintaining this standard.", category: "Support", sentiment: "Positive", priority: "Low", status: "Acknowledged", type: "feedback", product: "CFD", common_topic: "Improved live chat response times" },
  { id: "FB-010", chatId: "CNV-87490", date: "2026-03-22", headline: "Account dashboard shows incorrect balance after trade close", fullText: "Customer reported a UI bug where their account balance didn't update immediately after closing a profitable trade. The correct balance only appeared after a manual page refresh. This caused anxiety about whether the trade was properly recorded.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Escalated", type: "feedback", product: "Futures", common_topic: null },
  { id: "FB-011", chatId: "CNV-87402", date: "2026-03-21", headline: "Need better notification system for margin calls", fullText: "Customer nearly missed a margin call because the only notification was an in-app popup they didn't see. Suggested adding email, SMS, and push notification options for critical account alerts.", category: "Platform & Trading", sentiment: "Negative", priority: "High", status: "Under Review", type: "suggestion", product: "Futures", common_topic: "Better margin call notifications needed" },
  { id: "FB-012", chatId: "CNV-87355", date: "2026-03-21", headline: "KYC re-verification process is unnecessarily repetitive", fullText: "Long-time customer was asked to re-verify KYC documents they had already submitted. The process required uploading the same documents again. Suggested implementing a document retention policy for verified users.", category: "KYC_Issue", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", product: "CFD", common_topic: "Repetitive KYC re-verification" },
  { id: "FB-013", chatId: "CNV-87290", date: "2026-03-20", headline: "Suggest adding a demo/paper trading mode for new users", fullText: "New customer suggested offering a paper trading or demo mode so users can familiarize themselves with the platform before committing real capital. This would reduce early churn and support tickets from confused newcomers.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", product: "CFD", common_topic: "Add demo or paper trading mode" },
  { id: "FB-014", chatId: "CNV-87200", date: "2026-03-20", headline: "Weekend support availability is needed for global traders", fullText: "Customer in a different timezone emphasized the need for weekend support since markets they trade are open on weekends. Suggested at least limited weekend chat hours or an AI chatbot for common issues.", category: "Support", sentiment: "Neutral", priority: "Medium", status: "Under Review", type: "suggestion", product: "Futures", common_topic: "Weekend support for global traders" },
  { id: "FB-015", chatId: "CNV-87120", date: "2026-03-19", headline: "Promotional email promised discount not honored at checkout", fullText: "Customer received a promotional email with a 20% discount code but the code was rejected at checkout. Support confirmed the promotion had ended the day before the email was sent. Customer suggested better coordination between marketing and system teams.", category: "Offers & Coupons", sentiment: "Negative", priority: "High", status: "Escalated", type: "feedback", product: "CFD", common_topic: "Coupon codes not working at checkout" },
  { id: "FB-016", chatId: "CNV-87050", date: "2026-03-19", headline: "Can't log in after changing my password on phone", fullText: "After updating my password using the mobile browser, I kept getting 'invalid credentials' for almost an hour. Had to clear cookies and try again. Very frustrating experience.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "New", type: "feedback", product: "Futures", common_topic: null },
  { id: "FB-017", chatId: "CNV-86990", date: "2026-03-18", headline: "Password reset didn't work — stuck on login screen", fullText: "Reset my password via email link but the new password wasn't accepted on the login page. Tried multiple browsers. Eventually worked after 45 minutes. Please fix this.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "Under Review", type: "feedback", product: "CFD", common_topic: null },
  { id: "FB-018", chatId: "CNV-86920", date: "2026-03-18", headline: "Payout took 5 days, competitors do it in 24 hours", fullText: "I've been waiting 5 business days for my payout. Other prop firms process withdrawals within a day. This is unacceptable for a platform of this size. Need faster payment rails.", category: "Payout Related Issue", sentiment: "Negative", priority: "High", status: "New", type: "feedback", product: "Futures", common_topic: "Slow payout processing" },
  { id: "FB-019", chatId: "CNV-86880", date: "2026-03-18", headline: "Withdrawal processing is way too slow", fullText: "My withdrawal request has been pending for 4 days now. This is really slow compared to what other platforms offer. Please consider adding instant payout options.", category: "Payout Related Issue", sentiment: "Negative", priority: "High", status: "Under Review", type: "feedback", product: "CFD", common_topic: "Slow payout processing" },
  { id: "FB-020", chatId: "CNV-86800", date: "2026-03-17", headline: "Discount code from newsletter didn't work at checkout", fullText: "Got a 15% off coupon in the weekly newsletter but it shows 'invalid code' when I try to apply it at checkout. This has happened twice now with different codes.", category: "Offers & Coupons", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", product: "Futures", common_topic: null },
  { id: "FB-021", chatId: "CNV-86750", date: "2026-03-17", headline: "Balance not updating after closing trades", fullText: "Closed three profitable trades but my balance still shows the old amount. Had to refresh the page manually each time. The dashboard should update in real-time.", category: "Account Related Issue", sentiment: "Negative", priority: "High", status: "In Progress", type: "feedback", product: "CFD", common_topic: null },
  { id: "FB-022", chatId: "CNV-86700", date: "2026-03-17", headline: "Please add MetaTrader 5 — MT4 feels outdated", fullText: "MT4 is great but MT5 has so many more features. Advanced charting, more timeframes, better backtesting. Most serious traders have moved to MT5. Please add support.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", product: "Futures", common_topic: "Add MetaTrader 5 support" },
  { id: "FB-023", chatId: "CNV-86650", date: "2026-03-16", headline: "Suggestion: Add a practice/demo account for beginners", fullText: "As a new trader, I'd love a demo mode to learn the platform without risking real money. It would help reduce confusion and support tickets from new users.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "Under Review", type: "suggestion", product: "CFD", common_topic: "Add demo or paper trading mode" },
  { id: "FB-024", chatId: "CNV-86600", date: "2026-03-16", headline: "Dark mode option would be great for night trading", fullText: "Trading late at night with the bright interface causes eye strain. A dark theme toggle on the dashboard would be really helpful. Many competitors already have this.", category: "Platform & Trading", sentiment: "Neutral", priority: "Low", status: "New", type: "suggestion", product: "Futures", common_topic: "Add dark mode to dashboard" },
  { id: "FB-025", chatId: "CNV-86550", date: "2026-03-16", headline: "Need SMS/email alerts for margin calls, not just popup", fullText: "I almost missed a margin call because it was only shown as an in-app notification. Please add SMS and email alerts for critical account events.", category: "Platform & Trading", sentiment: "Negative", priority: "High", status: "New", type: "suggestion", product: "CFD", common_topic: "Better margin call notifications needed" },
  { id: "FB-026", chatId: "CNV-86500", date: "2026-03-15", headline: "Refund terms should be shown before purchase, not after", fullText: "I only found out about the strict refund policy after paying. This information should be clearly visible on the pricing page, not buried in terms and conditions.", category: "Payment & Refunds", sentiment: "Negative", priority: "Medium", status: "New", type: "suggestion", product: "Futures", common_topic: "Refund policy not visible before purchase" },
  { id: "FB-027", chatId: "CNV-86450", date: "2026-03-15", headline: "Weekend live chat support needed for international traders", fullText: "Markets I trade are open on weekends but support is closed. At least a chatbot or limited weekend hours would help. Many of us trade from different timezones.", category: "Support", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", product: "CFD", common_topic: "Weekend support for global traders" },
  { id: "FB-028", chatId: "CNV-86400", date: "2026-03-15", headline: "Paper trading feature would help new users get started", fullText: "A simulated trading environment would be amazing for onboarding. Let new users try the platform risk-free before committing funds. This would also reduce early churn.", category: "Platform & Trading", sentiment: "Neutral", priority: "Medium", status: "New", type: "suggestion", product: "Futures", common_topic: "Add demo or paper trading mode" },
  { id: "FB-029", chatId: "CNV-86350", date: "2026-03-14", headline: "KYC documents requested again after already being verified", fullText: "I verified my identity 6 months ago and now I'm being asked to upload everything again. Why don't you retain verified documents? This is a waste of time.", category: "KYC_Issue", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", product: "CFD", common_topic: "Repetitive KYC re-verification" },
  { id: "FB-030", chatId: "CNV-86300", date: "2026-03-14", headline: "Scaling rules page has contradictory information", fullText: "The profit target section says 8% but later says 10%. The drawdown rules are also confusing. Please create a simple visual guide instead of walls of text.", category: "Rules & Scaling", sentiment: "Negative", priority: "Medium", status: "New", type: "feedback", product: "Futures", common_topic: "Scaling rules unclear or contradictory" },
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
  "High": { bg: "rgba(255,46,151,0.15)", text: "#FF2E97", dot: "#FF2E97" },
  "Medium": { bg: "rgba(168,85,247,0.15)", text: "#A855F7", dot: "#A855F7" },
  "Low": { bg: "rgba(0,240,255,0.15)", text: "#00F0FF", dot: "#00F0FF" },
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
  pillDropdown: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(10,15,25,0.85)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 30,
    height: 44,
    padding: "4px 6px 4px 16px",
    minWidth: 170,
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
  },
  pillIconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: 15,
    flexShrink: 0,
  },
  pillInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    height: "100%",
    background: "rgba(30,41,59,0.75)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 24,
  },
  pillSelect: {
    background: "transparent",
    border: "none",
    color: "#cbd5e1",
    padding: "0 26px 0 14px",
    fontSize: 13,
    fontWeight: 500,
    outline: "none",
    cursor: "pointer",
    flex: 1,
    height: "100%",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 10 10'%3E%3Cpath fill='%2394a3b8' d='M1 3.5l4 4 4-4z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
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
  const [feedbackData, setFeedbackData] = useState(MOCK_FEEDBACK);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewingChat, setViewingChat] = useState(null);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterProduct, setFilterProduct] = useState("All");
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
  const [drillDown, setDrillDown] = useState(null);
  const [drillPage, setDrillPage] = useState(1);
  const DRILL_PER_PAGE = 15;
  const [showAddModal, setShowAddModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [newProduct, setNewProduct] = useState("CFD");
  const [newPriority, setNewPriority] = useState("Medium");
  const [toast, setToast] = useState(null);
  // ─── Global Athena State ─────────────────────────────────────
  const [athenaState, setAthenaState] = useState("closed"); // "open" | "minimized" | "closed"
  const [athenaSessions, setAthenaSessions] = useState([]); // [{ id, contextLabel, contextType, contextValue, contextColor, itemCount, messages: [{role, content, time}], createdAt }]
  const [athenaActiveSessionId, setAthenaActiveSessionId] = useState(null);
  const [athenaInput, setAthenaInput] = useState("");
  const [athenaThinking, setAthenaThinking] = useState(false);
  const athenaScrollRef = useRef(null);

  const athenaActiveSession = athenaSessions.find(s => s.id === athenaActiveSessionId) || null;

  const openAthenaForContext = (contextLabel, contextType, contextValue, contextColor, itemCount, items = []) => {
    // Check for existing session with same context
    const existing = athenaSessions.find(s => s.contextType === contextType && s.contextValue === contextValue);
    if (existing) {
      setAthenaActiveSessionId(existing.id);
      setAthenaState("open");
      return;
    }
    // Compute summary chips from items
    const priorityCounts = {};
    const productCounts = {};
    items.forEach(it => {
      priorityCounts[it.priority] = (priorityCounts[it.priority] || 0) + 1;
      productCounts[it.product] = (productCounts[it.product] || 0) + 1;
    });
    const newSession = {
      id: `athena-${Date.now()}`,
      contextLabel,
      contextType,
      contextValue,
      contextColor,
      itemCount,
      priorityCounts,
      productCounts,
      messages: [],
      createdAt: Date.now(),
    };
    setAthenaSessions(prev => [newSession, ...prev]);
    setAthenaActiveSessionId(newSession.id);
    setAthenaInput("");
    setAthenaState("open");
  };

  const closeAthenaSession = (sessionId) => {
    setAthenaSessions(prev => prev.filter(s => s.id !== sessionId));
    if (athenaActiveSessionId === sessionId) {
      setAthenaActiveSessionId(prev => {
        const remaining = athenaSessions.filter(s => s.id !== sessionId);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    }
  };

  const sendAthenaMessage = (text) => {
    if (!athenaActiveSession) return;
    const msg = (text ?? athenaInput).trim();
    if (!msg) return;
    const sessionId = athenaActiveSession.id;
    setAthenaSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, messages: [...s.messages, { role: "user", content: msg, time: Date.now() }] } : s
    ));
    setAthenaInput("");
    setAthenaThinking(true);
    setTimeout(() => {
      const label = athenaActiveSession.contextLabel;
      const count = athenaActiveSession.itemCount;
      const placeholderResponses = [
        `I'm analyzing ${count} ${activeTab === "feedback" ? "feedback entries" : "suggestions"} related to "${label}". The backend integration is being finalized — once connected, I'll deep-dive into conversations and surface patterns, sentiment trends, and actionable insights for your query.`,
        `Based on the ${count} records in this view, I'll be able to identify recurring topics, extract customer pain points, and recommend priorities. My full conversational analysis engine will be available shortly.`,
        `Great question. Once my connection to the conversation store is live, I'll pull the most relevant chats, summarize them, and highlight key takeaways specific to "${label}". Stay tuned.`,
      ];
      const response = placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
      setAthenaSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, messages: [...s.messages, { role: "athena", content: response, time: Date.now() }] } : s
      ));
      setAthenaThinking(false);
    }, 1200);
  };

  useEffect(() => {
    if (athenaState === "open" && athenaScrollRef.current) {
      athenaScrollRef.current.scrollTop = athenaScrollRef.current.scrollHeight;
    }
  }, [athenaActiveSession?.messages, athenaThinking, athenaState]);

  const openDrillDown = (data) => {
    setDrillDown(data);
    setDrillPage(1);
  };
  const closeDrillDown = () => setDrillDown(null);

  // ─── AI-simulated classification & headline generation ──
  const classifyCategory = (text) => {
    const t = text.toLowerCase();
    const rules = [
      { cat: "Payout Related Issue", kw: ["payout", "withdraw", "withdrawal", "payment processing time", "crypto payout"] },
      { cat: "KYC_Issue", kw: ["kyc", "verification", "verify", "identity", "document"] },
      { cat: "Offers & Coupons", kw: ["coupon", "discount", "promo", "offer", "promotional", "newsletter"] },
      { cat: "Rules & Scaling", kw: ["scaling", "rules", "profit target", "drawdown", "challenge", "evaluation"] },
      { cat: "Platform & Trading", kw: ["platform", "trading", "chart", "mt4", "mt5", "metatrader", "dark mode", "margin", "dashboard", "demo", "paper trading", "notification"] },
      { cat: "Payment & Refunds", kw: ["refund", "billing", "charge", "invoice", "subscription"] },
      { cat: "Support", kw: ["support", "live chat", "helpdesk", "service response", "weekend", "agent"] },
      { cat: "Account Related Issue", kw: ["login", "password", "account", "access", "balance", "sign in", "session", "cookies"] },
    ];
    for (const r of rules) {
      if (r.kw.some(k => t.includes(k))) return r.cat;
    }
    return "Platform & Trading"; // default fallback
  };

  const generateHeadline = (text) => {
    const trimmed = text.trim();
    // Use first sentence if short enough, otherwise truncate to ~80 chars
    const firstSentence = trimmed.split(/[.!?]/)[0].trim();
    if (firstSentence.length > 0 && firstSentence.length <= 100) return firstSentence;
    if (trimmed.length <= 80) return trimmed;
    return trimmed.slice(0, 80).trim() + "...";
  };

  const submitManualEntry = () => {
    const text = newText.trim();
    if (text.length < 10) {
      setToast({ type: "error", message: "Please enter at least 10 characters" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const headline = generateHeadline(text);
    const category = classifyCategory(text);
    const prefix = activeTab === "feedback" ? "FB" : "SG";
    const nextNum = String(feedbackData.length + 1).padStart(3, "0");
    const today = new Date().toISOString().slice(0, 10);

    const entry = {
      id: `${prefix}-${nextNum}`,
      chatId: "MANUAL",
      date: today,
      headline,
      fullText: text,
      category,
      sentiment: "Neutral",
      priority: newPriority,
      status: "New",
      type: activeTab,
      product: newProduct,
      common_topic: null,
      manualPriority: true,
    };

    setFeedbackData(prev => [entry, ...prev]);
    setShowAddModal(false);
    setNewText("");
    setNewProduct("CFD");
    setNewPriority("Medium");
    setCurrentPage(1);
    setToast({ type: "success", message: `${activeTab === "feedback" ? "Feedback" : "Suggestion"} added successfully — AI categorized as "${category}"` });
    setTimeout(() => setToast(null), 4000);
  };
  const ITEMS_PER_PAGE = 8;

  const allData = useMemo(() => {
    return [...feedbackData];
  }, [feedbackData]);

  const filtered = useMemo(() => {
    let d = allData.filter(f => f.type === activeTab);
    if (filterCategory.length > 0) d = d.filter(f => filterCategory.includes(f.category));
    if (filterPriority !== "All") d = d.filter(f => f.priority === filterPriority);
    if (filterProduct !== "All") d = d.filter(f => f.product === filterProduct);
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
  }, [allData, activeTab, filterCategory, filterPriority, filterProduct, searchQuery, dateFrom, dateTo, sortBy, sortDir]);

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

  const drillDownData = useMemo(() => {
    if (!drillDown) return [];
    if (drillDown.type === "priority") return tabData.filter(f => f.priority === drillDown.value);
    if (drillDown.type === "product") return tabData.filter(f => f.product === drillDown.value);
    if (drillDown.type === "category") return tabData.filter(f => f.category === drillDown.value);
    return [];
  }, [drillDown, tabData]);

  // Summary metrics (scoped to active tab)
  const metrics = useMemo(() => {
    const total = tabData.length;
    const highPriority = tabData.filter(f => f.priority === "High").length;
    return { total, highPriority };
  }, [tabData]);

  // ─── Common topics grouping (last 6 months only, matches API logic) ──
  const sixMonthCutoff = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().slice(0, 10);
  }, []);

  const commonThemes = useMemo(() => {
    const recentData = tabData.filter(item => item.date >= sixMonthCutoff);
    const groups = {};
    recentData.forEach(item => {
      const topic = item.common_topic;
      if (!topic) return;
      if (!groups[topic]) groups[topic] = { theme: topic, count: 0, items: [], latestDate: item.date };
      groups[topic].count++;
      groups[topic].items.push(item);
      if (item.date > groups[topic].latestDate) groups[topic].latestDate = item.date;
    });
    return Object.values(groups)
      .filter(g => g.count >= 2)
      .sort((a, b) => b.count - a.count);
  }, [tabData, sixMonthCutoff]);

  // Helper: build existingTopics payload for /api/group-feedback (production use)
  // Sends { topic, date } pairs so the API filters to last 6 months server-side too
  const getExistingTopicsForAPI = () => {
    const topicMap = {};
    feedbackData.forEach(item => {
      if (!item.common_topic) return;
      if (!topicMap[item.common_topic] || item.date > topicMap[item.common_topic]) {
        topicMap[item.common_topic] = item.date;
      }
    });
    return Object.entries(topicMap).map(([topic, date]) => ({ topic, date }));
  };

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

      <div style={styles.content}>
        {/* Page Title Banner */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            position: "relative",
            background: "linear-gradient(90deg, rgba(30,27,75,0.6) 0%, rgba(15,20,32,0.7) 40%, rgba(10,15,25,0.6) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            padding: "18px 24px 18px 34px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}>
            {/* Glowing left accent */}
            <div style={{
              position: "absolute",
              top: 10,
              bottom: 10,
              left: 14,
              width: 3,
              borderRadius: 2,
              background: "linear-gradient(180deg, #8b5cf6, #6366f1)",
              boxShadow: "0 0 12px rgba(139,92,246,0.6)",
            }} />

            {/* Icon */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#FF2E97", flexShrink: 0, filter: "drop-shadow(0 0 8px rgba(255,46,151,0.4))" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            {/* Title */}
            <h1 style={{ ...styles.pageTitle, fontSize: 20 }}>Feedback and Suggestions</h1>
          </div>
          <p style={{ ...styles.pageSubtitle, marginTop: 10, paddingLeft: 4 }}>AI-identified customer insights and manually submitted feedback for product improvement.</p>
        </div>

        {/* Tab Switcher + Add Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            padding: 3,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {[
              { key: "feedback", label: "Feedback" },
              { key: "suggestion", label: "Suggestions" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setFilterCategory("All"); setFilterProduct("All"); setExpandedTheme(null); }}
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

          {/* Add new button */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              transition: "transform 0.1s, box-shadow 0.15s",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(99,102,241,0.45)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.3)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New {activeTab === "feedback" ? "Feedback" : "Suggestion"}
          </button>
        </div>

        {/* Filter Bar — sticky */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 24,
          padding: "12px 0",
          background: "rgba(11,15,20,0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          marginLeft: -28,
          marginRight: -28,
          paddingLeft: 28,
          paddingRight: 28,
        }}>
          <DateRangePicker
            dateFrom={dateFrom}
            dateTo={dateTo}
            onApply={(from, to) => { setDateFrom(from); setDateTo(to); setCurrentPage(1); }}
          />
          <PillDropdown
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              </svg>
            }
            label="All Categories"
            value={filterCategory}
            onChange={v => { setFilterCategory(v); }}
            multi
            options={Object.keys(CATEGORIES_META).map(c => ({ value: c, label: c }))}
          />
          <PillDropdown
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 21V4" />
                <path d="M5 4h11l-2 4 2 4H5" />
              </svg>
            }
            label="All Priorities"
            value={filterPriority}
            onChange={v => { setFilterPriority(v); setCurrentPage(1); }}
            searchable={false}
            options={[
              { value: "All", label: "All Priorities" },
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" },
            ]}
          />
          <PillDropdown
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            }
            label="All Products"
            value={filterProduct}
            onChange={v => { setFilterProduct(v); setCurrentPage(1); }}
            searchable={false}
            options={[
              { value: "All", label: "All Products" },
              { value: "CFD", label: "CFD" },
              { value: "Futures", label: "Futures" },
            ]}
          />
          {/* Spacer to push search right */}
          <div style={{ flex: "1 1 0", minWidth: 0 }} />

          {/* Search Feedback */}
          <div style={{ position: "relative", flex: "0 1 280px", maxWidth: 280 }}>
            <input
              type="text"
              placeholder="🔍  Search feedback..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ ...styles.input, paddingLeft: 14, height: 38 }}
            />
          </div>
        </div>

        {/* Top Feedback Areas (left) + Total Feedback (right) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: 20, marginBottom: 24, alignItems: "stretch" }}>
          {/* Total Feedback + Product Type — two separate cards */}
          <div style={{ order: 2, display: "flex", flexDirection: "column", gap: 20 }}>
            {(() => {
              const toRad = (deg) => (deg * Math.PI) / 180;
              const size = 130;
              const cx = size / 2;
              const cy = size / 2;
              const outerR = 56;
              const innerR = 36;

              const arcPath = (startAngle, angle) => {
                if (angle >= 359.99) {
                  return `M ${cx} ${cy - outerR} A ${outerR} ${outerR} 0 1 1 ${cx - 0.001} ${cy - outerR} L ${cx - 0.001} ${cy - innerR} A ${innerR} ${innerR} 0 1 0 ${cx} ${cy - innerR} Z`;
                }
                const end = startAngle + angle;
                const large = angle > 180 ? 1 : 0;
                const x1 = cx + outerR * Math.cos(toRad(startAngle));
                const y1 = cy + outerR * Math.sin(toRad(startAngle));
                const x2 = cx + outerR * Math.cos(toRad(end));
                const y2 = cy + outerR * Math.sin(toRad(end));
                const ix1 = cx + innerR * Math.cos(toRad(end));
                const iy1 = cy + innerR * Math.sin(toRad(end));
                const ix2 = cx + innerR * Math.cos(toRad(startAngle));
                const iy2 = cy + innerR * Math.sin(toRad(startAngle));
                return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`;
              };

              const buildSlices = (segments) => {
                const total = segments.reduce((s, p) => s + p.count, 0) || 1;
                let cumAngle = -90;
                const slices = segments.map(s => {
                  const angle = (s.count / total) * 360;
                  const start = cumAngle;
                  cumAngle += angle;
                  return { ...s, startAngle: start, angle };
                });
                return { slices, total };
              };

              const renderDonut = (slices, total, gradPrefix, centerLabel, drillType) => (
                <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: "drop-shadow(0 0 12px rgba(0,0,0,0.4))" }}>
                    <defs>
                      {slices.map((s, i) => (
                        <linearGradient key={i} id={`${gradPrefix}-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={s.color} stopOpacity="1" />
                          <stop offset="100%" stopColor={s.colorEnd || s.color} stopOpacity="0.9" />
                        </linearGradient>
                      ))}
                    </defs>
                    <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={outerR - innerR} />
                    {slices.map((s, i) => s.count > 0 && (
                      <path
                        key={i}
                        d={arcPath(s.startAngle, s.angle)}
                        fill={`url(#${gradPrefix}-${i})`}
                        stroke="#0b0f14"
                        strokeWidth={2}
                        style={{ filter: `drop-shadow(0 0 10px ${s.glow})`, cursor: "pointer", transition: "opacity 0.15s" }}
                        onClick={() => openDrillDown({ type: drillType, value: s.label, label: s.label, color: s.color })}
                        onMouseOver={e => e.currentTarget.style.opacity = "0.8"}
                        onMouseOut={e => e.currentTarget.style.opacity = "1"}
                      />
                    ))}
                    <circle cx={cx} cy={cy} r={innerR - 4} fill="#0b0f14" />
                    <circle cx={cx} cy={cy} r={innerR - 4} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                    <text x={cx} y={cy - 5} textAnchor="middle" fill="#f1f5f9" fontSize={20} fontWeight={700} fontFamily="'DM Sans', sans-serif">{total}</text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748b" fontSize={9} fontWeight={500} fontFamily="'DM Sans', sans-serif">{centerLabel}</text>
                  </svg>
                </div>
              );

              const renderLegend = (slices, total, suffix, drillType) => (
                <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                  {slices.map((s, i) => {
                    const pct = ((s.count / total) * 100).toFixed(0);
                    return (
                      <div key={i}
                        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 8px", borderRadius: 8, transition: "background 0.15s" }}
                        onClick={() => openDrillDown({ type: drillType, value: s.label, label: s.label, color: s.color })}
                        onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        onMouseOut={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: `linear-gradient(135deg, ${s.color}, ${s.colorEnd || s.color})`,
                          boxShadow: `0 0 10px ${s.glow}`,
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.count}</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{pct}%</span>
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{s.label}{suffix ? ` ${suffix}` : ""}</span>
                      </div>
                    );
                  })}
                </div>
              );

              const prioritySegments = [
                { label: "High", count: tabData.filter(f => f.priority === "High").length, color: "#FF2E97", colorEnd: "#FF69B4", glow: "rgba(255,46,151,0.5)" },
                { label: "Medium", count: tabData.filter(f => f.priority === "Medium").length, color: "#A855F7", colorEnd: "#C084FC", glow: "rgba(168,85,247,0.5)" },
                { label: "Low", count: tabData.filter(f => f.priority === "Low").length, color: "#00F0FF", colorEnd: "#67E8F9", glow: "rgba(0,240,255,0.5)" },
              ];
              const priority = buildSlices(prioritySegments);

              const productSegments = [
                { label: "CFD", count: tabData.filter(f => f.product === "CFD").length, color: "#00B4FF", colorEnd: "#0066FF", glow: "rgba(0,180,255,0.5)" },
                { label: "Futures", count: tabData.filter(f => f.product === "Futures").length, color: "#BF00FF", colorEnd: "#7C4DFF", glow: "rgba(191,0,255,0.5)" },
              ];
              const product = buildSlices(productSegments);

              const titleStyle = {
                padding: "14px 18px 0",
                fontSize: 13,
                fontWeight: 600,
                color: "#94a3b8",
                letterSpacing: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 8,
              };

              const chartRowStyle = {
                flex: 1,
                padding: "12px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              };

              return (
                <>
                  {/* Total Feedback Card */}
                  <div style={{ ...styles.card, display: "flex", flexDirection: "column" }}>
                    <div style={titleStyle}>
                      <span>📋</span> Total {activeTab === "feedback" ? "Feedback" : "Suggestions"}
                    </div>
                    <div style={chartRowStyle}>
                      {renderDonut(priority.slices, priority.total, "pri", "Total", "priority")}
                      {renderLegend(priority.slices, priority.total, "Priority", "priority")}
                    </div>
                  </div>

                  {/* Product Type Card */}
                  <div style={{ ...styles.card, display: "flex", flexDirection: "column" }}>
                    <div style={titleStyle}>
                      <span>📦</span> Product Type
                    </div>
                    <div style={chartRowStyle}>
                      {renderDonut(product.slices, product.total, "prod", "Total", "product")}
                      {renderLegend(product.slices, product.total, "", "product")}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
          {/* Top Feedback Areas */}
          <div style={{ ...styles.card, display: "flex", flexDirection: "column", maxHeight: 600, order: 1 }}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🏆</span>
                Top {activeTab === "feedback" ? "Feedback" : "Suggestion"} Category
                <span style={{ fontSize: 11, color: "#475569", fontWeight: 400, marginLeft: 4 }}>{categoryRanking.length}</span>
              </div>
            </div>
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
                  }}
                  onClick={() => openDrillDown({ type: "category", value: item.category, label: item.category, color: item.meta.color })}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
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
                Click a category to view its feedbacks
              </div>
            </div>
          </div>
        </div>

        {/* Feedback / Suggestions Table */}
        <div style={{ marginBottom: 24 }}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>📋</span>
                {activeTab === "feedback" ? "Ungrouped Feedback" : "Ungrouped Suggestions"}
                <span style={{ fontSize: 12, color: "#475569", fontWeight: 400, marginLeft: 8 }}>{filtered.length} results</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => openAthenaForContext(
                    `All ${activeTab === "feedback" ? "Feedback" : "Suggestions"}`,
                    "allUngrouped",
                    activeTab,
                    "#00B4FF",
                    filtered.length,
                    filtered
                  )}
                  style={{
                    background: "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,229,255,0.06))",
                    border: "1px solid rgba(0,180,255,0.5)",
                    borderRadius: 8, color: "#00E5FF", padding: "6px 14px",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 7,
                    animation: "athenaFlameGlow 2.5s ease-in-out infinite",
                    transition: "all 0.2s",
                    letterSpacing: 0.3,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,180,255,0.22), rgba(0,229,255,0.12))";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(0,210,255,0.7), 0 0 32px rgba(0,180,255,0.4), 0 0 60px rgba(100,140,255,0.2)";
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,229,255,0.06))";
                    e.currentTarget.style.boxShadow = "";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <AthenaIcon size={20} />
                  Ask Athena
                  <span style={{
                    fontSize: 9, fontWeight: 800,
                    background: "linear-gradient(90deg, #00E5FF, #38bdf8)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    letterSpacing: 0.8,
                  }}>AI</span>
                </button>
                <button
                  onClick={() => {
                    const headers = ["ID", "Date", "Chat ID", "Headline", "Full Text", "Category", "Product", "Sentiment", "Priority", "Status", "Type", "Common Topic"];
                    const escapeCSV = (val) => {
                      const s = String(val ?? "");
                      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
                    };
                    const rows = filtered.map(fb => [fb.id, fb.date, fb.chatId, fb.headline, fb.fullText, fb.category, fb.product, fb.sentiment, fb.priority, fb.status, fb.type, fb.common_topic || ""].map(escapeCSV).join(","));
                    const csv = [headers.join(","), ...rows].join("\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${activeTab}-data.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    color: "#94a3b8",
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(34,197,94,0.15)"; e.currentTarget.style.color = "#22c55e"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
                >
                  <span style={{ fontSize: 14 }}>⬇</span> Download CSV
                </button>
              </div>
            </div>
            <div style={{ overflowX: "auto", maxHeight: 520, overflowY: "auto" }}>
              <table style={{ ...styles.table, borderCollapse: "separate", borderSpacing: 0 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th style={{ ...styles.th, cursor: "pointer", background: "#0b0f14" }} onClick={() => handleSort("date")}>Date <SortArrow field="date" /></th>
                    <th style={{ ...styles.th, background: "#0b0f14" }}>Feedback Headline</th>
                    <th style={{ ...styles.th, background: "#0b0f14" }}>Chat ID</th>
                    <th style={{ ...styles.th, background: "#0b0f14" }}>Category</th>
                    <th style={{ ...styles.th, background: "#0b0f14" }}>Product</th>
                    <th style={{ ...styles.th, cursor: "pointer", background: "#0b0f14" }} onClick={() => handleSort("priority")}>Priority <SortArrow field="priority" /></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} style={styles.emptyState}>No feedback found matching your filters.</td></tr>
                  ) : filtered.map((fb, i) => (
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
                        <span style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: fb.product === "CFD" ? "rgba(56,189,248,0.15)" : "rgba(168,85,247,0.15)",
                          color: fb.product === "CFD" ? "#38bdf8" : "#a855f7",
                          whiteSpace: "nowrap",
                        }}>
                          {fb.product}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <select
                            value={fb.priority}
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              const newPriority = e.target.value;
                              setFeedbackData(prev => prev.map(item =>
                                item.id === fb.id ? { ...item, priority: newPriority, manualPriority: true } : item
                              ));
                            }}
                            style={{
                              background: PRIORITY_COLORS[fb.priority].bg,
                              color: PRIORITY_COLORS[fb.priority].text,
                              border: `1px solid ${PRIORITY_COLORS[fb.priority].text}33`,
                              borderRadius: 20,
                              padding: "3px 10px",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              outline: "none",
                              appearance: "none",
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                              paddingRight: 20,
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 6px center",
                            }}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 18px", fontSize: 12, color: "#475569" }}>
              Showing {filtered.length} of {filtered.length}
            </div>
          </div>
        </div>

        {/* Common Feedback / Suggestion Table */}
        {commonThemes.length > 0 && (
          <div style={{ ...styles.card, marginBottom: 24 }}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🔁</span>
                {activeTab === "feedback" ? "Feedback Area" : "Suggestion Area"}
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
                    <th style={styles.th}>{activeTab === "feedback" ? "Feedback Area" : "Suggestion Area"}</th>
                    <th style={{ ...styles.th, width: 90, textAlign: "center" }}>Count</th>
                    <th style={styles.th}>Category</th>
                    <th style={{ ...styles.th, width: 110 }}>Product</th>
                    <th style={{ ...styles.th, width: 110 }}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {commonThemes.map((t, i) => {
                    const barColor = i === 0 ? "#FF2E97" : i === 1 ? "#A855F7" : i === 2 ? "#00F0FF" : "#6366f1";
                    const isExpanded = expandedTheme === t.theme;

                    // Derive dominant or "Mixed" values across the theme's items
                    const uniqueCategories = [...new Set(t.items.map(it => it.category))];
                    const themeCategory = uniqueCategories.length === 1 ? uniqueCategories[0] : "Mixed";

                    const uniqueProducts = [...new Set(t.items.map(it => it.product))];
                    const themeProduct = uniqueProducts.length === 1 ? uniqueProducts[0] : "Mixed";

                    const priorityRank = { High: 3, Medium: 2, Low: 1 };
                    const uniquePriorities = [...new Set(t.items.map(it => it.priority))];
                    const themePriority = uniquePriorities.length === 1
                      ? uniquePriorities[0]
                      : (uniquePriorities.every(p => p === uniquePriorities[0]) ? uniquePriorities[0] : "Mixed");

                    const productStyle = themeProduct === "CFD"
                      ? { bg: "rgba(56,189,248,0.15)", color: "#38bdf8" }
                      : themeProduct === "Futures"
                      ? { bg: "rgba(168,85,247,0.15)", color: "#a855f7" }
                      : { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" };

                    return (
                      <React.Fragment key={t.theme}>
                      <tr
                        style={{ transition: "background 0.15s", cursor: "pointer", background: isExpanded ? "rgba(99,102,241,0.06)" : "transparent" }}
                        onClick={() => setExpandedTheme(isExpanded ? null : t.theme)}
                        onMouseOver={e => { if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseOut={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ ...styles.td, textAlign: "center", fontWeight: 700, fontSize: 14, color: "#94a3b8" }}>
                          {i + 1}
                        </td>
                        <td style={{ ...styles.td, fontWeight: 500, color: "#e2e8f0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 10, color: "#64748b", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                            {t.theme}
                            {isExpanded && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  openAthenaForContext(t.theme, "feedbackArea", t.theme, barColor, t.items.length, t.items);
                                }}
                                style={{
                                  background: "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,229,255,0.06))",
                                  border: "1px solid rgba(0,180,255,0.5)",
                                  borderRadius: 6, color: "#00E5FF", padding: "4px 10px",
                                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                                  display: "inline-flex", alignItems: "center", gap: 6,
                                  animation: "athenaFlameGlow 2.5s ease-in-out infinite",
                                  transition: "all 0.2s",
                                  marginLeft: 6, flexShrink: 0,
                                }}
                                onMouseOver={e => {
                                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,180,255,0.22), rgba(0,229,255,0.12))";
                                  e.currentTarget.style.boxShadow = "0 0 16px rgba(0,210,255,0.7), 0 0 32px rgba(0,180,255,0.4)";
                                  e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseOut={e => {
                                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,229,255,0.06))";
                                  e.currentTarget.style.boxShadow = "";
                                  e.currentTarget.style.transform = "scale(1)";
                                }}
                              >
                                <AthenaIcon size={16} />
                                Ask Athena
                              </button>
                            )}
                          </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          <span style={{
                            display: "inline-block",
                            background: "rgba(226,232,240,0.08)",
                            color: "#e2e8f0",
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
                          {themeCategory === "Mixed" ? (
                            <span style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Mixed</span>
                          ) : (
                            <span style={{ fontSize: 12, color: CATEGORIES_META[themeCategory]?.color || "#64748b" }}>
                              {CATEGORIES_META[themeCategory]?.icon} {themeCategory}
                            </span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                            background: productStyle.bg,
                            color: productStyle.color,
                            whiteSpace: "nowrap",
                          }}>{themeProduct}</span>
                        </td>
                        <td style={styles.td}>
                          {themePriority === "Mixed" ? (
                            <span style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                              background: "rgba(148,163,184,0.12)",
                              color: "#94a3b8",
                            }}>Mixed</span>
                          ) : (
                            <span style={styles.badge(PRIORITY_COLORS[themePriority].bg, PRIORITY_COLORS[themePriority].text)}>
                              <span style={styles.dotPulse(PRIORITY_COLORS[themePriority].dot)}></span>
                              {themePriority}
                            </span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && t.items.map((item, idx) => {
                        const isLast = false; // no bottom border between items, Athena button row handles it
                        const childTdBase = {
                          padding: "10px 16px",
                          fontSize: 12,
                          color: "#94a3b8",
                          background: "rgba(0,0,0,0.2)",
                          borderBottom: isLast ? "1px solid rgba(255,255,255,0.03)" : "none",
                          verticalAlign: "middle",
                        };
                        return (
                          <tr
                            key={item.id}
                            onClick={e => e.stopPropagation()}
                            onMouseOver={e => Array.from(e.currentTarget.children).forEach(td => td.style.background = "rgba(255,255,255,0.02)")}
                            onMouseOut={e => Array.from(e.currentTarget.children).forEach(td => td.style.background = "rgba(0,0,0,0.2)")}
                          >
                            {/* Column 1 (#): Date + left border indicator */}
                            <td style={{ ...childTdBase, padding: 0, position: "relative" }}>
                              <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: barColor }} />
                              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", whiteSpace: "nowrap", paddingLeft: 32 }}>
                                {item.date}
                              </span>
                            </td>

                            {/* Column 2 (Feedback Area): Headline */}
                            <td style={{ ...childTdBase, color: "#e2e8f0" }}>
                              <span
                                style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", minWidth: 0 }}
                                onClick={() => setSelectedFeedback(item)}
                                onMouseOver={e => e.target.style.color = "#22c55e"}
                                onMouseOut={e => e.target.style.color = "#e2e8f0"}
                              >
                                {item.headline}
                              </span>
                            </td>

                            {/* Column 3 (Count): Chat ID */}
                            <td style={{ ...childTdBase, textAlign: "center" }}>
                              <span
                                style={{ fontSize: 11, color: "#38bdf8", fontWeight: 600, fontFamily: "monospace", cursor: "pointer", whiteSpace: "nowrap" }}
                                onClick={() => setViewingChat(item)}
                                onMouseOver={e => e.target.style.color = "#7dd3fc"}
                                onMouseOut={e => e.target.style.color = "#38bdf8"}
                              >
                                {item.chatId}
                              </span>
                            </td>

                            {/* Column 4: Category (empty) */}
                            <td style={childTdBase}></td>

                            {/* Column 5: Product — aligned with parent */}
                            <td style={childTdBase}>
                              <span style={{
                                display: "inline-block",
                                padding: "3px 10px",
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 600,
                                background: item.product === "CFD" ? "rgba(56,189,248,0.15)" : "rgba(168,85,247,0.15)",
                                color: item.product === "CFD" ? "#38bdf8" : "#a855f7",
                                whiteSpace: "nowrap",
                              }}>{item.product}</span>
                            </td>

                            {/* Column 6: Priority — changeable dropdown */}
                            <td style={childTdBase}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <select
                                  value={item.priority}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => {
                                    const newPriority = e.target.value;
                                    setFeedbackData(prev => prev.map(fb =>
                                      fb.id === item.id ? { ...fb, priority: newPriority, manualPriority: true } : fb
                                    ));
                                  }}
                                  style={{
                                    background: PRIORITY_COLORS[item.priority].bg,
                                    color: PRIORITY_COLORS[item.priority].text,
                                    border: `1px solid ${PRIORITY_COLORS[item.priority].text}33`,
                                    borderRadius: 20,
                                    padding: "3px 10px",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    outline: "none",
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                    MozAppearance: "none",
                                    paddingRight: 20,
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 6px center",
                                  }}
                                >
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Feedback Detail */}
      {selectedFeedback && (
        <div style={{ ...styles.modal, zIndex: 1100 }}>
          <div style={styles.modalOverlay} onClick={() => setSelectedFeedback(null)} />
          <div style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={() => setSelectedFeedback(null)}>✕</button>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
                <select
                  value={selectedFeedback.priority}
                  onChange={e => {
                    const newPriority = e.target.value;
                    setFeedbackData(prev => prev.map(item =>
                      item.id === selectedFeedback.id ? { ...item, priority: newPriority, manualPriority: true } : item
                    ));
                    setSelectedFeedback(prev => ({ ...prev, priority: newPriority, manualPriority: true }));
                  }}
                  style={{
                    background: PRIORITY_COLORS[selectedFeedback.priority].bg,
                    color: PRIORITY_COLORS[selectedFeedback.priority].text,
                    border: `1px solid ${PRIORITY_COLORS[selectedFeedback.priority].text}33`,
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    outline: "none",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    paddingRight: 20,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 6px center",
                  }}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                {selectedFeedback.manualPriority && (
                  <span style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>✋ Manually set</span>
                )}
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
        <div style={{ ...styles.modal, zIndex: 1200 }}>
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
      {/* Drill-Down Modal */}
      {drillDown && (() => {
        const totalDrillPages = Math.ceil(drillDownData.length / DRILL_PER_PAGE);
        const drillPaginated = drillDownData.slice((drillPage - 1) * DRILL_PER_PAGE, drillPage * DRILL_PER_PAGE);
        const drillStart = (drillPage - 1) * DRILL_PER_PAGE + 1;
        const drillEnd = Math.min(drillPage * DRILL_PER_PAGE, drillDownData.length);
        const isCategory = drillDown.type === "category";
        const headers = isCategory
          ? ["Chat ID", "Date", "Headline", "Priority", "Product", "Status"]
          : ["Chat ID", "Date", "Headline", "Category", drillDown.type === "priority" ? "Product" : "Priority", "Status"];

        const exportDrillCSV = () => {
          const csvHeaders = headers;
          const escapeCSV = (val) => { const s = String(val ?? ""); return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s; };
          const rows = drillDownData.map(fb => (isCategory
            ? [fb.chatId, fb.date, fb.headline, fb.priority, fb.product, fb.status]
            : [fb.chatId, fb.date, fb.headline, fb.category, drillDown.type === "priority" ? fb.product : fb.priority, fb.status]
          ).map(escapeCSV).join(","));
          const csv = [csvHeaders.join(","), ...rows].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url;
          a.download = `${drillDown.label}-${drillDown.type}-drilldown.csv`;
          a.click(); URL.revokeObjectURL(url);
        };

        const pgBtnStyle = (active) => ({
          background: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
          border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
          color: active ? "#818cf8" : "#64748b",
          borderRadius: 6, width: 32, height: 32, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 600,
        });

        return (
          <div style={styles.modal}>
            <div style={styles.modalOverlay} onClick={closeDrillDown} />
            <div style={{
              position: "relative", background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
              maxWidth: 940, width: "92%", maxHeight: "85vh",
              display: "flex", flexDirection: "column", zIndex: 1,
            }}>
              {/* Header */}
              <div style={{ padding: "24px 28px 18px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: drillDown.color, boxShadow: `0 0 10px ${drillDown.color}66` }} />
                    {drillDown.label}{drillDown.type === "priority" ? " Priority" : ""} — {activeTab === "feedback" ? "Feedbacks" : "Suggestions"}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{drillDownData.length} records</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => {
                      openAthenaForContext(
                        drillDown.label,
                        drillDown.type,
                        drillDown.value,
                        drillDown.color,
                        drillDownData.length,
                        drillDownData
                      );
                    }}
                    style={{
                      background: "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,229,255,0.06))",
                      border: "1px solid rgba(0,180,255,0.5)",
                      borderRadius: 8, color: "#00E5FF", padding: "7px 16px",
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      animation: "athenaFlameGlow 2.5s ease-in-out infinite",
                      transition: "all 0.2s",
                      letterSpacing: 0.3,
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,180,255,0.22), rgba(0,229,255,0.12))";
                      e.currentTarget.style.boxShadow = "0 0 16px rgba(0,210,255,0.7), 0 0 32px rgba(0,180,255,0.4), 0 0 60px rgba(100,140,255,0.2)";
                      e.currentTarget.style.transform = "scale(1.03)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,229,255,0.06))";
                      e.currentTarget.style.boxShadow = "";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <AthenaIcon size={22} />
                    Ask Athena
                    <span style={{
                      fontSize: 9, fontWeight: 800,
                      background: "linear-gradient(90deg, #00E5FF, #38bdf8)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      letterSpacing: 0.8,
                    }}>AI</span>
                  </button>
                  <button
                    onClick={exportDrillCSV}
                    style={{
                      background: "transparent", border: "1px solid rgba(52,211,153,0.4)",
                      borderRadius: 8, color: "#34d399", padding: "7px 16px",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >Export CSV</button>
                  <button
                    onClick={closeDrillDown}
                    style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                      color: "#94a3b8", width: 34, height: 34, borderRadius: 8,
                      cursor: "pointer", fontSize: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >✕</button>
                </div>
              </div>

              {/* Records bar */}
              <div style={{ padding: "0 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
                <div style={{
                  padding: "12px 0",
                  fontSize: 13, fontWeight: 600, color: "#f1f5f9",
                  borderBottom: "2px solid #818cf8",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  Records
                  <span style={{ fontSize: 11, background: "rgba(255,255,255,0.06)", padding: "2px 7px", borderRadius: 6, color: "#94a3b8" }}>
                    {drillDownData.length}
                  </span>
                </div>
              </div>

              {/* Records View — Table */}
              {(
              <div style={{ flex: 1, overflowY: "auto", padding: "0 28px", minHeight: 0 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, background: "#111827", zIndex: 1 }}>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {headers.map(h => (
                        <th key={h} style={{
                          padding: "12px 14px", textAlign: "left", color: "#64748b",
                          fontWeight: 700, fontSize: 11, textTransform: "uppercase",
                          letterSpacing: 0.8, whiteSpace: "nowrap", background: "#111827",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drillPaginated.map(fb => (
                      <tr key={fb.id}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                        onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                        onMouseOut={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px 14px", fontSize: 13, whiteSpace: "nowrap" }}>
                          <span
                            style={{ color: "#38bdf8", fontWeight: 600, fontFamily: "monospace", cursor: "pointer" }}
                            onClick={() => setViewingChat(fb)}
                            onMouseOver={e => e.target.style.color = "#7dd3fc"}
                            onMouseOut={e => e.target.style.color = "#38bdf8"}
                          >{fb.chatId}</span>
                        </td>
                        <td style={{ padding: "14px 14px", color: "#94a3b8", fontSize: 13, whiteSpace: "nowrap" }}>{fb.date}</td>
                        <td style={{ padding: "14px 14px", fontSize: 13, maxWidth: 280 }}>
                          <span
                            style={{ color: "#cbd5e1", cursor: "pointer", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            onClick={() => setSelectedFeedback(fb)}
                            onMouseOver={e => e.target.style.color = "#22c55e"}
                            onMouseOut={e => e.target.style.color = "#cbd5e1"}
                          >{fb.headline}</span>
                        </td>
                        {isCategory ? (
                          <>
                            <td style={{ padding: "14px 14px", fontSize: 13 }}>
                              <span style={{ color: PRIORITY_COLORS[fb.priority]?.text || "#94a3b8" }}>{fb.priority}</span>
                            </td>
                            <td style={{ padding: "14px 14px", color: "#94a3b8", fontSize: 13 }}>{fb.product}</td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: "14px 14px", color: "#94a3b8", fontSize: 13, whiteSpace: "nowrap" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                                <span>{CATEGORIES_META[fb.category]?.icon || "📋"}</span>
                                {fb.category}
                              </span>
                            </td>
                            <td style={{ padding: "14px 14px", fontSize: 13 }}>
                              {drillDown.type === "priority" ? (
                                <span style={{ color: "#94a3b8" }}>{fb.product}</span>
                              ) : (
                                <span style={{ color: PRIORITY_COLORS[fb.priority]?.text || "#94a3b8" }}>{fb.priority}</span>
                              )}
                            </td>
                          </>
                        )}
                        <td style={{ padding: "14px 14px", color: "#94a3b8", fontSize: 13 }}>{fb.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}

              {/* Records footer / Pagination */}
              {(
              <div style={{
                padding: "14px 28px", borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
              }}>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  Showing {drillStart}–{drillEnd} of {drillDownData.length}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button style={pgBtnStyle(false)} disabled={drillPage === 1} onClick={() => setDrillPage(1)}>«</button>
                  <button style={pgBtnStyle(false)} disabled={drillPage === 1} onClick={() => setDrillPage(p => Math.max(1, p - 1))}>‹</button>
                  <span style={{ fontSize: 12, color: "#94a3b8", padding: "0 8px" }}>{drillPage} / {totalDrillPages}</span>
                  <button style={pgBtnStyle(false)} disabled={drillPage === totalDrillPages} onClick={() => setDrillPage(p => Math.min(totalDrillPages, p + 1))}>›</button>
                  <button style={pgBtnStyle(false)} disabled={drillPage === totalDrillPages} onClick={() => setDrillPage(totalDrillPages)}>»</button>
                </div>
              </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* Add Manual Feedback/Suggestion Modal */}
      {showAddModal && (
        <div style={{ ...styles.modal, zIndex: 1100 }}>
          <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)} />
          <div style={{
            position: "relative", background: "#111827",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
            maxWidth: 540, width: "92%", padding: "28px 30px",
            zIndex: 1,
          }}>
            <button style={styles.closeBtn} onClick={() => setShowAddModal(false)}>✕</button>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#a5b4fc",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>
                  New {activeTab === "feedback" ? "Feedback" : "Suggestion"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginLeft: 42 }}>
                AI will auto-generate the headline and category from your text
              </div>
            </div>

            {/* Feedback text */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                {activeTab === "feedback" ? "Feedback" : "Suggestion"} <span style={{ color: "#f87171" }}>*</span>
              </label>
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder={`Describe the ${activeTab === "feedback" ? "feedback" : "suggestion"} in detail...`}
                rows={5}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  color: "#e2e8f0",
                  padding: "12px 14px",
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <div style={{ fontSize: 11, color: "#475569", marginTop: 6, textAlign: "right" }}>
                {newText.length} characters
              </div>
            </div>

            {/* Product + Priority */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                  Product Type
                </label>
                <select
                  value={newProduct}
                  onChange={e => setNewProduct(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    padding: "10px 14px",
                    fontSize: 13,
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="CFD" style={{ background: "#111827", color: "#e2e8f0" }}>CFD</option>
                  <option value="Futures" style={{ background: "#111827", color: "#e2e8f0" }}>Futures</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value)}
                  style={{
                    width: "100%",
                    background: PRIORITY_COLORS[newPriority].bg,
                    border: `1px solid ${PRIORITY_COLORS[newPriority].text}33`,
                    borderRadius: 10,
                    color: PRIORITY_COLORS[newPriority].text,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="High" style={{ background: "#111827", color: "#FF2E97" }}>High</option>
                  <option value="Medium" style={{ background: "#111827", color: "#A855F7" }}>Medium</option>
                  <option value="Low" style={{ background: "#111827", color: "#00F0FF" }}>Low</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >Cancel</button>
              <button
                onClick={submitManualEntry}
                disabled={newText.trim().length < 10}
                style={{
                  background: newText.trim().length < 10 ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "10px 26px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: newText.trim().length < 10 ? "not-allowed" : "pointer",
                  boxShadow: newText.trim().length < 10 ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                  opacity: newText.trim().length < 10 ? 0.6 : 1,
                }}
              >Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Global Athena Panel ═══════════════════════════════════ */}
      {athenaState === "open" && (
        <>
          {/* Overlay backdrop */}
          <div
            onClick={() => setAthenaState("minimized")}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
              zIndex: 3000, backdropFilter: "blur(2px)",
              animation: "athenaBackdropIn 0.25s ease-out",
            }}
          />
          {/* Panel */}
          <div style={{
            position: "fixed",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(94vw, 960px)",
            height: "min(88vh, 720px)",
            background: "rgba(11,15,20,0.98)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(191,95,255,0.08)",
            zIndex: 3001,
            display: "flex",
            overflow: "hidden",
            animation: "athenaOpen 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            {/* Left sidebar — sessions */}
            <div style={{
              width: 240, flexShrink: 0,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column",
              background: "rgba(8,12,18,0.6)",
            }}>
              {/* Sidebar header — #1 gradient glow */}
              <div style={{
                padding: "16px 16px 12px",
                borderBottom: "none",
                display: "flex", alignItems: "center", gap: 10,
                position: "relative",
              }}>
                <AthenaIcon size={28} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Athena</span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: "linear-gradient(90deg, #00E5FF, #BF5FFF, #FF3CAC)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  letterSpacing: 0.5,
                }}>AI</span>
                {/* Gradient bottom border */}
                <div style={{
                  position: "absolute", bottom: 0, left: 12, right: 12, height: 2, borderRadius: 1,
                  background: "linear-gradient(90deg, #00E5FF, #BF5FFF, #FF3CAC)",
                  opacity: 0.4,
                }} />
                {/* Radial glow behind header */}
                <div style={{
                  position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
                  width: 160, height: 20,
                  background: "radial-gradient(ellipse, rgba(191,95,255,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
              </div>

              {/* Session list */}
              <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
                {athenaSessions.length === 0 ? (
                  <div style={{ padding: "20px 12px", textAlign: "center", fontSize: 12, color: "#475569" }}>
                    No active chats
                  </div>
                ) : athenaSessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => { setAthenaActiveSessionId(s.id); setAthenaInput(""); }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      marginBottom: 4,
                      background: s.id === athenaActiveSessionId ? "rgba(191,95,255,0.1)" : "transparent",
                      border: s.id === athenaActiveSessionId ? "1px solid rgba(191,95,255,0.2)" : "1px solid transparent",
                      borderLeft: s.id === athenaActiveSessionId ? `3px solid ${s.contextColor || "#BF5FFF"}` : "3px solid transparent",
                      transition: "all 0.15s",
                      display: "flex", alignItems: "flex-start", gap: 8,
                    }}
                    onMouseOver={e => { if (s.id !== athenaActiveSessionId) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseOut={e => { if (s.id !== athenaActiveSessionId) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                      background: s.contextColor || "#BF5FFF",
                      boxShadow: `0 0 8px ${s.contextColor || "#BF5FFF"}66`,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: "#e2e8f0",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {s.contextLabel}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                        {s.itemCount} {s.itemCount === 1 ? "record" : "records"} · {s.messages.length} msgs
                      </div>
                    </div>
                    {/* Close session button */}
                    <button
                      onClick={e => { e.stopPropagation(); closeAthenaSession(s.id); }}
                      style={{
                        background: "none", border: "none", color: "#475569",
                        cursor: "pointer", fontSize: 14, padding: "0 2px", lineHeight: 1,
                        flexShrink: 0,
                      }}
                      onMouseOver={e => e.target.style.color = "#ef4444"}
                      onMouseOut={e => e.target.style.color = "#475569"}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel — active chat */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              {/* Panel header */}
              <div style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexShrink: 0,
              }}>
                <div>
                  {athenaActiveSession ? (
                    <>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: athenaActiveSession.contextColor, boxShadow: `0 0 8px ${athenaActiveSession.contextColor}66` }} />
                        {athenaActiveSession.contextLabel}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                        {athenaActiveSession.itemCount} {activeTab === "feedback" ? "feedback entries" : "suggestions"}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>Select a chat</div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {/* Minimize */}
                  <button
                    onClick={() => setAthenaState("minimized")}
                    title="Minimize"
                    style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8, width: 32, height: 32, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#94a3b8", fontSize: 16, transition: "all 0.15s",
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#e2e8f0"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    −
                  </button>
                  {/* Close */}
                  <button
                    onClick={() => setAthenaState("closed")}
                    title="Close Athena"
                    style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8, width: 32, height: 32, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#94a3b8", fontSize: 14, transition: "all 0.15s",
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Chat area */}
              {athenaActiveSession ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  {/* #6 Radial gradient background */}
                  <div ref={athenaScrollRef} style={{
                    flex: 1, overflowY: "auto", padding: "20px 24px",
                    background: "radial-gradient(ellipse at 50% 30%, rgba(123,47,255,0.06) 0%, rgba(0,229,255,0.03) 40%, transparent 70%)",
                  }}>
                    {/* Welcome state */}
                    {athenaActiveSession.messages.length === 0 && (
                      <div style={{ textAlign: "center", paddingTop: 30 }}>
                        {/* #5 Animated floating Athena icon */}
                        <div style={{ animation: "athenaFloat 3s ease-in-out infinite", display: "inline-block" }}>
                          <AthenaIcon size={80} />
                        </div>
                        <div style={{
                          fontSize: 24, fontWeight: 700, marginTop: 16,
                          background: "linear-gradient(90deg, #00E5FF, #BF5FFF, #FF3CAC)",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                          Hi, I'm Athena
                        </div>
                        <div style={{ fontSize: 13, color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>
                          Deep-diving into <strong style={{ color: "#cbd5e1" }}>{athenaActiveSession.itemCount}</strong> {activeTab === "feedback" ? "feedback entries" : "suggestions"} related to
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: athenaActiveSession.contextColor, boxShadow: `0 0 8px ${athenaActiveSession.contextColor}` }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: athenaActiveSession.contextColor }}>{athenaActiveSession.contextLabel}</span>
                        </div>

                        {/* #8 Context summary chips */}
                        {(Object.keys(athenaActiveSession.priorityCounts || {}).length > 0 || Object.keys(athenaActiveSession.productCounts || {}).length > 0) && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 16 }}>
                            {Object.entries(athenaActiveSession.priorityCounts || {}).map(([p, count]) => (
                              <span key={p} style={{
                                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
                                background: PRIORITY_COLORS[p]?.bg || "rgba(148,163,184,0.1)",
                                color: PRIORITY_COLORS[p]?.text || "#94a3b8",
                                border: `1px solid ${(PRIORITY_COLORS[p]?.text || "#94a3b8")}22`,
                              }}>
                                {p}: {count}
                              </span>
                            ))}
                            {Object.entries(athenaActiveSession.productCounts || {}).map(([p, count]) => (
                              <span key={p} style={{
                                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
                                background: p === "CFD" ? "rgba(56,189,248,0.12)" : "rgba(168,85,247,0.12)",
                                color: p === "CFD" ? "#38bdf8" : "#a855f7",
                                border: `1px solid ${p === "CFD" ? "rgba(56,189,248,0.2)" : "rgba(168,85,247,0.2)"}`,
                              }}>
                                {p}: {count}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* #7 Suggested questions as cards */}
                        <div style={{ marginTop: 28, fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Try asking</div>
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                          {[
                            { icon: "🔍", q: "What are the most common pain points here?" },
                            { icon: "📊", q: "What's the overall sentiment in this group?" },
                            { icon: "🎯", q: "Which feedback should we prioritize first?" },
                            { icon: "🔁", q: "Are there recurring patterns in the customer language?" },
                          ].map(({ icon, q }, i) => (
                            <div
                              key={i}
                              onClick={() => sendAthenaMessage(q)}
                              style={{
                                padding: "12px 18px", borderRadius: 12, fontSize: 13, color: "#94a3b8",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                cursor: "pointer", transition: "all 0.2s", maxWidth: 420, width: "100%",
                                display: "flex", alignItems: "center", gap: 12,
                                backdropFilter: "blur(4px)",
                              }}
                              onMouseOver={e => {
                                e.currentTarget.style.background = "rgba(191,95,255,0.08)";
                                e.currentTarget.style.borderColor = "rgba(191,95,255,0.3)";
                                e.currentTarget.style.color = "#e2e8f0";
                                e.currentTarget.style.transform = "translateX(4px)";
                                e.currentTarget.style.boxShadow = "0 2px 12px rgba(191,95,255,0.1)";
                              }}
                              onMouseOut={e => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                e.currentTarget.style.color = "#94a3b8";
                                e.currentTarget.style.transform = "translateX(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                              <span style={{ flex: 1, textAlign: "left" }}>{q}</span>
                              <span style={{ color: "#BF5FFF", fontSize: 16, transition: "transform 0.2s" }}>→</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {athenaActiveSession.messages.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {athenaActiveSession.messages.map((m, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                            {m.role === "athena" && (
                              <div style={{ flexShrink: 0, marginTop: 2 }}>
                                <AthenaIcon size={28} />
                              </div>
                            )}
                            <div style={{
                              maxWidth: "75%", padding: "10px 16px", borderRadius: 14, fontSize: 13, lineHeight: 1.6,
                              color: "#e2e8f0",
                              background: m.role === "user" ? "rgba(99,102,241,0.2)" : "rgba(15,20,30,0.8)",
                              border: m.role === "athena" ? "1px solid rgba(191,95,255,0.15)" : "none",
                            }}>
                              {m.content}
                            </div>
                          </div>
                        ))}
                        {athenaThinking && (
                          <div style={{ display: "flex", gap: 10 }}>
                            <div style={{ flexShrink: 0, marginTop: 2 }}><AthenaIcon size={28} /></div>
                            <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "12px 16px", background: "rgba(15,20,30,0.8)", border: "1px solid rgba(191,95,255,0.15)", borderRadius: 14 }}>
                              {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                  width: 6, height: 6, borderRadius: "50%", background: "#BF5FFF",
                                  animation: `athenaPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                                }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Input area */}
                  <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="text"
                        value={athenaInput}
                        onChange={e => setAthenaInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !athenaThinking) sendAthenaMessage(); }}
                        placeholder="Ask Athena about this segment..."
                        style={{
                          flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 12, padding: "12px 16px", color: "#e2e8f0", fontSize: 13,
                          outline: "none", transition: "border-color 0.15s",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(191,95,255,0.3)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                      <button
                        onClick={() => sendAthenaMessage()}
                        disabled={!athenaInput.trim() || athenaThinking}
                        style={{
                          background: (!athenaInput.trim() || athenaThinking) ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #7B2FFF, #BF5FFF)",
                          border: "none", borderRadius: 12, width: 44, height: 44,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: (!athenaInput.trim() || athenaThinking) ? "not-allowed" : "pointer",
                          transition: "all 0.2s", flexShrink: 0,
                          boxShadow: (!athenaInput.trim() || athenaThinking) ? "none" : "0 0 14px rgba(191,95,255,0.4)",
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={(!athenaInput.trim() || athenaThinking) ? "#475569" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>
                    <div style={{
                      fontSize: 10, textAlign: "center", marginTop: 8, fontWeight: 600, letterSpacing: 0.5,
                      background: "linear-gradient(90deg, #00E5FF, #BF5FFF, #FF3CAC)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      opacity: 0.4,
                    }}>
                      Powered by Athena AI
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                  <AthenaIcon size={60} />
                  <div style={{ fontSize: 14, color: "#64748b" }}>Select a chat or start a new one</div>
                  <div style={{ fontSize: 11, color: "#334155" }}>Open Athena from any Feedback Area to begin</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ═══ Minimized Athena Floating Icon ═══════════════════════ */}
      {athenaState === "minimized" && (
        <div
          onClick={() => setAthenaState("open")}
          style={{
            position: "fixed",
            bottom: 24, right: 24,
            width: 56, height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0D1B2A, #070E18)",
            border: "2px solid rgba(191,95,255,0.4)",
            boxShadow: "0 4px 20px rgba(191,95,255,0.3), 0 0 40px rgba(191,95,255,0.1)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2500,
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(191,95,255,0.5), 0 0 50px rgba(191,95,255,0.15)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(191,95,255,0.3), 0 0 40px rgba(191,95,255,0.1)"; }}
        >
          <AthenaIcon size={32} />
          {athenaSessions.length > 0 && (
            <div style={{
              position: "absolute", top: -4, right: -4,
              width: 20, height: 20, borderRadius: "50%",
              background: "#BF5FFF", color: "#fff",
              fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #0b0f14",
            }}>
              {athenaSessions.length}
            </div>
          )}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 2000,
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(30,41,59,0.98)",
          border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.5)" : "rgba(34,197,94,0.3)"}`,
          borderLeft: `3px solid ${toast.type === "error" ? "#ef4444" : "#22c55e"}`,
          borderRadius: 10,
          padding: "12px 18px",
          color: "#f1f5f9",
          fontSize: 13,
          fontWeight: 500,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          maxWidth: 380,
          animation: "slideIn 0.25s ease-out",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 15 }}>{toast.type === "error" ? "⚠️" : "✓"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
