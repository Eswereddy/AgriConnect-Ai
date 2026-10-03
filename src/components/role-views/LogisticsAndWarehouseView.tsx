import React, { useState } from "react";
import {
  Truck,
  Layers,
  Thermometer,
  Wind,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Fan,
  Activity,
  Plus,
  Scale
} from "lucide-react";
import { LogisticsRoute, WarehouseSilo, UserRole } from "../../types";
import MLPredictionHub from "../analytics/MLPredictionHub";
import LogisticsProviderPortal from "./LogisticsProviderPortal";
import WarehouseOperatorPortal from "./WarehouseOperatorPortal";

interface LogisticsAndWarehouseViewProps {
  activeRole: UserRole;
  routes: LogisticsRoute[];
  silos: WarehouseSilo[];
  onAddRoute: (newRoute: LogisticsRoute) => void;
  onUpdateRoute: (id: string, updated: Partial<LogisticsRoute>) => void;
  onUpdateSilo: (id: string, updated: Partial<WarehouseSilo>) => void;
}

export default function LogisticsAndWarehouseView({
  activeRole,
  routes,
  silos,
  onAddRoute,
  onUpdateRoute,
  onUpdateSilo
}: LogisticsAndWarehouseViewProps) {
  // Logistics form state
  const [driverName, setDriverName] = useState("David Miller");
  const [cargo, setCargo] = useState("Premium Basmati Rice Grade-A");
  const [weight, setWeight] = useState(4500);
  const [origin, setOrigin] = useState("Andhra Pradesh Agri Cooperative");
  const [destination, setDestination] = useState("Silo Terminal 4B");

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim()) return;

    const newRoute: LogisticsRoute = {
      id: `route-${Date.now()}`,
      driverName,
      cargo,
      weight,
      origin,
      destination,
      tempCelsius: 4.2,
      status: "In Transit",
      progress: 10
    };
    onAddRoute(newRoute);
  };

  const handleAerate = (id: string) => {
    // Action: Silo aeration cools the grain down and lowers humidity
    onUpdateSilo(id, {
      tempCelsius: 14.5,
      humidityPercent: 11.2,
      status: "Optimal"
    });
    alert("Industrial silo fan cooling and aeration cycles triggered successfully.");
  };

  // RENDER LOGISTICS VIEW
  if (activeRole === UserRole.LOGISTICS) {
    return (
      <LogisticsProviderPortal
        activeRole={activeRole}
        routes={routes}
        silos={silos}
        onAddRoute={onAddRoute}
        onUpdateRoute={onUpdateRoute}
        onUpdateSilo={onUpdateSilo}
      />
    );
  }

  // RENDER WAREHOUSE OPERATOR VIEW
  return (
    <WarehouseOperatorPortal
      activeRole={activeRole}
      silos={silos}
      onUpdateSilo={onUpdateSilo}
    />
  );
}
