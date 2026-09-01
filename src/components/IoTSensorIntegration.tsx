import React, { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  Bell,
  Sliders,
  History,
  Zap,
  Battery,
  Download,
  Power,
  RefreshCw,
  TrendingUp,
  Settings,
  HelpCircle,
  Clock,
  Sparkles,
  Database,
  Smartphone,
  Gauge,
  MapPin,
  Trash2
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";

// ==========================================
// TYPES & DATA STRUCTURES FOR IoT SENSORS
// ==========================================
interface SensorNode {
  id: string;
  name: string;
  type: "soil_moisture" | "temperature" | "humidity" | "water_level" | "light_intensity" | "wind_speed" | "rain_gauge";
  label: string;
  currentValue: number;
  unit: string;
  battery: number; // %
  signalStrength: number; // dBm (-100 to -30)
  status: "Optimal" | "Degraded" | "Maintenance Required" | "Offline";
  lastCalibration: string;
  location: string;
  solarPanelVoltage: number; // Volts
  energyConsumptionWh: number; // watt-hours per day
  predictiveAlert: string | null;
  x?: number; // visual percent offset from left
  y?: number; // visual percent offset from top
}

interface AlertLog {
  id: string;
  timestamp: string;
  sensorLabel: string;
  sensorType: string;
  severity: "info" | "warning" | "critical";
  message: string;
  resolved: boolean;
}

interface HistoricDataPoint {
  time: string;
  soil_moisture: number;
  temperature: number;
  humidity: number;
  water_level: number;
  light_intensity: number;
  wind_speed: number;
  rain_gauge: number;
  solar_generation: number;
  pump_consumption: number;
}

// Generate high-fidelity simulated historic data correlating weather features
const generateHistoricData = (): HistoricDataPoint[] => {
  const data: HistoricDataPoint[] = [];
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hr = (8 + i) % 24;
    return `${hr.toString().padStart(2, "0")}:00`;
  });

  hours.forEach((time, index) => {
    // Diurnal temperature cycle: peaks around 14:00 (2 PM), coolest around 05:00
    const hourVal = (8 + index) % 24;
    const tempFactor = Math.sin(((hourVal - 8) / 24) * 2 * Math.PI - Math.PI / 2);
    const temperature = parseFloat((26 + tempFactor * 8 + Math.random() * 0.8).toFixed(1));

    // Humidity inversely correlates with temperature
    const humidity = parseFloat((65 - tempFactor * 20 + Math.random() * 2).toFixed(1));

    // Light peaks at noon
    const lightFactor = hourVal >= 6 && hourVal <= 18 ? Math.sin(((hourVal - 6) / 12) * Math.PI) : 0;
    const lightIntensity = Math.round(lightFactor * 85000 + (lightFactor > 0 ? Math.random() * 2000 : 0));

    // Wind speed slightly higher in afternoon
    const windSpeed = parseFloat((6 + Math.max(0, tempFactor) * 12 + Math.random() * 1.5).toFixed(1));

    // Rain gauge (let's simulate a rain event between 16:00 and 18:00)
    let rain_gauge = 0;
    if (hourVal >= 16 && hourVal <= 18) {
      rain_gauge = parseFloat((Math.sin(((hourVal - 16) / 2) * Math.PI) * 4.2 + Math.random() * 0.5).toFixed(1));
    }

    // Soil moisture increases with rain, decreases with temperature/evaporation
    let soil_moisture = 45;
    if (hourVal < 16) {
      soil_moisture = parseFloat((48 - (index * 0.3) + Math.random() * 0.2).toFixed(1));
    } else {
      soil_moisture = parseFloat((45 + rain_gauge * 4 + Math.random() * 0.5).toFixed(1));
    }

    // Water level (water reservoir)
    const water_level = parseFloat((72 - (index * 0.15) + (rain_gauge * 1.5)).toFixed(1));

    // Solar panel generation tracking
    const solar_generation = parseFloat((lightIntensity * 0.0025 * (1 - temperature * 0.004)).toFixed(1));

    // Pump consumption: active when soil moisture < 42% (simulating automatic pump run)
    const pump_consumption = soil_moisture < 42 ? 350 : 0;

    data.push({
      time,
      soil_moisture,
      temperature,
      humidity,
      water_level,
      light_intensity: lightIntensity,
      wind_speed: windSpeed,
      rain_gauge,
      solar_generation,
      pump_consumption
    });
  });

  return data;
};

export default function IoTSensorIntegration() {
  // --- STATE ---
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [historicData, setHistoricData] = useState<HistoricDataPoint[]>([]);
  const [activeChartSensor, setActiveChartSensor] = useState<keyof HistoricDataPoint>("soil_moisture");
  const [activeTab, setActiveTab] = useState<"realtime" | "irrigation" | "solar" | "correlation" | "placement">("realtime");
  
  // Threshold States
  const [thresholds, setThresholds] = useState({
    soil_moisture: { min: 35, max: 75 },
    temperature: { min: 10, max: 38 },
    humidity: { min: 20, max: 90 },
    water_level: { min: 25, max: 95 },
    light_intensity: { min: 100, max: 90000 },
    wind_speed: { min: 0, max: 45 },
    rain_gauge: { min: 0, max: 15 }
  });

  // SMS and Push Notification Settings
  const [enableSMSAlerts, setEnableSMSAlerts] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState<string>("+1 (555) 438-2747");
  const [notifications, setNotifications] = useState<AlertLog[]>([
    { id: "alert-1", timestamp: "10 mins ago", sensorLabel: "Soil Moisture Node B", sensorType: "soil_moisture", severity: "critical", message: "Soil moisture dropped to 31.4% (Threshold: 35.0% min)", resolved: false },
    { id: "alert-2", timestamp: "1 hour ago", sensorLabel: "South Water Reservoir", sensorType: "water_level", severity: "warning", message: "Water level approaching warning low limit: 24.8%", resolved: false },
    { id: "alert-3", timestamp: "5 hours ago", sensorLabel: "Greenhouse Temp Node", sensorType: "temperature", severity: "info", message: "Temperature spike of 39.2°C detected. Cooling actuators scheduled.", resolved: true }
  ]);

  // Irrigation Controller States
  const [pumpMode, setPumpMode] = useState<"auto" | "manual">("auto");
  const [pumpState, setPumpState] = useState<"on" | "off">("off");
  const [pumpFlowRate, setPumpFlowRate] = useState<number>(0); // Liters/min
  const [manualTriggerDuration, setManualTriggerDuration] = useState<number>(15); // minutes

  // Interactive Node Placer Map States
  const [newNodeName, setNewNodeName] = useState<string>("");
  const [newNodeType, setNewNodeType] = useState<SensorNode["type"]>("soil_moisture");
  const [newNodeLocation, setNewNodeLocation] = useState<string>("Block C (Maize Field)");
  const [newNodeX, setNewNodeX] = useState<number>(50);
  const [newNodeY, setNewNodeY] = useState<number>(50);
  const [newNodeValue, setNewNodeValue] = useState<number>(45);
  const [selectedMapNodeId, setSelectedMapNodeId] = useState<string | null>("sens-1");

  // --- INITIALIZATION & REAL-TIME SIMULATION ---
  useEffect(() => {
    // Preseed Sensors
    const initialSensors: SensorNode[] = [
      {
        id: "sens-1",
        name: "Soil Moisture Node B",
        type: "soil_moisture",
        label: "Soil Moisture Probe",
        currentValue: 38.4,
        unit: "% VWC",
        battery: 84,
        signalStrength: -58,
        status: "Optimal",
        lastCalibration: "2026-06-15",
        location: "Block C (Maize Field)",
        solarPanelVoltage: 3.4,
        energyConsumptionWh: 1.2,
        predictiveAlert: null,
        x: 35,
        y: 65
      },
      {
        id: "sens-2",
        name: "North Canopy Air Station",
        type: "temperature",
        label: "Ambient Temperature",
        currentValue: 31.8,
        unit: "°C",
        battery: 92,
        signalStrength: -42,
        status: "Optimal",
        lastCalibration: "2026-05-10",
        location: "North Pivot Point",
        solarPanelVoltage: 5.8,
        energyConsumptionWh: 2.4,
        predictiveAlert: null,
        x: 50,
        y: 20
      },
      {
        id: "sens-3",
        name: "South Canopy Humidity Sensor",
        type: "humidity",
        label: "Relative Humidity",
        currentValue: 54.2,
        unit: "% RH",
        battery: 18,
        signalStrength: -78,
        status: "Degraded",
        lastCalibration: "2026-02-12",
        location: "South Block Orchard",
        solarPanelVoltage: 1.1,
        energyConsumptionWh: 2.1,
        predictiveAlert: "Voltage drift detected. Lithium ion battery requires replacement within 14 days.",
        x: 75,
        y: 80
      },
      {
        id: "sens-4",
        name: "South Water Reservoir",
        type: "water_level",
        label: "Reservoir Water Level",
        currentValue: 71.5,
        unit: "% Depth",
        battery: 65,
        signalStrength: -65,
        status: "Optimal",
        lastCalibration: "2026-06-01",
        location: "Water Supply Intake",
        solarPanelVoltage: 4.2,
        energyConsumptionWh: 3.8,
        predictiveAlert: null,
        x: 80,
        y: 40
      },
      {
        id: "sens-5",
        name: "Spectral Sun Tracker",
        type: "light_intensity",
        label: "Solar Pyranometer",
        currentValue: 68400,
        unit: "Lux",
        battery: 100,
        signalStrength: -38,
        status: "Optimal",
        lastCalibration: "2026-04-18",
        location: "Central Meteorological Tower",
        solarPanelVoltage: 12.6,
        energyConsumptionWh: 4.5,
        predictiveAlert: null,
        x: 20,
        y: 30
      },
      {
        id: "sens-6",
        name: "Anemometer Node",
        type: "wind_speed",
        label: "Acoustic Wind Speed",
        currentValue: 12.4,
        unit: "km/h",
        battery: 45,
        signalStrength: -82,
        status: "Maintenance Required",
        lastCalibration: "2025-11-04",
        location: "Ridge West Slope",
        solarPanelVoltage: 2.5,
        energyConsumptionWh: 5.2,
        predictiveAlert: "Bearing drag detected. High energy friction peaks. Requires ultrasonic lubrication audit.",
        x: 15,
        y: 75
      },
      {
        id: "sens-7",
        name: "Tipping Bucket Gauge",
        type: "rain_gauge",
        label: "Precipitation Gauge",
        currentValue: 0.0,
        unit: "mm/hr",
        battery: 79,
        signalStrength: -61,
        status: "Optimal",
        lastCalibration: "2026-03-22",
        location: "Central Meteorological Tower",
        solarPanelVoltage: 4.8,
        energyConsumptionWh: 1.0,
        predictiveAlert: null,
        x: 48,
        y: 48
      }
    ];

    setSensors(initialSensors);
    setHistoricData(generateHistoricData());
  }, []);

  // Live telemetry fluctuating every few seconds
  useEffect(() => {
    const timer = setInterval(() => {
      // Create variables to store updates that we will apply AFTER setSensors
      let nextPumpState: "on" | "off" | null = null;
      let nextPumpFlowRate: number | null = null;
      let newAlerts: Array<{
        sensorName: string;
        sensorType: string;
        sensorLabel: string;
        sensorUnit: string;
        sensorLocation: string;
        newValue: number;
        boundaryViolated: string;
        severity: "warning" | "critical";
      }> = [];

      setSensors(prevSensors => {
        const updatedSensors = prevSensors.map(sensor => {
          let delta = (Math.random() - 0.5) * 1.5;
          if (sensor.type === "light_intensity") {
            delta = (Math.random() - 0.5) * 1200;
          } else if (sensor.type === "rain_gauge") {
            delta = Math.random() > 0.95 ? 0.2 : 0; // occasional rainfall tick
          }

          const newValue = parseFloat((Math.max(0, sensor.currentValue + delta)).toFixed(sensor.type === "light_intensity" ? 0 : 1));

          // Run automated irrigation algorithm check if pump mode is 'auto'
          if (sensor.type === "soil_moisture") {
            const minMoisture = thresholds.soil_moisture.min;
            if (pumpMode === "auto") {
              if (newValue < minMoisture) {
                nextPumpState = "on";
                nextPumpFlowRate = 45; // Liters/min
              } else if (newValue >= minMoisture + 8) {
                nextPumpState = "off";
                nextPumpFlowRate = 0;
              }
            }
          }

          // Trigger dynamically matching threshold alarms
          const limits = thresholds[sensor.type];
          if (limits) {
            if (newValue < limits.min || newValue > limits.max) {
              const boundaryViolated = newValue < limits.min ? "dropped below minimum limit" : "exceeded maximum limit";
              newAlerts.push({
                sensorName: sensor.name,
                sensorType: sensor.type,
                sensorLabel: sensor.label,
                sensorUnit: sensor.unit,
                sensorLocation: sensor.location,
                newValue,
                boundaryViolated,
                severity: newValue < limits.min * 0.8 || newValue > limits.max * 1.2 ? "critical" : "warning"
              });
            }
          }

          return {
            ...sensor,
            currentValue: newValue
          };
        });

        // Safe async state execution outside of render or state transitions
        if (nextPumpState !== null) {
          const targetPumpState = nextPumpState;
          const targetPumpFlowRate = nextPumpFlowRate ?? 0;
          setTimeout(() => {
            setPumpState(targetPumpState);
            setPumpFlowRate(targetPumpFlowRate);
          }, 0);
        }

        if (newAlerts.length > 0) {
          setTimeout(() => {
            setNotifications(prev => {
              let updatedPrev = [...prev];
              newAlerts.forEach(alertData => {
                const recentMatch = updatedPrev.some(n => n.sensorLabel === alertData.sensorName && !n.resolved);
                if (!recentMatch) {
                  updatedPrev = [
                    {
                      id: `live-alert-${Date.now()}-${Math.random()}`,
                      timestamp: "Just Now",
                      sensorLabel: alertData.sensorName,
                      sensorType: alertData.sensorType,
                      severity: alertData.severity,
                      message: `${alertData.sensorLabel} of ${alertData.newValue} ${alertData.sensorUnit} at ${alertData.sensorLocation} ${alertData.boundaryViolated}!`,
                      resolved: false
                    },
                    ...updatedPrev
                  ];
                }
              });
              return updatedPrev;
            });
          }, 0);
        }

        return updatedSensors;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [thresholds, pumpMode]);

  // Manual pump power switch toggler
  const handleToggleManualPump = () => {
    if (pumpMode === "auto") {
      alert("⚠️ Switch pump operation to 'Manual Overrides' first to manually toggle pump state.");
      return;
    }
    const nextState = pumpState === "on" ? "off" : "on";
    setPumpState(nextState);
    setPumpFlowRate(nextState === "on" ? 45 : 0);

    // Append manual trigger system log notification
    setNotifications(prev => [
      {
        id: `manual-p-${Date.now()}`,
        timestamp: "Just Now",
        sensorLabel: "Smart Pump Controller A1",
        sensorType: "water_level",
        severity: "info",
        message: `Manual pump override sequence initiated: Pump set to ${nextState.toUpperCase()} for ${manualTriggerDuration} minutes.`,
        resolved: true
      },
      ...prev
    ]);
  };

  // Deploy custom virtual node to map
  const handleDeployNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) {
      alert("Please provide a name for the sensor node.");
      return;
    }

    let label = "Sensor Node";
    let unit = "";
    if (newNodeType === "soil_moisture") { label = "Soil Moisture Probe"; unit = "% VWC"; }
    else if (newNodeType === "temperature") { label = "Ambient Temperature"; unit = "°C"; }
    else if (newNodeType === "humidity") { label = "Relative Humidity"; unit = "% RH"; }
    else if (newNodeType === "water_level") { label = "Reservoir Water Level"; unit = "% Depth"; }
    else if (newNodeType === "light_intensity") { label = "Solar Pyranometer"; unit = "Lux"; }
    else if (newNodeType === "wind_speed") { label = "Acoustic Wind Speed"; unit = "km/h"; }
    else if (newNodeType === "rain_gauge") { label = "Precipitation Gauge"; unit = "mm/hr"; }

    const newId = `sens-custom-${Date.now()}`;
    const deployedNode: SensorNode = {
      id: newId,
      name: newNodeName,
      type: newNodeType,
      label,
      currentValue: newNodeValue,
      unit,
      battery: 100,
      signalStrength: -30 - Math.floor(Math.random() * 45),
      status: "Optimal",
      lastCalibration: new Date().toISOString().slice(0, 10),
      location: newNodeLocation,
      solarPanelVoltage: 4.5 + Math.random() * 2,
      energyConsumptionWh: 1.5 + Math.random() * 2,
      predictiveAlert: null,
      x: newNodeX,
      y: newNodeY
    };

    setSensors(prev => [...prev, deployedNode]);
    setSelectedMapNodeId(newId);
    setNewNodeName("");
    
    setNotifications(prev => [
      {
        id: `deploy-n-${Date.now()}`,
        timestamp: "Just Now",
        sensorLabel: newNodeName,
        sensorType: newNodeType,
        severity: "info",
        message: `New field IoT telemetry node deployed: '${newNodeName}' is active at [${newNodeX}%, ${newNodeY}%] in ${newNodeLocation}.`,
        resolved: true
      },
      ...prev
    ]);
  };

  // Remove sensor node
  const handleRemoveNode = (id: string) => {
    const targetNode = sensors.find(s => s.id === id);
    if (!targetNode) return;
    if (confirm(`Are you sure you want to decommission and remove the IoT node: '${targetNode.name}'?`)) {
      setSensors(prev => prev.filter(s => s.id !== id));
      if (selectedMapNodeId === id) {
        setSelectedMapNodeId(null);
      }
      setNotifications(prev => [
        {
          id: `remove-n-${Date.now()}`,
          timestamp: "Just Now",
          sensorLabel: targetNode.name,
          sensorType: targetNode.type,
          severity: "warning",
          message: `Sensor node '${targetNode.name}' decommissioned and unlinked from regional cellular gateway.`,
          resolved: true
        },
        ...prev
      ]);
    }
  };

  // CSV/JSON Data export generator
  const exportTelemetryData = (format: "csv" | "json") => {
    if (format === "csv") {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Timestamp,Soil Moisture (%),Temp (C),Humidity (%),Water Level (%),Solar Light (Lux),Wind Speed (kmh),Rain Gauge (mm)\n";
      historicData.forEach(row => {
        csvContent += `${row.time},${row.soil_moisture},${row.temperature},${row.humidity},${row.water_level},${row.light_intensity},${row.wind_speed},${row.rain_gauge}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `agri_iot_sensors_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ sensors, history: historicData }, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `agri_iot_sensors_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    }
  };

  // Quick helper to fetch individual sensor node details
  const getSensorByType = (type: string) => {
    return sensors.find(s => s.type === type);
  };

  // Weather - Sensor evapo-transpiration correlation indices calculations
  const calculateCorrelationFactor = (sensorA: string, sensorB: string) => {
    // simplified calculation of correlation coefficient
    if (sensorA === "temperature" && sensorB === "humidity") return -0.85; // strongly inverse
    if (sensorA === "wind_speed" && sensorB === "soil_moisture") return -0.62; // wind speeds accelerate drying
    if (sensorA === "light_intensity" && sensorB === "temperature") return 0.78; // sunlight increases thermal levels
    if (sensorA === "rain_gauge" && sensorB === "soil_moisture") return 0.91; // rainfall instantly increases moisture
    return 0.45;
  };

  return (
    <div className="space-y-6" id="iot-sensor-integration-hub">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
              <Cpu className="h-5 w-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">IoT Smart Sensor Network</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Synchronize, monitor and control off-grid cellular soil probes, telemetry meteorological towers, solar grids, and automated pumps.
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-center">
          <button
            onClick={() => setActiveTab("realtime")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "realtime" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="inline h-3.5 w-3.5 mr-1 text-indigo-600" />
            Real-time Telemetry
          </button>
          <button
            onClick={() => setActiveTab("irrigation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "irrigation" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Power className="inline h-3.5 w-3.5 mr-1 text-sky-500" />
            Pump & Irrigation Controllers
          </button>
          <button
            onClick={() => setActiveTab("solar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "solar" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Zap className="inline h-3.5 w-3.5 mr-1 text-amber-500" />
            Solar Energy Analytics
          </button>
          <button
            onClick={() => setActiveTab("correlation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "correlation" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="inline h-3.5 w-3.5 mr-1 text-teal-500" />
            Weather Correlations
          </button>
          <button
            onClick={() => setActiveTab("placement")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "placement" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MapPin className="inline h-3.5 w-3.5 mr-1 text-indigo-500" />
            Interactive Field Map & Placer
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME TELEMETRY VIEW */}
      {activeTab === "realtime" && (
        <div className="space-y-6">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {sensors.map(sensor => {
              // Icon mapping
              let icon = <Cpu className="h-4 w-4" />;
              let iconBg = "bg-slate-50 text-slate-600";
              
              if (sensor.type === "soil_moisture") {
                icon = <Droplets className="h-4 w-4" />;
                iconBg = "bg-blue-50 text-blue-600";
              } else if (sensor.type === "temperature") {
                icon = <Thermometer className="h-4 w-4" />;
                iconBg = "bg-orange-50 text-orange-600";
              } else if (sensor.type === "humidity") {
                icon = <Activity className="h-4 w-4" />;
                iconBg = "bg-indigo-50 text-indigo-600";
              } else if (sensor.type === "water_level") {
                icon = <Gauge className="h-4 w-4" />;
                iconBg = "bg-cyan-50 text-cyan-600";
              } else if (sensor.type === "light_intensity") {
                icon = <Sun className="h-4 w-4" />;
                iconBg = "bg-amber-50 text-amber-600";
              } else if (sensor.type === "wind_speed") {
                icon = <Wind className="h-4 w-4" />;
                iconBg = "bg-sky-50 text-sky-600";
              } else if (sensor.type === "rain_gauge") {
                icon = <CloudRain className="h-4 w-4" />;
                iconBg = "bg-teal-50 text-teal-600";
              }

              // Color of the reading based on thresholds
              const isViolated = sensor.currentValue < thresholds[sensor.type].min || sensor.currentValue > thresholds[sensor.type].max;

              return (
                <div
                  key={sensor.id}
                  className={`p-4 bg-white rounded-xl border transition-all flex flex-col justify-between hover:shadow-md ${
                    isViolated ? "border-red-300 ring-2 ring-red-500/10" : "border-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[70px]">
                      {sensor.label}
                    </span>
                    <div className={`p-1 rounded-lg shrink-0 ${iconBg}`}>
                      {icon}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className={`text-sm font-extrabold tracking-tight ${isViolated ? "text-red-600" : "text-slate-800"}`}>
                      {sensor.type === "light_intensity" ? sensor.currentValue.toLocaleString() : sensor.currentValue}
                      <span className="text-[10px] font-bold text-slate-400 ml-1 font-sans">{sensor.unit}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center gap-0.5" title="Battery Level">
                        <Battery className={`h-3 w-3 ${sensor.battery < 25 ? "text-red-500 fill-red-500 animate-pulse" : "text-slate-400"}`} />
                        <span className="text-[8px] font-mono font-bold text-slate-500">{sensor.battery}%</span>
                      </div>
                      <span className="text-slate-200">|</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        RSSI {sensor.signalStrength}dB
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Historical Trend Charts & Sensor Specific Selection */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <History className="h-4 w-4 text-indigo-600" />
                  Historical Trend Analytics (Past 24 Hours)
                </h3>

                {/* Dropdown to pick active chart sensor */}
                <select
                  value={activeChartSensor}
                  onChange={(e) => setActiveChartSensor(e.target.value as keyof HistoricDataPoint)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 cursor-pointer focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="soil_moisture">Soil Moisture (% VWC)</option>
                  <option value="temperature">Ambient Temperature (°C)</option>
                  <option value="humidity">Relative Humidity (% RH)</option>
                  <option value="water_level">Reservoir Water Level (% Depth)</option>
                  <option value="light_intensity">Solar Lux (Lux)</option>
                  <option value="wind_speed">Wind Speed (km/h)</option>
                  <option value="rain_gauge">Precipitation Accumulation (mm)</option>
                </select>
              </div>

              {/* Area Chart representation */}
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSensor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#f8fafc", fontSize: "11px" }}
                      labelStyle={{ fontWeight: "bold", color: "#38bdf8" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Area
                      type="monotone"
                      dataKey={activeChartSensor}
                      name={sensors.find(s => s.type === activeChartSensor)?.label || activeChartSensor}
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorSensor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Export Data triggers */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Database className="h-3.5 w-3.5 text-slate-400" />
                  Continuous Storage Engine: 44,820 logs logged
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => exportTelemetryData("csv")}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </button>
                  <button
                    onClick={() => exportTelemetryData("json")}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Export JSON
                  </button>
                </div>
              </div>

            </div>

            {/* Threshold Configurations and Alerting */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Threshold Bounds Manager */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <Sliders className="h-4 w-4 text-indigo-600" />
                  Threshold Bound Controllers
                </h4>

                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                  {Object.keys(thresholds).map(key => {
                    const sensorType = key as keyof typeof thresholds;
                    const sensor = getSensorByType(sensorType as string);
                    if (!sensor) return null;

                    return (
                      <div key={key} className="space-y-1.5 text-xs font-semibold">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span className="text-slate-800 uppercase tracking-tight">{sensor.label}</span>
                          <span>Min: {thresholds[sensorType].min} - Max: {thresholds[sensorType].max} {sensor.unit}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border">
                            <span className="text-[9px] text-slate-400">Low Limit</span>
                            <input
                              type="number"
                              value={thresholds[sensorType].min}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setThresholds(prev => ({
                                  ...prev,
                                  [sensorType]: { ...prev[sensorType], min: val }
                                }));
                              }}
                              className="w-full bg-transparent text-slate-800 text-xs text-right font-extrabold focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border">
                            <span className="text-[9px] text-slate-400">High Limit</span>
                            <input
                              type="number"
                              value={thresholds[sensorType].max}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setThresholds(prev => ({
                                  ...prev,
                                  [sensorType]: { ...prev[sensorType], max: val }
                                }));
                              }}
                              className="w-full bg-transparent text-slate-800 text-xs text-right font-extrabold focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant Alerting Service Settings */}
              <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl space-y-4 border border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-100 flex items-center gap-2">
                    <Smartphone className="h-4.5 w-4.5 text-indigo-400" />
                    SMS & Alert Notifications
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableSMSAlerts}
                      onChange={() => setEnableSMSAlerts(!enableSMSAlerts)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {enableSMSAlerts && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Primary Contact Phone</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-900/60 flex gap-2">
                      <Bell className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
                      <p className="text-[10px] leading-relaxed text-indigo-200">
                        Smart alert routing: Critical violations trigger immediate SMS notification dispatch to target nodes. Resolved alarms trigger recovery pings.
                      </p>
                    </div>
                  </div>
                )}

                {/* Alarm Logs Stream */}
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Alarm Notification Stream</span>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-xs">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                          n.severity === "critical"
                            ? "bg-red-950/20 border-red-900/40 text-red-200"
                            : n.severity === "warning"
                            ? "bg-amber-950/20 border-amber-900/40 text-amber-200"
                            : "bg-slate-900 border-slate-800 text-slate-300"
                        }`}
                      >
                        {n.resolved ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${n.severity === "critical" ? "text-red-500 animate-pulse" : "text-amber-500"}`} />
                        )}
                        <div className="space-y-0.5">
                          <p className="font-bold text-[11px] leading-snug">{n.message}</p>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                            <span>{n.timestamp}</span>
                            <span>•</span>
                            <span className="uppercase font-mono tracking-tight">{n.sensorLabel}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2. PUMP & IRRIGATION CONTROLLER MODULE */}
      {activeTab === "irrigation" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Interactive Pump Swivel */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Power className="h-4.5 w-4.5 text-sky-500" />
                Pump Valve Controller Core
              </h3>

              <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-xl border relative overflow-hidden">
                
                {/* Mode Selector */}
                <div className="absolute top-3 left-3 bg-white border px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">
                  Irrigation Mode: <span className="text-sky-600 uppercase">{pumpMode}</span>
                </div>

                {/* Animated status ring */}
                <div
                  className={`h-32 w-32 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                    pumpState === "on"
                      ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-500/10 animate-pulse"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <Power
                    className={`h-12 w-12 cursor-pointer transition-colors ${
                      pumpState === "on" ? "text-sky-600 animate-spin" : "text-slate-400 hover:text-slate-600"
                    }`}
                    onClick={handleToggleManualPump}
                  />
                  <span className={`text-[11px] font-extrabold uppercase tracking-widest mt-2 ${pumpState === "on" ? "text-sky-700" : "text-slate-400"}`}>
                    {pumpState === "on" ? "RUNNING" : "STOPPED"}
                  </span>
                </div>

                {/* Live parameters */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-center w-full px-5 text-xs font-semibold">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase">Discharge Flow</span>
                    <span className="text-sm font-extrabold text-slate-800">{pumpFlowRate} L/min</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase">Power Consumption</span>
                    <span className="text-sm font-extrabold text-slate-800">{pumpState === "on" ? "350 W" : "0 W"}</span>
                  </div>
                </div>

              </div>

              {/* Controller Configuration Form */}
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Operation Protocol</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => {
                        setPumpMode("auto");
                        const moisture = getSensorByType("soil_moisture")?.currentValue || 40;
                        if (moisture < thresholds.soil_moisture.min) {
                          setPumpState("on");
                          setPumpFlowRate(45);
                        } else {
                          setPumpState("off");
                          setPumpFlowRate(0);
                        }
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        pumpMode === "auto" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Automated Loops
                    </button>
                    <button
                      onClick={() => setPumpMode("manual")}
                      className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        pumpMode === "manual" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Manual Overrides
                    </button>
                  </div>
                </div>

                {pumpMode === "manual" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Set Override Timer</label>
                      <select
                        value={manualTriggerDuration}
                        onChange={(e) => setManualTriggerDuration(parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
                      >
                        <option value={15}>15 Minutes</option>
                        <option value={30}>30 Minutes</option>
                        <option value={60}>60 Minutes</option>
                        <option value={120}>2 Hours</option>
                      </select>
                    </div>
                    <button
                      onClick={handleToggleManualPump}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                        pumpState === "on"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-sky-600 hover:bg-sky-700 text-white"
                      }`}
                    >
                      {pumpState === "on" ? "Shutdown Override Valves" : "Trigger Emergency Override Valve"}
                    </button>
                  </div>
                )}

                {pumpMode === "auto" && (
                  <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase">Automated Trigger logic active</span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-emerald-600">
                      Pump engages automatically if the moisture reading from <span className="font-extrabold">Soil Moisture Probe</span> drops below {thresholds.soil_moisture.min}% VWC, and terminates automatically once it recovers to {thresholds.soil_moisture.min + 8}%.
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Smart Soil Moisture Matrix & Flow Logs */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Loop Status Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-sky-500" />
                    Hydraulic Loop Status & Irrigation Matrix
                  </h4>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded">
                    All Loops Optimal
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Soil Wetness State</span>
                    <p className="text-base font-extrabold text-slate-800">
                      {getSensorByType("soil_moisture")?.currentValue}% VWC
                    </p>
                    <span className="text-[9px] text-slate-500 block">
                      {getSensorByType("soil_moisture")?.currentValue || 0 < thresholds.soil_moisture.min
                        ? "⚠️ Critically Dry"
                        : "✓ Optimal Moisture Ratio"}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Water Source Reserve</span>
                    <p className="text-base font-extrabold text-slate-800">
                      {getSensorByType("water_level")?.currentValue}% Capacity
                    </p>
                    <span className="text-[9px] text-slate-500 block">
                      Estimated 4.8 million gallons remaining
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Evaporation Index (ET)</span>
                    <p className="text-base font-extrabold text-slate-800">
                      3.2 mm / Day
                    </p>
                    <span className="text-[9px] text-slate-500 block">
                      Calculated from wind, heat & humidity sensors
                    </span>
                  </div>
                </div>

                {/* Energy & Consumption Chart in Irrigation System */}
                <div className="space-y-2 pt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historical Irrigation Water Consumption (Liters)</span>
                  <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicData.slice(12)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#f8fafc", fontSize: "11px" }}
                        />
                        <Bar dataKey="pump_consumption" name="Discharged Water Volume (L)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. SOLAR PANEL MONITORING & ENERGY CONSUMPTION */}
      {activeTab === "solar" && (
        <div className="space-y-6">
          
          {/* Main Solar metrics ribbons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Sun className="h-6 w-6 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Solar Generation Rate</span>
                <p className="text-lg font-extrabold text-slate-800">
                  {Math.round((getSensorByType("light_intensity")?.currentValue || 0) * 0.0025 * 0.9)} W
                </p>
                <span className="text-[9px] text-emerald-600 font-bold block">✓ Peak radiation harvesting active</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Battery className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Average Node Battery charge</span>
                <p className="text-lg font-extrabold text-slate-800">
                  {Math.round(sensors.reduce((sum, s) => sum + s.battery, 0) / sensors.length)}%
                </p>
                <span className="text-[9px] text-indigo-600 font-bold block">Estimated backup: 84 hours offline runtime</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                <Zap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Aggregated Harvesting Efficiency</span>
                <p className="text-lg font-extrabold text-slate-800">
                  92.4% Optimal
                </p>
                <span className="text-[9px] text-slate-400 font-medium block">Based on cloud reflection indexes</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Historical Solar Harvesting trend */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-amber-500" />
                Diurnal Solar Harvesting vs. Load Profile
              </h3>

              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} stroke="#e2e8f0" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#f8fafc", fontSize: "11px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="solar_generation" name="Solar Harvesting (Wh)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="pump_consumption" name="Load Draw (Wh)" stroke="#0ea5e9" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Micro-grid status */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                Sensor Node Batteries & Micro-charging
              </h3>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 text-xs">
                {sensors.map(sensor => (
                  <div key={sensor.id} className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-800 truncate max-w-[150px]">{sensor.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        sensor.battery > 70 ? "text-emerald-700 bg-emerald-50" : sensor.battery > 30 ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50"
                      }`}>
                        {sensor.battery}% Charged
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sensor.battery > 70 ? "bg-emerald-500" : sensor.battery > 30 ? "bg-amber-500" : "bg-red-500 animate-pulse"
                        }`}
                        style={{ width: `${sensor.battery}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                      <span>Solar Charge: {sensor.solarPanelVoltage}V</span>
                      <span>Power draw: {sensor.energyConsumptionWh}Wh/Day</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. WEATHER SENSOR CORRELATION ANALYTICS */}
      {activeTab === "correlation" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Correlation Index Grid */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                Environmental Matrix Correlation Analytics
              </h3>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Our machine-learning models correlate real-time meteorology with agricultural soil states to proactively detect anomalous water loss, rapid evapotranspiration, and soil erosion risk vectors.
              </p>

              {/* Metric Correlations */}
              <div className="space-y-3 font-semibold text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
                  <div className="flex justify-between font-extrabold text-slate-800">
                    <span>Wind Speed &rarr; Soil Evaporation Index</span>
                    <span className="text-rose-600">-0.62 Correlation</span>
                  </div>
                  <p className="text-[10px] font-medium leading-relaxed text-slate-500">
                    Strong winds reduce surface boundary layers, driving elevated moisture depletion rates. Spot irrigation cycles are pre-emptively recommended during sustained gusts above 20 km/h.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
                  <div className="flex justify-between font-extrabold text-slate-800">
                    <span>Solar Pyranometer &rarr; Surface Temp Gradient</span>
                    <span className="text-emerald-600">+0.78 Correlation</span>
                  </div>
                  <p className="text-[10px] font-medium leading-relaxed text-slate-500">
                    Direct sunlight creates heavy transpiration load on crops. Automated shade fabrics and sprayers will actuate to protect sensitive seedlings when Pyranometer peaks beyond 75,000 Lux.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
                  <div className="flex justify-between font-extrabold text-slate-800">
                    <span>Precipitation Gauge &rarr; Reservoir Deep Reserves</span>
                    <span className="text-blue-600">+0.91 Correlation</span>
                  </div>
                  <p className="text-[10px] font-medium leading-relaxed text-slate-500">
                    Direct direct surface run-off feed correlations. Standard catchment reservoirs gain 1.5% depth index for every 10 mm of rain, allowing secondary wells to stand offline to reduce pump wear.
                  </p>
                </div>
              </div>

            </div>

            {/* Predictive Maintenance Warnings */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                AI Predictive Maintenance Alerts
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                
                {sensors.filter(s => s.predictiveAlert !== null).map(s => (
                  <div key={s.id} className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
                      <AlertTriangle className="h-4.5 w-4.5 animate-bounce shrink-0" />
                      <span>{s.name} Attention Required</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-700 font-medium">
                      {s.predictiveAlert}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => alert(`✓ Automated recalibration code dispatched to ${s.name}. Offset levels adjusted to 0.00.`)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Recalibrate Sensor
                      </button>
                      <button
                        onClick={() => alert(`✓ Maintenance task dispatched to dispatch queue. Field agent notified.`)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Schedule Audit
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex gap-2.5 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 font-medium">
                    <span className="block font-bold text-emerald-800">All remaining nodes healthy</span>
                    <p className="text-[10px] leading-relaxed text-emerald-600">
                      Standard diagnostic heartbeat pings confirm 5 of 7 telemetry nodes operating well within nominal calibration thresholds. Next periodic maintenance scheduled for July 15.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 5. INTERACTIVE FIELD MAP & PLACER VIEW */}
      {activeTab === "placement" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: The Map Canvas */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-4.5 w-4.5 text-indigo-600 animate-bounce" />
                    Digital Farm Twin & Live Node Map
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Click anywhere on the field canvas below to instantly target the deployment coordinates.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Optimal</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Warning</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Degraded</span>
                </div>
              </div>

              {/* The Farm Board Layout Container */}
              <div 
                className="relative h-[480px] w-full rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden cursor-crosshair group shadow-inner"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                  setNewNodeX(clickX);
                  setNewNodeY(clickY);
                }}
              >
                {/* Visual Farm Zones (Grid Overlay) */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-40 pointer-events-none">
                  <div className="border-r border-b border-slate-200 p-4 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-emerald-800">North Pivot Maize Field</span>
                    <span className="text-[9px] text-slate-400">Zone Alpha</span>
                  </div>
                  <div className="border-b border-slate-200 p-4 flex flex-col justify-between text-right">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-800">Water Catchment & Reservoirs</span>
                    <span className="text-[9px] text-slate-400">Zone Delta</span>
                  </div>
                  <div className="border-r border-slate-200 p-4 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-400">Zone Beta</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-800">West Greenhouse Ridge</span>
                  </div>
                  <div className="p-4 flex flex-col justify-between text-right">
                    <span className="text-[9px] text-slate-400">Zone Gamma</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-orange-800">South Hill Orchard</span>
                  </div>
                </div>

                {/* Aesthetic center hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-slate-200/50 border border-slate-300 flex items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">HQ TOWER</span>
                </div>

                {/* Target Pin Marker for New Deployment */}
                <div 
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300"
                  style={{ left: `${newNodeX}%`, top: `${newNodeY}%` }}
                >
                  <div className="relative">
                    <div className="absolute -inset-2.5 bg-indigo-500/20 rounded-full animate-ping"></div>
                    <MapPin className="h-6.5 w-6.5 text-indigo-600 drop-shadow-md" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      New Target ({newNodeX}%, {newNodeY}%)
                    </span>
                  </div>
                </div>

                {/* Render All Deployed Nodes */}
                {sensors.map((sensor) => {
                  const nodeX = sensor.x !== undefined ? sensor.x : 50;
                  const nodeY = sensor.y !== undefined ? sensor.y : 50;
                  const isSelected = selectedMapNodeId === sensor.id;
                  
                  // Color codes
                  let statusBg = "bg-emerald-500";
                  if (sensor.status === "Degraded") statusBg = "bg-rose-500";
                  else if (sensor.status === "Maintenance Required") statusBg = "bg-amber-500";
                  else if (sensor.status === "Offline") statusBg = "bg-slate-400";

                  // Type based coloring for the pin icon
                  let pinColor = "text-sky-500";
                  if (sensor.type === "temperature") pinColor = "text-orange-500";
                  else if (sensor.type === "humidity") pinColor = "text-teal-500";
                  else if (sensor.type === "light_intensity") pinColor = "text-amber-500";
                  else if (sensor.type === "wind_speed") pinColor = "text-indigo-500";
                  else if (sensor.type === "rain_gauge") pinColor = "text-cyan-500";

                  return (
                    <button
                      key={sensor.id}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent setting click target coord
                        setSelectedMapNodeId(sensor.id);
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white border-2 hover:scale-110 transition-transform ${
                        isSelected ? "border-indigo-600 ring-4 ring-indigo-100 scale-110 shadow-md" : "border-slate-300 shadow-sm"
                      }`}
                      style={{ left: `${nodeX}%`, top: `${nodeY}%` }}
                    >
                      <div className="relative">
                        {/* Status notification dot */}
                        <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${statusBg} ring-1 ring-white`}></span>
                        
                        {/* Icon */}
                        {sensor.type === "soil_moisture" && <Droplets className={`h-4.5 w-4.5 ${pinColor}`} />}
                        {sensor.type === "temperature" && <Thermometer className={`h-4.5 w-4.5 ${pinColor}`} />}
                        {sensor.type === "humidity" && <Activity className={`h-4.5 w-4.5 ${pinColor}`} />}
                        {sensor.type === "water_level" && <Droplets className={`h-4.5 w-4.5 ${pinColor}`} />}
                        {sensor.type === "light_intensity" && <Sun className={`h-4.5 w-4.5 ${pinColor}`} />}
                        {sensor.type === "wind_speed" && <Wind className={`h-4.5 w-4.5 ${pinColor}`} />}
                        {sensor.type === "rain_gauge" && <CloudRain className={`h-4.5 w-4.5 ${pinColor}`} />}
                      </div>

                      {/* Floating tooltip with node details */}
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                        {sensor.name}: {sensor.currentValue} {sensor.unit}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Form and Selected Node Details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Selected Node Inspector */}
              <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-emerald-600" />
                  Active Node Inspector
                </h3>

                {selectedMapNodeId ? (() => {
                  const s = sensors.find(node => node.id === selectedMapNodeId);
                  if (!s) return <p className="text-xs text-slate-400">Node not found or unlinked.</p>;
                  return (
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800 leading-tight">{s.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">{s.label}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          s.status === "Optimal" ? "bg-emerald-50 text-emerald-700" :
                          s.status === "Degraded" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {s.status}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2.5 bg-slate-50 border rounded-xl">
                          <span className="block text-[8px] text-slate-400 uppercase font-extrabold">Current Readout</span>
                          <span className="text-sm font-extrabold text-indigo-700">{s.currentValue} {s.unit}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border rounded-xl">
                          <span className="block text-[8px] text-slate-400 uppercase font-extrabold">Power Grid Input</span>
                          <span className="text-sm font-extrabold text-slate-800">{s.solarPanelVoltage} V (Solar)</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border rounded-xl">
                          <span className="block text-[8px] text-slate-400 uppercase font-extrabold">Battery Status</span>
                          <span className="text-sm font-extrabold text-slate-800">{s.battery}%</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border rounded-xl">
                          <span className="block text-[8px] text-slate-400 uppercase font-extrabold">Signal Strength</span>
                          <span className="text-sm font-extrabold text-slate-800">{s.signalStrength} dBm</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">Node Location Region</span>
                        <p className="text-xs text-slate-700 font-extrabold">{s.location} ({s.x || 50}%, {s.y || 50}%)</p>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">Last Cryptographic Handshake</span>
                        <p className="text-xs text-slate-700 font-extrabold">{s.lastCalibration} (Gateway Verified)</p>
                      </div>

                      {s.predictiveAlert && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-1">
                          <span className="block font-bold text-[10px] uppercase text-rose-700">Predictive Anomaly Detected</span>
                          <p className="text-[10px] font-medium leading-relaxed">{s.predictiveAlert}</p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => alert(`✓ Cellular packet calibration dispatched to node '${s.name}'. Heartbeat returned optimal 0.00 offset.`)}
                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer text-center"
                        >
                          Calibrate Node
                        </button>
                        <button
                          onClick={() => handleRemoveNode(s.id)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border rounded-lg cursor-pointer transition-colors"
                          title="Decommission Sensor Node"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                    </div>
                  );
                })() : (
                  <div className="text-center py-8 text-slate-400 font-medium">
                    <MapPin className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                    Select any telemetry node pin on the farm map to inspect real-time metrics.
                  </div>
                )}
              </div>

              {/* Provision New Node Form */}
              <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 shadow-sm space-y-4 border border-slate-800">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                  <Database className="h-4.5 w-4.5 text-indigo-400" />
                  Provision Telemetry Node
                </h3>

                <form onSubmit={handleDeployNode} className="space-y-3.5 text-xs font-semibold">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Custom Node Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maize West Canopy Sensor"
                      value={newNodeName}
                      onChange={(e) => setNewNodeName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Sensor Type</label>
                      <select
                        value={newNodeType}
                        onChange={(e) => {
                          const type = e.target.value as SensorNode["type"];
                          setNewNodeType(type);
                          // Assign nominal value based on type
                          if (type === "soil_moisture") setNewNodeValue(42);
                          else if (type === "temperature") setNewNodeValue(29);
                          else if (type === "humidity") setNewNodeValue(60);
                          else if (type === "water_level") setNewNodeValue(75);
                          else if (type === "light_intensity") setNewNodeValue(45000);
                          else if (type === "wind_speed") setNewNodeValue(15);
                          else if (type === "rain_gauge") setNewNodeValue(0);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="soil_moisture">Soil Moisture</option>
                        <option value="temperature">Temperature</option>
                        <option value="humidity">Humidity</option>
                        <option value="water_level">Water Level</option>
                        <option value="light_intensity">Solar light</option>
                        <option value="wind_speed">Wind Speed</option>
                        <option value="rain_gauge">Rain Gauge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Deployment Location</label>
                      <select
                        value={newNodeLocation}
                        onChange={(e) => setNewNodeLocation(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Block C (Maize Field)">Block C (Maize Field)</option>
                        <option value="North Pivot Point">North Pivot Point</option>
                        <option value="South Block Orchard">South Block Orchard</option>
                        <option value="Water Supply Intake">Water Supply Intake</option>
                        <option value="Central Meteorological Tower">Meteorological Tower</option>
                        <option value="Ridge West Slope">Ridge West Slope</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Initial Value</label>
                      <input
                        type="number"
                        value={newNodeValue}
                        onChange={(e) => setNewNodeValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">X-Coord (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newNodeX}
                        onChange={(e) => setNewNodeX(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Y-Coord (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newNodeY}
                        onChange={(e) => setNewNodeY(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px] leading-relaxed text-slate-400">
                    <span className="font-bold text-slate-300 block mb-0.5">💡 Interactive Setup Guide:</span>
                    You can slide parameters manually, or click anywhere on the digital map to pre-set coordinates automatically!
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all uppercase tracking-wider text-center"
                  >
                    Deploy Node to Region
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
