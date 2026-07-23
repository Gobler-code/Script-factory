import { useState } from "react";
import { NavLink } from "react-router-dom";

const linkBase = "font-mono text-xs tracking-[0.14em] uppercase px-3 py-2 rounded transition-colors block";
const linkActive = "bg-[#f3f1ea]/10 text-[#f3f1ea]";
const linkInactive = "text-[#8f8c82] hover:text-[#f3f1ea]";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-56"} shrink-0 border-r border-[#f3f1ea]/10 bg-[#0a0a09] min-h-screen px-3 py-6 flex flex-col gap-8 transition-all duration-200`}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-1">
        <NavLink to="/" end className="font-serif italic text-[#f3f1ea] text-lg leading-none">
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
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive} ${collapsed ? "text-center" : ""}`}
        >
          {collapsed ? "C" : "Captions"}
        </NavLink>
        <NavLink
          to="/voiceover"
          title="Voiceover"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive} ${collapsed ? "text-center" : ""}`}
        >
          {collapsed ? "V" : "Voiceover"}
        </NavLink>
      </nav>
    </aside>
  );
}