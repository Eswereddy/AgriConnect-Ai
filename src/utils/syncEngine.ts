/**
 * AgriConnect AI - Real-time Offline Actions Sync Engine
 * Monitors online connectivity and automatically plays back cached actions from IndexedDB.
 */

import { getAllOfflineItems, deleteOfflineItem, saveOfflineItem, openOfflineDB, SyncAction } from "./offlineDB";

type SyncListener = (isOnline: boolean, pendingCount: number) => void;
const listeners = new Set<SyncListener>();

let isSyncing = false;

// Register connection listeners
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("[Sync Engine] Browser is online. Triggering automatic background synchronization...");
    triggerBackgroundSync();
  });

  window.addEventListener("offline", () => {
    console.log("[Sync Engine] Browser is offline. Local modifications will be queued in IndexedDB.");
    notifyListeners(false, 0);
  });
}

/**
 * Register a listener to sync state updates (online/offline state & queue size)
 */
export function registerSyncListener(listener: SyncListener): () => void {
  listeners.add(listener);
  // Initial fire
  checkPendingCount().then((count) => {
    listener(typeof navigator !== "undefined" ? navigator.onLine : true, count);
  });
  return () => {
    listeners.delete(listener);
  };
}

async function checkPendingCount(): Promise<number> {
  try {
    const queue = await getAllOfflineItems<SyncAction>("syncQueue");
    return queue.length;
  } catch {
    return 0;
  }
}

function notifyListeners(isOnline: boolean, pendingCount: number) {
  listeners.forEach((l) => {
    try {
      l(isOnline, pendingCount);
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * Trigger background sync of any pending actions
 */
export async function triggerBackgroundSync(): Promise<{ success: boolean; syncedCount: number; errors: string[] }> {
  if (isSyncing) return { success: false, syncedCount: 0, errors: ["Sync is already in progress."] };
  
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  if (!isOnline) {
    return { success: false, syncedCount: 0, errors: ["Cannot sync while browser is offline."] };
  }

  isSyncing = true;
  const errors: string[] = [];
  let syncedCount = 0;

  try {
    const queue = await getAllOfflineItems<SyncAction>("syncQueue");
    if (queue.length === 0) {
      isSyncing = false;
      notifyListeners(true, 0);
      return { success: true, syncedCount: 0, errors: [] };
    }

    console.log(`[Sync Engine] Processing ${queue.length} pending actions offline...`);

    // Process actions in chronological order
    const sortedQueue = queue.sort((a, b) => a.timestamp - b.timestamp);

    for (const action of sortedQueue) {
      try {
        await processSyncAction(action);
        // Delete action from IndexedDB upon successful reconciliation
        await deleteOfflineItem("syncQueue", action.id);
        syncedCount++;
      } catch (err: any) {
        console.error(`[Sync Engine] Reconciliation failed for action ${action.id}:`, err);
        errors.push(`Action ${action.type} failed: ${err?.message || "Unknown error"}`);
      }
    }

    console.log(`[Sync Engine] Completed sync of ${syncedCount} / ${queue.length} actions.`);
    
    // Dispatches a global event so views know to refresh state
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("agriconnect_offline_sync_completed", {
        detail: { syncedCount, errorsCount: errors.length }
      }));
    }

    const remainingCount = await checkPendingCount();
    notifyListeners(true, remainingCount);

  } catch (err: any) {
    console.error("[Sync Engine] Critical error in background sync:", err);
    errors.push(err?.message || "Critical sync error");
  } finally {
    isSyncing = false;
  }

  return {
    success: errors.length === 0,
    syncedCount,
    errors
  };
}

/**
 * Reconciles an individual offline action and merges it into local storage and indexedDB stores
 */
async function processSyncAction(action: SyncAction): Promise<void> {
  console.log(`[Sync Engine] Reconciling action: ${action.type} on store: ${action.storeName}`);

  // 1. Write the payload directly to our main IndexedDB store for double safety
  await saveOfflineItem(action.storeName, action.payload);

  // 2. Align local storage so existing view components instantly reflect the changes
  if (action.storeName === "products") {
    const currentStr = localStorage.getItem("agriconnect_supplier_items") || "[]";
    let items = JSON.parse(currentStr);
    
    if (action.type === "ADD_PRODUCT") {
      // Avoid duplicates
      if (!items.some((i: any) => i.id === action.payload.id)) {
        items.unshift(action.payload);
      }
    } else if (action.type === "UPDATE_PRODUCT") {
      items = items.map((i: any) => (i.id === action.payload.id ? action.payload : i));
    } else if (action.type === "DELETE_PRODUCT") {
      items = items.filter((i: any) => i.id !== action.payload.id);
    }
    localStorage.setItem("agriconnect_supplier_items", JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("agriconnect_supplier_items_updated"));
  }

  else if (action.storeName === "orders") {
    const currentStr = localStorage.getItem("agriconnect_supplier_orders") || "[]";
    let orders = JSON.parse(currentStr);

    if (action.type === "ADD_ORDER") {
      if (!orders.some((o: any) => o.id === action.payload.id)) {
        orders.unshift(action.payload);
      }
    }
    localStorage.setItem("agriconnect_supplier_orders", JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("agriconnect_supplier_orders_updated"));
  }

  else if (action.storeName === "customers") {
    const currentStr = localStorage.getItem("agriconnect_supplier_customers") || "[]";
    let list = JSON.parse(currentStr);

    if (action.type === "ADD_CUSTOMER") {
      if (!list.some((c: any) => c.id === action.payload.id)) {
        list.unshift(action.payload);
      }
    } else if (action.type === "UPDATE_CUSTOMER") {
      list = list.map((c: any) => (c.id === action.payload.id ? action.payload : c));
    }
    localStorage.setItem("agriconnect_supplier_customers", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("agriconnect_supplier_customers_updated"));
  }

  else if (action.storeName === "farmers") {
    const currentStr = localStorage.getItem("agriconnect_farmers_list") || "[]";
    let list = JSON.parse(currentStr);

    if (action.type === "ADD_FARMER") {
      if (!list.some((f: any) => f.id === action.payload.id)) {
        list.unshift(action.payload);
      }
    }
    localStorage.setItem("agriconnect_farmers_list", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("agriconnect_farmers_updated"));
  }

  else if (action.storeName === "schemes") {
    const currentStr = localStorage.getItem("agriconnect_schemes_list") || "[]";
    let list = JSON.parse(currentStr);

    if (action.type === "ADD_SCHEME") {
      if (!list.some((s: any) => s.id === action.payload.id)) {
        list.unshift(action.payload);
      }
    }
    localStorage.setItem("agriconnect_schemes_list", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("agriconnect_schemes_updated"));
  }

  else if (action.storeName === "reports") {
    const currentStr = localStorage.getItem("agriconnect_reports_list") || "[]";
    let list = JSON.parse(currentStr);

    if (action.type === "ADD_REPORT") {
      if (!list.some((r: any) => r.id === action.payload.id)) {
        list.unshift(action.payload);
      }
    }
    localStorage.setItem("agriconnect_reports_list", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("agriconnect_reports_updated"));
  }

  // Dispatch individual custom notification triggers so active React views re-evaluate state
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("agriconnect_localstorage_sync", {
      detail: { storeName: action.storeName, actionType: action.type }
    }));
  }
}
