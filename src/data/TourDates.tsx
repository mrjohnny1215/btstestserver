import { tourData } from "../data/tourData";
import { useState } from "react";

interface TourDatesProps {
  onDateSelect?: (show: any) => void;
}

export function TourDates({ onDateSelect }: TourDatesProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("NORTH AMERICA");

  const regions = tourData;
  const currentRegion = regions.find((r) => r.name === selectedRegion);

  const formatPrice = (price: number) => {
    if (price === 0) return "TBA";
    return `$${price.toLocaleString()}~`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">GLOBAL STAGE</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ticket Exchange</p>
          </div>
          <button className="px-4 py-2 bg-gray-100 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-200 transition-colors">
            Tickets
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-5xl mx-auto px-4 flex gap-2 min-w-max">
          {regions.map((region) => (
            <button
              key={region.name}
              onClick={() => setSelectedRegion(region.name)}
              className={`px-4 py-3 text-sm font-black uppercase tracking-wide border-b-2 transition-all ${
                selectedRegion === region.name
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {currentRegion?.countries.map((country) => (
          <div key={country.name} className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 mt-8 mb-4">
              {country.name}
            </h2>
            
            <div className="grid gap-4">
              {country.shows.map((show, idx) => (
                <div
                  key={`${show.city}-${show.date}-${idx}`}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      {show.date.includes(".") 
                        ? `${show.date.split(".")[0]}/${show.date.split(".")[1]}, 2026` 
                        : show.date} • {show.day.substring(0, 3).toUpperCase()}
                    </p>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 truncate">
                      {show.isTBA ? "TBA" : show.city.toUpperCase()}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 truncate">
                      {show.venue}
                    </p>
                  </div>

                  {!show.isTBA && (
                    <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                      
                      <div>
                        <p className="text-base font-bold text-gray-900 uppercase mb-1">STANDARD</p>
                        <p className="text-lg font-black text-green-600">{formatPrice(show.standard)}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <p className="text-base font-bold text-gray-900 uppercase mb-1">VIP</p>
                        <p className="text-sm font-black text-red-500 uppercase">UNAVAILABLE</p>
                      </div>

                      <button
                        onClick={() => onDateSelect?.(show)}
                        disabled={show.soldOut || show.standardSeats === 0}
                        className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 ${
                          show.soldOut || show.standardSeats === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {show.soldOut ? "SOLD OUT" : "GET TICKETS →"}
                      </button>
                    </div>
                  )}

                  {show.isTBA && (
                    <div className="flex items-center justify-end w-full md:w-auto">
                      <button
                        disabled
                        className="px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        STAY TUNED
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}