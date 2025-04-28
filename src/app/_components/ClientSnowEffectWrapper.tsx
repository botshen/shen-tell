"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// 在客户端组件中使用动态导入
const SnowEffect = dynamic(() => import("./SnowEffect"), {
  ssr: false,
  loading: () => {
    console.log("SnowEffect is loading...");
    return <div className="hidden">Loading snow effect...</div>;
  }
});

export default function ClientSnowEffectWrapper() {
  useEffect(() => {
    console.log("ClientSnowEffectWrapper mounted");
    return () => console.log("ClientSnowEffectWrapper unmounted");
  }, []);

  console.log("Rendering ClientSnowEffectWrapper");
  return <SnowEffect />;
} 