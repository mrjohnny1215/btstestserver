export interface Show {
  date: string;
  city: string;
  venue: string;
  address: string;
  day: string;
  standard: number;
  vip: number;
  soldOut: boolean;
  standardSeats: number;
  vipSeats: number;
  imageUrl: string;
  isTBA?: boolean;
}

export interface Country {
  name: string;
  flag: string;
  shows: Show[];
}

export interface Region {
  name: string;
  emoji: string;
  countries: Country[];
}

// 💡 VIP 잔여 좌석을 8석 ~ 19석 사이로 더 줄여서 조급함을 극대화합니다.
function rv(): number {
  return Math.floor(Math.random() * 12) + 8;
}

export const tourData: Region[] = [
  {
    name: "ASIA-PACIFIC",
    emoji: "🌏",
    countries: [
      {
        name: "SOUTH KOREA & JAPAN",
        flag: "https://flagcdn.com/w80/kr.png,https://flagcdn.com/w80/jp.png",
        shows: [
          // 💡 이미 지난/완전 매진된 공연도 가격을 현실적(Standard $150 내외, VIP $450 내외)으로 수정
          { date: "04.09", city: "Goyang", venue: "Goyang Stadium", address: "Seoul, KR", day: "Thursday", standard: 120, vip: 350, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.11", city: "Goyang", venue: "Goyang Stadium", address: "Seoul, KR", day: "Saturday", standard: 150, vip: 450, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.12", city: "Goyang", venue: "Goyang Stadium", address: "Seoul, KR", day: "Sunday", standard: 150, vip: 450, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.17", city: "Tokyo", venue: "Tokyo Dome", address: "Tokyo, JP", day: "Friday", standard: 160, vip: 499, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.18", city: "Tokyo", venue: "Tokyo Dome", address: "Tokyo, JP", day: "Saturday", standard: 180, vip: 550, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.19", city: "Tokyo", venue: "Tokyo Dome", address: "Tokyo, JP", day: "Sunday", standard: 180, vip: 550, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.21", city: "Osaka", venue: "Kyocera Dome", address: "Osaka, JP", day: "Tuesday", standard: 140, vip: 450, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.22", city: "Osaka", venue: "Kyocera Dome", address: "Osaka, JP", day: "Wednesday", standard: 140, vip: 450, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "04.24", city: "Nagoya", venue: "Vantelin Dome", address: "Nagoya, JP", day: "Friday", standard: 130, vip: 400, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "06.12", city: "Busan", venue: "Busan Asiad Stadium", address: "Busan, KR", day: "Friday", standard: 120, vip: 350, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
          { date: "06.13", city: "Busan", venue: "Busan Asiad Stadium", address: "Busan, KR", day: "Saturday", standard: 150, vip: 450, soldOut: true, standardSeats: 0, vipSeats: 0, imageUrl: "" },
        ],
      },
      {
        name: "SE ASIA & OCEANIA",
        flag: "https://flagcdn.com/w80/th.png,https://flagcdn.com/w80/sg.png,https://flagcdn.com/w80/id.png,https://flagcdn.com/w80/au.png",
        shows: [
          { date: "12.03", city: "Bangkok", venue: "Rajamangala Stadium", address: "Bangkok, TH", day: "Thursday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "12.05", city: "Bangkok", venue: "Rajamangala Stadium", address: "Bangkok, TH", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "12.06", city: "Bangkok", venue: "Rajamangala Stadium", address: "Bangkok, TH", day: "Sunday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "12.17", city: "Singapore", venue: "National Stadium", address: "Singapore, SG", day: "Thursday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "12.19", city: "Singapore", venue: "National Stadium", address: "Singapore, SG", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "12.23", city: "Jakarta", venue: "Gelora Bung Karno", address: "Jakarta, ID", day: "Wednesday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "02.12", city: "Melbourne", venue: "Marvel Stadium", address: "Melbourne, AU", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "02.15", city: "Sydney", venue: "Accor Stadium", address: "Sydney, AU", day: "Monday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
        ],
      },
    ],
  },
  {
    name: "NORTH AMERICA",
    emoji: "🌎",
    countries: [
      {
        name: "UNITED STATES & CANADA",
        flag: "https://flagcdn.com/w80/us.png,https://flagcdn.com/w80/mx.png,https://flagcdn.com/w80/ca.png",
        shows: [
          // 💡 북미 투어: 스탠다드 $150~250 (모두 0석), VIP $499~$899 (극소수 잔여석)
          { date: "04.25", city: "Tampa", venue: "Raymond James Stadium", address: "Tampa, FL", day: "Saturday", standard: 180, vip: 550, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "04.26", city: "Tampa", venue: "Raymond James Stadium", address: "Tampa, FL", day: "Sunday", standard: 180, vip: 550, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "04.28", city: "Tampa", venue: "Raymond James Stadium", address: "Tampa, FL", day: "Tuesday", standard: 160, vip: 499, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.02", city: "El Paso", venue: "Sun Bowl Stadium", address: "El Paso, TX", day: "Saturday", standard: 150, vip: 499, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.03", city: "El Paso", venue: "Sun Bowl Stadium", address: "El Paso, TX", day: "Sunday", standard: 150, vip: 499, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.16", city: "Stanford", venue: "Stanford Stadium", address: "Stanford, CA", day: "Saturday", standard: 190, vip: 599, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.17", city: "Stanford", venue: "Stanford Stadium", address: "Stanford, CA", day: "Sunday", standard: 190, vip: 599, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.19", city: "Stanford", venue: "Stanford Stadium", address: "Stanford, CA", day: "Tuesday", standard: 170, vip: 550, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.23", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Saturday", standard: 250, vip: 799, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.24", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Sunday", standard: 250, vip: 799, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.27", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Wednesday", standard: 220, vip: 699, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.28", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Thursday", standard: 220, vip: 699, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "05.30", city: "Arlington", venue: "AT&T Stadium", address: "Arlington, TX", day: "Saturday", standard: 200, vip: 650, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "08.01", city: "New Jersey", venue: "MetLife Stadium", address: "E. Rutherford, NJ", day: "Saturday", standard: 220, vip: 699, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "08.22", city: "Toronto", venue: "Rogers Centre", address: "Toronto, CA", day: "Saturday", standard: 180, vip: 550, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "08.27", city: "Chicago", venue: "Soldier Field", address: "Chicago, IL", day: "Thursday", standard: 200, vip: 599, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "09.01", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Tuesday", standard: 250, vip: 799, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "09.02", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Wednesday", standard: 250, vip: 799, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "09.05", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Saturday", standard: 299, vip: 899, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "09.06", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Sunday", standard: 299, vip: 899, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
        ],
      },
    ],
  },
  {
    name: "EUROPE",
    emoji: "🌍",
    countries: [
      {
        name: "EUROPEAN HUB",
        flag: "https://flagcdn.com/w80/es.png,https://flagcdn.com/w80/gb.png,https://flagcdn.com/w80/fr.png,https://flagcdn.com/w80/de.png,https://flagcdn.com/w80/be.png",
        shows: [
          // 💡 유럽 투어: 북미와 비슷한 현실적인 프리미엄 가격대
          { date: "06.20", city: "Madrid", venue: "Riyadh Air Metropolitano", address: "Madrid, ES", day: "Saturday", standard: 180, vip: 550, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "06.26", city: "Madrid", venue: "Riyadh Air Metropolitano", address: "Madrid, ES", day: "Friday", standard: 180, vip: 550, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "06.27", city: "Madrid", venue: "Riyadh Air Metropolitano", address: "Madrid, ES", day: "Saturday", standard: 190, vip: 599, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "07.01", city: "Brussels", venue: "King Baudouin Stadium", address: "Brussels, BE", day: "Wednesday", standard: 150, vip: 499, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "07.06", city: "London", venue: "Tottenham Stadium", address: "London, UK", day: "Monday", standard: 220, vip: 750, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "07.07", city: "London", venue: "Tottenham Stadium", address: "London, UK", day: "Tuesday", standard: 220, vip: 750, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "07.12", city: "Munich", venue: "Allianz Arena", address: "Munich, DE", day: "Sunday", standard: 190, vip: 599, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "07.17", city: "Paris", venue: "Stade de France", address: "Paris, FR", day: "Friday", standard: 200, vip: 699, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
          { date: "07.18", city: "Paris", venue: "Stade de France", address: "Paris, FR", day: "Saturday", standard: 250, vip: 799, soldOut: false, standardSeats: 0, vipSeats: rv(), imageUrl: "" },
        ],
      },
    ],
  },
  {
    name: "LATIN AMERICA & MIDDLE EAST",
    emoji: "🕌",
    countries: [
      {
        name: "SOUTH AMERICA & UAE",
        flag: "https://flagcdn.com/w80/br.png,https://flagcdn.com/w80/ar.png,https://flagcdn.com/w80/ae.png",
        shows: [
          { date: "10.23", city: "Buenos Aires", venue: "Estadio Monumental", address: "Buenos Aires, AR", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "10.30", city: "São Paulo", venue: "Allianz Parque", address: "São Paulo, BR", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "10.31", city: "São Paulo", venue: "Allianz Parque", address: "São Paulo, BR", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "01.15", city: "Dubai", venue: "Coca-Cola Arena", address: "Dubai, UAE", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
          { date: "01.16", city: "Dubai", venue: "Coca-Cola Arena", address: "Dubai, UAE", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: 0, imageUrl: "", isTBA: true },
        ],
      },
    ],
  },
];
