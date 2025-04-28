"use client";

import { useState, useEffect } from "react";
import SnowBackground from "./SnowBackground";
import SnowController from "./SnowController";

const SnowEffect: React.FC = () => {
  const [snowflakeCount, setSnowflakeCount] = useState(150);
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("rgba(30, 41, 59, 0.15)");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("SnowEffect component mounted");
    setIsLoaded(true);
    return () => console.log("SnowEffect component unmounted");
  }, []);

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
      />
    </>
  );
};

export default SnowEffect; 