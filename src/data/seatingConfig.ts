export interface SeatingSection {
  id: string;
  name: string;
  type: 'STANDARD' | 'VIP' | 'STANDING';
  rows: number;
  seatsPerRow: number;
  price: number; 
  isStanding?: boolean;
}

export interface VenueConfig {
  venueName: string;
  sections: SeatingSection[];
}

/**
 * 활성화된 공연장 좌석 구성 데이터 (실제 배치도 기반)
 * ✅ 수정 사항:
 * 1. 실제 Ticketmaster 배치도를 기반으로 Section ID 및 이름 매핑
 * 2. 무대와의 거리에 따른 현실적인 가격 책정 (Floor > Lower > Club > Upper)
 * 3. 가격순 자동 정렬 (비싼 순서대로)
 */
export const activeVenuesConfig: Record<string, VenueConfig> = {
  // =======================
  // 🇺🇸 NORTH AMERICA (북미)
  // =======================

  // --- Tier 1: Premium Markets (LA, Las Vegas, Dallas) ---
  "SoFi Stadium": {
    venueName: "SoFi Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1250 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 42, price: 980 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 20, seatsPerRow: 52, price: 820 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 25, seatsPerRow: 52, price: 650 },
      { id: "300", name: "Section 300", type: "STANDARD", rows: 30, seatsPerRow: 52, price: 520 },
      { id: "400", name: "Section 400", type: "STANDARD", rows: 35, seatsPerRow: 52, price: 420 },
    ]
  },
  "Allegiant Stadium": {
    venueName: "Allegiant Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1180 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 960 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 20, seatsPerRow: 52, price: 790 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 25, seatsPerRow: 52, price: 620 },
      { id: "300", name: "Section 300", type: "STANDARD", rows: 30, seatsPerRow: 52, price: 490 },
      { id: "400", name: "Section 400", type: "STANDARD", rows: 35, seatsPerRow: 52, price: 420 },
    ]
  },
  "AT&T Stadium": {
    venueName: "AT&T Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1150 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 950 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 25, seatsPerRow: 52, price: 780 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 30, seatsPerRow: 52, price: 610 },
      { id: "300", name: "Section 300", type: "STANDARD", rows: 35, seatsPerRow: 52, price: 480 },
      { id: "400", name: "Section 400", type: "STANDARD", rows: 40, seatsPerRow: 52, price: 420 },
    ]
  },

  // --- Tier 2: Major Markets (NJ, Chicago, Toronto) ---
  "MetLife Stadium": {
    venueName: "MetLife Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1100 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 920 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 20, seatsPerRow: 50, price: 750 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 25, seatsPerRow: 50, price: 580 },
      { id: "300", name: "Section 300", type: "STANDARD", rows: 30, seatsPerRow: 50, price: 390 },
    ]
  },
  "Soldier Field": {
    venueName: "Soldier Field",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1050 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 900 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 18, seatsPerRow: 50, price: 720 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 22, seatsPerRow: 50, price: 560 },
      { id: "300", name: "Section 300", type: "STANDARD", rows: 25, seatsPerRow: 50, price: 390 },
    ]
  },
  "Rogers Centre": {
    venueName: "Rogers Centre",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 10, seatsPerRow: 38, price: 980 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 12, seatsPerRow: 38, price: 850 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 15, seatsPerRow: 48, price: 680 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 20, seatsPerRow: 48, price: 540 },
      { id: "500", name: "Section 500", type: "STANDARD", rows: 25, seatsPerRow: 48, price: 390 },
    ]
  },

  // --- Tier 3: Standard Markets (Tampa, Stanford, Europe Major) ---
  "Raymond James Stadium": {
    venueName: "Raymond James Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1020 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 890 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 20, seatsPerRow: 50, price: 680 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 25, seatsPerRow: 50, price: 520 },
      { id: "300", name: "Section 300", type: "STANDARD", rows: 30, seatsPerRow: 50, price: 380 },
    ]
  },
  "Stanford Stadium": {
    venueName: "Stanford Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 980 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 880 },
      { id: "L1", name: "Section 100", type: "STANDARD", rows: 15, seatsPerRow: 50, price: 650 },
      { id: "U1", name: "Section 300", type: "STANDARD", rows: 20, seatsPerRow: 50, price: 380 },
    ]
  },
  "Tottenham Hotspur Stadium": {
    venueName: "Tottenham Hotspur Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1050 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 920 },
      { id: "L1", name: "Section 100", type: "STANDARD", rows: 15, seatsPerRow: 48, price: 750 },
      { id: "L2", name: "Section 200", type: "STANDARD", rows: 20, seatsPerRow: 48, price: 620 },
      { id: "L3", name: "Section 300", type: "STANDARD", rows: 25, seatsPerRow: 48, price: 510 },
      { id: "L4", name: "Section 400", type: "STANDARD", rows: 30, seatsPerRow: 48, price: 440 },
      { id: "L5", name: "Section 500", type: "STANDARD", rows: 35, seatsPerRow: 48, price: 390 },
    ]
  },
  "Stade de France": {
    venueName: "Stade de France",
    sections: [
      { id: "OR", name: "Carré Or", type: "VIP", rows: 10, seatsPerRow: 30, price: 1100 },
      { id: "CAT1", name: "Catégorie 1", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 860 },
      { id: "CAT2", name: "Catégorie 2", type: "STANDARD", rows: 20, seatsPerRow: 45, price: 680 },
      { id: "CAT3", name: "Catégorie 3", type: "STANDARD", rows: 25, seatsPerRow: 50, price: 550 },
      { id: "PELOUSE", name: "Pelouse Debout", type: "STANDING", rows: 50, seatsPerRow: 100, price: 390, isStanding: true },
    ]
  },
  "Allianz Arena": {
    venueName: "Allianz Arena",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 38, price: 980 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 38, price: 840 },
      { id: "L1", name: "Section 100", type: "STANDARD", rows: 15, seatsPerRow: 46, price: 660 },
      { id: "L2", name: "Section 200", type: "STANDARD", rows: 20, seatsPerRow: 46, price: 540 },
      { id: "L3", name: "Section 300", type: "STANDARD", rows: 25, seatsPerRow: 46, price: 380 },
    ]
  },
  "Riyadh Air Metropolitano": {
    venueName: "Riyadh Air Metropolitano",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 38, price: 950 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 38, price: 820 },
      { id: "L1", name: "Section 100", type: "STANDARD", rows: 15, seatsPerRow: 46, price: 640 },
      { id: "U1", name: "Section 300", type: "STANDARD", rows: 20, seatsPerRow: 46, price: 380 },
    ]
  },

  // --- Tier 4: Value Markets (El Paso, Brussels) ---
  "Sun Bowl Stadium": {
    venueName: "Sun Bowl Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 10, seatsPerRow: 35, price: 850 },
      { id: "L1-B", name: "Section 100", type: "STANDARD", rows: 15, seatsPerRow: 45, price: 720 },
      { id: "U1", name: "Section 300", type: "STANDARD", rows: 20, seatsPerRow: 45, price: 350 },
    ]
  },
  "King Baudouin Stadium": {
    venueName: "King Baudouin Stadium",
    sections: [
      { id: "FL-ZONE", name: "Standing Floor Zone", type: "STANDING", rows: 40, seatsPerRow: 100, price: 740, isStanding: true },
      { id: "L1-B", name: "Section 100", type: "STANDARD", rows: 15, seatsPerRow: 45, price: 650 },
      { id: "U1", name: "Section 300", type: "STANDARD", rows: 20, seatsPerRow: 45, price: 360 },
    ]
  },
  
  // --- Additional Venues (Based on Maps) ---
  "Gillette Stadium": {
    venueName: "Gillette Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 1000 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 880 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 20, seatsPerRow: 50, price: 700 },
      { id: "CL", name: "Club Level", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 580 },
      { id: "300", name: "Section 300", type: "STANDARD", rows: 25, seatsPerRow: 50, price: 420 },
    ]
  },
  "M&T Bank Stadium": {
    venueName: "M&T Bank Stadium",
    sections: [
      { id: "FL-A", name: "Floor A", type: "STANDARD", rows: 12, seatsPerRow: 40, price: 980 },
      { id: "FL-B", name: "Floor B", type: "STANDARD", rows: 15, seatsPerRow: 40, price: 860 },
      { id: "100", name: "Section 100", type: "STANDARD", rows: 20, seatsPerRow: 50, price: 680 },
      { id: "200", name: "Section 200", type: "STANDARD", rows: 25, seatsPerRow: 50, price: 540 },
      { id: "500", name: "Section 500", type: "STANDARD", rows: 30, seatsPerRow: 50, price: 380 },
    ]
  }
};