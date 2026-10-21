with open('src/App.css', 'r') as f:
    content = f.read()

new_css = """

/* 반응형 (패드/PC 가로 모드) */
@media (max-width: 1024px) {
  .vocab-layout, .coloring-layout {
    flex-direction: column !important;
    overflow-y: auto !important;
    padding: 20px !important;
    gap: 20px !important;
  }
  .vocab-sidebar, .coloring-sidebar, .coloring-tools {
    width: 100% !important;
    max-width: 500px !important;
    height: auto !important;
    margin: 0 !important;
  }
  .canvas-wrapper {
    width: 100% !important;
    max-width: 500px !important;
    height: auto !important;
    aspect-ratio: 1/1 !important;
  }
  .canvas-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
  }
  .home-buttons {
    flex-direction: column !important;
    gap: 30px !important;
  }
}

/* 반응형 (스마트폰 세로 모드) */
@media (max-width: 768px) {
  .vocab-layout, .coloring-layout {
    padding: 10px !important;
    gap: 15px !important;
  }
  .jelly-btn {
    padding: 10px 15px !important;
    font-size: 16px !important;
  }
}
"""

with open('src/App.css', 'w') as f:
    f.write(content + new_css)

with open('src/App.tsx', 'r') as f:
    tsx_content = f.read()

# ColoringView Layout classes
tsx_content = tsx_content.replace(
    """<div className="no-select" style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', backgroundImage: "url('/b2.png')", backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', padding: '25px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>""",
    """<div className="no-select coloring-layout" style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', backgroundImage: "url('/b2.png')", backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', padding: '25px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>"""
)

tsx_content = tsx_content.replace(
    """<div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '15px' }}>""",
    """<div className="coloring-sidebar" style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '15px' }}>"""
)

tsx_content = tsx_content.replace(
    """<div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>\n        <div style={{ border: '15px solid white', borderRadius: '40px', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', backgroundColor: 'white', overflow: 'hidden' }}>""",
    """<div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>\n        <div className="canvas-wrapper" style={{ border: '15px solid white', borderRadius: '40px', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', backgroundColor: 'white', overflow: 'hidden', position: 'relative' }}>"""
)

tsx_content = tsx_content.replace(
    """<div style={{ width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.85)', borderRadius: '30px', padding: '20px', marginLeft: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>""",
    """<div className="coloring-tools" style={{ width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.85)', borderRadius: '30px', padding: '20px', marginLeft: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>"""
)

# VocabView Layout classes
tsx_content = tsx_content.replace(
    """<div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px' }}>""",
    """<div className="vocab-layout" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', boxSizing: 'border-box' }}>"""
)

tsx_content = tsx_content.replace(
    """<div style={{ width: '25%', zIndex: 10 }}>""",
    """<div className="vocab-sidebar" style={{ width: '25%', zIndex: 10 }}>"""
)

tsx_content = tsx_content.replace(
    """<div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>""",
    """<div className="vocab-main" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>"""
)

tsx_content = tsx_content.replace(
    """<div style={{ width: '30%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>""",
    """<div className="vocab-sidebar" style={{ width: '30%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>"""
)

tsx_content = tsx_content.replace(
    """<div style={{ position: 'relative', width: '500px', height: '500px', borderRadius: '50%', border: isMelted ? 'none' : '12px solid rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isMelted ? 'transparent' : 'rgba(255,255,255,0.15)', transition: 'all 0.5s' }}>""",
    """<div className="canvas-wrapper" style={{ position: 'relative', width: '500px', height: '500px', borderRadius: '50%', border: isMelted ? 'none' : '12px solid rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isMelted ? 'transparent' : 'rgba(255,255,255,0.15)', transition: 'all 0.5s', overflow: 'hidden' }}>"""
)

# Home Layout classes
tsx_content = tsx_content.replace(
    """<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, width: '100%', maxWidth: '1100px', padding: '0 60px' }}>""",
    """<div className="home-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, width: '100%', maxWidth: '1100px', padding: '0 60px', boxSizing: 'border-box' }}>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(tsx_content)

print("Layout classes applied in TSX and App.css updated.")
