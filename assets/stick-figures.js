// Stick Figure Graphics Generator
class StickFigureGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 32;
        this.canvas.height = 48;
    }

    // Generate a stick figure facing right (default)
    generateStickFigure(color = '#ffffff', isPlayer2 = false, direction = 'right') {
        this.ctx.clearRect(0, 0, 32, 48);
        
        // Set color
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        
        if (direction === 'left') {
            // Head
            this.ctx.beginPath();
            this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Body
            this.ctx.beginPath();
            this.ctx.moveTo(16, 14);
            this.ctx.lineTo(16, 32);
            this.ctx.stroke();
            
            // Arms (left-facing)
            this.ctx.beginPath();
            this.ctx.moveTo(8, 20);
            this.ctx.lineTo(24, 20);
            this.ctx.stroke();
            
            // Legs
            this.ctx.beginPath();
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(10, 42);
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(22, 42);
            this.ctx.stroke();
            
            // Eyes (left-facing)
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(12, 6, 1, 0, Math.PI * 2);
            this.ctx.arc(16, 6, 1, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Head
            this.ctx.beginPath();
            this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Body
            this.ctx.beginPath();
            this.ctx.moveTo(16, 14);
            this.ctx.lineTo(16, 32);
            this.ctx.stroke();
            
            // Arms (right-facing)
            this.ctx.beginPath();
            this.ctx.moveTo(8, 20);
            this.ctx.lineTo(24, 20);
            this.ctx.stroke();
            
            // Legs
            this.ctx.beginPath();
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(10, 42);
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(22, 42);
            this.ctx.stroke();
            
            // Eyes (right-facing)
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(14, 6, 1, 0, Math.PI * 2);
            this.ctx.arc(18, 6, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Player indicator
        this.ctx.fillStyle = isPlayer2 ? '#ff6b6b' : '#4ecdc4';
        this.ctx.fillRect(0, 0, 32, 4);
        
        // Add player number
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isPlayer2 ? '2' : '1', 16, 6);
        
        return this.canvas;
    }

    // Generate left-facing stick figure
    generateLeftFacingStickFigure(color = '#ffffff', isPlayer2 = false) {
        return this.generateStickFigure(color, isPlayer2, 'left');
    }

    // Generate right-facing stick figure
    generateRightFacingStickFigure(color = '#ffffff', isPlayer2 = false) {
        return this.generateStickFigure(color, isPlayer2, 'right');
    }

    // Generate walking animation frames for a specific direction
    generateWalkFrames(color = '#ffffff', isPlayer2 = false, direction = 'right') {
        const frames = [];
        
        // Frame 1: Normal stance
        frames.push(this.generateStickFigure(color, isPlayer2, direction));
        
        // Frame 2: Arms up slightly
        this.ctx.clearRect(0, 0, 32, 48);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        
        if (direction === 'left') {
            // Head
            this.ctx.beginPath();
            this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Body
            this.ctx.beginPath();
            this.ctx.moveTo(16, 14);
            this.ctx.lineTo(16, 32);
            this.ctx.stroke();
            
            // Arms up (left-facing)
            this.ctx.beginPath();
            this.ctx.moveTo(8, 18);
            this.ctx.lineTo(24, 18);
            this.ctx.stroke();
            
            // Legs
            this.ctx.beginPath();
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(10, 42);
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(22, 42);
            this.ctx.stroke();
            
            // Eyes (left-facing)
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(12, 6, 1, 0, Math.PI * 2);
            this.ctx.arc(16, 6, 1, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Head
            this.ctx.beginPath();
            this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Body
            this.ctx.beginPath();
            this.ctx.moveTo(16, 14);
            this.ctx.lineTo(16, 32);
            this.ctx.stroke();
            
            // Arms up (right-facing)
            this.ctx.beginPath();
            this.ctx.moveTo(8, 18);
            this.ctx.lineTo(24, 18);
            this.ctx.stroke();
            
            // Legs
            this.ctx.beginPath();
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(10, 42);
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(22, 42);
            this.ctx.stroke();
            
            // Eyes (right-facing)
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(14, 6, 1, 0, Math.PI * 2);
            this.ctx.arc(18, 6, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Player indicator
        this.ctx.fillStyle = isPlayer2 ? '#ff6b6b' : '#4ecdc4';
        this.ctx.fillRect(0, 0, 32, 4);
        
        // Add player number
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isPlayer2 ? '2' : '1', 16, 6);
        
        frames.push(this.canvas.cloneNode());
        
        // Frame 3: Arms down slightly
        this.ctx.clearRect(0, 0, 32, 48);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        
        if (direction === 'left') {
            // Head
            this.ctx.beginPath();
            this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Body
            this.ctx.beginPath();
            this.ctx.moveTo(16, 14);
            this.ctx.lineTo(16, 32);
            this.ctx.stroke();
            
            // Arms down (left-facing)
            this.ctx.beginPath();
            this.ctx.moveTo(8, 22);
            this.ctx.lineTo(24, 22);
            this.ctx.stroke();
            
            // Legs
            this.ctx.beginPath();
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(10, 42);
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(22, 42);
            this.ctx.stroke();
            
            // Eyes (left-facing)
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(12, 6, 1, 0, Math.PI * 2);
            this.ctx.arc(16, 6, 1, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Head
            this.ctx.beginPath();
            this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Body
            this.ctx.beginPath();
            this.ctx.moveTo(16, 14);
            this.ctx.lineTo(16, 32);
            this.ctx.stroke();
            
            // Arms down (right-facing)
            this.ctx.beginPath();
            this.ctx.moveTo(8, 22);
            this.ctx.lineTo(24, 22);
            this.ctx.stroke();
            
            // Legs
            this.ctx.beginPath();
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(10, 42);
            this.ctx.moveTo(16, 32);
            this.ctx.lineTo(22, 42);
            this.ctx.stroke();
            
            // Eyes (right-facing)
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(14, 6, 1, 0, Math.PI * 2);
            this.ctx.arc(18, 6, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Player indicator
        this.ctx.fillStyle = isPlayer2 ? '#ff6b6b' : '#4ecdc4';
        this.ctx.fillRect(0, 0, 32, 4);
        
        frames.push(this.canvas.cloneNode());
        
        return frames;
    }

    // Generate attack animation frames
    generateAttackFrames(color = '#ffffff', isPlayer2 = false) {
        const frames = [];
        
        // Frame 1: Wind up
        this.ctx.clearRect(0, 0, 32, 48);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        
        // Head
        this.ctx.beginPath();
        this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Body
        this.ctx.beginPath();
        this.ctx.moveTo(16, 14);
        this.ctx.lineTo(16, 32);
        this.ctx.stroke();
        
        // Arms back
        this.ctx.beginPath();
        this.ctx.moveTo(4, 20);
        this.ctx.lineTo(20, 20);
        this.ctx.stroke();
        
        // Legs
        this.ctx.beginPath();
        this.ctx.moveTo(16, 32);
        this.ctx.lineTo(10, 42);
        this.ctx.moveTo(16, 32);
        this.ctx.lineTo(22, 42);
        this.ctx.stroke();
        
        // Eyes
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(14, 6, 1, 0, Math.PI * 2);
        this.ctx.arc(18, 6, 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player indicator
        this.ctx.fillStyle = isPlayer2 ? '#ff6b6b' : '#4ecdc4';
        this.ctx.fillRect(0, 0, 32, 4);
        
        // Add player number
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isPlayer2 ? '2' : '1', 16, 6);
        
        frames.push(this.canvas.cloneNode());
        
        // Frame 2: Attack
        this.ctx.clearRect(0, 0, 32, 48);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = color;
        
        // Head
        this.ctx.beginPath();
        this.ctx.arc(16, 8, 6, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Body
        this.ctx.beginPath();
        this.ctx.moveTo(16, 14);
        this.ctx.lineTo(16, 32);
        this.ctx.stroke();
        
        // Arms forward
        this.ctx.beginPath();
        this.ctx.moveTo(12, 20);
        this.ctx.lineTo(28, 20);
        this.ctx.stroke();
        
        // Legs
        this.ctx.beginPath();
        this.ctx.moveTo(16, 32);
        this.ctx.lineTo(10, 42);
        this.ctx.moveTo(16, 32);
        this.ctx.lineTo(22, 42);
        this.ctx.stroke();
        
        // Eyes
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(14, 6, 1, 0, Math.PI * 2);
        this.ctx.arc(18, 6, 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player indicator
        this.ctx.fillStyle = isPlayer2 ? '#ff6b6b' : '#4ecdc4';
        this.ctx.fillRect(0, 0, 32, 4);
        
        // Add player number
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isPlayer2 ? '2' : '1', 16, 6);
        
        frames.push(this.canvas.cloneNode());
        
        return frames;
    }
}

// Export for use in the game
window.StickFigureGenerator = StickFigureGenerator; 