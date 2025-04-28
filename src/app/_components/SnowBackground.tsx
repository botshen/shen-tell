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
  opacity: number;
  swingRange: number;
  swingSpeed: number;
  angle: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_COLOR = "#ffffff";
const DEFAULT_BG_COLOR = "rgba(25, 35, 60, 0.12)";

const SnowBackground: React.FC<SnowBackgroundProps> = ({
  snowflakeCount = 200,
  color = DEFAULT_COLOR,
  speed = 1,
  size = 1,
  backgroundColor = DEFAULT_BG_COLOR,
  className = "",
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 初始化雪花位置和属性
  const initSnowflakes = (width: number, height: number, count: number): Snowflake[] => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (Math.random() * 2 + 0.8) * size,
      speed: (Math.random() * 1.5 + 0.5) * speed,
      wind: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.5,
      swingRange: Math.random() * 3,
      swingSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));
  };

  // 重置雪花属性
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      snowflakesRef.current = initSnowflakes(dimensions.width, dimensions.height, snowflakeCount);
    }
  }, [snowflakeCount, speed, size, dimensions.width, dimensions.height]);

  useEffect(() => {
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (snowflakesRef.current.length === 0) {
      snowflakesRef.current = initSnowflakes(dimensions.width, dimensions.height, snowflakeCount);
    }

    // 将16进制颜色转换为RGB对象
    const parseColor = (inputColor: string): RGB => {
      // 默认白色
      const defaultColor: RGB = { r: 255, g: 255, b: 255 };

      try {
        // 处理16进制颜色
        if (inputColor.startsWith('#')) {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(inputColor);
          if (result && result.length >= 4) {
            return {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            };
          }
        }

        // 处理RGB颜色
        const rgbMatch = inputColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch && rgbMatch.length >= 4) {
          return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
          };
        }
      } catch (e) {
        console.error("颜色解析错误", e);
      }

      return defaultColor;
    };

    // 获取基础颜色
    const snowColor = color || DEFAULT_COLOR;
    const baseColor = parseColor(snowColor);

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

      // 绘制每个雪花
      snowflakesRef.current.forEach((snowflake) => {
        // 更新雪花角度
        snowflake.angle += snowflake.swingSpeed;

        // 应用摇摆效果的水平移动
        const swingOffset = Math.sin(snowflake.angle) * snowflake.swingRange;

        // 更新雪花位置
        snowflake.y += snowflake.speed;
        snowflake.x += snowflake.wind + swingOffset * 0.1;

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

        // 设置雪花颜色（带透明度）
        ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${snowflake.opacity})`;

        // 绘制雪花 - 使用圆形
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 请求下一帧动画
      animationRef.current = requestAnimationFrame(render);
    };

    // 开始动画
    render();

    // 清理函数
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, color, speed, size, backgroundColor]);

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