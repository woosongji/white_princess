with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Ice Canvas initialization
old_canvas_init = """    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(225, 225, 30, 225, 225, 225);
    gradient.addColorStop(0, 'rgba(210, 245, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(170, 230, 255, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);"""

new_canvas_init = """    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    ctx.stroke();"""

if old_canvas_init in content:
    content = content.replace(old_canvas_init, new_canvas_init)
    print("Replaced Ice canvas init successfully")
else:
    print("Could not find old_canvas_init")

# Fix Particle colors and shapes
old_particle_spawn = """    // 마법 타격감 파티클 추가
    if (Math.random() > 0.6) {
      const newParticle = { id: Date.now() + Math.random(), x: clientX, y: clientY, color: ['#FFF', '#FFD700', '#87CEFA', '#FF69B4'][Math.floor(Math.random() * 4)] };"""

new_particle_spawn = """    // 얼음 파편 파티클 추가
    if (Math.random() > 0.6) {
      const newParticle = { id: Date.now() + Math.random(), x: clientX, y: clientY, color: ['#FFFFFF', '#E0F7FA', '#B2EBF2', '#81D4FA'][Math.floor(Math.random() * 4)] };"""

if old_particle_spawn in content:
    content = content.replace(old_particle_spawn, new_particle_spawn)
    print("Replaced particle spawn successfully")
else:
    print("Could not find old_particle_spawn")

old_particle_render = """          {particles.map(p => (
            <div key={p.id} style={{
              position: 'fixed',
              left: p.x - 10,
              top: p.y - 10,
              width: '20px',
              height: '20px',
              backgroundColor: p.color,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9999,
              boxShadow: `0 0 10px ${p.color}`,
              animation: 'sparkle 0.5s ease-out forwards'
            }} />
          ))}"""

new_particle_render = """          {particles.map(p => (
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
          ))}"""

if old_particle_render in content:
    content = content.replace(old_particle_render, new_particle_render)
    print("Replaced particle render successfully")
else:
    print("Could not find old_particle_render")

with open('src/App.tsx', 'w') as f:
    f.write(content)
