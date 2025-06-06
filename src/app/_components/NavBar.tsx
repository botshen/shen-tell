"use client";

import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import { getNextBirthday } from "~/utils/birth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 配置 dayjs 使用时区插件
dayjs.extend(utc);
dayjs.extend(timezone);

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
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);

  // 计算倒计时
  const calculateTimeLeft = (targetDate: string) => {
    const now = dayjs().tz("Asia/Shanghai");
    const target = dayjs(targetDate).tz("Asia/Shanghai");
    const difference = target.diff(now);

    console.log('倒计时计算:', {
      目标日期: targetDate,
      当前时间: now.format('YYYY-MM-DD HH:mm:ss'),
      目标时间: target.format('YYYY-MM-DD HH:mm:ss'),
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

  // 获取用户对应的生日图标和颜色
  const getBirthdayTheme = () => {
    if (user.name === "李华") {
      return {
        icon: "🎂",
        color: "bg-gradient-to-r from-blue-400 to-purple-500"
      };
    } else {
      return {
        icon: "🐟",
        color: "bg-gradient-to-r from-pink-400 to-orange-400"
      };
    }
  };

  const { icon, color } = getBirthdayTheme();

  return (
    <header className="bg-white shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-2 sm:mb-0">QQ 留言板</div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {countdown.days > 0 && (
            <div
              className={`rounded-full px-4 py-2 text-white text-sm shadow-md ${color} relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer max-w-full sm:max-w-xs truncate`}
              onClick={() => setShowBirthdayModal(true)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg animate-bounce">{icon}</span>
                <div>
                  <span className="mr-1">距离{user.name}的生日还有:</span>
                  <span className="font-mono font-semibold">
                    {countdown.days}天 {String(countdown.hours).padStart(2, '0')}:
                    {String(countdown.minutes).padStart(2, '0')}:
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs opacity-70">查看全部</span>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 animate-pulse"
                style={{ animationDuration: '3s' }}></div>
            </div>
          )}
          <button
            onClick={onSwitchUser}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            切换用户
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm">{user.name}</span>
            <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-gray-200">
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

      {/* 生日日期列表弹窗 */}
      {showBirthdayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setShowBirthdayModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className={`${color} p-4 text-white flex justify-between items-center`}>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {icon} {user.name}的生日日期
              </h3>
              <button onClick={() => setShowBirthdayModal(false)}
                className="text-white hover:text-gray-200">
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              <p className="text-center mb-4 text-gray-600">
                农历生日将在每年的不同日期，点击下方查看全部公历日期
              </p>
              <div className="flex justify-center">
                <button
                  className={`${color} text-white py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all`}
                  onClick={() => window.location.href = `/birthdays/${user.name}`}
                >
                  查看全部生日日期
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar; 