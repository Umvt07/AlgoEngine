import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const nv = useNavigate();
  const [u, setU] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("Authenticating with Engine Room...");
  const [crashError, setCrashError] = useState("");
  const [insight, setInsight] = useState({ title: "Analyzing Profile...", text: "Fetching submission history...", type: null });

  useEffect(() => {
    // 1. Verify the user
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`)
      .then(authRes => {
        const validUser = authRes.data;
        if (!validUser || !validUser.h) {
          throw new Error("Backend returned empty user data");
        }
        setU(validUser);
        setLoadingMsg("Crunching Codeforces history...");
        axios.get(`https://codeforces.com/api/user.status?handle=${validUser.h}`, { withCredentials: false })
          .then(cfRes => {

            if (!cfRes.data || !cfRes.data.result) return;
            const subs = cfRes.data.result.filter(s => s.verdict === 'OK');
            const solved = new Set();
            const ratingCounts = {};

            subs.forEach(s => {
              // console.log(s);
              if (!s.problem.rating) return;
              const pid = `${s.problem.contestId}-${s.problem.index}`;
              if (!solved.has(pid)) {
                solved.add(pid);
                ratingCounts[s.problem.rating] = (ratingCounts[s.problem.rating] || 0) + 1;
              }
            });

            const base = validUser.mxR ? Math.floor(validUser.mxR / 100) * 100 : 1200; 
            let t1 = Math.max(base + 100, 800);
            let t2 = Math.max(base + 200, 900);
            
            const c1 = ratingCounts[t1] || 0;
            const c2 = ratingCounts[t2] || 0;

            if (c1 < 35) {
              setInsight({ title: `Master the ${t1}s`, text: `Focus on solving more ${t1}-rated problems.`, type: 'questions' });
            } else if (c2 < 35) {
              setInsight({ title: `Push your limits to ${t2}`, text: `Push your limits and solve ${t2}-rated problems.`, type: 'questions' });
            } else {
              setInsight({ title: "Boost Contest Temperament", text: `Jump into a personalized virtual contest.`, type: 'contest' });
            }
          })
          .catch(err => {
            console.error("Codeforces API Error:", err);
            setInsight({ title: "API Limit Reached", text: "Codeforces is throttling requests. Try again later.", type: null });
          });
      })
      .catch(err => {
        console.error("Auth Guard Error:", err);
        // The backend rejected them. Send them back to login!!!
        nv('/'); 
      });
  }, [nv]);

  const out = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`);
    } catch (e) {
      console.error("Logout failed on server", e);
    } finally {
      nv('/');
    }
  };

  if (crashError) {
    return (
      <div className="min-h-screen bg-[#111] text-red-500 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard Crashed</h1>
        <p className="bg-red-950/40 p-4 rounded-lg font-mono">{crashError}</p>
      </div>
    );
  }

  if (!u) {
    return (
      <div className="min-h-screen bg-[#111] text-zinc-400 flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="font-mono text-sm tracking-widest uppercase">{loadingMsg}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-zinc-100 p-4 md:p-8 font-sans selection:bg-blue-500/30 flex justify-center items-center">
      <Link to="/dashboard" className="absolute top-6 left-6 z-50 transition-transform hover:scale-105">
        <img src="/whole_image.png" alt="AlgoEngine" className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.2)]" />
      </Link>
      
      <button onClick={out} className="absolute top-6 right-6 px-4 py-2 bg-red-950/30 text-red-500 border border-red-900/50 text-xs font-bold rounded-lg z-50 transition-colors hover:bg-red-900/50">
        Disconnect
      </button>

      <div className="w-full max-w-4xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Welcome, <span className="text-blue-500">{u.h}</span></h1>
          <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Peak Rating: {u.mxR || "Unrated"}</p>
        </div>

        <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
          <div className="bg-[#18181b] p-6 md:p-8 rounded-2xl h-full flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-blue-950/50 border border-blue-900/50 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-1">Engine Analysis: {insight.title}</h3>
              <p className="text-zinc-300 leading-relaxed">{insight.text}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Target Problem Card */}
          <Link to="/questions" className={`group relative p-8 rounded-2xl border transition-all duration-300 ${insight.type === 'questions' ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:bg-blue-900/30' : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900'}`}>
            {insight.type === 'questions' && <div className="absolute -top-3 right-6 px-3 py-1 bg-blue-600 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-lg">Recommended</div>}
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">Target Problem</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">Generate the best unsolved problem of any rating by you</p>
            <div className="text-sm font-bold text-zinc-500 group-hover:text-white transition-colors flex items-center gap-2">
              Launch Engine <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          {/* Virtual Contest Card */}
          <Link to="/contest" className={`group relative p-8 rounded-2xl border transition-all duration-300 ${insight.type === 'contest' ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.1)] hover:bg-purple-900/30' : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900'}`}>
            {insight.type === 'contest' && <div className="absolute -top-3 right-6 px-3 py-1 bg-purple-600 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-lg">Recommended</div>}
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">Virtual Contest</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">Find the best past contests packed with problems in your exact growth range.</p>
            <div className="text-sm font-bold text-zinc-500 group-hover:text-white transition-colors flex items-center gap-2">
              Launch Engine <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}