class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gameOver = false;
    }

    preload() {
        // No sprites needed for basic shapes
    }

    create() {
        // Create a simple colored background
        this.add.rectangle(400, 300, 800, 600, 0x2c3e50);
        
        // Create PHYSICS ground that players can actually stand on
        this.ground = this.add.rectangle(400, 500, 800, 20, 0x34495e);
        this.physics.add.existing(this.ground, true); // true = static body (doesn't move)
        
        // Add visual borders (these are just decoration)
        this.add.rectangle(400, 100, 800, 20, 0x34495e); // Top border
        this.add.rectangle(100, 300, 20, 400, 0x34495e); // Left border
        this.add.rectangle(700, 300, 20, 400, 0x34495e); // Right border

        // Create thicker invisible boundary walls for physics to catch high-speed knockback
        this.leftWall = this.add.rectangle(25, 300, 50, 400, 0x000000, 0); // Thicker invisible left wall
        this.rightWall = this.add.rectangle(775, 300, 50, 400, 0x000000, 0); // Thicker invisible right wall
        
        // Add physics bodies to the boundary walls
        this.physics.add.existing(this.leftWall, true); // true = static body
        this.physics.add.existing(this.rightWall, true); // true = static body

        // Create players as simple colored rectangles
        this.player1 = this.add.rectangle(100, 300, 32, 48, 0x00CED1); // Teal
        this.player2 = this.add.rectangle(700, 300, 32, 48, 0xFF6347); // Red
        
        // Add physics bodies to the rectangles
        this.physics.add.existing(this.player1);
        this.physics.add.existing(this.player2);

        // Set up player animation states
        this.setupPlayerAnimations();

        // Set up player properties
        [this.player1, this.player2].forEach(player => {
            player.body.setCollideWorldBounds(false); // Don't use world bounds, use actual ground
            player.body.setGravityY(300);
            player.body.setSize(24, 48);
            // Enable continuous collision detection for high-speed collisions
            player.body.setImmovable(false);
            player.body.setBounce(0.2); // Small bounce when hitting walls
        });

        // Set up movement physics properties
        this.acceleration = 400; // Reduced from 800 for more controlled movement
        this.deceleration = 600; // How quickly players slow down
        this.maxSpeed = 400; // Maximum movement speed (but not hard capped)
        
        // Add collision between players and ground
        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);
        
        // Add collision between players and boundary walls
        this.physics.add.collider(this.player1, this.leftWall);
        this.physics.add.collider(this.player1, this.rightWall);
        this.physics.add.collider(this.player2, this.leftWall);
        this.physics.add.collider(this.player2, this.rightWall);

        // No animations needed for simple rectangles

        // Set up health
        this.player1Health = 100;
        this.player2Health = 100;

        // Set up cooldowns
        this.attackCooldown = 0;
        this.attackCooldownTime = 500; // 500ms cooldown

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Player 2 input keys
        this.player2Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.player2Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.player2Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.player2AttackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // Add restart key
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Create end screen elements (initially hidden)
        this.createEndScreen();

        // Create attack flash overlay (initially hidden)
        this.createAttackFlash();
    }

    setupPlayerAnimations() {
        // Initialize animation states for both players
        this.player1AnimState = 'idle';
        this.player2AnimState = 'idle';
        
        // Animation timers
        this.player1AnimTimer = 0;
        this.player2AnimTimer = 0;
        
        // Animation speeds
        this.idleAnimSpeed = 1000; // 1 second
        this.walkAnimSpeed = 200;  // 0.2 seconds
        this.jumpAnimSpeed = 300;  // 0.3 seconds
        this.attackAnimSpeed = 150; // 0.15 seconds
    }

    createEndScreen() {
        // Create a semi-transparent overlay
        this.endOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.endOverlay.setVisible(false);

        // Create winner text
        this.winnerText = this.add.text(400, 250, '', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        this.winnerText.setOrigin(0.5);
        this.winnerText.setVisible(false);

        // Create restart instruction text
        this.restartText = this.add.text(400, 350, 'Press R to restart', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        this.restartText.setOrigin(0.5);
        this.restartText.setVisible(false);
    }

    createAttackFlash() {
        // Create a flash overlay that covers the entire screen
        this.attackFlash = this.add.rectangle(400, 300, 800, 600, 0xFFFFFF, 0);
        this.attackFlash.setVisible(false);
        this.attackFlash.setDepth(1000); // Make sure it's on top of everything
    }

    triggerAttackFlash(attackerPlayer) {
        // Set flash color based on attacking player
        let flashColor;
        if (attackerPlayer === this.player1) {
            flashColor = 0x00CED1; // Teal for Player 1
        } else {
            flashColor = 0xFF6347; // Red for Player 2
        }
        
        // Set the flash color and make it visible
        this.attackFlash.setFillStyle(flashColor, 0.3); // 30% opacity
        this.attackFlash.setVisible(true);
        
        // Fade out the flash over 150ms
        this.tweens.add({
            targets: this.attackFlash,
            alpha: 0,
            duration: 150,
            ease: 'Power2',
            onComplete: () => {
                this.attackFlash.setVisible(false);
                this.attackFlash.alpha = 1; // Reset alpha for next flash
            }
        });
    }

    showEndScreen(winner) {
        this.gameOver = true;
        
        // Stop all player movement
        this.player1.body.setVelocity(0, 0);
        this.player2.body.setVelocity(0, 0);
        
        // Show end screen
        this.endOverlay.setVisible(true);
        this.winnerText.setText(`${winner} Wins!`);
        this.winnerText.setVisible(true);
        this.restartText.setVisible(true);
    }

    hideEndScreen() {
        this.gameOver = false;
        this.endOverlay.setVisible(false);
        this.winnerText.setVisible(false);
        this.restartText.setVisible(false);
    }

    restartGame() {
        // Reset health
        this.player1Health = 100;
        this.player2Health = 100;
        
        // Reset player positions
        this.player1.setPosition(100, 300);
        this.player2.setPosition(700, 300);
        
        // Reset velocities
        this.player1.body.setVelocity(0, 0);
        this.player2.body.setVelocity(0, 0);
        
        // Hide end screen
        this.hideEndScreen();
        
        // Update health display
        document.getElementById('player1-health').textContent = `P1: ${this.player1Health}%`;
        document.getElementById('player2-health').textContent = `P2: ${this.player2Health}%`;
    }

    update(time, delta) {
        // Check for restart
        if (this.restartKey.isDown && this.gameOver) {
            this.restartGame();
            return;
        }

        // If game is over, don't process other updates
        if (this.gameOver) {
            return;
        }

        // Check for game over condition
        if (this.player1Health <= 0 || this.player2Health <= 0) {
            const winner = this.player1Health <= 0 ? 'Player 2' : 'Player 1';
            this.showEndScreen(winner);
            return;
        }

        // Handle player 1 movement with acceleration
        if (this.cursors.left.isDown) {
            this.player1.body.setAccelerationX(-this.acceleration);
            if (this.player1AnimState !== 'jumping' && this.player1AnimState !== 'attacking') {
                this.player1AnimState = 'walking';
            }
        }
        else if (this.cursors.right.isDown) {
            this.player1.body.setAccelerationX(this.acceleration);
            if (this.player1AnimState !== 'jumping' && this.player1AnimState !== 'attacking') {
                this.player1AnimState = 'walking';
            }
        }
        else {
            // Apply deceleration when no keys are pressed
            this.player1.body.setAccelerationX(0);
            if (this.player1.body.velocity.x > 0) {
                this.player1.body.setVelocityX(Math.max(0, this.player1.body.velocity.x - this.deceleration * delta / 1000));
            } else if (this.player1.body.velocity.x < 0) {
                this.player1.body.setVelocityX(Math.min(0, this.player1.body.velocity.x + this.deceleration * delta / 1000));
            }
            if (this.player1AnimState !== 'jumping' && this.player1AnimState !== 'attacking') {
                this.player1AnimState = 'idle';
            }
        }

        // Handle player 2 movement with acceleration (using WASD)
        if (this.player2Left.isDown) {
            this.player2.body.setAccelerationX(-this.acceleration);
            if (this.player2AnimState !== 'jumping' && this.player2AnimState !== 'attacking') {
                this.player2AnimState = 'walking';
            }
        }
        else if (this.player2Right.isDown) {
            this.player2.body.setAccelerationX(this.acceleration);
            if (this.player2AnimState !== 'jumping' && this.player2AnimState !== 'attacking') {
                this.player2AnimState = 'walking';
            }
        }
        else {
            // Apply deceleration when no keys are pressed
            this.player2.body.setAccelerationX(0);
            if (this.player2.body.velocity.x > 0) {
                this.player2.body.setVelocityX(Math.max(0, this.player2.body.velocity.x - this.deceleration * delta / 1000));
            } else if (this.player2.body.velocity.x < 0) {
                this.player2.body.setVelocityX(Math.min(0, this.player2.body.velocity.x + this.deceleration * delta / 1000));
            }
            if (this.player2AnimState !== 'jumping' && this.player2AnimState !== 'attacking') {
                this.player2AnimState = 'idle';
            }
        }

        // Handle jumping
        if (this.cursors.up.isDown && this.player1.body.touching.down) {
            this.player1.body.setVelocityY(-300);
            this.player1AnimState = 'jumping';
        }
        if (this.player2Up.isDown && this.player2.body.touching.down) {
            this.player2.body.setVelocityY(-300);
            this.player2AnimState = 'jumping';
        }

        // Reset jump animation when landing
        if (this.player1.body.touching.down && this.player1AnimState === 'jumping') {
            this.player1AnimState = 'idle';
        }
        if (this.player2.body.touching.down && this.player2AnimState === 'jumping') {
            this.player2AnimState = 'idle';
        }
        
        // Debug: Check if physics bodies are working
        if (this.cursors.up.isDown) {
            console.log('Player 1 touching ground:', this.player1.body.touching.down);
        }
        if (this.player2Up.isDown) {
            console.log('Player 2 touching ground:', this.player2.body.touching.down);
        }

        // Handle attacks
        if (this.attackKey.isDown && this.attackCooldown <= 0) {
            this.attack(this.player1, this.player2);
            this.attackCooldown = this.attackCooldownTime;
            this.player1AnimState = 'attacking';
            this.player1AnimTimer = 0;
        }
        
        // Handle Player 2 attacks
        if (this.player2AttackKey.isDown && this.attackCooldown <= 0) {
            this.attack(this.player2, this.player1);
            this.attackCooldown = this.attackCooldownTime;
            this.player2AnimState = 'attacking';
            this.player2AnimTimer = 0;
        }

        // Update cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }

        // Update health display
        document.getElementById('player1-health').textContent = `P1: ${this.player1Health}%`;
        document.getElementById('player2-health').textContent = `P2: ${this.player2Health}%`;

        // Update animations
        this.updateAnimations(delta);

        // Safety check: Enforce arena boundaries as backup
        this.enforceArenaBoundaries();
    }

    enforceArenaBoundaries() {
        // Left boundary (minimum X position)
        const minX = 75; // Leave some padding after the wall
        // Right boundary (maximum X position)  
        const maxX = 725; // Leave some padding before the wall

        // Check and correct Player 1 position
        if (this.player1.x < minX) {
            this.player1.x = minX;
            this.player1.body.setVelocityX(Math.max(0, this.player1.body.velocity.x)); // Stop leftward velocity
        }
        if (this.player1.x > maxX) {
            this.player1.x = maxX;
            this.player1.body.setVelocityX(Math.min(0, this.player1.body.velocity.x)); // Stop rightward velocity
        }

        // Check and correct Player 2 position
        if (this.player2.x < minX) {
            this.player2.x = minX;
            this.player2.body.setVelocityX(Math.max(0, this.player2.body.velocity.x)); // Stop leftward velocity
        }
        if (this.player2.x > maxX) {
            this.player2.x = maxX;
            this.player2.body.setVelocityX(Math.min(0, this.player2.body.velocity.x)); // Stop rightward velocity
        }
    }

    attack(attacker, defender) {
        // Check if players are close enough to attack (distance-based)
        const distance = Phaser.Math.Distance.Between(
            attacker.x, attacker.y,
            defender.x, defender.y
        );
        
        // Attack range is 50 pixels
        if (distance < 50) {
            // Trigger attack flash effect based on attacker's color
            this.triggerAttackFlash(attacker);
            
            // Damage calculation
            const damage = 10;
            
            // Enhanced knockback effect - push defender based on attack direction
            let knockbackDirection;
            
            // Determine knockback direction based on attack side
            if (attacker.x < defender.x) {
                // Attacker is on the left, push defender to the right
                knockbackDirection = 1;
            } else {
                // Attacker is on the right, push defender to the left
                knockbackDirection = -1;
            }
            
            // Extreme knockback force with dramatic distance-based scaling
            const baseKnockbackForce = 1200; // Increased from 800 for more extreme horizontal knockback
            const upwardForce = -300; // Keep vertical knockback the same
            
            // Dramatic distance-based knockback scaling
            // Close hits = MASSIVE knockback, far hits = still strong knockback
            const distanceFactor = Math.max(0.8, Math.min(2.0, (50 - distance) / 25));
            const knockbackForce = baseKnockbackForce * distanceFactor;
            
            // Apply extreme horizontal and vertical knockback
            defender.body.setVelocityX(knockbackDirection * knockbackForce);
            defender.body.setVelocityY(upwardForce);
            
            // Add extra dramatic effects for extreme knockback
            // Slight random spin effect for more chaotic feel
            const spinForce = Phaser.Math.Between(-50, 50);
            defender.body.setAngularVelocity(spinForce);
            
            // Reset rotation after a short delay to prevent permanent spinning
            this.time.delayedCall(500, () => {
                defender.body.setAngularVelocity(0);
                defender.rotation = 0;
            });
            
            // Update health
            if (attacker === this.player1) {
                this.player2Health = Math.max(0, this.player2Health - damage);
                console.log('Player 1 attacked! Player 2 health:', this.player2Health);
            } else {
                this.player1Health = Math.max(0, this.player1Health - damage);
                console.log('Player 2 attacked! Player 1 health:', this.player1Health);
            }
        }
    }

    updateAnimations(delta) {
        // Update Player 1 animations
        this.updatePlayerAnimation(this.player1, this.player1AnimState, this.player1AnimTimer, delta, 'player1');
        
        // Update Player 2 animations
        this.updatePlayerAnimation(this.player2, this.player2AnimState, this.player2AnimTimer, delta, 'player2');
    }

    updatePlayerAnimation(player, animState, animTimer, delta, playerType) {
        // Update animation timer
        if (playerType === 'player1') {
            this.player1AnimTimer += delta;
            animTimer = this.player1AnimTimer;
        } else {
            this.player2AnimTimer += delta;
            animTimer = this.player2AnimTimer;
        }
        
        // Apply different animations based on state
        switch (animState) {
            case 'idle':
                this.playIdleAnimation(player, animTimer, playerType);
                break;
            case 'walking':
                this.playWalkingAnimation(player, animTimer, playerType);
                break;
            case 'jumping':
                this.playJumpingAnimation(player, animTimer, playerType);
                break;
            case 'attacking':
                this.playAttackAnimation(player, animTimer, playerType);
                // Reset attack state after animation completes
                if (animTimer >= this.attackAnimSpeed) {
                    if (playerType === 'player1') {
                        this.player1AnimState = 'idle';
                    } else {
                        this.player2AnimState = 'idle';
                    }
                }
                break;
        }
    }

    playIdleAnimation(player, timer, playerType) {
        // Very subtle breathing/bobbing animation
        const bobAmount = Math.sin(timer / 1000) * 1;
        player.setScale(1 + bobAmount * 0.005, 1 + bobAmount * 0.005);
        
        // Very subtle color pulsing
        const colorIntensity = Math.sin(timer / 1500) * 0.1 + 0.9;
        if (playerType === 'player1') {
            player.setFillStyle(0x00CED1, colorIntensity);
        } else {
            player.setFillStyle(0xFF6347, colorIntensity);
        }
    }

    playWalkingAnimation(player, timer, playerType) {
        // Walking bounce animation - much more subtle
        const bounceHeight = Math.sin(timer / this.walkAnimSpeed * Math.PI * 2) * 1;
        // Don't change the actual Y position, just use it for visual effect
        
        // Slight horizontal squashing when landing - more subtle
        const squashAmount = Math.abs(Math.sin(timer / this.walkAnimSpeed * Math.PI * 2)) * 0.05;
        player.setScale(1 + squashAmount, 1 - squashAmount);
    }

    playJumpingAnimation(player, timer, playerType) {
        // Jumping stretch animation - more subtle
        const stretchAmount = Math.sin(timer / this.jumpAnimSpeed * Math.PI) * 0.1;
        player.setScale(1 - stretchAmount, 1 + stretchAmount);
        
        // Subtle color change during jump (not full flash)
        if (playerType === 'player1') {
            const colorIntensity = 0.8 + Math.sin(timer / 200) * 0.2;
            player.setFillStyle(0x00CED1, colorIntensity);
        } else {
            const colorIntensity = 0.8 + Math.sin(timer / 200) * 0.2;
            player.setFillStyle(0xFF6347, colorIntensity);
        }
    }

    playAttackAnimation(player, timer, playerType) {
        // Attack stretch and flash
        const attackProgress = timer / this.attackAnimSpeed;
        if (attackProgress < 1) {
            // Stretch horizontally during attack - more subtle
            const stretchAmount = Math.sin(attackProgress * Math.PI) * 0.15;
            player.setScale(1 + stretchAmount, 1 - stretchAmount * 0.3);
            
            // Subtle color flash during attack
            const flashIntensity = 0.7 + Math.sin(attackProgress * Math.PI) * 0.3;
            if (playerType === 'player1') {
                player.setFillStyle(0x00CED1, flashIntensity);
            } else {
                player.setFillStyle(0xFF6347, flashIntensity);
            }
        }
    }
}

// Create game instance
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);
