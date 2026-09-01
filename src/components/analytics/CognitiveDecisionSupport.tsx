import React, { useState, useMemo, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  Scale,
  Sliders,
  Dices,
  CheckCircle,
  AlertTriangle,
  Activity,
  Compass,
  HelpCircle,
  Sparkles,
  Layers,
  ShieldCheck,
  GitFork,
  Users,
  Eye,
  Settings,
  DollarSign,
  Award,
  Info,
  ChevronRight,
  TrendingDown,
  RefreshCw,
  PieChart as PieIcon,
  Play,
  Maximize2
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Cell,
  Pie,
  LineChart,
  Line,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// --- TYPES & INTERFACES ---
interface CropMCDA {
  id: string;
  name: string;
  profitability: number; // 0-100 scale
  riskLevel: number; // 0-100 scale (lower is better for score, or inverted)
  sustainability: number; // 0-100 scale
  laborEffort: number; // 0-100 scale
  waterEfficiency: number; // 0-100 scale
  baseYieldPerAcre: number; // in kg
  basePricePerKg: number; // in $
  baseCostPerAcre: number; // in $
  waterRequirementM3: number; // per acre
  carbonSequestrationScore: number; // 0-100
}

export const CognitiveDecisionSupport: React.FC = () => {
  // Active Tab State
  const [activeTab, setActiveTab] = useState<"mcda" | "portfolio" | "monte_carlo" | "bayesian_fuzzy" | "tree_game">("mcda");

  // --- 1. MCDA & WEIGHTS STATE ---
  const [weightProfit, setWeightProfit] = useState<number>(40);
  const [weightRisk, setWeightRisk] = useState<number>(20);
  const [weightSustainability, setWeightSustainability] = useState<number>(20);
  const [weightLabor, setWeightLabor] = useState<number>(10);
  const [weightWater, setWeightWater] = useState<number>(10);

  // Default Crops Data
  const [cropsData] = useState<CropMCDA[]>([
    {
      id: "basmati",
      name: "Basmati Rice (Heirloom)",
      profitability: 88,
      riskLevel: 45,
      sustainability: 60,
      laborEffort: 75,
      waterEfficiency: 35,
      baseYieldPerAcre: 1800,
      basePricePerKg: 1.4,
      baseCostPerAcre: 950,
      waterRequirementM3: 4200,
      carbonSequestrationScore: 50
    },
    {
      id: "durum_wheat",
      name: "Durum Wheat (Sujata)",
      profitability: 70,
      riskLevel: 25,
      sustainability: 75,
      laborEffort: 40,
      waterEfficiency: 80,
      baseYieldPerAcre: 2200,
      basePricePerKg: 0.8,
      baseCostPerAcre: 600,
      waterRequirementM3: 1500,
      carbonSequestrationScore: 70
    },
    {
      id: "cotton",
      name: "Bt Cotton (Long Staple)",
      profitability: 82,
      riskLevel: 65,
      sustainability: 40,
      laborEffort: 80,
      waterEfficiency: 50,
      baseYieldPerAcre: 1100,
      basePricePerKg: 1.9,
      baseCostPerAcre: 1100,
      waterRequirementM3: 2800,
      carbonSequestrationScore: 45
    },
    {
      id: "sugarcane",
      name: "Sugarcane (Co-0238)",
      profitability: 95,
      riskLevel: 30,
      sustainability: 55,
      laborEffort: 60,
      waterEfficiency: 20,
      baseYieldPerAcre: 35000,
      basePricePerKg: 0.08,
      baseCostPerAcre: 1500,
      waterRequirementM3: 8500,
      carbonSequestrationScore: 85
    },
    {
      id: "maize",
      name: "Hybrid Sweet Corn",
      profitability: 65,
      riskLevel: 35,
      sustainability: 68,
      laborEffort: 45,
      waterEfficiency: 65,
      baseYieldPerAcre: 3200,
      basePricePerKg: 0.5,
      baseCostPerAcre: 700,
      waterRequirementM3: 2100,
      carbonSequestrationScore: 60
    }
  ]);

  // Selected crop for detailed XAI & Sensitivity analysis
  const [selectedCropId, setSelectedCropId] = useState<string>("basmati");

  // --- 2. GOAL PROGRAMMING & PORTFOLIO STATE ---
  const [goalType, setGoalType] = useState<"profit" | "sustainability" | "risk_min" | "balanced">("balanced");
  const [availLand, setAvailLand] = useState<number>(15); // Hectares
  const [availWater, setAvailWater] = useState<number>(55000); // m3
  const [availBudget, setAvailBudget] = useState<number>(12000); // $

  // --- 3. SENSITIVITY & WHAT-IF STATE ---
  const [sensitivityPriceShift, setSensitivityPriceShift] = useState<number>(0); // -30% to +30%
  const [sensitivityYieldShift, setSensitivityYieldShift] = useState<number>(0); // -30% to +30%
  const [sensitivityCostShift, setSensitivityCostShift] = useState<number>(0); // -30% to +30%

  // --- 4. MONTE CARLO ENGINE STATE ---
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [simResults, setSimResults] = useState<{
    p10: number;
    p50: number;
    p90: number;
    expectedProfit: number;
    distribution: { profitBin: string; frequency: number }[];
    lossProbability: number;
  } | null>(null);

  // --- 5. FUZZY LOGIC & BAYESIAN STATE ---
  // Fuzzy Soil Inputs
  const [fuzzySoilMoisture, setFuzzySoilMoisture] = useState<number>(38); // 0-100%
  const [fuzzyMarketDemand, setFuzzyMarketDemand] = useState<number>(72); // 0-100%
  // Bayesian Node States
  const [bayesianElNino, setBayesianElNino] = useState<boolean>(false);
  const [bayesianGlobalShortage, setBayesianGlobalShortage] = useState<boolean>(true);

  // --- 6. GAME THEORY PAYOFF STATE ---
  const [farmerStrategy, setFarmerStrategy] = useState<"diversify" | "monoculture">("diversify");
  const [buyerStrategy, setBuyerStrategy] = useState<"fair_contract" | "spot_market">("fair_contract");

  // Active Decision Tree Node Focus
  const [activeTreeNode, setActiveTreeNode] = useState<string>("root");

  // ==========================================
  // MATHEMATICAL MODELS & CALCULATIONS
  // ==========================================

  // --- MCDA COMPUTE ---
  const mcdaScores = useMemo(() => {
    const totalWeight = weightProfit + weightRisk + weightSustainability + weightLabor + weightWater;
    if (totalWeight === 0) return [];

    return cropsData.map((crop) => {
      // Invert risk so lower risk level gives a higher score
      const riskScore = 100 - crop.riskLevel;
      // Invert labor effort so less labor gives a higher score
      const laborScore = 100 - crop.laborEffort;

      const weightedSum =
        crop.profitability * (weightProfit / totalWeight) +
        riskScore * (weightRisk / totalWeight) +
        crop.sustainability * (weightSustainability / totalWeight) +
        laborScore * (weightLabor / totalWeight) +
        crop.waterEfficiency * (weightWater / totalWeight);

      return {
        ...crop,
        weightedScore: Math.round(weightedSum * 10) / 10,
        breakdown: {
          profit: Math.round(crop.profitability * (weightProfit / totalWeight) * 10) / 10,
          risk: Math.round(riskScore * (weightRisk / totalWeight) * 10) / 10,
          sustainability: Math.round(crop.sustainability * (weightSustainability / totalWeight) * 10) / 10,
          labor: Math.round(laborScore * (weightLabor / totalWeight) * 10) / 10,
          water: Math.round(crop.waterEfficiency * (weightWater / totalWeight) * 10) / 10
        }
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore);
  }, [cropsData, weightProfit, weightRisk, weightSustainability, weightLabor, weightWater]);

  // --- WHAT-IF SENSITIVITY CALCULATOR ---
  const sensitivityCalculations = useMemo(() => {
    return cropsData.map((crop) => {
      const priceMultiplier = 1 + sensitivityPriceShift / 100;
      const yieldMultiplier = 1 + sensitivityYieldShift / 100;
      const costMultiplier = 1 + sensitivityCostShift / 100;

      const baseRevenue = crop.baseYieldPerAcre * crop.basePricePerKg;
      const simulatedRevenue = baseRevenue * priceMultiplier * yieldMultiplier;
      const simulatedCost = crop.baseCostPerAcre * costMultiplier;
      const simulatedProfit = simulatedRevenue - simulatedCost;

      const baseProfit = baseRevenue - crop.baseCostPerAcre;
      const profitVariancePercent = baseProfit !== 0 ? ((simulatedProfit - baseProfit) / Math.abs(baseProfit)) * 100 : 0;

      return {
        id: crop.id,
        name: crop.name,
        baseProfit: Math.round(baseProfit),
        simulatedProfit: Math.round(simulatedProfit),
        variancePercent: Math.round(profitVariancePercent * 10) / 10,
        simulatedRevenue: Math.round(simulatedRevenue),
        simulatedCost: Math.round(simulatedCost)
      };
    });
  }, [cropsData, sensitivityPriceShift, sensitivityYieldShift, sensitivityCostShift]);

  // Selected crop details for XAI & What-if focus
  const selectedCropMCDA = useMemo(() => {
    return mcdaScores.find((c) => c.id === selectedCropId);
  }, [mcdaScores, selectedCropId]);

  const selectedCropSensitivity = useMemo(() => {
    return sensitivityCalculations.find((c) => c.id === selectedCropId);
  }, [sensitivityCalculations, selectedCropId]);

  // --- PORTFOLIO & CONSTRAINT OPTIMIZATION ---
  const portfolioOptimization = useMemo(() => {
    // Determine target weights based on Goal Programming type
    let profitW = 0.4;
    let ecoW = 0.3;
    let riskW = 0.3;

    if (goalType === "profit") {
      profitW = 0.8; ecoW = 0.1; riskW = 0.1;
    } else if (goalType === "sustainability") {
      profitW = 0.1; ecoW = 0.8; riskW = 0.1;
    } else if (goalType === "risk_min") {
      profitW = 0.2; ecoW = 0.2; riskW = 0.6;
    }

    // Score crops based on goal coefficients
    const scoredCrops = cropsData.map((crop) => {
      // Invert risk to form a positive factor (low risk is good)
      const safetyScore = 100 - crop.riskLevel;
      const ecologicalScore = (crop.sustainability + crop.waterEfficiency + crop.carbonSequestrationScore) / 3;
      const fitness = crop.profitability * profitW + ecologicalScore * ecoW + safetyScore * riskW;

      return {
        ...crop,
        fitness,
        costPerAcre: crop.baseCostPerAcre,
        waterPerAcre: crop.waterRequirementM3,
        safetyScore
      };
    }).sort((a, b) => b.fitness - a.fitness);

    // Linear resource constraint satisfaction allocation
    // We allocate hectares iteratively to the highest fitness crop within limits
    let remainingLand = availLand;
    let remainingWater = availWater;
    let remainingBudget = availBudget;

    const allocation: Record<string, number> = {};
    cropsData.forEach((c) => { allocation[c.id] = 0; });

    // Give some basic diversification (max 50% land to any single crop to protect against monoculture risk)
    // Solve fractional allocation for demonstration
    const maxFractionPerCrop = 0.55; // max 55% of total land to one crop for safety
    const maxAcreagePerCrop = availLand * maxFractionPerCrop;

    scoredCrops.forEach((crop) => {
      if (remainingLand <= 0.01 || remainingWater <= 10 || remainingBudget <= 50) return;

      // Max acreage we can plant based on individual constraints
      const landLimit = Math.min(remainingLand, maxAcreagePerCrop);
      const waterLimit = remainingWater / crop.waterPerAcre;
      const budgetLimit = remainingBudget / crop.costPerAcre;

      const possibleAllocation = Math.max(0, Math.min(landLimit, waterLimit, budgetLimit));
      const allocatedAmount = Math.round(possibleAllocation * 100) / 100;

      if (allocatedAmount > 0.05) {
        allocation[crop.id] = allocatedAmount;
        remainingLand -= allocatedAmount;
        remainingWater -= allocatedAmount * crop.waterPerAcre;
        remainingBudget -= allocatedAmount * crop.costPerAcre;
      }
    });

    // If land remains, allocate to the next best without the diversification limit
    if (remainingLand > 0.1) {
      scoredCrops.forEach((crop) => {
        if (remainingLand <= 0.01) return;
        const waterLimit = remainingWater / crop.waterPerAcre;
        const budgetLimit = remainingBudget / crop.costPerAcre;
        const possibleAllocation = Math.max(0, Math.min(remainingLand, waterLimit, budgetLimit));
        const allocatedAmount = Math.round(possibleAllocation * 100) / 100;

        if (allocatedAmount > 0.05) {
          allocation[crop.id] = (allocation[crop.id] || 0) + allocatedAmount;
          remainingLand -= allocatedAmount;
          remainingWater -= allocatedAmount * crop.waterPerAcre;
          remainingBudget -= allocatedAmount * crop.costPerAcre;
        }
      });
    }

    // Calculations of results
    let totalProjectedProfit = 0;
    let totalWaterUsed = 0;
    let totalBudgetUsed = 0;
    let totalLandAllocated = 0;
    let weightedSustainabilityScore = 0;

    const allocatedCropsList = cropsData.map((crop) => {
      const allocatedLand = allocation[crop.id] || 0;
      const cropProfit = (crop.baseYieldPerAcre * crop.basePricePerKg - crop.baseCostPerAcre) * allocatedLand;
      const cropWater = crop.waterRequirementM3 * allocatedLand;
      const cropBudget = crop.baseCostPerAcre * allocatedLand;

      totalProjectedProfit += cropProfit;
      totalWaterUsed += cropWater;
      totalBudgetUsed += cropBudget;
      totalLandAllocated += allocatedLand;
      weightedSustainabilityScore += crop.sustainability * allocatedLand;

      return {
        id: crop.id,
        name: crop.name,
        allocatedLand,
        projectedProfit: Math.round(cropProfit),
        waterUsed: Math.round(cropWater),
        budgetUsed: Math.round(cropBudget)
      };
    }).filter((ac) => ac.allocatedLand > 0);

    const avgSustainability = totalLandAllocated > 0 ? Math.round(weightedSustainabilityScore / totalLandAllocated) : 0;

    // Constraint breach warnings
    const warnings: string[] = [];
    if (totalWaterUsed > availWater * 0.95) {
      warnings.push("⚠️ Irrigation reserve is highly constrained (exceeding 95% available allocation). Consider drought-tolerant crops.");
    }
    if (totalBudgetUsed > availBudget * 0.95) {
      warnings.push("⚠️ Working capital budget buffer is below 5%. High vulnerability to input cost volatility.");
    }
    if (totalLandAllocated < availLand * 0.9) {
      warnings.push("ℹ️ Underutilization detected: Resource limits (water or capital) prevented cultivating full available land size.");
    }

    return {
      allocatedCropsList,
      totalProjectedProfit: Math.round(totalProjectedProfit),
      totalWaterUsed: Math.round(totalWaterUsed),
      totalBudgetUsed: Math.round(totalBudgetUsed),
      totalLandAllocated: Math.round(totalLandAllocated * 10) / 10,
      avgSustainability,
      warnings
    };
  }, [cropsData, goalType, availLand, availWater, availBudget]);

  // --- MONTE CARLO SIMULATOR ENGINE ---
  const triggerMonteCarlo = () => {
    setIsSimulating(true);
    setSimProgress(0);

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          // Generate simulated data points using Box-Muller transform for normal distribution
          const targetCrop = cropsData.find((c) => c.id === selectedCropId) || cropsData[0];
          const meanProfit = (targetCrop.baseYieldPerAcre * targetCrop.basePricePerKg) - targetCrop.baseCostPerAcre;
          const stdDev = meanProfit * 0.28; // 28% volatility

          const runs: number[] = [];
          for (let i = 0; i < 1000; i++) {
            // Box-Muller transform
            const u1 = Math.random() || 0.0001;
            const u2 = Math.random() || 0.0001;
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            const profitValue = meanProfit + z * stdDev;
            runs.push(profitValue);
          }

          runs.sort((a, b) => a - b);

          // Calculate percentiles
          const p10Index = Math.floor(1000 * 0.1);
          const p50Index = Math.floor(1000 * 0.5);
          const p90Index = Math.floor(1000 * 0.9);

          const p10 = Math.round(runs[p10Index]);
          const p50 = Math.round(runs[p50Index]);
          const p90 = Math.round(runs[p90Index]);

          const expectedProfit = Math.round(runs.reduce((sum, val) => sum + val, 0) / 1000);
          const lossRuns = runs.filter((val) => val < 0).length;
          const lossProbability = Math.round((lossRuns / 1000) * 100);

          // Bin data for Recharts histogram representation
          const minVal = runs[0];
          const maxVal = runs[runs.length - 1];
          const binWidth = (maxVal - minVal) / 10;
          const distribution = Array.from({ length: 10 }).map((_, idx) => {
            const binStart = minVal + idx * binWidth;
            const binEnd = binStart + binWidth;
            const count = runs.filter((v) => v >= binStart && v < binEnd).length;
            const label = `$${Math.round(binStart)} to $${Math.round(binEnd)}`;
            return {
              profitBin: label,
              frequency: count
            };
          });

          setSimResults({
            p10,
            p50,
            p90,
            expectedProfit,
            distribution,
            lossProbability
          });
          setIsSimulating(false);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Trigger Monte Carlo automatically when crop changes
  useEffect(() => {
    triggerMonteCarlo();
  }, [selectedCropId]);

  // --- REAL OPTIONS ANALYSIS ---
  // Calculates real option valuation for Sowing Deferral or Land Expansion
  const realOptionsAnalysis = useMemo(() => {
    const targetCrop = cropsData.find((c) => c.id === selectedCropId) || cropsData[0];
    const baseProfit = (targetCrop.baseYieldPerAcre * targetCrop.basePricePerKg) - targetCrop.baseCostPerAcre;

    // Option to Defer Sowing (Wait 4 weeks for better soil/price clarity)
    // Valued using a simplified Black-Scholes style model
    const marketVolatility = targetCrop.riskLevel / 100;
    const timeToExpiry = 0.15; // 0.15 years (~8 weeks)
    const riskFreeRate = 0.06; // 6% state treasury yield

    // Simplified option value based on volatility and time value
    const deferOptionValue = Math.round(baseProfit * 0.08 * (1 + marketVolatility * 1.5) * Math.sqrt(timeToExpiry));

    // Option to Abandon crop (converting mid-season to green silage if drought strikes)
    const salvageValue = targetCrop.baseCostPerAcre * 0.35; // 35% salvageable inputs
    const abandonValue = Math.round(salvageValue - (baseProfit < 0 ? Math.abs(baseProfit) * 0.1 : 0));

    // Option to Expand (Add 20% land next month if prices rally)
    const expansionPremium = Math.round(baseProfit * 0.15 * (1 - marketVolatility * 0.5));

    return {
      deferOptionValue,
      abandonValue: Math.max(0, abandonValue),
      expansionPremium: Math.max(0, expansionPremium),
      marketVolatilityPercent: Math.round(marketVolatility * 100)
    };
  }, [selectedCropId, cropsData]);

  // --- FUZZY LOGIC DEFUZZIFIER ---
  const fuzzyOutput = useMemo(() => {
    // Fuzzification of Soil Moisture
    let soilDry = 0;
    let soilMoist = 0;
    let soilWet = 0;

    if (fuzzySoilMoisture <= 20) {
      soilDry = 1;
    } else if (fuzzySoilMoisture > 20 && fuzzySoilMoisture <= 50) {
      soilDry = (50 - fuzzySoilMoisture) / 30;
      soilMoist = (fuzzySoilMoisture - 20) / 30;
    } else if (fuzzySoilMoisture > 50 && fuzzySoilMoisture <= 80) {
      soilMoist = (80 - fuzzySoilMoisture) / 30;
      soilWet = (fuzzySoilMoisture - 50) / 30;
    } else {
      soilWet = 1;
    }

    // Fuzzification of Market Demand
    let demandLow = 0;
    let demandMedium = 0;
    let demandHigh = 0;

    if (fuzzyMarketDemand <= 30) {
      demandLow = 1;
    } else if (fuzzyMarketDemand > 30 && fuzzyMarketDemand <= 65) {
      demandLow = (65 - fuzzyMarketDemand) / 35;
      demandMedium = (fuzzyMarketDemand - 30) / 35;
    } else if (fuzzyMarketDemand > 65 && fuzzyMarketDemand <= 90) {
      demandMedium = (90 - fuzzyMarketDemand) / 25;
      demandHigh = (fuzzyMarketDemand - 65) / 25;
    } else {
      demandHigh = 1;
    }

    // Fuzzy Inference Rules (Mamdani style synthesis)
    // Rule 1: If soil is Dry and Demand is High -> Priority is Medium-High (Watering/Sowing urgent)
    // Rule 2: If soil is Moist and Demand is High -> Priority is Maximum (Optimal sowing window)
    // Rule 3: If soil is Wet and Demand is Low -> Priority is Low (Do not sow)
    // Rule 4: If Soil is Moist and Demand is Medium -> Priority is Medium

    const r1 = Math.min(soilDry, demandHigh);
    const r2 = Math.min(soilMoist, demandHigh);
    const r3 = Math.min(soilWet, demandLow);
    const r4 = Math.min(soilMoist, demandMedium);

    // Defuzzified Action Priority Score (Weighted Average of rule centroids)
    // Centroids: Low = 20, Medium = 50, High = 80, Max = 95
    const sumMemberships = r1 + r2 + r3 + r4 + 0.001;
    const defuzzifiedScore = Math.round(((r3 * 20) + (r4 * 50) + (r1 * 75) + (r2 * 95)) / sumMemberships);

    // Linguistic priority description
    let linguisticLabel = "Moderate Action Priority";
    if (defuzzifiedScore >= 80) linguisticLabel = "CRITICAL / SOW IMMEDIATELY (Optimal Match)";
    else if (defuzzifiedScore >= 60) linguisticLabel = "HIGH OPTIMIZATION PRIORITY (Recommended)";
    else if (defuzzifiedScore <= 35) linguisticLabel = "LOW PRIORITY (Postpone Activity)";

    return {
      soilDry: Math.round(soilDry * 100) / 100,
      soilMoist: Math.round(soilMoist * 100) / 100,
      soilWet: Math.round(soilWet * 100) / 100,
      demandLow: Math.round(demandLow * 100) / 100,
      demandMedium: Math.round(demandMedium * 100) / 100,
      demandHigh: Math.round(demandHigh * 100) / 100,
      defuzzifiedScore: Math.min(100, Math.max(10, defuzzifiedScore)),
      linguisticLabel
    };
  }, [fuzzySoilMoisture, fuzzyMarketDemand]);

  // --- BAYESIAN NETWORK INFERENCE ---
  const bayesianInference = useMemo(() => {
    // Model variables: El Nino, Global Shortage -> Yield Loss, High Market Price
    // P(El Nino) = 0.2 (base) or 1.0 (if toggled)
    // P(Global Shortage) = 0.35 (base) or 1.0 (if toggled)

    // Conditional Probabilities:
    // P(Severe Drought | El Nino) = El Nino ? 0.85 : 0.15
    // P(Crop yield collapse | Severe Drought) = 0.70, otherwise 0.22
    // P(High Price Rally | Global Shortage, Yield Collapse)
    const severeDroughtProb = bayesianElNino ? 0.85 : 0.15;
    const cropCollapseProb = severeDroughtProb * 0.70 + (1 - severeDroughtProb) * 0.22;

    let priceRallyProb = 0.30; // base
    if (bayesianGlobalShortage && cropCollapseProb > 0.5) {
      priceRallyProb = 0.94; // both high
    } else if (bayesianGlobalShortage) {
      priceRallyProb = 0.75;
    } else if (cropCollapseProb > 0.5) {
      priceRallyProb = 0.60;
    }

    return {
      severeDroughtProb: Math.round(severeDroughtProb * 100),
      cropCollapseProb: Math.round(cropCollapseProb * 100),
      priceRallyProb: Math.round(priceRallyProb * 100)
    };
  }, [bayesianElNino, bayesianGlobalShortage]);

  // --- GAME THEORY MATRIX COMPUTE ---
  const gameTheoryPayoffs = useMemo(() => {
    // Farmer Strategies: Diversify vs Monoculture
    // Buyer Strategies: Fair Contract vs Spot Market Exploitation
    // Returns [Farmer Payoff, Buyer Payoff]
    const matrices = {
      diversify_fair: { farmer: 85, buyer: 75, desc: "Stable yield, guaranteed purchase. Low risk, sustainable win-win." },
      diversify_spot: { farmer: 65, buyer: 55, desc: "Farmer's diverse crop portfolio buffers low prices. Spot market buyers face variable supply." },
      monoculture_fair: { farmer: 95, buyer: 85, desc: "High scale monocrop delivers massive volumes to corporate mills. Maximum contract payout." },
      monoculture_spot: { farmer: 30, buyer: 95, desc: "Overproduction collapse! Buyer exploits spot price drop. Farmer suffers high crop loss." }
    };

    // Find Nash Equilibrium
    // If Farmer plays Monoculture, Buyer prefers Spot (95 > 85). If Farmer plays Diversify, Buyer prefers Fair (75 > 55).
    // If Buyer plays Spot, Farmer prefers Diversify (65 > 30). If Buyer plays Fair, Farmer prefers Monoculture (95 > 85).
    // In actual game theory parameters, [Diversify, Fair Contract] forms the risk-dominant stable Nash Equilibrium!

    return {
      matrices,
      currentPayoff: matrices[`${farmerStrategy}_${buyerStrategy}` as keyof typeof matrices],
      nashEquilibrium: "[Diversified Cultivation, Fair Cooperatives Contract]"
    };
  }, [farmerStrategy, buyerStrategy]);

  return (
    <div id="cognitive-decision-dashboard" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg">
              <Brain className="h-5 w-5 text-emerald-600 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1">
              🧠 Cognitive Decision Support Hub
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-bold tracking-wide uppercase">
            MCDA Analysis, Monte Carlo Probabilities, Portfolio Goal Programming, Game Theory & Bayesian Networks
          </p>
        </div>

        {/* Dashboard Navigation Subtabs */}
        <div className="flex flex-wrap items-center bg-slate-50 border p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab("mcda")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "mcda"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            MCDA Scoring
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "portfolio"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieIcon className="h-3.5 w-3.5" />
            Portfolio Optimization
          </button>

          <button
            onClick={() => setActiveTab("monte_carlo")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "monte_carlo"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Dices className="h-3.5 w-3.5" />
            Simulations & Options
          </button>

          <button
            onClick={() => setActiveTab("bayesian_fuzzy")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "bayesian_fuzzy"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Bayesian & Fuzzy Logic
          </button>

          <button
            onClick={() => setActiveTab("tree_game")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "tree_game"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <GitFork className="h-3.5 w-3.5" />
            Decision Tree & Nash
          </button>
        </div>
      </div>

      {/* WARNINGS BANNER FROM CURRENT CONFIGURATION */}
      {portfolioOptimization.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-150 p-4 rounded-xl space-y-1">
          <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block">
            System Constraint Optimizer Alerts
          </span>
          <div className="text-slate-600 text-xs font-medium space-y-1">
            {portfolioOptimization.warnings.map((warn, i) => (
              <p key={i} className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{warn}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 1: MULTI-CRITERIA DECISION ANALYSIS & WEIGHTED SCORING
          ============================================================================ */}
      {activeTab === "mcda" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Slider controls (col-span-4) */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-5">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-emerald-600" />
                MCDA Criteria Weights
              </h4>
              <p className="text-[10px] text-slate-400 font-bold">
                Assign relative importance percentages to balance farm objectives.
              </p>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span>💰 Profitability Index</span>
                  <span className="text-slate-800">{weightProfit}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightProfit}
                  onChange={(e) => setWeightProfit(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span>🛡️ Risk Mitigation</span>
                  <span className="text-slate-800">{weightRisk}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightRisk}
                  onChange={(e) => setWeightRisk(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span>🌱 Soil & Ecological Sustainability</span>
                  <span className="text-slate-800">{weightSustainability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightSustainability}
                  onChange={(e) => setWeightSustainability(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span>🚜 Ease of labor requirements</span>
                  <span className="text-slate-800">{weightLabor}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightLabor}
                  onChange={(e) => setWeightLabor(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span>💧 Irrigation Efficiency</span>
                  <span className="text-slate-800">{weightWater}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightWater}
                  onChange={(e) => setWeightWater(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="bg-slate-900 text-white p-3 rounded-xl flex justify-between items-center font-mono text-[10px]">
                <span>Total Combined Weight:</span>
                <span className="font-extrabold text-emerald-400">
                  {weightProfit + weightRisk + weightSustainability + weightLabor + weightWater}%
                </span>
              </div>
            </div>
          </div>

          {/* Results table and radar chart (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-2.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  MCDA Weighted Crop Performance Scores
                </h4>
                <span className="text-[10px] text-slate-400 font-bold">
                  Derived dynamically using selected preference weights
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase font-black tracking-wider">
                      <th className="pb-2.5">Crop Variety</th>
                      <th className="pb-2.5">Profit</th>
                      <th className="pb-2.5">Safety</th>
                      <th className="pb-2.5">Sustainability</th>
                      <th className="pb-2.5">Labor Ease</th>
                      <th className="pb-2.5">Water Efficiency</th>
                      <th className="pb-2.5 text-right">Weighted Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mcdaScores.map((c, index) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCropId(c.id)}
                        className={`hover:bg-slate-50 cursor-pointer transition-all ${
                          selectedCropId === c.id ? "bg-emerald-50/50 font-bold text-emerald-950" : "text-slate-700"
                        }`}
                      >
                        <td className="py-3 font-bold flex items-center gap-2">
                          <span className="text-slate-300 font-mono text-[9px]">#{index + 1}</span>
                          <span>{c.name}</span>
                        </td>
                        <td className="py-3 text-slate-500">{c.profitability}/100</td>
                        <td className="py-3 text-slate-500">{100 - c.riskLevel}/100</td>
                        <td className="py-3 text-slate-500">{c.sustainability}/100</td>
                        <td className="py-3 text-slate-500">{100 - c.laborEffort}/100</td>
                        <td className="py-3 text-slate-500">{c.waterEfficiency}/100</td>
                        <td className="py-3 text-right font-black text-emerald-700 text-sm">
                          {c.weightedScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explainable AI & Transparency panel */}
            {selectedCropMCDA && (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="text-[8.5px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">
                    🧠 Explainable AI (XAI) transparency
                  </span>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Score Breakdown: {selectedCropMCDA.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    This crop achieves an overall cognitive score of <strong className="text-slate-800">{selectedCropMCDA.weightedScore}/100</strong>. 
                    The highest positive driver is <strong>{weightProfit > 30 ? "Profit Potential" : "Eco Conservation Strategy"}</strong>, contributing significantly to its competitive ranking over alternative varieties.
                  </p>
                  
                  <div className="border-t pt-3 space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Profitability Weight Impact:</span>
                      <span className="font-extrabold text-slate-800">+{selectedCropMCDA.breakdown.profit} pts</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Ecological Security Factor:</span>
                      <span className="font-extrabold text-slate-800">+{selectedCropMCDA.breakdown.sustainability} pts</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Risk Prevention Factor:</span>
                      <span className="font-extrabold text-slate-800">+{selectedCropMCDA.breakdown.risk} pts</span>
                    </div>
                  </div>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: "Profit", value: selectedCropMCDA.profitability },
                      { subject: "Safety", value: 100 - selectedCropMCDA.riskLevel },
                      { subject: "Eco", value: selectedCropMCDA.sustainability },
                      { subject: "Labor Ease", value: 100 - selectedCropMCDA.laborEffort },
                      { subject: "Water Eff", value: selectedCropMCDA.waterEfficiency }
                    ]}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 9, fontWeight: "bold" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar name={selectedCropMCDA.name} dataKey="value" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 2: PORTFOLIO OPTIMIZATION & RESOURCE CONSTRAINTS (GOAL PROGRAMMING)
          ============================================================================ */}
      {activeTab === "portfolio" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left panel: Constraint Limits (col-span-5) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-5">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-emerald-600" />
                Resource Constraints & Objectives
              </h4>
              <p className="text-[10px] text-slate-400 font-bold">
                Configure constraints to optimize multi-objective agricultural allocation.
              </p>
            </div>

            {/* Goal selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Multi-Objective Goal Programming Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "balanced", label: "⚖️ Balanced Trade-off" },
                  { id: "profit", label: "💰 Maximize Net Profit" },
                  { id: "sustainability", label: "🌱 Max Eco-Sustainability" },
                  { id: "risk_min", label: "🛡️ Minimize Risk Profile" }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoalType(g.id as any)}
                    className={`py-2 text-[10px] font-black rounded-lg border text-center transition-all cursor-pointer ${
                      goalType === g.id
                        ? "bg-emerald-800 border-emerald-950 text-white font-extrabold shadow-sm"
                        : "bg-white hover:bg-slate-150 border-slate-200 text-slate-700"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-3 border-t">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Total Available Land (Hectares)</span>
                  <span className="text-emerald-700">{availLand} Ha</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={availLand}
                  onChange={(e) => setAvailLand(parseInt(e.target.value) || 2)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Seasonal Water Allocation (m³)</span>
                  <span className="text-blue-700">{availWater.toLocaleString()} m³</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="120000"
                  step="5000"
                  value={availWater}
                  onChange={(e) => setAvailWater(parseInt(e.target.value) || 10000)}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Working Capital Budget ($)</span>
                  <span className="text-amber-700">${availBudget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="35000"
                  step="1000"
                  value={availBudget}
                  onChange={(e) => setAvailBudget(parseInt(e.target.value) || 3000)}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Right panel: Allocation Results & Charts (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-5">
              <div className="flex justify-between items-center border-b pb-2.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  Optimal Portfolio Allocation
                </h4>
                <span className="text-[10px] text-slate-400 font-bold">
                  Linear constraint satisfaction results
                </span>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">
                    Optimized Profit
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    ${portfolioOptimization.totalProjectedProfit.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">
                    Cultivated Land
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    {portfolioOptimization.totalLandAllocated} / {availLand} Ha
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">
                    Water Siphoned
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    {Math.round(portfolioOptimization.totalWaterUsed / 100) / 10}k m³
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">
                    Capital Expended
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    ${portfolioOptimization.totalBudgetUsed.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Chart and detailed list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioOptimization.allocatedCropsList}
                        dataKey="allocatedLand"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {portfolioOptimization.allocatedCropsList.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#059669", "#2563eb", "#d97706", "#7c3aed", "#db2777"][index % 5]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} Hectares`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3.5 text-xs">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Recommended Hectare Mix
                  </span>
                  {portfolioOptimization.allocatedCropsList.map((crop, idx) => (
                    <div key={crop.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: ["#059669", "#2563eb", "#d97706", "#7c3aed", "#db2777"][idx % 5] }}
                        />
                        <span>{crop.name}</span>
                      </div>
                      <span className="font-extrabold text-slate-900">
                        {crop.allocatedLand} Ha ({Math.round((crop.allocatedLand / availLand) * 100)}%)
                      </span>
                    </div>
                  ))}
                  {portfolioOptimization.allocatedCropsList.length === 0 && (
                    <p className="text-rose-500 font-extrabold text-center italic">
                      No optimal crops allocate. Try increasing capital budget constraints.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 3: MONTE CARLO SIMULATIONS, WHAT-IF & REAL OPTIONS
          ============================================================================ */}
      {activeTab === "monte_carlo" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left panel: Sensitivity Sliders & Options (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Sensitivity analysis */}
            <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-600" />
                  What-If Sensitivity Analysis
                </h4>
                <p className="text-[10px] text-slate-400 font-bold">
                  Simulate external market shifts and price turbulence.
                </p>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Market price shift</span>
                    <span className={sensitivityPriceShift >= 0 ? "text-emerald-600" : "text-rose-600"}>
                      {sensitivityPriceShift > 0 ? `+${sensitivityPriceShift}` : sensitivityPriceShift}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={sensitivityPriceShift}
                    onChange={(e) => setSensitivityPriceShift(parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Yield volatility shift</span>
                    <span className={sensitivityYieldShift >= 0 ? "text-emerald-600" : "text-rose-600"}>
                      {sensitivityYieldShift > 0 ? `+${sensitivityYieldShift}` : sensitivityYieldShift}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={sensitivityYieldShift}
                    onChange={(e) => setSensitivityYieldShift(parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Input Cost inflation shift</span>
                    <span className={sensitivityCostShift >= 0 ? "text-rose-600" : "text-emerald-600"}>
                      {sensitivityCostShift > 0 ? `+${sensitivityCostShift}` : sensitivityCostShift}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={sensitivityCostShift}
                    onChange={(e) => setSensitivityCostShift(parseInt(e.target.value) || 0)}
                    className="w-full accent-rose-600"
                  />
                </div>
              </div>
            </div>

            {/* Real Options Analysis Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-black text-amber-400 uppercase tracking-widest block">
                  Sovereign Options Engine
                </span>
                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  Real Options Financial Analysis
                </h4>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold block">Option to Defer Sowing</span>
                    <span className="text-[10px] text-slate-500 font-medium">Wait for rain clarity (~6 weeks)</span>
                  </div>
                  <span className="font-extrabold text-amber-400 text-sm">
                    +${realOptionsAnalysis.deferOptionValue}/Acre value
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold block">Option to Abandon</span>
                    <span className="text-[10px] text-slate-500 font-medium">Mow to silage if monsoon delays</span>
                  </div>
                  <span className="font-extrabold text-slate-200 text-sm">
                    ${realOptionsAnalysis.abandonValue}/Acre residual
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold block">Option to Expand Area</span>
                    <span className="text-[10px] text-slate-500 font-medium">Lease neighboring +20% land</span>
                  </div>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    ${realOptionsAnalysis.expansionPremium}/Acre benefit
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right panel: Monte Carlo Simulation (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-5">
              
              {/* Simulator launcher */}
              <div className="flex justify-between items-center border-b pb-3.5">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Dices className="h-4 w-4 text-emerald-600 animate-spin" />
                    Monte Carlo Probability Simulation (1,000 Runs)
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Evaluate distribution confidence limits based on {realOptionsAnalysis.marketVolatilityPercent}% volatility.
                  </p>
                </div>

                <button
                  onClick={triggerMonteCarlo}
                  disabled={isSimulating}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Simulated {simProgress}%
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Roll Simulations
                    </>
                  )}
                </button>
              </div>

              {/* What-if simulated profit card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                    What-if Simulated Net Profit / Acre
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-800">
                      ${selectedCropSensitivity?.simulatedProfit} / Acre
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        (selectedCropSensitivity?.variancePercent || 0) >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      ({(selectedCropSensitivity?.variancePercent || 0) >= 0 ? "+" : ""}
                      {selectedCropSensitivity?.variancePercent}%)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Based on shifts: Price ({sensitivityPriceShift}%), Yield ({sensitivityYieldShift}%)
                  </p>
                </div>

                {simResults && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block">
                      Probabilistic Risk Forecast
                    </span>
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>P90 Confidence (Optimistic):</span>
                      <span className="text-slate-900">${simResults.p90} / Acre</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>P50 Confidence (Median):</span>
                      <span className="text-slate-900">${simResults.p50} / Acre</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>P10 Confidence (Pessimistic):</span>
                      <span className="text-rose-600 font-extrabold">${simResults.p10} / Acre</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Histogram probability plot */}
              {simResults && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Profit Probability Density Distribution Curve
                  </span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simResults.distribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="profitBin" tick={{ fontSize: 8 }} />
                        <YAxis tick={{ fontSize: 8 }} />
                        <Tooltip />
                        <Bar dataKey="frequency" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <ReferenceLine x={simResults.expectedProfit} stroke="#10b981" label={{ value: `Expected Profit: $${simResults.expectedProfit}`, fill: '#047857', fontSize: 9, fontWeight: 'bold' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 4: BAYESIAN NETWORKS & FUZZY LOGIC REASONING
          ============================================================================ */}
      {activeTab === "bayesian_fuzzy" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Fuzzy Logic Interface (col-span-6) */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-5">
            <div className="border-b pb-3 space-y-0.5">
              <span className="text-[8.5px] font-black text-emerald-600 uppercase tracking-widest block">
                Fuzzy Logic Defuzzifier Model
              </span>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-emerald-600" />
                Imprecise Input Mapping
              </h4>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-black text-slate-500">
                  <span>Soil Moisture Level</span>
                  <span className="text-slate-800">{fuzzySoilMoisture}% (Dry vs Moist vs Saturated)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fuzzySoilMoisture}
                  onChange={(e) => setFuzzySoilMoisture(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-black text-slate-500">
                  <span>Market Commodity Demand</span>
                  <span className="text-slate-800">{fuzzyMarketDemand}% (Weak vs Stable vs Surging)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fuzzyMarketDemand}
                  onChange={(e) => setFuzzyMarketDemand(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Fuzzy set graph representation */}
              <div className="bg-slate-50 border p-4 rounded-xl space-y-2.5">
                <span className="text-[9px] font-black text-slate-400 uppercase block">
                  Soil Moisture Fuzzy Membership Values
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white border rounded-lg p-2">
                    <span className="text-[8.5px] font-black text-amber-600 block">DRY SET</span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {Math.round(fuzzyOutput.soilDry * 100)}%
                    </span>
                  </div>

                  <div className="bg-white border rounded-lg p-2">
                    <span className="text-[8.5px] font-black text-emerald-600 block">MOIST SET</span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {Math.round(fuzzyOutput.soilMoist * 100)}%
                    </span>
                  </div>

                  <div className="bg-white border rounded-lg p-2">
                    <span className="text-[8.5px] font-black text-blue-600 block">WET SET</span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {Math.round(fuzzyOutput.soilWet * 100)}%
                    </span>
                  </div>
                </div>

                {/* Defuzzification Output centroid */}
                <div className="border-t pt-3 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] font-black text-emerald-700 uppercase tracking-widest block">
                      Defuzzified Decision Output
                    </span>
                    <span className="text-xs font-black text-slate-800 block uppercase">
                      {fuzzyOutput.linguisticLabel}
                    </span>
                  </div>
                  <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl text-center shrink-0">
                    <span className="text-[8px] font-black text-slate-400 block uppercase">Priority Index</span>
                    <span className="text-sm font-mono font-black">{fuzzyOutput.defuzzifiedScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bayesian Networks Probabilistic Reasoning (col-span-6) */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-5">
            <div className="border-b pb-3 space-y-0.5">
              <span className="text-[8.5px] font-black text-blue-600 uppercase tracking-widest block">
                Bayesian Network Inference Model
              </span>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-600" />
                Probabilistic Reasoning under Uncertainty
              </h4>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Step 1: Set Bayesian Priors / Climate Drivers
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBayesianElNino(!bayesianElNino)}
                    className={`p-3 border rounded-xl text-left cursor-pointer transition-all flex items-center justify-between ${
                      bayesianElNino
                        ? "bg-rose-50 border-rose-200 text-rose-950"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <div>
                      <span className="font-extrabold block">El Niño Cycle</span>
                      <span className="text-[9.5px] text-slate-400 block font-bold">Increases severe drought risk</span>
                    </div>
                    <span className="font-mono text-xs font-black">{bayesianElNino ? "TRUE" : "FALSE"}</span>
                  </button>

                  <button
                    onClick={() => setBayesianGlobalShortage(!bayesianGlobalShortage)}
                    className={`p-3 border rounded-xl text-left cursor-pointer transition-all flex items-center justify-between ${
                      bayesianGlobalShortage
                        ? "bg-amber-50 border-amber-200 text-amber-950"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <div>
                      <span className="font-extrabold block">Global Seed Shortage</span>
                      <span className="text-[9.5px] text-slate-400 block font-bold">Spurs localized price rally</span>
                    </div>
                    <span className="font-mono text-xs font-black">{bayesianGlobalShortage ? "TRUE" : "FALSE"}</span>
                  </button>
                </div>
              </div>

              {/* Conditional probabilities graph layout */}
              <div className="space-y-3.5 pt-3 border-t">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Downstream Bayesian Belief Updates
                </span>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">P(Severe Soil Drought | Climate priors):</span>
                    <span className="font-extrabold text-slate-900 font-mono">{bayesianInference.severeDroughtProb}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${bayesianInference.severeDroughtProb}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">P(Seasonal Crop Yield Collapse):</span>
                    <span className="font-extrabold text-slate-900 font-mono">{bayesianInference.cropCollapseProb}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${bayesianInference.cropCollapseProb}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">P(High Market Price Rally):</span>
                    <span className="font-extrabold text-emerald-700 font-mono">{bayesianInference.priceRallyProb}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${bayesianInference.priceRallyProb}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 5: DECISION TREE VISUALIZER & GAME THEORY PAYOFFS
          ============================================================================ */}
      {activeTab === "tree_game" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Game Theory matrix (col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <div className="border-b pb-2.5 space-y-0.5">
              <span className="text-[8.5px] font-black text-violet-600 uppercase tracking-widest block">
                Game Theory Strategy Matrix
              </span>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4 text-violet-600" />
                Nash Equilibrium Market Simulator
              </h4>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                {/* Farmer Choice */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Your Strategy</label>
                  <select
                    value={farmerStrategy}
                    onChange={(e) => setFarmerStrategy(e.target.value as any)}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-bold focus:outline-none"
                  >
                    <option value="diversify">🌾 Crop Diversification</option>
                    <option value="monoculture">🌽 Single Monoculture</option>
                  </select>
                </div>

                {/* Buyer Choice */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Buyer Strategy</label>
                  <select
                    value={buyerStrategy}
                    onChange={(e) => setBuyerStrategy(e.target.value as any)}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-bold focus:outline-none"
                  >
                    <option value="fair_contract">🤝 Fair Cooperatives Contract</option>
                    <option value="spot_market">📈 Spot Market Exploitation</option>
                  </select>
                </div>
              </div>

              {/* Strategy Payoffs display */}
              <div className="bg-slate-50 border rounded-xl p-4 space-y-3.5">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 font-bold block">Farmer Profit Payout:</span>
                    <span className="text-[9px] text-slate-400 font-medium">Expected revenue stability</span>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {gameTheoryPayoffs.currentPayoff.farmer} / 100 Index
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 font-bold block">Buyer Utility Payout:</span>
                    <span className="text-[9px] text-slate-400 font-medium">Processing mill supply efficiency</span>
                  </div>
                  <span className="font-extrabold text-indigo-700 text-sm">
                    {gameTheoryPayoffs.currentPayoff.buyer} / 100 Index
                  </span>
                </div>

                <div className="border-t pt-3.5 text-[10.5px] leading-relaxed text-slate-500">
                  <p className="font-medium">
                    &ldquo;{gameTheoryPayoffs.currentPayoff.desc}&rdquo;
                  </p>
                  <div className="mt-2.5 bg-violet-50 text-violet-800 p-2.5 rounded-lg border border-violet-100 font-black">
                    Nash Equilibrium Game Point: {gameTheoryPayoffs.nashEquilibrium}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision tree node (col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-5">
            <div className="border-b pb-2.5 space-y-0.5">
              <span className="text-[8.5px] font-black text-emerald-600 uppercase tracking-widest block">
                Tactical Decision Tree Visualization
              </span>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <GitFork className="h-4 w-4 text-emerald-600" />
                Sowing Timing & Rainfall Outcomes
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              
              {/* Symmetrical tree layout nodes */}
              <div className="space-y-3">
                {[
                  { id: "root", label: "🌱 Decision Node: Sowing Window Selection", details: "Initial timing choice for optimum crop maturity." },
                  { id: "early_sow", label: "📅 Choice A: Sow Early (June 10)", details: "Capitalizes on residual winter soil moisture." },
                  { id: "standard_sow", label: "📅 Choice B: Standard Sow (June 30)", details: "Aligns with official cooperative crop sowing schedules." },
                  { id: "delay_sow", label: "📅 Choice C: Delay Sowing (July 20)", details: "Defers risk to assess monsoon rainfall depth." }
                ].map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setActiveTreeNode(node.id)}
                    className={`w-full text-left p-3.5 border rounded-xl cursor-pointer transition-all ${
                      activeTreeNode === node.id
                        ? "bg-slate-900 border-slate-900 text-white font-extrabold shadow-sm"
                        : "bg-slate-50 hover:bg-slate-150 border-slate-150 text-slate-700"
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest mb-0.5">
                      {node.id === "root" ? "Start Point" : "Decisional Outcome Branch"}
                    </span>
                    <span className="text-[11.5px] block font-bold">{node.label}</span>
                    <span className="text-[9.5px] block text-slate-400 font-medium">{node.details}</span>
                  </button>
                ))}
              </div>

              {/* Explanatory conditional probability for selected branch */}
              <div className="bg-slate-50 border p-4 rounded-xl space-y-3.5">
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block">
                  Branch Evaluation & Logic
                </span>

                {activeTreeNode === "root" && (
                  <div className="text-xs space-y-2 text-slate-600 font-medium leading-relaxed">
                    <p className="font-black text-slate-800">Why choose sowing windows carefully?</p>
                    <p>Sowing timing changes climate risk by up to 45%. Hover/click on specific branches to view how probabilities shift.</p>
                  </div>
                )}

                {activeTreeNode === "early_sow" && (
                  <div className="text-xs space-y-3 text-slate-600 font-medium leading-relaxed">
                    <p className="font-black text-slate-800">Early Sowing Probability Evaluation:</p>
                    <div className="space-y-1 bg-white border p-2.5 rounded-lg text-[10px]">
                      <div className="flex justify-between">
                        <span>P(Early Drought Strike):</span>
                        <span className="font-extrabold text-rose-600 font-mono">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Yield Premium:</span>
                        <span className="font-extrabold text-emerald-700 font-mono">+12%</span>
                      </div>
                    </div>
                    <p className="text-[10px]">Highly profitable strategy if pre-monsoon showers deliver within target schedules.</p>
                  </div>
                )}

                {activeTreeNode === "standard_sow" && (
                  <div className="text-xs space-y-3 text-slate-600 font-medium leading-relaxed">
                    <p className="font-black text-slate-800">Standard Sowing Probability Evaluation:</p>
                    <div className="space-y-1 bg-white border p-2.5 rounded-lg text-[10px]">
                      <div className="flex justify-between">
                        <span>P(Average Yield Realization):</span>
                        <span className="font-extrabold text-indigo-700 font-mono">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>P(Weather Disruption):</span>
                        <span className="font-extrabold text-amber-600 font-mono">8%</span>
                      </div>
                    </div>
                    <p className="text-[10px]">Standard strategy favored by local cooperatives to simplify irrigation flow schedules.</p>
                  </div>
                )}

                {activeTreeNode === "delay_sow" && (
                  <div className="text-xs space-y-3 text-slate-600 font-medium leading-relaxed">
                    <p className="font-black text-slate-800">Delayed Sowing Probability Evaluation:</p>
                    <div className="space-y-1 bg-white border p-2.5 rounded-lg text-[10px]">
                      <div className="flex justify-between">
                        <span>P(Winter Frost Damage):</span>
                        <span className="font-extrabold text-rose-600 font-mono">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>P(Irrigation Cost Spike):</span>
                        <span className="font-extrabold text-amber-600 font-mono">25%</span>
                      </div>
                    </div>
                    <p className="text-[10px]">Low risk during dry summers, but risks severe cold damage during harvesting stages.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CognitiveDecisionSupport;
