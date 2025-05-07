import { SolarDay, LunarDay } from 'tyme4ts';
import dayjs from 'dayjs';

/**
 * 将中文日期格式转换为标准日期格式
 * @param chineseDateStr YYYY年MM月DD日格式的日期字符串
 * @returns YYYY-MM-DD格式的日期字符串，如果转换失败则返回null
 */
function convertChineseDateToStandard(chineseDateStr: string): string | null {
  const match = chineseDateStr.match(/(\d+)年(\d+)月(\d+)日/);
  if (!match || match.length < 4) {
    return null;
  }

  // 这些都是字符串类型
  const year = match[1];
  const month = match[2];
  const day = match[3];

  if (!year || !month || !day) {
    return null;
  }

  // 标准化为 YYYY-MM-DD 格式
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * 计算农历生日在指定年份范围内的公历日期
 * @param lunarMonth 农历月份
 * @param lunarDay 农历日期
 * @param startYear 开始年份
 * @param endYear 结束年份
 * @returns 公历日期数组，格式为 YYYY-MM-DD
 */
export function getSolarBirthdays(
  lunarMonth: number,
  lunarDay: number,
  startYear: number = 2025,
  endYear: number = 2100
): string[] {
  const birthdays: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    try {
      // 创建农历日期
      const lunar = LunarDay.fromYmd(year, lunarMonth, lunarDay);
      // 转换为公历日期
      const solar = lunar.getSolarDay();

      // 获取日期字符串，转换为标准格式 YYYY-MM-DD
      const dateStr = solar.toString(); // 格式为 YYYY年MM月DD日
      const standardDate = convertChineseDateToStandard(dateStr);
      if (standardDate) {
        birthdays.push(standardDate);
      }
    } catch (error) {
      // 如果日期无效，尝试取前一天
      try {
        const lunar = LunarDay.fromYmd(year, lunarMonth, lunarDay - 1);
        const solar = lunar.getSolarDay();
        const dateStr = solar.toString();
        const standardDate = convertChineseDateToStandard(dateStr);
        if (standardDate) {
          birthdays.push(standardDate);
        }
      } catch (error) {
        console.error(`${year}年农历${lunarMonth}月${lunarDay - 1}日也无效:`, error);
        continue;
      }
    }
  }

  return birthdays;
}

/**
 * 格式化农历日期为中文表示
 * @param month 农历月份
 * @param day 农历日期
 * @returns 农历日期的中文表示，如"正月初一"或"十月三十"
 */
export function formatLunarDate(month: number, day: number): string {
  const chineseMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const chineseDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '三十一'];

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return '无效日期';
  }

  const monthStr = chineseMonths[month - 1] + '月';
  const dayStr = chineseDays[day - 1];

  return monthStr + dayStr;
}

/**
 * 计算距离最近的生日还有多少天
 * @param lunarMonth 农历月份
 * @param lunarDay 农历日期
 * @returns 距离最近生日的天数
 */
export function getNextBirthday(lunarMonth: number, lunarDay: number): { days: number; date: string } {
  console.log('开始计算下一个生日:', { lunarMonth, lunarDay });

  const today = dayjs().startOf('day');
  const currentYear = today.year();

  console.log('当前日期:', today.format('YYYY-MM-DD'));

  // 获取未来5年的生日日期
  const birthdays = getSolarBirthdays(lunarMonth, lunarDay, currentYear, currentYear + 5);
  console.log('未来5年的生日日期:', birthdays);

  // 找到最近的生日
  let nextBirthday: string | null = null;
  let minDays = Infinity;

  for (const birthday of birthdays) {
    // 标准格式的 YYYY-MM-DD 可以直接用 dayjs 解析
    const birthdayDate = dayjs(birthday);

    // 计算天数差
    const diffDays = birthdayDate.diff(today, 'day');
    const diffMillis = birthdayDate.diff(today);

    console.log('检查生日日期:', {
      生日: birthday,
      生日日期: birthdayDate.format('YYYY-MM-DD'),
      当前日期: today.format('YYYY-MM-DD'),
      时间差_毫秒: diffMillis,
      时间差_天: diffDays
    });

    // 如果生日已经过了，跳过
    if (diffDays < 0) {
      console.log('该生日已过');
      continue;
    }

    // 找到最近的生日
    if (diffDays < minDays) {
      console.log('找到更近的生日');
      minDays = diffDays;
      nextBirthday = birthday;
    }
  }

  const result = {
    days: minDays === Infinity ? 0 : minDays,
    date: nextBirthday || ''
  };

  console.log('计算结果:', result);
  return result;
}

export function test() {
  // 使用示例
  console.log('测试李华的生日（农历10月30日）:');
  console.log('农历日期:', formatLunarDate(10, 30));
  const lihua = getNextBirthday(10, 30);
  console.log('李华的下一个生日:', lihua);

  console.log('\n测试漫漫🐟的生日（农历5月13日）:');
  console.log('农历日期:', formatLunarDate(5, 13));
  const manman = getNextBirthday(5, 13);
  console.log('漫漫🐟的下一个生日:', manman);
}

