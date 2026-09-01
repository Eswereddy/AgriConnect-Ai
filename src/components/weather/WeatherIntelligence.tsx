import React, { useState, useMemo } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Compass,
  TrendingUp,
  Sun,
  Flame,
  CloudRain,
  Sparkles,
  Map,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  AlertCircle,
  CornerDownRight,
  TrendingDown,
  Clock,
  Gauge,
  Search,
  MapPin,
  RefreshCw
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

// Interfaces
interface Alert {
  id: string;
  type: "Drought" | "Flood" | "Cyclone" | "Frost" | "Storm";
  severity: "Critical" | "Warning" | "Advisory";
  title: string;
  description: string;
  evacuationRoutes?: string[];
  sensitiveCrops?: string[];
  effectiveUntil: string;
}

interface ForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  rainVolumeMm: number; // mm/hour
  confidenceScore: number; // %
  solarRadiation: number; // W/m² (for solar pumps)
  uvIndex: number;
}

export const WeatherIntelligence: React.FC = () => {
  // Weather Data Source selection
  const [dataSource, setDataSource] = useState<"OpenWeatherMap" | "IMD Data" | "AccuWeather">("IMD Data");
  
  // Custom states for interactive simulation
  const [selectedCrop, setSelectedCrop] = useState<"Rice Paddy" | "Tomato" | "Wheat" | "Cotton">("Rice Paddy");
  const [temperatureOffset, setTemperatureOffset] = useState<number>(0); // manual modifier to simulate conditions

  // Location-based intelligence state
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [locationResult, setLocationResult] = useState<any | null>(null);

  const handleGeoLocationAnalysis = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsAnalyzing(true);
    setLocationResult(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch("/api/analyze-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ location: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}` })
          });
          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              setLocationResult(data);
            } else {
              throw new Error("Received non-JSON response from server.");
            }
          } else {
            let errorMsg = "Failed to analyze coordinates.";
            try {
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                errorMsg = data.error || errorMsg;
              }
            } catch (_) {}
            alert(errorMsg);
          }
        } catch (err) {
          console.error(err);
          alert("Error analyzing coordinates.");
        } finally {
          setIsAnalyzing(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Unable to acquire your geolocation automatically. Please type your location manually!");
        setIsAnalyzing(false);
      }
    );
  };

  const handleLocationQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setIsAnalyzing(true);
    setLocationResult(null);
    try {
      const response = await fetch("/api/analyze-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: locationQuery })
      });
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setLocationResult(data);
        } else {
          throw new Error("Received non-JSON response from server.");
        }
      } else {
        let errorMsg = "Failed to analyze location.";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            errorMsg = data.error || errorMsg;
          }
        } catch (_) {}
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Error analyzing location. Please check your network connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSyncToLocalHolding = () => {
    if (!locationResult) return;
    const syncEvent = new CustomEvent("syncFarmTelemetry", {
      detail: {
        name: locationResult.locationName,
        soilType: locationResult.soil.type,
        ph: locationResult.soil.typicalPh,
        organicMatter: locationResult.soil.organicMatterPercent,
        temp: locationResult.weather.tempCelsius,
        humidity: locationResult.weather.humidityPercent,
        nitrogen: locationResult.soil.nitrogenPpm,
        phosphorus: locationResult.soil.phosphorusPpm,
        potassium: locationResult.soil.potassiumPpm,
        optimalCrops: locationResult.optimalCrops
      }
    });
    window.dispatchEvent(syncEvent);
    alert(`Ecosystem synchronized! Applied ${locationResult.locationName}'s weather and soil composition parameters to your active holding.`);
  };

  // 1. Live Weather Data representing the three merged sources
  const liveWeather = useMemo(() => {
    // Slighly adjust mock values based on data source selection to show real-time changes
    const baseOffset = dataSource === "OpenWeatherMap" ? -0.5 : dataSource === "AccuWeather" ? 0.8 : 0;
    const currentTemp = 34.2 + baseOffset + temperatureOffset;

    return {
      temp: currentTemp,
      humidity: 78 + (dataSource === "OpenWeatherMap" ? 3 : -2),
      windSpeed: 16.4 + (dataSource === "AccuWeather" ? 2.5 : 0),
      windDir: "ENE",
      pressure: 1008 + (dataSource === "OpenWeatherMap" ? -2 : 1),
      solarRadiation: 780 + (dataSource === "AccuWeather" ? 45 : -20), // W/m2
      uvIndex: 9.2 + (dataSource === "OpenWeatherMap" ? 0.3 : -0.2),
      currentCondition: currentTemp > 36 ? "Extreme Heat" : "Humid & Partly Cloudy",
      rainRateMm: currentTemp > 35 ? 0.0 : 1.2, // mm/hour
      lastUpdated: new Date().toLocaleTimeString()
    };
  }, [dataSource, temperatureOffset]);

  // 2. Active Severe Alerts
  const [alerts] = useState<Alert[]>([
    {
      id: "alert-1",
      type: "Flood",
      severity: "Critical",
      title: "Gurdaspur/Amritsar Low-Lying Sector Inundation Warning",
      description: "Immediate flash-flood risks along tributary drainage systems due to unprecedented heavy discharges upstream.",
      evacuationRoutes: [
        "Primary: State Highway 15 (North-East elevated bypass)",
        "Secondary: Amritsar-Batala link road via Sector 4 high ridge"
      ],
      effectiveUntil: "2026-06-29"
    },
    {
      id: "alert-2",
      type: "Drought",
      severity: "Warning",
      title: "Block-Level Groundwater Stress & Dry Spell Advisory",
      description: "Severe soil moisture evaporation rates observed across southern sector sandy loams. Irrigation frequency adjustments required.",
      sensitiveCrops: ["Tomato", "Chilli Peppers", "Early Sown Pulses"],
      effectiveUntil: "2026-07-05"
    },
    {
      id: "alert-3",
      type: "Frost",
      severity: "Advisory",
      title: "Micro-Climate Radiative Cold Pocket Alert",
      description: "Near-ground night radiation frost pockets predicted in windless hollow sectors. Shielding practices recommended.",
      sensitiveCrops: ["Seedling Tomatoes", "Exotic greens"],
      effectiveUntil: "2026-06-30"
    }
  ]);

  // 3. 7-Day Agronomic Weather Forecast with Confidence Scores
  const forecastDays: ForecastDay[] = [
    { day: "Mon", tempMax: 35, tempMin: 27, condition: "Scattered Showers", humidity: 82, windSpeed: 18, rainProbability: 65, rainVolumeMm: 3.5, confidenceScore: 94, solarRadiation: 650, uvIndex: 8 },
    { day: "Tue", tempMax: 36, tempMin: 28, condition: "Mostly Humid", humidity: 75, windSpeed: 15, rainProbability: 30, rainVolumeMm: 0.8, confidenceScore: 89, solarRadiation: 810, uvIndex: 10 },
    { day: "Wed", tempMax: 34, tempMin: 26, condition: "Heavy Thunderstorm", humidity: 88, windSpeed: 24, rainProbability: 85, rainVolumeMm: 12.0, confidenceScore: 92, solarRadiation: 420, uvIndex: 5 },
    { day: "Thu", tempMax: 33, tempMin: 25, condition: "Overcast", humidity: 80, windSpeed: 14, rainProbability: 40, rainVolumeMm: 1.5, confidenceScore: 85, solarRadiation: 550, uvIndex: 6 },
    { day: "Fri", tempMax: 35, tempMin: 26, condition: "Partly Cloudy", humidity: 72, windSpeed: 12, rainProbability: 20, rainVolumeMm: 0.0, confidenceScore: 88, solarRadiation: 790, uvIndex: 9 },
    { day: "Sat", tempMax: 37, tempMin: 28, condition: "Extreme Solar Focus", humidity: 65, windSpeed: 10, rainProbability: 5, rainVolumeMm: 0.0, confidenceScore: 91, solarRadiation: 950, uvIndex: 11 },
    { day: "Sun", tempMax: 36, tempMin: 27, condition: "Clear Sky", humidity: 68, windSpeed: 11, rainProbability: 10, rainVolumeMm: 0.0, confidenceScore: 93, solarRadiation: 920, uvIndex: 10 }
  ];

  // 4. Historical Rain & Temp Patterns for Yield Correlation
  const historicalPatterns = [
    { month: "Jan", rainfallMm: 24, avgTemp: 14, solarHours: 5.5 },
    { month: "Feb", rainfallMm: 32, avgTemp: 17, solarHours: 6.8 },
    { month: "Mar", rainfallMm: 18, avgTemp: 23, solarHours: 8.2 },
    { month: "Apr", rainfallMm: 12, avgTemp: 29, solarHours: 9.5 },
    { month: "May", rainfallMm: 25, avgTemp: 35, solarHours: 10.2 },
    { month: "Jun", rainfallMm: 140, avgTemp: 38, solarHours: 7.4 },
    { month: "Jul", rainfallMm: 260, avgTemp: 32, solarHours: 5.8 },
    { month: "Aug", rainfallMm: 230, avgTemp: 31, solarHours: 6.2 },
    { month: "Sep", rainfallMm: 110, avgTemp: 30, solarHours: 7.5 }
  ];

  // 5. Suitability Matrices for Spraying/Planting/Harvesting based on live conditions
  const weatherSuitability = useMemo(() => {
    // Spraying Suitability: Best when wind speed is between 4 and 15 km/h, and no immediate rain, humidity < 85%
    const windOk = liveWeather.windSpeed >= 4 && liveWeather.windSpeed <= 15;
    const rainOk = liveWeather.rainRateMm < 0.5;
    const sprayScore = (windOk ? 50 : 15) + (rainOk ? 50 : 0);

    // Planting Suitability: Requires soil moisture (humidity high is ok, temperature moderate 20-35)
    const tempOk = liveWeather.temp >= 20 && liveWeather.temp <= 35;
    const humidityOk = liveWeather.humidity >= 50;
    const plantingScore = (tempOk ? 50 : 20) + (humidityOk ? 50 : 25);

    // Harvest Window Recommendation: Best when extremely dry, wind is moderate
    const harvestTempOk = liveWeather.temp >= 28;
    const harvestRainOk = liveWeather.rainRateMm === 0;
    const harvestScore = (harvestTempOk ? 40 : 10) + (harvestRainOk ? 60 : 0);

    return {
      spraying: {
        score: sprayScore,
        status: sprayScore >= 80 ? "Highly Optimal" : sprayScore >= 50 ? "Marginal" : "Unsuitable",
        reasons: [
          windOk ? "✓ Wind speed allows minimal chemical drift." : `⚠ Wind too high (${liveWeather.windSpeed.toFixed(1)} km/h): spray drift risk.`,
          rainOk ? "✓ No immediate torrential washing risk." : "⚠ High moisture rate: wash-off threat."
        ]
      },
      planting: {
        score: plantingScore,
        status: plantingScore >= 80 ? "Highly Optimal" : plantingScore >= 50 ? "Marginal" : "Unsuitable",
        reasons: [
          tempOk ? "✓ Ideal biological germination temperature range." : "⚠ Ambient heat stress limits root crown establishment.",
          humidityOk ? "✓ Ambient relative moisture reduces immediate transpiration burn." : "⚠ Arid winds increase seedling shock risk."
        ]
      },
      harvesting: {
        score: harvestScore,
        status: harvestScore >= 80 ? "Optimal Window" : harvestScore >= 50 ? "Sub-Optimal" : "Critically Delayed",
        reasons: [
          harvestRainOk ? "✓ Zero risk of grain moisture reabsorption." : "⚠ Pre-harvest rainfall causes mould & ear germination.",
          harvestTempOk ? "✓ High solar drying potential observed." : "⚠ Slow dry rate may cause field spoilages."
        ]
      }
    };
  }, [liveWeather]);

  // 6. AI Yield Impact Prediction Model
  const aiYieldImpact = useMemo(() => {
    const tempSeverity = liveWeather.temp > 35 ? "High Heat" : "Normal Warmth";
    const waterAvailability = liveWeather.humidity > 70 ? "Humid Stress/Fungus Risk" : "Optimal Evaporation Balance";

    let yieldMultiplier = 1.0;
    const deductions: string[] = [];

    if (liveWeather.temp > 35) {
      yieldMultiplier -= 0.08;
      deductions.push("High extreme temperature (above 35°C) induces heat shock, reducing grain filling weight by 8%.");
    }
    if (liveWeather.humidity > 80) {
      yieldMultiplier -= 0.05;
      deductions.push("Excess atmospheric humidity increases vulnerability to blast fungus and sheath blight by 5%.");
    }
    if (liveWeather.solarRadiation > 850) {
      yieldMultiplier += 0.04;
      deductions.push("High incoming solar flux enhances photosynthesis rates, increasing biomass projections by +4%.");
    }

    return {
      severity: tempSeverity,
      moistureMetric: waterAvailability,
      yieldImpactFactor: parseFloat((yieldMultiplier * 100).toFixed(0)),
      deductions
    };
  }, [liveWeather]);

  return (
    <div id="weather-intelligence-dashboard" className="space-y-6">

      {/* Header Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-teal-400 bg-teal-950 px-2.5 py-1 rounded-full border border-teal-900 flex items-center gap-1.5 w-fit">
            <CloudSun className="h-4 w-4 animate-pulse" /> Meteorological Intelligence Hub
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Agronomic Weather Control Center</h2>
          <p className="text-slate-400 text-[10px] font-medium">Multi-source satellite feeds, 7-day predictability metrics, solar pump capacity ratings, and crop-specific AI yield loss forecasters.</p>
        </div>

        {/* Data Source Switcher */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
          <span className="text-slate-500 text-[8px] font-black uppercase px-2">Feed Source:</span>
          {(["OpenWeatherMap", "IMD Data", "AccuWeather"] as const).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => setDataSource(source)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                dataSource === source
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* Global Location and Weather Intelligence Engine */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
            <Compass className="h-5 w-5 text-emerald-600" />
            AI Global Weather & Location Geopolitical Analyzer
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Analyze any district, village, city or coordinates. Our Gemini-powered engine instantly decodes the localized microclimate, soil composition, optimal crop schedules, and agronomic risks.
          </p>
        </div>

        <form onSubmit={handleLocationQuerySubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Type any location (e.g., Ludhiana Punjab, Fresno California, Nakuru Kenya)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              {isAnalyzing ? "Analyzing..." : "Analyze Location"}
            </button>
            <button
              type="button"
              onClick={handleGeoLocationAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              Use GPS
            </button>
          </div>
        </form>

        {isAnalyzing && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-slate-50 rounded-xl border border-slate-150 border-dashed animate-pulse">
            <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
            <span className="text-xs font-bold text-slate-500">Querying global meteorology and soil databases via Gemini...</span>
          </div>
        )}

        {locationResult && (
          <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-5 space-y-6 animate-fade-in">
            {/* Header / Sync Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Location Analysis for: {locationResult.locationName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Coordinates: {locationResult.coordinates.lat}°N, {locationResult.coordinates.lon}°E
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncToLocalHolding}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Apply / Sync to My Holding
              </button>
            </div>

            {/* Weather & Soil Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Climate Data Card */}
              <div className="bg-white rounded-xl border border-slate-150 p-4 space-y-3">
                <span className="text-[9px] uppercase font-black tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                  Typical Microclimate
                </span>
                <div className="grid grid-cols-3 gap-3 font-mono">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[7px] text-slate-400 font-bold block uppercase">Temperature</span>
                    <span className="text-slate-800 text-xs font-extrabold">{locationResult.weather.tempCelsius}°C</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[7px] text-slate-400 font-bold block uppercase">Humidity</span>
                    <span className="text-slate-800 text-xs font-extrabold">{locationResult.weather.humidityPercent}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[7px] text-slate-400 font-bold block uppercase">Wind Speed</span>
                    <span className="text-slate-800 text-xs font-extrabold">{locationResult.weather.windSpeedKmh} km/h</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg col-span-3 flex justify-between items-center bg-teal-50/20 border border-teal-100/50">
                    <div>
                      <span className="text-[7px] text-slate-400 font-bold block uppercase">Precipitation & Radiation</span>
                      <span className="text-slate-800 text-xs font-extrabold">
                        {locationResult.weather.rainVolumeMm} mm Rain • {locationResult.weather.solarRadiationWm2} W/m²
                      </span>
                    </div>
                    <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {locationResult.weather.alertSummary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Soil Profile Card */}
              <div className="bg-white rounded-xl border border-slate-150 p-4 space-y-3">
                <span className="text-[9px] uppercase font-black tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Soil Composition
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[7px] text-slate-400 font-bold block uppercase">Soil Type</span>
                    <span className="text-slate-800 font-bold">{locationResult.soil.type}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[7px] text-slate-400 font-bold block uppercase">pH level</span>
                    <span className="text-slate-800 font-bold">{locationResult.soil.typicalPh}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="p-1 bg-slate-50 rounded-md">
                    <span className="text-[7px] text-slate-400 block font-bold uppercase">Nitrogen</span>
                    <span className="text-slate-800 text-[10px] font-bold">{locationResult.soil.nitrogenPpm} ppm</span>
                  </div>
                  <div className="p-1 bg-slate-50 rounded-md">
                    <span className="text-[7px] text-slate-400 block font-bold uppercase">Phosphorus</span>
                    <span className="text-slate-800 text-[10px] font-bold">{locationResult.soil.phosphorusPpm} ppm</span>
                  </div>
                  <div className="p-1 bg-slate-50 rounded-md">
                    <span className="text-[7px] text-slate-400 block font-bold uppercase">Potassium</span>
                    <span className="text-slate-800 text-[10px] font-bold">{locationResult.soil.potassiumPpm} ppm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimal Crops Schedule */}
            <div className="bg-white rounded-xl border border-slate-150 p-4 space-y-3">
              <span className="text-[9px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Optimal Crop Calendars & Projected Production
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationResult.optimalCrops?.map((crop: any, i: number) => (
                  <div key={i} className="bg-slate-50 hover:bg-slate-100/50 p-3 rounded-lg border border-slate-150 space-y-1.5 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">{crop.name}</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                        {crop.suitabilityScore}% Match
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400 font-semibold uppercase">
                      <div>
                        <span>Season</span>
                        <p className="text-slate-700 font-bold normal-case mt-0.2">{crop.season}</p>
                      </div>
                      <div>
                        <span>Sowing Window</span>
                        <p className="text-slate-700 font-bold normal-case mt-0.2">{crop.sowingWindow}</p>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase border-t pt-1">
                      <span>Projected Yield / Acre</span>
                      <p className="text-slate-800 font-bold normal-case mt-0.2">{crop.projectedYieldTonsPerAcre} Tons</p>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed font-semibold italic">
                      "{crop.tips}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hazards & Summary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Climate Risks */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-150 p-4 space-y-3">
                <span className="text-[9px] uppercase font-black tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Geographical Risks & Mitigations
                </span>
                <div className="space-y-3">
                  {locationResult.climateHazards?.map((hazard: any, i: number) => (
                    <div key={i} className="text-[10px] space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800">{hazard.name}</span>
                        <span className={`text-[8px] uppercase font-black px-1.5 py-0.2 rounded ${
                          hazard.riskLevel === "High" || hazard.riskLevel === "Critical"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {hazard.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal font-semibold">
                        {hazard.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific executive summary */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-150 p-4 space-y-2">
                <span className="text-[9px] uppercase font-black tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Gemini Scientific Agronomic Evaluation
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {locationResult.aiAgronomicSummary}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Severe Warnings Section (Flood, Drought, Frost) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-red-600" /> Critical Meteorological Advisories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((al) => (
            <div
              key={al.id}
              className={`p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
                al.severity === "Critical"
                  ? "bg-red-50 border-red-200 text-red-900"
                  : al.severity === "Warning"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-blue-50 border-blue-150 text-blue-900"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                    al.severity === "Critical"
                      ? "bg-red-200 text-red-800"
                      : al.severity === "Warning"
                      ? "bg-amber-200 text-amber-800"
                      : "bg-blue-200 text-blue-800"
                  }`}>
                    {al.type} • {al.severity}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold">Until {al.effectiveUntil}</span>
                </div>
                <h4 className="text-xs font-bold leading-snug">{al.title}</h4>
                <p className="text-[9.5px] leading-relaxed opacity-90">{al.description}</p>
              </div>

              {/* Evacuation Route or Crops Affected Details */}
              {al.evacuationRoutes && (
                <div className="mt-3.5 pt-2.5 border-t border-red-200/55 space-y-1">
                  <span className="text-[8px] font-black uppercase text-red-800 flex items-center gap-1">
                    <Map className="h-3.5 w-3.5" /> Recommended Evacuation Corridors
                  </span>
                  {al.evacuationRoutes.map((rt, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[9px] font-bold">
                      <CornerDownRight className="h-3 w-3" />
                      <span>{rt}</span>
                    </div>
                  ))}
                </div>
              )}

              {al.sensitiveCrops && (
                <div className="mt-3.5 pt-2.5 border-t border-amber-200/55 space-y-1">
                  <span className="text-[8px] font-black uppercase text-amber-800">Crops Susceptible to Stress</span>
                  <div className="flex flex-wrap gap-1">
                    {al.sensitiveCrops.map((cr, idx) => (
                      <span key={idx} className="bg-amber-100 text-[8.5px] font-black px-1.5 py-0.2 rounded border border-amber-200 text-amber-700">
                        {cr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Column Grid: Live telemetry + 7-Day & Historical predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COMPONENT: LIVE TELEMETRY & SUITABILITY SCORING (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live Micro-Station readouts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Atmospheric Feed</h3>
                <p className="text-[9.5px] text-slate-400 mt-0.5">Sensed metrics updated: {liveWeather.lastUpdated}</p>
              </div>
              <span className="text-[8px] font-black uppercase text-slate-400">Hub-3 Station</span>
            </div>

            {/* Simulated parameter adjuster slider */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                <span>Simulate Temperature Shift</span>
                <span className="text-teal-700 font-extrabold">{temperatureOffset >= 0 ? "+" : ""}{temperatureOffset}°C</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                value={temperatureOffset}
                onChange={(e) => setTemperatureOffset(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Temp gauge */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 font-mono relative">
                <span className="text-slate-400 text-[8px] font-bold block uppercase">Air Temp</span>
                <span className="text-slate-800 text-base font-black tracking-tight">{liveWeather.temp.toFixed(1)}°C</span>
                <Thermometer className="h-4 w-4 text-rose-500 absolute top-3.5 right-3.5" />
              </div>

              {/* Humidity */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 font-mono relative">
                <span className="text-slate-400 text-[8px] font-bold block uppercase">Moisture (RH)</span>
                <span className="text-slate-800 text-base font-black tracking-tight">{liveWeather.humidity}%</span>
                <Droplets className="h-4 w-4 text-sky-500 absolute top-3.5 right-3.5" />
              </div>

              {/* Wind Speed */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 font-mono relative">
                <span className="text-slate-400 text-[8px] font-bold block uppercase">Wind Speed</span>
                <span className="text-slate-800 text-xs font-black tracking-tight">{liveWeather.windSpeed.toFixed(1)} km/h</span>
                <span className="text-slate-400 text-[7px] font-bold block mt-0.5">Dir: {liveWeather.windDir}</span>
                <Wind className="h-4 w-4 text-emerald-500 absolute top-3.5 right-3.5" />
              </div>

              {/* Solar Radiation */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 font-mono relative">
                <span className="text-slate-400 text-[8px] font-bold block uppercase">Solar Radiation</span>
                <span className="text-slate-800 text-xs font-black tracking-tight">{liveWeather.solarRadiation} W/m²</span>
                <span className="text-slate-400 text-[7px] font-bold block mt-0.5">UV Index: {liveWeather.uvIndex.toFixed(1)}</span>
                <Sun className="h-4 w-4 text-amber-500 absolute top-3.5 right-3.5" />
              </div>
            </div>

            {/* Precipitation Rate Indicators */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex justify-between items-center">
              <div className="text-[10px]">
                <span className="text-sky-700 font-extrabold block uppercase text-[8px]">Rain Rate (mm/hour)</span>
                <span className="text-sky-900 font-black">{liveWeather.rainRateMm > 0 ? `${liveWeather.rainRateMm} mm/hr` : "Dry Conditions"}</span>
              </div>
              <CloudRain className="h-5 w-5 text-sky-600" />
            </div>
          </div>

          {/* AI Yield impact modeling card */}
          <div className="bg-gradient-to-br from-teal-950 to-slate-900 text-white rounded-2xl p-5 border border-teal-900 space-y-4">
            <div className="border-b border-teal-800 pb-2 flex justify-between items-center">
              <div>
                <span className="text-[8px] font-black uppercase text-teal-400 tracking-widest block">Neural yield projections</span>
                <h3 className="text-xs font-bold text-white mt-0.5">AI Yield Impact Prediction</h3>
              </div>
              <Sparkles className="h-4.5 w-4.5 text-teal-400" />
            </div>

            <div className="flex items-center justify-between bg-teal-900/40 p-3.5 rounded-xl border border-teal-800/80">
              <div className="space-y-1">
                <span className="text-slate-300 text-[9px] block">Relative Biomass Potential</span>
                <span className="text-emerald-400 text-lg font-black">{aiYieldImpact.yieldImpactFactor}%</span>
              </div>
              <div className="text-right text-[9px] font-mono text-slate-300">
                <p>Temp Stress: {aiYieldImpact.severity}</p>
                <p>Moisture: {aiYieldImpact.moistureMetric.split(" ")[0]}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[9px] font-medium text-slate-300 leading-normal">
              {aiYieldImpact.deductions.map((ded, idx) => (
                <p key={idx} className="flex items-start gap-1.5">
                  <span className="text-teal-400 shrink-0">•</span>
                  <span>{ded}</span>
                </p>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE COMPONENT: FORECASTS & SUITABILITY INDICATORS (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">

          {/* 7-DAY FORECAST MATRIX */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">7-Day Predictability Forecast</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Atmospheric models complete with forecast confidence indexes & daily rain volume grids.</p>
            </div>

            {/* Forecast Chart */}
            <div className="h-40 bg-slate-50 border border-slate-150 p-2 rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastDays} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTempMax" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRainVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                  <Area name="Max Temp (°C)" type="monotone" dataKey="tempMax" stroke="#f43f5e" fillOpacity={1} fill="url(#colorTempMax)" strokeWidth={2} />
                  <Area name="Rain Vol (mm)" type="monotone" dataKey="rainVolumeMm" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorRainVolume)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast table list with Confidence Scores */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {forecastDays.map((fd, idx) => (
                <div key={idx} className="bg-white border border-slate-150 hover:bg-slate-50/50 p-2.5 rounded-lg flex justify-between items-center text-[10px] font-semibold transition-colors">
                  <div className="w-10">
                    <span className="text-slate-900 font-extrabold block">{fd.day}</span>
                    <span className="text-slate-400 text-[8px]">{fd.condition}</span>
                  </div>
                  <div className="flex gap-4 font-mono">
                    <div className="text-right">
                      <span className="text-slate-400 text-[7px] uppercase font-bold block">Temp range</span>
                      <span className="text-slate-800">{fd.tempMax}° / {fd.tempMin}°</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[7px] uppercase font-bold block">Rain Prob</span>
                      <span className="text-sky-600">{fd.rainProbability}% ({fd.rainVolumeMm.toFixed(1)}mm)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[7px] uppercase font-bold block">Confidence</span>
                      <span className="text-emerald-700 font-bold">{fd.confidenceScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SUITABILITY SCORE MATRICES & HISTORICAL TRENDS (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">

          {/* SUITABILITY SCORE MATRICES */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Crop Operations suitability</h3>
              <p className="text-[9.5px] text-slate-400 mt-0.5">Live assessment of planting and chemical application windows based on weather feeds.</p>
            </div>

            <div className="space-y-3.5">
              {/* 1. Spraying Suitability */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Chemical Spraying:</span>
                  <span className={`text-[9px] font-black uppercase ${
                    weatherSuitability.spraying.status === "Highly Optimal"
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}>
                    {weatherSuitability.spraying.status}
                  </span>
                </div>
                <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${weatherSuitability.spraying.score}%` }} />
                </div>
                <div className="text-[8.5px] text-slate-500 font-medium space-y-0.5 pl-1.5 pt-1">
                  {weatherSuitability.spraying.reasons.map((r, i) => (
                    <p key={i}>{r}</p>
                  ))}
                </div>
              </div>

              {/* 2. Planting Suitability */}
              <div className="space-y-1 text-xs pt-2.5 border-t border-slate-100">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Seedling Planting:</span>
                  <span className="text-[9px] font-black uppercase text-emerald-700">
                    {weatherSuitability.planting.status}
                  </span>
                </div>
                <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${weatherSuitability.planting.score}%` }} />
                </div>
                <div className="text-[8.5px] text-slate-500 font-medium space-y-0.5 pl-1.5 pt-1">
                  {weatherSuitability.planting.reasons.map((r, i) => (
                    <p key={i}>{r}</p>
                  ))}
                </div>
              </div>

              {/* 3. Harvesting Suitability */}
              <div className="space-y-1 text-xs pt-2.5 border-t border-slate-100">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Harvest Window:</span>
                  <span className={`text-[9px] font-black uppercase ${
                    weatherSuitability.harvesting.status === "Optimal Window"
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}>
                    {weatherSuitability.harvesting.status}
                  </span>
                </div>
                <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${weatherSuitability.harvesting.score}%` }} />
                </div>
                <div className="text-[8.5px] text-slate-500 font-medium space-y-0.5 pl-1.5 pt-1">
                  {weatherSuitability.harvesting.reasons.map((r, i) => (
                    <p key={i}>{r}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HISTORICAL PATTERNS CORRELATION */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Historical Weather Trends</h3>
              <p className="text-[9.5px] text-slate-400">Monthly monsoon patterns & solar pump hours mapped to historical yield databases.</p>
            </div>

            <div className="h-28 bg-slate-50 border border-slate-150 p-1 rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalPatterns} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={8} />
                  <Tooltip contentStyle={{ fontSize: "9px" }} />
                  <Bar name="Rainfall (mm)" dataKey="rainfallMm" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[8.5px] font-medium text-slate-500 text-center leading-normal">
              ⚠ Historic July monsoons average <strong className="text-slate-700">260mm</strong>. Prioritize ditch maintenance before intense rainfall.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
