import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function AccountVerify() {
  const nv = useNavigate();
  const loc = useLocation();
  
  const [opn, setOpn] = useState(false);
  const [chk, setChk] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
  
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`)
      .then(() => {
        
        nv('/dashboard');
      })
      .catch(() => {
       
      });

   
    const p = new URLSearchParams(loc.search);
    const e = p.get('error');
    if (e) setErr('Codeforces authorization failed. Please try again.');

  }, [nv, loc]);

  
  const go = () => {
    if (chk) window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/cf`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30 font-sans relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <img 
          src="/whole_image.png" 
          alt="AlgoEngine" 
          className="h-16 md:h-20 w-auto object-contain mb-8 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-105 transition-transform duration-500" 
        />
        
        <div className="flex flex-col items-center mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Codeforces Integration</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">Target your optimal growth zone</p>
        </div>

        {err && (
          <div className="w-full mb-6 p-4 bg-red-950/40 text-red-400 text-sm font-medium border border-red-900/50 rounded-xl text-center shadow-lg">
            {err}
          </div>
        )}

        <div className="w-full bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl flex flex-col items-center relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <p className="text-zinc-600 text-[10px] mb-6 uppercase tracking-widest font-black">Authentication</p>
          
          <button 
            onClick={() => setOpn(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Connect Account
          </button>
        </div>
      </div>

      {opn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#111] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="flex justify-between items-center p-6 border-b border-zinc-800/50">
              <h3 className="text-base font-black text-white tracking-wide">Secure Connection</h3>
              <button 
                onClick={() => { setOpn(false); setChk(false); }}
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-950/20 border border-blue-900/30 p-5 rounded-xl">
                <h4 className="text-blue-400 font-black text-sm uppercase tracking-wider mb-2">Prerequisite</h4>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                  Ensure you are actively logged in to your Codeforces account in this browser. If not, <a href="https://codeforces.com/enter" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-bold underline decoration-blue-500/30 underline-offset-4">login here</a> first.
                </p>
                
                <label className="flex items-center gap-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={chk}
                      onChange={(e) => setChk(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-zinc-600 rounded bg-transparent checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">I confirm I am logged into Codeforces</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800/50 bg-zinc-950/50">
              <button 
                onClick={go}
                disabled={!chk}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                  chk 
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                }`}
              >
                Launch Verification
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}