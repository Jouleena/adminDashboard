import React, { useMemo, useRef, useState, useEffect } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

export default function WheelTimePicker({
  value = new Date(),
  onChange = () => {},
  height = 200,
  rowHeight = 40,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [h, setH] = useState(value.getHours());
  const [m, setM] = useState(value.getMinutes());
  const [s, setS] = useState(value.getSeconds());

  
  const [editing, setEditing] = useState(null); 

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const mins = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const secs = mins;

  const hRef = useRef(null);
  const mRef = useRef(null);
  const sRef = useRef(null);
  const scrollTimer = useRef(null);

  
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  
  const formatTime = (hh = h, mm = m, ss = s) =>
    `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(
      2,
      "0"
    )}`;

  
  const scrollToIndex = (ref, idx, smooth = false) => {
    if (!ref?.current) return;
    const top = idx * rowHeight;
    ref.current.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  
  const getRef = (unit) => (unit === "h" ? hRef : unit === "m" ? mRef : sRef);

  
  useEffect(() => {
    setH(value.getHours());
    setM(value.getMinutes());
    setS(value.getSeconds());
    
    scrollToIndex(hRef, value.getHours(), false);
    scrollToIndex(mRef, value.getMinutes(), false);
    scrollToIndex(sRef, value.getSeconds(), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  
  const nearestIndex = (scrollTop, maxIdx) =>
    clamp(Math.round(scrollTop / rowHeight), 0, maxIdx);

  
  const handleScroll = (unit, maxIdx) => (e) => {
    const idx = nearestIndex(e.currentTarget.scrollTop, maxIdx);

    if (unit === "h") setH(idx);
    if (unit === "m") setM(idx);
    if (unit === "s") setS(idx);

    
    clearTimeout(scrollTimer.current);

    if (editing && editing.unit === unit) {
      return;
    }

    scrollTimer.current = setTimeout(() => {
      const ref = getRef(unit);
      scrollToIndex(ref, idx, false); 
      
      const hh = unit === "h" ? idx : h;
      const mm = unit === "m" ? idx : m;
      const ss = unit === "s" ? idx : s;
      onChange?.(formatTime(hh, mm, ss));
    }, 110);
  };

  
  const handleClickItem = (unit, n) => {
    const ref = getRef(unit);
    setEditing({ unit, value: n });
    if (unit === "h") setH(n);
    if (unit === "m") setM(n);
    if (unit === "s") setS(n);
    scrollToIndex(ref, n, true);
    onChange?.(formatTime(unit === "h" ? n : h, unit === "m" ? n : m, unit === "s" ? n : s));
  };

  const commitEditing = () => {
    if (!editing) return;
    const { unit, value } = editing;
    const ref = getRef(unit);
    const val = clamp(Number.isFinite(+value) ? +value : 0, 0, unit === "h" ? 23 : 59);

   
    if (unit === "h") setH(val);
    if (unit === "m") setM(val);
    if (unit === "s") setS(val);

    
    
    setEditing(null);

    
    scrollToIndex(ref, val, false);
    onChange?.(
      formatTime(unit === "h" ? val : h, unit === "m" ? val : m, unit === "s" ? val : s)
    );
  };


  const colStyle = {
    position: "relative",
    width: 80,
    height,
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
    paddingTop: `${(height - rowHeight) / 2}px`,
    paddingBottom: `${(height - rowHeight) / 2}px`,
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, rgba(245, 5, 5, 0.04), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.04))",
  };

  const listStyle = { margin: 0, padding: 0, listStyle: "none" };
  const itemStyle = {
    height: rowHeight,
    lineHeight: `${rowHeight}px`,
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
    cursor: "pointer",
    userSelect: "none",
  };

  const labelStyle = {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    marginBottom: 8,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  const CenterLine = () => (
    <div
      style={{
        pointerEvents: "none",
        position: "absolute",
        left: 0,
        right: 0,
        top: (height - rowHeight) / 2,
        height: rowHeight,
        borderTop: `2px solid ${colors.blueAccent[400]}`,
        borderBottom: `2px solid ${colors.blueAccent[400]}`,
        boxShadow: "inset 0 0 12px rgba(25,118,210,0.08)",
        borderRadius: 12,
      }}
    />
  );

  const renderList = (arr, ref, unit, selected) => (
    <div style={{ position: "relative" }}>
      <div
        style={colStyle}
        ref={ref}
        onScroll={handleScroll(unit, arr.length - 1)}
      >
        <ul style={listStyle}>
          {arr.map((n) => {
            const isEditing = editing && editing.unit === unit && editing.value === n;
            const isSelected = n === selected;
            return (
              <li
                key={`${unit}-${n}`}
                style={{
                  ...itemStyle,
                  opacity: isSelected ? 1 : 0.55,
                  transform: isSelected ? "scale(1.06)" : "scale(1)",
                  transition: "transform 120ms ease, opacity 120ms ease",
                  position: "relative",
                }}
                onClick={() => handleClickItem(unit, n)}
              >
                {isEditing ? (
                  <input
                    //type="number"
                    min={0}
                    max={unit === "h" ? 23 : 59}
                    autoFocus
                    value={editing.value}
                    onChange={(e) => {
                      let val = parseInt(e.target.value, 10);
                      if (Number.isNaN(val)) val = 0;
                      val = clamp(val, 0, unit === "h" ? 23 : 59);

                      setEditing((prev) => (prev ? { ...prev, value: val } : { unit, value: val }));

                      if (unit === "h") setH(val);
                      if (unit === "m") setM(val);
                      if (unit === "s") setS(val);

                      
                      const refLocal = getRef(unit);
                      scrollToIndex(refLocal, val, false);
                    }}
                    onBlur={commitEditing}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                      color:`${colors.primary[100]}`,
                      fontWeight: 600,
                      fontSize: 16,
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      cursor: "text",
                    }}
                  />
                ) : (
                  String(n).padStart(2, "0")
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <CenterLine />
    </div>
  );

  
  const displayDate = new Date();
  displayDate.setHours(h, m, s, 0);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
        borderRadius: 24,
        background: `${colors.primary[500]}`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <div style={labelStyle}>Hours</div>
          {renderList(hours, hRef, "h", h)}
        </div>
        <div>
          <div style={labelStyle}>Minutes</div>
          {renderList(mins, mRef, "m", m)}
        </div>
        <div>
          <div style={labelStyle}>Seconds</div>
          {renderList(secs, sRef, "s", s)}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontWeight: 700 }}>
        {displayDate.toLocaleTimeString()}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <button
          onClick={() => {
            const now = new Date();
            const hh = now.getHours();
            const mm = now.getMinutes();
            const ss = now.getSeconds();
            setH(hh);
            setM(mm);
            setS(ss);
            setEditing(null);
            scrollToIndex(hRef, hh, false);
            scrollToIndex(mRef, mm, false);
            scrollToIndex(sRef, ss, false);
            onChange?.(formatTime(hh, mm, ss));
          }}
          style={{
            padding: "10px 16px",
            borderRadius: 3,
            border: "none",
            textAlign: "center",
            fontSize: "12px",
            background: `${colors.blueAccent[400]}`,
            boxShadow: "inset 0 0 12px rgba(25,118,210,0.08)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          NOW
        </button>
      </div>
    </div>
  );
}
