'use client'

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar, BookOpen, Code, Trophy, Target, Clock, Download, Upload, BarChart3, Brain, Users, Building2, Timer, Star, FileText, TrendingUp } from 'lucide-react';

export default function PlacementRoadmap() {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeTab, setActiveTab] = useState('roadmap');
  const [studyStreak, setStudyStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);
  const [problemsSolved, setProblemsSolved] = useState({});
  const [studyNotes, setStudyNotes] = useState({});
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);
  const [companyProgress, setCompanyProgress] = useState({});
  const [timeSpent, setTimeSpent] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('placementProgress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedTasks(new Set(data.completedTasks || []));
          setProblemsSolved(data.problemsSolved || {});
          setStudyNotes(data.studyNotes || {});
          setBookmarkedProblems(data.bookmarkedProblems || []);
          setCompanyProgress(data.companyProgress || {});
          setStudyStreak(data.studyStreak || 0);
          setLastStudyDate(data.lastStudyDate);
        } catch (error) {
          console.error('Error loading saved progress:', error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = {
        completedTasks: Array.from(completedTasks),
        problemsSolved,
        studyNotes,
        bookmarkedProblems,
        companyProgress,
        studyStreak,
        lastStudyDate
      };
      localStorage.setItem('placementProgress', JSON.stringify(data));
    }
  }, [completedTasks, problemsSolved, studyNotes, bookmarkedProblems, companyProgress, studyStreak, lastStudyDate]);

  // Update streak logic
  useEffect(() => {
    if (completedTasks.size > 0) {
      const today = new Date().toDateString();
      if (lastStudyDate === today) {
        // Already studied today
      } else if (lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
        // Studied yesterday, increment streak
        setStudyStreak(prev => prev + 1);
        setLastStudyDate(today);
      } else if (lastStudyDate !== null && lastStudyDate !== today) {
        // Broke streak or first time
        setStudyStreak(1);
        setLastStudyDate(today);
      } else if (lastStudyDate === null) {
        // First time
        setStudyStreak(1);
        setLastStudyDate(today);
      }
    }
  }, [completedTasks, lastStudyDate]);

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    const today = new Date().toDateString();

    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      // Update streak on first completion of the day
      if (lastStudyDate !== today) {
        setLastStudyDate(today);
        setStudyStreak(prev => prev + 1);
      }
    }
    setCompletedTasks(newCompleted);
  };

  const updateProblemCount = (topicId, count) => {
    setProblemsSolved(prev => ({ ...prev, [topicId]: count }));
  };

  const addStudyNote = (topicId, note) => {
    setStudyNotes(prev => ({ ...prev, [topicId]: note }));
  };

  const addBookmark = (problem, difficulty, company) => {
    const newBookmark = {
      id: Date.now(),
      problem,
      difficulty,
      company,
      dateAdded: new Date().toLocaleDateString()
    };
    setBookmarkedProblems(prev => [...prev, newBookmark]);
  };

  const exportProgress = () => {
    const data = {
      completedTasks: Array.from(completedTasks),
      problemsSolved,
      studyNotes,
      bookmarkedProblems,
      studyStreak,
      companyProgress,
      timeSpent,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placement-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const phases = [
    {
      title: "Foundation Phase",
      duration: "3-4 weeks",
      description: "Build strong fundamentals",
      color: "bg-blue-500",
      tasks: [
        { id: 'array-basics', topic: 'Arrays', target: '40+ problems', details: 'Two pointers, sliding window, prefix sum', targetCount: 40 },
        { id: 'string-basics', topic: 'Strings', target: '25+ problems', details: 'Pattern matching, manipulation, palindromes', targetCount: 25 },
        { id: 'sorting', topic: 'Sorting & Searching', target: '20+ problems', details: 'Binary search variants, sorting algorithms', targetCount: 20 },
        { id: 'time-space', topic: 'Time & Space Complexity', target: 'Master Big O', details: 'Analyze and optimize solutions', targetCount: 10 }
      ]
    },
    {
      title: "Core DSA Phase",
      duration: "4-5 weeks",
      description: "Master essential data structures",
      color: "bg-green-500",
      tasks: [
        { id: 'linkedlist', topic: 'Linked Lists', target: '25+ problems', details: 'Reversal, cycle detection, merging', targetCount: 25 },
        { id: 'stacks-queues', topic: 'Stacks & Queues', target: '20+ problems', details: 'Monotonic stack, deque, priority queue', targetCount: 20 },
        { id: 'trees', topic: 'Binary Trees', target: '35+ problems', details: 'Traversals, BST, tree construction', targetCount: 35 },
        { id: 'hashing', topic: 'Hashing', target: '20+ problems', details: 'HashMap, frequency counting, two sum variants', targetCount: 20 }
      ]
    },
    {
      title: "Advanced Phase",
      duration: "3-4 weeks",
      description: "Tackle complex algorithms",
      color: "bg-purple-500",
      tasks: [
        { id: 'graphs', topic: 'Graphs', target: '25+ problems', details: 'DFS, BFS, shortest path, topological sort', targetCount: 25 },
        { id: 'dp', topic: 'Dynamic Programming', target: '30+ problems', details: '1D/2D DP, knapsack, LCS, LIS', targetCount: 30 },
        { id: 'recursion', topic: 'Recursion & Backtracking', target: '20+ problems', details: 'N-Queens, subsets, permutations', targetCount: 20 },
        { id: 'greedy', topic: 'Greedy Algorithms', target: '15+ problems', details: 'Activity selection, interval problems', targetCount: 15 }
      ]
    },
    {
      title: "Interview Prep Phase",
      duration: "2-3 weeks",
      description: "Mock interviews & system design",
      color: "bg-red-500",
      tasks: [
        { id: 'mock-coding', topic: 'Mock Coding Interviews', target: '10+ sessions', details: 'Practice with timer, explain approach', targetCount: 10 },
        { id: 'system-design', topic: 'Basic System Design', target: '5+ concepts', details: 'Scalability, databases, APIs', targetCount: 5 },
        { id: 'behavioral', topic: 'Behavioral Questions', target: 'STAR method', details: 'Leadership, teamwork, challenges', targetCount: 8 },
        { id: 'company-prep', topic: 'Company-Specific Prep', target: '5+ companies', details: 'Past questions, company culture', targetCount: 5 }
      ]
    }
  ];

  const companies = [
    { name: 'Google', difficulty: 'Hard', focus: 'Algorithms, System Design' },
    { name: 'Microsoft', difficulty: 'Medium-Hard', focus: 'Problem Solving, Coding' },
    { name: 'Amazon', difficulty: 'Medium', focus: 'Leadership, Scalability' },
    { name: 'Meta', difficulty: 'Hard', focus: 'Data Structures, Optimization' },
    { name: 'Apple', difficulty: 'Medium-Hard', focus: 'Innovation, Technical Depth' },
    { name: 'Netflix', difficulty: 'Hard', focus: 'Culture Fit, Technical Excellence' }
  ];

  const calculateProgress = () => {
    const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
    const completed = completedTasks.size;
    return Math.round((completed / totalTasks) * 100);
  };

  const calculateTotalProblems = () => {
    return Object.values(problemsSolved).reduce((sum, count) => sum + (count || 0), 0);
  };

  const getWeakAreas = () => {
    const allTasks = phases.flatMap(phase => phase.tasks);
    return allTasks
      .filter(task => !completedTasks.has(task.id) && (problemsSolved[task.id] || 0) < task.targetCount * 0.5)
      .slice(0, 3);
  };

  const renderRoadmap = () => (
    <div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{calculateProgress()}%</div>
            <div className="text-sm opacity-90">Overall Progress</div>
          </div>
          <div>
            <Target className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{calculateTotalProblems()}</div>
            <div className="text-sm opacity-90">Problems Solved</div>
          </div>
          <div>
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{studyStreak}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {phases.map((phase, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg cursor-pointer transition-all ${currentPhase === index ? 'ring-2 ring-blue-400' : ''
              } ${phase.color} text-white`}
            onClick={() => setCurrentPhase(index)}
          >
            <h3 className="font-bold text-lg mb-1">{phase.title}</h3>
            <p className="text-sm opacity-90 mb-2">{phase.duration}</p>
            <p className="text-xs">{phase.description}</p>
            <div className="mt-2 text-xs">
              {phase.tasks.filter(task => completedTasks.has(task.id)).length}/{phase.tasks.length} completed
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">{phases[currentPhase].title}</h2>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {phases[currentPhase].duration}
          </span>
        </div>

        <div className="grid gap-4">
          {phases[currentPhase].tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-start">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mr-3 mt-1 flex-shrink-0"
                >
                  {completedTasks.has(task.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${completedTasks.has(task.id) ? 'text-green-600 line-through' : 'text-gray-800'
                      }`}>
                      {task.topic}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {problemsSolved[task.id] || 0}/{task.targetCount}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={task.targetCount}
                        value={problemsSolved[task.id] || 0}
                        onChange={(e) => updateProblemCount(task.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs border rounded"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.details}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min(((problemsSolved[task.id] || 0) / task.targetCount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <textarea
                    placeholder="Add your notes for this topic..."
                    value={studyNotes[task.id] || ''}
                    onChange={(e) => addStudyNote(task.id, e.target.value)}
                    className="w-full mt-2 p-2 text-xs border rounded resize-none"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Your Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Strong Areas</h3>
            <div className="space-y-1 text-sm">
              {phases.flatMap(phase => phase.tasks)
                .filter(task => completedTasks.has(task.id))
                .slice(0, 3)
                .map(task => (
                  <div key={task.id} className="text-green-700">✓ {task.topic}</div>
                ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Needs Improvement</h3>
            <div className="space-y-1 text-sm">
              {getWeakAreas().map(task => (
                <div key={task.id} className="text-yellow-700">
                  ⚡ {task.topic} ({problemsSolved[task.id] || 0}/{task.targetCount})
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Study Stats</h3>
            <div className="space-y-1 text-sm text-blue-700">
              <div>📅 Current Streak: {studyStreak} days</div>
              <div>🎯 Problems Solved: {calculateTotalProblems()}</div>
              <div>📊 Completion: {calculateProgress()}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Problem Bookmarks
        </h3>
        <div className="grid gap-3">
          <div className="flex gap-2 mb-3">
            <input
              placeholder="Problem name"
              className="flex-1 px-3 py-2 border rounded"
              id="bookmark-problem"
            />
            <select className="px-3 py-2 border rounded" id="bookmark-difficulty">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              placeholder="Company"
              className="px-3 py-2 border rounded"
              id="bookmark-company"
            />
            <button
              onClick={() => {
                const problem = document.getElementById('bookmark-problem').value;
                const difficulty = document.getElementById('bookmark-difficulty').value;
                const company = document.getElementById('bookmark-company').value;
                if (problem) {
                  addBookmark(problem, difficulty, company);
                  document.getElementById('bookmark-problem').value = '';
                  document.getElementById('bookmark-company').value = '';
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {bookmarkedProblems.map((bookmark) => (
              <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border-l-4 border-blue-500 mb-2">
                <div>
                  <div className="font-medium">{bookmark.problem}</div>
                  <div className="text-sm text-gray-600">
                    {bookmark.company} • {bookmark.difficulty} • {bookmark.dateAdded}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Building2 className="w-6 h-6 mr-2" />
          Target Companies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{company.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${company.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                  company.difficulty === 'Medium-Hard' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                  {company.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{company.focus}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Problems Practiced:</span>
                <input
                  type="number"
                  min="0"
                  value={companyProgress[company.name] || 0}
                  onChange={(e) => setCompanyProgress(prev => ({
                    ...prev,
                    [company.name]: parseInt(e.target.value) || 0
                  }))}
                  className="w-16 px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2" />
        Study Schedule
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <div key={day} className="border rounded-lg p-4">
            <h3 className="font-semibold text-center mb-3">{day}</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-100 p-2 rounded">
                <div className="font-medium">9:00-11:00 AM</div>
                <div>DSA Practice</div>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <div className="font-medium">2:00-4:00 PM</div>
                <div>Mock Interview</div>
              </div>
              <div className="bg-purple-100 p-2 rounded">
                <div className="font-medium">7:00-8:00 PM</div>
                <div>Review & Notes</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Advanced Placement Prep Dashboard</h1>
          <p className="text-lg text-gray-600">Complete tracking system for your campus placement journey</p>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={exportProgress}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
              Export Progress
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { id: 'roadmap', label: 'Roadmap', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'companies', label: 'Companies', icon: Building2 },
            { id: 'schedule', label: 'Schedule', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'roadmap' && renderRoadmap()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'companies' && renderCompanies()}
        {activeTab === 'schedule' && renderSchedule()}
      </div>
    </div>
  );
}