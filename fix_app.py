import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix flood fill and history logic
old_fill = """    const data = new Uint32Array(imageData.data.buffer);
    const targetColor = data[y * canvas.width + x];
    const r = parseInt(selectedColor.slice(1, 3), 16), g = parseInt(selectedColor.slice(3, 5), 16), b = parseInt(selectedColor.slice(5, 7), 16);
    const fillColor = (255 << 24) | (b << 16) | (g << 8) | r;
    if (targetColor === fillColor || (targetColor & 0xFFFFFF) === 0) return;

    setHistory(prev => [...prev.slice(-9), currentImageData]);

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
    }"""

new_fill = """    const pixels = imageData.data;
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
    }"""

if old_fill in content:
    content = content.replace(old_fill, new_fill)
    print("Replaced flood fill successfully")
else:
    print("Could not find old_fill block")

with open('src/App.tsx', 'w') as f:
    f.write(content)
