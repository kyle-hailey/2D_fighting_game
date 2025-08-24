const canvas = document.createElement('canvas');
canvas.width = 320; // 10 frames * 32px
canvas.height = 64;
const ctx = canvas.getContext('2d');

// Create a simple placeholder sprite
function createSpriteFrame(x, y) {
    ctx.fillStyle = x % 2 === 0 ? '#4CAF50' : '#2196F3';
    ctx.fillRect(x, y, 32, 64);
    
    // Add some details to make it look like a character
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 8, y + 8, 16, 8); // Head
    ctx.fillRect(x + 12, y + 24, 8, 16); // Body
    ctx.fillRect(x + 4, y + 40, 8, 16); // Left leg
    ctx.fillRect(x + 20, y + 40, 8, 16); // Right leg
}

// Create 10 frames for animation
for (let i = 0; i < 10; i++) {
    createSpriteFrame(i * 32, 0);
}

// Save the canvas as PNG
const link = document.createElement('a');
link.download = 'fighter-sprite.png';
link.href = canvas.toDataURL();
link.click();
