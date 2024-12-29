'use client';

import { useEffect, useRef, useState } from 'react';
import TemperatureScale from './temperature-scale';

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    temperature: number;
    baseSpeed: number;

    static readonly MIN_SPEED = 0;
    static readonly MAX_SPEED = 6; // Reduced maximum speed

    constructor(x: number, y: number, temperature: number) {
        this.x = x;
        this.y = y;
        this.temperature = temperature;
        this.radius = 6;

        // const speedScale = Math.min(window.innerWidth / 1920, 1);
        const speedScale = 1.0;
        const angle = Math.random() * 2 * Math.PI;
        this.baseSpeed = Math.sqrt(-2 * Math.log(Math.random())) * speedScale;
        const currentSpeed = this.baseSpeed * Math.sqrt(temperature); // Changed from pow(1.5) to sqrt for smoother scaling
        this.vx = currentSpeed * Math.cos(angle);
        this.vy = currentSpeed * Math.sin(angle);
    }

    getColor(): string {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const normalizedSpeed = Math.min(
            Math.max((speed - Particle.MIN_SPEED) / (Particle.MAX_SPEED - Particle.MIN_SPEED), 0),
            1
        );

        // Modified color stops with reduced red spectrum and earlier orange transition
        const colors = [
            { pos: 0, h: 20, s: 90, l: 35 },     // Warm orange-red
            { pos: 0.3, h: 30, s: 100, l: 45 },  // Orange
            { pos: 0.5, h: 40, s: 100, l: 50 },  // Bright orange
            { pos: 0.7, h: 45, s: 90, l: 55 },   // Orange-yellow
            { pos: 0.85, h: 50, s: 85, l: 60 },  // Light orange
            { pos: 1, h: 55, s: 80, l: 65 }      // Pale orange
        ];

        // Find colors to interpolate between
        let lower = colors[0];
        let upper = colors[colors.length - 1];

        for (let i = 0; i < colors.length - 1; i++) {
            if (normalizedSpeed >= colors[i].pos && normalizedSpeed <= colors[i + 1].pos) {
                lower = colors[i];
                upper = colors[i + 1];
                break;
            }
        }

        // Interpolate between colors
        const range = upper.pos - lower.pos;
        const normalizedPos = (normalizedSpeed - lower.pos) / range;

        const h = lower.h + (upper.h - lower.h) * normalizedPos;
        const s = lower.s + (upper.s - lower.s) * normalizedPos;
        const l = lower.l + (upper.l - lower.l) * normalizedPos;

        // Particles get brighter (more visible) at higher speeds
        const alpha = 0.3 + normalizedSpeed * 0.5;

        return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
    }

    updateTemperature(newTemp: number) {
        const speedScale = Math.sqrt(newTemp / this.temperature); // Changed from pow(1.5) to sqrt
        this.vx *= speedScale;
        this.vy *= speedScale;
        this.temperature = newTemp;
    }

    update(width: number, height: number, deltaTime: number) {
        // Convert deltaTime to seconds and normalize to 60 FPS
        const timeScale = deltaTime / (1000 / 60);

        // Update position with time-scaled velocity
        this.x += this.vx * timeScale;
        this.y += this.vy * timeScale;

        // Handle wall collisions
        if (this.x - this.radius < 0 || this.x + this.radius > width) {
            this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
            this.vx *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > height) {
            this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
            this.vy *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Reduced glow effect for better performance
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const normalizedSpeed = Math.min(
            Math.max((speed - Particle.MIN_SPEED) / (Particle.MAX_SPEED - Particle.MIN_SPEED), 0),
            1
        );

        if (normalizedSpeed > 0.7) { // Higher threshold for glow effect
            ctx.save();
            ctx.globalAlpha = (normalizedSpeed - 0.7) * 0.2; // Reduced opacity
            ctx.filter = 'blur(3px)'; // Reduced blur
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2); // Smaller glow radius
            ctx.fill();
            ctx.restore();
        }
    }
}

const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const lastTimeRef = useRef<number>(0);
    const [temperature, setTemperature] = useState(2);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            // Set actual canvas dimensions to match container
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles with reduced count for better performance
        const particleCount = window.innerWidth < 768 ? 15 : 70;
        particlesRef.current = Array(particleCount).fill(null).map(() =>
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                temperature
            )
        );

        let animationFrameId: number;
        const animate = (currentTime: number) => {
            // Initialize lastTimeRef on first frame
            if (!lastTimeRef.current) {
                lastTimeRef.current = currentTime;
            }

            const deltaTime = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles with deltaTime
            particlesRef.current.forEach(particle => {
                particle.update(canvas.width, canvas.height, deltaTime);
                particle.draw(ctx);
            });

            // Particle collisions with optimization
            for (let i = 0; i < particlesRef.current.length; i++) {
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const p1 = particlesRef.current[i];
                    const p2 = particlesRef.current[j];
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < p1.radius + p2.radius) {
                        const overlap = (p1.radius + p2.radius - distance) / 2;
                        const dxNorm = dx / distance;
                        const dyNorm = dy / distance;

                        // Separate overlapping particles
                        p1.x -= dxNorm * overlap;
                        p1.y -= dyNorm * overlap;
                        p2.x += dxNorm * overlap;
                        p2.y += dyNorm * overlap;

                        // Collision handling (velocity adjustment)
                        const angle = Math.atan2(dy, dx);
                        const sin = Math.sin(angle);
                        const cos = Math.cos(angle);

                        // Rotate velocities to axis of collision
                        const vx1 = p1.vx * cos + p1.vy * sin;
                        const vy1 = p1.vy * cos - p1.vx * sin;
                        const vx2 = p2.vx * cos + p2.vy * sin;
                        const vy2 = p2.vy * cos - p2.vx * sin;

                        // Swap velocities along collision axis
                        p1.vx = vx2 * cos - vy1 * sin;
                        p1.vy = vy1 * cos + vx2 * sin;
                        p2.vx = vx1 * cos - vy2 * sin;
                        p2.vy = vy2 * cos + vx1 * sin;

                        // Add a small dampening effect to prevent infinite collisions
                        const dampening = 0.98;
                        p1.vx *= dampening;
                        p1.vy *= dampening;
                        p2.vx *= dampening;
                        p2.vy *= dampening;
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Update particle temperatures when the temperature slider changes
    useEffect(() => {
        particlesRef.current.forEach(particle => particle.updateTemperature(temperature));
    }, [temperature]);

    return (
        <div className="relative w-full h-full">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
            <div className="absolute bottom-4 right-4">
                <TemperatureScale
                    temperature={temperature}
                    setTemperature={setTemperature}
                    min={0.5}
                    max={5}
                />
            </div>
        </div>
    );
};

export default Background