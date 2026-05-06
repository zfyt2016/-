/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Map as MapIcon, 
  Settings, 
  Star, 
  Trophy, 
  Mic, 
  Volume2, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Bookmark,
  Sparkles,
  Heart
} from 'lucide-react';
import { WORDS, LEVELS } from './data';
import { Word, Level, ExerciseType, UserProgress } from './types';

// Constants for styling
const COLORS = {
  primary: '#4F46E5', // Indigo
  secondary: '#F59E0B', // Amber
  accent: '#10B981', // Emerald
  background: '#FDFCF6', // Warm off-white
  card: '#FFFFFF',
  text: '#1F2937',
};

export default function App() {
  const [currentView, setCurrentView] = useState<'map' | 'study' | 'practice' | 'bookmarks'>('map');
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [exerciseType, setExerciseType] = useState<ExerciseType>(ExerciseType.ENGLISH_TO_CHINESE);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('english_master_progress') : null;
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      completedLevels: [],
      bookmarkedWords: [],
      lastStudyDate: new Date().toISOString(),
    };
  });

  const unlockedLevels = useMemo<Level[]>(() => {
    return LEVELS.map(l => ({
      ...l,
      unlocked: l.id === 'l1' || progress.completedLevels.includes(l.id) || 
                (LEVELS[LEVELS.findIndex(level => level.id === l.id) - 1]?.id && 
                 progress.completedLevels.includes(LEVELS[LEVELS.findIndex(level => level.id === l.id) - 1].id))
    }));
  }, [progress.completedLevels]);

  useEffect(() => {
    localStorage.setItem('english_master_progress', JSON.stringify(progress));
  }, [progress]);

  const selectedLevel = useMemo(() => 
    LEVELS.find(l => l.id === selectedLevelId), 
    [selectedLevelId]
  );

  const levelWords = useMemo(() => 
    selectedLevel ? WORDS.filter(w => selectedLevel.words.includes(w.id)) : [],
    [selectedLevel]
  );

  const handleLevelSelect = (levelId: string) => {
    const level = unlockedLevels.find(l => l.id === levelId);
    if (!level?.unlocked) return;
    setSelectedLevelId(levelId);
    setCurrentWordIndex(0);
    setCurrentView('study');
  };

  const nextWord = () => {
    if (currentWordIndex < levelWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Finished all words in level, move to practice
      setCurrentView('practice');
      setExerciseType(ExerciseType.ENGLISH_TO_CHINESE);
    }
  };

  const toggleBookmark = (wordId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedWords.includes(wordId);
      return {
        ...prev,
        bookmarkedWords: isBookmarked 
          ? prev.bookmarkedWords.filter(id => id !== wordId)
          : [...prev.bookmarkedWords, wordId]
      };
    });
  };

  const completeLevel = () => {
    if (selectedLevelId && !progress.completedLevels.includes(selectedLevelId)) {
      setProgress(prev => ({
        ...prev,
        xp: prev.xp + 100,
        completedLevels: [...prev.completedLevels, selectedLevelId]
      }));
    }
    setCurrentView('map');
    setSelectedLevelId(null);
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white rounded-b-[2rem] shadow-sm border-2 border-blue-100 px-6 flex items-center justify-between z-50 mx-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            🦁
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-900 kid-font leading-none">三年级英语趣味背诵</h1>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mt-1">Level 3 • Daily Practice</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <div className="text-[10px] text-gray-400 uppercase font-bold">今日能量</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all duration-500" 
                  style={{ width: `${Math.min(100, (progress.xp / 1000) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-green-600">{progress.xp}/1000</span>
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentView('bookmarks')}
            className="p-2.5 hover:bg-red-50 rounded-full transition-colors relative group"
          >
            <Bookmark className={progress.bookmarkedWords.length > 0 ? "text-red-500 fill-red-500" : "text-gray-300 group-hover:text-red-400"} size={24} />
            {progress.bookmarkedWords.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                {progress.bookmarkedWords.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'map' && (
            <LevelMap levels={unlockedLevels} onSelect={handleLevelSelect} completedLevels={progress.completedLevels} />
          )}
          
          {currentView === 'study' && selectedLevel && (
            <StudyStation 
              word={levelWords[currentWordIndex]} 
              index={currentWordIndex}
              total={levelWords.length}
              onNext={nextWord}
              onBack={() => setCurrentView('map')}
              onToggleBookmark={toggleBookmark}
              isBookmarked={progress.bookmarkedWords.includes(levelWords[currentWordIndex].id)}
            />
          )}

          {currentView === 'practice' && selectedLevel && (
            <PracticeZone 
              words={levelWords}
              onComplete={completeLevel}
              onBack={() => setCurrentView('study')}
            />
          )}

          {currentView === 'bookmarks' && (
            <BookmarkView 
              wordIds={progress.bookmarkedWords}
              onBack={() => setCurrentView('map')}
              onToggleBookmark={toggleBookmark}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Background elements */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-50/50 to-transparent -z-10" />
    </div>
  );
}

// --- Sub-components ---

function LevelMap({ levels, onSelect, completedLevels }: { levels: Level[], onSelect: (id: string) => void, completedLevels: string[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-12 gap-4">
        {/* Main Status Panel */}
        <section className="col-span-12 md:col-span-8 glass rounded-[40px] p-8 flex items-center justify-between overflow-hidden relative bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold kid-font mb-2">闯关探险记</h2>
            <p className="opacity-80 font-medium">已经收集了 {completedLevels.length * 3} 颗小星星</p>
            <div className="mt-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className={i < completedLevels.length ? "text-yellow-300 fill-yellow-300" : "text-white/20"} />
              ))}
            </div>
          </div>
          <div className="text-8xl opacity-20 absolute right-4 top-1/2 -translate-y-1/2 rotate-12">🚀</div>
        </section>

        {/* Level Stats Panel */}
        <section className="col-span-12 md:col-span-4 glass rounded-[40px] p-8 flex flex-col justify-center items-center text-center bg-yellow-400 text-white">
           <div className="text-sm font-bold uppercase mb-2 tracking-widest">学习进度</div>
           <div className="text-5xl font-black kid-font">{Math.round((completedLevels.length / levels.length) * 100)}%</div>
           <p className="mt-2 opacity-90 font-bold">加油冲鸭！</p>
        </section>

        {/* Level Path Section */}
        <section className="col-span-12 glass rounded-[40px] p-12 overflow-x-auto">
          <div className="min-w-[800px] relative flex items-center justify-between py-8">
            <div className="level-line w-full left-0 mx-8"></div>
            
            {levels.map((level, idx) => {
              const isCompleted = completedLevels.includes(level.id);
              const isUnlocked = level.unlocked;
              const isCurrent = isUnlocked && !isCompleted;
              
              return (
                <motion.button
                  key={level.id}
                  whileHover={isUnlocked ? { scale: 1.2 } : { scale: 1 }}
                  onClick={() => isUnlocked && onSelect(level.id)}
                  className={`
                    level-dot group
                    ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-100' : isCurrent ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-125 border-4 border-white' : 'bg-white border-4 border-blue-100 text-blue-300 pointer-events-none'}
                  `}
                >
                  <span className="text-xl font-black">{isCompleted ? '✓' : idx + 1}</span>
                  
                  {/* Tooltip-like title */}
                  <div className={`
                    absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-sm transition-all
                    ${isUnlocked ? 'text-blue-900 opacity-100' : 'text-blue-200 opacity-0'}
                  `}>
                    {level.title.split('：')[1] || level.title}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Fun Fact Section */}
        <section className="col-span-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-[40px] p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
             <h3 className="text-2xl font-bold kid-font mb-2">趣味小知识 💡</h3>
             <p className="text-sm opacity-90 leading-relaxed font-medium">你知道吗？英语是世界上使用最广泛的语言之一。学会它，你就可以和全世界的小朋友交朋友啦！</p>
          </div>
          <div className="absolute right-8 bottom-[-10px] text-9xl opacity-20 rotate-12">📚</div>
        </section>
      </div>
    </motion.div>
  );
}

function StudyStation({ word, index, total, onNext, onBack, onToggleBookmark, isBookmarked }: { 
  word: Word, 
  index: number, 
  total: number, 
  onNext: () => void, 
  onBack: () => void,
  onToggleBookmark: (id: string) => void,
  isBookmarked: boolean
}) {
  const [showExample, setShowExample] = useState(false);
  const [studyPhase, setStudyPhase] = useState<'view' | 'build'>('view');
  const [userInputPieces, setUserInputPieces] = useState<string[]>([]);
  const [shuffledPieces, setShuffledPieces] = useState<string[]>([]);

  // Initialize building pieces
  useEffect(() => {
    setShuffledPieces([...word.phonics].sort(() => Math.random() - 0.5));
    setUserInputPieces([]);
    setStudyPhase('view');
  }, [word]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handlePieceClick = (piece: string) => {
    speak(piece);
    const nextExpectedPiece = word.phonics[userInputPieces.length];
    if (piece === nextExpectedPiece) {
      setUserInputPieces(prev => [...prev, piece]);
    } else {
      // Small shake animation or sound could go here
    }
  };

  const isWordComplete = userInputPieces.length === word.phonics.length;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-500 flex items-center gap-2 font-bold"
        >
          <ArrowLeft size={20} /> 返回地图
        </button>
        <div className="flex items-center gap-2">
          <div className="text-sm font-black text-blue-500 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            单词 {index + 1} / {total}
          </div>
          <div className="flex gap-1 h-2 w-20 bg-gray-100 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full transition-all" style={{ width: `${(userInputPieces.length / word.phonics.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl glass border-blue-100 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {studyPhase === 'view' ? (
            <motion.div 
              key="view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1 bg-blue-50 text-blue-500 rounded-full text-xs font-bold uppercase tracking-widest">
                  第一步：观察与发音
                </div>
                <h3 className="text-5xl font-black text-gray-800 kid-font">{word.chinese}</h3>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-1">
                {word.phonics.map((piece, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, translateY: -5 }}
                    className={`text-8xl font-bold kid-font tracking-tight pb-2 border-b-8 ${/^[aeiouy]/i.test(piece) ? 'text-red-500 border-red-200' : 'text-blue-800 border-blue-100'}`}
                  >
                    {piece}
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => speak(word.text)}
                  className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-3xl text-xl font-bold shadow-xl shadow-blue-200"
                >
                  <Volume2 size={32} />听读音
                </button>
                <button 
                  onClick={() => setStudyPhase('build')}
                  className="bg-green-500 text-white px-10 py-5 rounded-3xl text-xl font-bold hover:bg-green-600 transition-all shadow-xl shadow-green-100 flex items-center gap-2"
                >
                  去挑战拼读 <ChevronRight />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="build"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-widest">
                  第二步：通过拼读记住它
                </div>
                <p className="text-gray-400 font-bold italic">请点击正确的发音音块，拼写出单词</p>
                <h3 className="text-3xl font-black text-gray-500 kid-font">{word.chinese}</h3>
              </div>

              {/* Input Slots */}
              <div className="flex justify-center gap-3 h-24">
                {word.phonics.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-20 rounded-2xl border-4 flex items-center justify-center text-3xl font-black kid-font transition-all ${userInputPieces[i] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-dashed border-gray-200'}`}
                  >
                    {userInputPieces[i] || ''}
                  </div>
                ))}
              </div>

              {/* Shuffled Pieces to pick from */}
              <div className="flex flex-wrap justify-center gap-4 py-6">
                {!isWordComplete && shuffledPieces.map((piece, i) => {
                  // Only allow clicking if it's the next correct piece for simplicity in teaching phase
                  // or let them try and show error. Here we let them click.
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePieceClick(piece)}
                      className="bg-white border-2 border-blue-100 p-6 rounded-3xl text-3xl font-bold text-blue-800 shadow-md hover:shadow-lg hover:border-blue-400 transition-all min-w-[80px]"
                    >
                      {piece}
                    </motion.button>
                  );
                })}
              </div>

              {isWordComplete && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="text-green-500 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <span className="font-black text-2xl">太棒了！拼对了！</span>
                  </div>
                  <button 
                    onClick={onNext}
                    className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] text-xl font-bold shadow-xl shadow-blue-200"
                  >
                    {index === total - 1 ? "去完成闯关测试" : "学习下一个单词"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bookmark in footer during study */}
      <div className="flex justify-center">
        <button 
          onClick={() => onToggleBookmark(word.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isBookmarked ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400'}`}
        >
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          {isBookmarked ? "已移出收藏" : "加入生词本"}
        </button>
      </div>
    </motion.div>
  );
}

function PracticeZone({ words, onComplete, onBack }: { words: Word[], onComplete: () => void, onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<ExerciseType>(ExerciseType.ENGLISH_TO_CHINESE);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const currentWord = words[currentStep];

  useEffect(() => {
    if (mode === ExerciseType.ENGLISH_TO_CHINESE || mode === ExerciseType.CHINESE_TO_ENGLISH) {
      const isE2C = mode === ExerciseType.ENGLISH_TO_CHINESE;
      const correct = isE2C ? currentWord.chinese : currentWord.text;
      
      const others = WORDS
        .filter(w => w.id !== currentWord.id)
        .map(w => isE2C ? w.chinese : w.text)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
        
      setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    }
  }, [currentStep, mode]);

  const checkAnswer = (answer: string) => {
    const isE2C = mode === ExerciseType.ENGLISH_TO_CHINESE;
    const correct = isE2C ? currentWord.chinese : currentWord.text;
    
    if (answer.toLowerCase().trim() === correct.toLowerCase()) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      setTimeout(() => nextStep(), 1000);
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1500);
    }
  };

  const nextStep = () => {
    setIsCorrect(null);
    setUserInput('');
    if (currentStep < words.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Current mode finished
      if (mode === ExerciseType.ENGLISH_TO_CHINESE) {
        setMode(ExerciseType.SPELLING);
        setCurrentStep(0);
      } else if (mode === ExerciseType.SPELLING) {
        setMode(ExerciseType.PRONUNCIATION);
        setCurrentStep(0);
      } else {
        onComplete();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-3 bg-white shadow-sm rounded-2xl transition-colors text-gray-500 font-bold"
        >
          <ArrowLeft size={20} /> 重新学习
        </button>
        <div className="flex gap-2">
           <ModeBadge active={mode === ExerciseType.ENGLISH_TO_CHINESE} text="英译汉" />
           <ModeBadge active={mode === ExerciseType.SPELLING} text="拼写" />
           <ModeBadge active={mode === ExerciseType.PRONUNCIATION} text="跟读" />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl glass border-blue-100 min-h-[400px] flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-4">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
             Step {currentStep + 1} / {words.length} • Challenging
          </p>
          <h3 className="text-6xl font-black text-blue-900 kid-font">
            {mode === ExerciseType.ENGLISH_TO_CHINESE ? currentWord.text : currentWord.chinese}
          </h3>
        </div>

        <div className="w-full max-w-md">
          {mode === ExerciseType.ENGLISH_TO_CHINESE && (
            <div className="grid grid-cols-1 gap-4">
              {options.map((option, idx) => (
                <OptionButton 
                  key={idx}
                  text={option} 
                  correct={isCorrect === true && option === currentWord.chinese}
                  wrong={isCorrect === false && option !== currentWord.chinese}
                  onClick={() => checkAnswer(option)} 
                />
              ))}
            </div>
          )}

          {mode === ExerciseType.SPELLING && (
            <div className="space-y-6">
              <input 
                type="text"
                autoFocus
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer(userInput)}
                placeholder="Type here..."
                className={`
                  w-full bg-blue-50/50 border-4 rounded-[2rem] p-6 text-3xl font-bold kid-font text-center focus:outline-none transition-all
                  ${isCorrect === true ? 'border-green-400 bg-green-50 text-green-700' : isCorrect === false ? 'border-red-400 bg-red-50' : 'border-blue-100 focus:border-blue-500'}
                `}
              />
              <button 
                onClick={() => checkAnswer(userInput)}
                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] text-xl font-bold shadow-xl shadow-blue-100"
              >
                检查答案
              </button>
            </div>
          )}

          {mode === ExerciseType.PRONUNCIATION && (
            <div className="space-y-12 text-center">
              <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100">
                 <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">录音跟读打分</p>
                 <p className="text-4xl font-black text-blue-900 kid-font">{currentWord.text}</p>
                 <div className="mt-4 flex justify-center">
                    {/* Simulated circular progress */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                       <svg className="absolute w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="44" stroke="#E0F2FE" strokeWidth="6" fill="transparent" />
                          <circle cx="48" cy="48" r="44" stroke="#10B981" strokeWidth="6" fill="transparent" strokeDasharray="276" strokeDashoffset={isCorrect === true ? "0" : "180"} className="transition-all duration-1000" />
                       </svg>
                       <div className="text-center">
                          <div className={`text-3xl font-bold ${isCorrect === true ? 'text-green-600' : 'text-blue-300'}`}>{isCorrect === true ? '98' : '--'}</div>
                       </div>
                    </div>
                 </div>
              </div>
              <VoiceButton onScore={(s) => {
                if (s > 80) {
                  setIsCorrect(true);
                  setTimeout(() => nextStep(), 2000);
                } else {
                  setIsCorrect(false);
                  setTimeout(() => setIsCorrect(null), 1500);
                }
              }} target={currentWord.text} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ModeBadge({ active, text }: { active: boolean, text: string }) {
  return (
    <div className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 grayscale border border-gray-100'}`}>
      {text}
    </div>
  );
}

interface OptionButtonProps {
  key?: any;
  text: string;
  onClick: () => void;
  correct?: boolean;
  wrong?: boolean;
}

function OptionButton({ text, onClick, correct, wrong }: OptionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full p-6 h-20 rounded-3xl text-2xl font-bold transition-all border-4 flex items-center justify-between
        ${correct ? 'bg-green-500 border-green-600 text-white' : wrong ? 'bg-red-500 border-red-600 text-white' : 'bg-white border-gray-100 text-gray-700 hover:border-indigo-200 hover:shadow-lg'}
      `}
    >
      <span>{text}</span>
      {correct && <CheckCircle2 />}
      {wrong && <XCircle />}
    </motion.button>
  );
}

function VoiceButton({ onScore, target }: { onScore: (s: number) => void, target: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('抱歉，您的浏览器不支持语音识别功能。');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onresult = (event: any) => {
      const result = event.results[0][0].transcript.toLowerCase().trim();
      const targetLower = target.toLowerCase().trim();
      
      // Simple similarity score
      let score = 0;
      if (result === targetLower) score = 100;
      else if (result.includes(targetLower) || targetLower.includes(result)) score = 85;
      else score = 40;
      
      onScore(score);
    };
    recognitionRef.current.onerror = () => setIsRecording(false);
    recognitionRef.current.onend = () => setIsRecording(false);

    recognitionRef.current.start();
  };

  return (
    <button 
      onClick={startRecording}
      disabled={isRecording}
      className={`
        group w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 transition-all shadow-2xl relative
        ${isRecording ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}
      `}
    >
      {isRecording && (
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-red-400 rounded-full"
        />
      )}
      <Mic className="text-white relative z-10" size={48} />
      <span className="text-white font-black text-sm relative z-10">{isRecording ? "正在听..." : "按住说"}</span>
    </button>
  );
}

function BookmarkView({ wordIds, onBack, onToggleBookmark }: { wordIds: string[], onBack: () => void, onToggleBookmark: (id: string) => void }) {
  const bookmarkedWords = useMemo(() => WORDS.filter(w => wordIds.includes(w.id)), [wordIds]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 font-bold text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} /> 返回首页
        </button>
        <h2 className="text-2xl font-black text-gray-800">生词宝典 ({wordIds.length})</h2>
      </div>

      {bookmarkedWords.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center space-y-6 shadow-xl shadow-gray-100 border-2 border-dashed border-gray-100">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Bookmark size={40} />
           </div>
           <p className="text-gray-400 font-bold text-xl">还没有收藏任何单词哦，去关卡里看看吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarkedWords.map(word => (
            <motion.div 
              layout
              key={word.id} 
              className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 flex items-center justify-between"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-indigo-600 uppercase tracking-tight">{word.text}</h3>
                <p className="font-bold text-gray-400 uppercase tracking-wider">{word.chinese}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(word.text);
                    utterance.lang = 'en-US';
                    window.speechSynthesis.speak(utterance);
                  }}
                  className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors"
                >
                  <Volume2 size={24} />
                </button>
                <button 
                  onClick={() => onToggleBookmark(word.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <Bookmark fill="currentColor" size={24} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
