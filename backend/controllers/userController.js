import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
// export const verifyAccounts = async (req, res) => {
//   try {
//     const { codeforces } = req.body;
    
//     if (!codeforces) {
//       return res.status(400).json({ success: false, error: "Give Correct Cf handle" });
//     }

//     const [cfResponse] = await Promise.all([
//       axios.get(`https://codeforces.com/api/user.info?handles=${codeforces}`),
//     ]);

//     if (cfResponse.data.status !== "OK") {
//       return res.status(400).json({ success: false, error: "Invalid Codeforces handle" });
//     }

//     const cfData = cfResponse.data.result[0];

//     const userData = {
//       codeforcesHandle: codeforces,
//       cfMaxRating: cfData.maxRating || 0,
//       avatar: cfData.titlePhoto || cfData.avatar
//     };

//     return res.status(200).json({
//       success: true,
//       message: "Profiles validated successfully",
//       userData
//     });

//   } catch (error) {
//     console.error("Verification Route Error:", error.message);
//     if (error.response?.status === 400) {
//       return res.status(400).json({ success: false, error: "Codeforces handle not found" });
//     }
//     return res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };


export const getContestRecommendation = async (req, res) => {
  try {
    const { handle } = req.params;
    if (!handle) return res.status(400).json({ error: "Handle is required" });

   
    const [infoRes, statusRes, probRes, contestRes] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
      axios.get(`https://codeforces.com/api/problemset.problems`),
      axios.get(`https://codeforces.com/api/contest.list?gym=false`)
    ]);

    const userInfo = infoRes.data.result[0];
    const userSubmissions = statusRes.data.result;
    const allProblems = probRes.data.result.problems;
    const allContests = contestRes.data.result;

    const currentRating = userInfo.rating || 0;
    const maxRating = userInfo.maxRating || 0;
    const baseRating = Math.max(currentRating, maxRating);

    
    const attemptedContests = new Set(
      userSubmissions
        .filter(sub => sub.verdict === "OK")
        .map(sub => sub.contestId)
    );

    let minTarget = baseRating - 100;
    let maxTarget = baseRating + 200;
    minTarget=Math.max(800,minTarget);
    maxTarget=Math.max(900,maxTarget);
    const problemsByContest = {};
    allProblems.forEach(p => {
      if (!p.rating) return;
      if (!problemsByContest[p.contestId]) problemsByContest[p.contestId] = [];
      problemsByContest[p.contestId].push({ index: p.index, rating: p.rating });
    });

    const rankedContests = [];

    allContests.forEach(contest => {
      if (contest.phase !== 'FINISHED') return;
      if (attemptedContests.has(contest.id)) return;
      
      
      if (!contest.name.includes('Div')) return; 
      
      const contestProblems = problemsByContest[contest.id];
      if (!contestProblems || contestProblems.length === 0) return;


      let matchCount = 0;
      contestProblems.forEach(p => {
        if (p.rating >= minTarget && p.rating <= maxTarget) {
          matchCount++;
        }
      });

      if (matchCount >= 0) {
        contestProblems.sort((a, b) => a.index.localeCompare(b.index));
        rankedContests.push({
          id: contest.id,
          name: contest.name,
          problems: contestProblems,
          matchCount
        });
      }
    });

    if (rankedContests.length > 0) {
      rankedContests.sort((a, b) => b.matchCount - a.matchCount);


      return res.json({ 
        type: "TARGETED", 
        baseRating, 
        targetRange: `${minTarget}-${maxTarget}`, 
        contests: rankedContests 
      });
    }

    return res.status(404).json({ error: "No available contests match your profile. You've solved them all!"});

  } catch (error) {
    console.error("Codeforces API Error:", error.message);
    return res.status(500).json({ error: "Failed to process live Codeforces data." });
  }
};


export const getProb = async (req, res) => {
  const { h } = req.params;
  const targetRating = parseInt(req.query.rating);
  
  
  const ignoreList = req.query.ignore ? req.query.ignore.split(',') : [];

  if (req.user.h !== h) {
    return res.status(403).json({ error: "Access denied." });
  }

  if (!targetRating) {
    return res.status(400).json({ error: "Target rating is required." });
  }

  try {
    const statusRes = await axios.get(`https://codeforces.com/api/user.status?handle=${h}`);
    const solved = new Set(
      statusRes.data.result
        .filter(s => s.verdict === 'OK')
        .map(s => `${s.problem.contestId}-${s.problem.index}`)
    );

    const probsRes = await axios.get('https://codeforces.com/api/problemset.problems');
    const allProblems = probsRes.data.result.problems;
    const problemStats = probsRes.data.result.problemStatistics;

    const statsMap = {};
    problemStats.forEach(stat => {
      statsMap[`${stat.contestId}-${stat.index}`] = stat.solvedCount;
    });

    const validProblems = allProblems.filter(p => {
      const pid = `${p.contestId}-${p.index}`;
      return (
        p.rating === targetRating &&
        !solved.has(pid) &&
        !ignoreList.includes(pid) && 
        !p.tags.includes('*special')
      );
    });

    if (validProblems.length === 0) {
      return res.status(404).json({ error: `No more unsolved ${targetRating} rated problems found.` });
    }

    validProblems.sort((a, b) => {
      const solvesA = statsMap[`${a.contestId}-${a.index}`] || 0;
      const solvesB = statsMap[`${b.contestId}-${b.index}`] || 0;
      return solvesB - solvesA; 
    });

    const bestProblem = validProblems[0];

    res.json({
      name: bestProblem.name,
      contestId: bestProblem.contestId,
      index: bestProblem.index,
      rating: bestProblem.rating
    });

  } catch (error) {
    console.error("Problem Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch from Codeforces." });
  }
};

export const askCoach = async (req, res) => {
  const { mode, contestId, index, name, code } = req.body;

  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ reply: "Server error: Gemini API key is missing." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    let prompt = "";
    const problemIdentifier = `Codeforces Problem ${contestId}${index}: "${name}"`;

   
    if (mode === 'partial') {
      prompt = `You are an elite competitive programming coach. Your student is stuck on ${problemIdentifier}. 
      Give them a subtle, one or two-sentence Socratic hint to nudge them in the right direction. 
      Do NOT give them the full algorithm, and absolutely DO NOT write any code. Just a hint about the core observation (e.g., "Think about what happens if you sort the array first" or "Is there a way to use prefix sums here? also i have to display the data
      in the website so make sure you write things in normal way so that human can read and understan).`;
    } 
    
    else if (mode === 'full') {
      prompt = `You are an expert competitive programming tutor. Explain the optimal algorithmic approach to solve ${problemIdentifier}. 
      Break down the intuition, the data structures needed, and the expected Time and Space Complexity. 
      Explain it clearly so a beginner can understand. DO NOT write the actual code implementation, just explain the logic also i have to display the data
      in the website so make sure you write things in normal way so that human can read and understand by human.`;
    } 
    
    else if (mode === 'debug') {
      prompt = `You are a strict code reviewer. Your student is trying to solve ${problemIdentifier}. 
      Here is their code:
      
      ${code}
      
      Identify the main reason this code will fail (e.g., Time Limit Exceeded, Integer Overflow, missing edge case, or logical flaw). 
      Keep your response concise and directly point out the mistake. Do not rewrite the entire code for them.`;
    } 
    
    else {
      return res.status(400).json({ reply: "Invalid AI mode." });
    }

    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ reply: responseText });

  } catch (error) {
    res.status(500).json({ reply: "The AI Coach is currently offline. Please check your API key or try again later." });
  }
};