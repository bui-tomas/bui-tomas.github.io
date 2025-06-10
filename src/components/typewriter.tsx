'use client'

import React, { useState, useEffect, useCallback } from 'react';

interface TypeWriterProps {
    texts: string[];
    className?: string;
    period?: number;
    delay?: number;
    speed?: number; // Typing speed in milliseconds
}

const TypeWriter = ({ 
    texts, 
    className = "", 
    period = 1500, 
    delay = 0,
    speed = 150 
}: TypeWriterProps) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const isLastText = currentIndex === texts.length - 1;
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasStarted(true);
        }, delay);
        
        return () => clearTimeout(timer);
    }, [delay]);
    
    const tick = useCallback(() => {
        const currentText = texts[currentIndex];
        
        setDisplayText(current => {
            if (isDeleting) {
                return current.substring(0, current.length - 1);
            } else {
                return currentText.substring(0, current.length + 1);
            }
        });

        if (!isDeleting && displayText === currentText) {
            if (!isLastText) {
                setTimeout(() => setIsDeleting(true), period);
            }
        } else if (isDeleting && displayText === '') {
            setIsDeleting(false);
            setCurrentIndex(prev => prev + 1);
        }
    }, [texts, currentIndex, isDeleting, displayText, period, isLastText]);

    useEffect(() => {
        if (!hasStarted) return;
        
        if (isLastText && displayText === texts[currentIndex] && !isDeleting) {
            return;
        }
        
        const ticker = setTimeout(() => tick(), speed);
        return () => clearTimeout(ticker);
    }, [tick, speed, isLastText, displayText, texts, currentIndex, isDeleting, hasStarted]);

    return (
        <span className={`inline-block ${className}`}>
            {displayText}
            {(!isLastText || displayText !== texts[currentIndex]) && hasStarted && (
                <span className="inline-block w-[0.03em] h-[0.9em] -mt-2 bg-white align-middle">
                    &nbsp;
                </span>
            )}
        </span>
    );
};

export default TypeWriter;