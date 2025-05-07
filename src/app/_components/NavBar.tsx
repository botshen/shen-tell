"use client";

import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import { getNextBirthday } from "~/utils/birth";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface NavBarProps {
  user: User;
  onSwitchUser: () => void;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const NavBar: FC<NavBarProps> = ({ user, onSwitchUser }) => {
  const [nextBirthday, setNextBirthday] = useState<{ days: number; date: string }>({ days: 0, date: '' });
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 计算倒计时
  const calculateTimeLeft = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    console.log('倒计时计算:', {
      目标日期: targetDate,
      当前时间: now.toLocaleString(),
      时间差_毫秒: difference
    });

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const result = { days, hours, minutes, seconds };
      console.log('计算结果:', result);
      return result;
    }

    console.log('目标日期已过');
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    // 根据用户名设置生日
    const lunarMonth = user.name === "李华" ? 10 : 5;
    const lunarDay = user.name === "李华" ? 30 : 13;

    // 测试两个用户的生日
    console.log('\n测试李华的生日（农历10月30日）:');
    const lihua = getNextBirthday(10, 30);
    console.log('李华的下一个生日:', lihua);

    console.log('\n测试漫漫🐟的生日（农历5月13日）:');
    const manman = getNextBirthday(5, 13);
    console.log('漫漫🐟的下一个生日:', manman);

    const birthday = getNextBirthday(lunarMonth, lunarDay);
    console.log('获取到生日信息:', {
      用户: user.name,
      农历: `${lunarMonth}月${lunarDay}日`,
      公历: birthday.date,
      距离天数: birthday.days
    });

    setNextBirthday(birthday);
  }, [user.name]);

  useEffect(() => {
    if (!nextBirthday.date) {
      console.log('没有有效的生日日期');
      return;
    }

    console.log('开始倒计时，目标日期:', nextBirthday.date);

    // 初始化倒计时
    setCountdown(calculateTimeLeft(nextBirthday.date));

    // 每秒更新倒计时
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft(nextBirthday.date));
    }, 1000);

    return () => {
      console.log('清理倒计时定时器');
      clearInterval(timer);
    };
  }, [nextBirthday.date]);

  return (
    <header className="bg-white shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">QQ 留言板</div>

        <div className="flex items-center gap-3">
          {countdown.days > 0 && (
            <div className="text-sm text-gray-600">
              <span>距离{user.name}的生日还有: </span>
              <span className="font-mono">
                {countdown.days}天 {String(countdown.hours).padStart(2, '0')}小时
                {String(countdown.minutes).padStart(2, '0')}分钟
                {String(countdown.seconds).padStart(2, '0')}秒
              </span>
            </div>
          )}
          <button
            onClick={onSwitchUser}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            切换用户
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm">{user.name}</span>
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar; 