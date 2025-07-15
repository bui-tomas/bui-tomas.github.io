import { useState, useEffect } from "react";

export function useChartAnimation(chartId: string, delay = 1500, height=400) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [chartHeight, setChartHeight] = useState(height);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setChartHeight(300);
    }

    let timer: NodeJS.Timeout;

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowAnimation(true);

            timer = setTimeout(() => {
              setShowDots(true);
              setShowLabels(true);
            }, delay);

            animationObserver.disconnect();
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -100px 0px" }
    );

    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      animationObserver.observe(chartElement);
    }

    return () => {
      animationObserver.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [chartId, delay]);

  return { showAnimation, showDots, showLabels, chartHeight };
}