with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Scaling in VocabView
old_vocab_move = """    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;"""

new_vocab_move = """    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;"""

if old_vocab_move in content:
    content = content.replace(old_vocab_move, new_vocab_move)
    print("Replaced VocabView handleMove scaling successfully")
else:
    print("Could not find old_vocab_move")

# Fix Scaling in ColoringView
old_coloring_fill = """    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = Math.floor(clientX - rect.left);
    const y = Math.floor(clientY - rect.top);"""

new_coloring_fill = """    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);"""

if old_coloring_fill in content:
    content = content.replace(old_coloring_fill, new_coloring_fill)
    print("Replaced ColoringView handleFill scaling successfully")
else:
    print("Could not find old_coloring_fill")

with open('src/App.tsx', 'w') as f:
    f.write(content)
