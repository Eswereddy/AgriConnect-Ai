export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  category: "login" | "product" | "order" | "inventory";
  user: string;
  ipAddress: string;
}

const SEEDED_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-48201",
    timestamp: "2026-07-13T17:45:12-07:00",
    action: "Supplier Portal Authentication",
    details: "User successfully authenticated via AgriConnect 2FA secure OAuth gateway.",
    category: "login",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUD-48199",
    timestamp: "2026-07-12T14:32:00-07:00",
    action: "Inventory Stock Adjustment",
    details: "Adjusted stock for 'Organic Basmati Rice (Premium)'. Increased qty by +150 bags due to incoming buffer restock batch.",
    category: "inventory",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUD-48195",
    timestamp: "2026-07-12T11:15:30-07:00",
    action: "Order Status Transitioned",
    details: "Order #ORD-9024 marked as Processing. Procurement verification and inventory block successful.",
    category: "order",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUD-48190",
    timestamp: "2026-07-11T09:20:45-07:00",
    action: "Product Added to Catalog",
    details: "Created new catalog SKU-SEED-MIL-millet-seeds: 'Drought-Resilient Hybrid Millet Seeds' with base wholesale price of 32 INR/kg.",
    category: "product",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUD-48182",
    timestamp: "2026-07-10T16:10:22-07:00",
    action: "Supplier Portal Authentication",
    details: "User successfully authenticated via AgriConnect 2FA secure OAuth gateway.",
    category: "login",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.22"
  },
  {
    id: "AUD-48175",
    timestamp: "2026-07-09T13:40:11-07:00",
    action: "Order Dispatched to Courier",
    details: "Order #ORD-8941 dispatched via Delhivery Logistics. Tracking code generated: TRK-981242-IND.",
    category: "order",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.22"
  },
  {
    id: "AUD-48166",
    timestamp: "2026-07-08T10:05:14-07:00",
    action: "Product Price Updated",
    details: "SKU-FER-POT-sup-3 ('Sulphur-Free Potash Bio-Fertilizer') unit pricing edited from 28 INR to 25 INR.",
    category: "product",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.22"
  },
  {
    id: "AUD-48155",
    timestamp: "2026-07-07T11:50:00-07:00",
    action: "Routine Physical Stock Audit",
    details: "Completed physical stock count reconciliation. Found discrepancy of -5 units in Kashmiri Red Chili. Reconciled via FIFO correction.",
    category: "inventory",
    user: "jakkireddyeswarreddy@gmail.com",
    ipAddress: "192.168.1.18"
  }
];

export function getAuditTrail(): AuditLogEntry[] {
  const saved = localStorage.getItem("agriconnect_supplier_audit_trail");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading audit trail from localStorage", e);
    }
  }
  
  // Seed initial data if not present
  localStorage.setItem("agriconnect_supplier_audit_trail", JSON.stringify(SEEDED_LOGS));
  return SEEDED_LOGS;
}

export function addAuditEntry(
  action: string,
  details: string,
  category: "login" | "product" | "order" | "inventory",
  user: string = "jakkireddyeswarreddy@gmail.com"
): void {
  const currentLogs = getAuditTrail();
  
  const newEntry: AuditLogEntry = {
    id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    category,
    user,
    ipAddress: `192.168.1.${Math.floor(10 + Math.random() * 200)}`
  };
  
  const updatedLogs = [newEntry, ...currentLogs];
  localStorage.setItem("agriconnect_supplier_audit_trail", JSON.stringify(updatedLogs));
}
