"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Trophy,
  Target,
  Calendar as CalIcon,
  BookOpen,
  BarChart3,
  Building2,
  FileText,
  Users,
  MessageSquare,
  Download,
  Bookmark,
  Play,
  Clock,
  Send,
  CheckCircle2,
  Circle,
  Zap,
} from "lucide-react";

export default function Page() {
  // ---------------- Global app state ----------------
  const [activeTab, setActiveTab] = useState("dashboard"); // sidebar tab
  const [savedStateLoaded, setSavedStateLoaded] = useState(false);

  // Phase 1 states (roadmap, progress, notes, bookmarks)
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState({}); // topicId -> count
  const [notes, setNotes] = useState({}); // topicId -> note
  const [bookmarked, setBookmarked] = useState([]); // list of {id, name, company, difficulty, date}

  // streak/time tracking
  const [studyStreak, setStudyStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);

  // companies progress
  const [companyProgress, setCompanyProgress] = useState({}); // name -> count

  // Phase 2 states (Aptitude + Resume)
  const [aptitudeState, setAptitudeState] = useState({
    category: "quant",
    qIndex: 0,
    running: false,
    timerSecondsLeft: 0,
    currentQuiz: null,
    results: {}, // category -> {attempted, correct}
  });

  // simple sample MCQs (small set demo)
  const MCQS = {
    quant: [
      {
        id: "q-q-1",
        q: "If x + 2 = 5, what is x?",
        options: ["2", "3", "5", "7"],
        ans: 1,
      },
      {
        id: "q-q-2",
        q: "Find 12 * 9",
        options: ["108", "96", "120", "112"],
        ans: 0,
      },
    ],
    reasoning: [
      {
        id: "q-r-1",
        q: "Which comes next in series: 2, 4, 8, ?",
        options: ["10", "12", "16", "14"],
        ans: 2,
      },
    ],
    verbal: [
      {
        id: "q-v-1",
        q: "Choose the antonym of 'abundant'",
        options: ["scarce", "plentiful", "ample", "bountiful"],
        ans: 0,
      },
    ],
  };

  // Resume analyzer - user can paste resume text or upload file (placeholder)
  const [resumeText, setResumeText] = useState("");
  const resumeKeywords = ["JavaScript", "Python", "React", "SQL", "Node", "AWS", "Docker"];

  // Phase 3 states (Mock Interview + Calendar + Community)
  const [mock, setMock] = useState({
    mode: "coding", // coding | hr | behavioral
    coding: { prompt: sampleCodingPrompt(), answer: "", startedAt: null, duration: 20 * 60 }, // seconds
    hr: { answers: [] },
  });
  const [events, setEvents] = useState([]); // calendar events
  const [communityPosts, setCommunityPosts] = useState([]);

  // small helpers
  function sampleCodingPrompt() {
    return {
      id: "p1",
      title: "Two Sum (practice)",
      description:
        "Given an array of integers and a target, return indices of two numbers such that they add up to target. (This is practice — don't execute code here.)",
      suggestedTime: 20 * 60,
    };
  }

  // Roadmap data (Phase 1 core content)
  const phases = useMemo(
    () => [
      {
        title: "Foundation Phase",
        duration: "3-4 weeks",
        tasks: [
          { id: "array-basics", topic: "Arrays", details: "Two pointers, sliding window", targetCount: 40 },
          { id: "string-basics", topic: "Strings", details: "Pattern matching, palindromes", targetCount: 25 },
          { id: "sorting", topic: "Sorting & Searching", details: "Binary search, sorts", targetCount: 20 },
          { id: "time-space", topic: "Time & Space Complexity", details: "Big-O analysis", targetCount: 10 },
        ],
      },
      {
        title: "Core DSA Phase",
        duration: "4-5 weeks",
        tasks: [
          { id: "linkedlist", topic: "Linked Lists", details: "Reverse, cycles", targetCount: 25 },
          { id: "stacks-queues", topic: "Stacks & Queues", details: "Monotonic stacks, deque", targetCount: 20 },
          { id: "trees", topic: "Binary Trees", details: "Traversals, BST", targetCount: 35 },
          { id: "hashing", topic: "Hashing", details: "Maps, frequency counting", targetCount: 20 },
        ],
      },
      {
        title: "Advanced Phase",
        duration: "3-4 weeks",
        tasks: [
          { id: "graphs", topic: "Graphs", details: "DFS/BFS, shortest path", targetCount: 25 },
          { id: "dp", topic: "Dynamic Programming", details: "Knapsack, LIS", targetCount: 30 },
          { id: "recursion", topic: "Recursion & Backtracking", details: "N-Queens", targetCount: 20 },
          { id: "greedy", topic: "Greedy", details: "Interval problems", targetCount: 15 },
        ],
      },
      {
        title: "Interview Prep Phase",
        duration: "2-3 weeks",
        tasks: [
          { id: "mock-coding", topic: "Mock Coding Interviews", details: "Practice with timer", targetCount: 10 },
          { id: "system-design", topic: "System Design basics", details: "Scalability & APIs", targetCount: 5 },
          { id: "behavioral", topic: "Behavioral Questions", details: "STAR method", targetCount: 8 },
          { id: "company-prep", topic: "Company-Specific Prep", details: "Past questions", targetCount: 5 },
        ],
      },
    ],
    []
  );

  const companies = useMemo(
    () => [
      { name: "Google", difficulty: "Hard", focus: "Algorithms, System Design" },
      { name: "Microsoft", difficulty: "Medium-Hard", focus: "Problem Solving" },
      { name: "Amazon", difficulty: "Medium", focus: "Leadership, Scalability" },
      { name: "Meta", difficulty: "Hard", focus: "Optimization" },
      { name: "TCS", difficulty: "Easy-Medium", focus: "Aptitude + Coding" },
    ],
    []
  );

  // ---------------- Persistence (localStorage) ----------------
  useEffect(() => {
    // load
    try {
      const raw = localStorage.getItem("placementRoadmap_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCompletedTasks(new Set(parsed.completedTasks || []));
        setProblemsSolved(parsed.problemsSolved || {});
        setNotes(parsed.notes || {});
        setBookmarked(parsed.bookmarked || []);
        setCompanyProgress(parsed.companyProgress || {});
        setStudyStreak(parsed.studyStreak || 0);
        setLastStudyDate(parsed.lastStudyDate || null);
        setEvents(parsed.events || []);
        setCommunityPosts(parsed.communityPosts || []);
        setSavedStateLoaded(true);
      } else {
        setSavedStateLoaded(true);
      }
    } catch (e) {
      console.error("load error", e);
      setSavedStateLoaded(true);
    }
  }, []);

  useEffect(() => {
    // save whenever relevant state changes
    if (!savedStateLoaded) return;
    const data = {
      completedTasks: Array.from(completedTasks),
      problemsSolved,
      notes,
      bookmarked,
      companyProgress,
      studyStreak,
      lastStudyDate,
      events,
      communityPosts,
    };
    localStorage.setItem("placementRoadmap_v2", JSON.stringify(data));
  }, [
    savedStateLoaded,
    completedTasks,
    problemsSolved,
    notes,
    bookmarked,
    companyProgress,
    studyStreak,
    lastStudyDate,
    events,
    communityPosts,
  ]);

  // ---------------- Streak logic ----------------
  useEffect(() => {
    // small, robust streak update: if user completes tasks and lastStudyDate is not today -> update.
    if (completedTasks.size === 0) return;
    const today = new Date().toDateString();
    if (lastStudyDate === today) return;
    if (lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
      setStudyStreak((s) => s + 1);
    } else {
      setStudyStreak(1);
    }
    setLastStudyDate(today);
  }, [completedTasks]);

  // ---------------- Roadmap actions ----------------
  const toggleTask = (taskId) => {
    const next = new Set(completedTasks);
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    setCompletedTasks(next);
  };

  const setProblemCount = (taskId, count) => {
    setProblemsSolved((p) => ({ ...p, [taskId]: Math.max(0, Math.floor(count || 0)) }));
  };

  const setNote = (taskId, text) => {
    setNotes((n) => ({ ...n, [taskId]: text }));
  };

  const addBookmark = ({ name, difficulty, company }) => {
    const item = {
      id: Date.now(),
      name,
      difficulty,
      company,
      date: new Date().toLocaleDateString(),
    };
    setBookmarked((b) => [item, ...b]);
  };

  const removeBookmark = (id) => setBookmarked((b) => b.filter((x) => x.id !== id));

  const exportProgressJSON = () => {
    const data = {
      completedTasks: Array.from(completedTasks),
      problemsSolved,
      notes,
      bookmarked,
      companyProgress,
      studyStreak,
      lastStudyDate,
      events,
      communityPosts,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "placement-roadmap-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- Aptitude Quiz Engine (Phase 2) ----------------
  const startQuiz = (category = "quant", timeSeconds = 120) => {
    setAptitudeState((s) => ({
      ...s,
      category,
      qIndex: 0,
      running: true,
      timerSecondsLeft: timeSeconds,
      currentQuiz: MCQS[category] ? MCQS[category][0] : null,
    }));
  };

  // timer for aptitude
  useEffect(() => {
    if (!aptitudeState.running) return;
    const id = setInterval(() => {
      setAptitudeState((s) => {
        if (s.timerSecondsLeft <= 1) {
          // stop
          return { ...s, running: false, timerSecondsLeft: 0 };
        }
        return { ...s, timerSecondsLeft: s.timerSecondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [aptitudeState.running]);

  const submitMCQAnswer = (category, qId, selectedIndex) => {
    const qSet = MCQS[category] || [];
    const q = qSet.find((x) => x.id === qId);
    const correct = q && q.ans === selectedIndex;
    setAptitudeState((s) => {
      const prev = s.results[category] || { attempted: 0, correct: 0 };
      return { ...s, results: { ...s.results, [category]: { attempted: prev.attempted + 1, correct: prev.correct + (correct ? 1 : 0) } } };
    });
    // advance index
    setAptitudeState((s) => {
      const nextIndex = (s.qIndex || 0) + 1;
      const nextQuiz = MCQS[category] && MCQS[category][nextIndex] ? MCQS[category][nextIndex] : null;
      if (!nextQuiz) {
        return { ...s, running: false, currentQuiz: null, qIndex: nextIndex };
      }
      return { ...s, qIndex: nextIndex, currentQuiz: nextQuiz };
    });
  };

  // ---------------- Resume Analyzer (Phase 2) ----------------
  const analyzeResumeText = (text) => {
    const lower = text.toLowerCase();
    const found = resumeKeywords.filter((k) => lower.includes(k.toLowerCase()));
    // quick format checks
    const checks = [];
    if (text.split("\n").some((l) => l.trim().startsWith("-") || l.trim().startsWith("*"))) checks.push("Bulleted sections found");
    if (text.includes("@") && text.includes(".com")) checks.push("Contains an email");
    if (found.length === 0) checks.push("No top keywords found — consider adding skills");
    return { found, checks, score: Math.min(100, 40 + found.length * 12) };
  };

  // ---------------- Mock Interview (Phase 3) ----------------
  const startMockCoding = (seconds) => {
    setMock((m) => ({ ...m, mode: "coding", coding: { ...m.coding, startedAt: Date.now(), duration: seconds, answer: "" } }));
    setActiveTab("mock");
  };

  const stopMockCoding = () => {
    // store attempt
    const attempt = {
      id: Date.now(),
      prompt: mock.coding.prompt || sampleCodingPrompt(),
      answer: mock.coding.answer,
      startedAt: mock.coding.startedAt,
      duration: mock.coding.duration,
      submittedAt: Date.now(),
    };
    // store as community post for review (local)
    setCommunityPosts((c) => [{ type: "mockAttempt", ...attempt }, ...c]);
    // reset
    setMock((m) => ({ ...m, coding: { ...m.coding, startedAt: null } }));
  };

  // ---------------- Calendar (Phase 3) ----------------
  const addEvent = (title, dateStr, note) => {
    const ev = { id: Date.now(), title, date: dateStr, note };
    setEvents((e) => [ev, ...e]);
  };

  const exportICS = () => {
    // generate a minimal ICS with all events (UTC naive)
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PlacementRoadmap//EN\n";
    events.forEach((ev) => {
      const dt = new Date(ev.date);
      const dtStr = dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      ics += "BEGIN:VEVENT\n";
      ics += `UID:${ev.id}\n`;
      ics += `DTSTAMP:${dtStr}\n`;
      ics += `DTSTART:${dtStr}\n`;
      ics += `SUMMARY:${ev.title}\n`;
      if (ev.note) ics += `DESCRIPTION:${ev.note}\n`;
      ics += "END:VEVENT\n";
    });
    ics += "END:VCALENDAR";
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "placement-events.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- Utilities / small derived values ----------------
  const totalTasksCount = phases.reduce((s, p) => s + p.tasks.length, 0);
  const completedCount = completedTasks.size;
  const overallProgressPercent = Math.round((completedCount / Math.max(1, totalTasksCount)) * 100);
  const totalProblemsSolved = Object.values(problemsSolved).reduce((s, v) => s + (v || 0), 0);

  // ---------------- Render helpers for sections ----------------

  const RenderHeaderCards = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div>
          <Trophy className="mx-auto" />
          <div className="text-2xl font-bold">{overallProgressPercent}%</div>
          <div className="text-sm opacity-90">Overall Progress</div>
        </div>
        <div>
          <Target className="mx-auto" />
          <div className="text-2xl font-bold">{totalProblemsSolved}</div>
          <div className="text-sm opacity-90">Problems Solved</div>
        </div>
        <div>
          <CalIcon className="mx-auto" />
          <div className="text-2xl font-bold">{studyStreak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
        <div>
          <Clock className="mx-auto" />
          <div className="text-2xl font-bold">{Object.keys(notes).length}</div>
          <div className="text-sm opacity-90">Notes</div>
        </div>
      </div>
    </div>
  );

  // ---------------- Main UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Placement Roadmap</h2>

          <nav className="space-y-2">
            <NavButton id="dashboard" label="Dashboard" icon={BarChart3} active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
            <NavButton id="roadmap" label="Roadmap" icon={BookOpen} active={activeTab === "roadmap"} onClick={() => setActiveTab("roadmap")} />
            <NavButton id="aptitude" label="Aptitude" icon={Target} active={activeTab === "aptitude"} onClick={() => setActiveTab("aptitude")} />
            <NavButton id="companies" label="Companies" icon={Building2} active={activeTab === "companies"} onClick={() => setActiveTab("companies")} />
            <NavButton id="resume" label="Resume Analyzer" icon={FileText} active={activeTab === "resume"} onClick={() => setActiveTab("resume")} />
            <NavButton id="analytics" label="Analytics" icon={BarChart3} active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
            <NavButton id="mock" label="Mock Interview" icon={Users} active={activeTab === "mock"} onClick={() => setActiveTab("mock")} />
            <NavButton id="calendar" label="Calendar" icon={CalIcon} active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")} />
            <NavButton id="community" label="Community" icon={MessageSquare} active={activeTab === "community"} onClick={() => setActiveTab("community")} />
          </nav>

          <div className="mt-6 border-t pt-4">
            <button onClick={exportProgressJSON} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded">
              <Download className="w-4 h-4" /> Export progress
            </button>
            <p className="text-xs mt-2 text-gray-600">Your data is saved locally in the browser (localStorage).</p>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-1 lg:col-span-5">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <>
              <RenderHeaderCards />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setActiveTab("roadmap")} className="px-3 py-2 bg-blue-600 text-white rounded">Start Roadmap</button>
                    <button onClick={() => setActiveTab("aptitude")} className="px-3 py-2 bg-indigo-600 text-white rounded">Take Aptitude Test</button>
                    <button onClick={() => setActiveTab("resume")} className="px-3 py-2 bg-gray-800 text-white rounded">Update Resume</button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Today's Focus</h3>
                  <p className="text-sm">Complete 5 array problems, revise DP notes</p>
                  <div className="mt-3">
                    <button onClick={() => {
                      // simple simulation: mark one array problem solved
                      setProblemCount("array-basics", (problemsSolved["array-basics"] || 0) + 1);
                      setActiveTab("roadmap");
                    }} className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2">
                      <Zap /> Mark small win
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Bookmarks</h3>
                  {bookmarked.length === 0 ? <p className="text-sm text-gray-500">No bookmarks yet</p> : (
                    <ul className="space-y-2 text-sm">
                      {bookmarked.slice(0, 5).map(b => <li key={b.id}>{b.name} <span className="text-gray-400">({b.company})</span></li>)}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Roadmap */}
          {activeTab === "roadmap" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Roadmap</h2>
                <div className="text-sm text-gray-600">Progress: {overallProgressPercent}% • Tasks completed: {completedCount}/{totalTasksCount}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phases.map((ph, idx) => (
                  <div key={ph.title} className="bg-white p-4 rounded shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{ph.title}</h3>
                        <div className="text-sm text-gray-500">{ph.duration}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">{ph.tasks.filter(t => completedTasks.has(t.id)).length}/{ph.tasks.length} done</div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-3">
                      {ph.tasks.map(t => (
                        <div key={t.id} className="p-3 border rounded flex items-start gap-3">
                          <button onClick={() => toggleTask(t.id)} className="mt-1">
                            {completedTasks.has(t.id) ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`${completedTasks.has(t.id) ? "line-through text-gray-500" : "text-gray-800"} font-semibold`}>{t.topic}</div>
                                <div className="text-xs text-gray-500">{t.details}</div>
                              </div>
                              <div className="text-xs">
                                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{(problemsSolved[t.id] || 0)}/{t.targetCount}</div>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <input type="number" min="0" max={t.targetCount} value={problemsSolved[t.id] || 0} onChange={(e) => setProblemCount(t.id, parseInt(e.target.value || 0))} className="w-20 p-1 border rounded text-xs" />
                              <textarea placeholder="Add notes..." value={notes[t.id] || ""} onChange={(e) => setNote(t.id, e.target.value)} className="flex-1 p-2 border rounded text-xs" rows="2" />
                              <button onClick={() => addBookmark({ name: t.topic, difficulty: "Topic", company: "General" })} className="p-2 bg-yellow-400 rounded"><Bookmark /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aptitude (Phase 2) */}
          {activeTab === "aptitude" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Aptitude Practice</h2>

              <div className="flex gap-2">
                {["quant", "reasoning", "verbal"].map(cat => (
                  <button key={cat} onClick={() => setAptitudeState(s => ({ ...s, category: cat, qIndex: 0, currentQuiz: MCQS[cat] && MCQS[cat][0] || null }))} className={`px-3 py-2 rounded ${aptitudeState.category === cat ? 'bg-blue-600 text-white' : 'bg-white'}`}>{cat.toUpperCase()}</button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => startQuiz(aptitudeState.category, 120)} className="px-3 py-2 bg-green-600 text-white rounded">Start 2m Quiz</button>
                  <div className="text-sm text-gray-600">Timer: {aptitudeState.timerSecondsLeft}s</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                {aptitudeState.running && aptitudeState.currentQuiz ? (
                  <div>
                    <div className="font-semibold">{aptitudeState.currentQuiz.q}</div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {aptitudeState.currentQuiz.options.map((opt, i) => (
                        <button key={i} onClick={() => submitMCQAnswer(aptitudeState.category, aptitudeState.currentQuiz.id, i)} className="p-2 border rounded text-left">{String.fromCharCode(65 + i)}. {opt}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600">No active quiz. Press Start to begin timed practice. Results per category:</div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.keys(MCQS).map(cat => {
                        const res = aptitudeState.results[cat] || { attempted: 0, correct: 0 };
                        const acc = res.attempted ? Math.round((res.correct / res.attempted) * 100) : 0;
                        return (
                          <div key={cat} className="p-3 border rounded">
                            <div className="font-semibold">{cat.toUpperCase()}</div>
                            <div className="text-sm text-gray-600">Attempted: {res.attempted} • Correct: {res.correct} • Acc: {acc}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Companies */}
          {activeTab === "companies" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Company Preparation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map(c => (
                  <div key={c.name} className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{c.name}</h3>
                        <div className="text-sm text-gray-500">{c.focus}</div>
                      </div>
                      <div className="text-sm">
                        <input type="number" min="0" value={companyProgress[c.name] || 0} onChange={(e) => setCompanyProgress(prev => ({ ...prev, [c.name]: parseInt(e.target.value || 0) }))} className="w-20 p-1 border rounded text-xs" />
                        <div className="text-xs text-gray-500">Problems practiced</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <details>
                        <summary className="cursor-pointer text-sm text-blue-600">Past Interview Questions & Experiences</summary>
                        <div className="mt-2 text-sm text-gray-600">• Example: Explain difference between BFS & DFS. • Experience: Interview involved system design + coding.</div>
                        <div className="mt-2 text-xs text-gray-500">Prep suggestion: 2–3 weeks focus on {c.name === 'Amazon' ? 'scalability' : 'algorithms'}</div>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Analyzer (Phase 2) */}
          {activeTab === "resume" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Resume Analyzer</h2>
              <div className="bg-white p-4 rounded shadow space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Paste your resume text (best for instant analysis)</label>
                  <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={8} className="w-full p-2 border rounded mt-1" placeholder="Paste resume content here..."></textarea>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => {
                    const r = analyzeResumeText(resumeText || "");
                    alert(`ATS-like score: ${r.score}/100\nFound keywords: ${r.found.join(", ") || "none"}\nChecks: ${r.checks.join("; ") || "none"}`);
                  }} className="px-3 py-2 bg-blue-600 text-white rounded">Analyze Text</button>

                  <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => alert("File upload placeholder — paste text for instant analysis in this demo. Full file parsing requires server libraries.")} className="px-3 py-2" />
                </div>

                <div className="text-sm text-gray-500">Tips: Include skill keywords (JavaScript, Python, React, SQL, AWS). Aim for clear bullet points and contact info.</div>
              </div>
            </div>
          )}

          {/* Analytics (Phase 2) */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Problems solved by topic (sample)</h3>
                  <SimpleBarChart data={Object.entries(problemsSolved).map(([k, v]) => ({ label: k, value: v || 0 }))} />
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Aptitude accuracy (sample)</h3>
                  <div className="space-y-2">
                    {Object.keys(MCQS).map(cat => {
                      const res = aptitudeState.results[cat] || { attempted: 0, correct: 0 };
                      const acc = res.attempted ? Math.round((res.correct / res.attempted) * 100) : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between"><div className="font-medium">{cat.toUpperCase()}</div><div>{acc}%</div></div>
                          <div className="w-full bg-gray-200 h-2 rounded"><div style={{ width: `${acc}%` }} className="bg-blue-500 h-2 rounded" /></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mock Interview (Phase 3) */}
          {activeTab === "mock" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Mock Interview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{mock.coding?.prompt?.title || sampleCodingPrompt().title}</div>
                      <div className="text-sm text-gray-500">{mock.coding?.prompt?.description || sampleCodingPrompt().description}</div>
                    </div>
                    <div>
                      <button onClick={() => startMockCoding(20 * 60)} className="px-3 py-2 bg-blue-600 text-white rounded">Start 20m</button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-medium">Your code (practice only)</label>
                    <textarea value={mock.coding.answer} onChange={(e) => setMock(m => ({ ...m, coding: { ...m.coding, answer: e.target.value } }))} rows={10} className="w-full p-2 border rounded mt-1" placeholder="// Write your solution here (no execution in this demo)"></textarea>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => { stopMockCoding(); alert("Submission saved to local attempts (community)."); }} className="px-3 py-2 bg-green-600 text-white rounded">Submit</button>
                      <div className="text-xs text-gray-500">Tip: Practice speaking through your solution while coding.</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <h4 className="font-semibold">HR / Behavioral Practice</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    Try answering: "Tell me about a time you faced conflict in a team." Use STAR (Situation, Task, Action, Result). Save your answers below.
                  </div>
                  <div className="mt-3">
                    <textarea id="hrAnswer" rows={6} className="w-full p-2 border rounded" placeholder="Write your answer here..."></textarea>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => {
                        const v = document.getElementById("hrAnswer").value;
                        if (!v.trim()) return alert("Write an answer first.");
                        setCommunityPosts(p => [{ type: "hrAnswer", text: v, id: Date.now(), date: new Date().toLocaleString() }, ...p]);
                        document.getElementById("hrAnswer").value = "";
                        alert("Saved to your local mock answers.");
                      }} className="px-3 py-2 bg-blue-600 text-white rounded">Save Answer</button>
                      <button onClick={() => alert("Suggested HR questions: Tell me about a challenge; Describe leadership; Where do you see yourself?")} className="px-3 py-2 bg-gray-200 rounded">Show Questions</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Saved mock attempts (local)</h4>
                <div className="space-y-2">
                  {communityPosts.filter(p => p.type === "mockAttempt").map(at => (
                    <div key={at.id} className="p-2 border rounded bg-white">
                      <div className="text-sm font-medium">{at.prompt.title}</div>
                      <div className="text-xs text-gray-500">Submitted: {new Date(at.submittedAt).toLocaleString()}</div>
                    </div>
                  ))}
                  {communityPosts.filter(p => p.type === "mockAttempt").length === 0 && <div className="text-sm text-gray-500">No attempts yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* Calendar (Phase 3) */}
          {activeTab === "calendar" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Calendar & Schedule</h2>
              <div className="bg-white p-4 rounded shadow mb-3">
                <AddEventForm onAdd={(t, d, n) => addEvent(t, d, n)} />
                <div className="mt-3 flex gap-2">
                  <button onClick={exportICS} className="px-3 py-2 bg-green-600 text-white rounded">Export .ics</button>
                  <a className="px-3 py-2 bg-blue-600 text-white rounded" href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent("Placement event")}`} target="_blank" rel="noreferrer">Open Google Calendar</a>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">Upcoming Events</h4>
                {events.length === 0 ? <div className="text-sm text-gray-500">No events yet</div> : (
                  <ul className="space-y-2">
                    {events.map(ev => <li key={ev.id} className="p-2 border rounded"><div className="font-medium">{ev.title}</div><div className="text-xs text-gray-500">{new Date(ev.date).toLocaleString()}</div><div className="text-sm">{ev.note}</div></li>)}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Community */}
          {activeTab === "community" && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Community & Notes</h2>
              <div className="bg-white p-4 rounded shadow mb-3">
                <textarea id="communityText" rows={4} className="w-full p-2 border rounded" placeholder="Share an interview experience or question..."></textarea>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => {
                    const v = document.getElementById("communityText").value;
                    if (!v.trim()) return alert("Write something first.");
                    setCommunityPosts(p => [{ type: "post", text: v, id: Date.now(), date: new Date().toLocaleString() }, ...p]);
                    document.getElementById("communityText").value = "";
                  }} className="px-3 py-2 bg-blue-600 text-white rounded">Post</button>
                  <button onClick={() => setCommunityPosts([])} className="px-3 py-2 bg-red-100 rounded">Clear demo posts</button>
                </div>
              </div>

              <div className="space-y-3">
                {communityPosts.length === 0 ? <div className="text-sm text-gray-500">No posts yet — share your experience!</div> : communityPosts.map(p => (
                  <div key={p.id} className="bg-white p-3 rounded shadow">
                    <div className="text-sm text-gray-800">{p.text || p.prompt?.title || "[mock attempt]"}</div>
                    <div className="text-xs text-gray-500 mt-1">{p.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* ---------------- Small child components used above ---------------- */

function NavButton({ id, label, icon: Icon, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2 px-3 py-2 rounded ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
      <Icon className="w-4 h-4" /> <span className="text-sm">{label}</span>
    </button>
  );
}

function AddEventForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="p-2 border rounded" />
      <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="p-2 border rounded" />
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="p-2 border rounded" />
      <div className="md:col-span-3 flex gap-2">
        <button onClick={() => { if (!title || !date) return alert("Title + date required"); onAdd(title, date, note); setTitle(""); setDate(""); setNote(""); }} className="px-3 py-2 bg-blue-600 text-white rounded">Add Event</button>
      </div>
    </div>
  );
}

/* Simple SVG bar chart for demo */
function SimpleBarChart({ data }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm"><div>{d.label}</div><div>{d.value}</div></div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div style={{ width: `${(d.value / max) * 100}%` }} className="h-2 bg-green-500 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

