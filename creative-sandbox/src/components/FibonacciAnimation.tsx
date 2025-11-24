"use client";

import React, { useEffect, useRef } from "react";

export default function FibonacciAnimation() {
  const groupRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgNS = "http://www.w3.org/2000/svg";
    const maxDots = 1000;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const dots: SVGCircleElement[] = [];
    let n = 0;
    let direction = 1; // 1 = growing, -1 = shrinking

    function animateDots(multiplier: number) {
      if (!groupRef.current) return;

      if (direction === 1 && n < maxDots) {
        const angle = n * goldenAngle;
        const radius = Math.sqrt(n) * 4;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", x.toString());
        dot.setAttribute("cy", y.toString());
        dot.setAttribute("r", "0");

        const progress = n / maxDots;
        const r = Math.round(255 + (254 - 255) * progress);
        const g = Math.round(214 + (72 - 214) * progress);
        const b = Math.round(0 + (216 - 0) * progress);
        const fill = `rgb(${r}, ${g}, ${b})`;
        dot.setAttribute("fill", fill);

        groupRef.current.appendChild(dot);
        dots.push(dot);

        dot.animate([{ r: "0" }, { r: "2.5" }], {
          duration: 300,
          easing: "ease-out",
          fill: "forwards"
        });

        n++;
      } else if (direction === -1 && dots.length > 0) {
        const dot = dots.pop();
        if (!dot) return;

        const shrinkAnim = dot.animate([{ r: "2.5" }, { r: "0" }], {
          duration: 300,
          easing: "ease-in",
          fill: "forwards"
        });

        shrinkAnim.onfinish = () => {
          if (groupRef.current && groupRef.current.contains(dot)) {
            groupRef.current.removeChild(dot);
          }
        };

        n--;
      } else {
        direction *= -1;
      }

      const minDelay = 10;
      const maxDelay = 30;
      setTimeout(() => requestAnimationFrame(() => animateDots(direction === -1 ? 2 : 1)), minDelay + Math.random() * (maxDelay - minDelay));
    }

    if (svgRef.current) {
      svgRef.current.style.backgroundColor = "transparent";
    }

    requestAnimationFrame(() => animateDots(1));
  }, []);

  return (
    <svg ref={svgRef} width="500" height="500" viewBox="0 0 500 500">
      <g ref={groupRef} transform="translate(250, 250)" />
    </svg>
  );
}