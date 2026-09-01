import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import {
  Activity,
  Droplets,
  Thermometer,
  Compass,
  Calendar,
  Sparkles,
  Info,
  Download
} from "lucide-react";

interface TelemetryHistoryItem {
  date: Date;
  moisture: number;
  temp: number;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface SoilTelemetryD3ChartProps {
  activeFarmName: string;
  baseline: {
    soilMoisture: number;
    soilPh: number;
    temperature: number;
    humidity: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

type MetricType = "moisture" | "temp" | "pH";

export default function SoilTelemetryD3Chart({ activeFarmName, baseline }: SoilTelemetryD3ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("moisture");
  const [hoveredData, setHoveredData] = useState<TelemetryHistoryItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate 30 days of historical data centered around the current active farm baseline
  const historicalData = useMemo<TelemetryHistoryItem[]>(() => {
    const data: TelemetryHistoryItem[] = [];
    const now = new Date();
    
    // Stable pseudo-random generator based on farm name so the pattern is organic but consistent
    let seed = activeFarmName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Dynamic random walks around baseline values
      const moistureWalk = baseline.soilMoisture + (random() - 0.5) * 8 + Math.sin(i / 3) * 5;
      const tempWalk = baseline.temperature + (random() - 0.5) * 4 + Math.cos(i / 4) * 3;
      const pHWalk = baseline.soilPh + (random() - 0.5) * 0.4 + Math.sin(i / 5) * 0.2;
      const nitrogenWalk = baseline.nitrogen + (random() - 0.5) * 6;
      const phosphorusWalk = baseline.phosphorus + (random() - 0.5) * 4;
      const potassiumWalk = baseline.potassium + (random() - 0.5) * 8;

      data.push({
        date,
        moisture: Math.max(10, Math.min(100, Math.round(moistureWalk))),
        temp: Math.max(5, Math.min(50, parseFloat(tempWalk.toFixed(1)))),
        pH: Math.max(3.5, Math.min(10, parseFloat(pHWalk.toFixed(2)))),
        nitrogen: Math.max(10, Math.round(nitrogenWalk)),
        phosphorus: Math.max(10, Math.round(phosphorusWalk)),
        potassium: Math.max(10, Math.round(potassiumWalk))
      });
    }
    return data;
  }, [activeFarmName, baseline]);

  // CSV telemetry exporter for the last 30 days
  const handleExportCSV = () => {
    // Generate header row
    const headers = [
      "Date",
      "Soil Moisture (%)",
      "Temperature (C)",
      "pH Level",
      "Nitrogen (N) mg/kg",
      "Phosphorus (P) mg/kg",
      "Potassium (K) mg/kg"
    ];

    // Generate CSV data rows
    const rows = historicalData.map((item) => [
      item.date.toISOString().split("T")[0],
      item.moisture,
      item.temp,
      item.pH,
      item.nitrogen,
      item.phosphorus,
      item.potassium
    ]);

    // Format CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    // Process download through blob trigger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const safeFarmName = activeFarmName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    link.setAttribute("download", `${safeFarmName}_soil_telemetry_30d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metric-specific metadata helper
  const metricMeta = {
    moisture: {
      label: "Soil Moisture",
      color: "#059669", // Emerald
      bgGradient: ["#10b981", "#34d399", "#a7f3d0"],
      unit: "%",
      icon: <Droplets className="h-4 w-4 text-emerald-600" />
    },
    temp: {
      label: "Soil Temperature",
      color: "#dc2626", // Rose/Red
      bgGradient: ["#f87171", "#fca5a5", "#fee2e2"],
      unit: "°C",
      icon: <Thermometer className="h-4 w-4 text-rose-500" />
    },
    pH: {
      label: "Soil pH Level",
      color: "#d97706", // Amber
      bgGradient: ["#fbbf24", "#fcd34d", "#fef3c7"],
      unit: "",
      icon: <Compass className="h-4 w-4 text-amber-500" />
    }
  }[selectedMetric];

  // Draw chart with D3 inside useEffect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Responsive sizing
    const containerWidth = containerRef.current.clientWidth;
    const height = 240;
    const margin = { top: 20, right: 30, bottom: 40, left: 45 };
    const width = Math.max(320, containerWidth);

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(historicalData, (d: TelemetryHistoryItem) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const getValue = (d: TelemetryHistoryItem) => {
      if (selectedMetric === "moisture") return d.moisture;
      if (selectedMetric === "temp") return d.temp;
      return d.pH;
    };

    const yExtent = d3.extent(historicalData, getValue) as [number, number];
    // Add 10% padding on top and bottom of Y domain for clean aesthetics
    const yPadding = (yExtent[1] - yExtent[0]) || 1;
    const yDomain = [
      Math.max(0, yExtent[0] - yPadding * 0.1),
      yExtent[1] + yPadding * 0.1
    ];

    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([height - margin.bottom, margin.top]);

    // Area Gradient Definition
    const defs = svg.append("defs");
    const gradientId = `gradient-${selectedMetric}`;
    const gradient = defs.append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", metricMeta.color)
      .attr("stop-opacity", 0.45);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", metricMeta.color)
      .attr("stop-opacity", 0.0);

    // Gridlines (Y-axis only)
    const yGrid = d3.axisLeft(yScale)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => "")
      .ticks(5);

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yGrid)
      .style("stroke", "#f1f5f9")
      .style("stroke-opacity", 0.6)
      .style("stroke-dasharray", "3,3");

    // Axes
    const xAxis = d3.axisBottom<Date>(xScale)
      .ticks(6)
      .tickFormat(d3.timeFormat("%b %d"));

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d}${metricMeta.unit}`);

    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", "9px")
      .attr("color", "#94a3b8")
      .selectAll(".tick text")
      .style("font-weight", "bold");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis)
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", "9px")
      .attr("color", "#94a3b8")
      .selectAll(".tick text")
      .style("font-weight", "bold");

    // Area Path
    const areaGenerator = d3.area<TelemetryHistoryItem>()
      .x(d => xScale(d.date))
      .y0(height - margin.bottom)
      .y1(d => yScale(getValue(d)))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(historicalData)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", areaGenerator);

    // Line Path
    const lineGenerator = d3.line<TelemetryHistoryItem>()
      .x(d => xScale(d.date))
      .y(d => yScale(getValue(d)))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(historicalData)
      .attr("fill", "none")
      .attr("stroke", metricMeta.color)
      .attr("stroke-width", 2.5)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("d", lineGenerator);

    // Interaction overlay
    const bisectDate = d3.bisector<TelemetryHistoryItem, Date>((d) => d.date).left;

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const xDate = xScale.invert(mouseX);
        const index = bisectDate(historicalData, xDate, 1);
        const d0 = historicalData[index - 1];
        const d1 = historicalData[index];
        if (!d0 || !d1) return;
        const d = (xDate.getTime() - d0.date.getTime()) > (d1.date.getTime() - xDate.getTime()) ? d1 : d0;

        setHoveredData(d);
        setTooltipPos({
          x: xScale(d.date),
          y: yScale(getValue(d))
        });
      })
      .on("mouseleave", () => {
        setHoveredData(null);
      });

  }, [historicalData, selectedMetric, metricMeta.color, metricMeta.unit]);

  return (
    <div id="d3-soil-telemetry-trends" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Activity className="h-3 w-3 text-emerald-600 animate-pulse" />
            Sensor Chronology Trends
          </span>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            D3.js 30-Day Historical Soil Analytics
          </h3>
          <p className="text-slate-400 text-xs">
            Dynamic timeline mapping the underground vitals of <strong className="text-slate-700 font-bold">{activeFarmName}</strong>.
          </p>
        </div>

        {/* Dynamic Controls & Export Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(["moisture", "temp", "pH"] as MetricType[]).map((metric) => {
              const active = selectedMetric === metric;
              const labels = { moisture: "Moisture", temp: "Soil Temp", pH: "pH Level" };
              return (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {labels[metric]}
                </button>
              );
            })}
          </div>

          <button
            id="btn-export-soil-telemetry-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
            title="Download last 30 days telemetry as CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main D3 Graphic Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden bg-slate-50/50 rounded-xl border border-slate-150 p-2">
        <svg ref={svgRef} className="w-full h-[240px] block" />

        {/* Hover Tooltip Overlay */}
        {hoveredData && (
          <div
            className="absolute bg-slate-900/95 text-white p-3 rounded-lg border border-slate-700/50 shadow-md text-[10px] space-y-1 font-semibold pointer-events-none transition-all z-20"
            style={{
              left: `${Math.max(10, Math.min(tooltipPos.x - 60, (containerRef.current?.clientWidth || 300) - 140))}px`,
              top: `${Math.max(10, tooltipPos.y - 85)}px`
            }}
          >
            <div className="flex items-center gap-1 text-slate-400 border-b border-slate-700/60 pb-1 mb-1 text-[8px] font-mono">
              <Calendar className="h-3 w-3" />
              {hoveredData.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-300">{metricMeta.label}:</span>
              <span className="font-mono font-black text-white text-xs">
                {selectedMetric === "moisture"
                  ? `${hoveredData.moisture}%`
                  : selectedMetric === "temp"
                  ? `${hoveredData.temp}°C`
                  : `${hoveredData.pH}`}
              </span>
            </div>
            <div className="text-[8px] text-slate-400 font-mono pt-1">
              NPK: {hoveredData.nitrogen}N • {hoveredData.phosphorus}P • {hoveredData.potassium}K
            </div>
          </div>
        )}

        {/* Indicator dot */}
        {hoveredData && (
          <div
            className="absolute h-3 w-3 rounded-full border-2 border-white shadow-xs pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2 transition-all"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              backgroundColor: metricMeta.color
            }}
          />
        )}
      </div>

      {/* Footer statistics breakdown summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Droplets className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase block">30D Mean Moisture</span>
            <p className="text-sm font-black text-slate-800">
              {Math.round(historicalData.reduce((acc, d) => acc + d.moisture, 0) / 30)}%
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-lg">
            <Thermometer className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase block">30D Mean Temp</span>
            <p className="text-sm font-black text-slate-800">
              {(historicalData.reduce((acc, d) => acc + d.temp, 0) / 30).toFixed(1)}°C
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Compass className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase block">30D pH Stability</span>
            <p className="text-sm font-black text-slate-800">
              {(historicalData.reduce((acc, d) => acc + d.pH, 0) / 30).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
