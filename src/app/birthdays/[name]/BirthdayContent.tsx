"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSolarBirthdays, formatLunarDate } from '~/utils/birth';
import dayjs from 'dayjs';
import { userBirthdays } from "~/config/birthdays";

type BirthdayContentProps = {
  name: string;
};

export function BirthdayContent({ name }: BirthdayContentProps) {
  const router = useRouter();
  const userName = decodeURIComponent(name);

  const [birthdays, setBirthdays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedBirthdays, setGroupedBirthdays] = useState<Record<string, string[]>>({});
  const [activeYears, setActiveYears] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lunarDate, setLunarDate] = useState('');

  // 获取用户生日信息
  useEffect(() => {
    const userConfig = userBirthdays[userName];
    if (!userConfig) {
      console.error('未找到用户生日配置:', userName);
      setLoading(false);
      return;
    }

    // 设置格式化后的农历日期
    setLunarDate(formatLunarDate(userConfig.lunarMonth, userConfig.lunarDay));

    // 获取从当前年份到2100年的所有生日日期
    const currentYear = new Date().getFullYear();
    const birthdays = getSolarBirthdays(userConfig.lunarMonth, userConfig.lunarDay, currentYear, 2100);

    // 按年份分组
    const grouped: Record<string, string[]> = {};
    birthdays.forEach(date => {
      const parts = date.split('-');
      if (parts.length >= 1) {
        const year = parts[0];
        if (year) {
          if (!grouped[year]) {
            grouped[year] = [];
          }
          grouped[year].push(date);
        }
      }
    });

    setGroupedBirthdays(grouped);
    setBirthdays(birthdays);
    setActiveYears(Object.keys(grouped).slice(0, 5)); // 默认展开前5年
    setLoading(false);
  }, [userName]);

  // 获取用户主题
  const getTheme = () => {
    const userConfig = userBirthdays[userName];
    return userConfig?.theme || {
      icon: "🎉",
      color: "bg-gradient-to-r from-gray-400 to-gray-500",
      lightColor: "bg-gray-100",
      textColor: "text-gray-600"
    };
  };

  const theme = getTheme();

  const toggleYear = (year: string) => {
    if (activeYears.includes(year)) {
      setActiveYears(activeYears.filter(y => y !== year));
    } else {
      setActiveYears([...activeYears, year]);
    }
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('YYYY年MM月DD日 (ddd)');
  };

  const isCurrentYear = (year: string) => {
    return year === new Date().getFullYear().toString();
  };

  const filteredYears = Object.keys(groupedBirthdays).filter(year =>
    !searchTerm || (groupedBirthdays[year] && groupedBirthdays[year].some(date => date.includes(searchTerm)))
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-900"
      >
        <span>←</span> 返回
      </button>

      <div className={`${theme.color} rounded-lg shadow-lg p-5 text-white mb-6`}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {theme.icon} {userName}的生日日历
        </h1>
        <p className="mt-2 opacity-90 flex items-center gap-2">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black">
            农历: {lunarDate}
          </span>
          <span>|</span>
          查看从{new Date().getFullYear()}年到2100年的所有公历生日日期
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索年份或月份..."
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="divide-y">
          {filteredYears.map(year => (
            <div key={year} className="py-2">
              <div
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${activeYears.includes(year) ? theme.lightColor : 'hover:bg-gray-50'}`}
                onClick={() => toggleYear(year)}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${theme.textColor}`}>{year}年</span>
                  {isCurrentYear(year) && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      今年
                    </span>
                  )}
                </div>
                <span className={`${activeYears.includes(year) ? 'transform rotate-180' : ''} transition-transform`}>
                  ▼
                </span>
              </div>

              {activeYears.includes(year) && groupedBirthdays[year] && (
                <div className="pl-8 pr-4 py-3 space-y-2">
                  {groupedBirthdays[year].map((date, index) => {
                    const parts = date.split('-');
                    const month = parts.length > 1 ? parts[1] : '';

                    return (
                      <div key={index} className="flex items-center gap-3 py-2 border-b border-dashed border-gray-200 last:border-b-0">
                        <div className={`w-10 h-10 ${theme.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {month}
                        </div>
                        <div>
                          <div className="text-gray-800">{formatDate(date)}</div>
                          <div className="text-xs text-gray-500">
                            农历生日: {lunarDate}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {filteredYears.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              没有找到匹配的生日日期
            </div>
          )}
        </div>
      )}
    </div>
  );
} 