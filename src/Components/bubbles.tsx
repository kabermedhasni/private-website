"use client";

import { useState, useEffect } from "react";
import "./bubbles.css";

function Bubble({
  x,
  y,
  size,
  color,
}: {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  // Calculate random animation duration between 5-15 seconds
  const duration = 5 + Math.random() * 10;

  // Calculate random offsets for movement
  const xOffset = Math.random() * 100 - 50;
  const yOffset = Math.random() * 100 - 50;

  const bubbleStyle = {
    left: `${x}px`,
    top: `${y}px`,
    width: `${size * 2}px`,
    height: `${size * 2}px`,
    backgroundColor: color,
    animationDuration: `${duration}s`,
    // Add slight variation to animation delay
    animationDelay: `${Math.random() * 2}s`,
    // Add random transform to create more varied movement
    transform: `translate(${xOffset}px, ${yOffset}px)`,
  };

  return <div className="bubble" style={bubbleStyle} />;
}

export default function FloatingBubblesBackground() {
  const [bubbles, setBubbles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string }>
  >([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Create bubbles based on screen size
    const createBubbles = () => {
      // Don't create bubbles for mobile
      if (window.innerWidth <= 768) {
        setBubbles([]);
        return;
      }

      const bubbleCount = 50;

      const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        // Ensure bubbles stay within the safe zone
        y: Math.random() * (window.innerHeight - 60) + 30, // 30px margin from top and bottom
        size: Math.random() * 20 + 5,
        color: Math.random() > 0.5 ? "#00B5DE" : "#007F9B",
      }));
      setBubbles(newBubbles);
    };

    // Handle window resize
    const handleResize = () => {
      checkMobile();
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      createBubbles();
    };

    // Initial creation
    createBubbles();

    // Add resize listener with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };

    window.addEventListener("resize", debouncedResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div className="bubbles-container">
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} {...bubble} />
      ))}
    </div>
  );
}
