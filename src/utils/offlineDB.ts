/**
 * AgriConnect AI - Robust Native IndexedDB Utility for Offline & Sync Engine
 * Stores product data, orders, customer data, farmers, schemes, reports, and sync queue offline.
 */

const DB_NAME = "AgriConnectOfflineDB";
const DB_VERSION = 1;

export interface SyncAction {
  id: string; // Unique queue item ID
  type: "ADD_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT" | "ADD_ORDER" | "ADD_CUSTOMER" | "UPDATE_CUSTOMER" | "ADD_FARMER" | "ADD_SCHEME" | "ADD_REPORT";
  storeName: "products" | "orders" | "customers" | "farmers" | "schemes" | "reports";
  payload: any;
  timestamp: number;
  synced: boolean;
}

export const SEED_FARMERS = [
  { id: "FMR-2104", name: "Amir Patel", email: "amir.patel@agrifarm.org", location: "Krishna Block", phone: "+91 98765-12345", joinedDate: "2026-01-10", landSizeAcres: 12.5, crops: "Certified Organic Basmati Rice" },
  { id: "FMR-2105", name: "Vikram Singh", email: "vikram.singh@agricloud.in", location: "Guntur Block", phone: "+91 98765-54321", joinedDate: "2025-11-15", landSizeAcres: 15.0, crops: "Hybrid Wheat & Maize" },
  { id: "FMR-2106", name: "Rajesh Grewal", email: "rajesh.g@greengrow.org", location: "Karnal Block", phone: "+91 98765-88888", joinedDate: "2026-02-14", landSizeAcres: 8.4, crops: "Sugarcane" },
  { id: "FMR-2107", name: "Siddharth Roy", email: "siddharth.r@agroiot.net", location: "Krishna East Block", phone: "+91 98765-99999", joinedDate: "2026-03-05", landSizeAcres: 5.2, crops: "Paddy/Rice" },
  { id: "FMR-2108", name: "Lalita Bai", email: "lalitabhai@organicco.in", location: "Bapatla Block", phone: "+91 98765-11111", joinedDate: "2026-04-12", landSizeAcres: 3.5, crops: "Organic Tomatoes" },
  { id: "FMR-2109", name: "Gurpreet Singh", email: "gurpreet.s@basmati.in", location: "Vijayawada Block B", phone: "+91 98765-22222", joinedDate: "2026-05-20", landSizeAcres: 10.2, crops: "Basmati Rice" }
];

export const SEED_SCHEMES = [
  { id: "scheme-db-1", title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)", category: "Direct Benefit Transfer", fundingAmount: 6000, approvedCount: 145000, status: "Active", description: "Direct Benefit Transfer (DBT) scheme providing ₹6,000 per year in three installments to farmer bank accounts." },
  { id: "scheme-db-2", title: "PM-FBY (Pradhan Mantri Fasal Bima Yojana)", category: "Crop Insurance", fundingAmount: 250000, approvedCount: 88000, status: "Active", description: "National crop insurance protection program shielding farmers from severe flood, drought, pest, and hail losses." },
  { id: "scheme-db-3", title: "PM-KUSUM (Solar Water Pumps Subsidy)", category: "Solar Irrigation", fundingAmount: 180000, approvedCount: 12000, status: "Active", description: "Provides 60% capital subsidy (30% Central, 30% State) for installing off-grid solar-powered water irrigation pumps." },
  { id: "scheme-db-4", title: "SMAM (Sub-Mission on Agricultural Mechanization)", category: "Mechanization", fundingAmount: 500000, approvedCount: 4500, status: "Active", description: "Subsidizes agricultural drones, custom tractors, tillage equipment, and localized high-tech custom hiring hubs." },
  { id: "scheme-db-5", title: "Smallholder Solar Drip Irrigation Subsidy", category: "Climate Resilience", fundingAmount: 250000, approvedCount: 14, status: "Active", description: "Capital backing providing 80% funding for integrated micro-irrigation drip lines and solar kits." },
  { id: "scheme-db-6", title: "Organic Bio-Fertilizer Transition Program", category: "Organic Transition", fundingAmount: 180000, approvedCount: 8, status: "Active", description: "Grants enabling cooperative societies to construct village-level vermicomposting pits and transition off synthetic urea." }
];

export const SEED_REPORTS = [
  { id: "REP-001", title: "Monthly Agricultural Executive Briefing", category: "Executive Summary", date: "2026-07-15", description: "Briefing generated for the Agriculture Minister: Crop Health Index is 84%, total DBT disbursed is ₹24.2 Cr, solar installs at 92%." },
  { id: "REP-002", title: "Crop Yield Projection Report", category: "Yield Analytics", date: "2026-07-10", description: "Granular district crop performance data: Basmati Rice yields 3.6 tons/acre, Wheat yields 2.8 tons/acre. Stable 4.2% YoY increase." },
  { id: "REP-003", title: "Disaster Assistance Block Allocation Report", category: "Disaster Management", date: "2026-07-08", description: "Damage loss report: Guntur West block requires ₹18.5 Crores, Tenali block needs ₹8.2 Cr, Bapatla block requires ₹4.1 Cr." },
  { id: "REP-004", title: "Soil Health Card Matrix Report", category: "Soil Chemistry", date: "2026-07-01", description: "Comprehensive laboratory soil summary: District average pH is 6.4, moisture is 42%, N-P-K balance is stable." },
  { id: "REP-005", title: "Crop Diagnostics Summary Report", category: "AI Pathology", date: "2026-06-28", description: "AI image pathology report: Tomato Early Blight verified at 94% confidence, Rice Bacterial Leaf Streak at 88%." }
];

export type StoreNameType = "products" | "orders" | "customers" | "farmers" | "schemes" | "reports" | "syncQueue";

// Open and upgrade the database
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("[IndexedDB] Error opening database:", event);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;

      // Products store
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id" });
      }

      // Orders store
      if (!db.objectStoreNames.contains("orders")) {
        db.createObjectStore("orders", { keyPath: "id" });
      }

      // Customers store
      if (!db.objectStoreNames.contains("customers")) {
        db.createObjectStore("customers", { keyPath: "id" });
      }

      // Farmers store
      if (!db.objectStoreNames.contains("farmers")) {
        db.createObjectStore("farmers", { keyPath: "id" });
      }

      // Schemes store
      if (!db.objectStoreNames.contains("schemes")) {
        db.createObjectStore("schemes", { keyPath: "id" });
      }

      // Reports store
      if (!db.objectStoreNames.contains("reports")) {
        db.createObjectStore("reports", { keyPath: "id" });
      }

      // Sync actions queue store
      if (!db.objectStoreNames.contains("syncQueue")) {
        db.createObjectStore("syncQueue", { keyPath: "id" });
      }

      console.log("[IndexedDB] Stores successfully provisioned & upgraded.");
    };
  });
}

/**
 * Generic helper to save or update an item in a store
 */
export async function saveOfflineItem<T>(storeName: StoreNameType, item: T): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Save failed in ${storeName}:`, err);
  }
}

/**
 * Generic helper to save multiple items to a store
 */
export async function saveOfflineItemsBulk<T>(storeName: StoreNameType, items: T[]): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

      items.forEach((item) => {
        store.put(item);
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Bulk save failed in ${storeName}:`, err);
  }
}

/**
 * Generic helper to delete an item by key
 */
export async function deleteOfflineItem(storeName: StoreNameType, id: string): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Delete failed in ${storeName}:`, err);
  }
}

/**
 * Generic helper to read all items in a store
 */
export async function getAllOfflineItems<T>(storeName: StoreNameType): Promise<T[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] GetAll failed in ${storeName}:`, err);
    return [];
  }
}

/**
 * Sync Queue helpers
 */
export async function queueOfflineAction(action: Omit<SyncAction, "id" | "timestamp" | "synced">): Promise<string> {
  const actionId = `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const syncAction: SyncAction = {
    ...action,
    id: actionId,
    timestamp: Date.now(),
    synced: false,
  };
  await saveOfflineItem("syncQueue", syncAction);
  console.log(`[IndexedDB] Enqueued offline action: ${action.type}`, syncAction);
  return actionId;
}

/**
 * Count total records currently cached across core stores
 */
export async function getOfflineStats() {
  const products = await getAllOfflineItems("products");
  const orders = await getAllOfflineItems("orders");
  const customers = await getAllOfflineItems("customers");
  const farmers = await getAllOfflineItems("farmers");
  const schemes = await getAllOfflineItems("schemes");
  const reports = await getAllOfflineItems("reports");
  const queue = await getAllOfflineItems<SyncAction>("syncQueue");

  return {
    productsCount: products.length,
    ordersCount: orders.length,
    customersCount: customers.length,
    farmersCount: farmers.length,
    schemesCount: schemes.length,
    reportsCount: reports.length,
    queueCount: queue.length,
    totalRecords: products.length + orders.length + customers.length + farmers.length + schemes.length + reports.length
  };
}

/**
 * Reset and re-seed offline databases from current memory array state
 */
export async function resetOfflineDB(products: any[], orders: any[], customers: any[]) {
  try {
    const db = await openOfflineDB();
    
    // Clear all stores
    const stores: StoreNameType[] = ["products", "orders", "customers", "farmers", "schemes", "reports", "syncQueue"];
    const tx = db.transaction(stores, "readwrite");
    
    stores.forEach((s) => tx.objectStore(s).clear());
    
    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });

    // Populate stores
    if (products && products.length > 0) await saveOfflineItemsBulk("products", products);
    if (orders && orders.length > 0) await saveOfflineItemsBulk("orders", orders);
    if (customers && customers.length > 0) await saveOfflineItemsBulk("customers", customers);
    
    // Seed farmers, schemes, reports offline
    await saveOfflineItemsBulk("farmers", SEED_FARMERS);
    await saveOfflineItemsBulk("schemes", SEED_SCHEMES);
    await saveOfflineItemsBulk("reports", SEED_REPORTS);

    console.log("[IndexedDB] Cache successfully cleared and re-populated including Farmers, Schemes and Reports.");
  } catch (err) {
    console.error("[IndexedDB] Reset failed:", err);
  }
}
