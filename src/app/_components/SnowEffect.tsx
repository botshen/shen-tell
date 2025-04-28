"use client";

import { useState, useEffect } from "react";
import SnowBackground from "./SnowBackground";
import SnowController from "./SnowController";

// 定义默认值常量，方便重置功能使用
export const DEFAULT_SNOW_SETTINGS = {
  snowflakeCount: 120,
  speed: 0.8,
  size: 1.2,
  color: "#ffffff",
  backgroundColor: "rgba(25, 35, 60, 0.12)"
};

const SnowEffect: React.FC = () => {
  const [snowflakeCount, setSnowflakeCount] = useState(DEFAULT_SNOW_SETTINGS.snowflakeCount);
  const [speed, setSpeed] = useState(DEFAULT_SNOW_SETTINGS.speed);
  const [size, setSize] = useState(DEFAULT_SNOW_SETTINGS.size);
  const [color, setColor] = useState(DEFAULT_SNOW_SETTINGS.color);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_SNOW_SETTINGS.backgroundColor);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("SnowEffect component mounted");
    setIsLoaded(true);
    return () => console.log("SnowEffect component unmounted");
  }, []);

  const resetToDefaults = () => {
    setSnowflakeCount(DEFAULT_SNOW_SETTINGS.snowflakeCount);
    setSpeed(DEFAULT_SNOW_SETTINGS.speed);
    setSize(DEFAULT_SNOW_SETTINGS.size);
    setColor(DEFAULT_SNOW_SETTINGS.color);
    setBackgroundColor(DEFAULT_SNOW_SETTINGS.backgroundColor);
  };

  if (!isLoaded) {
    return null;
  }

  console.log("Rendering SnowEffect with snowflake count:", snowflakeCount);

  return (
    <>
      <SnowBackground
        snowflakeCount={snowflakeCount}
        color={color}
        speed={speed}
        size={size}
        backgroundColor={backgroundColor}
      />
      <SnowController
        onChangeSnowflakeCount={setSnowflakeCount}
        onChangeSpeed={setSpeed}
        onChangeSize={setSize}
        onChangeColor={setColor}
        onChangeBackgroundColor={setBackgroundColor}
        initialSnowflakeCount={snowflakeCount}
        initialSpeed={speed}
        initialSize={size}
        initialColor={color}
        initialBackgroundColor={backgroundColor}
        onReset={resetToDefaults}
      />
    </>
  );
};

export default SnowEffect; 