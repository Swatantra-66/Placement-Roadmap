import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Square, Trophy, Target, TrendingUp, Book, Building, User, Moon, Sun, Star, Award, Clock, BarChart3, Users, FileText, MessageSquare, Settings, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const PlacementPrepApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState({
    name: 'Student',
    streak: 15,
    totalProblems: 127,
    xp: 2850,
    level: 8,
    lastActive: new Date().toISOString().split('T')[0]
  });

  // DSA Topics with problems
  const [dsaTopics, setDsaTopics] = useState({
    foundation: [
      { name: 'Arrays', completed: 45, total: 50, checked: false },
      { name: 'Strings', completed: 32, total: 40, checked: false },
      { name: 'Linked Lists', completed: 28, total: 35, checked: false },
      { name: 'Stacks & Queues', completed: 25, total: 30, checked: false }
    ],
    core: [
      { name: 'Trees', completed: 38, total: 50, checked: false },
      { name: 'Graphs', completed: 22, total: 45, checked: false },
      { name: 'Dynamic Programming', completed: 15, total: 60, checked: false },
      { name: 'Recursion', completed: 30, total: 35, checked: false }
    ],
    advanced: [
      { name: 'Segment Trees', completed: 8, total: 25, checked: false },
      { name: 'Trie', completed: 12, total: 20, checked: false },
      { name: 'Advanced Graphs', completed: 5, total: 30, checked: false }
    ]
  });

  // Company-wise questions
  const companies = [
    { name: 'Google', logo: '🔍', questions: 145, difficulty: 'Hard', color: 'bg-blue-500' },
    { name: 'Amazon', logo: '📦', questions: 198, difficulty: 'Medium', color: 'bg-orange-500' },
    { name: 'Microsoft', logo: '💻', questions: 167, difficulty: 'Medium', color: 'bg-green-500' },
    { name: 'Meta', logo: '👥', questions: 123, difficulty: 'Hard', color: 'bg-purple-500' },
    { name: 'Apple', logo: '🍎', questions: 89, difficulty: 'Medium', color: 'bg-gray-600' },
    { name: 'Netflix', logo: '🎬', questions: 76, difficulty: 'Hard', color: 'bg-red-500' }
  ];

  // Progress data for charts
  const progressData = [
    { name: 'Week 1', problems: 12, xp: 240 },
    { name: 'Week 2', problems: 18, xp: 360 },
    { name: 'Week 3', problems: 25, xp: 500 },
    { name: 'Week 4', problems: 22, xp: 440 },
    { name: 'Week 5', problems: 28, xp: 560 },
    { name: 'Week 6', problems: 22, xp: 440 }
  ];

  const phaseData = [
    { name: 'Foundation', completed: 65, total: 100, color: '#22c55e' },
    { name: 'Core DSA', completed: 45, total: 100, color: '#3b82f6' },
    { name: 'Advanced', completed: 25, total: 100, color: '#f59e0b' },
    { name: 'Interview', completed: 35, total: 100, color: '#ef4444' }
  ];

  // Badges and achievements
  const badges = [
    { name: 'Arrays Master', icon: '🎯', earned: true, xp: 500 },
    { name: '50 Problems', icon: '⭐', earned: true, xp: 300 },
    { name: '7 Day Streak', icon: '🔥', earned: true, xp: 200 },
    { name: 'Graph Explorer', icon: '🗺️', earned: false, xp: 400 },
    { name: 'DP Champion', icon: '🏆', earned: false, xp: 600 },
    { name: '100 Problems', icon: '💯', earned: false, xp: 500 }
  ];

  // Mock interviews
  const [mockInterviews, setMockInterviews] = useState([
    { id: 1, company: 'Google', date: '2024-09-08', score: 8.5, completed: true },
    { id: 2, company: 'Amazon', date: '2024-09-06', score: 7.2, completed: true },
    { id: 3, company: 'Microsoft', date: '2024-09-10', score: 0, completed: false }
  ]);

  // Goals
  const [goals, setGoals] = useState([
    { id: 1, text: 'Solve 3 problems daily', target: 3, current: 2, active: true },
    { id: 2, text: 'Complete Trees section', target: 50, current: 38, active: true },
    { id: 3, text: 'Practice mock interviews', target: 5, current: 2, active: true }
  ]);

  // HR Questions
  const hrQuestions = [
    "Tell me about yourself",
    "Why do you want to work here?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why are you leaving your current job?",
    "Describe a challenging project you worked on"
  ];

  // Resources
  const resources = {
    youtube: [
      { name: 'Striver DSA', url: 'https://youtube.com/@takeUforward', topics: ['DSA', 'CP'] },
      { name: 'Apna College', url: 'https://youtube.com/@ApnaCollegeOfficial', topics: ['DSA', 'Web Dev'] },
      { name: 'CodeWithHarry', url: 'https://youtube.com/@CodeWithHarry', topics: ['Programming', 'Web Dev'] }
    ],
    sheets: [
      { name: 'Striver SDE Sheet', problems: 191, difficulty: 'Medium-Hard' },
      { name: 'Love Babbar 450', problems: 450, difficulty: 'All Levels' },
      { name: 'Apna College Sheet', problems: 200, difficulty: 'Beginner-Medium' }
    ]
  };

  useEffect(() => {
    // Update streak logic
    const today = new Date().toISOString().split('T')[0];
    if (userData.lastActive !== today) {
      setUserData(prev => ({ ...prev, lastActive: today, streak: prev.streak + 1 }));
    }
  }, []);

  const toggleTopic = (phase, index) => {
    setDsaTopics(prev => ({
      ...prev,
      [phase]: prev[phase].map((topic, i) =>
        i === index ? { ...topic, checked: !topic.checked } : topic
      )
    }));
  };

  const addCustomGoal = () => {
    const text = prompt('Enter your goal:');
    const target = parseInt(prompt('Enter target number:'));
    if (text && target) {
      setGoals(prev => [...prev, {
        id: Date.now(),
        text,
        target,
        current: 0,
        active: true
      }]);
    }
  };

  const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active
        ? darkMode
          ? 'bg-blue-600 text-white'
          : 'bg-blue-500 text-white'
        : darkMode
          ? 'text-gray-300 hover:bg-gray-700'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const ProgressBar = ({ completed, total, color = 'bg-blue-500' }) => (
    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
      <div
        className={`${color} h-3 rounded-full transition-all duration-300`}
        style={{ width: `${(completed / total) * 100}%` }}
      />
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'text-blue-500' }) => (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{subtitle}</p>}
        </div>
        <Icon className={`${color} opacity-80`} size={32} />
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Target} title="Current Streak" value={`${userData.streak} days`} subtitle="Keep it up!" color="text-orange-500" />
        <StatCard icon={CheckSquare} title="Problems Solved" value={userData.totalProblems} subtitle="This month: 47" color="text-green-500" />
        <StatCard icon={Star} title="XP Points" value={userData.xp} subtitle={`Level ${userData.level}`} color="text-purple-500" />
        <StatCard icon={Trophy} title="Badges Earned" value={badges.filter(b => b.earned).length} subtitle={`/${badges.length} total`} color="text-yellow-500" />
      </div>

      {/* Phase Progress */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Phase Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phaseData.map((phase, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{phase.name}</span>
                <span className="text-sm font-medium">{phase.completed}%</span>
              </div>
              <ProgressBar completed={phase.completed} total={100} color={phase.color.replace('#', 'bg-[') + ']'} />
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Line type="monotone" dataKey="problems" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">XP Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Bar dataKey="xp" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTopics = () => (
    <div className="space-y-6">
      {Object.entries(dsaTopics).map(([phase, topics]) => (
        <div key={phase} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className="text-xl font-bold mb-4 capitalize">{phase} DSA</h3>
          <div className="grid gap-4">
            {topics.map((topic, index) => (
              <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTopic(phase, index)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {topic.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                  <div>
                    <h4 className="font-medium">{topic.name}</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {topic.completed}/{topic.total} problems completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 mb-1">
                    <ProgressBar completed={topic.completed} total={topic.total} />
                  </div>
                  <span className="text-sm font-medium">{Math.round((topic.completed / topic.total) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompanies = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company, index) => (
        <div key={index} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${company.color} text-white p-3 rounded-lg text-2xl`}>
              {company.logo}
            </div>
            <div>
              <h3 className="text-lg font-bold">{company.name}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{company.difficulty}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Questions Available</span>
              <span className="font-bold">{company.questions}</span>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Practice Questions
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      {/* Goals */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Daily Goals</h3>
          <button
            onClick={addCustomGoal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Goal
          </button>
        </div>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{goal.text}</span>
                <span className="text-sm">{goal.current}/{goal.target}</span>
              </div>
              <ProgressBar completed={goal.current} total={goal.target} />
            </div>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">This Week's Schedule</h3>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="space-y-2">
              <div className="font-medium text-sm">{day}</div>
              <div className={`p-2 rounded ${index < 5 ? 'bg-green-100 text-green-800' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {index < 5 ? '✓' : '—'}
              </div>
              <div className="text-xs">
                {index < 5 ? '3 problems' : 'Rest day'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInterview = () => (
    <div className="space-y-6">
      {/* Mock Interviews */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Mock Interviews</h3>
        <div className="space-y-4">
          {mockInterviews.map((interview) => (
            <div key={interview.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
              <div>
                <h4 className="font-medium">{interview.company} Interview</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{interview.date}</p>
              </div>
              <div className="flex items-center gap-4">
                {interview.completed ? (
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{interview.score}/10</div>
                    <div className="text-xs">Score</div>
                  </div>
                ) : (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Play size={16} />
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HR Questions */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">HR Questions Practice</h3>
        <div className="grid gap-3">
          {hrQuestions.map((question, index) => (
            <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between group`}>
              <span>{question}</span>
              <button className="opacity-0 group-hover:opacity-100 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-all">
                Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      {/* YouTube Channels */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">📺 YouTube Channels</h3>
        <div className="grid gap-4">
          {resources.youtube.map((channel, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
              <div>
                <h4 className="font-medium">{channel.name}</h4>
                <div className="flex gap-2 mt-1">
                  {channel.topics.map((topic) => (
                    <span key={topic} className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Visit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coding Sheets */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">📋 Coding Sheets</h3>
        <div className="grid gap-4">
          {resources.sheets.map((sheet, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
              <div>
                <h4 className="font-medium">{sheet.name}</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {sheet.problems} problems • {sheet.difficulty}
                </p>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Badges */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className={`p-4 rounded-lg text-center ${badge.earned ? 'bg-yellow-100 text-yellow-800' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className="font-medium text-sm">{badge.name}</div>
              <div className="text-xs">+{badge.xp} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* User Stats */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">📊 Your Statistics</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">{userData.totalProblems}</div>
            <div className="text-sm">Problems Solved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{userData.streak}</div>
            <div className="text-sm">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">{userData.xp}</div>
            <div className="text-sm">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{userData.level}</div>
            <div className="text-sm">Current Level</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-500" size={28} />
              <h1 className="text-xl font-bold">PlacementPrep Pro</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span>🔥 {userData.streak} day streak</span>
                <span>•</span>
                <span>⭐ Level {userData.level}</span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className={`mb-8 p-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex flex-wrap gap-2">
            <TabButton id="dashboard" icon={BarChart3} label="Dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
            <TabButton id="topics" icon={CheckSquare} label="Topics" active={activeTab === 'topics'} onClick={setActiveTab} />
            <TabButton id="companies" icon={Building} label="Companies" active={activeTab === 'companies'} onClick={setActiveTab} />
            <TabButton id="schedule" icon={Calendar} label="Schedule" active={activeTab === 'schedule'} onClick={setActiveTab} />
            <TabButton id="interview" icon={MessageSquare} label="Interview" active={activeTab === 'interview'} onClick={setActiveTab} />
            <TabButton id="resources" icon={Book} label="Resources" active={activeTab === 'resources'} onClick={setActiveTab} />
            <TabButton id="profile" icon={User} label="Profile" active={activeTab === 'profile'} onClick={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacementPrepApp;