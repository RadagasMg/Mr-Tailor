import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Briefcase, Globe, User, Settings, Archive, Search, Sparkles, Download, Copy, ChevronRight, Moon, Sun, Languages, Shield, Loader2, CheckCircle, AlertCircle, TrendingUp, Building2, ExternalLink, History, Zap, Target, FileCheck, Brain } from 'lucide-react';

const ResumeTailorApp = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard'); // UPDATED: Default to dashboard
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    gender: '',
    language: 'en',
    discourseType: 'professional'
  });
  const [masterCV, setMasterCV] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tailoredResults, setTailoredResults] = useState({
    resume: '',
    coverLetter: '',
    companyInsights: '',
    observations: []
  });
  const [history, setHistory] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [embellishmentLevel, setEmbellishmentLevel] = useState(5);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const fileInputRef = useRef(null);

  // First launch check
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [setupStep, setSetupStep] = useState(1);

  // UPDATED: Comprehensive useEffect for loading all data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedApiKey = localStorage.getItem('openai_api_key');
    const savedHistory = localStorage.getItem('applicationHistory');

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsFirstLaunch(false);
    }
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // --- NEW: AI and Helper Functions ---

  // OpenAI API Integration
  const callOpenAI = async (messages, systemPrompt = null) => {
    if (!apiKey) {
      throw new Error('API key not configured. Please add it in the Settings tab.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API call failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  };

  // Extract text from different file types
  const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      } else {
        reject(new Error('Unsupported file type. Please use .txt or .md files. For other types like PDF, copy-paste the text directly.'));
      }
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  // Process uploaded CV file
  const processCVFile = async (file) => {
    if (!file) return;
    setIsLoading(true);
    try {
      const text = await extractTextFromFile(file);
      const systemPrompt = `You are an expert CV formatter. Transform the provided CV text into a well-structured, professional format using markdown. Improve readability and structure. The candidate's name is ${profile.name}.`;
      const enhancedCV = await callOpenAI([{ role: 'user', content: `Format this CV:\n\n${text}` }], systemPrompt);
      setMasterCV(enhancedCV);
      await generateJobSuggestions(enhancedCV);
    } catch (error) {
      alert('Error processing CV: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate job suggestions based on CV
  const generateJobSuggestions = async (cvText) => {
    try {
      const systemPrompt = `Based on the provided CV, suggest 3 relevant job titles and company types. Return as a valid JSON array with objects containing "title" and "company" fields.`;
      const suggestions = await callOpenAI([{ role: 'user', content: `CV Content:\n\n${cvText}` }], systemPrompt);
      const parsed = JSON.parse(suggestions);
      setSuggestedJobs(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Error generating job suggestions:', error);
    }
  };

  // Web scraping simulation
  const scrapeJobUrl = async (url) => {
    alert('Web scraping requires a dedicated backend service to work reliably. For this prototype, please copy and paste the job description manually.');
  };
  
  // Utility functions for copy and download
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'), () => alert('Failed to copy.'));
  };

  const downloadAsFile = (content, filename) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  // Welcome/Setup Screen (No changes needed)
  const WelcomeScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {setupStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Welcome to Resume Tailor</h1>
                <p className="text-blue-100">Let's set up your profile for a personalized experience</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Choose Your Language</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['English', 'French', 'Chinese', 'Malagasy'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => setProfile({...profile, language: lang.toLowerCase()})}
                        className={`p-3 rounded-xl transition-all ${
                          profile.language === lang.toLowerCase()
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSetupStep(2)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {setupStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Set Up Your Profile</h2>
                <p className="text-blue-100">Tell us about yourself</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Screen Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Non-binary'].map(gender => (
                      <button
                        key={gender}
                        onClick={() => setProfile({...profile, gender})}
                        className={`p-3 rounded-xl transition-all ${
                          profile.gender === gender
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Document Style</label>
                  <select
                    value={profile.discourseType}
                    onChange={(e) => setProfile({...profile, discourseType: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="academic">Academic</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => {
                  localStorage.setItem('userProfile', JSON.stringify(profile));
                  setIsFirstLaunch(false);
                  setActiveTab('dashboard');
                }}
                disabled={!profile.name || !profile.gender}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Get Started <Sparkles className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main App Interface
  const MainApp = () => (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Resume Tailor
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'} hover:scale-110 transition-all`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-2">
                <User className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                  {profile.name || 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800/30' : 'bg-white/50'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Zap },
              { id: 'master-cv', label: 'Master CV', icon: FileText },
              { id: 'tailor', label: 'Tailor & Results', icon: Target },
              { id: 'history', label: 'History', icon: History },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : `${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'master-cv' && <MasterCVTab />}
        {activeTab === 'tailor' && <TailorTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );

  // Dashboard Tab (No functional changes)
  const DashboardTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-500">{masterCV ? '1' : '0'}</span>
          </div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Master CV</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {masterCV ? 'Ready to tailor' : 'Upload your CV'}
          </p>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-500">{history.length}</span>
          </div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Applications</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Total applications generated
          </p>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-500">AI</span>
          </div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Match Score</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Analysis by AI
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-2xl p-6 border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('master-cv')}
            className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all group"
          >
            <Upload className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} group-hover:scale-110 transition-transform`} />
            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload New CV</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tailor')}
            className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all group"
          >
            <Target className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'} group-hover:scale-110 transition-transform`} />
            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>Tailor Resume</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all group"
          >
            <Archive className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'} group-hover:scale-110 transition-transform`} />
            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>View History</span>
          </button>
        </div>
      </div>

      {/* Suggested Jobs */}
      {suggestedJobs.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Suggested Jobs</h2>
          <div className="space-y-3">
            {suggestedJobs.map((job, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.company}</p>
                </div>
                <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // UPDATED: Master CV Tab with real functionality
  const MasterCVTab = () => {
    const handleAIEnhance = async (type) => {
        if (!masterCV) {
            alert('Please upload or paste your CV first.');
            return;
        }
        setIsLoading(true);
        try {
            let systemPrompt = '';
            if (type === 'enhance') {
                systemPrompt = `You are an expert CV optimizer. Enhance the provided CV text, improving phrasing, impact, and clarity. Maintain the markdown structure.\n\nLanguage: ${profile.language}`;
            } else if (type === 'format') {
                systemPrompt = `You are a CV formatter. Re-format the provided CV text into a clean, professional markdown structure without changing the content.`;
            }
            const result = await callOpenAI([{ role: 'user', content: masterCV }], systemPrompt);
            setMasterCV(result);
        } catch (error) {
            alert('Error performing AI action: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="space-y-6 animate-fadeIn">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Master CV Management</h2>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.md"
              onChange={(e) => processCVFile(e.target.files?.[0])}
            />
            <button 
                onClick={() => downloadAsFile(masterCV, 'Master_CV.md')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Processing your CV with AI...</p>
          </div>
        ) : (
          <textarea
            value={masterCV}
            onChange={(e) => setMasterCV(e.target.value)}
            className={`w-full h-96 p-4 rounded-lg font-mono text-sm ${
              darkMode 
                ? 'bg-gray-900 text-gray-300 border-gray-700' 
                : 'bg-gray-50 text-gray-900 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Paste your CV here or upload a file..."
          />
        )}
        
        <div className="flex items-center gap-4 mt-4">
          <button 
            onClick={() => handleAIEnhance('format')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <FileCheck className="w-4 h-4" />
            Validate & Format
          </button>
          <button 
            onClick={() => handleAIEnhance('enhance')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <Brain className="w-4 h-4" />
            AI Enhance
          </button>
        </div>
      </div>
    </div>
    );
  };

  // UPDATED: Tailor Tab with real AI functionality
  const TailorTab = () => {
    const [activeResultTab, setActiveResultTab] = useState('resume');
    const [showObservations, setShowObservations] = useState(false);

    const handleTailor = async () => {
        if (!apiKey) {
            alert('Please configure your OpenAI API key in the Settings tab.');
            setActiveTab('settings');
            return;
        }
        setIsLoading(true);
        setShowObservations(false);
        setTailoredResults({ resume: '', coverLetter: '', companyInsights: '', observations: [] });

        try {
            const companyNameMatch = jobDescription.match(/company:\s*(.*)/i);
            const companyName = companyNameMatch ? companyNameMatch[1].trim() : 'the company';
            
            const positionMatch = jobDescription.match(/position:|title:\s*(.*)/i);
            const position = positionMatch ? positionMatch[1].trim() : 'the position';

            // 1. Generate Tailored Resume
            const resumeSystemPrompt = `You are a professional resume writer. Tailor the provided Master CV for a specific job description.
            - Analyze the job description for key skills and requirements.
            - Rephrase and reorder the CV content to highlight the most relevant experience.
            - Do NOT invent new experience. Embellish existing points based on an embellishment level of ${embellishmentLevel}/10.
            - Candidate: ${profile.name}. Language: ${profile.language}. Style: ${profile.discourseType}.
            - Output ONLY the tailored resume in Markdown format.`;
            const tailoredResume = await callOpenAI([{ role: 'user', content: `Master CV:\n\n${masterCV}\n\nJob Description:\n\n${jobDescription}` }], resumeSystemPrompt);

            // 2. Generate Cover Letter
            const coverLetterSystemPrompt = `You are a career coach writing a compelling cover letter.
            - Candidate: ${profile.name}, Gender: ${profile.gender}.
            - Addressed to "Hiring Manager" at ${companyName}.
            - Tailor based on the Master CV and Job Description. Tone: ${profile.discourseType}, Language: ${profile.language}. Embellishment: ${embellishmentLevel}/10.
            - Output ONLY the cover letter content.`;
            const coverLetter = await callOpenAI([{ role: 'user', content: `Master CV:\n\n${masterCV}\n\nJob Description:\n\n${jobDescription}` }], coverLetterSystemPrompt);

            // 3. Generate Company Insights
            const insightsSystemPrompt = `You are a business analyst. Based on the job description, provide brief company insights in Markdown (Company Name, Industry, Size, Culture).`;
            const companyInsights = await callOpenAI([{ role: 'user', content: `Job Description:\n\n${jobDescription}` }], insightsSystemPrompt);
            
            // 4. Generate Observations
            const observationsSystemPrompt = `Analyze the CV against the Job Description. Provide 3 brief observations as a valid JSON array of objects, each with a "type" ('success', 'info', 'warning') and a "message".`;
            const observationsText = await callOpenAI([{ role: 'user', content: `Master CV:\n\n${masterCV}\n\nJob Description:\n\n${jobDescription}` }], observationsSystemPrompt);
            
            let observations = [];
            try { observations = JSON.parse(observationsText); } catch { console.error("Failed to parse observations JSON"); }

            setTailoredResults({ resume: tailoredResume, coverLetter, companyInsights, observations });
            setShowObservations(true);

            // 5. Save to history
            const newHistoryItem = {
                id: new Date().toISOString(),
                company: companyName,
                position: position,
                date: new Date().toLocaleDateString(),
                status: 'generated',
            };
            const updatedHistory = [newHistoryItem, ...history];
            setHistory(updatedHistory);
            localStorage.setItem('applicationHistory', JSON.stringify(updatedHistory));

        } catch (error) {
            alert('Error tailoring documents: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
        {/* Input Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Job Details</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Job URL</label>
              <div className="flex gap-2">
                <input type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://company.com/job-posting" />
                <button onClick={() => scrapeJobUrl(jobUrl)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Job Description</label>
              <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                className={`w-full h-48 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Paste job description here..." />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Embellishment Level: {embellishmentLevel}</label>
              <input type="range" min="1" max="10" value={embellishmentLevel} onChange={(e) => setEmbellishmentLevel(parseInt(e.target.value))} className="w-full accent-blue-500" />
              <div className="flex justify-between text-xs mt-1">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Honest</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Creative</span>
              </div>
            </div>
            <button onClick={handleTailor} disabled={isLoading || !masterCV || !jobDescription}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Tailoring...</>) : (<><Sparkles className="w-5 h-5" />Tailor Documents</>)}
            </button>
          </div>
        </div>
        
        {/* Results Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Results</h2>
            <div className="flex gap-2">
              <button onClick={() => copyToClipboard(
                  activeResultTab === 'resume' ? tailoredResults.resume :
                  activeResultTab === 'coverLetter' ? tailoredResults.coverLetter : tailoredResults.companyInsights
              )} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={() => downloadAsFile(
                  activeResultTab === 'resume' ? tailoredResults.resume :
                  activeResultTab === 'coverLetter' ? tailoredResults.coverLetter : tailoredResults.companyInsights,
                  `${activeResultTab}.md`
              )} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {showObservations && tailoredResults.observations.length > 0 && (
            <div className="mb-4 space-y-2">
              {tailoredResults.observations.map((obs, index) => (
                <div key={index}
                  className={`flex items-start gap-2 p-3 rounded-lg ${ obs.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : obs.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {obs.type === 'warning' ? <AlertCircle className="w-4 h-4 mt-0.5" /> : <CheckCircle className="w-4 h-4 mt-0.5" />}
                  <span className="text-sm">{obs.message}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 mb-4">
            {[{id: 'resume', label: 'Resume'}, {id: 'coverLetter', label: 'Cover Letter'}, {id: 'insights', label: 'Company Insights'}].map(tab => (
              <button key={tab.id} onClick={() => setActiveResultTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${activeResultTab === tab.id ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}`}>
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className={`h-96 overflow-y-auto p-4 rounded-lg ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border`}>
            {isLoading && !tailoredResults.resume ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Generating tailored content...</p>
              </div>
            ) : (
              <pre className={`whitespace-pre-wrap font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {activeResultTab === 'resume' && (tailoredResults.resume || "Results will appear here...")}
                {activeResultTab === 'coverLetter' && tailoredResults.coverLetter}
                {activeResultTab === 'insights' && tailoredResults.companyInsights}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  // UPDATED: History Tab with real data and clear button
  const HistoryTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Application History</h2>
            <button onClick={() => {
                if (window.confirm('Are you sure you want to delete all history?')) {
                    setHistory([]);
                    localStorage.removeItem('applicationHistory');
                }
            }} className="px-4 py-2 text-sm bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                Clear History
            </button>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12">
            <Archive className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No applications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50' } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.company}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.position} • {item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // UPDATED: Settings Tab with real save functionality
  const SettingsTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-500" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>API Configuration</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>OpenAI API Key (Secured)</label>
            <div className="flex gap-2">
              <input type={showApiKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="sk-..." />
              <button onClick={() => setShowApiKey(!showApiKey)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} hover:opacity-80 transition-opacity`}>
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              Your API key is stored locally in your browser and is not sent to any server other than OpenAI's.
            </p>
          </div>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Profile Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`} />
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Language</label>
            <select value={profile.language} onChange={(e) => setProfile({...profile, language: e.target.value})}
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="en">English</option><option value="fr">French</option><option value="zh">Chinese</option><option value="mg">Malagasy</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Gender</label>
            <select value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value})}
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="Male">Male</option><option value="Female">Female</option><option value="Non-binary">Non-binary</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Document Style</label>
            <select value={profile.discourseType} onChange={(e) => setProfile({...profile, discourseType: e.target.value})}
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="professional">Professional</option><option value="creative">Creative</option><option value="academic">Academic</option><option value="technical">Technical</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('userProfile', JSON.stringify(profile));
            localStorage.setItem('openai_api_key', apiKey); // NEW
            alert('Settings saved successfully!');
          }}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );

  // Styles for animations
  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      {isFirstLaunch ? <WelcomeScreen /> : <MainApp />}
    </>
  );
};

export default ResumeTailorApp;
