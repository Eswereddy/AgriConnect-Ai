import React, { useState } from "react";
import {
  QrCode,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Lock,
  Loader2,
  CheckCircle,
  FileText,
  Workflow,
  Sparkles,
  Award
} from "lucide-react";

interface BlockLog {
  hash: string;
  crop: string;
  weight: string;
  moisture: string;
  blockNum: number;
  timestamp: string;
}

export const TraceabilityBlockchain: React.FC = () => {
  // Aadhaar KYC states
  const [aadhaarNum, setAadhaarNum] = useState<string>("5421-9876-0231");
  const [isKycProcessing, setIsKycProcessing] = useState<boolean>(false);
  const [kycSuccess, setKycSuccess] = useState<boolean>(false);
  const [kycOtp, setKycOtp] = useState<string>("");
  const [showOtpField, setShowOtpField] = useState<boolean>(false);

  // Blockchain Traceability states
  const [traceCrop, setTraceCrop] = useState<string>("Premium Basmati Rice");
  const [traceWeight, setTraceWeight] = useState<string>("4,200 kg");
  const [traceMoisture, setTraceMoisture] = useState<string>("12.2%");
  const [tracePesticide, setTracePesticide] = useState<"pass" | "fail">("pass");
  
  const [isMining, setIsMining] = useState<boolean>(false);
  const [minedBlock, setMinedBlock] = useState<BlockLog | null>(null);
  const [blockHistory, setBlockHistory] = useState<BlockLog[]>([
    {
      hash: "0x7a10fd34b8c0ef22941fa93d8b2d1c5a",
      crop: "Basmati Rice Paddy",
      weight: "12,000 kg",
      moisture: "13.1%",
      blockNum: 10482,
      timestamp: "10:14:24 AM"
    },
    {
      hash: "0x4c2198032ba61fde02a823fbc01daef4",
      crop: "Winter Wheat Lot-4",
      weight: "5,000 kg",
      moisture: "11.8%",
      blockNum: 10481,
      timestamp: "09:42:15 AM"
    }
  ]);

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNum.replace(/-/g, "").length < 12) {
      alert("Aadhaar Number must be 12-digits.");
      return;
    }
    setIsKycProcessing(true);
    setTimeout(() => {
      setIsKycProcessing(false);
      setShowOtpField(true);
    }, 1200);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (kycOtp.length < 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsKycProcessing(true);
    setTimeout(() => {
      setIsKycProcessing(false);
      setKycSuccess(true);
      setShowOtpField(false);
    }, 1500);
  };

  const handleSealBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMining(true);
    setMinedBlock(null);

    setTimeout(() => {
      setIsMining(false);
      const randomHash = "0x" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const lastBlock = blockHistory.length > 0 ? blockHistory[0].blockNum : 10480;
      const newBlock: BlockLog = {
        hash: randomHash,
        crop: traceCrop,
        weight: traceWeight,
        moisture: traceMoisture,
        blockNum: lastBlock + 1,
        timestamp: new Date().toLocaleTimeString()
      };
      setMinedBlock(newBlock);
      setBlockHistory(prev => [newBlock, ...prev]);
    }, 2000);
  };

  return (
    <div id="blockchain-traceability" className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4.5 w-4.5 text-emerald-400" /> Aadhaar DigiLocker KYC & Polygon Blockchain Ledger
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Cryptographic identity onboarding coupled with secure Polygon layer-2 smart contracts storing tamper-proof farm-to-fork records on decentralized IPFS.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          DigiLocker Certified API
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Grid: DigiLocker Aadhaar KYC */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">
            Module A: Cryptographic Aadhaar KYC Verification
          </span>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            {kycSuccess ? (
              <div className="text-center py-6 space-y-3 animate-in zoom-in-95 duration-300">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <ShieldCheck className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-sm font-black text-white uppercase tracking-wider">Aadhaar Identity Verified</h5>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">UIDAI Digital Signature matched via DigiLocker. Escrow limit upgraded to ₹10,00,000.</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-850 font-mono text-[9px] text-slate-500 text-left space-y-1">
                  <p><span className="text-slate-400">STATUS:</span> VERIFIED_UIDAI_ONBOARDED</p>
                  <p><span className="text-slate-400">DIGISIGN:</span> SHA256-e82a392b90ff18a221</p>
                  <p><span className="text-slate-400">AUDIT_BLOCK:</span> #10482</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Authenticate your farm ownership registry using India's sovereign UIDAI secure DigiLocker token.
                </p>

                {!showOtpField ? (
                  <form onSubmit={handleKycSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Aadhaar Card Number</label>
                      <input
                        type="text"
                        value={aadhaarNum}
                        onChange={(e) => setAadhaarNum(e.target.value)}
                        placeholder="e.g. 5421-9876-0231"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 text-center"
                        required
                        disabled={isKycProcessing}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isKycProcessing}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      {isKycProcessing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                          Handshaking UIDAI DigiLocker...
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5 text-emerald-300" />
                          Initiate KYC Linkage
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg text-[10px] text-amber-300 font-bold">
                      A secure OTP has been transmitted to your Aadhaar-registered mobile (XXXXXX3210).
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Enter 6-digit OTP</label>
                      <input
                        type="text"
                        value={kycOtp}
                        onChange={(e) => setKycOtp(e.target.value)}
                        placeholder="e.g. 483921"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 text-center tracking-widest"
                        required
                        maxLength={6}
                        disabled={isKycProcessing}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isKycProcessing}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black uppercase text-[10px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      {isKycProcessing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Validating DigiLocker OTP...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Complete Aadhaar Authentication
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Grid: Polygon/IPFS Traceability */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">
            Module B: IPFS & Polygon Smart Contract Traceability
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input params form */}
            <form onSubmit={handleSealBlock} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Crop Variety</label>
                <input
                  type="text"
                  value={traceCrop}
                  onChange={(e) => setTraceCrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Weight</label>
                  <input
                    type="text"
                    value={traceWeight}
                    onChange={(e) => setTraceWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white text-center"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Moisture</label>
                  <input
                    type="text"
                    value={traceMoisture}
                    onChange={(e) => setTraceMoisture(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white text-center"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Pesticide Residual Audit</label>
                <select
                  value={tracePesticide}
                  onChange={(e) => setTracePesticide(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="pass">PASS (Zero Residuals)</option>
                  <option value="fail">FAIL (Alert triggered)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isMining}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                {isMining ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    Mining Polygon Block & IPFS Seal...
                  </>
                ) : (
                  <>
                    <QrCode className="h-3.5 w-3.5 text-emerald-300" />
                    Seal Smart Contract Block
                  </>
                )}
              </button>
            </form>

            {/* Mining results & QR display */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between items-center text-center">
              {isMining ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                  <span className="text-[9px] font-mono text-emerald-400 font-extrabold tracking-widest animate-pulse">
                    BROADCASTING TRANSACTION MEMPOOL...
                  </span>
                </div>
              ) : minedBlock ? (
                <div className="space-y-3 w-full animate-in zoom-in-95 duration-200">
                  <div className="p-1 bg-white rounded-lg inline-block shadow-lg mx-auto">
                    {/* Simulated SVG QR Code */}
                    <svg className="w-24 h-24 text-slate-900" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      <rect x="5" y="5" width="25" height="25" fill="black" />
                      <rect x="10" y="10" width="15" height="15" fill="white" />
                      <rect x="70" y="5" width="25" height="25" fill="black" />
                      <rect x="75" y="10" width="15" height="15" fill="white" />
                      <rect x="5" y="70" width="25" height="25" fill="black" />
                      <rect x="10" y="75" width="15" height="15" fill="white" />
                      <rect x="35" y="35" width="30" height="30" fill="black" />
                      {/* Random pixels */}
                      <rect x="35" y="5" width="10" height="10" fill="black" />
                      <rect x="50" y="20" width="15" height="10" fill="black" />
                      <rect x="5" y="45" width="20" height="15" fill="black" />
                      <rect x="80" y="45" width="15" height="25" fill="black" />
                      <rect x="45" y="75" width="20" height="20" fill="black" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-black uppercase">
                      IPFS BLOCK LOCKED
                    </span>
                    <p className="text-[10.5px] font-extrabold text-white mt-1.5">Block #{minedBlock.blockNum}</p>
                    <p className="text-[9.5px] font-mono text-slate-500 mt-1 select-all truncate">{minedBlock.hash}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-500">
                  <Workflow className="h-10 w-10 text-slate-700 animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Traceability Seal Idle</p>
                  <p className="text-[9.5px] max-w-[160px] leading-relaxed">
                    Once mined, a unique decentralized trace-ID QR code will compile here for placement on packaging sacs.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Blockchain history ledger logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block select-none">
              Live Polygon Testnet Node Ledger History
            </span>
            <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
              {blockHistory.map((bl, blIdx) => (
                <div key={blIdx} className="bg-slate-950 p-2 rounded-lg border border-slate-850 flex justify-between items-center text-[10px] text-slate-300 font-medium">
                  <div>
                    <p className="font-extrabold text-white">Block #{bl.blockNum} • {bl.crop}</p>
                    <p className="font-mono text-slate-500 text-[8.5px] mt-0.5 select-all">{bl.hash}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-emerald-400 font-bold">{bl.moisture} Moist</p>
                    <p className="text-slate-500 text-[8px] mt-0.5">{bl.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceabilityBlockchain;
