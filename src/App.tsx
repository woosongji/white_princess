import React, { useState, useEffect, useRef } from 'react';

const WORD_POOL = [
  { ko: '자동차', en: 'Car', emoji: '🚗', color: '#EF4444' },
  { ko: '강아지', en: 'Dog', emoji: '🐶', color: '#A16207' },
  { ko: '기차', en: 'Train', emoji: '🚂', color: '#374151' },
  { ko: '비행기', en: 'Airplane', emoji: '✈️', color: '#3B82F6' },
  { ko: '무지개', en: 'Rainbow', emoji: '🌈', color: '#EC4899' },
  { ko: '토끼', en: 'Rabbit', emoji: '🐰', color: '#F472B6' },
  { ko: '별', en: 'Star', emoji: '⭐', color: '#FACC15' },
  { ko: '사자', en: 'Lion', emoji: '🦁', color: '#EA580C' },
  { ko: '사과', en: 'Apple', emoji: '🍎', color: '#FF4B2B' },
  { ko: '포도', en: 'Grape', emoji: '🍇', color: '#8B5CF6' },
  { ko: '바나나', en: 'Banana', emoji: '🍌', color: '#F59E0B' },
  { ko: '딸기', en: 'Strawberry', emoji: '🍓', color: '#E11D48' },
  { ko: '수박', en: 'Watermelon', emoji: '🍉', color: '#10B981' },
  { ko: '고양이', en: 'Cat', emoji: '🐱', color: '#F97316' },
  { ko: '코끼리', en: 'Elephant', emoji: '🐘', color: '#64748B' },
  { ko: '달', en: 'Moon', emoji: '🌙', color: '#FDE047' },
  { ko: '꽃', en: 'Flower', emoji: '🌸', color: '#FB7185' },
  { ko: '나비', en: 'Butterfly', emoji: '🦋', color: '#60A5FA' },
  { ko: '곰돌이', en: 'Bear', emoji: '🧸', color: '#B45309' },
  { ko: '물고기', en: 'Fish', emoji: '🐟', color: '#38BDF8' },
];

const App: React.FC = () => {
  const [view, setView] = useState<'intro' | 'play'>('intro');
  const [isMelted, setIsMelted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [currentWord, setCurrentWord] = useState(WORD_POOL[0]);
  const [hairLevel, setHairLevel] = useState(0); 
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const speak = (text: string, lang: 'ko-KR' | 'en-US' = 'ko-KR') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; 
    utterance.pitch = 1.3; 
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const img = new Image();
    img.src = '/background.png';
    img.onload = () => setBgLoaded(true);
    pickRandomWord();
  }, []);

  const pickRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * WORD_POOL.length);
    setCurrentWord(WORD_POOL[randomIndex]);
  };

  const startRescue = () => {
    setView('play');
    speak("단어 구출 작전 시작! 얼음 속에 갇힌 친구들을 도와주자!");
  };

  const goBack = () => {
    setView('intro');
    setIsMelted(false);
    setHairLevel(0);
  };

  useEffect(() => {
    if (view !== 'play' || isMelted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(225, 225, 30, 225, 225, 225);
    gradient.addColorStop(0, 'rgba(210, 245, 255, 0.25)'); 
    gradient.addColorStop(1, 'rgba(170, 230, 255, 0.9)'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  }, [currentWord, isMelted, view, bgLoaded]);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isMelted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 55, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleUp = () => {
    setIsDrawing(false);
    setIsMelted(true);
    setHairLevel(prev => Math.min(prev + 1, 10));
    speak(`구출 성공! 이건 ${currentWord.ko}야!`);
    setTimeout(() => speak(currentWord.en, 'en-US'), 2500);
  };

  return (
    <div style={{ 
      position: 'relative', height: '100vh', width: '100vw',
      backgroundImage: "url('/background.png')", backgroundSize: 'cover', backgroundPosition: 'center',
      overflow: 'hidden', boxSizing: 'border-box', fontFamily: '"Nanum Gothic", sans-serif'
    }}>
      
      {view === 'intro' && (
        <div style={{ 
          height: '100%', width: '100%', display: 'flex', flexDirection: 'column', 
          justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(5px)' 
        }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', padding: '50px', borderRadius: '40px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '60px', color: '#f472b6', margin: '0 0 20px 0', fontWeight: '900' }}>👸 공주님과 마법 성</h1>
            <p style={{ fontSize: '24px', color: '#64748b', marginBottom: '40px', fontWeight: 'bold' }}>얼음에 갇힌 단어 친구들을 구출해줄까?</p>
            <button onClick={startRescue} style={{ padding: '25px 80px', fontSize: '32px', fontWeight: 'bold', borderRadius: '50px', backgroundColor: '#f472b6', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 10px 0px #db2777' }}>
              단어 구출하기 🚀
            </button>
          </div>
        </div>
      )}

      {view === 'play' && (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px' }}>
          
          <button onClick={goBack} style={{ position: 'absolute', top: '30px', left: '30px', padding: '12px 25px', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.8)', border: '2px solid #f472b6', color: '#f472b6', fontWeight: 'bold', cursor: 'pointer', zIndex: 100 }}>
            ⬅️ 뒤로가기
          </button>

          <div style={{ width: '25%', zIndex: 10 }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '2px solid white' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0 }}>단어 구출 중!</h2>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '10px' }}>
                구출한 친구: {hairLevel} / 10
              </p>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <div style={{ 
              position: 'relative', width: '500px', height: '500px', borderRadius: '50%',
              border: isMelted ? 'none' : '12px solid rgba(255,255,255,0.8)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              backgroundColor: isMelted ? 'transparent' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.5s'
            }}>
              {isMelted ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '30px', // ⭐️ 요소 간격을 확실하게 고정
                  animation: 'pop 0.6s' 
                }}>
                  {/* 이모지 */}
                  <span style={{ fontSize: '150px', lineHeight: '1', margin: 0 }}>{currentWord.emoji}</span>
                  
                  {/* 단어 묶음 레이아웃 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    {/* 한글 단어 박스 */}
                    <div style={{ backgroundColor: 'white', padding: '15px 50px', borderRadius: '30px', border: `4px solid ${currentWord.color}`, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                      <p style={{ fontSize: '42px', fontWeight: '900', color: currentWord.color, margin: 0 }}>{currentWord.ko}</p>
                    </div>

                    {/* 영어 단어 박스 */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px 40px', borderRadius: '25px', border: '2px solid #cbd5e1', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      <p style={{ fontSize: '34px', fontWeight: '800', color: '#475569', margin: 0, letterSpacing: '1px' }}>{currentWord.en.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: '160px', opacity: 0.25, position: 'absolute' }}>{currentWord.emoji}</span>
                  <canvas ref={canvasRef} width={500} height={500} style={{ position: 'relative', zIndex: 5, touchAction: 'none' }}
                    onMouseDown={() => setIsDrawing(true)} onMouseUp={handleUp} onMouseMove={handleMove}
                    onTouchStart={() => setIsDrawing(true)} onTouchEnd={handleUp} onTouchMove={handleMove}
                  />
                </>
              )}
            </div>
          </div>

          <div style={{ width: '30%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <div style={{ position: 'relative', width: '350px', height: '650px' }}>
              <div style={{ 
                position: 'absolute', inset: 0, 
                backgroundImage: "url('/tower_hair.png')", backgroundSize: 'contain', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat',
                WebkitMaskImage: `linear-gradient(to bottom, black ${15 + hairLevel * 8}%, transparent ${25 + hairLevel * 8}%)`,
                maskImage: `linear-gradient(to bottom, black ${15 + hairLevel * 8}%, transparent ${25 + hairLevel * 8}%)`,
                transition: 'all 1.5s ease-in-out'
              }} />
            </div>
          </div>

          {isMelted && (
            <div style={{ position: 'absolute', bottom: '50px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
              <button onClick={() => { setIsMelted(false); pickRandomWord(); }} style={{ padding: '18px 60px', borderRadius: '50px', backgroundColor: '#F59E0B', color: 'white', fontSize: '24px', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
                {hairLevel >= 10 ? "마법 완성! 다시 시작 👸" : "다음 친구 구출하기 ➡️"}
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default App;