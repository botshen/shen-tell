"use client";

import { useEffect, useRef, useState } from "react";

interface SnowBackgroundProps {
  snowflakeCount?: number;
  color?: string;
  speed?: number;
  size?: number;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
}

const SnowBackground: React.FC<SnowBackgroundProps> = ({
  snowflakeCount = 200,
  color = "#ffffff",
  speed = 1,
  size = 1,
  backgroundColor = "rgba(30, 41, 59, 0.15)",
  className = "",
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 初始化雪花位置和属性
  const initSnowflakes = (width: number, height: number, count: number): Snowflake[] => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (Math.random() * 2 + 1) * size,
      speed: Math.random() * 2 + 1 * speed,
      wind: Math.random() * 2 - 1,
    }));
  };

  useEffect(() => {
    console.log("SnowBackground mounted");
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置画布大小
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      console.log("SnowBackground unmounted");
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let snowflakes = initSnowflakes(dimensions.width, dimensions.height, snowflakeCount);
    let animationFrameId: number;

    // 绘制雪花
    const render = () => {
      if (!ctx) return;

      // 清除画布
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // 绘制背景
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      }

      // 设置雪花颜色
      ctx.fillStyle = color;

      // 绘制每个雪花
      snowflakes.forEach((snowflake) => {
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
        ctx.fill();

        // 更新雪花位置
        snowflake.y += snowflake.speed;
        snowflake.x += snowflake.wind;

        // 如果雪花超出底部，重新放到顶部
        if (snowflake.y > dimensions.height) {
          snowflake.y = -5;
          snowflake.x = Math.random() * dimensions.width;
        }

        // 如果雪花超出左右边界，重新放到另一边
        if (snowflake.x > dimensions.width) {
          snowflake.x = 0;
        } else if (snowflake.x < 0) {
          snowflake.x = dimensions.width;
        }
      });

      // 请求下一帧动画
      animationFrameId = requestAnimationFrame(render);
    };

    // 开始动画
    render();

    // 清理函数
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, snowflakeCount, color, speed, size, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[9999] ${className}`}
      style={{
        ...style,
        background: "transparent",
      }}
    />
  );
};

export default SnowBackground; 