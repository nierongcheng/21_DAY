/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  Settings, 
  Home, 
  Book, 
  Trophy, 
  ArrowRight, 
  Edit, 
  Download, 
  Share, 
  Lock,
  Pencil,
  FileEdit,
  Quote
} from 'lucide-react';
import { QUESTIONS, type Entry } from './constants';

type View = 'home' | 'input' | 'archive' | 'achievement';

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [inputText, setInputText] = useState('');
  const [editingDay, setEditingDay] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('toast_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when entries change
  useEffect(() => {
    localStorage.setItem('toast_entries', JSON.stringify(entries));
  }, [entries]);

  const currentDay = entries.length + 1;
  const isComplete = entries.length >= 21;

  const handleWakeUp = () => {
    if (isComplete) {
      setCurrentView('achievement');
    } else {
      setCurrentView('input');
    }
  };

  const handleSaveEntry = () => {
    if (!inputText.trim()) return;

    if (editingDay !== null) {
      const updatedEntries = entries.map(e => 
        e.day === editingDay ? { ...e, answer: inputText } : e
      );
      setEntries(updatedEntries);
      setEditingDay(null);
      setCurrentView('archive');
    } else {
      const newEntry: Entry = {
        day: currentDay,
        question: QUESTIONS[currentDay - 1],
        answer: inputText,
        timestamp: Date.now(),
      };
      setEntries([...entries, newEntry]);
      setCurrentView('home');
    }
    setInputText('');
  };

  const handleEdit = (day: number) => {
    const entry = entries.find(e => e.day === day);
    if (entry) {
      setInputText(entry.answer);
      setEditingDay(day);
      setCurrentView('input');
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有进度吗？这将删除所有已记录的内容。')) {
      setEntries([]);
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-24 font-sans text-on-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-surface-container-highest">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-2xl mx-auto">
          <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-headline tracking-widest text-xl font-bold uppercase">
            问题吐司机的21天
          </h1>
          <button 
            onClick={handleReset}
            className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 px-6 max-w-2xl mx-auto w-full flex flex-col">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-grow flex flex-col items-center justify-center py-12"
            >
              <div className="w-full mb-12 flex flex-col items-center">
                <p className="text-sm text-on-surface-variant mb-3 tracking-widest uppercase">
                  已思考：{String(entries.length).padStart(2, '0')} / 21 天
                </p>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(entries.length / 21) * 100}%` }}
                    className="h-full bg-primary absolute left-0 top-0 rounded-full" 
                  />
                </div>
              </div>

              <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <motion.div 
                  whileHover={{ rotate: 0 }}
                  className="relative z-10 w-48 h-48 bg-white rounded-[2rem] shadow-xl flex items-center justify-center border border-outline-variant/15 transform rotate-2 transition-transform duration-500"
                >
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ZuXrCLjUmnjHneRqfSlDz6_oJJNo3AFJ2UCxWthbAuviswqqVudhT227209JDqoVhz0MOg29We5THdmZgonbduzrBlvs-0IPvbNn5s-SEGgs9ZJttflX1WTpRVTZ9wfKOy5u0vKwpePCFILpzW7wLI_DWED6BddtFe72Qh474TzB8bRgM-gdVAtob-MMtK6t_u83bWC7hxbp81siLaiDZBBtcE06VLjikrpPZYo7TcxYJ6zwFHn61HMoOtZYhGtofJJspBn_iQ" 
                    alt="Problem Toaster"
                    referrerPolicy="no-referrer"
                    className="w-32 h-32 object-cover rounded-xl grayscale-[0.2]"
                  />
                </motion.div>
              </div>

              <div className="text-center mb-12">
                <p className="text-lg opacity-80 italic">
                  "{isComplete ? '它看起来已经吃饱了...' : '它看起来还在酝酿中...'}"
                </p>
              </div>

              {!isComplete && (
                <button 
                  onClick={handleWakeUp}
                  className="bg-primary text-white font-medium text-lg px-12 py-4 rounded-xl shadow-lg hover:bg-primary-dim hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
                >
                  <span className="relative z-10">唤醒它</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
                </button>
              )}

              {isComplete && (
                <button 
                  onClick={() => setCurrentView('achievement')}
                  className="bg-primary text-white font-medium text-lg px-12 py-4 rounded-xl shadow-lg hover:bg-primary-dim hover:-translate-y-1 transition-all duration-300"
                >
                  查看成就
                </button>
              )}
            </motion.div>
          )}

          {currentView === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 flex-grow flex flex-col"
            >
              <div className="w-full flex justify-start mb-8">
                <div className="bg-white py-2 px-6 rounded-xl shadow-sm transform -rotate-1 border border-outline-variant/10">
                  <span className="font-headline text-on-surface-variant text-sm tracking-widest uppercase">
                    第 {String(editingDay || currentDay).padStart(2, '0')} 天
                  </span>
                </div>
              </div>

              <section className="w-full mb-12 relative">
                <span className="absolute -top-10 -left-6 text-primary/10 font-headline text-[10rem] leading-none select-none z-0">
                  <Quote className="w-24 h-24 rotate-180" />
                </span>
                <div className="bg-surface-container-low/50 backdrop-blur-sm rounded-2xl p-8 relative z-10 shadow-sm border border-outline-variant/5">
                  <h2 className="font-headline text-2xl text-on-surface leading-loose text-center tracking-wider font-bold">
                    {editingDay ? QUESTIONS[editingDay - 1] : QUESTIONS[currentDay - 1]}
                  </h2>
                </div>
              </section>

              <section className="w-full mb-10 flex-grow relative">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-full min-h-[300px] bg-surface-container-highest/50 rounded-2xl p-8 text-on-surface text-lg leading-loose border border-outline-variant/10 focus:border-primary/30 focus:ring-0 focus:outline-none resize-none transition-all placeholder:text-on-surface-variant/40"
                  placeholder="在此写下你脑中的第一句话..."
                />
                <FileEdit className="absolute bottom-6 right-6 text-outline-variant/40 w-6 h-6" />
              </section>

              <div className="w-full flex justify-center mt-auto">
                <button 
                  onClick={handleSaveEntry}
                  disabled={!inputText.trim()}
                  className="bg-primary text-white font-medium text-lg py-4 px-12 rounded-xl shadow-lg hover:bg-primary-dim hover:-translate-y-1 transition-all duration-300 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span>收录进大脑</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'archive' && (
            <motion.div 
              key="archive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <header className="mb-12">
                <h2 className="font-headline text-4xl font-bold tracking-widest">历史存档</h2>
                <p className="text-on-surface-variant mt-4 text-sm leading-relaxed">
                  翻阅过往的思绪，这些纸页记录了你与世界的对话。
                </p>
              </header>

              <div className="space-y-10">
                {Array.from({ length: 21 }).map((_, i) => {
                  const day = i + 1;
                  const entry = entries.find(e => e.day === day);
                  const isUnlocked = day <= currentDay && (entry || day === currentDay);
                  const isCurrent = day === currentDay && !entry;

                  if (!isUnlocked) {
                    return (
                      <div key={day} className="bg-surface-container/30 rounded-xl p-6 border border-outline-variant/10 opacity-40 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Lock className="w-5 h-5 text-outline-variant" />
                          <span className="font-headline text-lg font-bold tracking-widest">Day {String(day).padStart(2, '0')}</span>
                        </div>
                        <span className="text-xs">尚未解锁</span>
                      </div>
                    );
                  }

                  if (isCurrent) {
                    return (
                      <div key={day} className="bg-surface-container-highest rounded-xl p-8 border border-primary/20 shadow-md">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-3">
                            <span className="font-headline text-xl font-bold text-primary tracking-widest">Day {String(day).padStart(2, '0')}</span>
                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">今日</span>
                          </div>
                          <button 
                            onClick={() => setCurrentView('input')}
                            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-primary-dim transition-colors"
                          >
                            <Pencil className="w-4 h-4" /> 开启书写
                          </button>
                        </div>
                        <p className="text-on-surface-variant text-sm font-medium">Q: {QUESTIONS[day - 1]}</p>
                      </div>
                    );
                  }

                  return (
                    <article key={day} className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/10 hover:-translate-y-1 transition-transform duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-headline text-lg font-bold tracking-widest">Day {String(day).padStart(2, '0')}</span>
                        <button 
                          onClick={() => handleEdit(day)}
                          className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                          修改 <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <p className="text-on-surface-variant text-xs font-medium italic">Q: {QUESTIONS[day - 1]}</p>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-on-surface text-sm leading-loose">
                            {entry?.answer}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentView === 'achievement' && (
            <motion.div 
              key="achievement"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex-grow flex flex-col items-center justify-center text-center"
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px]" />
                <div className="relative w-40 h-40 bg-white rounded-[2rem] shadow-xl flex items-center justify-center border border-outline-variant/15 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn3HHdAvR-2cu17G4mniRwUYIncYcLHH-mT4ZA7iBRelPI9g7EBGYvpMYqKrgw-yQtqPayRI4klL2BVp_3WOUh2HnrFopNXom2nrFw_3XqxaN2ntxDnXM5P04k9Nbmmzh-XV3tZ2oB5ay6S3DenGASNzY1E-6Yk8scBOA141Icbb38MVWjPlYVf0XbrBwFovrkKz05TMUfWYujXYB5SEPLhRrs0rPZTW-w9pVJkf_EQMol_M25B9fXUzaGEpIZ9oq2Q_k8yls3LQ" 
                    alt="Hero Robot"
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 object-cover grayscale-[0.2]"
                  />
                  <div className="absolute -top-4 -right-8 bg-surface-container-high text-on-surface-variant text-xs px-3 py-1 rounded-lg border border-outline-variant/20 shadow-sm rotate-6">
                    V 2.0
                  </div>
                </div>
              </div>

              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-[0.15em] text-primary mb-8">
                21天旅程圆满完成
              </h2>

              <div className="w-full pl-6 pr-6 border-l-4 border-primary/20 mb-12 relative text-left">
                <Quote className="absolute -top-4 -left-4 text-primary/20 w-12 h-12" />
                <p className="text-on-surface-variant text-lg leading-loose italic">
                  习惯不是枷锁，而是刻在时间里的年轮。你在这21天里留下的每一句追问，都已化作思想的养分。机器的运转可能暂停，但灵魂的轰鸣才刚刚开始。
                </p>
              </div>

              <div className="w-full flex flex-col gap-4">
                <button className="bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <Share className="w-5 h-5" /> 生成分享海报
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '21天思考记录.json';
                    a.click();
                  }}
                  className="text-primary font-medium py-3 flex items-center justify-center gap-2 hover:bg-primary/5 rounded-xl transition-colors"
                >
                  <Download className="w-5 h-5" /> 导出历史记录
                </button>
              </div>

              <button 
                onClick={() => setCurrentView('home')}
                className="mt-12 text-on-surface-variant/60 hover:text-primary transition-colors text-sm flex items-center gap-1 group"
              >
                回到主页 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-t border-outline-variant/10 md:hidden flex justify-around items-center px-4 pb-6 pt-3 rounded-t-3xl shadow-lg">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${currentView === 'home' ? 'text-primary bg-primary/10' : 'text-on-surface/60'}`}
        >
          <Home className={`w-6 h-6 ${currentView === 'home' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">主页</span>
        </button>
        <button 
          onClick={() => setCurrentView('archive')}
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${currentView === 'archive' ? 'text-primary bg-primary/10' : 'text-on-surface/60'}`}
        >
          <Book className={`w-6 h-6 ${currentView === 'archive' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">档案</span>
        </button>
        <button 
          onClick={() => entries.length >= 21 ? setCurrentView('achievement') : alert('记录满21天即可解锁奖励')}
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${currentView === 'achievement' ? 'text-primary bg-primary/10' : 'text-on-surface/60'}`}
        >
          <Trophy className={`w-6 h-6 ${currentView === 'achievement' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">成就</span>
        </button>
      </nav>
    </div>
  );
}
