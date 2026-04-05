"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, Loader2, AlertTriangle, 
  UserCircle, LogOut, Fingerprint, ShieldAlert,
  Train, ArrowUpDown, Search, UserPlus, LogIn,
  CheckCircle2, CreditCard, MapPin, ChevronLeft, User
} from "lucide-react";

// --- CONFIGURATION & MOCK DATA ---
const STATIONS = [
  "Visakhapatnam (VSKP)", 
  "Hyderabad (HYB)", 
  "Vijayawada (BZA)", 
  "Chennai (MAS)", 
  "Bangalore (SBC)", 
  "Mumbai (CSMT)", 
  "Delhi (NDLS)"
];

const MOCK_TRAINS = [
  { id: "20833", name: "Vande Bharat Exp", dep: "05:45", arr: "14:15", duration: "8h 30m", price: "₹2450", class: "EC", status: "AVL 0008" },
  { id: "12727", name: "Godavari Express", dep: "17:20", arr: "05:50", duration: "12h 30m", price: "₹455", class: "SL", status: "AVL 0042" },
  { id: "12805", name: "Janmabhoomi Exp", dep: "06:15", arr: "13:10", duration: "6h 55m", price: "₹1120", class: "3A", status: "AVL 0012" },
  { id: "22203", name: "Duronto Express", dep: "20:15", arr: "06:25", duration: "10h 10m", price: "₹1850", class: "2A", status: "RAC 02" },
  { id: "12739", name: "Garib Rath", dep: "20:40", arr: "08:10", duration: "11h 30m", price: "₹710", class: "3A", status: "WL 14" },
  { id: "11020", name: "Konark Express", dep: "22:20", arr: "11:00", duration: "12h 40m", price: "₹480", class: "SL", status: "AVL 0150" },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Navigation State
  const [step, setStep] = useState<'auth' | 'register' | 'search' | 'select_train' | 'passengers' | 'payment' | 'success'>('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<typeof MOCK_TRAINS[0] | null>(null);
  
  // Search State
  const [fromStation, setFromStation] = useState(STATIONS[0]);
  const [toStation, setToStation] = useState(STATIONS[1]);

  // Security & Bot Detection State
  const [startTime, setStartTime] = useState<number>(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [mouseHovered, setMouseHovered] = useState(false);
  const [honeyPotValue, setHoneyPotValue] = useState("");
  const [isBotDetected, setIsBotDetected] = useState(false);
  const [forensicReport, setForensicReport] = useState<string[]>([]);
  const [registeredFingerprint, setRegisteredFingerprint] = useState(""); 
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => { 
    setIsClient(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC FUNCTIONS ---

  const handleReverse = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const goBack = () => {
    if (step === 'register') setStep('auth');
    else if (step === 'select_train') setStep('search');
    else if (step === 'passengers') setStep('select_train');
    else if (step === 'payment') setStep('passengers');
    else if (step === 'success') setStep('search');
    
    // Clear security flags on back to allow human retry
    setIsBotDetected(false);
    setForensicReport([]);
    setKeystrokes(0);
  };

  const handleAuthAction = (nextStep: 'search') => {
    setIsLoading(true);
    // Simulate Hardware Fingerprinting
    const fp = "RS-" + Math.random().toString(16).slice(2, 10).toUpperCase();
    setRegisteredFingerprint(fp);
    setTimeout(() => { 
      setIsLoading(false); 
      setStep(nextStep); 
    }, 1000);
  };

  const runSecurityAudit = async () => {
    setIsAuditing(true);
    const reports: string[] = [];
    const timeTaken = (Date.now() - startTime) / 1000;
    
    if (honeyPotValue.length > 0) reports.push("HIDDEN_FIELD_COMPLETED: Script detected.");
    if (!mouseHovered) reports.push("ZERO_POINTER_MOVEMENT: Logic-only click.");
    if (keystrokes < 2) reports.push("AUTOFILL_ABUSE: Manual typing absent.");
    if (timeTaken < 3) reports.push(`VELOCITY_VIOLATION: Completed in ${timeTaken.toFixed(1)}s.`);
    
    await new Promise(r => setTimeout(r, 1500)); // Simulate processing

    setIsAuditing(false);
    if (reports.length > 0) { 
      setIsBotDetected(true); 
      setForensicReport(reports); 
      return false; 
    }
    return true;
  };

  if (!isClient) return null;

  // Reusable Back Button Component
  const BackButton = () => (
    <button 
      onClick={goBack} 
      className="flex items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors mb-6 text-sm font-bold group"
    >
      <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      Back to Previous
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* NAVIGATION BAR */}
      <nav className="bg-[#0f172a] text-white px-8 py-4 sticky top-0 z-50 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => registeredFingerprint && setStep('search')}>
            <ShieldCheck className="text-blue-400" size={24} />
            <span className="text-xl font-bold tracking-tight">RailShield<span className="text-blue-400 font-light">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            {registeredFingerprint && (
              <div className="hidden md:block text-[10px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800 tracking-widest">
                HW_DNA: {registeredFingerprint}
              </div>
            )}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="hover:text-blue-400 transition-colors">
                <UserCircle size={24} />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1 z-[100]">
                  <button onClick={() => { setStep('auth'); setRegisteredFingerprint(""); setIsBotDetected(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 px-6 pb-20">
        
        {/* LOGIN SCREEN */}
        {step === 'auth' && (
          <div className="max-w-md mx-auto mt-20 animate-in fade-in duration-500">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">Secure Access</CardTitle>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Hardware Linked Login</p>
              </CardHeader>
              <CardContent className="p-8 space-y-4 text-left">
                <div className="space-y-1"><Label className="text-xs font-bold text-slate-500">USER EMAIL</Label><Input placeholder="admin@railshield.ai" /></div>
                <div className="space-y-1"><Label className="text-xs font-bold text-slate-500">PASSWORD</Label><Input type="password" placeholder="••••••••" /></div>
                <Button className="w-full bg-[#0f172a] h-12 font-bold mt-2" onClick={() => handleAuthAction('search')}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Authorize & Connect'}
                </Button>
                <button onClick={() => setStep('register')} className="w-full text-center text-sm text-blue-600 font-bold hover:underline mt-2">New Device Registration</button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* REGISTRATION SCREEN */}
        {step === 'register' && (
          <div className="max-w-md mx-auto mt-10">
            <BackButton />
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="text-center pb-2"><CardTitle className="text-2xl font-bold">Register Account</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs font-bold">FIRST NAME</Label><Input placeholder="John" /></div>
                  <div className="space-y-1"><Label className="text-xs font-bold">LAST NAME</Label><Input placeholder="Doe" /></div>
                </div>
                <div className="space-y-1"><Label className="text-xs font-bold">EMAIL</Label><Input placeholder="john@example.com" /></div>
                <div className="space-y-1"><Label className="text-xs font-bold">PASSWORD</Label><Input type="password" placeholder="••••••••" /></div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-bold" onClick={() => handleAuthAction('search')}>Register & Link Hardware</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SEARCH DASHBOARD */}
        {step === 'search' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <h1 className="text-2xl font-bold text-slate-800 mb-10 flex items-center gap-2"><Search size={24} className="text-blue-600"/> Ticket Reservation</h1>
              
              <div className="flex flex-col md:flex-row items-end gap-4 relative">
                <div className="flex-1 w-full space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Station</Label>
                    <select className="w-full h-12 border border-slate-200 rounded-lg px-3 bg-slate-50 text-sm focus:bg-white" value={fromStation} onChange={(e) => setFromStation(e.target.value)}>
                        {STATIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>

                {/* THE REVERSE BUTTON - HIGH ACCESSIBILITY */}
                <div className="relative z-30 pt-4 md:pt-0">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full bg-white shadow-md border-slate-200 hover:text-blue-600 hover:border-blue-400 active:scale-90 transition-all h-10 w-10" 
                      onClick={handleReverse}
                    >
                        <ArrowUpDown className="md:rotate-90" size={18} />
                    </Button>
                </div>

                <div className="flex-1 w-full space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination Station</Label>
                    <select className="w-full h-12 border border-slate-200 rounded-lg px-3 bg-slate-50 text-sm focus:bg-white" value={toStation} onChange={(e) => setToStation(e.target.value)}>
                        {STATIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex-1 w-full md:w-48 space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journey Date</Label>
                    <Input type="date" defaultValue="2024-10-24" className="h-12 bg-slate-50" />
                </div>
                <Button className="h-12 px-10 bg-[#0f172a] hover:bg-slate-800 font-bold shadow-lg" onClick={() => setStep('select_train')}>Search Trains</Button>
              </div>
            </div>
          </div>
        )}

        {/* TRAIN LIST */}
        {step === 'select_train' && (
          <div className="animate-in slide-in-from-right-8 duration-500">
            <BackButton />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800">Available Services</h2>
              <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 px-4 py-1 font-bold">{fromStation.split(' ')[0]} → {toStation.split(' ')[0]}</Badge>
            </div>
            <div className="space-y-4">
              {MOCK_TRAINS.map((train) => (
                <div key={train.id} className="bg-white border border-slate-200 p-6 rounded-xl hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col md:flex-row justify-between items-center gap-6" onClick={() => { setSelectedTrain(train); setStep('passengers'); setStartTime(Date.now()); }}>
                  <div className="w-40">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{train.id}</span>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600">{train.name}</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-10">
                    <div className="text-center"><p className="text-lg font-bold">{train.dep}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{fromStation.split(' ')[1]}</p></div>
                    <div className="w-32 flex flex-col items-center">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">{train.duration}</p>
                        <div className="w-full h-px bg-slate-200 relative"><div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-slate-300"></div><div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-slate-300"></div></div>
                        <p className="text-[10px] font-bold text-blue-500 mt-1">{train.class}</p>
                    </div>
                    <div className="text-center"><p className="text-lg font-bold">{train.arr}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{toStation.split(' ')[1]}</p></div>
                  </div>
                  <div className="text-right w-32">
                    <p className="text-xl font-bold text-slate-900">{train.price}</p>
                    <p className={`text-[10px] font-bold uppercase mt-1 ${train.status.includes('AVL') ? 'text-green-600' : 'text-orange-500'}`}>{train.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASSENGER DETAILS */}
        {step === 'passengers' && selectedTrain && (
          <div className="max-w-5xl mx-auto animate-in fade-in">
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="bg-slate-50 border-b p-4"><CardTitle className="text-xs font-bold uppercase flex items-center gap-2 tracking-widest text-slate-500"><User size={14}/> Passenger Record</CardTitle></CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {isBotDetected && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
                          <p className="text-xs font-bold uppercase flex items-center gap-2 mb-2"><ShieldAlert size={14}/> Bot Anomaly Detected</p>
                          {forensicReport.map((r, i) => <p key={i} className="text-[10px] font-mono opacity-80">• {r}</p>)}
                      </div>
                    )}
                    {/* TRAP FIELDS */}
                    <div className="opacity-0 absolute -z-10 h-0 w-0 overflow-hidden"><input value={honeyPotValue} onChange={(e) => setHoneyPotValue(e.target.value)} /></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1.5"><Label className="text-xs font-semibold">Full Passenger Name</Label><Input onFocus={() => setKeystrokes(1)} onKeyDown={() => setKeystrokes(k => k + 1)} className="h-11" placeholder="As per Identity ID" /></div>
                      <div className="space-y-1.5"><Label className="text-xs font-semibold">Age</Label><Input type="number" className="h-11" placeholder="YY" /></div>
                    </div>
                    <div className="pt-6 border-t border-slate-100">
                      <Button onMouseEnter={() => setMouseHovered(true)} disabled={isAuditing} className={`w-full h-12 font-bold shadow-lg ${isBotDetected ? 'bg-red-600' : 'bg-[#0f172a]'}`} onClick={async () => { if (await runSecurityAudit()) setStep('payment'); }}>
                          {isAuditing ? 'Auditing Hardware Signature...' : 'Confirm Passenger Details'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0f172a] p-6 rounded-xl text-white shadow-xl">
                    <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Fare Summary</h3>
                    <div className="space-y-4">
                        <div className="border-b border-slate-700 pb-4"><p className="font-bold text-lg">{selectedTrain.name}</p><p className="text-[10px] opacity-60 font-bold uppercase">Train #{selectedTrain.id} | Class {selectedTrain.class}</p></div>
                        <div className="flex justify-between items-center text-sm font-bold text-blue-400"><span>Total Payable</span><span className="text-2xl">{selectedTrain.price}</span></div>
                    </div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                   <ShieldCheck className="text-emerald-600" size={18} />
                   <div><p className="text-[9px] font-bold text-emerald-800 uppercase leading-none">Security Active</p><p className="text-[10px] font-mono text-emerald-700 mt-1">{registeredFingerprint}</p></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT PAGE */}
        {step === 'payment' && (
           <div className="max-w-md mx-auto animate-in slide-in-from-bottom-4">
             <BackButton />
             <Card className="shadow-sm border-slate-200 p-10 text-center bg-white rounded-2xl">
               <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center text-slate-800 mx-auto mb-6"><CreditCard size={32}/></div>
               <h2 className="text-2xl font-bold">Secure Gateway</h2>
               <p className="text-slate-400 text-xs mb-8 uppercase font-bold tracking-widest">End-to-End Encrypted</p>
               <div className="space-y-4">
                  <Input placeholder="Card Number" className="h-12 text-center" />
                  <Button className="w-full bg-[#0f172a] h-12 font-bold shadow-xl" onClick={() => setStep('success')}>Authorize Transaction</Button>
               </div>
             </Card>
           </div>
        )}

        {/* SUCCESS PAGE */}
        {step === 'success' && (
          <div className="text-center py-20 animate-in zoom-in duration-700">
            <div className="bg-emerald-600 w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-100"><CheckCircle2 size={48} /></div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Booking Confirmed</h1>
            <p className="text-slate-500 mb-12 text-sm max-w-sm mx-auto font-medium leading-relaxed">
              Human interaction verified. Your ticket is secured against automated intervention on device <span className="text-blue-600 font-mono font-bold">[{registeredFingerprint}]</span>.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <Button className="flex-1 bg-[#0f172a] h-12 font-bold shadow-lg" onClick={() => { setStep('search'); setIsBotDetected(false); setForensicReport([]); }}>New Reservation</Button>
                <Button variant="outline" className="flex-1 h-12 border-slate-200 font-bold" onClick={() => { setStep('auth'); setRegisteredFingerprint(""); setIsBotDetected(false); }}>Exit Secure Session</Button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}