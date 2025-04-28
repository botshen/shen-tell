"use client";

import { useState, useEffect, useRef } from "react";

interface SnowControllerProps {
  onChangeSnowflakeCount: (count: number) => void;
  onChangeSpeed: (speed: number) => void;
  onChangeSize: (size: number) => void;
  onChangeColor: (color: string) => void;
  onChangeBackgroundColor: (color: string) => void;
  initialSnowflakeCount?: number;
  initialSpeed?: number;
  initialSize?: number;
  initialColor?: string;
  initialBackgroundColor?: string;
  onReset?: () => void;
}

const SnowController: React.FC<SnowControllerProps> = ({
  onChangeSnowflakeCount,
  onChangeSpeed,
  onChangeSize,
  onChangeColor,
  onChangeBackgroundColor,
  initialSnowflakeCount = 150,
  initialSpeed = 1,
  initialSize = 1,
  initialColor = "#ffffff",
  initialBackgroundColor = "rgba(30, 41, 59, 0.15)",
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [snowflakeCount, setSnowflakeCount] = useState(initialSnowflakeCount);
  const [speed, setSpeed] = useState(initialSpeed);
  const [size, setSize] = useState(initialSize);
  const [color, setColor] = useState(initialColor);

  // 直接使用RGB和透明度状态而不是解析复杂的RGBA字符串
  const [bgRgb, setBgRgb] = useState("25, 35, 60");
  const [bgAlpha, setBgAlpha] = useState(0.12);

  // 创建滑块的引用
  const sliderRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 添加引用元素到数组的函数
  const setSliderRef = (index: number) => (el: HTMLInputElement | null) => {
    sliderRefs.current[index] = el;
  };

  // 初始化背景色设置
  useEffect(() => {
    // 简单起见，我们只使用默认值，不尝试解析initialBackgroundColor
    updateBackgroundColor(bgRgb, bgAlpha);
  }, []);

  // 防止滑块操作触发页面滚动或全面屏手势
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // 检查触摸事件是否发生在我们的滑块上
      const isOnSlider = sliderRefs.current.some(ref =>
        ref && e.target instanceof Node && ref.contains(e.target)
      );

      if (isOnSlider) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleSnowflakeCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSnowflakeCount(value);
    onChangeSnowflakeCount(value);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSpeed(value);
    onChangeSpeed(value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSize(value);
    onChangeSize(value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);
    onChangeColor(value);
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const alpha = parseFloat(e.target.value);
    setBgAlpha(alpha);
    updateBackgroundColor(bgRgb, alpha);
  };

  const handleBgColorChange = (rgb: string) => {
    setBgRgb(rgb);
    updateBackgroundColor(rgb, bgAlpha);
  };

  const updateBackgroundColor = (rgb: string, alpha: number) => {
    const newBgColor = `rgba(${rgb}, ${alpha})`;
    onChangeBackgroundColor(newBgColor);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const predefinedColors = ["#ffffff", "#e0f0ff", "#aed4f8", "#80d8ff", "#a0e8e8", "#f0f8ff"];
  const backgroundColors = [
    { name: "深蓝灰", rgb: "25, 35, 60" },
    { name: "暗紫色", rgb: "70, 25, 130" },
    { name: "深蓝色", rgb: "20, 30, 90" },
    { name: "深绿色", rgb: "15, 55, 45" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/80 backdrop-blur-sm text-gray-700 rounded-full p-3 shadow-lg hover:bg-white/90 transition-all"
        aria-label="调整雪花效果"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg w-72 max-w-[90vw]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-800 font-medium">调整雪花效果</h3>
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm10.49 3.882a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h3.183a.75.75 0 100-1.5H.985a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-1.45-.388z" clipRule="evenodd" />
              </svg>
              重置为默认
            </button>
          </div>

          <div className="mb-3 touch-none">
            <label className="block text-sm text-gray-700 mb-1">雪花数量: {snowflakeCount}</label>
            <input
              ref={setSliderRef(0)}
              type="range"
              min="50"
              max="500"
              step="10"
              value={snowflakeCount}
              onChange={handleSnowflakeCountChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-none"
            />
          </div>

          <div className="mb-3 touch-none">
            <label className="block text-sm text-gray-700 mb-1">下落速度: {speed.toFixed(1)}</label>
            <input
              ref={setSliderRef(1)}
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={speed}
              onChange={handleSpeedChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-none"
            />
          </div>

          <div className="mb-3 touch-none">
            <label className="block text-sm text-gray-700 mb-1">雪花大小: {size.toFixed(1)}</label>
            <input
              ref={setSliderRef(2)}
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={size}
              onChange={handleSizeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">雪花颜色:</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {predefinedColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => {
                    setColor(presetColor);
                    onChangeColor(presetColor);
                  }}
                  className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: presetColor }}
                  aria-label={`选择颜色 ${presetColor}`}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-full h-8 cursor-pointer"
            />
          </div>

          <div className="mb-3 touch-none">
            <label className="block text-sm text-gray-700 mb-1">背景透明度: {bgAlpha.toFixed(2)}</label>
            <input
              ref={setSliderRef(3)}
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={bgAlpha}
              onChange={handleAlphaChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">背景颜色:</label>
            <div className="flex flex-wrap gap-2">
              {backgroundColors.map((bgColor) => (
                <button
                  key={bgColor.name}
                  onClick={() => handleBgColorChange(bgColor.rgb)}
                  className="px-2 py-1 text-xs rounded-md text-white cursor-pointer"
                  style={{ backgroundColor: `rgba(${bgColor.rgb}, 0.8)` }}
                >
                  {bgColor.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnowController; 