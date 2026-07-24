import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";

const linkBase =
  "font-mono text-xs tracking-[0.14em] uppercase px-3 py-2 rounded transition-colors block";
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

  // Get history from HistoryContext
  const { history } = useHistory();

  const navigate = useNavigate();
  const location = useLocation();

  const activeId = location.state?.loadedScript?.id;

  async function openScript(id) {
    const res = await fetch(`http://127.0.0.1:8000/scripts/${id}`);

    if (!res.ok) return;

    const data = await res.json();

    navigate("/", {
      state: {
        loadedScript: data,
      },
    });
  }

  const grouped = groupHistory(history);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } shrink-0 border-r border-[#f3f1ea]/10 bg-[#0a0a09] min-h-screen px-3 py-6 flex flex-col gap-8 transition-all duration-200`}
    >
      <div className="flex items-center justify-between px-1">
        <NavLink
          to="/"
          end
          className="font-serif italic text-[#f3f1ea] text-lg leading-none"
        >
          {collapsed ? "SF" : "Script Factory"}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="font-mono text-xs text-[#55534c] hover:text-[#f3f1ea] transition-colors px-1"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <NavLink
        to="/"
        end
        className="font-mono text-xs tracking-[0.14em] uppercase text-[#f3f1ea] border border-[#f3f1ea]/20 rounded px-3 py-2 text-center hover:bg-[#f3f1ea]/5 transition-colors whitespace-nowrap overflow-hidden"
      >
        {collapsed ? "+" : "+ New Script"}
      </NavLink>

      <nav className="flex flex-col gap-1">
        {!collapsed && (
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#55534c] px-3 mb-1">
            Tools
          </span>
        )}

        <NavLink
          to="/captions"
          title="Captions"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? linkActive : linkInactive
            } ${collapsed ? "text-center" : ""}`
          }
        >
          {collapsed ? "C" : "Captions"}
        </NavLink>

        <NavLink
          to="/voiceover"
          title="Voiceover"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? linkActive : linkInactive
            } ${collapsed ? "text-center" : ""}`
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
                <button
                  key={s.id}
                  onClick={() => openScript(s.id)}
                  title={s.topic}
                  className={`text-left text-[13px] px-3 py-1.5 rounded truncate transition-colors ${
                    s.id === activeId
                      ? "bg-[#f3f1ea]/10 text-[#f3f1ea]"
                      : "text-[#8f8c82] hover:text-[#f3f1ea] hover:bg-[#f3f1ea]/5"
                  }`}
                >
                  {s.topic}
                </button>
              ))}
            </div>
          ))}
        </nav>
      )}
    </aside>
  );
}