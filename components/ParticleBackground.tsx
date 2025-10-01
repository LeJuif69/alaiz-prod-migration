import React, { useRef, useEffect } from 'react';

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particlesArray: Particle[] = [];
        const numberOfParticles = 50;
        const musicSymbols = ['♩', '♪', '♫', '𝄞', '𝄢', '𝅘𝅥𝅮', '🎹', '🎷', '🎸', '🎤'];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;
            symbol: string;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string, symbol: string) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
                this.symbol = symbol;
            }

            draw() {
                if(!ctx) return;
                ctx.font = `${this.size}px "Times New Roman", serif`;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.8;
                ctx.fillText(this.symbol, this.x, this.y);
            }

            update() {
                if (this.x > canvas.width + this.size || this.x < -this.size) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height + this.size || this.y < -this.size) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 25 + 20; // Increased size again for more impact
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#D4AF37'; // alaiz-gold
                let symbol = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color, symbol));
            }
        }

        let animationFrameId: number;
        function animate() {
            if(!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        const handleResize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener('resize', handleResize);
        
        init();
        animate();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        }

    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default ParticleBackground;