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
// 0. 마법 효과 배경 컴포넌트 (MagicDust)
// ==========================================
const MagicDust: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    const dusts = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 6}s`,
      size: `${4 + Math.random() * 8}px`
    }));
    setParticles(dusts);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 10px 3px rgba(255, 215, 0, 0.6), 0 0 20px 5px rgba(255, 105, 180, 0.4)',
            opacity: 0,
            animation: `float ${p.duration} ease-in-out infinite, sparkle ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// 1. 단어 구출 작전 (Vocab View)
// ==========================================
const VocabView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isMelted, setIsMelted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWord, setCurrentWord] = useState(WORD_POOL[0]);
  const [hairLevel, setHairLevel] = useState(0); 
  const [particles, setParticles] = useState<{id: number; x: number; y: number; color: string}[]>([]);
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

    // 빙판 다이아몬드 질감 배경
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, 'rgba(170, 230, 255, 0.8)');
    bgGradient.addColorStop(0.5, 'rgba(120, 200, 255, 0.95)');
    bgGradient.addColorStop(1, 'rgba(80, 180, 255, 0.9)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 하이라이트 광원 반사
    const shine = ctx.createRadialGradient(150, 150, 10, 250, 250, 300);
    shine.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 얼음 결정선(크랙) 효과 그리기
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 0); ctx.lineTo(250, 250); ctx.lineTo(150, 500);
    ctx.moveTo(400, 0); ctx.lineTo(250, 250); ctx.lineTo(500, 300);
    ctx.moveTo(0, 300); ctx.lineTo(250, 250);
    ctx.stroke();
  }, [currentWord, isMelted]);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isMelted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // 얼음 파편 파티클 추가
    if (Math.random() > 0.6) {
      const newParticle = { id: Date.now() + Math.random(), x: clientX, y: clientY, color: ['#FFFFFF', '#E0F7FA', '#B2EBF2', '#81D4FA'][Math.floor(Math.random() * 4)] };
      setParticles(prev => [...prev.slice(-15), newParticle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 500);
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 55, 0, Math.PI * 2);
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
      <button className="jelly-btn" onClick={onBack} style={{ position: 'absolute', top: '30px', left: '30px', padding: '12px 25px', borderRadius: '30px', background: 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)', border: '4px solid white', color: 'white', fontWeight: 'bold', cursor: 'pointer', zIndex: 100, boxShadow: '0 4px 15px rgba(244,114,182,0.5)' }}>🏠 홈으로</button>
      <div className="vocab-layout" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', boxSizing: 'border-box' }}>
        <div className="vocab-sidebar" style={{ width: '25%', zIndex: 10 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '2px solid white' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0 }}>단어 구출 중!</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '10px' }}>구출: {hairLevel} / 10</p>
          </div>
        </div>
        <div className="vocab-main" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          {isMelted && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 15, overflow: 'hidden' }}>
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}vw`,
                  top: `-10vh`,
                  width: `${8 + Math.random() * 15}px`,
                  height: `${8 + Math.random() * 15}px`,
                  backgroundColor: ['#FF69B4', '#FFD700', '#00BFFF', '#32CD32', '#FF4500'][Math.floor(Math.random() * 5)],
                  clipPath: Math.random() > 0.5 ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'circle(50% at 50% 50%)',
                  animation: `confettiFall ${2 + Math.random() * 3}s linear forwards`,
                  animationDelay: `${Math.random() * 0.5}s`
                }} />
              ))}
            </div>
          )}
          {particles.map(p => (
            <div key={p.id} style={{
              position: 'fixed',
              left: p.x - 10,
              top: p.y - 10,
              width: `${10 + Math.random() * 15}px`,
              height: `${10 + Math.random() * 15}px`,
              backgroundColor: p.color,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              transform: `rotate(${Math.random() * 360}deg)`,
              pointerEvents: 'none',
              zIndex: 9999,
              boxShadow: `0 0 15px ${p.color}`,
              animation: 'sparkle 0.5s ease-out forwards'
            }} />
          ))}
          <div className="canvas-wrapper" style={{ position: 'relative', width: '500px', height: '500px', borderRadius: '50%', border: isMelted ? 'none' : '12px solid rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isMelted ? 'transparent' : 'rgba(255,255,255,0.15)', transition: 'all 0.5s', overflow: 'hidden' }}>
            {isMelted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px', animation: 'pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                <div style={{ position: 'relative', animation: 'float 3s ease-in-out infinite' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0) 70%)', animation: 'pulse 2s infinite', zIndex: -1 }} />
                  <span style={{ fontSize: '180px', lineHeight: '1', margin: 0, display: 'block', textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>{currentWord.emoji}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <div style={{ backgroundColor: 'white', padding: '15px 60px', borderRadius: '40px', border: `6px solid ${currentWord.color}`, boxShadow: `0 10px 30px rgba(0,0,0,0.2), 0 0 40px 10px ${currentWord.color}66`, animation: 'halo 3s infinite' }}>
                    <p style={{ fontSize: '48px', fontWeight: '900', color: currentWord.color, margin: 0 }}>{currentWord.ko}</p>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 45px', borderRadius: '30px', border: '3px solid #cbd5e1', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '36px', fontWeight: '900', color: '#475569', margin: 0, letterSpacing: '2px' }}>{currentWord.en.toUpperCase()}</p>
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
        <div className="vocab-sidebar" style={{ width: '30%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <div style={{ position: 'relative', width: '350px', height: '650px' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/tower_hair.png')", backgroundSize: 'contain', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat', WebkitMaskImage: `linear-gradient(to bottom, black ${15 + hairLevel * 8}%, transparent ${25 + hairLevel * 8}%)`, maskImage: `linear-gradient(to bottom, black ${15 + hairLevel * 8}%, transparent ${25 + hairLevel * 8}%)`, transition: 'all 1.5s ease-in-out' }} />
          </div>
        </div>
        {isMelted && (
          <div style={{ position: 'absolute', bottom: '50px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
            <button className="jelly-btn" onClick={() => { setIsMelted(false); pickRandomWord(); }} style={{ padding: '20px 70px', borderRadius: '50px', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: 'white', fontSize: '28px', fontWeight: '900', border: '6px solid white', cursor: 'pointer', boxShadow: '0 10px 25px rgba(217,119,6,0.5)' }}>
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
  const [history, setHistory] = useState<ImageData[]>([]);

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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 채우기 전 현재 상태 저장 (최대 10개)
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const pixels = imageData.data;
    const startPos = (y * canvas.width + x) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];

    const r = parseInt(selectedColor.slice(1, 3), 16);
    const g = parseInt(selectedColor.slice(3, 5), 16);
    const b = parseInt(selectedColor.slice(5, 7), 16);
    const a = 255;

    // 검은색 선이거나 투명한 배경이거나 이미 같은 색이면 무시
    if ((startR === 0 && startG === 0 && startB === 0) || startA === 0 || (startR === r && startG === g && startB === b)) return;

    setHistory(prev => [...prev.slice(-4), currentImageData]); // 히스토리 최대 5개

    const matchStartColor = (pos: number) => {
      return pixels[pos] === startR && pixels[pos + 1] === startG && pixels[pos + 2] === startB && pixels[pos + 3] === startA;
    };

    const colorPixel = (pos: number) => {
      pixels[pos] = r;
      pixels[pos + 1] = g;
      pixels[pos + 2] = b;
      pixels[pos + 3] = a;
    };

    const q: [number, number][] = [[x, y]];
    let qIdx = 0;

    while (qIdx < q.length) {
      const [cx, cy] = q[qIdx++];
      let dy = cy;
      while (dy >= 0 && matchStartColor((dy * canvas.width + cx) * 4)) dy--;
      dy++;

      let l = false;
      let r_flag = false;

      while (dy < canvas.height && matchStartColor((dy * canvas.width + cx) * 4)) {
        colorPixel((dy * canvas.width + cx) * 4);

        if (cx > 0) {
          if (matchStartColor((dy * canvas.width + (cx - 1)) * 4)) {
            if (!l) {
              q.push([cx - 1, dy]);
              l = true;
            }
          } else if (l) {
            l = false;
          }
        }

        if (cx < canvas.width - 1) {
          if (matchStartColor((dy * canvas.width + (cx + 1)) * 4)) {
            if (!r_flag) {
              q.push([cx + 1, dy]);
              r_flag = true;
            }
          } else if (r_flag) {
            r_flag = false;
          }
        }
        dy++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="no-select coloring-layout" style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', backgroundImage: "url('/b2.png')", backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', padding: '25px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      <div className="coloring-sidebar" style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button className="jelly-btn" onClick={onBack} style={{ padding: '12px', borderRadius: '20px', background: 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)', border: '4px solid white', boxShadow: '0 4px 15px rgba(244,114,182,0.5)', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>🏠 홈으로</button>
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
        <div className="canvas-wrapper" style={{ border: '15px solid white', borderRadius: '40px', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', backgroundColor: 'white', overflow: 'hidden', position: 'relative' }}>
          <canvas ref={canvasRef} onClick={handleFill} onTouchStart={handleFill} style={{ cursor: 'pointer', display: isReady ? 'block' : 'none', borderRadius: '25px', touchAction: 'none' }} />
          {!isReady && <div style={{ width: '500px', height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FB7185', fontWeight: 'bold' }}>로딩 중... ✨</div>}
        </div>
      </div>
      <div className="coloring-tools" style={{ width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.85)', borderRadius: '30px', padding: '20px', marginLeft: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
        <h3 style={{ color: '#FB7185', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '900', textShadow: '0 2px 5px rgba(251,113,133,0.3)' }}>✨ 마법 물감 ✨</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px', overflowY: 'auto', padding: '10px 0' }}>
          {COLORING_COLORS.map(color => (
            <button className="jelly-btn" key={color} onClick={() => setSelectedColor(color)} style={{
              position: 'relative', width: '45px', height: '45px', borderRadius: '50%', backgroundColor: color,
              border: selectedColor === color ? '4px solid white' : '3px solid rgba(0,0,0,0.1)', cursor: 'pointer',
              boxShadow: selectedColor === color ? '0 0 15px rgba(251,113,133,0.6), inset 0 3px 5px rgba(255,255,255,0.8)' : 'inset 0 2px 5px rgba(255,255,255,0.5), 0 2px 5px rgba(0,0,0,0.1)',
              animation: selectedColor === color ? 'pulse 1.5s infinite' : 'none',
              transition: 'all 0.2s'
            }}>
              {selectedColor === color && <span style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', fontSize: '24px', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>👑</span>}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'center' }}>
          <button className="jelly-btn" onClick={() => setSelectedColor('#FFFFFF')} style={{ flex: 1, height: '55px', borderRadius: '20px', background: selectedColor === '#FFFFFF' ? 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)' : 'white', border: '4px solid white', boxShadow: selectedColor === '#FFFFFF' ? '0 5px 15px rgba(244,114,182,0.4)' : '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', animation: selectedColor === '#FFFFFF' ? 'pulse 1.5s infinite' : 'none' }}>
            <span style={{ fontSize: '24px' }}>🧼</span>
            <span style={{ fontWeight: '900', color: selectedColor === '#FFFFFF' ? 'white' : '#888' }}>지우개</span>
          </button>
          <button className="jelly-btn" onClick={() => {
            if (history.length > 0) {
              const prev = history[history.length - 1];
              const canvas = canvasRef.current!;
              const ctx = canvas.getContext('2d')!;
              ctx.putImageData(prev, 0, 0);
              setHistory(history.slice(0, -1));
            }
          }} style={{ width: '65px', height: '55px', borderRadius: '20px', background: history.length > 0 ? 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)' : '#e2e8f0', border: '4px solid white', boxShadow: history.length > 0 ? '0 5px 15px rgba(52,211,153,0.4)' : 'none', cursor: history.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', opacity: history.length > 0 ? 1 : 0.5 }}>
            <span style={{ fontSize: '24px' }}>↩️</span>
          </button>
        </div>
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
    <div className="no-select" style={{ position: 'relative', width: '100vw', height: '100vh', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <MagicDust />
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
          <div className="home-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, width: '100%', maxWidth: '1100px', padding: '0 60px', boxSizing: 'border-box' }}>
            <button className="jelly-btn" onClick={() => setView('vocab')} style={{ width: '260px', height: '330px', background: 'linear-gradient(135deg, #a7f3d0 0%, #60a5fa 100%)', borderRadius: '50px', border: '8px solid rgba(255,255,255,0.8)', boxShadow: '0 15px 35px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
              <span style={{ fontSize: '90px', marginBottom: '15px', textShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>🧊</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>단어 구출</span>
            </button>
            <button className="jelly-btn" onClick={() => setView('coloring')} style={{ width: '260px', height: '330px', background: 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)', borderRadius: '50px', border: '8px solid rgba(255,255,255,0.8)', boxShadow: '0 15px 35px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
              <span style={{ fontSize: '90px', marginBottom: '15px', textShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>🎨</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>색칠 놀이</span>
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

        /* 화려한 키프레임 애니메이션 */
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 113, 133, 0.7); } 50% { transform: scale(1.1); box-shadow: 0 0 20px 10px rgba(251, 113, 133, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 113, 133, 0); } }
        @keyframes float { 0% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(20px); } 100% { transform: translateY(0) translateX(0); } }
        @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes halo { 0% { box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.4); } 50% { box-shadow: 0 0 50px 15px rgba(255, 105, 180, 0.8); } 100% { box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.4); } }
        @keyframes confettiFall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }

        /* 젤리 버튼 스타일 */
        .jelly-btn {
          position: relative;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
          overflow: hidden;
        }
        .jelly-btn:active {
          transform: scale(0.92);
        }
        .jelly-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
          border-radius: inherit;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default App;