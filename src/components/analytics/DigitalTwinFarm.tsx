import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Layers,
  Sparkles,
  Compass,
  Cpu,
  Database,
  Sun,
  Wind,
  Droplet,
  Printer,
  Calendar,
  Eye,
  Activity,
  Play,
  Pause,
  RotateCw,
  Sliders,
  TrendingUp,
  Map,
  Users,
  Navigation,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import * as THREE from "three";

interface PlotData {
  id: number;
  name: string;
  crop: string;
  category: string;
  moisture: number; // %
  elevation: number; // meters offset
  expectedYield: number; // tons/acre
  weedRisk: number; // %
  nitrogen: number; // ppm
  laborAssigned: number; // people count
}

export default function DigitalTwinFarm() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // --- WEBGL STATE CONTROLS ---
  const [selectedPlot, setSelectedPlot] = useState<number>(1);
  const [timeOfDay, setTimeOfDay] = useState<number>(10); // 0-24 hours
  const [windSpeed, setWindSpeed] = useState<number>(12); // km/h
  const [windAngle, setWindAngle] = useState<number>(45); // degrees
  const [irrigationPulse, setIrrigationPulse] = useState<boolean>(true);
  const [orthoOverlay, setOrthoOverlay] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<"normal" | "drought" | "flood" | "storm">("normal");
  
  // --- TIME-LAPSE STATE ---
  const [timeLapseYear, setTimeLapseYear] = useState<number>(2026);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // --- MODEL/EQUIPMENT STATES ---
  const [tractorState, setTractorState] = useState<"Stationary" | "Ploughing" | "Seeding">("Stationary");
  const [laborLevel, setLaborLevel] = useState<number>(4); // workers

  // --- HEIGHT MAP GENERATION SLIDER ---
  const [terrainRoughness, setTerrainRoughness] = useState<number>(50); // height offset intensity

  // --- INTERNAL WEBGL REFS FOR UPDATE ---
  const terrainMeshRef = useRef<THREE.Mesh[]>([]);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const cropsGroupRef = useRef<THREE.Group | null>(null);
  const windGroupRef = useRef<THREE.Group | null>(null);
  const droneMeshRef = useRef<THREE.Group | null>(null);
  const tractorGroupRef = useRef<THREE.Group | null>(null);
  const skyMeshRef = useRef<THREE.Mesh | null>(null);

  // --- PLOTS STATIC / DYNAMIC REGISTRY ---
  const plotsList: PlotData[] = useMemo(() => {
    // Dynamic generation based on time-lapse year and selected scenario
    const moistureFactor = activeScenario === "drought" ? 0.3 : activeScenario === "flood" ? 1.8 : 1.0;
    const yieldMultiplier = timeLapseYear === 2022 ? 0.75 : timeLapseYear === 2024 ? 0.9 : 1.15;

    return [
      { id: 1, name: "North-West Meadow", crop: timeLapseYear < 2024 ? "Mono-Wheat" : "Premium Basmati", category: "Cereal", moisture: Math.min(100, Math.round(58 * moistureFactor)), elevation: 1.2, expectedYield: parseFloat((14.2 * yieldMultiplier).toFixed(1)), weedRisk: 12, nitrogen: 48, laborAssigned: 1 },
      { id: 2, name: "Ridge Slope Pad", crop: timeLapseYear < 2024 ? "Fallow" : "Berseem Clover", category: "Legume", moisture: Math.min(100, Math.round(42 * moistureFactor)), elevation: 2.8, expectedYield: parseFloat((9.5 * yieldMultiplier).toFixed(1)), weedRisk: 4, nitrogen: 95, laborAssigned: 0 },
      { id: 3, name: "Clay Bottomlands", crop: "Hybrid Maize", category: "Cereal", moisture: Math.min(100, Math.round(74 * moistureFactor)), elevation: 0.1, expectedYield: parseFloat((18.1 * yieldMultiplier).toFixed(1)), weedRisk: 28, nitrogen: 55, laborAssigned: 2 },
      { id: 4, name: "South Orchard Loft", crop: "Alfalfa Fodder", category: "Pasture", moisture: Math.min(100, Math.round(62 * moistureFactor)), elevation: 1.9, expectedYield: parseFloat((11.8 * yieldMultiplier).toFixed(1)), weedRisk: 8, nitrogen: 80, laborAssigned: 1 },
      { id: 5, name: "East Terrace", crop: timeLapseYear < 2025 ? "Cotton" : "Mustard Oilseed", category: "Oilseed", moisture: Math.min(100, Math.round(49 * moistureFactor)), elevation: 2.1, expectedYield: parseFloat((12.4 * yieldMultiplier).toFixed(1)), weedRisk: 15, nitrogen: 62, laborAssigned: 0 },
      { id: 6, name: "Riverside Flat", crop: "Sesbania Green Cover", category: "Cover Crop", moisture: Math.min(100, Math.round(85 * moistureFactor)), elevation: -0.4, expectedYield: parseFloat((5.0 * yieldMultiplier).toFixed(1)), weedRisk: 35, nitrogen: 110, laborAssigned: 1 }
    ];
  }, [timeLapseYear, activeScenario]);

  // Handle selected plot
  const activePlot = useMemo(() => {
    return plotsList.find(p => p.id === selectedPlot) || plotsList[0];
  }, [plotsList, selectedPlot]);

  // --- AUTOMATED TIME-LAPSE TICK ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setTimeLapseYear(prev => {
          if (prev >= 2026) {
            return 2022; // Loop back
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // --- THREE.JS INITIALIZATION & LIFECYCLE ---
  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0f172a"); // Dark slate starry skybox

    // Starry sky background generator
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 500;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 150;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 2. Camera Setup
    const width = mountRef.current.clientWidth;
    const height = 450;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(18, 16, 22);
    camera.lookAt(0, 1, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting Elements
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.2);
    sunLight.position.set(15, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 80;
    const d = 15;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);
    directionalLightRef.current = sunLight;

    // Small ambient light helper representing blue sky bounce
    const skyBounceLight = new THREE.HemisphereLight(0x3b82f6, 0x1e293b, 0.3);
    scene.add(skyBounceLight);

    // 5. Build Plots Terrain
    // We create a grid structure representing our plots
    const plotsGroup = new THREE.Group();
    scene.add(plotsGroup);

    terrainMeshRef.current = [];

    // Grid details: 3 columns x 2 rows
    const plotPositions = [
      { x: -5, z: -3.5, id: 1 },
      { x: 0, z: -3.5, id: 2 },
      { x: 5, z: -3.5, id: 3 },
      { x: -5, z: 3.5, id: 4 },
      { x: 0, z: 3.5, id: 5 },
      { x: 5, z: 3.5, id: 6 }
    ];

    plotPositions.forEach((pos, idx) => {
      const plotMeta = (plotsList[idx] || {
        id: idx + 1,
        name: `Plot ${idx + 1}`,
        crop: "Wheat",
        category: "Cereal",
        moisture: 50,
        elevation: 1.0,
        expectedYield: 10,
        weedRisk: 10,
        nitrogen: 50,
        laborAssigned: 1
      }) as PlotData;
      
      // Calculate depth height from Drone raw heightmap offset slider
      const targetHeight = 1.0 + (plotMeta.elevation * (terrainRoughness / 50));
      
      const geom = new THREE.BoxGeometry(4.2, targetHeight, 5.5);
      
      // Compute coloration based on soil health / moisture
      let soilColor = "#5c4033"; // Healthy brown
      if (activeScenario === "drought") {
        soilColor = "#b58d63"; // Cracked dried sand
      } else if (activeScenario === "flood") {
        soilColor = "#3d2d25"; // Waterlogged mud
      } else if (plotMeta.category === "Legume") {
        soilColor = "#4d3a2f"; // Nitrogen-rich dark loam
      }

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(soilColor),
        roughness: 0.9,
        metalness: 0.05
      });

      const mesh = new THREE.Mesh(geom, mat);
      // Place so top of box is variable, aligned at bottom
      mesh.position.set(pos.x, targetHeight / 2 - 1, pos.z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.userData = { id: pos.id };
      plotsGroup.add(mesh);
      terrainMeshRef.current.push(mesh);

      // Create a nice green wireframe border highlighting the plot
      const wireGeo = new THREE.BoxGeometry(4.22, targetHeight + 0.02, 5.52);
      const wireMat = new THREE.MeshBasicMaterial({
        color: selectedPlot === pos.id ? 0x10b981 : 0x475569,
        wireframe: true,
        transparent: true,
        opacity: selectedPlot === pos.id ? 0.9 : 0.3
      });
      const wireframe = new THREE.Mesh(wireGeo, wireMat);
      wireframe.position.copy(mesh.position);
      plotsGroup.add(wireframe);
    });

    // 6. Water Plane for Flood scenario simulation
    const waterGeom = new THREE.PlaneGeometry(24, 20);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.8
    });
    const waterMesh = new THREE.Mesh(waterGeom, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -0.55; // Sit slightly below flat plains
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 7. Crops Visualization Layer
    const cropsGroup = new THREE.Group();
    scene.add(cropsGroup);
    cropsGroupRef.current = cropsGroup;

    // Populate crops visually on top of the terrain blocks
    plotPositions.forEach((pos, idx) => {
      const plotMeta = plotsList[idx];
      if (!plotMeta) return;

      const baseTerrainHeight = 1.0 + (plotMeta.elevation * (terrainRoughness / 50));
      const topY = baseTerrainHeight - 1; // Top of the soil block

      // Draw clusters of custom 3D crops
      const cropCount = 12;
      for (let i = 0; i < cropCount; i++) {
        // Random placement offset on the 4.2 x 5.5 plot space
        const offsetX = (Math.random() - 0.5) * 3.2;
        const offsetZ = (Math.random() - 0.5) * 4.5;

        // Visual design of crop representation based on category
        let cropMesh: THREE.Object3D;
        const growthScale = (timeLapseYear - 2021) * 0.25; // Grow larger over time

        if (plotMeta.category === "Cereal") {
          // Yellowish wheat stalks
          const stemGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.8 * growthScale, 4);
          const stemMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.8 });
          cropMesh = new THREE.Mesh(stemGeom, stemMat);
          cropMesh.position.set(pos.x + offsetX, topY + (0.4 * growthScale), pos.z + offsetZ);
        } else if (plotMeta.category === "Legume") {
          // Leafy green small shrubs
          const bushGeom = new THREE.DodecahedronGeometry(0.22 * growthScale, 1);
          const bushMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
          cropMesh = new THREE.Mesh(bushGeom, bushMat);
          cropMesh.position.set(pos.x + offsetX, topY + (0.2 * growthScale), pos.z + offsetZ);
        } else if (plotMeta.category === "Pasture") {
          // High lush grass blades
          const grassGeom = new THREE.ConeGeometry(0.08, 0.9 * growthScale, 3);
          const grassMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });
          cropMesh = new THREE.Mesh(grassGeom, grassMat);
          cropMesh.position.set(pos.x + offsetX, topY + (0.45 * growthScale), pos.z + offsetZ);
        } else {
          // Dark leafy cover crops / oilseeds
          const oilseedGeom = new THREE.SphereGeometry(0.18 * growthScale, 5, 5);
          const oilseedMat = new THREE.MeshStandardMaterial({ color: 0x047857 });
          cropMesh = new THREE.Mesh(oilseedGeom, oilseedMat);
          cropMesh.position.set(pos.x + offsetX, topY + (0.18 * growthScale), pos.z + offsetZ);
        }

        cropMesh.castShadow = true;
        cropMesh.receiveShadow = true;
        cropsGroup.add(cropMesh);
      }
    });

    // 8. Visual Drone Quadcopter scanning the fields
    const droneGroup = new THREE.Group();
    // Drone frame
    const droneFrameGeom = new THREE.BoxGeometry(1.2, 0.08, 0.08);
    const droneMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const arm1 = new THREE.Mesh(droneFrameGeom, droneMat);
    const arm2 = arm1.clone();
    arm2.rotation.y = Math.PI / 2;
    droneGroup.add(arm1);
    droneGroup.add(arm2);

    // Quad rotors (cylinders)
    const rotorGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 8);
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    for (let i = 0; i < 4; i++) {
      const rotor = new THREE.Mesh(rotorGeom, rotorMat);
      const angle = (i * Math.PI) / 2;
      rotor.position.set(Math.cos(angle) * 0.6, 0.05, Math.sin(angle) * 0.6);
      droneGroup.add(rotor);
    }

    // Green scan laser visualizer cone
    const scanConeGeom = new THREE.ConeGeometry(1.8, 4.0, 16, 1, true);
    const scanConeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const scanCone = new THREE.Mesh(scanConeGeom, scanConeMat);
    scanCone.position.y = -2.0;
    droneGroup.add(scanCone);

    droneGroup.position.set(0, 4.5, 0);
    scene.add(droneGroup);
    droneMeshRef.current = droneGroup;

    // 9. Equipment visual: Red farm tractor blocks
    const tractorGroup = new THREE.Group();
    // Body box
    const bodyGeom = new THREE.BoxGeometry(1.0, 0.6, 0.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.3;
    tractorGroup.add(body);
    // Cabin
    const cabinGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
    const cabin = new THREE.Mesh(cabinGeom, cabinMat);
    cabin.position.set(-0.2, 0.8, 0);
    tractorGroup.add(cabin);
    // Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.15, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const wheels = [];
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      const xOffset = i < 2 ? 0.35 : -0.35;
      const zOffset = i % 2 === 0 ? 0.35 : -0.35;
      wheel.position.set(xOffset, 0.15, zOffset);
      tractorGroup.add(wheel);
    }
    // Park the tractor on the east side road
    tractorGroup.position.set(8.5, 0.2, 3.5);
    scene.add(tractorGroup);
    tractorGroupRef.current = tractorGroup;

    // 10. Wind Particles Visualizer Group
    const windGroup = new THREE.Group();
    scene.add(windGroup);
    windGroupRef.current = windGroup;

    const lineGeom = new THREE.BufferGeometry();
    const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.2, 0, 0)];
    lineGeom.setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.4 });

    for (let i = 0; i < 30; i++) {
      const windLine = new THREE.Line(lineGeom, lineMat);
      windLine.position.set(
        (Math.random() - 0.5) * 22,
        2.0 + Math.random() * 4.5,
        (Math.random() - 0.5) * 18
      );
      windGroup.add(windLine);
    }

    // --- ANIMATION LOOP ---
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // 1. Rotate starfield slowly
      starField.rotation.y = time * 0.015;

      // 2. Animate drone hovering in a figure-eight path above target plot
      // Fly towards the selected plot coordinate
      const targetPlotPos = plotPositions.find(p => p.id === selectedPlot) || plotPositions[0];
      const targetX = targetPlotPos.x + Math.sin(time * 2.5) * 0.8;
      const targetZ = targetPlotPos.z + Math.cos(time * 1.5) * 0.8;
      const targetY = 4.2 + Math.sin(time * 3) * 0.25;

      droneGroup.position.x += (targetX - droneGroup.position.x) * 0.06;
      droneGroup.position.z += (targetZ - droneGroup.position.z) * 0.06;
      droneGroup.position.y += (targetY - droneGroup.position.y) * 0.06;

      // Spin propellers rapidly
      droneGroup.children.forEach((child, index) => {
        if (index >= 2 && index < 6) { // rotors
          child.rotation.y = time * 25;
        }
      });

      // Pulse the green scanning cone scale
      scanCone.scale.set(1 + Math.sin(time * 4) * 0.1, 1, 1 + Math.sin(time * 4) * 0.1);

      // 3. Animate tractor if Ploughing/Seeding
      if (tractorState !== "Stationary") {
        tractorGroup.position.x = 8.5 + Math.sin(time * 1.2) * 1.8;
        tractorGroup.position.z = 3.5 + Math.cos(time * 0.8) * 1.5;
        // Make tractor point along motion vector
        tractorGroup.rotation.y = time * 1.1;
      } else {
        // Return to resting garage pad spot
        tractorGroup.position.set(8.5, 0.2, 3.5);
        tractorGroup.rotation.y = 0;
      }

      // 4. Animate wind lines flowing based on selected speed and direction
      const speedFactor = windSpeed / 100;
      const rad = (windAngle * Math.PI) / 180;
      const windX = Math.cos(rad) * speedFactor;
      const windZ = Math.sin(rad) * speedFactor;

      windGroup.children.forEach(child => {
        child.position.x += windX;
        child.position.z += windZ;

        // Wrap particles around boundaries
        if (child.position.x > 12) child.position.x = -12;
        if (child.position.x < -12) child.position.x = 12;
        if (child.position.z > 10) child.position.z = -10;
        if (child.position.z < -10) child.position.z = 10;
      });

      // 5. Update Directional Sunlight position dynamically from slider
      const sunRad = ((timeOfDay - 6) / 12) * Math.PI; // sun rises at 6, sets at 18
      const lightX = Math.cos(sunRad) * 20;
      const lightY = Math.sin(sunRad) * 20;
      const lightZ = 8;

      if (directionalLightRef.current) {
        if (timeOfDay < 6 || timeOfDay > 18) {
          // Night time: dim/cool moonlight style
          directionalLightRef.current.intensity = 0.1;
          directionalLightRef.current.color.setHex(0x3b82f6);
          directionalLightRef.current.position.set(-5, 12, 5);
        } else {
          // Daytime warm tracker
          directionalLightRef.current.intensity = 1.3 * Math.sin(sunRad);
          directionalLightRef.current.color.setHex(0xfef08a);
          directionalLightRef.current.position.set(lightX, Math.max(2, lightY), lightZ);
        }
      }

      // 6. Water volume fluctuation for flood scenario
      if (waterMeshRef.current) {
        if (activeScenario === "flood") {
          waterMeshRef.current.position.y += (0.45 - waterMeshRef.current.position.y) * 0.05;
          waterMeshRef.current.material.opacity = 0.7;
        } else if (activeScenario === "storm") {
          waterMeshRef.current.position.y += (-0.2 - waterMeshRef.current.position.y) * 0.05;
          waterMeshRef.current.material.opacity = 0.55;
        } else {
          // drain out water to deep basin level
          waterMeshRef.current.position.y += (-1.8 - waterMeshRef.current.position.y) * 0.05;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Mouse Drag rotation controls for pure Three.js container
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      // Orbit camera around center point mathematically
      const theta = deltaX * 0.007;
      const phi = deltaY * 0.007;

      const pos = camera.position.clone();
      const radius = pos.length();

      // Simple rotation logic around Y axis
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);
      const nx = pos.x * cosTheta - pos.z * sinTheta;
      const nz = pos.x * sinTheta + pos.z * cosTheta;

      camera.position.set(nx, Math.max(5, Math.min(25, pos.y + phi * 10)), nz);
      camera.lookAt(0, 1, 0);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Bind events to mount element
    const container = mountRef.current;
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose materials & geometries
      starsGeometry.dispose();
      starsMaterial.dispose();
      waterGeom.dispose();
      waterMat.dispose();
      rotorGeom.dispose();
      rotorMat.dispose();
      scanConeGeom.dispose();
      scanConeMat.dispose();
      bodyGeom.dispose();
      bodyMat.dispose();
      cabinGeom.dispose();
      cabinMat.dispose();
      wheelGeom.dispose();
      wheelMat.dispose();
      lineGeom.dispose();
      lineMat.dispose();
    };
  }, [selectedPlot, activeScenario, timeLapseYear, terrainRoughness]);

  // --- 3D PRINT EXPORT GENERATOR (STL FORMATTER) ---
  const handleExportSTL = () => {
    // Generate ASCII STL file describing our 6-plot terrain blocks
    let stl = "solid digital_twin_farm\n";

    // Standard helper to write box triangles
    const writeBoxSTL = (x: number, y: number, z: number, w: number, h: number, d: number) => {
      const halfW = w / 2;
      const halfH = h / 2;
      const halfD = d / 2;

      // 8 Vertices
      const v = [
        { x: x - halfW, y: y - halfH, z: z - halfD },
        { x: x + halfW, y: y - halfH, z: z - halfD },
        { x: x + halfW, y: y + halfH, z: z - halfD },
        { x: x - halfW, y: y + halfH, z: z - halfD },
        { x: x - halfW, y: y - halfH, z: z + halfD },
        { x: x + halfW, y: y - halfH, z: z + halfD },
        { x: x + halfW, y: y + halfH, z: z + halfD },
        { x: x - halfW, y: y + halfH, z: z + halfD }
      ];

      // Triangles mapping
      const faces = [
        [0, 2, 1], [0, 3, 2], // Front
        [1, 6, 5], [1, 2, 6], // Right
        [5, 7, 4], [5, 6, 7], // Back
        [4, 3, 0], [4, 7, 3], // Left
        [3, 6, 2], [3, 7, 6], // Top
        [4, 1, 5], [4, 0, 1]  // Bottom
      ];

      let faceStr = "";
      faces.forEach(f => {
        faceStr += "  facet normal 0 0 0\n    outer loop\n";
        faceStr += `      vertex ${v[f[0]].x.toFixed(3)} ${v[f[0]].y.toFixed(3)} ${v[f[0]].z.toFixed(3)}\n`;
        faceStr += `      vertex ${v[f[1]].x.toFixed(3)} ${v[f[1]].y.toFixed(3)} ${v[f[1]].z.toFixed(3)}\n`;
        faceStr += `      vertex ${v[f[2]].x.toFixed(3)} ${v[f[2]].y.toFixed(3)} ${v[f[2]].z.toFixed(3)}\n`;
        faceStr += "    endloop\n  endfacet\n";
      });

      return faceStr;
    };

    // Map each of the 6 coordinates
    const positions = [
      { x: -5, z: -3.5, id: 1 },
      { x: 0, z: -3.5, id: 2 },
      { x: 5, z: -3.5, id: 3 },
      { x: -5, z: 3.5, id: 4 },
      { x: 0, z: 3.5, id: 5 },
      { x: 5, z: 3.5, id: 6 }
    ];

    positions.forEach((pos, idx) => {
      const plotMeta = plotsList[idx] || { elevation: 1.0 };
      const targetHeight = 1.0 + (plotMeta.elevation * (terrainRoughness / 50));
      stl += writeBoxSTL(pos.x, targetHeight / 2, pos.z, 4.0, targetHeight, 5.0);
    });

    stl += "endsolid digital_twin_farm\n";

    // Download file locally
    const blob = new Blob([stl], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `digital_twin_elevation_model_${timeLapseYear}.stl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="digital-twin-farm-suite" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Visual Header banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg animate-pulse">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              🧬 Dynamic Digital Twin Farm Simulation (3D WebGL)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Orthomosaic spatial modeling, sunlight tracking, drone telemetry streams, and scenario prediction matrixes
          </p>
        </div>

        {/* Playback time-lapse widget */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
          <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            Time-Lapse: {timeLapseYear}
          </span>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-1.5"
            title="Auto-play annual historic rotation evolutions"
          >
            {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
            {isAutoPlaying ? "Pause" : "Play Evolutions"}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas + Control grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WebGL Canvas stage (Interactive) */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[450px]">
          
          {/* Overlay hud stats */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-[10px] text-slate-300 space-y-1.5 backdrop-blur-sm pointer-events-none">
            <div className="font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 animate-pulse" /> Live Telemetry Feed
            </div>
            <div>Sun Angle Altitude: <span className="text-white font-mono">{timeOfDay * 15}°</span></div>
            <div>Drone Lidar Range: <span className="text-white font-mono">42.8m (Online)</span></div>
            <div>Scanned Plot: <span className="text-emerald-400 font-bold font-mono">#{selectedPlot}</span></div>
            <div>Tractor Activity: <span className="text-amber-500 font-extrabold font-mono uppercase">{tractorState}</span></div>
          </div>

          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {/* Quick 3D Printing Export button */}
            <button
              onClick={handleExportSTL}
              className="p-2.5 bg-slate-900/95 text-emerald-400 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer text-[10px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm"
              title="Compile and download exact STL geometry of heightmap"
            >
              <Printer className="h-3.5 w-3.5" />
              Export to 3D Print (.STL)
            </button>

            {/* Drone scan trigger */}
            <button
              onClick={() => {
                // cycle plots
                setSelectedPlot(prev => (prev % 6) + 1);
              }}
              className="p-2.5 bg-slate-900/95 text-indigo-400 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer text-[10px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm"
            >
              <Navigation className="h-3.5 w-3.5" />
              Retarget Lidar Scan
            </button>
          </div>

          {/* Compass instructions bottom */}
          <div className="absolute bottom-4 left-4 z-10 text-[9px] text-slate-500 font-bold bg-slate-900/80 p-2 rounded-lg pointer-events-none border border-slate-800/50">
            🖱️ DRAG TO ROTATE SCENE CAMERA • SCROLL TO ORBIT ZOOM
          </div>

          {/* Active Iframe Orthomosaic Texture toggle */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <span className="text-[9px] font-bold text-slate-400">Orthomosaic Grid:</span>
            <button
              onClick={() => setOrthoOverlay(!orthoOverlay)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer border ${
                orthoOverlay ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {orthoOverlay ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Canvas Mount */}
          <div ref={mountRef} className="w-full h-[450px]" />
        </div>

        {/* Sidebar Scenario planner & Inputs */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4 shadow-inner">
            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="h-4 w-4 text-indigo-600" />
              Interactive What-If Matrix Controls
            </h4>

            {/* Sunlight tracker slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1"><Sun className="h-3.5 w-3.5 text-yellow-500" /> Sunlight (Time of Day)</span>
                <span className="text-indigo-600 font-mono">{timeOfDay}:00 hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Wind flow intensity slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1"><Wind className="h-3.5 w-3.5 text-blue-500" /> Wind Velocity & Speed</span>
                <span className="text-indigo-600 font-mono">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Heightmap drone offset roughness slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Elevation Roughness Offset</span>
                <span className="text-indigo-600 font-mono">{terrainRoughness}% scale</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={terrainRoughness}
                onChange={(e) => setTerrainRoughness(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Scenario Quick Selector buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Simulate Environmental Scenarios</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveScenario("normal")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border cursor-pointer transition-all ${
                    activeScenario === "normal"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  🍃 Normal Balance
                </button>
                <button
                  onClick={() => setActiveScenario("drought")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border cursor-pointer transition-all ${
                    activeScenario === "drought"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ☀️ Severe Drought
                </button>
                <button
                  onClick={() => setActiveScenario("flood")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border cursor-pointer transition-all ${
                    activeScenario === "flood"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  🌧️ River Flooding
                </button>
                <button
                  onClick={() => setActiveScenario("storm")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border cursor-pointer transition-all ${
                    activeScenario === "storm"
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ⛈️ Gale Force Storm
                </button>
              </div>
            </div>

            {/* Equipment and labor configurations */}
            <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Equipment state</label>
                <select
                  value={tractorState}
                  onChange={(e) => setTractorState(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-bold focus:outline-none"
                >
                  <option value="Stationary">Stationary</option>
                  <option value="Ploughing">Ploughing Road</option>
                  <option value="Seeding">Active Seeding</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Labor Allocated</label>
                <div className="flex items-center justify-between bg-white border rounded-lg p-1 text-[11px] font-bold">
                  <button
                    onClick={() => setLaborLevel(l => Math.max(0, l - 1))}
                    className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-500 font-extrabold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-indigo-600">{laborLevel} Workers</span>
                  <button
                    onClick={() => setLaborLevel(l => Math.min(10, l + 1))}
                    className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-500 font-extrabold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Plot Telemetry Card breakdown */}
          <div className="p-4 rounded-2xl border bg-emerald-50/40 border-emerald-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Selected Plot Scanned Data</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Plot #{activePlot.id}</span>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-black text-slate-800">{activePlot.name}</h5>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Crop: <span className="text-slate-700 font-extrabold">{activePlot.crop} ({activePlot.category})</span></p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-600 font-mono">
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="block text-[8px] text-slate-400 font-black uppercase">Soil Moisture</span>
                <span className="text-xs font-black text-slate-800">{activePlot.moisture}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="block text-[8px] text-slate-400 font-black uppercase">Nitrogen Ratio</span>
                <span className="text-xs font-black text-emerald-700">+{activePlot.nitrogen} ppm</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="block text-[8px] text-slate-400 font-black uppercase">Weed Density</span>
                <span className="text-xs font-black text-rose-600">{activePlot.weedRisk}% Risk</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="block text-[8px] text-slate-400 font-black uppercase">Yield prediction</span>
                <span className="text-xs font-black text-indigo-600">{activePlot.expectedYield} Tons</span>
              </div>
            </div>

            {activePlot.weedRisk > 20 && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-[10px] leading-relaxed font-semibold flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <div>
                  <span className="font-extrabold">Warning:</span> Lidar weed density exceeds 20%. Recommended drone localized weeding action immediately.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
