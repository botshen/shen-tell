"use client";

import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import { getNextBirthday } from "~/utils/birth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRouter } from "next/navigation";
import CountdownCard from "./CountdownCard";

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

  // 获取用户对应的生日主题
  const getBirthdayTheme = () => {
    if (user.name === "李华") {
      return {
        color: "bg-gradient-to-r from-blue-400 to-purple-500",
        hoverColor: "hover:from-blue-500 hover:to-purple-600",
        lightColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600"
      };
    } else {
      return {
        color: "bg-gradient-to-r from-pink-400 to-orange-400",
        hoverColor: "hover:from-pink-500 hover:to-orange-500",
        lightColor: "bg-pink-50",
        borderColor: "border-pink-200",
        textColor: "text-pink-600"
      };
    }
  };

  const theme = getBirthdayTheme();

  return (
    <header className="bg-white shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-2 sm:mb-0">QQ 留言板</div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
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

              {/* 查看更多按钮 */}
              <button
                onClick={() => router.push(`/birthdays/${user.name}`)}
                className={`${theme.color} ${theme.hoverColor} text-white px-4 py-1.5 rounded-lg text-sm whitespace-nowrap hover:shadow-md transition-all`}
              >
                查看更多生日
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
};

export default NavBar; 