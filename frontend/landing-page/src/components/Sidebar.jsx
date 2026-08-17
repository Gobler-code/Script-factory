import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { API_BASE_URL } from "./config";

const linkBase =
  "font-mono text-xs tracking-[0.14em] uppercase px-3 py-2.5 sm:py-2 rounded transition-colors block min-h-[44px] sm:min-h-0 flex items-center";
const linkActive = "bg-[#f3f1ea]/10 text-[#f3f1ea]";
const linkInactive = "text-[#8f8c82] hover:text-[#f3f1ea]";

function groupHistory(history) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
  };

  const older = {};

  history.forEach((item) => {
    const d = new Date(item.created_at);

    if (d >= startOfToday) {
      groups.Today.push(item);
    } else if (d >= startOfYesterday) {
      groups.Yesterday.push(item);
    } else if (d >= sevenDaysAgo) {
      groups["Previous 7 Days"].push(item);
    } else {
      const label = d.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });

      (older[label] ??= []).push(item);
    }
  });

  return Object.fromEntries(
    [...Object.entries(groups), ...Object.entries(older)].filter(
      ([, items]) => items.length
    )
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get history from HistoryContext
  const { history, refreshHistory } = useHistory();

  const navigate = useNavigate();
  const location = useLocation();

  const activeId = location.state?.loadedScript?.id;

  async function openScript(id) {
    setMobileOpen(false);
    const res = await fetch(`${API_BASE_URL}/scripts/${id}`);

    if (!res.ok) return;

    const data = await res.json();

    navigate("/", {
      state: {
        loadedScript: data,
      },
    });
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!window.confirm("Delete this script? This can't be undone.")) return;
    await fetch(`${API_BASE_URL}/scripts/${id}`, { method: "DELETE" });
    refreshHistory();
  }
  const grouped = groupHistory(history);

  return (
    <>
      {/* Mobile Sticky Header Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a09] border-b border-[#f3f1ea]/10 sticky top-0 z-40 w-full">
        <NavLink
          to="/"
          end
          onClick={() => setMobileOpen(false)}
          className="font-serif italic text-[#f3f1ea] text-lg leading-none"
        >
          Script Factory
        </NavLink>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#f3f1ea]/80 hover:text-[#f3f1ea]"
        >
          <span className="font-mono text-base">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 bg-[#0a0a09] border-r border-[#f3f1ea]/10 px-3 py-6 flex flex-col gap-8 transition-transform duration-300 ease-in-out w-72
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 ${collapsed ? "lg:w-16" : "lg:w-64"} lg:shrink-0 lg:min-h-screen
        `}
      >
        <div className="flex items-center justify-between px-1">
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className="font-serif italic text-[#f3f1ea] text-lg leading-none"
          >
            {collapsed ? "SF" : "Script Factory"}
          </NavLink>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:block font-mono text-xs text-[#55534c] hover:text-[#f3f1ea] transition-colors px-1"
            >
              {collapsed ? "›" : "‹"}
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
              className="lg:hidden font-mono text-xs text-[#55534c] hover:text-[#f3f1ea] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setMobileOpen(false);
            navigate("/", { state: { reset: true } });
          }}
          className="font-mono text-xs tracking-[0.14em] uppercase text-[#f3f1ea] border border-[#f3f1ea]/20 rounded px-3 py-2.5 sm:py-2 text-center hover:bg-[#f3f1ea]/5 transition-colors whitespace-nowrap overflow-hidden min-h-[44px] sm:min-h-0 flex items-center justify-center"
        >
          {collapsed ? "+" : "+ New Script"}
        </button>

        <nav className="flex flex-col gap-1">
          {!collapsed && (
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#55534c] px-3 mb-1">
              Tools
            </span>
          )}

          <NavLink
            to="/captions"
            title="Captions"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? linkActive : linkInactive
              } ${collapsed ? "text-center justify-center" : ""}`
            }
          >
            {collapsed ? "C" : "Captions"}
          </NavLink>

          <NavLink
            to="/voiceover"
            title="Voiceover"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? linkActive : linkInactive
              } ${collapsed ? "text-center justify-center" : ""}`
            }
          >
            {collapsed ? "V" : "Voiceover"}
          </NavLink>
        </nav>

        {!collapsed && (
          <nav className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
            {Object.keys(grouped).length === 0 && (
              <span className="font-mono text-[11px] text-[#55534c] px-3">
                No scripts yet
              </span>
            )}

            {Object.entries(grouped).map(([label, items]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#55534c] px-3 mb-1">
                  {label}
                </span>

                {items.map((s) => (
                  <div key={s.id} className="group flex items-center gap-1">
                    <button
                      onClick={() => openScript(s.id)}
                      title={s.topic}
                      className={`flex-1 text-left text-[13px] px-3 py-2 sm:py-1.5 rounded truncate transition-colors min-h-[40px] sm:min-h-0 flex items-center ${
                        s.id === activeId
                          ? "bg-[#f3f1ea]/10 text-[#f3f1ea]"
                          : "text-[#8f8c82] hover:text-[#f3f1ea] hover:bg-[#f3f1ea]/5"
                      }`}
                    >
                      <span className="truncate">{s.topic}</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, s.id)}
                      aria-label="Delete script"
                      className="opacity-100 lg:opacity-0 group-hover:opacity-100 text-[#55534c] hover:text-[#d6a89a] text-xs px-2 py-2 min-h-[40px] sm:min-h-0 flex items-center justify-center transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </nav>
        )}
      </aside>
    </>
  );
}