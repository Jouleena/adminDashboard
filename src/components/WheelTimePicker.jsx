import React, { useMemo, useRef, useState, useEffect } from "react";
//*this function returns the date as an object,
//  in order to send it to server you need to cut the time only from it,
//  and send it as string*//
export default function WheelTimePicker({
  value = new Date(),
  onChange = () => {},
  height = 200,      
  rowHeight = 40,    
}) {
  const [time, setTime] = useState(value);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const mins  = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const secs  = mins;

  const hRef = useRef(null);
  const mRef = useRef(null);
  const sRef = useRef(null);


  const scrollToIndex = (ref, idx) => {
    if (!ref.current) return;
    const top = idx * rowHeight;
    ref.current.scrollTo({ top, behavior: "smooth" });
  };

 
  useEffect(() => {
    scrollToIndex(hRef, time.getHours());
    scrollToIndex(mRef, time.getMinutes());
    scrollToIndex(sRef, time.getSeconds());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const nearestIndex = (scrollTop) => Math.round(scrollTop / rowHeight);

  
  const handleScroll = (unit) => (e) => {
    const idx = nearestIndex(e.currentTarget.scrollTop);
    const t = new Date(time);
    if (unit === "h") t.setHours(idx);
    if (unit === "m") t.setMinutes(idx);
    if (unit === "s") t.setSeconds(idx);
    setTime(t);
  };

 
  let scrollTimeout;
  const handleScrollEnd = (ref, unit) => () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = nearestIndex(el.scrollTop);
      scrollToIndex(ref, idx);
      const t = new Date(time);
      if (unit === "h") t.setHours(idx);
      if (unit === "m") t.setMinutes(idx);
      if (unit === "s") t.setSeconds(idx);
      setTime(t);
      onChange?.(t);
    }, 100);
  };

  
  const handleClickItem = (ref, unit, idx) => () => {
    scrollToIndex(ref, idx);
    const t = new Date(time);
    if (unit === "h") t.setHours(idx);
    if (unit === "m") t.setMinutes(idx);
    if (unit === "s") t.setSeconds(idx);
    setTime(t);
    onChange?.(t);
  };

  const colStyle = {
    position: "relative",
    width: 80,
    height,
    overflowY: "auto",
    scrollSnapType: "y mandatory",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
    paddingTop: `${(height - rowHeight) / 2}px`,
    paddingBottom: `${(height - rowHeight) / 2}px`,
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.04))",
  };

  const listStyle = { margin: 0, padding: 0, listStyle: "none" };
  const itemStyle = {
    height: rowHeight,
    lineHeight: `${rowHeight}px`,
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
    scrollSnapAlign: "center",
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
        borderTop: "2px solid #1976d2",
        borderBottom: "2px solid #1976d2",
        boxShadow: "inset 0 0 12px rgba(25,118,210,0.08)",
        borderRadius: 12,
      }}
    />
  );

//** */
  const renderList = (arr, ref, unit, selected) => (
    <div style={{ position: "relative" }}>
        <div style={colStyle}
           ref={ref}
           onScroll={handleScroll(unit)}
           onWheel={handleScrollEnd(ref, unit)}
           onTouchEnd={handleScrollEnd(ref, unit)}
           onMouseUp={handleScrollEnd(ref, unit)}>
        <ul style={listStyle}>
          {arr.map((n) => (
            <li
              key={n}
              style={{
                ...itemStyle,
                opacity: n === selected ? 1 : 0.55,
                transform: n === selected ? "scale(1.06)" : "scale(1)",
                transition: "transform 120ms ease, opacity 120ms ease",
              }}
              onClick={handleClickItem(ref, unit, n)}
            >
              {String(n).padStart(2, "0")}
            </li>
          ))}
        </ul>
      </div>
      <CenterLine />
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
        borderRadius: 24,
        background:
          "linear-gradient(145deg, rgba(33,150,243,0.06), rgba(33,203,243,0.06))",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <div style={labelStyle}>Hours</div>
          {renderList(hours, hRef, "h", time.getHours())}
        </div>
        <div>
          <div style={labelStyle}>Minutes</div>
          {renderList(mins, mRef, "m", time.getMinutes())}
        </div>
        <div>
          <div style={labelStyle}>Seconds</div>
          {renderList(secs, sRef, "s", time.getSeconds())}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontWeight: 700 }}>
        {time.toLocaleTimeString()}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
        <button
          onClick={() => {
            const t = new Date();
            setTime(t);
            onChange?.(t);
            scrollToIndex(hRef, t.getHours());
            scrollToIndex(mRef, t.getMinutes());
            scrollToIndex(sRef, t.getSeconds());
          }}
          style={{
            padding: "8px 14px",
            borderRadius: 12,
            border: "none",
            fontWeight: 700,
            background:
              "linear-gradient(135deg, #2196f3, #21cbf3)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Now
        </button>
        <button
          onClick={() => onChange?.(time)}
          style={{
            padding: "8px 14px",
            borderRadius: 12,
            border: "1px solid #1976d2",
            background: "#fff",
            color: "#1976d2",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}