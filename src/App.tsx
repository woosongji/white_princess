import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 공통 데이터 및 설정
// ==========================================
const COLORING_COLORS = [
  '#FFF5EE', '#FFE4E1', '#FFDAB9', '#FFCEAD', '#FBCBB0', '#E9B293', 
  '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF',
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
  '#000000', '#808080', '#A52A2A', '#FFD700', '#40E0D0'
];
const MAX_IMAGES = 50;

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

// ==========================================
// 1. 단어 구출 작전 (Vocab View)
// ==========================================
const VocabView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isMelted, setIsMelted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
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
    pickRandomWord();
    speak("단어 구출 작전 시작! 얼음을 녹여줘!");
  }, []);

  const pickRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * WORD_POOL.length);
    setCurrentWord(WORD_POOL[randomIndex]);
  };

  useEffect(() => {
    if (isMelted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(225, 225, 30, 225, 225, 225);
    gradient.addColorStop(0, 'rgba(210, 245, 255, 0.25)'); 
    gradient.addColorStop(1, 'rgba(170, 230, 255, 0.9)'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [currentWord, isMelted]);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isMelted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 55, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkMeltProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4 * 20) {
      if (pixels[i + 3] < 128) {
        transparentPixels++;
      }
    }

    const totalSamplePixels = pixels.length / (4 * 20);
    const percent = (transparentPixels / totalSamplePixels) * 100;

    if (percent > 50) {
      setIsMelted(true);
      setHairLevel(prev => Math.min(prev + 1, 10));
      speak(`구출 성공! 이건 ${currentWord.ko}야!`);
      setTimeout(() => speak(currentWord.en, 'en-US'), 2000);
    }
  };

  const handleUp = () => {
    if (!isDrawing || isMelted) return;
    setIsDrawing(false);
    checkMeltProgress();
  };

  return (
    <div className="no-select" style={{ position: 'relative', height: '100vh', width: '100vw', backgroundImage: "url('/background.png')", backgroundSize: '100% 100%', overflow: 'hidden', fontFamily: '"Nanum Gothic", sans-serif' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: '30px', left: '30px', padding: '12px 25px', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.8)', border: '2px solid #f472b6', color: '#f472b6', fontWeight: 'bold', cursor: 'pointer', zIndex: 100 }}>🏠 홈으로</button>
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px' }}>
        <div style={{ width: '25%', zIndex: 10 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '2px solid white' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0 }}>단어 구출 중!</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '10px' }}>구출: {hairLevel} / 10</p>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <div style={{ position: 'relative', width: '500px', height: '500px', borderRadius: '50%', border: isMelted ? 'none' : '12px solid rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isMelted ? 'transparent' : 'rgba(255,255,255,0.15)', transition: 'all 0.5s' }}>
            {isMelted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px', animation: 'pop 0.6s' }}>
                <span style={{ fontSize: '150px', lineHeight: '1', margin: 0 }}>{currentWord.emoji}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <div style={{ backgroundColor: 'white', padding: '15px 50px', borderRadius: '30px', border: `4px solid ${currentWord.color}`, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '42px', fontWeight: '900', color: currentWord.color, margin: 0 }}>{currentWord.ko}</p>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 40px', borderRadius: '25px', border: '2px solid #cbd5e1', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <p style={{ fontSize: '34px', fontWeight: '800', color: '#475569', margin: 0, letterSpacing: '1px' }}>{currentWord.en.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <span style={{ fontSize: '160px', opacity: 0.25, position: 'absolute' }}>{currentWord.emoji}</span>
                <canvas ref={canvasRef} width={500} height={500} style={{ position: 'relative', zIndex: 5, touchAction: 'none' }} onMouseDown={() => setIsDrawing(true)} onMouseUp={handleUp} onMouseMove={handleMove} onTouchStart={() => setIsDrawing(true)} onTouchEnd={handleUp} onTouchMove={handleMove} />
              </>
            )}
          </div>
        </div>
        <div style={{ width: '30%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <div style={{ position: 'relative', width: '350px', height: '650px' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/tower_hair.png')", backgroundSize: 'contain', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat', WebkitMaskImage: `linear-gradient(to bottom, black ${15 + hairLevel * 8}%, transparent ${25 + hairLevel * 8}%)`, maskImage: `linear-gradient(to bottom, black ${15 + hairLevel * 8}%, transparent ${25 + hairLevel * 8}%)`, transition: 'all 1.5s ease-in-out' }} />
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
    </div>
  );
};

// ==========================================
// 2. 색칠 놀이 (Coloring View)
// ==========================================
const ColoringView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(COLORING_COLORS[2]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const scanImages = async () => {
      const found: string[] = [];
      for (let i = 1; i <= MAX_IMAGES; i++) {
        const fileName = `/images/p${i}.png`; 
        try {
          const res = await fetch(fileName, { method: 'HEAD' });
          if (res.ok) found.push(fileName);
        } catch (e) { }
      }
      setAvailableImages(found);
      if (found.length > 0) loadToCanvas(found[0]);
    };
    scanImages();
  }, []);

  const loadToCanvas = (src: string) => {
    setIsReady(false);
    setCurrentImg(src);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      const targetHeight = 550;
      const scale = targetHeight / img.height;
      canvas.width = img.width * scale;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
        const val = avg > 190 ? 255 : 0;
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = val;
      }
      ctx.putImageData(imageData, 0, 0);
      setIsReady(true);
    };
  };

  const handleFill = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isReady) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = Math.floor(clientX - rect.left);
    const y = Math.floor(clientY - rect.top);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = new Uint32Array(imageData.data.buffer);
    const targetColor = data[y * canvas.width + x];
    const r = parseInt(selectedColor.slice(1, 3), 16), g = parseInt(selectedColor.slice(3, 5), 16), b = parseInt(selectedColor.slice(5, 7), 16);
    const fillColor = (255 << 24) | (b << 16) | (g << 8) | r;
    if (targetColor === fillColor || (targetColor & 0xFFFFFF) === 0) return;
    const stack = [x, y];
    while (stack.length) {
      const cy = stack.pop()!, cx = stack.pop()!; let dy = cy;
      while (dy >= 0 && data[dy * canvas.width + cx] === targetColor) dy--;
      dy++;
      let l = false, r_ = false;
      while (dy < canvas.height && data[dy * canvas.width + cx] === targetColor) {
        data[dy * canvas.width + cx] = fillColor;
        if (cx > 0) { if (data[dy * canvas.width + (cx - 1)] === targetColor) { if (!l) { stack.push(cx - 1, dy); l = true; } } else if (l) l = false; }
        if (cx < canvas.width - 1) { if (data[dy * canvas.width + (cx + 1)] === targetColor) { if (!r_) { stack.push(cx + 1, dy); r_ = true; } } else if (r_) r_ = false; }
        dy++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="no-select" style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', backgroundImage: "url('/b2.png')", backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', padding: '25px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button onClick={onBack} style={{ padding: '12px', borderRadius: '20px', border: 'none', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold' }}>🏠 홈으로</button>
        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(255,255,255,0.85)', borderRadius: '30px', padding: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
          <h3 style={{ textAlign: 'center', color: '#FB7185' }}>도안 목록</h3>
          {availableImages.map(src => (
            <div key={src} onClick={() => loadToCanvas(src)} style={{ cursor: 'pointer', marginBottom: '15px', borderRadius: '15px', overflow: 'hidden', border: currentImg === src ? '5px solid #FB7185' : '3px solid #eee' }}>
              <img src={src} alt="도안" style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ border: '15px solid white', borderRadius: '40px', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', backgroundColor: 'white', overflow: 'hidden' }}>
          <canvas ref={canvasRef} onClick={handleFill} onTouchStart={handleFill} style={{ cursor: 'pointer', display: isReady ? 'block' : 'none', borderRadius: '25px', touchAction: 'none' }} />
          {!isReady && <div style={{ width: '500px', height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FB7185', fontWeight: 'bold' }}>로딩 중... ✨</div>}
        </div>
      </div>
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.85)', borderRadius: '30px', padding: '20px', marginLeft: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
        <h3 style={{ color: '#FB7185' }}>마법 물감</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px', overflowY: 'auto' }}>
          {COLORING_COLORS.map(color => (
            <button key={color} onClick={() => setSelectedColor(color)} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: color, border: selectedColor === color ? '5px solid #333' : '3px solid #eee', cursor: 'pointer' }} />
          ))}
        </div>
        <button onClick={() => setSelectedColor('#FFFFFF')} style={{ width: '120px', height: '55px', borderRadius: '15px', backgroundColor: 'white', border: selectedColor === '#FFFFFF' ? '5px solid #FB7185' : '3px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🧼</span>
          <span style={{ fontWeight: 'bold', color: selectedColor === '#FFFFFF' ? '#FB7185' : '#888' }}>지우개</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. 메인 애플리케이션 (Main App)
// ==========================================
const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'vocab' | 'coloring'>('home');

  return (
    <div className="no-select" style={{ width: '100vw', height: '100vh', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {view === 'home' && (
        <div style={{ 
          height: '100%', width: '100%', 
          backgroundImage: "url('/b1.png')", 
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex', flexDirection: 'column', 
          alignItems: 'center',
          padding: '40px 0' 
        }}>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1 style={{ fontSize: '65px', color: '#f472b6', fontWeight: '900', textShadow: '3px 3px 10px white' }}>✨ 마법 놀이터 ✨</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, width: '100%', maxWidth: '1100px', padding: '0 60px' }}>
            <button onClick={() => setView('vocab')} style={{ width: '260px', height: '330px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '50px', border: '5px solid #1565C0', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
              <span style={{ fontSize: '90px', marginBottom: '15px' }}>🧊</span>
              <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#1565C0' }}>단어 구출</span>
            </button>
            <button onClick={() => setView('coloring')} style={{ width: '260px', height: '330px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '50px', border: '5px solid #D81B60', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
              <span style={{ fontSize: '90px', marginBottom: '15px' }}>🎨</span>
              <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#D81B60' }}>색칠 놀이</span>
            </button>
          </div>
          <div style={{ height: '40px' }} />
        </div>
      )}
      {view === 'vocab' && <VocabView onBack={() => setView('home')} />}
      {view === 'coloring' && <ColoringView onBack={() => setView('home')} />}

      <style>{`
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
        @keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default App;