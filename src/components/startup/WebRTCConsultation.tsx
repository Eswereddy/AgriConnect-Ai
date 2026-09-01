import React, { useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
  CheckCircle,
  Network,
  Activity,
  Award,
  Loader2,
  Download,
  Sparkles,
  MessageSquare
} from "lucide-react";

const EXPERTS = [
  { id: "dr-rachel", name: "Dr. Rachel Carter", specialization: "Pathologist & Agro-Genomics", verified: true, avatar: "👩‍🔬" },
  { id: "prof-mercer", name: "Prof. Kenneth Mercer", specialization: "Soil Chemist & Precision Agronomy", verified: true, avatar: "👨‍🔬" }
];

export const WebRTCConsultation: React.FC = () => {
  const [selectedExpert, setSelectedExpert] = useState<string>("dr-rachel");
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoActive, setVideoActive] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chats, setChats] = useState<Array<{ sender: "user" | "expert"; msg: string; time: string }>>([
    { sender: "expert", msg: "Hello! I saw your Tomato leaf scan. Let's inspect the lesions over our WebRTC feed.", time: "10:20 AM" }
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleCall = () => {
    setIsCalling(true);
    setLogs([]);
    addLog("WebRTC PeerConnection initializing...");
    addLog("Gathering ICE candidates (STUN/TURN routing active)...");
    
    setTimeout(() => {
      addLog("SDP offer-answer handshake completed.");
      addLog("Establishing SRTP encrypted DTLS-SRTP media stream...");
    }, 1000);

    setTimeout(() => {
      setIsCalling(false);
      setIsConnected(true);
      addLog("Media connection established. Video: 1080p, Codec: VP9.");
    }, 2500);
  };

  const handleHangup = () => {
    setIsConnected(false);
    setIsCalling(false);
    setIsRecording(false);
    addLog("WebRTC session terminated by peer.");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = { sender: "user" as const, msg: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChats(prev => [...prev, userMsg]);
    setChatMessage("");

    // Simple automatic response
    setTimeout(() => {
      const expertMsg = {
        sender: "expert" as const,
        msg: "Understood. Avoid spraying synthetic nitrogen while crop early blight lesions are developing, and increase the spacing between plants.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => [...prev, expertMsg]);
    }, 1500);
  };

  const expertObj = EXPERTS.find(e => e.id === selectedExpert) || EXPERTS[0];

  return (
    <div id="webrtc-consultation" className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Video className="h-4.5 w-4.5 text-emerald-400" /> WebRTC Expert Live Video Consultations
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Direct farmer-to-expert WebRTC high-definition voice and video channels bypassing server bottlenecks using direct peer-to-peer tunnels.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-emerald-400">
          <Network className="h-4 w-4 text-emerald-400" />
          P2P Secure Channel
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Call Controls & Screen Preview */}
        <div className="lg:col-span-7 space-y-4">
          {!isConnected && !isCalling ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-[8.5px] font-black text-slate-500 uppercase block select-none">
                Select Consultation Expert Partner
              </span>
              <div className="space-y-3">
                {EXPERTS.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedExpert(e.id)}
                    className={`w-full text-left p-3.5 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${
                      selectedExpert === e.id
                        ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-bold"
                        : "border-slate-850 bg-slate-950 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{e.avatar}</span>
                      <div>
                        <span className="text-[11.5px] font-black block text-white">{e.name}</span>
                        <span className="text-[8.5px] text-slate-500 block">{e.specialization}</span>
                      </div>
                    </div>
                    {e.verified && (
                      <span className="text-[8.5px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase tracking-wider">
                        Verified
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCall}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Video className="h-4 w-4 text-emerald-300" />
                Initiate Secure WebRTC Link with {expertObj.name.split(" ")[1]}
              </button>
            </div>
          ) : isCalling ? (
            <div className="h-[280px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-center items-center p-6 text-center text-slate-400 space-y-3">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
              <p className="text-xs font-mono text-emerald-400 font-black tracking-widest uppercase">
                Signaling handshake mempool connection...
              </p>
              <div className="max-w-[240px] text-[8.5px] text-slate-500 font-mono leading-relaxed space-y-1">
                {logs.map((log, lIdx) => (
                  <p key={lIdx}>{log}</p>
                ))}
              </div>
            </div>
          ) : (
            /* Active Call Frame Mock */
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="relative h-[240px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center shadow-lg select-none">
                {videoActive ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-950 to-emerald-900/30 flex items-center justify-center">
                    {/* Animated expert avatar avatar */}
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 bg-slate-900 border-2 border-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg relative">
                        {expertObj.avatar}
                        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping" />
                      </div>
                      <h5 className="text-xs font-black text-white">{expertObj.name}</h5>
                      <p className="text-[8.5px] text-emerald-400 font-mono tracking-widest uppercase animate-pulse">
                        LIVE VP9 STREAM (1080p • 32fps)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <VideoOff className="h-10 w-10 text-slate-700 animate-pulse" />
                    <p className="text-xs font-black uppercase text-slate-400">Expert Feed Muted</p>
                  </div>
                )}

                {/* Local user small floating window */}
                <div className="absolute top-3 right-3 w-20 h-28 bg-slate-900 border border-slate-850 rounded-xl overflow-hidden shadow-md flex flex-col items-center justify-center text-center">
                  <span className="text-lg">👨‍🌾</span>
                  <span className="text-[7.5px] font-black text-white uppercase mt-1 tracking-wider">Farmer (You)</span>
                  <span className="text-[6.5px] text-emerald-400 font-mono mt-0.5 animate-pulse">Active</span>
                </div>

                {/* Overlaid consultation duration */}
                <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-850 px-2.5 py-1 rounded-lg text-[8.5px] font-mono text-emerald-400 font-extrabold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  REC {isRecording ? "02:14" : "00:00"}
                </div>
              </div>

              {/* Call Controls Bar */}
              <div className="flex justify-center items-center gap-2.5 bg-slate-900 p-2.5 border border-slate-850 rounded-xl">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isMuted 
                      ? "bg-rose-950/50 text-rose-400 border-rose-500/20" 
                      : "bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-850"
                  }`}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  <MicOff className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setVideoActive(!videoActive)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    !videoActive 
                      ? "bg-rose-950/50 text-rose-400 border-rose-500/20" 
                      : "bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-850"
                  }`}
                  title={videoActive ? "Stop Video" : "Start Video"}
                >
                  <Video className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2 rounded-lg border text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    isRecording 
                      ? "bg-rose-600 text-white border-rose-500 animate-pulse" 
                      : "bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-850"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  {isRecording ? "Recording Session" : "Record Consultation"}
                </button>
                <button
                  onClick={handleHangup}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-lg border border-rose-500 transition-all cursor-pointer"
                  title="Hang Up"
                >
                  <PhoneOff className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Consultation Live Chat */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[300px] sm:h-auto">
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[190px] pr-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-850 pb-1.5 select-none">
              Consultation Transcripts & chat
            </span>

            <div className="space-y-3">
              {chats.map((ch, chIdx) => (
                <div
                  key={chIdx}
                  className={`p-2.5 rounded-xl border text-xs max-w-[85%] space-y-1 ${
                    ch.sender === "user"
                      ? "bg-emerald-950/20 border-emerald-500/20 text-slate-200 ml-auto"
                      : "bg-slate-950 border-slate-850 text-slate-200"
                  }`}
                >
                  <p className="leading-relaxed text-[10.5px] font-semibold">{ch.msg}</p>
                  <div className="text-[7.5px] text-slate-500 text-right select-none">{ch.time}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-850 pt-3">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={isConnected ? "Ask the expert a question..." : "Connect call to chat..."}
              disabled={!isConnected}
              className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
            />
            <button
              type="submit"
              disabled={!isConnected}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase cursor-pointer flex items-center justify-center ${
                isConnected ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-slate-800 text-slate-500"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebRTCConsultation;
