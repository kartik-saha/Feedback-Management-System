import React, { useEffect, useRef } from 'react';

const GraphCanvas = ({ type = 'bar' }) => {
  const canvasRef = useRef(null);
  const dataRef = useRef({ initialized: false });
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = 400);

    // Generate graph data only once
    if (!dataRef.current.initialized) {
      if (type === 'bar') {
        dataRef.current.values1 = Array.from({ length: 50 }, () => Math.random() * 150 + 50);
        dataRef.current.values2 = Array.from({ length: 50 }, () => Math.random() * 150 + 50);
      } else {
        dataRef.current.data1 = Array.from({ length: 30 }, () => Math.random() * 150 + 50);
        dataRef.current.data2 = Array.from({ length: 30 }, () => Math.random() * 150 + 50);
      }
      dataRef.current.initialized = true;
    }

    const getThemeColors = () => {
      const style = getComputedStyle(document.documentElement);
      return {
        bg: style.getPropertyValue('--secondary-bg').trim(),
        axis: style.getPropertyValue('--btn-1').trim(),
        color1: style.getPropertyValue('--btn-2').trim(),
        color2: style.getPropertyValue('--btn-3').trim(),
      };
    };

    const drawGrid = (ctx, width, height, axis) => {
      ctx.strokeStyle = axis + '22';
      for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, height - 20);
      ctx.lineTo(40, 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(40, height - 20);
      ctx.lineTo(width - 20, height - 20);
      ctx.stroke();
    };

    const drawStaticGraph = () => {
      const { bg, axis, color1, color2 } = getThemeColors();

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      drawGrid(ctx, width, height, axis);

      if (type === 'bar') {
        const { values1, values2 } = dataRef.current;
        const barWidth = 15;
        const gap = 50;

        for (let i = 0; i < values1.length; i++) {
          const x = 60 + i * gap;
          const v1 = values1[i];
          const v2 = values2[i];

          ctx.fillStyle = color1;
          ctx.fillRect(x, height - 20 - v1, barWidth, v1);
          ctx.fillStyle = color2;
          ctx.fillRect(x + barWidth + 5, height - 20 - v2, barWidth, v2);
        }
      } else {
        const { data1, data2 } = dataRef.current;
        const spacing = (width - 80) / (data1.length - 1);

        ctx.lineWidth = 2;

        ctx.strokeStyle = color1;
        ctx.beginPath();
        ctx.moveTo(40, height - 20 - data1[0]);
        for (let i = 1; i < data1.length; i++) {
          ctx.lineTo(40 + i * spacing, height - 20 - data1[i]);
        }
        ctx.stroke();

        ctx.strokeStyle = color2;
        ctx.beginPath();
        ctx.moveTo(40, height - 20 - data2[0]);
        for (let i = 1; i < data2.length; i++) {
          ctx.lineTo(40 + i * spacing, height - 20 - data2[i]);
        }
        ctx.stroke();
      }
    };

    const animateGraph = () => {
      const { bg, axis, color1, color2 } = getThemeColors();
      let frame = 0;
      const maxFrames = 60;

      canvas.classList.add('ready'); // Fade in when animation starts

      function animate() {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
        drawGrid(ctx, width, height, axis);

        if (type === 'bar') {
          const { values1, values2 } = dataRef.current;
          const barWidth = 15;
          const gap = 50;

          for (let i = 0; i < values1.length; i++) {
            const x = 60 + i * gap;
            const v1 = (values1[i] * frame) / maxFrames;
            const v2 = (values2[i] * frame) / maxFrames;

            ctx.fillStyle = color1;
            ctx.fillRect(x, height - 20 - v1, barWidth, v1);
            ctx.fillStyle = color2;
            ctx.fillRect(x + barWidth + 5, height - 20 - v2, barWidth, v2);
          }
        } else {
          const { data1, data2 } = dataRef.current;
          const spacing = (width - 80) / (data1.length - 1);
          const length = Math.floor((frame / maxFrames) * data1.length);

          ctx.lineWidth = 2;

          ctx.strokeStyle = color1;
          ctx.beginPath();
          ctx.moveTo(40, height - 20 - data1[0]);
          for (let i = 1; i < length; i++) {
            ctx.lineTo(40 + i * spacing, height - 20 - data1[i]);
          }
          ctx.stroke();

          ctx.strokeStyle = color2;
          ctx.beginPath();
          ctx.moveTo(40, height - 20 - data2[0]);
          for (let i = 1; i < length; i++) {
            ctx.lineTo(40 + i * spacing, height - 20 - data2[i]);
          }
          ctx.stroke();
        }

        if (frame < maxFrames) {
          frame++;
          requestAnimationFrame(animate);
        }
      }

      animate();
    };

    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      setTimeout(animateGraph, 0); // No pre-draw to prevent flicker
    } else {
      drawStaticGraph(); // Redraw on theme/resizing
      canvas.classList.add('ready');
    }

    const observer = new MutationObserver(drawStaticGraph);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    window.addEventListener('resize', drawStaticGraph);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', drawStaticGraph);
    };
  }, [type]);

  return <canvas className="graph-bg" ref={canvasRef} />;
};

export default GraphCanvas;
