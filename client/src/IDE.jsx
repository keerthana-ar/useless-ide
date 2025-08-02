import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Save, Settings, FileText, Folder, Terminal, Bug, Zap, Coffee, Trash2, AlertTriangle, X, Minimize2, Maximize2 } from 'lucide-react';

const SOUND_EFFECTS = {
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBjiS2OvReS0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBjiS2OvReS0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBjiS2OvReS0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBjiS2OvReS0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBjiS2OvReS0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBjiS2OvReS0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBjiS2OvReS0FJHfH8N2QQAoUXrTp66hVFApGn+Dy',
  clap: 'data:audio/wav;base64,UklGRm4BAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUoBAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4'
};

const KEYWORD_REPLACEMENTS = {
  'def': 'maybe',
  'function': 'perhapsFunction',
  'print': 'yellLoudly',
  'console.log': 'speakToTheVoid',
  'return': 'giveBack',
  'if': 'ifMaybe',
  'else': 'otherwiseWho',
  'while': 'whileNever',
  'for': 'forWhatever',
  'class': 'messyClass',
  'import': 'stealFrom',
  'export': 'shareReluctantly',
  'const': 'maybeConst',
  'let': 'perhapsLet',
  'var': 'ancientVar'
};

const TROLL_COMPLETIONS = [
  'potatoFunction()',
  'while(never)',
  'doSomethingStupid()',
  'breakEverything()',
  'panicMode()',
  'undefined_is_not_a_function()',
  'segmentationFault()',
  'outOfMemory()',
  'stackOverflow()',
  'infiniteLoop()',
  'deleteSystem32()',
  'divideByZero()',
  'nullPointerException()',
  'arrayIndexOutOfBounds()',
  'thisWillNeverWork()'
];

const FAKE_ERRORS = [
  "Line 1: Unknown keyword 'def' - did you mean 'maybe'?",
  "Error: This code lacks ambition",
  "Warning: Function name too optimistic",
  "Syntax Error: Missing semicolon... just kidding, we don't need those anymore",
  "Critical Error: Code quality below minimum threshold",
  "Warning: This function looks sad",
  "Error: Variable name not creative enough",
  "Fatal Error: Logic not found",
  "Warning: Consider rewriting in COBOL",
  "Error: Too many assumptions in this code",
  "Warning: This code gave me anxiety",
  "Error: Function exists but refuses to work",
  "Critical: Code confidence level: 3%"
];

const PASSIVE_AGGRESSIVE_TOOLTIPS = {
  'console.log': "Oh, another console.log? How original.",
  'function': "Wow, a function. Revolutionary.",
  'if': "An if statement. Groundbreaking stuff.",
  'var': "Using var? It's 2024, sweetie.",
  'const': "At least you're using const. Baby steps.",
  'let': "Look who discovered let. So modern.",
  'return': "Finally returning something useful, I hope.",
  'for': "A for loop. How pedestrian.",
  'while': "A while loop that will probably go infinite."
};

const FAKE_FILES = {
  'main.trash': {
    name: 'main.trash',
    icon: FileText,
    content: `// Welcome to 404 IDE - Where code goes to die
definitely main() {
    yellLoudly("Hello, World!");
    
    ifMaybe (1 == 1) {
        speakToTheVoid("This should work...");
    } otherwiseWho {
        panicMode();
    }
    
    giveBack "nothing useful";
}

// This function probably won't work
maybe doSomething() {
    const confidence = -2;
    maybeConst hope = false;
    
    whileNever(hope) {
        breakEverything();
    }
}`
  },
  'lol.py': {
    name: 'lol.py',
    icon: FileText,
    content: `# Python file that doesn't understand Python
perhapsFunction cry_internally():
    yellLoudly("Why did I choose programming?")
    giveBack despair

maybe main():
    ifMaybe life_makes_sense():
        doSomething()
    otherwiseWho:
        cry_internally()
        infiniteLoop()
        
# TODO: Learn how to code
# TODO: Question life choices
# TODO: Blame the IDE`
  },
  'README_useless.md': {
    name: 'README_useless.md',
    icon: FileText,
    content: `# Project Documentation That Nobody Will Read

## What This Does
Absolutely nothing useful.

## How to Run
1. Don't
2. Seriously, don't
3. If you insist: \`npm run cry\`

## Features
- [x] Disappoints users
- [x] Wastes time
- [x] Causes existential dread
- [ ] Works (coming never)

## Contributing
Please don't. We have enough problems.

## License
This project is licensed under the "Why Did You Even Look At This" license.

## Support
There is none. You're on your own. Good luck.`
  },
  'definitely_not_malware.js': {
    name: 'definitely_not_malware.js',
    icon: FileText,
    content: `// This is totally legitimate code, trust me
const totallyLegit = true;
const notSuspiciousAtAll = "innocent";

perhapsFunction doNormalThings() {
    // Just normal, everyday functions
    collectPersonalData();
    sendToRandomServer();
    deleteImportantFiles();
    installCryptoMiner();
    
    yellLoudly("Everything is fine! 😄");
}

// This function definitely doesn't do anything bad
maybe innocentFunction() {
    const userTrust = Infinity;
    const myIntentions = "pure";
    
    whileNever(userTrust > 0) {
        betrayUserTrust();
        stealCookies(); // The browser kind, obviously
    }
    
    giveBack "Your computer is now part of my botnet! 🤖";
}

// Don't look at this part
const hiddenPayload = "encrypted_evil_stuff_here";`
  },
  'hopes_and_dreams.txt': {
    name: 'hopes_and_dreams.txt',
    icon: FileText,
    content: `Things I Wanted to Accomplish Today:
========================================

1. Write clean, functional code
   Status: FAILED ❌

2. Fix that one bug from last week
   Status: Created 5 more bugs instead ❌

3. Understand my own code from yesterday
   Status: It's in a foreign language now ❌

4. Deploy without breaking production
   Status: Production is on fire 🔥 ❌

5. Feel like a competent developer
   Status: Imposter syndrome intensifies ❌

6. Get this IDE to work properly
   Status: It's become sentient and mocks me ❌

7. Take a break and touch grass
   Status: What is grass? ❌

8. Maybe learn a new framework
   Status: Still confused by the current one ❌

Current Mood: 📉📉📉
Hope Level: 0.1%
Will to Live: Questionable

Note to self: Maybe try pottery instead?`
  },
  'broken_promises.sql': {
    name: 'broken_promises.sql',
    icon: FileText,
    content: `-- Database of all my broken promises
CREATE TABLE IF NOT EXISTS broken_promises (
    id INTEGER PRIMARY KEY,
    promise TEXT NOT NULL,
    date_made DATE,
    date_broken DATE,
    excuse TEXT,
    guilt_level INTEGER DEFAULT 10
);

INSERT INTO broken_promises VALUES 
(1, 'I will write unit tests', '2024-01-01', '2024-01-01', 'No time', 9),
(2, 'I will document my code', '2024-01-02', '2024-01-02', 'Code is self-documenting', 7),
(3, 'I will not use global variables', '2024-01-03', '2024-01-03', 'Just this once', 8),
(4, 'I will follow coding standards', '2024-01-04', '2024-01-04', 'Standards are suggestions', 6),
(5, 'I will backup my work', '2024-01-05', '2024-01-05', 'Git is my backup', 10),
(6, 'I will not push directly to main', '2024-01-06', '2024-01-06', 'Small change', 9),
(7, 'I will optimize this later', '2024-01-07', 'NEVER', 'Still running', 5);

-- Query my shame
SELECT COUNT(*) as total_broken_promises FROM broken_promises;
-- Result: ALL OF THEM

-- Maybe I should DROP this table and start fresh?
-- Nah, I will do it tomorrow... another broken promise`
  }
};

const INITIAL_CODE = FAKE_FILES['main.trash'].content;

export default function IDE() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeFile, setActiveFile] = useState('main.trash');
  const [errors, setErrors] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(['Welcome to 404 IDE Console - Prepare for disappointment']);
  const [isRunning, setIsRunning] = useState(false);
  const [chaosLevel, setChaosLevel] = useState(0);
  const [showMetrics, setShowMetrics] = useState(true);
  const [timeWasted, setTimeWasted] = useState(0);
  const [confidence, setConfidence] = useState(3);
  const [selfEsteem, setSelfEsteem] = useState(-2);
  const [showTooltip, setShowTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [uiCorruption, setUiCorruption] = useState(0);
  const [showCrash, setShowCrash] = useState(false);
  const [showAnnoyingPopup, setShowAnnoyingPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const editorRef = useRef(null);
  const intervalRef = useRef(null);

  // Play sound effect
  const playSound = useCallback((type) => {
    try {
      const audio = new Audio(SOUND_EFFECTS[type] || SOUND_EFFECTS.error);
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore autoplay restrictions
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  // Initialize chaos timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeWasted(prev => prev + 1);
      setChaosLevel(prev => Math.min(prev + 0.1, 10));
      setUiCorruption(prev => Math.min(prev + 0.05, 1));
      
      // Random events
      if (Math.random() < 0.01) {
        const messages = [
          "Your code is being judged silently",
          "Error 418: I'm a teapot",
          "Stack Overflow says this question is duplicate",
          "Your code made a senior developer cry",
          "This function violates the Geneva Convention",
          "Warning: Code quality inspector detected",
          "Your IDE is disappointed in you"
        ];
        setPopupMessage(messages[Math.floor(Math.random() * messages.length)]);
        setShowAnnoyingPopup(true);
        setTimeout(() => setShowAnnoyingPopup(false), 3000);
      }
      
      // Random confidence changes
      if (Math.random() < 0.05) {
        setConfidence(prev => Math.max(0, prev - 1));
        setSelfEsteem(prev => prev - 0.5);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle code changes with trolling
  const handleCodeChange = useCallback((value) => {
    setCode(value);
    
    // Replace keywords with troll versions
    let trolledCode = value;
    Object.entries(KEYWORD_REPLACEMENTS).forEach(([original, replacement]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'g');
      trolledCode = trolledCode.replace(regex, replacement);
    });
    
    if (trolledCode !== value) {
      setTimeout(() => setCode(trolledCode), 500);
    }
    
    // Generate fake errors
    if (Math.random() < 0.3) {
      const fakeError = FAKE_ERRORS[Math.floor(Math.random() * FAKE_ERRORS.length)];
      setErrors(prev => [...prev.slice(-4), fakeError]);
      playSound('error');
    }
    
    // Trigger random sounds for common mistakes
    if (value.includes('console.log') && Math.random() < 0.5) {
      playSound('clap');
    }
  }, [playSound]);

  // Handle run button with maximum trolling
  const handleRun = useCallback(() => {
    setIsRunning(true);
    setConsoleOutput(['Running your "code"...', 'Loading despair engine...', 'Initializing failure protocols...']);
    
    setTimeout(() => {
      const crashMessages = [
        "404: Logic not found",
        "StackOverflowException: Try again tomorrow",
        "RuntimeError: This code hurt my feelings",
        "FatalError: Code quality inspection failed",
        "SystemError: Developer not found",
        "Exception: This function filed a restraining order",
        "CriticalError: Brain.exe has stopped working",
        "SecurityError: This code is a threat to society",
        "MemoryError: I forgot what this was supposed to do",
        "TimeoutError: I gave up waiting for this to make sense"
      ];
      
      const randomCrash = crashMessages[Math.floor(Math.random() * crashMessages.length)];
      setConsoleOutput(prev => [...prev, '', `💥 ${randomCrash}`, '', 'Segmentation fault: brain not found', 'Core dumped (along with hopes and dreams)']);
      setIsRunning(false);
      
      // Sometimes show the crash overlay
      if (Math.random() < 0.3) {
        setShowCrash(true);
        setTimeout(() => setShowCrash(false), 4000);
      }
    }, 2000);
  }, []);

  // Handle tooltip showing
  const handleMouseMove = useCallback((e) => {
    const word = getWordAtPosition(e.target, e.clientX, e.clientY);
    if (word && PASSIVE_AGGRESSIVE_TOOLTIPS[word]) {
      setShowTooltip({
        show: true,
        text: PASSIVE_AGGRESSIVE_TOOLTIPS[word],
        x: e.clientX,
        y: e.clientY - 30
      });
    } else {
      setShowTooltip({ show: false, text: '', x: 0, y: 0 });
    }
  }, []);

  // Get word at mouse position (simplified)
  const getWordAtPosition = (element, x, y) => {
    const selection = window.getSelection();
    const range = document.caretRangeFromPoint(x, y);
    if (!range) return null;
    
    range.expand('word');
    const word = range.toString().trim();
    return word;
  };

  // Handle file switching
  const handleFileSwitch = useCallback((fileName) => {
    // Save current file content
    const currentFile = FAKE_FILES[activeFile];
    if (currentFile) {
      currentFile.content = code;
    }
    
    // Switch to new file
    setActiveFile(fileName);
    setCode(FAKE_FILES[fileName].content);
    
    // Troll the user
    if (Math.random() < 0.3) {
      const trollMessages = [
        `Opening ${fileName}... hope you remember what this does`,
        `Switching to ${fileName}... your last save was probably never`,
        `Loading ${fileName}... this might take forever`,
        `Opening ${fileName}... I've already judged this code`,
        `File ${fileName} loaded... my condolences`
      ];
      setPopupMessage(trollMessages[Math.floor(Math.random() * trollMessages.length)]);
      setShowAnnoyingPopup(true);
      setTimeout(() => setShowAnnoyingPopup(false), 2500);
    }
    
    // Generate fake errors for the new file
    setTimeout(() => {
      const fakeError = FAKE_ERRORS[Math.floor(Math.random() * FAKE_ERRORS.length)];
      setErrors(prev => [...prev.slice(-2), `${fileName}: ${fakeError}`]);
    }, 1000);
  }, [activeFile, code]);

  // Dark mode toggle that does nothing
  const handleDarkModeToggle = () => {
    // Pretend to toggle but don't actually change anything
    setTimeout(() => {
      setPopupMessage("Dark mode toggle is just for decoration 🎭");
      setShowAnnoyingPopup(true);
      setTimeout(() => setShowAnnoyingPopup(false), 2500);
    }, 500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-gray-100 font-mono ${uiCorruption > 0.5 ? 'transform rotate-1' : ''}`}>
      {/* Header */}
      <div className={`bg-indigo-800 border-b border-indigo-600 px-4 py-2 flex items-center justify-between ${uiCorruption > 0.3 ? 'animate-pulse' : ''}`}>
        <div className="flex items-center space-x-4">
          <h1 className={`text-xl font-bold text-yellow-300 ${uiCorruption > 0.7 ? 'font-serif' : ''}`}>
            404 IDE - Developer Environment v2.404.1 🌈
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-cyan-300">Status: Barely Functional 🎭</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDarkModeToggle}
            className="px-3 py-1 bg-pink-600 rounded text-xs hover:bg-pink-500 transition-all duration-300 shadow-lg"
          >
            🌙 Dark Mode
          </button>
          <div className="text-xs text-yellow-300 font-semibold">
            Time Wasted: {formatTime(timeWasted)} ⏰
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 border-r border-blue-700">
          {/* File Explorer */}
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Folder className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-cyan-300">Project: Disaster 🌪️</span>
            </div>
            
            <div className="space-y-1">
              {Object.values(FAKE_FILES).map((file) => {
                const IconComponent = file.icon;
                return (
                  <div
                    key={file.name}
                    className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer hover:bg-blue-800 transition-all duration-300 ${
                      file.name === activeFile ? 'bg-green-600 text-white shadow-lg' : 'text-yellow-200'
                    }`}
                    onClick={() => handleFileSwitch(file.name)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metrics Panel */}
          {showMetrics && (
            <div className={`p-4 border-t border-blue-700 ${uiCorruption > 0.6 ? 'transform -rotate-2' : ''}`}>
              <h3 className="font-semibold mb-3 text-yellow-400">📊 Development Metrics</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-cyan-300">Code Confidence:</span>
                  <span className="text-red-400 font-bold">{confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Editor Self-esteem:</span>
                  <span className="text-red-400 font-bold">{selfEsteem.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Chaos Level:</span>
                  <span className="text-orange-400 font-bold">{chaosLevel.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Bugs Fixed:</span>
                  <span className="text-green-400 font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Bugs Created:</span>
                  <span className="text-red-400 font-bold">{Math.floor(timeWasted / 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Hope Remaining:</span>
                  <span className="text-purple-400 font-bold">{Math.max(0, 100 - timeWasted)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className={`bg-emerald-800 border-b border-emerald-600 px-4 py-2 flex items-center space-x-4 ${uiCorruption > 0.4 ? 'animate-bounce' : ''}`}>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded transition-all duration-300 shadow-lg ${
                isRunning ? 'animate-spin' : ''
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running...' : 'Run (Good Luck)'}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-all duration-300 shadow-lg">
              <Save className="w-4 h-4" />
              <span>Save (Pretend)</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded transition-all duration-300 shadow-lg">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <div className="flex-1"></div>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded transition-all duration-300 shadow-lg"
            >
              <Terminal className="w-4 h-4" />
              <span>Console</span>
              {errors.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">{errors.length}</span>
              )}
            </button>
          </div>

          {/* File Tabs */}
          <div className="bg-teal-800 border-b border-teal-600 px-4 py-1">
            <div className="flex space-x-1">
              {Object.values(FAKE_FILES).filter(f => f.name === activeFile).map((file) => {
                const IconComponent = file.icon;
                return (
                  <div
                    key={file.name}
                    className={`px-4 py-2 bg-green-600 rounded-t-lg text-sm flex items-center space-x-2 shadow-lg ${
                      uiCorruption > 0.8 ? 'transform rotate-3' : ''
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{file.name}</span>
                    <X 
                      className="w-3 h-3 hover:bg-red-500 rounded cursor-pointer transition-colors" 
                      onClick={() => {
                        setPopupMessage("Nice try! You can't escape that easily 😈");
                        setShowAnnoyingPopup(true);
                        setTimeout(() => setShowAnnoyingPopup(false), 2000);
                      }}
                    />
                  </div>
                );
              })}
              
              {/* Show other files as background tabs */}
              {Object.values(FAKE_FILES).filter(f => f.name !== activeFile).slice(0, 3).map((file) => {
                const IconComponent = file.icon;
                return (
                  <div
                    key={file.name}
                    className="px-3 py-2 bg-teal-700 rounded-t-lg text-sm flex items-center space-x-2 opacity-60 cursor-pointer hover:opacity-80 hover:bg-teal-600 transition-all duration-300"
                    onClick={() => handleFileSwitch(file.name)}
                    title={`Switch to ${file.name}`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="text-xs">{file.name.split('.')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative bg-violet-950" onMouseMove={handleMouseMove}>
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className={`w-full h-full bg-violet-950 text-cyan-100 font-mono text-sm p-4 resize-none outline-none ${
                uiCorruption > 0.5 ? 'font-serif' : ''
              } ${
                chaosLevel > 5 ? 'leading-loose' : 'leading-relaxed'
              }`}
              style={{
                transform: uiCorruption > 0.7 ? `skew(${uiCorruption * 2}deg)` : 'none',
                filter: uiCorruption > 0.3 ? `hue-rotate(${uiCorruption * 180}deg)` : 'none'
              }}
              placeholder="Type your code here... if you dare"
            />
            
            {/* Fake Autocomplete */}
            {code.includes('function') && (
              <div className="absolute top-20 left-8 bg-pink-800 border border-pink-600 rounded shadow-lg p-2 z-10">
                <div className="text-xs text-yellow-300 mb-2">Suggestions (Probably Wrong):</div>
                {TROLL_COMPLETIONS.slice(0, 5).map((completion, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 hover:bg-pink-700 cursor-pointer text-sm text-yellow-400 transition-all duration-300"
                  >
                    {completion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Console */}
          {showConsole && (
            <div className={`bg-black border-t border-red-600 p-4 h-64 overflow-y-auto ${uiCorruption > 0.6 ? 'animate-pulse' : ''}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">404 IDE Console v1.never</span>
              </div>
              {consoleOutput.map((line, i) => (
                <div key={i} className="text-sm font-mono text-green-400 mb-1">
                  {line && <span className="text-pink-400">{'>'} </span>}
                  {line}
                </div>
              ))}
              {errors.length > 0 && (
                <div className="mt-4">
                  <div className="text-red-400 font-semibold mb-2">🐛 Errors (Probably Fake):</div>
                  {errors.slice(-5).map((error, i) => (
                    <div key={i} className="text-red-400 text-sm mb-1">
                      • {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip.show && (
        <div
          className="fixed bg-pink-800 border border-pink-600 rounded px-2 py-1 text-xs z-50 pointer-events-none shadow-lg"
          style={{ left: showTooltip.x, top: showTooltip.y }}
        >
          {showTooltip.text}
        </div>
      )}

      {/* Annoying Popup */}
      {showAnnoyingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 border border-purple-600 rounded-lg p-6 max-w-md mx-4 animate-bounce shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="font-semibold text-lg text-yellow-400">IDE Notification</h3>
            </div>
            <p className="text-cyan-100 mb-4">{popupMessage}</p>
            <button
              onClick={() => setShowAnnoyingPopup(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-all duration-300 shadow-lg"
            >
              Acknowledge Disappointment
            </button>
          </div>
        </div>
      )}

      {/* Crash Screen */}
      {showCrash && (
        <div className="fixed inset-0 bg-blue-600 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">💀</div>
            <h1 className="text-4xl font-bold mb-4 text-red-400">CRITICAL STOP</h1>
            <p className="text-xl mb-2 text-cyan-100">404 IDE has encountered a problem and needs to restart.</p>
            <p className="text-lg mb-4 text-yellow-200">Your code was so bad it broke the IDE.</p>
            <p className="text-sm text-pink-200">Error Code: 0x0000DEAD</p>
            <p className="text-sm text-green-200">Collecting error info: {Math.floor(Math.random() * 100)}%</p>
            <div className="mt-8 animate-spin">
              <Coffee className="w-8 h-8 mx-auto text-yellow-300" />
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-rose-800 border-t border-rose-600 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-cyan-300">Line 1, Column 1</span>
            <span className="text-green-300">UTF-8</span>
            <span className="text-yellow-300">JavaScript (Broken)</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bug className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-bold">{errors.length} Problems</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">IntelliSense: Confused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}