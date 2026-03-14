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
    lat?: number;
    lng?: number;
}

export interface Country {
	name: string;
	shows: Show[];
}

export interface Region {
	name: string;
	countries: Country[];
}

export const tourData: Region[] = [
	{
		name: "KOREA & JAPAN",
		countries: [
			{
				name: "SOUTH KOREA",
				shows: [
					{ date: "04.09", city: "Goyang", venue: "Goyang Stadium", address: "Seoul, KR", day: "Thursday", standard: 550, vip: 1800, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 37.6688, lng: 126.8330 },
					{ date: "04.11", city: "Goyang", venue: "Goyang Stadium", address: "Seoul, KR", day: "Saturday", standard: 650, vip: 2200, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 37.6688, lng: 126.8330 },
					{ date: "04.12", city: "Goyang", venue: "Goyang Stadium", address: "Seoul, KR", day: "Sunday", standard: 650, vip: 2200, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 37.6688, lng: 126.8330 },
					{ date: "06.12", city: "Busan", venue: "Busan Asiad Stadium", address: "Busan, KR", day: "Friday", standard: 550, vip: 1800, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 35.2598, lng: 128.9935 },
					{ date: "06.13", city: "Busan", venue: "Busan Asiad Stadium", address: "Busan, KR", day: "Saturday", standard: 550, vip: 1800, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 35.2598, lng: 128.9935 },
				],
			},
			{
				name: "JAPAN",
				shows: [
					{ date: "04.17", city: "Tokyo", venue: "Tokyo Dome", address: "Tokyo, JP", day: "Friday", standard: 700, vip: 2400, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 35.7056, lng: 139.7519 },
					{ date: "04.18", city: "Tokyo", venue: "Tokyo Dome", address: "Tokyo, JP", day: "Saturday", standard: 850, vip: 2800, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 35.7056, lng: 139.7519 },
					{ date: "04.19", city: "Tokyo", venue: "Tokyo Dome", address: "Tokyo, JP", day: "Sunday", standard: 850, vip: 2800, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 35.7056, lng: 139.7519 },
					{ date: "04.21", city: "Osaka", venue: "Kyocera Dome", address: "Osaka, JP", day: "Tuesday", standard: 700, vip: 2400, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 34.6654, lng: 135.4763 },
					{ date: "04.22", city: "Osaka", venue: "Kyocera Dome", address: "Osaka, JP", day: "Wednesday", standard: 700, vip: 2400, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 34.6654, lng: 135.4763 },
					{ date: "04.24", city: "Nagoya", venue: "Vantelin Dome", address: "Nagoya, JP", day: "Friday", standard: 650, vip: 2100, soldOut: true, standardSeats: 0, vipSeats: -1, imageUrl: "", lat: 35.1853, lng: 136.9066 },
				],
			},
		],
	},
	{
		name: "NORTH AMERICA",
		countries: [
			{
				name: "UNITED STATES - SOUTH",
				shows: [
					{ date: "04.25", city: "Tampa", venue: "Raymond James Stadium", address: "Tampa, FL", day: "Saturday", standard: 450, vip: 1600, soldOut: false, standardSeats: 24, vipSeats: -1, imageUrl: "", lat: 27.9759, lng: -82.5033 },
					{ date: "04.26", city: "Tampa", venue: "Raymond James Stadium", address: "Tampa, FL", day: "Sunday", standard: 420, vip: 1500, soldOut: false, standardSeats: 31, vipSeats: -1, imageUrl: "", lat: 27.9759, lng: -82.5033 },
					{ date: "04.28", city: "Tampa", venue: "Raymond James Stadium", address: "Tampa, FL", day: "Tuesday", standard: 380, vip: 1300, soldOut: false, standardSeats: 45, vipSeats: -1, imageUrl: "", lat: 27.9759, lng: -82.5033 },
					{ date: "05.02", city: "El Paso", venue: "Sun Bowl Stadium", address: "El Paso, TX", day: "Saturday", standard: 350, vip: 1200, soldOut: false, standardSeats: 60, vipSeats: -1, imageUrl: "", lat: 31.7724, lng: -106.5048 },
					{ date: "05.03", city: "El Paso", venue: "Sun Bowl Stadium", address: "El Paso, TX", day: "Sunday", standard: 350, vip: 1200, soldOut: false, standardSeats: 55, vipSeats: -1, imageUrl: "", lat: 31.7724, lng: -106.5048 },
					{ date: "05.30", city: "Arlington", venue: "AT&T Stadium", address: "Arlington, TX", day: "Saturday", standard: 550, vip: 1900, soldOut: false, standardSeats: 26, vipSeats: -1, imageUrl: "", lat: 32.7473, lng: -97.0945 },
					{ date: "08.15", city: "Arlington", venue: "AT&T Stadium", address: "Arlington, TX", day: "Saturday", standard: 550, vip: 1900, soldOut: false, standardSeats: 26, vipSeats: -1, imageUrl: "", lat: 32.7473, lng: -97.0945 },
					{ date: "08.16", city: "Arlington", venue: "AT&T Stadium", address: "Arlington, TX", day: "Sunday", standard: 550, vip: 1900, soldOut: false, standardSeats: 26, vipSeats: -1, imageUrl: "", lat: 32.7473, lng: -97.0945 },
				],
			},
			{
				name: "UNITED STATES - WEST",
				shows: [
					{ date: "05.16", city: "Stanford", venue: "Stanford Stadium", address: "Stanford, CA", day: "Saturday", standard: 650, vip: 2200, soldOut: false, standardSeats: 12, vipSeats: -1, imageUrl: "", lat: 37.4344, lng: -122.1697 },
					{ date: "05.17", city: "Stanford", venue: "Stanford Stadium", address: "Stanford, CA", day: "Sunday", standard: 620, vip: 2100, soldOut: false, standardSeats: 18, vipSeats: -1, imageUrl: "", lat: 37.4344, lng: -122.1697 },
					{ date: "05.19", city: "Stanford", venue: "Stanford Stadium", address: "Stanford, CA", day: "Tuesday", standard: 550, vip: 1900, soldOut: false, standardSeats: 29, vipSeats: -1, imageUrl: "", lat: 37.4344, lng: -122.1697 },
					{ date: "05.23", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Saturday", standard: 750, vip: 2600, soldOut: false, standardSeats: 8, vipSeats: -1, imageUrl: "", lat: 36.0909, lng: -115.1833 },
					{ date: "05.24", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Sunday", standard: 720, vip: 2500, soldOut: false, standardSeats: 14, vipSeats: -1, imageUrl: "", lat: 36.0909, lng: -115.1833 },
					{ date: "05.27", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Wednesday", standard: 650, vip: 2300, soldOut: false, standardSeats: 22, vipSeats: -1, imageUrl: "", lat: 36.0909, lng: -115.1833 },
					{ date: "05.28", city: "Las Vegas", venue: "Allegiant Stadium", address: "Las Vegas, NV", day: "Thursday", standard: 650, vip: 2300, soldOut: false, standardSeats: 20, vipSeats: -1, imageUrl: "", lat: 36.0909, lng: -115.1833 },
					{ date: "09.01", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Tuesday", standard: 720, vip: 2500, soldOut: false, standardSeats: 15, vipSeats: -1, imageUrl: "", lat: 33.9535, lng: -118.3392 },
					{ date: "09.02", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Wednesday", standard: 720, vip: 2500, soldOut: false, standardSeats: 11, vipSeats: -1, imageUrl: "", lat: 33.9535, lng: -118.3392 },
					{ date: "09.05", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Saturday", standard: 780, vip: 2800, soldOut: false, standardSeats: 5, vipSeats: -1, imageUrl: "", lat: 33.9535, lng: -118.3392 },
					{ date: "09.06", city: "Los Angeles", venue: "SoFi Stadium", address: "Inglewood, CA", day: "Sunday", standard: 750, vip: 2700, soldOut: false, standardSeats: 7, vipSeats: -1, imageUrl: "", lat: 33.9535, lng: -118.3392 },
				],
			},
			{
				name: "UNITED STATES - EAST",
				shows: [
					{ date: "08.01", city: "East Rutherford", venue: "MetLife Stadium", address: "East Rutherford, NJ", day: "Saturday", standard: 700, vip: 2400, soldOut: false, standardSeats: 9, vipSeats: -1, imageUrl: "", lat: 40.8128, lng: -74.0742 },
					{ date: "08.02", city: "East Rutherford", venue: "MetLife Stadium", address: "East Rutherford, NJ", day: "Sunday", standard: 700, vip: 2400, soldOut: false, standardSeats: 9, vipSeats: -1, imageUrl: "", lat: 40.8128, lng: -74.0742 },
					{ date: "08.05", city: "Foxborough", venue: "Gillette Stadium", address: "Foxborough, MA", day: "Wednesday", standard: 600, vip: 2100, soldOut: false, standardSeats: 15, vipSeats: -1, imageUrl: "", lat: 42.0909, lng: -71.2643 },
					{ date: "08.06", city: "Foxborough", venue: "Gillette Stadium", address: "Foxborough, MA", day: "Thursday", standard: 600, vip: 2100, soldOut: false, standardSeats: 15, vipSeats: -1, imageUrl: "", lat: 42.0909, lng: -71.2643 },
					{ date: "08.10", city: "Baltimore", venue: "M&T Bank Stadium", address: "Baltimore, MD", day: "Monday", standard: 580, vip: 2000, soldOut: false, standardSeats: 20, vipSeats: -1, imageUrl: "", lat: 39.2780, lng: -76.6227 },
					{ date: "08.11", city: "Baltimore", venue: "M&T Bank Stadium", address: "Baltimore, MD", day: "Tuesday", standard: 580, vip: 2000, soldOut: false, standardSeats: 20, vipSeats: -1, imageUrl: "", lat: 39.2780, lng: -76.6227 },
				],
			},
			{
				name: "UNITED STATES - MIDWEST",
				shows: [
					{ date: "08.27", city: "Chicago", venue: "Soldier Field", address: "Chicago, IL", day: "Thursday", standard: 580, vip: 2000, soldOut: false, standardSeats: 33, vipSeats: -1, imageUrl: "", lat: 41.8623, lng: -87.6167 },
					{ date: "08.28", city: "Chicago", venue: "Soldier Field", address: "Chicago, IL", day: "Friday", standard: 580, vip: 2000, soldOut: false, standardSeats: 33, vipSeats: -1, imageUrl: "", lat: 41.8623, lng: -87.6167 },
				],
			},
			{
				name: "CANADA",
				shows: [
					{ date: "08.22", city: "Toronto", venue: "Rogers Centre", address: "Toronto, ON", day: "Saturday", standard: 550, vip: 1900, soldOut: false, standardSeats: 21, vipSeats: -1, imageUrl: "", lat: 43.6414, lng: -79.3894 },
					{ date: "08.23", city: "Toronto", venue: "Rogers Centre", address: "Toronto, ON", day: "Sunday", standard: 550, vip: 1900, soldOut: false, standardSeats: 21, vipSeats: -1, imageUrl: "", lat: 43.6414, lng: -79.3894 },
				],
			},
			{
				name: "MEXICO",
				shows: [
					{ date: "05.07", city: "Mexico City", venue: "Estadio GNP Seguros", address: "Mexico City, MX", day: "Saturday", standard: 400, vip: 1400, soldOut: false, standardSeats: 40, vipSeats: -1, imageUrl: "", lat: 19.4042, lng: -99.1332 },
					{ date: "05.09", city: "Mexico City", venue: "Estadio GNP Seguros", address: "Mexico City, MX", day: "Monday", standard: 400, vip: 1400, soldOut: false, standardSeats: 40, vipSeats: -1, imageUrl: "", lat: 19.4042, lng: -99.1332 },
					{ date: "05.10", city: "Mexico City", venue: "Estadio GNP Seguros", address: "Mexico City, MX", day: "Tuesday", standard: 400, vip: 1400, soldOut: false, standardSeats: 40, vipSeats: -1, imageUrl: "", lat: 19.4042, lng: -99.1332 },
				],
			},
		],
	},
	{
		name: "EUROPE",
		countries: [
			{
				name: "WESTERN EUROPE",
				shows: [
					{ date: "06.26", city: "Madrid", venue: "Riyadh Air Metropolitano", address: "Madrid, ES", day: "Friday", standard: 450, vip: 1600, soldOut: false, standardSeats: 28, vipSeats: -1, imageUrl: "", lat: 40.4362, lng: -3.5995 },
					{ date: "06.27", city: "Madrid", venue: "Riyadh Air Metropolitano", address: "Madrid, ES", day: "Saturday", standard: 450, vip: 1600, soldOut: false, standardSeats: 22, vipSeats: -1, imageUrl: "", lat: 40.4362, lng: -3.5995 },
					{ date: "07.01", city: "Brussels", venue: "King Baudouin Stadium", address: "Brussels, BE", day: "Wednesday", standard: 350, vip: 1300, soldOut: false, standardSeats: 48, vipSeats: -1, imageUrl: "", lat: 50.8944, lng: 4.3389 },
					{ date: "07.02", city: "Brussels", venue: "King Baudouin Stadium", address: "Brussels, BE", day: "Thursday", standard: 350, vip: 1300, soldOut: false, standardSeats: 48, vipSeats: -1, imageUrl: "", lat: 50.8944, lng: 4.3389 },
					{ date: "07.11", city: "Munich", venue: "Allianz Arena", address: "Munich, DE", day: "Saturday", standard: 500, vip: 1800, soldOut: false, standardSeats: 19, vipSeats: -1, imageUrl: "", lat: 48.2188, lng: 11.6247 },
					{ date: "07.12", city: "Munich", venue: "Allianz Arena", address: "Munich, DE", day: "Sunday", standard: 500, vip: 1800, soldOut: false, standardSeats: 19, vipSeats: -1, imageUrl: "", lat: 48.2188, lng: 11.6247 },
					{ date: "07.17", city: "Paris", venue: "Stade de France", address: "Paris, FR", day: "Friday", standard: 550, vip: 2000, soldOut: false, standardSeats: 13, vipSeats: -1, imageUrl: "", lat: 48.9244, lng: 2.3601 },
					{ date: "07.18", city: "Paris", venue: "Stade de France", address: "Paris, FR", day: "Saturday", standard: 580, vip: 2100, soldOut: false, standardSeats: 6, vipSeats: -1, imageUrl: "", lat: 48.9244, lng: 2.3601 },
				],
			},
			{
				name: "UK & IRELAND",
				shows: [
					{ date: "07.06", city: "London", venue: "Tottenham Hotspur Stadium", address: "London, UK", day: "Monday", standard: 600, vip: 2100, soldOut: false, standardSeats: 10, vipSeats: -1, imageUrl: "", lat: 51.6045, lng: -0.0665 },
					{ date: "07.07", city: "London", venue: "Tottenham Hotspur Stadium", address: "London, UK", day: "Tuesday", standard: 600, vip: 2100, soldOut: false, standardSeats: 8, vipSeats: -1, imageUrl: "", lat: 51.6045, lng: -0.0665 },
				],
			},
		],
	},
	{
		name: "LATIN AMERICA",
		countries: [
			{
				name: "ANDEAN REGION",
				shows: [
					{ date: "10.02", city: "Bogota", venue: "Estadio El Campin", address: "Bogota, CO", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 4.6539, lng: -74.0634 },
					{ date: "10.03", city: "Bogota", venue: "Estadio El Campin", address: "Bogota, CO", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 4.6539, lng: -74.0634 },
					{ date: "10.09", city: "Lima", venue: "Estadio Nacional", address: "Lima, PE", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -12.0689, lng: -77.0325 },
					{ date: "10.10", city: "Lima", venue: "Estadio Nacional", address: "Lima, PE", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -12.0689, lng: -77.0325 },
					{ date: "10.16", city: "Santiago", venue: "Estadio Nacional", address: "Santiago, CL", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -33.4626, lng: -70.6109 },
					{ date: "10.17", city: "Santiago", venue: "Estadio Nacional", address: "Santiago, CL", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -33.4626, lng: -70.6109 },
				],
			},
			{
				name: "SOUTHERN CONE",
				shows: [
					{ date: "10.23", city: "Buenos Aires", venue: "Estadio Monumental", address: "Buenos Aires, AR", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -34.5451, lng: -58.4497 },
					{ date: "10.24", city: "Buenos Aires", venue: "Estadio Monumental", address: "Buenos Aires, AR", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -34.5451, lng: -58.4497 },
				],
			},
			{
				name: "BRAZIL",
				shows: [
					{ date: "10.28", city: "São Paulo", venue: "Allianz Parque", address: "São Paulo, BR", day: "Wednesday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -23.5276, lng: -46.6722 },
					{ date: "10.30", city: "São Paulo", venue: "Allianz Parque", address: "São Paulo, BR", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -23.5276, lng: -46.6722 },
					{ date: "10.31", city: "São Paulo", venue: "Allianz Parque", address: "São Paulo, BR", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -23.5276, lng: -46.6722 },
				],
			},
		],
	},
	{
		name: "ASIA PACIFIC",
		countries: [
			{
				name: "GREATER CHINA & PHILIPPINES",
				shows: [
					{ date: "11.19", city: "Kaohsiung", venue: "National Stadium", address: "Kaohsiung, TW", day: "Thursday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 22.7031, lng: 120.2944 },
					{ date: "11.21", city: "Kaohsiung", venue: "National Stadium", address: "Kaohsiung, TW", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 22.7031, lng: 120.2944 },
					{ date: "11.22", city: "Kaohsiung", venue: "National Stadium", address: "Kaohsiung, TW", day: "Sunday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 22.7031, lng: 120.2944 },
					{ date: "03.04", city: "Hong Kong", venue: "Kai Tak Stadium", address: "Hong Kong, HK", day: "Wednesday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 22.3264, lng: 114.1956 },
					{ date: "03.06", city: "Hong Kong", venue: "Kai Tak Stadium", address: "Hong Kong, HK", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 22.3264, lng: 114.1956 },
					{ date: "03.07", city: "Hong Kong", venue: "Kai Tak Stadium", address: "Hong Kong, HK", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 22.3264, lng: 114.1956 },
					{ date: "03.13", city: "Manila", venue: "Philippine Arena", address: "Manila, PH", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 14.8850, lng: 120.9730 },
					{ date: "03.14", city: "Manila", venue: "Philippine Arena", address: "Manila, PH", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 14.8850, lng: 120.9730 },
				],
			},
			{
				name: "SOUTHEAST ASIA",
				shows: [
					{ date: "12.03", city: "Bangkok", venue: "Rajamangala Stadium", address: "Bangkok, TH", day: "Thursday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 13.7519, lng: 100.6244 },
					{ date: "12.05", city: "Bangkok", venue: "Rajamangala Stadium", address: "Bangkok, TH", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 13.7519, lng: 100.6244 },
					{ date: "12.06", city: "Bangkok", venue: "Rajamangala Stadium", address: "Bangkok, TH", day: "Sunday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 13.7519, lng: 100.6244 },
					{ date: "12.12", city: "Kuala Lumpur", venue: "Bukit Jalil National Stadium", address: "Kuala Lumpur, MY", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 3.0533, lng: 101.6928 },
					{ date: "12.13", city: "Kuala Lumpur", venue: "Bukit Jalil National Stadium", address: "Kuala Lumpur, MY", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 3.0533, lng: 101.6928 },
					{ date: "12.17", city: "Singapore", venue: "National Stadium", address: "Singapore, SG", day: "Thursday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 1.3039, lng: 103.8734 },
					{ date: "12.19", city: "Singapore", venue: "National Stadium", address: "Singapore, SG", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 1.3039, lng: 103.8734 },
					{ date: "12.20", city: "Singapore", venue: "National Stadium", address: "Singapore, SG", day: "Sunday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 1.3039, lng: 103.8734 },
					{ date: "12.22", city: "Singapore", venue: "National Stadium", address: "Singapore, SG", day: "Tuesday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: 1.3039, lng: 103.8734 },
					{ date: "12.26", city: "Jakarta", venue: "Gelora Bung Karno", address: "Jakarta, ID", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -6.2183, lng: 106.8022 },
					{ date: "12.27", city: "Jakarta", venue: "Gelora Bung Karno", address: "Jakarta, ID", day: "Sunday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -6.2183, lng: 106.8022 },
				],
			},
			{
				name: "OCEANIA",
				shows: [
					{ date: "02.12", city: "Melbourne", venue: "Marvel Stadium", address: "Melbourne, AU", day: "Thursday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -37.8164, lng: 144.9465 },
					{ date: "02.13", city: "Melbourne", venue: "Marvel Stadium", address: "Melbourne, AU", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -37.8164, lng: 144.9465 },
					{ date: "02.20", city: "Sydney", venue: "Accor Stadium", address: "Sydney, AU", day: "Friday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -33.8479, lng: 151.0631 },
					{ date: "02.21", city: "Sydney", venue: "Accor Stadium", address: "Sydney, AU", day: "Saturday", standard: 0, vip: 0, soldOut: false, standardSeats: 0, vipSeats: -1, imageUrl: "", isTBA: true, lat: -33.8479, lng: 151.0631 },
				],
			},
		],
	},
];