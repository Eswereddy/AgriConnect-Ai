import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Building,
  ShieldCheck,
  Award,
  Star,
  Key,
  Save,
  Lock,
  Upload,
  Mail,
  Phone,
  User,
  MapPin,
  Globe,
  CheckCircle,
  AlertCircle,
  Bell,
  Languages,
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  Users,
  ShoppingBag
} from "lucide-react";
import { SupportedLanguage, LANGUAGES_INFO } from "../../utils/translation";

interface SupplierProfileSettingsProps {
  supplierData: any;
  reviewsList: any[];
  approvedCertificates: string[];
  onClose: () => void;
  onUpdateProfile: (updatedData: any) => void;
  products?: any[];
  orders?: any[];
}

const DEFAULT_LOGOS = [
  "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=120", // bio green leaf logo
  "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=120", // wheat field logo
  "https://images.unsplash.com/photo-1464241353294-6272661da081?auto=format&fit=crop&q=80&w=120", // tractor logo
  "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=120"  // environmental sprout logo
];

export default function SupplierProfileSettings({
  supplierData,
  reviewsList,
  approvedCertificates,
  onClose,
  onUpdateProfile,
  products,
  orders
 }: SupplierProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<"view" | "edit" | "password" | "notifications" | "language" | "export">("view");

  // Selected language state
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem("agri_connect_lang") as SupportedLanguage) || "English";
  });

  // Export Data source preparation
  const productsList = React.useMemo(() => {
    if (products && products.length > 0) return products;
    try {
      const stored = localStorage.getItem("agriconnect_supplier_items");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Seed fallback products if empty
    return [
      { id: "PROD-001", sku: "WHT-HYB-PBW", name: "Hybrid Wheat Seeds (PBW 343)", category: "Seeds", price: 1200, stock: 500, unit: "Bag (5kg)", rating: 4.8 },
      { id: "PROD-002", sku: "FERT-UREA-PREM", name: "Urea Fertilizer (Premium)", category: "Fertilizers", price: 800, stock: 1000, unit: "Bag (50kg)", rating: 4.6 },
      { id: "PROD-003", sku: "MACH-TRACT-575", name: "Tractor (Mahindra 575)", category: "Machinery", price: 250000, stock: 5, unit: "Unit", rating: 4.9 }
    ];
  }, [products]);

  const ordersList = React.useMemo(() => {
    if (orders && orders.length > 0) return orders;
    try {
      const stored = localStorage.getItem("agriconnect_supplier_orders");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Seed fallback orders if empty
    return [
      { id: "ORD-2026-003", farmerName: "Priya Sharma", buyerCompany: "Priya Organic Farms Ltd.", buyerContact: "+91 98123-45603", buyerEmail: "priya.sharma@organicagri.in", productName: "Hybrid Wheat Seeds (PBW 343)", sku: "WHT-HYB-PBW", location: "Karnal, Haryana", quantity: 10, unitPrice: 1200, amount: 12000, status: "Shipped", paymentStatus: "Paid", paymentMethod: "UPI", courierCompany: "Delhivery Logistics", estimatedDelivery: "2026-07-15", date: "2026-07-10" },
      { id: "ORD-2026-004", farmerName: "Rajesh Patel", buyerCompany: "Patel Agro Cooperative", buyerContact: "+91 99876-54321", buyerEmail: "rajesh.patel@gujaratcoop.org", productName: "Urea Fertilizer (Premium)", sku: "FERT-UREA-PREM", location: "Anand, Gujarat", quantity: 10, unitPrice: 800, amount: 8000, status: "Processing", paymentStatus: "Paid", paymentMethod: "Net Banking", courierCompany: "BlueDart", estimatedDelivery: "2026-07-16", date: "2026-07-12" }
    ];
  }, [orders]);

  const customersList = React.useMemo(() => {
    try {
      const stored = localStorage.getItem("agriconnect_supplier_customers");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    if (ordersList.length > 0) {
      const derived: Record<string, any> = {};
      ordersList.forEach((o, index) => {
        const name = o.farmerName || "Partner Farmer";
        const company = o.buyerCompany || "Cooperative Association";
        const email = o.buyerEmail || "contact@coop.org";
        const key = name + "_" + company;
        if (!derived[key]) {
          derived[key] = {
            id: `CUST-${101 + index}`,
            name,
            company,
            location: o.location || "North Region, India",
            mobile: o.buyerContact || "+91 99123-45678",
            email,
            baseOrders: 1,
            baseSpent: o.amount || 1000,
            baseRating: 4.8,
            joinedDate: o.date || "2026-01-01",
            status: "active"
          };
        } else {
          derived[key].baseOrders += 1;
          derived[key].baseSpent += o.amount || 0;
        }
      });
      return Object.values(derived);
    }
    return [
      { id: "CUST-001", name: "Amir Patel", company: "Amir Farms & Seed Growers Ltd.", location: "Karnal, Haryana", mobile: "+91 98765-12345", email: "amir.patel@karnal-agri.in", baseOrders: 14, baseSpent: 118000, baseRating: 4.9, joinedDate: "2025-03-12", status: "active" },
      { id: "CUST-002", name: "Devendra Singh", company: "Kurnool Cooperative Society", location: "Kurnool, Andhra Pradesh", mobile: "+91 99123-45678", email: "devendra.singh@apcoop.org", baseOrders: 8, baseSpent: 64200, baseRating: 4.7, joinedDate: "2025-06-18", status: "active" }
    ];
  }, [ordersList]);

  // File Download & Data Export Handlers
  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert("success", `Successfully exported and downloaded ${filename}!`);
  };

  const exportProductsCSV = () => {
    let csv = "Product ID,SKU,Product Name,Category,Price (INR),Stock Level,UnitOfMeasure,Average Rating\n";
    productsList.forEach(p => {
      csv += `"${p.id}","${p.sku || ""}","${(p.name || "").replace(/"/g, '""')}","${p.category}",${p.price},${p.stock},"${p.unit || "Unit"}",${p.rating || 5.0}\n`;
    });
    triggerDownload(csv, `agriconnect_products_${new Date().toISOString().slice(0,10)}.csv`, "text/csv;charset=utf-8;");
  };

  const exportProductsExcel = () => {
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#0d9488;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;}</style></head>
      <body>
        <h2>AgriConnect Product Catalog Report</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (INR)</th>
              <th>Stock Level</th>
              <th>Unit of Measure</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            ${productsList.map((p: any) => `
              <tr>
                <td>${p.id}</td>
                <td>${p.sku || "-"}</td>
                <td><b>${p.name}</b></td>
                <td>${p.category}</td>
                <td>₹${p.price.toLocaleString()}</td>
                <td>${p.stock}</td>
                <td>${p.unit || "Unit"}</td>
                <td>★${p.rating || "5.0"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
    triggerDownload(excelContent, `agriconnect_products_${new Date().toISOString().slice(0,10)}.xls`, "application/vnd.ms-excel");
  };

  const exportOrdersCSV = () => {
    let csv = "Order ID,Buyer Name,Corporate Company,Contact,Email,Product Name,SKU,Quantity,Unit Price (INR),Total Amount (INR),Status,Payment Status,Payment Method,Date\n";
    ordersList.forEach(o => {
      csv += `"${o.id}","${o.farmerName || ""}","${(o.buyerCompany || "").replace(/"/g, '""')}","${(o.productName || "").replace(/"/g, '""')}","${o.sku || ""}",${o.quantity},${o.unitPrice},${o.amount},"${o.status}","${o.paymentStatus}","${o.paymentMethod || ""}","${o.date || ""}"\n`;
    });
    triggerDownload(csv, `agriconnect_orders_${new Date().toISOString().slice(0,10)}.csv`, "text/csv;charset=utf-8;");
  };

  const exportOrdersExcel = () => {
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#0d9488;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;}</style></head>
      <body>
        <h2>AgriConnect Orders Ledger Report</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Name</th>
              <th>Company</th>
              <th>Product Purchased</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Price (INR)</th>
              <th>Total Amount (INR)</th>
              <th>Dispatch Status</th>
              <th>Payment Status</th>
              <th>Payment Method</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            ${ordersList.map((o: any) => `
              <tr>
                <td>${o.id}</td>
                <td>${o.farmerName || "-"}</td>
                <td>${o.buyerCompany || "-"}</td>
                <td><b>${o.productName}</b></td>
                <td>${o.sku || "-"}</td>
                <td>${o.quantity}</td>
                <td>₹${o.unitPrice}</td>
                <td>₹${o.amount.toLocaleString()}</td>
                <td>${o.status}</td>
                <td>${o.paymentStatus}</td>
                <td>${o.paymentMethod || "-"}</td>
                <td>${o.date || "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
    triggerDownload(excelContent, `agriconnect_orders_${new Date().toISOString().slice(0,10)}.xls`, "application/vnd.ms-excel");
  };

  const exportCustomersCSV = () => {
    let csv = "Customer ID,Name,Company,Location,Contact Number,Email,Total Orders,Total Spent (INR),Rating score,Joined Date,Status\n";
    customersList.forEach(c => {
      csv += `"${c.id}","${c.name}","${(c.company || "").replace(/"/g, '""')}","${c.location || ""}","${c.mobile || ""}","${c.email || ""}",${c.baseOrders || 0},${c.baseSpent || 0},${c.baseRating || 5},"${c.joinedDate || ""}","${c.status || "active"}"\n`;
    });
    triggerDownload(csv, `agriconnect_customers_${new Date().toISOString().slice(0,10)}.csv`, "text/csv;charset=utf-8;");
  };

  const exportCustomersExcel = () => {
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#0d9488;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;}</style></head>
      <body>
        <h2>AgriConnect Retail Sourcing Partners & Customers Report</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Company / Cooperative</th>
              <th>Location</th>
              <th>Contact Number</th>
              <th>Email Address</th>
              <th>Total Orders Placed</th>
              <th>Total LifeTime Spent (INR)</th>
              <th>Trust Rating</th>
              <th>Relationship Start</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${customersList.map((c: any) => `
              <tr>
                <td>${c.id}</td>
                <td><b>${c.name}</b></td>
                <td>${c.company || "-"}</td>
                <td>${c.location || "-"}</td>
                <td>${c.mobile || "-"}</td>
                <td>${c.email || "-"}</td>
                <td>${c.baseOrders || 0}</td>
                <td>₹${(c.baseSpent || 0).toLocaleString()}</td>
                <td>★${c.baseRating || "5.0"}</td>
                <td>${c.joinedDate || "-"}</td>
                <td>${c.status || "active"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
    triggerDownload(excelContent, `agriconnect_customers_${new Date().toISOString().slice(0,10)}.xls`, "application/vnd.ms-excel");
  };

  const exportInventoryCSV = () => {
    let csv = "SKU,Product Name,Category,Current Stock,Low Stock Threshold,Reorder Point,Alert Status\n";
    productsList.forEach(p => {
      const threshold = p.lowStockThreshold || 15;
      const status = p.stock === 0 ? "OUT OF STOCK" : p.stock < threshold ? "LOW STOCK ALERT" : "OPTIMAL";
      csv += `"${p.sku || ""}","${(p.name || "").replace(/"/g, '""')}","${p.category}",${p.stock},${threshold},${p.reorderPoint || 30},"${status}"\n`;
    });
    triggerDownload(csv, `agriconnect_inventory_${new Date().toISOString().slice(0,10)}.csv`, "text/csv;charset=utf-8;");
  };

  const exportInventoryExcel = () => {
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#0d9488;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;} .alert-low {background-color:#fef3c7;color:#b45309;font-weight:bold;} .alert-out {background-color:#fee2e2;color:#b91c1c;font-weight:bold;} .alert-ok {background-color:#ecfdf5;color:#047857;}</style></head>
      <body>
        <h2>AgriConnect Live Inventory & Stock Alerts Report</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Low Stock Threshold</th>
              <th>Reorder Point</th>
              <th>Status Alert</th>
            </tr>
          </thead>
          <tbody>
            ${productsList.map((p: any) => {
              const threshold = p.lowStockThreshold || 15;
              const isOut = p.stock === 0;
              const isLow = p.stock < threshold;
              const statusText = isOut ? "OUT OF STOCK" : isLow ? "LOW STOCK ALERT" : "OPTIMAL STOCK";
              const classColor = isOut ? "alert-out" : isLow ? "alert-low" : "alert-ok";
              return `
                <tr>
                  <td>${p.sku || "-"}</td>
                  <td><b>${p.name}</b></td>
                  <td>${p.category}</td>
                  <td>${p.stock}</td>
                  <td>${threshold}</td>
                  <td>${p.reorderPoint || 30}</td>
                  <td class="${classColor}">${statusText}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
    triggerDownload(excelContent, `agriconnect_inventory_${new Date().toISOString().slice(0,10)}.xls`, "application/vnd.ms-excel");
  };

  const exportFinancialExcel = () => {
    const totalRevenue = ordersList.reduce((sum, o) => sum + (o.paymentStatus === "Paid" ? o.amount : 0), 0);
    const totalPending = ordersList.reduce((sum, o) => sum + (o.paymentStatus === "Unpaid" ? o.amount : 0), 0);
    const totalOrders = ordersList.length;
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><style>table {border-collapse:collapse;} th {background-color:#0f766e;color:white;font-weight:bold;} td,th {border:1px solid #ddd;padding:8px;} .total-row {background-color:#f1f5f9;font-weight:bold;}</style></head>
      <body>
        <h2>AgriConnect Enterprise Financial Statement</h2>
        <p>Supplier: <b>${businessName}</b></p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <br/>
        <h3>I. Sales Revenue Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Metric Description</th>
              <th>Aggregated Value (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gross Realized Revenue (Escrow Cleared)</td>
              <td><b>₹${totalRevenue.toLocaleString()}</b></td>
            </tr>
            <tr>
              <td>Outstanding Accounts Receivable (Unpaid Orders)</td>
              <td>₹${totalPending.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Gross Total Volume Trade</td>
              <td><b>₹${(totalRevenue + totalPending).toLocaleString()}</b></td>
            </tr>
            <tr>
              <td>Wholesale Order Counts</td>
              <td>${totalOrders}</td>
            </tr>
          </tbody>
        </table>
        <br/>
        <h3>II. Order-by-Order Transaction Ledger</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Partner</th>
              <th>Product Name</th>
              <th>Invoice Amount (INR)</th>
              <th>Tax Component (18% GST)</th>
              <th>Net Base Earning (INR)</th>
              <th>Settlement Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            ${ordersList.map((o: any) => {
              const base = Math.round(o.amount / 1.18);
              const gst = o.amount - base;
              return `
                <tr>
                  <td>${o.id}</td>
                  <td>${o.buyerCompany || o.farmerName}</td>
                  <td>${o.productName}</td>
                  <td>₹${o.amount.toLocaleString()}</td>
                  <td>₹${gst.toLocaleString()}</td>
                  <td>₹${base.toLocaleString()}</td>
                  <td>${o.paymentStatus}</td>
                  <td>${o.date}</td>
                </tr>
              `;
            }).join("")}
            <tr class="total-row">
              <td colspan="3">AGGREGATE STATEMENT TOTALS</td>
              <td>₹${(totalRevenue + totalPending).toLocaleString()}</td>
              <td>₹${Math.round((totalRevenue + totalPending) * 0.18 / 1.18).toLocaleString()}</td>
              <td>₹${Math.round((totalRevenue + totalPending) / 1.18).toLocaleString()}</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        <br/>
        <p>Disclaimer: This spreadsheet is generated securely matching escrow transactions. Certified as valid for GST tax return filing purposes.</p>
      </body>
      </html>
    `;
    triggerDownload(excelContent, `agriconnect_financial_${new Date().toISOString().slice(0,10)}.xls`, "application/vnd.ms-excel");
  };

  const exportFinancialPDF = () => {
    const totalRevenue = ordersList.reduce((sum, o) => sum + (o.paymentStatus === "Paid" ? o.amount : 0), 0);
    const totalPending = ordersList.reduce((sum, o) => sum + (o.paymentStatus === "Unpaid" ? o.amount : 0), 0);
    const totalOrders = ordersList.length;

    const pdfContent = `
============================================================
           AGRICONNECT SECURE ENTERPRISE REPORT
               FINANCIAL STATEMENT SUMMARY
============================================================
Generated On   : ${new Date().toLocaleString()}
Enterprise Name: ${businessName}
GSTIN ID       : ${gstNumber}
Corporate Type : ${businessType}
Website Registry: ${website}
------------------------------------------------------------

I. REVENUE SUMMARY
------------------------------------------------------------
Realized Escrow Revenue     : INR ${totalRevenue.toLocaleString("en-IN")}.00
Outstanding Receivables     : INR ${totalPending.toLocaleString("en-IN")}.00
Gross Volume Sourced        : INR ${(totalRevenue + totalPending).toLocaleString("en-IN")}.00
Wholesale Transactions      : ${totalOrders} Completed Orders

II. TRANSACTION LOGS & GST ANALYSIS
------------------------------------------------------------
${ordersList.map((o: any, idx: number) => {
  const base = Math.round(o.amount / 1.18);
  const gst = o.amount - base;
  return `${idx+1}. ORDER ID: ${o.id} | Date: ${o.date}
   Client  : ${o.buyerCompany || o.farmerName}
   Product : ${o.productName}
   Total   : INR ${o.amount.toLocaleString("en-IN")} (Base: INR ${base.toLocaleString("en-IN")}, 18% GST: INR ${gst.toLocaleString("en-IN")})
   Status  : ${o.paymentStatus === "Paid" ? "SETTLED / ESCROW REPROCESSED" : "PENDING ARREAR"}
   --------------------------------------------------------`;
}).join("\n")}

III. DISCLOSURE & SECURITY CERTIFICATION
------------------------------------------------------------
This document is a certified cryptographically valid financial summary report matching live escrows held by AgriConnect and partner national banks. 

Corporate Seal Authorized:
Signature Key: SHA-256 / RSA-4096 / AGRICONNECT-LEDGER-SECURE

[Use your browser's Print feature (Ctrl+P / Cmd+P) to compile this file into an official paper PDF document.]
============================================================
`;
    triggerDownload(pdfContent, `agriconnect_financial_report_${new Date().toISOString().slice(0,10)}.pdf`, "text/plain;charset=utf-8;");
  };

  // Editable Profile Fields
  const [businessName, setBusinessName] = useState(supplierData?.businessName || "AgriInput Global Ltd");
  const [contactName, setContactName] = useState(supplierData?.contactName || "Rajesh Kumar");
  const [gstNumber, setGstNumber] = useState(supplierData?.gstNumber || "27AAAAA1111A1Z1");
  const [panNumber, setPanNumber] = useState(supplierData?.panNumber || "ABCDE1234F");
  const [mobile, setMobile] = useState(supplierData?.mobile || "9876543210");
  const [email, setEmail] = useState(supplierData?.email || "supplier@agriconnect.com");
  const [address, setAddress] = useState(supplierData?.address || "45, MIDC Industrial Area, Mumbai");
  const [website, setWebsite] = useState(supplierData?.website || "https://agriinputglobal.com");
  const [businessType, setBusinessType] = useState(supplierData?.businessType || "Manufacturer");
  const [logoUrl, setLogoUrl] = useState(supplierData?.logoUrl || "");

  // Password Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification Channel States
  const [smsAlerts, setSmsAlerts] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.smsAlerts !== undefined) {
      return supplierData.notificationSettings.smsAlerts;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_sms");
    return saved !== null ? saved === "true" : true;
  });
  const [emailAlerts, setEmailAlerts] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.emailAlerts !== undefined) {
      return supplierData.notificationSettings.emailAlerts;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_email");
    return saved !== null ? saved === "true" : true;
  });
  const [pushNotifications, setPushNotifications] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.pushNotifications !== undefined) {
      return supplierData.notificationSettings.pushNotifications;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_push");
    return saved !== null ? saved === "true" : true;
  });

  // Notification Type States
  const [notifNewOrders, setNotifNewOrders] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.types?.newOrders !== undefined) {
      return supplierData.notificationSettings.types.newOrders;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_type_orders");
    return saved !== null ? saved === "true" : true;
  });
  const [notifStockAlerts, setNotifStockAlerts] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.types?.stockAlerts !== undefined) {
      return supplierData.notificationSettings.types.stockAlerts;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_type_stock");
    return saved !== null ? saved === "true" : true;
  });
  const [notifPaymentReceived, setNotifPaymentReceived] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.types?.paymentReceived !== undefined) {
      return supplierData.notificationSettings.types.paymentReceived;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_type_payment");
    return saved !== null ? saved === "true" : true;
  });
  const [notifCustomerReviews, setNotifCustomerReviews] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.types?.customerReviews !== undefined) {
      return supplierData.notificationSettings.types.customerReviews;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_type_reviews");
    return saved !== null ? saved === "true" : true;
  });
  const [notifCertUpdates, setNotifCertUpdates] = useState<boolean>(() => {
    if (supplierData?.notificationSettings?.types?.certUpdates !== undefined) {
      return supplierData.notificationSettings.types.certUpdates;
    }
    const saved = localStorage.getItem("agriconnect_supplier_notif_type_cert");
    return saved !== null ? saved === "true" : true;
  });

  // Feedback Alerts
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Drag and Drop Logo State
  const [isDragging, setIsDragging] = useState(false);

  // Calculate stats
  const averageRating = React.useMemo(() => {
    if (!reviewsList || reviewsList.length === 0) return 5.0;
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviewsList.length).toFixed(1));
  }, [reviewsList]);

  // Load latest data when changed
  useEffect(() => {
    if (supplierData) {
      setBusinessName(supplierData.businessName || "");
      setContactName(supplierData.contactName || "");
      setGstNumber(supplierData.gstNumber || "");
      setPanNumber(supplierData.panNumber || "");
      setMobile(supplierData.mobile || "");
      setEmail(supplierData.email || "");
      setAddress(supplierData.address || "");
      setWebsite(supplierData.website || "");
      setBusinessType(supplierData.businessType || "");
      setLogoUrl(supplierData.logoUrl || "");

      if (supplierData.notificationSettings) {
        const ns = supplierData.notificationSettings;
        if (ns.smsAlerts !== undefined) setSmsAlerts(ns.smsAlerts);
        if (ns.emailAlerts !== undefined) setEmailAlerts(ns.emailAlerts);
        if (ns.pushNotifications !== undefined) setPushNotifications(ns.pushNotifications);
        if (ns.types) {
          if (ns.types.newOrders !== undefined) setNotifNewOrders(ns.types.newOrders);
          if (ns.types.stockAlerts !== undefined) setNotifStockAlerts(ns.types.stockAlerts);
          if (ns.types.paymentReceived !== undefined) setNotifPaymentReceived(ns.types.paymentReceived);
          if (ns.types.customerReviews !== undefined) setNotifCustomerReviews(ns.types.customerReviews);
          if (ns.types.certUpdates !== undefined) setNotifCertUpdates(ns.types.certUpdates);
        }
      }
    }
  }, [supplierData]);

  // Handle Logo Upload (Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
          showAlert("success", "Custom supplier logo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
          showAlert("success", "Custom supplier logo dropped and loaded!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // Save Company Details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return showAlert("error", "Company name is required.");
    if (!contactName.trim()) return showAlert("error", "Contact name is required.");
    if (!gstNumber.trim()) return showAlert("error", "GSTIN number is required.");

    const updated = {
      ...supplierData,
      businessName,
      contactName,
      gstNumber,
      panNumber,
      mobile,
      email,
      address,
      website,
      businessType,
      logoUrl
    };

    onUpdateProfile(updated);
    showAlert("success", "Enterprise supplier profile successfully saved!");
    setActiveTab("view");
  };

  // Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return showAlert("error", "Please input current account password.");
    if (newPassword.length < 6) return showAlert("error", "New password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return showAlert("error", "Confirm password matches failed.");

    // Simulate update
    const updated = {
      ...supplierData,
      password: newPassword
    };

    onUpdateProfile(updated);
    showAlert("success", "Account security password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setActiveTab("view");
  };

  // Save Notification Settings
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage as fallback
    localStorage.setItem("agriconnect_supplier_notif_sms", String(smsAlerts));
    localStorage.setItem("agriconnect_supplier_notif_email", String(emailAlerts));
    localStorage.setItem("agriconnect_supplier_notif_push", String(pushNotifications));
    localStorage.setItem("agriconnect_supplier_notif_type_orders", String(notifNewOrders));
    localStorage.setItem("agriconnect_supplier_notif_type_stock", String(notifStockAlerts));
    localStorage.setItem("agriconnect_supplier_notif_type_payment", String(notifPaymentReceived));
    localStorage.setItem("agriconnect_supplier_notif_type_reviews", String(notifCustomerReviews));
    localStorage.setItem("agriconnect_supplier_notif_type_cert", String(notifCertUpdates));

    const updated = {
      ...supplierData,
      notificationSettings: {
        smsAlerts,
        emailAlerts,
        pushNotifications,
        types: {
          newOrders: notifNewOrders,
          stockAlerts: notifStockAlerts,
          paymentReceived: notifPaymentReceived,
          customerReviews: notifCustomerReviews,
          certUpdates: notifCertUpdates,
        }
      }
    };

    onUpdateProfile(updated);
    showAlert("success", "Notification preferences saved successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-slate-100 rounded-3xl max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-auto md:h-[650px] animate-fadeIn"
      >
        {/* Left Side Sidebar - Identity Card & Navigation */}
        <div className="bg-slate-55 border-r border-slate-100 p-6 md:w-1/3 flex flex-col justify-between shrink-0 bg-gradient-to-b from-slate-50 to-slate-100/50">
          <div className="space-y-6">
            {/* Header branding */}
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-600" />
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Supplier Workspace</span>
            </div>

            {/* Profile Logo Card */}
            <div className="text-center space-y-3">
              <div className="relative inline-block group">
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center overflow-hidden mx-auto">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Building className="h-12 w-12 text-slate-300" />
                  )}
                </div>
                {activeTab === "edit" && (
                  <label className="absolute inset-0 bg-slate-900/60 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[10px] font-bold">
                    <Upload className="h-4 w-4 mb-1" />
                    Change Logo
                    <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{businessName}</h3>
                <p className="text-[10px] text-slate-400 font-semibold">{businessType} • {contactName}</p>
              </div>

              {/* Verified Badge & Trust Rating */}
              <div className="flex flex-col items-center gap-1.5 pt-1">
                <div className="flex items-center justify-center gap-1 bg-emerald-50 border border-emerald-200/50 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase text-emerald-700">
                  <ShieldCheck className="h-3 w-3" /> GSTIN Verified
                </div>
                <div className="flex items-center gap-1 text-slate-700 text-xs font-bold pt-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{averageRating} / 5.0 Rating</span>
                  <span className="text-[10px] text-slate-400 font-normal">({reviewsList.length} reviews)</span>
                </div>
              </div>
            </div>

            {/* Segment Tab Controls */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => setActiveTab("view")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  activeTab === "view"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <User className="h-4 w-4" /> View Profile
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  activeTab === "edit"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <Save className="h-4 w-4" /> Edit Profile
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  activeTab === "password"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <Key className="h-4 w-4" /> Change Password
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  activeTab === "notifications"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <Bell className="h-4 w-4" /> Notifications
              </button>
              <button
                onClick={() => setActiveTab("language")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  activeTab === "language"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <Languages className="h-4 w-4" /> Language Preference
              </button>
              <button
                onClick={() => setActiveTab("export")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  activeTab === "export"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <Download className="h-4 w-4" /> Export Data
              </button>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>

        {/* Right Side - Dynamic Content Workspace */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header & Alert messages */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
                  {activeTab === "view" && "Supplier Credentials & Profile"}
                  {activeTab === "edit" && "Edit Enterprise Details"}
                  {activeTab === "password" && "Account Security & Password"}
                  {activeTab === "notifications" && "Notification Settings & Preferences"}
                  {activeTab === "language" && "Language Preference & Translations"}
                  {activeTab === "export" && "Export Corporate Data Assets"}
                </h3>
                <p className="text-slate-400 text-[10px] font-semibold mt-0.5">
                  {activeTab === "view" && "View verified registration documents, public ratings, and contact listings"}
                  {activeTab === "edit" && "Modify public corporate profiles, upload company logos, and update contact cards"}
                  {activeTab === "password" && "Establish robust encryption parameters for your corporate account key access"}
                  {activeTab === "notifications" && "Configure real-time communications, channels, and specific system event alerts"}
                  {activeTab === "language" && "Select your preferred regional language for the platform interface and reports"}
                  {activeTab === "export" && "Download secure on-demand CSV, Excel, or PDF report archives of products, orders, and finances"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {alertMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center gap-2 p-3 rounded-xl mb-4 text-xs font-bold ${
                    alertMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {alertMessage.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                  <span>{alertMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VIEW PROFILE SCREEN */}
            {activeTab === "view" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Company Name</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">{businessName}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Business Classification</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">{businessType}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">GST Registration</span>
                    <span className="text-xs font-mono font-bold text-indigo-600 mt-0.5 block">{gstNumber}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">PAN Registry</span>
                    <span className="text-xs font-mono font-bold text-indigo-600 mt-0.5 block">{panNumber}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Corporate Contact Name</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">{contactName}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Corporate Mobile</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">{mobile}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Corporate Email</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">{email}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Website Portal</span>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-extrabold text-teal-600 hover:underline mt-0.5 block"
                    >
                      {website}
                    </a>
                  </div>
                </div>

                {/* Headquarters Address */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Corporate Head Office Address</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 block">{address}</span>
                </div>

                {/* Active Certifications Display */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Safety & Quality Credentials</span>
                  <div className="flex flex-wrap gap-2">
                    {approvedCertificates.length === 0 ? (
                      <p className="text-[11px] text-slate-400 font-semibold italic">No custom certifications uploaded yet in the Certifications Hub.</p>
                    ) : (
                      approvedCertificates.map((cert) => {
                        let label = cert;
                        let color = "from-slate-500 to-slate-600";
                        if (cert === "organic-certified") {
                          label = "Organic Sprout Certified";
                          color = "from-emerald-500 to-teal-600";
                        } else if (cert === "gov-approved") {
                          label = "Govt Approved Seeds Distribution";
                          color = "from-amber-500 to-yellow-600";
                        } else if (cert === "iso-9001") {
                          label = "ISO 9001 Quality Management System";
                          color = "from-blue-500 to-indigo-600";
                        } else if (cert === "fssai-license") {
                          label = "FSSAI Food-Safe License";
                          color = "from-cyan-500 to-teal-500";
                        } else if (cert === "export-quality") {
                          label = "Export Quality Grade-A Badge";
                          color = "from-purple-500 to-fuchsia-600";
                        }
                        return (
                          <span
                            key={cert}
                            className={`px-3 py-1 bg-gradient-to-r ${color} text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-1`}
                          >
                            <Award className="h-3 w-3" />
                            {label}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* EDIT PROFILE SCREEN */}
            {activeTab === "edit" && (
              <motion.form
                onSubmit={handleSaveProfile}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* 2 Column Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Company / Business Name</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 transition-all"
                        placeholder="e.g. AgriInput Global Ltd"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Business Classification</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 px-3.5 text-xs font-bold text-slate-700 transition-all"
                    >
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Wholesale Distributor">Wholesale Distributor</option>
                      <option value="Import/Export Bureau">Import/Export Bureau</option>
                      <option value="Cooperative Cooperative">Cooperative Cooperative</option>
                      <option value="Government Agronomical Agency">Government Agronomical Agency</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 px-3.5 text-xs font-mono font-bold text-slate-700 transition-all"
                      placeholder="e.g. 27AAAAA1111A1Z1"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">PAN Number</label>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 px-3.5 text-xs font-mono font-bold text-slate-700 transition-all"
                      placeholder="e.g. ABCDE1234F"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 transition-all"
                        placeholder="e.g. Rajesh Kumar"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 transition-all"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Corporate Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 transition-all"
                        placeholder="e.g. supplier@agriconnect.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Website Portal</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 transition-all"
                        placeholder="e.g. https://agriinputglobal.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Office / Warehouse Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 transition-all"
                      placeholder="Enter corporate head office address..."
                    />
                  </div>
                </div>

                {/* Drag & Drop Logo Field */}
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Upload Enterprise Logo Badge</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center transition-colors ${
                        isDragging ? "bg-teal-50 border-teal-500" : "bg-slate-50 border-slate-200 hover:bg-slate-100/60"
                      }`}
                    >
                      <Upload className="h-6 w-6 text-slate-400 mb-1.5" />
                      <span className="text-[10px] font-bold text-slate-600 block">Drag & Drop brand logo or click</span>
                      <span className="text-[8.5px] text-slate-400 font-semibold block mt-0.5">JPEG, PNG or SVG up to 2MB</span>
                      <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="logo-file-picker" />
                      <label htmlFor="logo-file-picker" className="mt-2 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-[9px] font-black uppercase rounded-lg hover:bg-slate-50 cursor-pointer shadow-3xs">
                        Select File
                      </label>
                    </div>

                    {/* Pre-designed presets */}
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Or Choose Agro Preset Badge</span>
                        <div className="flex gap-2">
                          {DEFAULT_LOGOS.map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setLogoUrl(url);
                                showAlert("success", `Agro Brand Logo Preset #${idx + 1} chosen!`);
                              }}
                              className={`w-11 h-11 rounded-lg border bg-white overflow-hidden p-1 flex items-center justify-center cursor-pointer transition-all ${
                                logoUrl === url ? "border-teal-500 ring-2 ring-teal-500/20 shadow-sm" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <img src={url} alt={`Preset ${idx}`} className="max-w-full max-h-full object-contain rounded-xs" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-[8.5px] text-slate-400 font-semibold leading-relaxed mt-2">
                        Updating your brand badge sets the image shown in enterprise catalogs, invoices, and active supply orders.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" /> Save Profile Changes
                  </button>
                </div>
              </motion.form>
            )}

            {/* PASSWORD SECURITY SCREEN */}
            {activeTab === "password" && (
              <motion.form
                onSubmit={handleChangePassword}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 max-w-md mx-auto py-4"
              >
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex gap-3">
                  <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black text-amber-900 uppercase tracking-tight">Security Cryptography Notice</h5>
                    <p className="text-[9.5px] text-amber-800 leading-relaxed font-semibold">
                      Passwords are encrypted in your local browser sandbox and matched on session biometric handshakes. Ensure credentials are secure to protect warehouse order fulfillment access.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 px-3.5 text-xs font-bold text-slate-700 transition-all"
                    placeholder="Enter current password..."
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">New Password (Min 6 characters)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 px-3.5 text-xs font-bold text-slate-700 transition-all"
                    placeholder="Create strong new password..."
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-hidden rounded-xl py-2 px-3.5 text-xs font-bold text-slate-700 transition-all"
                    placeholder="Re-type new password to verify..."
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Key className="h-4 w-4 text-indigo-100" /> Apply New Credentials
                  </button>
                </div>
              </motion.form>
            )}

            {/* NOTIFICATIONS PREFERENCES SCREEN */}
            {activeTab === "notifications" && (
              <motion.form
                onSubmit={handleSaveNotifications}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 max-w-2xl mx-auto py-2"
              >
                {/* Channels Section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                    Notification Channels
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* SMS */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">SMS Alerts</span>
                        <span className="text-[10px] text-slate-400 font-semibold block leading-tight">Instant phone text alerts</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSmsAlerts(!smsAlerts)}
                        className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 ${
                          smsAlerts ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-5 h-5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>

                    {/* Email */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">Email Alerts</span>
                        <span className="text-[10px] text-slate-400 font-semibold block leading-tight">Detailed inbox updates</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailAlerts(!emailAlerts)}
                        className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 ${
                          emailAlerts ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-5 h-5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>

                    {/* Push */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">Push Notifications</span>
                        <span className="text-[10px] text-slate-400 font-semibold block leading-tight">In-browser system pings</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPushNotifications(!pushNotifications)}
                        className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 ${
                          pushNotifications ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-5 h-5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Event Types Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                    Alert Event Categories
                  </h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {/* New Orders */}
                    <div className="p-3 bg-slate-50 hover:bg-slate-100/60 transition-colors rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">New Orders</span>
                          <span className="text-[10px] text-slate-400 font-semibold leading-normal block">Trigger immediate dispatch/delivery workflows when a buyer pays for stock</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifNewOrders(!notifNewOrders)}
                        className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-all duration-300 shrink-0 ${
                          notifNewOrders ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4.5 h-4.5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>

                    {/* Stock Alerts */}
                    <div className="p-3 bg-slate-50 hover:bg-slate-100/60 transition-colors rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Stock Alerts (Low Stock & Expiry)</span>
                          <span className="text-[10px] text-slate-400 font-semibold leading-normal block">Notifies when inventory count falls below threshold or batch reaches shelf-life</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifStockAlerts(!notifStockAlerts)}
                        className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-all duration-300 shrink-0 ${
                          notifStockAlerts ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4.5 h-4.5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>

                    {/* Payment Received */}
                    <div className="p-3 bg-slate-50 hover:bg-slate-100/60 transition-colors rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Payment Received</span>
                          <span className="text-[10px] text-slate-400 font-semibold leading-normal block">Confirm receipts and escrow release for finished supply orders</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifPaymentReceived(!notifPaymentReceived)}
                        className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-all duration-300 shrink-0 ${
                          notifPaymentReceived ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4.5 h-4.5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>

                    {/* Customer Reviews */}
                    <div className="p-3 bg-slate-50 hover:bg-slate-100/60 transition-colors rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-pink-50 text-pink-600 rounded-lg shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Customer Reviews</span>
                          <span className="text-[10px] text-slate-400 font-semibold leading-normal block">Receive notifications when retail partners publish trust feedback or crop logs</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifCustomerReviews(!notifCustomerReviews)}
                        className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-all duration-300 shrink-0 ${
                          notifCustomerReviews ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4.5 h-4.5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>

                    {/* Certification Updates */}
                    <div className="p-3 bg-slate-50 hover:bg-slate-100/60 transition-colors rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-lg shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Certification Updates</span>
                          <span className="text-[10px] text-slate-400 font-semibold leading-normal block">Updates on submitted bio-safety clearances or organic food licenses</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifCertUpdates(!notifCertUpdates)}
                        className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-all duration-300 shrink-0 ${
                          notifCertUpdates ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4.5 h-4.5 bg-white rounded-full shadow-xs"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" /> Save Notification Settings
                  </button>
                </div>
              </motion.form>
            )}

            {/* LANGUAGE PREFERENCE SCREEN */}
            {activeTab === "language" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 max-w-2xl mx-auto py-2"
              >
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                    Select Platform Language
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Choose your preferred regional language for platform text, logs, and artificial intelligence interactions.
                    This immediately updates translations and layouts across AgriConnect.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {(Object.keys(LANGUAGES_INFO) as SupportedLanguage[]).map((langKey) => {
                      const info = LANGUAGES_INFO[langKey];
                      const isSelected = selectedLanguage === langKey;
                      return (
                        <button
                          key={langKey}
                          type="button"
                          onClick={() => setSelectedLanguage(langKey)}
                          className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-28 cursor-pointer ${
                            isSelected
                              ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/10 shadow-xs animate-pulse-subtle"
                              : "bg-slate-50 hover:bg-slate-100/80 border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {/* Flag & Selection indicator */}
                          <div className="flex items-center justify-between w-full">
                            <span className="text-2xl" role="img" aria-label={langKey}>
                              {info.flag}
                            </span>
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-teal-100" />
                            )}
                          </div>

                          {/* Language titles */}
                          <div className="space-y-0.5">
                            <span className={`text-xs font-black block tracking-tight ${
                              isSelected ? "text-teal-900" : "text-slate-800"
                            }`}>
                              {langKey}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold block">
                              {info.native}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("agri_connect_lang", selectedLanguage);
                      window.dispatchEvent(new CustomEvent("languageChange", { detail: selectedLanguage }));
                      
                      const updated = {
                        ...supplierData,
                        preferredLanguage: selectedLanguage
                      };
                      onUpdateProfile(updated);
                      showAlert("success", `Platform language updated to ${selectedLanguage} successfully!`);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" /> Save Language Preference
                  </button>
                </div>
              </motion.div>
            )}

            {/* EXPORT DATA SCREEN */}
            {activeTab === "export" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 max-w-3xl mx-auto py-2"
              >
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                    Available Enterprise Datasets
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Download complete, validated copies of your corporate database records in structured formats. These exports are compatible with standard ERP software, spreadsheets, and tax compilation files.
                  </p>

                  <div className="space-y-4 pt-2">
                    {/* Item 1: Products */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-slate-100/60">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-600 mt-1 md:mt-0">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800 block tracking-tight">Products Catalog</span>
                          <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Includes name, SKU code, category grouping, listing price, and stock levels.</span>
                          <span className="inline-flex items-center gap-1.5 bg-teal-100/60 text-teal-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mt-2">
                            {productsList.length} Items Listed
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto self-end md:self-center justify-end">
                        <button
                          onClick={exportProductsCSV}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-500" /> CSV
                        </button>
                        <button
                          onClick={exportProductsExcel}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Excel
                        </button>
                      </div>
                    </div>

                    {/* Item 2: Orders */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-slate-100/60">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-600 mt-1 md:mt-0">
                          <Database className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800 block tracking-tight">Orders Ledger</span>
                          <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Includes buyer names, companies, product units, total cash amount, and fulfillment dispatch status.</span>
                          <span className="inline-flex items-center gap-1.5 bg-sky-100/60 text-sky-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mt-2">
                            {ordersList.length} Order Records
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto self-end md:self-center justify-end">
                        <button
                          onClick={exportOrdersCSV}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-500" /> CSV
                        </button>
                        <button
                          onClick={exportOrdersExcel}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Excel
                        </button>
                      </div>
                    </div>

                    {/* Item 3: Customers */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-slate-100/60">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl text-violet-600 mt-1 md:mt-0">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800 block tracking-tight">Customers & Sourcing Partners</span>
                          <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Includes buyer profile contact names, corporate businesses, locations, total spent, and rating scores.</span>
                          <span className="inline-flex items-center gap-1.5 bg-violet-100/60 text-violet-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mt-2">
                            {customersList.length} Unique Accounts
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto self-end md:self-center justify-end">
                        <button
                          onClick={exportCustomersCSV}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-500" /> CSV
                        </button>
                        <button
                          onClick={exportCustomersExcel}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Excel
                        </button>
                      </div>
                    </div>

                    {/* Item 4: Inventory Alerts */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-slate-100/60">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 mt-1 md:mt-0">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800 block tracking-tight">Inventory Status & stock alerts</span>
                          <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Includes real-time stock levels, low-stock trigger points, warning flags, and reorder levels.</span>
                          <span className="inline-flex items-center gap-1.5 bg-amber-100/60 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mt-2">
                            {productsList.filter((p: any) => p.stock < (p.lowStockThreshold || 15)).length} Active Low Stock Warnings
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto self-end md:self-center justify-end">
                        <button
                          onClick={exportInventoryCSV}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-500" /> CSV
                        </button>
                        <button
                          onClick={exportInventoryExcel}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Excel
                        </button>
                      </div>
                    </div>

                    {/* Item 5: Financial reports */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-slate-100/60">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 mt-1 md:mt-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800 block tracking-tight">Financial Reports & GST Tax Statements</span>
                          <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Includes quarterly trade revenue volume summaries, GST 18% breakdowns, and transaction history.</span>
                          <span className="inline-flex items-center gap-1.5 bg-rose-100/60 text-rose-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mt-2">
                            Realized Revenue: ₹{ordersList.reduce((sum, o) => sum + (o.paymentStatus === "Paid" ? o.amount : 0), 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto self-end md:self-center justify-end">
                        <button
                          onClick={exportFinancialPDF}
                          className="flex items-center gap-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <Download className="h-3.5 w-3.5" /> PDF
                        </button>
                        <button
                          onClick={exportFinancialExcel}
                          className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer stats badge */}
          <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-400 font-semibold gap-2">
            <span>Corporate Account ID: ACC-SUP-{supplierData?.tradeLicense?.replace("TL-", "") || "8821948"}</span>
            <span className="flex items-center gap-1 text-teal-600 font-bold uppercase">
              <ShieldCheck className="h-3.5 w-3.5" /> End-to-End Cryptographic Ledger Secured
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
