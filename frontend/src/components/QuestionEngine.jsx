import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function QuestionEngine() {
  const nv = useNavigate();
  const [u, setU] = useState(null);
  const [p, setP] = useState(null);
  const [ld, setLd] = useState(false);
  const [err, setErr] = useState("");
  const [selR, setSelR] = useState(null);
  const [recR, setRecR] = useState(null);
  
  
  const [sCd, setSCd] = useState(0);
  const [skipped, setSkipped] = useState([]);

  
  const [aiMode, setAiMode] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [aiRes, setAiRes] = useState("");
  const [aiLd, setAiLd] = useState(false);

  const ratings = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true })
      .then(async (res) => {
        const userData = res.data;
        if (!userData || !userData.h) {
          nv('/');
          return;
        }
        setU(userData);
        
        try {
          const cfRes = await axios.get(`https://codeforces.com/api/user.status?handle=${userData.h}`);
          const subs = cfRes.data.result.filter(s => s.verdict === 'OK');
          const solved = new Set();
          const ratingCounts = {};
          
          subs.forEach(s => {
            if (!s.problem.rating) return;
            const pid = `${s.problem.contestId}-${s.problem.index}`;
            if (!solved.has(pid)) {
              solved.add(pid);
              ratingCounts[s.problem.rating] = (ratingCounts[s.problem.rating] || 0) + 1;
            }
          });

          const base = userData.mxR ? Math.floor(userData.mxR / 100) * 100 : 1200;
          const t1 = Math.max(base + 100, 800);
          const t2 = Math.max(base + 200, 900);
          const c1 = ratingCounts[t1] || 0;
          
          const recommended = c1 < 35 ? t1 : t2;
          setRecR(recommended);
          setSelR(recommended);
        } catch (cfErr) {
          console.error("Codeforces API failed, but user is still logged in.");
        }
      })
      .catch(() => nv('/'));
  }, [nv]);
  useEffect(() => {
    let t; if (sCd > 0) t = setInterval(() => setSCd(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [sCd]);

  const genProb = async (targetRating, handle = u?.h, ignoreList = skipped) => {
    setLd(true); setErr(""); setP(null); setSelR(targetRating);
    setSCd(15); 
    
    setAiMode(null); setAiRes(""); setUserCode("");

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/problem/${handle}?rating=${targetRating}&ignore=${ignoreList.join(',')}`, { withCredentials: true });
      setP(data);
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to fetch target problem.");
    } finally {
      setLd(false);
    }
  };

  const handleSkip = () => {
    if (!p) return;
    const currentProblemId = `${p.contestId}-${p.index}`;
    const newSkippedList = [...skipped, currentProblemId];
    setSkipped(newSkippedList); 
    genProb(selR, u.h, newSkippedList); 
  };

  const askAI = async (mode) => {
    if (mode === 'debug' && !userCode.trim()) return;
    
    setAiLd(true); setAiRes("");
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ai/coach`, {
        mode,
        contestId: p.contestId,
        index: p.index,
        name: p.name,
        code: mode === 'debug' ? userCode : null
      }, { withCredentials: true });
      
      setAiRes(data.reply);
    } catch (error) {
      setAiRes("The AI Coach is currently offline. Please try again later.");
    } finally {
      setAiLd(false);
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

      <div className="max-w-4xl mx-auto space-y-10 pt-12">
        
        
        <div className="flex justify-between items-center pb-6 border-b border-zinc-800/50">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-1">Target Problem</h1>
            <p className="text-sm text-zinc-400 font-mono">connected: <span className="text-zinc-200">{u.h}</span></p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 flex flex-col items-end shadow-lg">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">CF Max Rating</p>
            <p className="text-2xl font-black text-white font-mono">{u.mxR || "Unrated"}</p>
          </div>
        </div>

       
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">Select Target Rating</h3>
          <div className="flex flex-wrap gap-3">
            {ratings.map(r => {
              const isRec = r === recR;
              const isSel = r === selR;
              return (
                <div key={r} className="relative flex flex-col items-center">
                  {isRec && (
                    <div className="absolute -top-6 flex flex-col items-center animate-bounce-slow">
                      <span className="text-[9px] font-black uppercase tracking-widest text-green-400 mb-1">Recommended</span>
                    </div>
                  )}
                  <button 
                    onClick={() => genProb(r, u.h, skipped)}
                    disabled={ld}
                    className={`
                      px-4 py-3 rounded-xl font-mono text-sm font-bold transition-all border
                      ${isSel ? 'bg-zinc-100 text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'}
                      ${isRec && !isSel ? 'border-b-2 border-b-green-500' : ''}
                      ${isRec && isSel ? 'border-b-4 border-b-green-500' : ''}
                    `}
                  >
                    {r}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="min-h-[300px] flex flex-col items-center justify-center border border-zinc-800/50 bg-zinc-900/30 rounded-2xl p-8 shadow-inner">
          
          {!p && !ld && !err && (
             <div className="text-center text-zinc-500 font-mono text-sm">
               Select a rating above to fetch the most popular unsolved problem.
             </div>
          )}

          
          {ld && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-zinc-300 font-bold tracking-wide">Crunching Codeforces Database...</p>
                <p className="text-zinc-500 font-mono text-xs mt-2 animate-pulse">This might take some time as we filter thousands of problems.</p>
              </div>
            </div>
          )}
          
          {err && <div className="p-4 bg-red-950/40 border border-red-900/50 text-red-400 text-sm rounded-xl w-full text-center">{err}</div>}

         
          {p && !ld && (
            <div className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
              
              
              <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded text-[10px] uppercase tracking-widest text-green-400 font-black mb-6">
                Rating {p.rating}
              </div>
              
              <h2 className="text-3xl font-black text-white mb-3">{p.name}</h2>
              
              
              <div className="flex justify-center items-center gap-4 text-zinc-400 font-mono text-sm mb-8">
                <span>Contest: {p.contestId}</span>
                <span>•</span>
                <span>Index: {p.index}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mb-8">
                
                <a href={`https://codeforces.com/contest/${p.contestId}/problem/${p.index}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-black uppercase tracking-wide text-sm rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Solve on Codeforces
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                
                
                <button onClick={handleSkip} disabled={sCd > 0} className="inline-flex items-center justify-center px-10 py-4 bg-zinc-800 text-zinc-300 border border-zinc-700 font-black uppercase tracking-wide text-sm rounded-xl hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50">
                  {sCd > 0 ? `Skip (${sCd}s)` : "Skip Question"}
                </button>
              </div>

              
              <div className="w-full border-t border-zinc-800/80 pt-8 mt-4 text-left">
                {!aiMode ? (
                  <button onClick={() => setAiMode('menu')} className="w-full py-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 text-indigo-300 font-bold rounded-xl hover:bg-indigo-900/60 transition-colors flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Need a hint? Ask the Engine
                  </button>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    {!aiRes && !aiLd && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button onClick={() => askAI('partial')} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:border-indigo-500/50 transition-all text-center">
                          Give a Subtle Hint
                        </button>
                        <button onClick={() => askAI('full')} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:border-indigo-500/50 transition-all text-center">
                          Explain Full Algorithm
                        </button>
                        <button onClick={() => setAiMode('debug')} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:border-red-500/50 transition-all text-center">
                          Debug My Code
                        </button>
                      </div>
                    )}

                    {aiMode === 'debug' && !aiRes && !aiLd && (
                      <div className="space-y-3 animate-in fade-in zoom-in-95">
                        <textarea 
                          value={userCode} 
                          onChange={(e) => setUserCode(e.target.value)} 
                          placeholder="Paste your C++, Python, or Java code here..."
                          className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                        <button onClick={() => askAI('debug')} disabled={!userCode.trim()} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg disabled:opacity-50 transition-colors">
                          Analyze Code
                        </button>
                      </div>
                    )}

                    {aiLd && (
                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-mono text-indigo-400">Consulting Neural Net...</span>
                      </div>
                    )}

                    {aiRes && !aiLd && (
                      <div className="p-6 bg-indigo-950/20 border border-indigo-900/50 rounded-lg space-y-4">
                        <p className="text-zinc-200 leading-relaxed text-sm whitespace-pre-wrap">{aiRes}</p>
                        <button onClick={() => { setAiMode('menu'); setAiRes(""); setUserCode(""); }} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                          ← Ask something else
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}