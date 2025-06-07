interface BirthdayConfig {
  lunarMonth: number;
  lunarDay: number;
  theme: {
    color: string;
    hoverColor: string;
    lightColor: string;
    borderColor: string;
    textColor: string;
    icon: string;
  };
}

type UserBirthdays = {
  [key: string]: BirthdayConfig;
};

export const userBirthdays: UserBirthdays = {
  "李华": {
    lunarMonth: 10,
    lunarDay: 30,
    theme: {
      color: "bg-gradient-to-r from-blue-400 to-purple-500",
      hoverColor: "hover:from-blue-500 hover:to-purple-600",
      lightColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      icon: "🎂"
    }
  },
  "漫漫🐟": {
    lunarMonth: 5,
    lunarDay: 13,
    theme: {
      color: "bg-gradient-to-r from-pink-400 to-orange-400",
      hoverColor: "hover:from-pink-500 hover:to-orange-500",
      lightColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-600",
      icon: "🐟"
    }
  }
}; 