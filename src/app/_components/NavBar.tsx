"use client";

import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import { getNextBirthday } from "~/utils/birth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRouter } from "next/navigation";
import CountdownCard from "./CountdownCard";
import { userBirthdays } from "~/config/birthdays";

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
  const router = useRouter();
  const [nextBirthday, setNextBirthday] = useState<{ days: number; date: string }>({ days: 0, date: '' });
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

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
    const userConfig = userBirthdays[user.name];
    if (!userConfig) {
      console.error('未找到用户生日配置:', user.name);
      return;
    }

    const birthday = getNextBirthday(userConfig.lunarMonth, userConfig.lunarDay);
    console.log('获取到生日信息:', {
      用户: user.name,
      农历: `${userConfig.lunarMonth}月${userConfig.lunarDay}日`,
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

    // 检查是否是当前用户的生日当天
    const now = dayjs().tz("Asia/Shanghai");
    const target = dayjs(nextBirthday.date).tz("Asia/Shanghai");
    const isSameDay = now.format('YYYY-MM-DD') === target.format('YYYY-MM-DD');

    // 设置是否是生日
    setIsBirthday(isSameDay);

    // 如果是生日当天，重置倒计时
    if (isSameDay) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // 如果不是生日当天，才启动倒计时
    setCountdown(calculateTimeLeft(nextBirthday.date));

    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft(nextBirthday.date));
    }, 1000);

    return () => {
      console.log('清理倒计时定时器');
      clearInterval(timer);
    };
  }, [nextBirthday.date]);

  // 获取用户对应的生日主题
  const getBirthdayTheme = () => {
    const userConfig = userBirthdays[user.name];
    return userConfig?.theme || {
      color: "bg-gradient-to-r from-gray-400 to-gray-500",
      hoverColor: "hover:from-gray-500 hover:to-gray-600",
      lightColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-600",
      icon: "🎉"
    };
  };

  const theme = getBirthdayTheme();

  return (
    <header className="bg-white shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-2 sm:mb-0">QQ 留言板</div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isBirthday && (
            <div className="flex flex-col items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
              <div className={`${theme.textColor} text-lg font-bold`}>
                🎉 祝{user.name}生日快乐 🎉
              </div>
              <div className="w-48 h-48 relative">
                <Image
                  src="https://tc.z.wiki/autoupload/IE2OGBiZoh-c-aA5FsyWtFQXuRE9k8EpQP2a9TSHWqKyl5f0KlZfm6UsKj-HyTuv/20250607/UMzF/480X480/giphy.gif"
                  alt="生日快乐"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0) && (
            <div className="flex flex-col items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
              {/* 倒计时标题 */}
              <div className={`${theme.textColor} text-sm font-medium`}>
                距离{user.name}的生日还有
              </div>

              {/* 倒计时卡片组 */}
              <div className="flex gap-2 items-center">
                <CountdownCard value={countdown.days} label="天" color={theme.color} />
                <CountdownCard value={countdown.hours} label="时" color={theme.color} />
                <CountdownCard value={countdown.minutes} label="分" color={theme.color} />
                <CountdownCard value={countdown.seconds} label="秒" color={theme.color} />
              </div>
            </div>
          )}

          {/* 查看更多按钮 - 始终显示 */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push(`/birthdays/${user.name}`)}
              className={`${theme.color} ${theme.hoverColor} text-white px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:shadow-md transition-all flex items-center gap-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              查看更多生日
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchUser}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ease-in-out group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              切换用户
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200">
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
      </div>
    </header>
  );
};

export default NavBar; 