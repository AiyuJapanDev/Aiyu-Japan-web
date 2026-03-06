import React from "react";
import { getAvailableUpsBoxes } from "@/lib/shippingUtils";
import { useApp } from "@/contexts/AppContext";

interface UpsBoxSelectorProps {
  weightGrams: number;
  selectedBox: string | null;
  onSelectBox: (boxId: string | null) => void;
  totalDimensionsSum?: number;
}

export default function UpsBoxSelector({
  weightGrams,
  selectedBox,
  onSelectBox,
  totalDimensionsSum,
}: UpsBoxSelectorProps) {
  const { t } = useApp();
  const boxes = getAvailableUpsBoxes(weightGrams, totalDimensionsSum);

  // Map box sizes to visual icon sizes for better UX
  const boxSizes: Record<string, number> = {
    s60: 48,
    s80: 56,
    s100: 64,
    s120: 72,
    s140: 80,
    s160: 88,
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>
          {t("upsSelectBox")}
        </div>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
        gap: "12px",
        width: "100%"
      }}>
        {boxes.map((box) => {
          const isSel = selectedBox === box.id;
          const isDisabled = !box.enabled;
          const iconSize = boxSizes[box.id] || 64;
          
          return (
            <button
              key={box.id}
              onClick={() => !isDisabled && onSelectBox(isSel ? null : box.id)}
              disabled={isDisabled}
              style={{
                background: isSel ? "#f0fdfe" : "#fff",
                border: isSel ? "2px solid #26c6da" : "1.5px solid #e2e8f0",
                borderRadius: "14px",
                padding: "14px 14px 14px 12px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "12px",
                boxShadow: isSel
                  ? "0 4px 18px rgba(38,198,218,0.14)"
                  : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.16s ease",
                position: "relative",
                outline: "none",
                width: "100%",
                opacity: isDisabled ? 0.5 : 1,
                filter: isDisabled ? "grayscale(0.8)" : "none",
              }}
            >
              {/* Radio */}
              <div style={{
                position: "absolute", top: "10px", left: "10px",
                width: "16px", height: "16px", borderRadius: "50%",
                border: isSel ? "2px solid #26c6da" : "1.5px solid #c0cad6",
                background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {isSel && <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#26c6da" }}/>}
              </div>

              {/* Badge */}
              <div style={{
                position: "absolute", top: "10px", right: "10px",
                background: isDisabled ? "#cbd5e1" : box.tag,
                color: "#fff",
                fontSize: "10px",
                fontWeight: "800",
                borderRadius: "50%",
                width: "26px", height: "26px",
                display: "flex", alignItems: "center", justifyContent: "center",
                letterSpacing: "-0.02em",
                fontFamily: "inherit",
              }}>
                {box.label.replace("Size ", "")}
              </div>

              {/* Icon */}
              <div style={{ 
                flexShrink: 0, 
                marginTop: "4px", 
                marginLeft: "2px",
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none">
                  {/* Person */}
                  <circle cx="20" cy="12" r="7" fill="#26c6da"/>
                  <rect x="13" y="20" width="14" height="18" rx="4" fill="#26c6da"/>
                  <rect x="6" y="21" width="7" height="5" rx="2.5" fill="#26c6da"/>
                  <rect x="27" y="21" width="9" height="5" rx="2.5" fill="#26c6da"/>
                  <rect x="14" y="36" width="5" height="13" rx="2.5" fill="#26c6da"/>
                  <rect x="21" y="36" width="5" height="13" rx="2.5" fill="#26c6da"/>

                  {/* Box */}
                  <rect x="30" y="26" width="28" height="24" rx="2" fill="#d4956a"/>
                  <rect x="30" y="20" width="28" height="8" rx="2" fill="#e8b48a"/>
                  <rect x="43" y="20" width="3" height="30" fill="#c07a4a" opacity="0.5"/>
                  <rect x="30" y="35" width="28" height="3" fill="#c07a4a" opacity="0.5"/>
                  <rect x="56" y="22" width="3" height="28" rx="1" fill="#b8663a" opacity="0.4"/>
                  <ellipse cx="44" cy="52" rx="14" ry="2.5" fill="rgba(0,0,0,0.08)"/>
                </svg>
              </div>

              {/* Text */}
              <div style={{ flex: 1, paddingRight: "20px" }}>
                <div style={{
                  fontSize: "15px", fontWeight: "800", color: "#000",
                  letterSpacing: "-0.02em", marginBottom: "4px",
                }}>{t(`upsSize${box.id.substring(1)}` as any)}</div>

                <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.6" }}>
                  {t("dimensionsLabel") || "Dimensions"} (L+W+H)<br/>
                  {box.dim}<br/>
                  {t("weight")} Máx: {box.maxWeightKg} kg
                </div>

                <div style={{
                  marginTop: "8px",
                  fontSize: "17px", fontWeight: "800",
                  color: "#0f172a", letterSpacing: "-0.02em",
                }}>
                  {box.price.toLocaleString()} <span style={{ fontSize: "15px" }}>¥</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {boxes.every(b => !b.enabled) && (
        <div style={{ 
          padding: "12px", 
          background: "#fef2f2", 
          border: "1px solid #fecaca", 
          borderRadius: "12px",
          color: "#991b1b",
          fontSize: "13px",
          textAlign: "center",
          fontWeight: "600"
        }}>
          {t("upsWeightExceeds")}
        </div>
      )}
    </div>
  );
}
