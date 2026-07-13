import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function ContestEngine() {
  const nv = useNavigate();
  const [u, setU] = useState(null);
  const [ctst, setCtst] = useState([]);
  const [idx, setIdx] = useState(0);
  const [ftc, setFtc] = useState(false);
  const [ld, setLd] = useState(false);
  const [err, setErr] = useState("");
  
  const [sCd, setSCd] = useState(0); 
  const [skp, setSkp] = useState(false); 
  const [shw, setShw] = useState(false); 

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`)
      .then(res => {
        setU(res.data);
      })
      .catch(() => {
        nv('/');
      });
  }, [nv]);

  useEffect(() => {
    let t; if (sCd > 0) t = setInterval(() => setSCd(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [sCd]);

  const gen = async () => {
    setLd(true); setErr("");
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/contest/${u.h}`);
      setCtst(data.contests || (data.contest ? [data.contest] : []));
      setIdx(0);  setSCd(5); setShw(false); setFtc(true);
    } catch (e) {
      setErr("API crunch failed.");
    } finally {
      setLd(false);
    }
  };

  const rjt = () => {
    if (idx < ctst.length - 1) {
      setSkp(true); 
      setTimeout(() => {
        setIdx(p => p + 1);
        setSkp(false); setShw(false); setSCd(5); 
      }, 2000);
    }
  };

  if (!u) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-400 font-mono text-sm tracking-widest uppercase">Securing Connection...</p>
      </div>
    );
  }

  const aC = ctst[idx];
  const isEnd = ctst.length > 0 && idx >= ctst.length - 1;

  const f = (r) => {
    if(r<1200) return {n:'Pupil', c:'text-green-500', t:1200, b:0};
    if(r<1400) return {n:'Specialist', c:'text-cyan-400', t:1400, b:1200};
    if(r<1600) return {n:'Expert', c:'text-blue-500', t:1600, b:1400};
    if(r<1900) return {n:'Candidate Master', c:'text-fuchsia-500', t:1900, b:1600};
    if(r<2100) return {n:'Master', c:'text-orange-400', t:2100, b:1900};
    if(r<2300) return {n:'International Master', c:'text-orange-500', t:2300, b:2100};
    if(r<2400) return {n:'Grandmaster', c:'text-red-500', t:2400, b:2300};
    if(r<2600) return {n:'International Grandmaster', c:'text-red-600', t:2600, b:2400};
    if(r<3000) return {n:'Legendary Grandmaster', c:'text-red-700', t:3000, b:2600};
    return {n:'GOATED LEVEL', c:'text-yellow-400', t:-1, b:3000};
  };

  const y = f(u.mxR || 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 selection:bg-blue-500/30 relative">
      <Link to="/dashboard" className="absolute top-6 right-6 z-50 transition-transform hover:scale-105">
              <img 
                src="/whole_image.png" 
                alt="AlgoEngine" 
                className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
              />
      </Link>
    
      <Link to="/dashboard" className="absolute top-6 left-6 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg text-sm font-bold transition-all z-10 shadow-lg flex items-center gap-2">
        <span>←</span> Dashboard
      </Link>

      <div className="max-w-3xl mx-auto space-y-8 pt-12">
        
        
        <div className="flex justify-between items-center pb-6 border-b border-zinc-800/50">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-1">Codeforces Engine</h1>
            <p className="text-sm text-zinc-400 font-mono">connected: <span className="text-zinc-200">{u.h}</span></p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 flex flex-col items-end shadow-lg">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">CF Max Rating</p>
            <p className="text-2xl font-black text-white font-mono">{u.mxR || "Unrated"}</p>
          </div>
        </div>

       
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 flex justify-between items-center shadow-inner">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Next Target</p>
            <h2 className={`text-2xl font-black uppercase tracking-widest ${y.c}`}>{y.n}</h2>
          </div>
          {y.t !== -1 && (
            <div className="text-right">
              <p className="text-2xl font-black text-white font-mono">{y.t}</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">
                ({y.t - (u.mxR || 0)} pts remaining)
              </p>
            </div>
          )}
        </div>

       
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={gen} disabled={ld || skp  || ftc} className={`w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${ftc ? "bg-zinc-800 text-zinc-400 border border-zinc-700" : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]"}`}>
            {ld ? "Finding....." : ftc ? "Optimal Match Secured" : "Click here to find the best personalised contest"}
          </button>
          
          {err && <div className="p-4 bg-red-950/40 border border-red-900/50 text-red-400 text-sm rounded-xl">{err}</div>}

          {aC && (
            <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
              {skp ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-zinc-400 font-mono text-sm animate-pulse">Finding your next best personalized contest...</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-zinc-800/50 bg-gradient-to-b from-zinc-800/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="inline-block px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] uppercase text-blue-400 font-bold mb-3">Optimal Match Found</div>
                        <h2 className="text-xl font-bold text-white">{aC.name}</h2>
                      </div>
                      
                      
                      <button onClick={rjt} disabled={isEnd || sCd > 0} className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 text-sm font-bold rounded-lg disabled:opacity-50 transition-colors">
                        {isEnd ? "End of Queue" : sCd > 0 ? `Skip Match (${sCd}s)` : "Skip Match"}
                      </button>

                    </div>
                  </div>
                  <div className="p-6">
                    
                  
                    <div className="flex gap-4 justify-center pb-6">
                      {!shw && (
                        <button onClick={() => setShw(true)} className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-zinc-700 transition-colors">
                          View Questions & Ratings
                        </button>
                      )}
                      <a href={`https://codeforces.com/contestRegistration/${aC.id}/virtual/true`} target="_blank" rel="noreferrer" className="px-8 py-4 bg-blue-600 text-white hover:bg-blue-500 font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
                        Go Directly to Contest
                      </a>
                    </div>
                    
                    {shw && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-zinc-800/50 pt-6">
                        {aC.problems?.map((p, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded bg-zinc-800 text-zinc-300 font-black font-mono flex items-center justify-center text-sm">{p.index}</div>

                              <span className="text-sm font-medium text-zinc-300">{p.name || "Target Problem"}</span>
                            </div>
                            <span className="font-mono font-bold text-blue-400">{p.rating}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}