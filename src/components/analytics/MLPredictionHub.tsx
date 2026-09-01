import React, { useState, useMemo, useEffect } from "react";
import {
  BrainCircuit,
  TrendingUp,
  Sliders,
  Play,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  Droplets,
  Calendar,
  DollarSign,
  ShieldAlert,
  Clock,
  Gauge,
  Cpu,
  RefreshCw,
  Search,
  BookOpen,
  UserCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface MLPredictionHubProps {
  currentPhase: string; // e.g. "Farmer", "Buyer", "Government", etc.
}

type MLAlgorithm = "Random Forest Ensemble" | "LSTM Recurrent Network" | "XGBoost Regressor" | "Transformer Attention Model";

export default function MLPredictionHub({ currentPhase }: MLPredictionHubProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>(currentPhase);
  const [algorithm, setAlgorithm] = useState<MLAlgorithm>("LSTM Recurrent Network");
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [trainingLoss, setTrainingLoss] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"predictions" | "training" | "feature_importance">("predictions");

  // Keep selected phase in sync with parent's active view tab, but let user switch manually as well!
  useEffect(() => {
    setSelectedPhase(currentPhase);
  }, [currentPhase]);

  // --- INTERACTIVE ML INPUT PARAMETERS (per phase) ---
  // 1. Farmer Inputs
  const [soilMoisture, setSoilMoisture] = useState<number>(42);
  const [airHumidity, setAirHumidity] = useState<number>(65);
  const [avgTemp, setAvgTemp] = useState<number>(28);
  const [nitrogenLevel, setNitrogenLevel] = useState<number>(45);

  // 2. Buyer Inputs
  const [globalDemandScore, setGlobalDemandScore] = useState<number>(82);
  const [nationalReserves, setNationalReserves] = useState<number>(60); // % filled
  const [inflationRate, setInflationRate] = useState<number>(4.2);

  // 3. Government Inputs
  const [subsidyClaimAmount, setSubsidyClaimAmount] = useState<number>(150000);
  const [applicantCreditHistory, setApplicantCreditHistory] = useState<number>(710);
  const [satelliteMatchScore, setSatelliteMatchScore] = useState<number>(85); // % confidence matching crop density

  // 4. Supplier Inputs
  const [basePrice, setBasePrice] = useState<number>(45);
  const [competitorStockLevel, setCompetitorStockLevel] = useState<string>("Low");
  const [regionalFarmersCount, setRegionalFarmersCount] = useState<number>(240);

  // 5. Expert Inputs
  const [microscopicSporeDensity, setMicroscopicSporeDensity] = useState<number>(120); // per mm2
  const [windVelocity, setWindVelocity] = useState<number>(18); // km/h
  const [canopyDensity, setCanopyDensity] = useState<number>(75); // % leaf area index

  // 6. Logistics & Warehouse Inputs
  const [siloFillRate, setSiloFillRate] = useState<number>(88); // %
  const [warehouseVentilationRate, setWarehouseVentilationRate] = useState<number>(4.5); // air turnovers / hr
  const [transitDistance, setTransitDistance] = useState<number>(120); // km

  // 7. Bank & Finance Inputs
  const [loanDurationMonths, setLoanDurationMonths] = useState<number>(18);
  const [farmerDebtToIncome, setFarmerDebtToIncome] = useState<number>(32); // %
  const [historicalDisasterFrequency, setHistoricalDisasterFrequency] = useState<number>(1); // events in last 5 years

  // 8. Researcher & Extension Inputs
  const [cropGenomeDiversity, setCropGenomeDiversity] = useState<number>(94); // % index
  const [soilOrganicCarbon, setSoilOrganicCarbon] = useState<number>(2.4); // %
  const [workshopPromotionalBudget, setWorkshopPromotionalBudget] = useState<number>(500); // USD

  // 9. Admin Inputs
  const [apiGatewayConcurrence, setApiGatewayConcurrence] = useState<number>(1800); // requests / min
  const [nodeClusterCpu, setNodeClusterCpu] = useState<number>(42); // %
  const [databaseIndexesCount, setDatabaseIndexesCount] = useState<number>(12);

  // --- SIMULATE MODEL RUN TRAINING SEQUENCE ---
  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLoss([]);
    
    let currentProgress = 0;
    let initialLoss = 0.85;
    const losses: number[] = [];

    const interval = setInterval(() => {
      currentProgress += 4;
      if (currentProgress <= 100) {
        setTrainingProgress(currentProgress);
        initialLoss = Math.max(0.04, parseFloat((initialLoss - Math.random() * 0.08 + 0.02).toFixed(4)));
        losses.push(initialLoss);
        setTrainingLoss([...losses]);
      } else {
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 100);
  };

  // --- DYNAMIC PREDICTION METRICS AND CHARTS COMPUTED VALUES ---
  const outputs = useMemo(() => {
    let algorithmMultiplier = 1.0;
    if (algorithm === "LSTM Recurrent Network") algorithmMultiplier = 1.05;
    if (algorithm === "XGBoost Regressor") algorithmMultiplier = 1.02;
    if (algorithm === "Transformer Attention Model") algorithmMultiplier = 1.08;

    switch (selectedPhase) {
      case "Farmer": {
        // Soil Moisture and disease forecasting
        const moistureTrend = Math.max(10, soilMoisture - (avgTemp * 0.4) - (nitrogenLevel * 0.1) + (airHumidity * 0.2));
        const blightProbability = Math.min(100, Math.max(0, (airHumidity * 0.8) + (avgTemp * 0.6) - (soilMoisture * 0.3)));
        const predictedYieldTons = parseFloat((12.5 * algorithmMultiplier * (soilMoisture / 50) * (nitrogenLevel / 45)).toFixed(2));
        
        const chartData = [
          { name: "Day 1", Hydration: soilMoisture, "Outbreak Risk": blightProbability * 0.7 },
          { name: "Day 2", Hydration: Math.max(10, soilMoisture - 3), "Outbreak Risk": Math.min(100, blightProbability * 0.8) },
          { name: "Day 3", Hydration: Math.max(10, soilMoisture - 6), "Outbreak Risk": Math.min(100, blightProbability * 0.9) },
          { name: "Day 4", Hydration: Math.max(10, soilMoisture - 9), "Outbreak Risk": blightProbability },
          { name: "Day 5", Hydration: moistureTrend, "Outbreak Risk": Math.min(100, blightProbability * 1.1) }
        ];

        return {
          moistureTrend: moistureTrend.toFixed(1),
          blightProbability: blightProbability.toFixed(0),
          predictedYieldTons,
          confidence: (95 - blightProbability * 0.2).toFixed(1),
          chartData,
          keys: ["Hydration", "Outbreak Risk"],
          colors: ["#3b82f6", "#ef4444"]
        };
      }

      case "Buyer": {
        // Commodity price indices and delivery default risks
        const basePriceIndex = 620;
        const demandIndexImpact = (globalDemandScore - 50) * 4;
        const reservesImpact = (100 - nationalReserves) * 3;
        const projectedPrice = Math.round((basePriceIndex + demandIndexImpact + reservesImpact) * algorithmMultiplier * (1 + inflationRate / 100));
        
        const deliveryBreachRisk = Math.min(95, Math.max(5, (100 - nationalReserves) * 0.8 + inflationRate * 3));

        const chartData = [
          { name: "Week 1", "Price Index ($)": projectedPrice * 0.95, "Demand Factor": globalDemandScore * 0.8 },
          { name: "Week 2", "Price Index ($)": projectedPrice * 0.98, "Demand Factor": globalDemandScore * 0.9 },
          { name: "Week 3", "Price Index ($)": projectedPrice * 1.01, "Demand Factor": globalDemandScore },
          { name: "Week 4", "Price Index ($)": projectedPrice, "Demand Factor": globalDemandScore * 1.05 }
        ];

        return {
          projectedPrice,
          deliveryBreachRisk: deliveryBreachRisk.toFixed(1),
          marketVibe: projectedPrice > 650 ? "Bullish (Supplies tightening)" : "Bearish (Abundant reserves)",
          confidence: (92 - inflationRate).toFixed(1),
          chartData,
          keys: ["Price Index ($)", "Demand Factor"],
          colors: ["#0d9488", "#f59e0b"]
        };
      }

      case "Government": {
        // Fraud score classifier and drought propagation index
        const fraudRiskScore = Math.min(100, Math.max(0, (subsidyClaimAmount / 50000) * 8 + (750 - applicantCreditHistory) * 0.15 + (100 - satelliteMatchScore) * 0.7));
        const estimatedAquiferStress = Math.min(100, Math.max(10, (100 - satelliteMatchScore) * 0.6 + (subsidyClaimAmount > 100000 ? 25 : 5)));

        const chartData = [
          { name: "Claim Tier A", "Audit Fraud risk": fraudRiskScore * 0.4 },
          { name: "Claim Tier B", "Audit Fraud risk": fraudRiskScore * 0.7 },
          { name: "Claim Tier C", "Audit Fraud risk": fraudRiskScore },
          { name: "Claim Tier D", "Audit Fraud risk": Math.min(100, fraudRiskScore * 1.2) }
        ];

        return {
          fraudRiskScore: fraudRiskScore.toFixed(0),
          estimatedAquiferStress: estimatedAquiferStress.toFixed(0),
          regulatoryVerdict: fraudRiskScore > 70 ? "HIGH RISK: Trigger Manual Audit" : "LOW RISK: Auto-Approve Subsidy Release",
          confidence: satelliteMatchScore.toFixed(1),
          chartData,
          keys: ["Audit Fraud risk"],
          colors: ["#dc2626"]
        };
      }

      case "Supplier": {
        // Dynamic pricing elasticity & inventory run-out dates
        const demandElasticity = parseFloat((1.4 * (regionalFarmersCount / 150) * (competitorStockLevel === "Low" ? 1.3 : 0.8)).toFixed(2));
        const daysToOut = Math.max(3, Math.round(180 / (regionalFarmersCount * 0.05 + (competitorStockLevel === "Low" ? 4 : 1))));
        const optimalPrice = parseFloat((basePrice * (1 + (demandElasticity - 1) * 0.5)).toFixed(2));

        const chartData = [
          { name: "SKU Unit Price", "Elasticity Ratio": demandElasticity, "Optimal Retail Price": optimalPrice },
          { name: "SKU Unit Price +10%", "Elasticity Ratio": demandElasticity * 0.9, "Optimal Retail Price": optimalPrice * 1.05 },
          { name: "SKU Unit Price +25%", "Elasticity Ratio": demandElasticity * 0.7, "Optimal Retail Price": optimalPrice * 1.12 }
        ];

        return {
          demandElasticity,
          daysToOut,
          optimalPrice,
          confidence: (88 + demandElasticity * 2).toFixed(1),
          chartData,
          keys: ["Elasticity Ratio", "Optimal Retail Price"],
          colors: ["#6366f1", "#10b981"]
        };
      }

      case "Expert": {
        // Pathogen spread vector models
        const sporeTrajectorySpeed = parseFloat(((windVelocity * 1.2) + (microscopicSporeDensity * 0.05)).toFixed(1));
        const transmissionIndex = Math.min(10.0, parseFloat(((microscopicSporeDensity * 0.04) + (canopyDensity * 0.03)).toFixed(2)));
        
        const chartData = [
          { name: "Hour 0", "Spore Spreading Velocity": windVelocity },
          { name: "Hour 6", "Spore Spreading Velocity": windVelocity * 1.1 },
          { name: "Hour 12", "Spore Spreading Velocity": windVelocity * 1.3 },
          { name: "Hour 18", "Spore Spreading Velocity": sporeTrajectorySpeed }
        ];

        return {
          sporeTrajectorySpeed,
          transmissionIndex,
          biosecurityThreat: transmissionIndex > 7.0 ? "CRITICAL OUTBREAK DETECTED" : "NORMAL FLUCTUATION CANOPY",
          confidence: (94 - windVelocity * 0.3).toFixed(1),
          chartData,
          keys: ["Spore Spreading Velocity"],
          colors: ["#e11d48"]
        };
      }

      case "Logistics":
      case "Warehouse":
      case "LogisticsAndWarehouse": {
        // Silo moisture rot risk and delivery delay models
        const moldSpoilageProbability = Math.min(100, Math.max(0, (siloFillRate * 0.5) - (warehouseVentilationRate * 8) + 30));
        const etaHours = parseFloat(((transitDistance / 60) * 1.1 + (siloFillRate > 85 ? 1.5 : 0.5)).toFixed(1));

        const chartData = [
          { name: "Day 1", "Rot Hazard Index": moldSpoilageProbability * 0.6 },
          { name: "Day 3", "Rot Hazard Index": moldSpoilageProbability * 0.8 },
          { name: "Day 5", "Rot Hazard Index": moldSpoilageProbability },
          { name: "Day 7", "Rot Hazard Index": Math.min(100, moldSpoilageProbability * 1.25) }
        ];

        return {
          moldSpoilageProbability: moldSpoilageProbability.toFixed(1),
          etaHours,
          dispatchVerdict: moldSpoilageProbability > 60 ? "CRITICAL: Aeration blower trigger mandated" : "STABLE: Silo parameters ideal",
          confidence: (96 - moldSpoilageProbability * 0.1).toFixed(1),
          chartData,
          keys: ["Rot Hazard Index"],
          colors: ["#0284c7"]
        };
      }

      case "Bank":
      case "Insurance":
      case "FinanceAndInsurance": {
        // Default classifiers and actuarial loss ratios
        const defaultRiskProbability = Math.min(99, Math.max(1, (farmerDebtToIncome * 1.5) + (historicalDisasterFrequency * 18) - (loanDurationMonths * 0.2)));
        const adjustedPremiumRate = parseFloat((3.5 + (historicalDisasterFrequency * 2.2) + (farmerDebtToIncome * 0.08)).toFixed(2));

        const chartData = [
          { name: "Base Scenario", "Default Risk Rate": defaultRiskProbability * 0.8, "Loss Ratio Index": farmerDebtToIncome },
          { name: "Severe Monsoon", "Default Risk Rate": defaultRiskProbability * 1.2, "Loss Ratio Index": farmerDebtToIncome * 1.3 },
          { name: "Extreme Drought", "Default Risk Rate": Math.min(100, defaultRiskProbability * 1.6), "Loss Ratio Index": farmerDebtToIncome * 1.8 }
        ];

        return {
          defaultRiskProbability: defaultRiskProbability.toFixed(1),
          adjustedPremiumRate,
          creditVerdict: defaultRiskProbability > 55 ? "HIGH DEFAULT INDEX: Require crop-insurance bond pledge" : "APPROVED: Premium low risk status",
          confidence: (94 - historicalDisasterFrequency * 5).toFixed(1),
          chartData,
          keys: ["Default Risk Rate", "Loss Ratio Index"],
          colors: ["#16a34a", "#db2777"]
        };
      }

      case "Researcher":
      case "Extension":
      case "ResearchAndExtension": {
        // Genomic performance fitting and attendance modeling
        const yieldEnhancementRatio = parseFloat(((soilOrganicCarbon * 15) + (cropGenomeDiversity * 0.15)).toFixed(1));
        const projectedWorkshopTurnout = Math.min(80, Math.round(15 + (workshopPromotionalBudget * 0.08) + (soilOrganicCarbon * 5)));

        const chartData = [
          { name: "Silt Loam", "Enhancement Ratio (%)": yieldEnhancementRatio * 0.8 },
          { name: "Clay Soil", "Enhancement Ratio (%)": yieldEnhancementRatio },
          { name: "Sandy Land", "Enhancement Ratio (%)": yieldEnhancementRatio * 0.4 }
        ];

        return {
          yieldEnhancementRatio,
          projectedWorkshopTurnout,
          extensionVerdict: yieldEnhancementRatio > 25 ? "Highly Recommended Varietal Fit" : "Marginal Advantage over Traditional landraces",
          confidence: cropGenomeDiversity.toFixed(1),
          chartData,
          keys: ["Enhancement Ratio (%)"],
          colors: ["#4f46e5"]
        };
      }

      default: {
        // Admin: API anomalous logs forecasting
        const congestionRatio = Math.min(100, Math.max(1, (apiGatewayConcurrence / 2000) * 35 + (nodeClusterCpu * 0.8)));
        const queryExecutionOptimizationGain = Math.round(databaseIndexesCount * 4.2 + (nodeClusterCpu < 50 ? 15 : 2));

        const chartData = [
          { name: "00:00", "Gateway Congestion %": congestionRatio * 0.5, "CPU Overhead %": nodeClusterCpu * 0.6 },
          { name: "06:00", "Gateway Congestion %": congestionRatio * 0.7, "CPU Overhead %": nodeClusterCpu * 0.8 },
          { name: "12:00", "Gateway Congestion %": congestionRatio, "CPU Overhead %": nodeClusterCpu },
          { name: "18:00", "Gateway Congestion %": congestionRatio * 0.9, "CPU Overhead %": nodeClusterCpu * 0.95 }
        ];

        return {
          congestionRatio: congestionRatio.toFixed(1),
          queryExecutionOptimizationGain,
          adminVerdict: congestionRatio > 80 ? "ALERT: Autoscaling cluster node replica spinup recommended" : "GATEWAYS OPTIMAL: Low cluster load",
          confidence: (99 - congestionRatio * 0.15).toFixed(1),
          chartData,
          keys: ["Gateway Congestion %", "CPU Overhead %"],
          colors: ["#6366f1", "#f43f5e"]
        };
      }
    }
  }, [
    selectedPhase,
    algorithm,
    soilMoisture, airHumidity, avgTemp, nitrogenLevel,
    globalDemandScore, nationalReserves, inflationRate,
    subsidyClaimAmount, applicantCreditHistory, satelliteMatchScore,
    basePrice, competitorStockLevel, regionalFarmersCount,
    microscopicSporeDensity, windVelocity, canopyDensity,
    siloFillRate, warehouseVentilationRate, transitDistance,
    loanDurationMonths, farmerDebtToIncome, historicalDisasterFrequency,
    cropGenomeDiversity, soilOrganicCarbon, workshopPromotionalBudget,
    apiGatewayConcurrence, nodeClusterCpu, databaseIndexesCount
  ]);

  // Feature Importance data (static but beautiful representation based on selected phase)
  const featureImportances = useMemo(() => {
    switch (selectedPhase) {
      case "Farmer":
        return [
          { name: "Air Humidity", weight: 45, impact: "Positive" },
          { name: "Average Temperature", weight: 28, impact: "Positive" },
          { name: "Soil Hydration Level", weight: 18, impact: "Negative" },
          { name: "Soil Nitrogen Ratio", weight: 9, impact: "Positive" }
        ];
      case "Buyer":
        return [
          { name: "Global Demand Score", weight: 52, impact: "Positive" },
          { name: "National Reserves Fill %", weight: 32, impact: "Negative" },
          { name: "Regional Inflation Index", weight: 16, impact: "Positive" }
        ];
      case "Government":
        return [
          { name: "Claim Subsidy Amount", weight: 42, impact: "Positive" },
          { name: "Satellite Crop Index Match", weight: 38, impact: "Negative" },
          { name: "Applicant Credit Score", weight: 20, impact: "Negative" }
        ];
      default:
        return [
          { name: "Ecosystem Telemetry Volume", weight: 48, impact: "Positive" },
          { name: "Node CPU & Memory Stress", weight: 35, impact: "Positive" },
          { name: "Index Optimization Count", weight: 17, impact: "Negative" }
        ];
    }
  }, [selectedPhase]);

  const phasesList = [
    "Farmer",
    "Buyer",
    "Government",
    "Supplier",
    "Expert",
    "Logistics",
    "Bank",
    "Researcher",
    "Admin"
  ];

  return (
    <div id="ml-prediction-hub" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      {/* Header and Phase Switcher */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
              <BrainCircuit className="h-5 w-5 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              Agricultural ML Prognosis Suite & Inference Co-Pilot
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Phase-by-Phase Interactive Neural Estimators & Deep Learning Forecast Engines
          </p>
        </div>

        {/* Algorithm selection */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Engine:</span>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as MLAlgorithm)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="LSTM Recurrent Network">LSTM RNN (Sequential Temporal)</option>
            <option value="Random Forest Ensemble">Random Forest (Bagging Tree Ensemble)</option>
            <option value="XGBoost Regressor">XGBoost (Gradient Boosted Regressor)</option>
            <option value="Transformer Attention Model">Transformer (Self-Attention Layer)</option>
          </select>
        </div>
      </div>

      {/* Cross-Phase Quick Navigation Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-thin">
        <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md shrink-0">
          Cross-Phase Explorer
        </span>
        {phasesList.map((ph) => (
          <button
            key={ph}
            onClick={() => setSelectedPhase(ph)}
            className={`px-3 py-1 text-[11px] font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
              selectedPhase === ph
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {ph} Phase
          </button>
        ))}
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-slate-150/60 pb-1 gap-4">
        <button
          onClick={() => setActiveTab("predictions")}
          className={`pb-2 text-xs font-bold transition-all cursor-pointer border-b-2 px-1 ${
            activeTab === "predictions"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          🔮 Interactive Prognosis Models
        </button>
        <button
          onClick={() => setActiveTab("training")}
          className={`pb-2 text-xs font-bold transition-all cursor-pointer border-b-2 px-1 ${
            activeTab === "training"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          ⚙️ Model Hyperparameter Training
        </button>
        <button
          onClick={() => setActiveTab("feature_importance")}
          className={`pb-2 text-xs font-bold transition-all cursor-pointer border-b-2 px-1 ${
            activeTab === "feature_importance"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          📊 Feature Weights (SHAP Analysis)
        </button>
      </div>

      {/* TAB CONTENT: 1. PREDICTIONS */}
      {activeTab === "predictions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Parameter Sliders Panel */}
          <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-150 p-4 space-y-4 shadow-inner">
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2.5">
              <Sliders className="h-4 w-4 text-indigo-600" />
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                Inference Inputs: {selectedPhase} Mode
              </h4>
            </div>

            {/* FARMER PHASE SLIDERS */}
            {selectedPhase === "Farmer" && (
              <div className="space-y-4 text-xs font-medium text-slate-600">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Soil Moisture (Hydration)</span>
                    <span className="text-indigo-600 font-mono">{soilMoisture}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={soilMoisture}
                    onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Air Canopy Humidity</span>
                    <span className="text-indigo-600 font-mono">{airHumidity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={airHumidity}
                    onChange={(e) => setAirHumidity(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Avg Ambient Temp</span>
                    <span className="text-indigo-600 font-mono">{avgTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={avgTemp}
                    onChange={(e) => setAvgTemp(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Soil Nitrogen Ratio</span>
                    <span className="text-indigo-600 font-mono">{nitrogenLevel} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="95"
                    value={nitrogenLevel}
                    onChange={(e) => setNitrogenLevel(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* BUYER PHASE SLIDERS */}
            {selectedPhase === "Buyer" && (
              <div className="space-y-4 text-xs font-medium text-slate-600">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Global Demand Index</span>
                    <span className="text-indigo-600 font-mono">{globalDemandScore}/100</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={globalDemandScore}
                    onChange={(e) => setGlobalDemandScore(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>National Reserves Level</span>
                    <span className="text-indigo-600 font-mono">{nationalReserves}% Capacity</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={nationalReserves}
                    onChange={(e) => setNationalReserves(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Regional Inflation rate</span>
                    <span className="text-indigo-600 font-mono">{inflationRate}% CPI</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.5"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* GOVERNMENT PHASE SLIDERS */}
            {selectedPhase === "Government" && (
              <div className="space-y-4 text-xs font-medium text-slate-600">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Subsidy claim value</span>
                    <span className="text-indigo-600 font-mono">${subsidyClaimAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={subsidyClaimAmount}
                    onChange={(e) => setSubsidyClaimAmount(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Applicant Credit Score</span>
                    <span className="text-indigo-600 font-mono">{applicantCreditHistory} Pts</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="850"
                    value={applicantCreditHistory}
                    onChange={(e) => setApplicantCreditHistory(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Satellite crop Match</span>
                    <span className="text-indigo-600 font-mono">{satelliteMatchScore}% Fit</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={satelliteMatchScore}
                    onChange={(e) => setSatelliteMatchScore(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* GENERAL FALLBACK OR OTHER PHASE SLIDERS */}
            {!["Farmer", "Buyer", "Government"].includes(selectedPhase) && (
              <div className="space-y-4 text-xs font-medium text-slate-600">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Multi-Factor Tuning Matrix</p>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Standard Load Metric</span>
                    <span className="text-indigo-600 font-mono">High Ratio</span>
                  </div>
                  <div className="p-2.5 bg-white border rounded-xl text-[10px] text-slate-400 leading-relaxed font-semibold">
                    Interactive ML engines for {selectedPhase} use dynamic seed values linked directly to current hub registries!
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>System Stability Parameter</span>
                    <span className="text-emerald-600 font-mono">98.2% Accurate</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t">
              <button
                onClick={handleTrainModel}
                disabled={isTraining}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-900/10 transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isTraining ? "animate-spin" : ""}`} />
                Re-Train Model with Inputs
              </button>
            </div>
          </div>

          {/* Inference Prognosis Output Display */}
          <div className="lg:col-span-8 space-y-5">
            {/* Model Outputs Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedPhase === "Farmer" && (
                <>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-blue-500 uppercase">5-Day Hydration Forecast</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">{outputs.moistureTrend}%</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Expected soil moisture after air evapotranspiration.</p>
                  </div>
                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-rose-500 uppercase">Disease Outbreak Probability</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">{outputs.blightProbability}%</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Pathogen dispersion vector threshold calculated.</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">Neural Net Predicted Yield</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">{outputs.predictedYieldTons} Tons</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Simulated LSTM production over land size acreage.</p>
                  </div>
                </>
              )}

              {selectedPhase === "Buyer" && (
                <>
                  <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-teal-600 uppercase">Target Crop Price Forecast</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">${outputs.projectedPrice} <span className="text-[10px] text-slate-400">/ton</span></h5>
                    <p className="text-[10px] text-slate-500 mt-1">Supply-demand balanced commodity baseline.</p>
                  </div>
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-amber-600 uppercase">Delivery SLA Breach Risk</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">{outputs.deliveryBreachRisk}%</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Probability of logistical delays or crop damage.</p>
                  </div>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">Commodity Market Trend</span>
                    <h5 className="text-xs font-bold text-slate-800 mt-1.5">{outputs.marketVibe}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Derived from attention layers.</p>
                  </div>
                </>
              )}

              {selectedPhase === "Government" && (
                <>
                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-rose-600 uppercase">Claim Fraud Probability</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">{outputs.fraudRiskScore}%</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Claim verification vs satellite indexes.</p>
                  </div>
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-amber-600 uppercase">Regional Aquifer Stress</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">{outputs.estimatedAquiferStress}%</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Estimated aquifer draw down probability.</p>
                  </div>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">Automated Verdict</span>
                    <h5 className="text-[11px] font-black text-slate-800 mt-1.5">{outputs.regulatoryVerdict}</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Smart policy execution trigger status.</p>
                  </div>
                </>
              )}

              {!["Farmer", "Buyer", "Government"].includes(selectedPhase) && (
                <>
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Predictive Confidence</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1 font-mono">{outputs.confidence}%</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Expected accuracy score of active algorithm.</p>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">Ecosystem Advantage Index</span>
                    <h5 className="text-lg font-black text-indigo-800 mt-1 font-mono">+{outputs.queryExecutionOptimizationGain || 35}%</h5>
                    <p className="text-[10px] text-indigo-700 mt-1">Estimated productivity gain with co-pilot optimization.</p>
                  </div>
                  <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
                    <span className="text-[9px] font-bold text-teal-600 uppercase">SLA Compliance Health</span>
                    <h5 className="text-xs font-black text-teal-800 mt-1.5 truncate">{outputs.adminVerdict || outputs.dispatchVerdict || outputs.creditVerdict || "System Optimal"}</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Current automated ecosystem health state.</p>
                  </div>
                </>
              )}
            </div>

            {/* Dynamic Forecast Recharts Curve */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="h-4 w-4 text-indigo-600" />
                  Neural Network Timeline Projection Sequence
                </span>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-mono">
                  Algorithm: {algorithm}
                </span>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={outputs.chartData}>
                    <defs>
                      <linearGradient id="colorKey0" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={outputs.colors[0]} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={outputs.colors[0]} stopOpacity={0}/>
                      </linearGradient>
                      {outputs.colors[1] && (
                        <linearGradient id="colorKey1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={outputs.colors[1]} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={outputs.colors[1]} stopOpacity={0}/>
                        </linearGradient>
                      )}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 10, fontWeight: "bold" }} />
                    <YAxis stroke="#64748b" style={{ fontSize: 10, fontWeight: "bold" }} />
                    <Tooltip contentStyle={{ fontSize: 11, fontWeight: "bold", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                    <Area
                      type="monotone"
                      dataKey={outputs.keys[0]}
                      stroke={outputs.colors[0]}
                      fillOpacity={1}
                      fill="url(#colorKey0)"
                      strokeWidth={2.5}
                    />
                    {outputs.keys[1] && (
                      <Area
                        type="monotone"
                        dataKey={outputs.keys[1]}
                        stroke={outputs.colors[1]}
                        fillOpacity={1}
                        fill="url(#colorKey1)"
                        strokeWidth={2.5}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 p-3.5 rounded-xl text-[10px] leading-relaxed font-semibold">
              🎯 <span className="font-extrabold uppercase">Ecosystem Intelligence:</span> Sliders automatically feed parameters straight into the active model logic. Try updating input weights above to visualize dynamic shifts across live sequence forecasts!
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. HYPERPARAMETER TRAINING */}
      {activeTab === "training" && (
        <div className="bg-slate-50 border rounded-2xl p-6 shadow-inner space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                Live Tensor Training and Loss Optimization Terminal
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Execute deep learning backpropagation cycles to optimize weights for {selectedPhase} variables.
              </p>
            </div>

            <button
              onClick={handleTrainModel}
              disabled={isTraining}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-emerald-400 font-mono text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all border border-slate-700"
            >
              <Play className="h-3 w-3 fill-current" />
              RUN BACKPROPAGATION (EPOCHS: 50)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Console Log screen */}
            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed space-y-2 h-[220px] overflow-y-auto">
              <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1 flex justify-between">
                <span>EPOCH TRAINER LOG</span>
                <span className="text-indigo-400 uppercase">Engine Ready</span>
              </div>
              {trainingProgress === 0 && !isTraining ? (
                <div className="text-slate-500 py-10 text-center">
                  Click 'RUN BACKPROPAGATION' to initiate gradient descent sequence and observe local minimum convergence.
                </div>
              ) : (
                <>
                  <div className="text-indigo-400">[INFO] Initializing PyTorch-equivalent JS engine compiler...</div>
                  <div className="text-indigo-400">[INFO] Mapping dataset vectors for '{selectedPhase}' metrics...</div>
                  {trainingLoss.map((loss, idx) => (
                    <div key={idx} className="text-slate-300">
                      Epoch {(idx + 1) * 2}/50 ──── loss: <span className="text-emerald-400 font-bold">{loss}</span> ──── accuracy: <span className="text-indigo-300 font-bold">{(90 + (100 - loss * 100) * 0.1).toFixed(2)}%</span>
                    </div>
                  ))}
                  {trainingProgress === 100 && (
                    <div className="text-emerald-400 font-bold border-t border-emerald-950/40 pt-2.5 mt-2 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> [SUCCESS] Convergence reached. Model successfully exported as tf.GraphModel to localized sandbox.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Convergence Chart */}
            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-emerald-600" />
                In-browser Loss Convergence Curve (Mean Squared Error)
              </span>

              {trainingLoss.length === 0 ? (
                <div className="text-slate-400 text-center py-12 text-[11px] font-semibold">
                  No convergence curve available. Run model training sequence first.
                </div>
              ) : (
                <div className="h-[140px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trainingLoss.map((l, i) => ({ epoch: `Ep ${i*2}`, "Training Loss": l }))}>
                      <XAxis dataKey="epoch" stroke="#94a3b8" style={{ fontSize: 8 }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: 8 }} />
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                      <Line type="monotone" dataKey="Training Loss" stroke="#4f46e5" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {isTraining && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>Backpropagation Progress</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border">
                    <div className="h-full bg-indigo-600 animate-pulse" style={{ width: `${trainingProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. FEATURE IMPORTANCES */}
      {activeTab === "feature_importance" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-50 border rounded-2xl p-4 space-y-4 shadow-inner">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-indigo-600" />
              SHAP Value Analysis & Feature Weights
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              SHAP (SHapley Additive exPlanations) weights determine how much each input variable moves the neural network’s predictive baseline.
            </p>

            <div className="space-y-3.5">
              {featureImportances.map((feat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>{feat.name}</span>
                    <span className="text-indigo-600 font-mono">Weight: {feat.weight}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${feat.impact === "Positive" ? "bg-indigo-600" : "bg-amber-500"}`}
                      style={{ width: `${feat.weight}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold uppercase">
                    <span>Impact Vector: {feat.impact}</span>
                    <span>Rank #{idx + 1} Contribution</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
              Relative Feature Weight Contribution Diagram
            </span>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportances}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 9, fontWeight: "bold" }} />
                  <YAxis stroke="#64748b" style={{ fontSize: 9, fontWeight: "bold" }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  <Bar dataKey="weight" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
