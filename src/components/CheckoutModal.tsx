import { useState, useEffect, useMemo } from "react";
import { type Show } from "../data/tourData";
import { activeVenuesConfig } from "../data/seatingConfig";  // ✅ "seating"으로 수정!
import { PaymentPage } from "./PaymentPage";
import emailjs from '@emailjs/browser';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MAX_TICKETS_PER_ORDER = 4;

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`;
}

function formatFullDateTime(dateStr: string, day: string) {
  if (!dateStr || !dateStr.includes(".")) return dateStr;
  const [m, d] = dateStr.split(".");
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthIndex = parseInt(m, 10) - 1;
  const monthName = months[monthIndex];
  const dayNum = parseInt(d, 10);
  const year = (m === "01" || m === "02") ? 2027 : 2026;
  const shortDay = day.substring(0, 3).toUpperCase();
  const time = "8:00 PM";
  return `${shortDay} • ${monthName} ${dayNum}, ${year} • ${time}`;
}

const BTS_IMAGE_URL = "https://cdn.psnews.co.kr/news/photo/202107/1862874_29317_500.JPG";

function getArtistImage(show: Show) {
  return BTS_IMAGE_URL;
}

function UsdtIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/USDT_Logo.png" alt="USDT" className={className} />;
}

function UsdcIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png" alt="USDC" className={className} />;
}

interface Seat {
  id: string;
  sectionName: string;
  row: string;
  seat: number;
  text: string;
  price: number;
}

interface CheckoutModalProps {
  show: Show;
  onClose: () => void;
  hapticNotification?: (type?: 'success' | 'error' | 'warning') => void;
}

export function CheckoutModal({ show, onClose, hapticNotification }: CheckoutModalProps) {
  const [step, setStep] = useState<"select" | "info" | "payment" | "confirmed" | "details">("select");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [availableSections, setAvailableSections] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [crypto, setCrypto] = useState<"USDT" | "USDC">("USDT");
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedTxId, setConfirmedTxId] = useState("");
  const [showTransferError, setShowTransferError] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTotalOpen, setIsTotalOpen] = useState(true);
  const [seatAssignments, setSeatAssignments] = useState<Record<string, Seat[]>>({});
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    const venueConfig = activeVenuesConfig[show.venue];
    if (venueConfig && venueConfig.sections.length > 0) {
      setAvailableSections(venueConfig.sections);
      const firstAvailable = venueConfig.sections.find(s => !s.isSoldOut);
      if (firstAvailable) {
        setSelectedSectionId(firstAvailable.id);
        setQuantities({ [firstAvailable.id]: 0 });
      }
    } else {
      setAvailableSections([]);
      setSelectedSectionId("");
    }
  }, [show.venue]);

  useEffect(() => {
    const newAssignments: Record<string, Seat[]> = {};
    availableSections.forEach(section => {
      const qty = quantities[section.id] || 0;
      if (qty === 0) {
        newAssignments[section.id] = [];
        return;
      }
      const existingSeats = seatAssignments[section.id] || [];
      if (existingSeats.length === qty) {
        newAssignments[section.id] = existingSeats;
      } else {
        const baseRow = String.fromCharCode(65 + Math.floor(Math.random() * 10));
        const baseSeat = Math.floor(Math.random() * 40) + 1;
        const seats: Seat[] = [];
        for (let i = 0; i < qty; i++) {
          seats.push({
            id: `${section.id}-${baseRow}-${baseSeat + i}`,
            sectionName: section.name,
            row: baseRow,
            seat: baseSeat + i,
            text: `${section.name}, Row ${baseRow}, Seat ${baseSeat + i}`,
            price: section.price,
          });
        }
        newAssignments[section.id] = seats;
      }
    });
    setSeatAssignments(newAssignments);
  }, [quantities, availableSections]);

  const currentSection = availableSections.find(s => s.id === selectedSectionId);
  const totalPrice = availableSections.reduce((sum, section) => {
    const qty = quantities[section.id] || 0;
    return sum + (section.price * qty);
  }, 0);
  const totalQuantity = availableSections.reduce((sum, section) => {
    return sum + (quantities[section.id] || 0);
  }, 0);

  const isEmailValid = useMemo(() => {
    if (!email) return false;
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email);
  }, [email]);

  const allSeats = useMemo(() => {
    return Object.values(seatAssignments).flat();
  }, [seatAssignments]);

  const handleQuantityChange = (sectionId: string, change: number) => {
    const currentQty = quantities[sectionId] || 0;
    const newQty = currentQty + change;
    if (newQty >= 0 && newQty <= MAX_TICKETS_PER_ORDER) {
      setQuantities(prev => ({
        ...prev,
        [sectionId]: newQty
      }));
      if (newQty > 0) {
        setSelectedSectionId(sectionId);
      } else if (sectionId === selectedSectionId) {
        const nextSelected = availableSections.find(s => s.id !== sectionId && (quantities[s.id] || 0) > 0);
        setSelectedSectionId(nextSelected?.id || "");
      }
    }
  };

  const handleConfirmed = async (txHash: string, paymentName: string, paymentEmail: string) => {
    setName(paymentName);
    setEmail(paymentEmail);
    const newOrderNumber = `${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000000)}`;
    setOrderNumber(newOrderNumber);
    setConfirmedTxId(txHash);
    const voucherNum = `BTS-ARIRANG-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;
    
    let ticketDetailsStr = "";
    availableSections.forEach(section => {
      const qty = quantities[section.id] || 0;
      if (qty > 0) {
        if (ticketDetailsStr) ticketDetailsStr += ", ";
        ticketDetailsStr += `${section.name} x ${qty}`;
      }
    });
    
    let seatRowsHtml = '';
    allSeats.forEach((seat, index) => {
      seatRowsHtml += `
        <div style="background-color: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 15px; border: 1px solid #eeeeee;">
          <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed #e5e5e5;">
            <span style="font-size: 12px; font-weight: 900; color: #26A17B; letter-spacing: 1px; text-transform: uppercase;">TICKET ${index + 1}</span>
          </div>
          <div style="display: flex; text-align: center; margin-bottom: 10px;">
            <div style="flex: 1; font-size: 11px; font-weight: 900; color: #999999; letter-spacing: 1px; text-transform: uppercase;">SECTION</div>
            <div style="flex: 1; font-size: 11px; font-weight: 900; color: #999999; letter-spacing: 1px; text-transform: uppercase;">ROW</div>
            <div style="flex: 1; font-size: 11px; font-weight: 900; color: #999999; letter-spacing: 1px; text-transform: uppercase;">SEAT</div>
          </div>
          <div style="display: flex; text-align: center;">
            <div style="flex: 1; font-size: 16px; font-weight: 900; color: #000000;">${seat.sectionName}</div>
            <div style="flex: 1; font-size: 16px; font-weight: 900; color: #000000;">${seat.row}</div>
            <div style="flex: 1; font-size: 16px; font-weight: 900; color: #000000;">${seat.seat}</div>
          </div>
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f0f0f0;">
            <span style="font-size: 11px; color: #888888;">ARMY MEMBERSHIP PRESALE</span>
          </div>
        </div>
      `;
    });
    
    const finalEmail =
      (paymentEmail && paymentEmail.trim() !== "") ? paymentEmail.trim() :
      (email && email.trim() !== "") ? email.trim() :
      "user@example.com";
      
    const addressParts = show.address.split(',');
    const venueState = addressParts.length > 2 ? addressParts[2].trim() : '';
    
    const templateParams = {
      user_name: paymentName || "ARMY",
      USER_NAME: paymentName || "ARMY",
      user_email: finalEmail,
      email: finalEmail,
      CITY_NAME: show.city.toUpperCase(),
      SHOW_DATE: formatFullDateTime(show.date, show.day),
      VENUE_NAME: show.venue,
      VENUE_STATE: venueState,
      voucher_number: voucherNum,
      total_price: totalPrice,
      ticket_details: ticketDetailsStr,
      tx_hash: txHash,
      order_number: newOrderNumber,
      total_quantity: totalQuantity,
      seat_rows_html: seatRowsHtml,
    };
    
    try {
      await emailjs.send(
        'service_pebyhvi',
        'bts',
        templateParams,
        'dntv_YRXxCnVR0vmk'
      );
      if (hapticNotification) hapticNotification('success');
    } catch (error) {
      console.error("❌ 이메일 발송 실패:", error);
      alert(`이메일 발송 실패: ${error.text || '알 수 없는 오류'}`);
    }
    setStep("confirmed");
  };

  const handleTransferClick = () => setShowTransferError(true);
  const headerImageUrl = getArtistImage(show);

  const HelpModal = () => {
    if (!showHelpModal) return null;
    
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowHelpModal(false)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">HELP & SUPPORT</h3>
            <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-black text-sm text-gray-900">CUSTOMER SUPPORT</p>
                <p className="text-xs text-gray-600">Our support team is available 24/7 to assist you with any issues regarding your tickets.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="font-black text-sm text-gray-900">Email Support</p>
                <p className="text-xs text-[#026CDF] font-bold">support@globalstage.com</p>
                <p className="text-xs text-gray-500">Response within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🕒</span>
              <div>
                <p className="font-black text-sm text-gray-900">Operating Hours</p>
                <p className="text-xs text-gray-600">24/7, 365 days a year</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-700">
                For ticket-related inquiries, please contact us with your purchase details.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowHelpModal(false)}
            className="mt-6 w-full py-2.5 bg-[#026CDF] text-white font-black text-sm uppercase tracking-wider rounded-lg hover:bg-[#0047B3] transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center animate-in fade-in duration-300 font-sans" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <HelpModal />
      <div className={`relative w-full sm:max-w-md bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-gray-900 ${step === 'info' ? 'h-full sm:h-[95vh]' : 'h-full sm:h-[90vh]'}`} onClick={(e) => e.stopPropagation()}>
        {step !== "details" && step !== "info" && (
          <div className="flex items-center p-4 bg-[#050505] border-b border-gray-800 sticky top-0 z-20 shadow-lg text-white">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img src={headerImageUrl} alt="BTS" className="w-20 h-20 object-cover rounded-xl border border-white/10 shadow-md bg-gray-800 flex-shrink-0" />
              <div className="flex flex-col justify-center gap-0.5 min-w-0">
                <h2 className="text-2xl font-black leading-none tracking-tighter uppercase truncate text-white drop-shadow-md">{show.city.toUpperCase()}</h2>
                <p className="text-sm text-gray-300 font-bold tracking-wide uppercase truncate drop-shadow-sm">{formatFullDateTime(show.date, show.day)}</p>
                <p className="text-xs text-gray-500 font-bold tracking-wide uppercase truncate">{show.venue}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white p-2 ml-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
          {step === "select" && (
            <div className="space-y-4 p-4">
              <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase text-center">Select Tickets</h3>
              {show.lat && show.lng && (
                <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm relative z-0">
                  <MapContainer 
                    center={[show.lat, show.lng]} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    className="w-full h-full"
                    attributionControl={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[show.lat, show.lng]}><Popup>{show.venue}</Popup></Marker>
                  </MapContainer>
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow pointer-events-none z-10">📍 Venue Location</div>
                </div>
              )}
              {availableSections.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2 sticky top-0 bg-gray-50 py-2 z-10 border-b border-gray-200">
                    <h4 className="text-base font-black uppercase text-gray-900 tracking-widest">SECTIONS</h4>
                    {totalQuantity > 0 && (
                      <div className="text-sm font-black text-[#026CDF]">
                        Total: {totalQuantity} ticket{totalQuantity > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {availableSections.map((sec) => {
                      const qty = quantities[sec.id] || 0;
                      const isSelected = selectedSectionId === sec.id;
                      return (
                        <div
                          key={sec.id}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            sec.isSoldOut
                              ? 'opacity-50 border-gray-200 bg-gray-50'
                              : isSelected
                              ? 'border-[#026CDF] bg-blue-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-[#026CDF] hover:shadow-sm'
                          }`}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-base font-black uppercase tracking-tight ${
                                  sec.isSoldOut ? 'text-gray-400' : isSelected ? 'text-[#026CDF]' : 'text-gray-900'
                                }`}>
                                  {sec.name}
                                </span>
                                {sec.id.includes("FL") && !sec.isSoldOut && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
                                    ★ BEST VIEW
                                  </span>
                                )}
                              </div>
                              {!sec.isSoldOut && (
                                <span className={`text-lg font-black ${isSelected ? 'text-[#026CDF]' : 'text-gray-900'}`}>
                                  {formatPrice(sec.price)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                  </svg>
                                  {sec.rows} rows
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  {sec.seatsPerRow} seats/row
                                </span>
                              </div>
                              {sec.isSoldOut ? (
                                <span className="text-sm font-black text-red-500">SOLD OUT</span>
                              ) : (
                                <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                                  <button
                                    onClick={() => handleQuantityChange(sec.id, -1)}
                                    disabled={qty === 0}
                                    className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-400"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <span className="w-8 text-center font-black text-sm">{qty}</span>
                                  <button
                                    onClick={() => handleQuantityChange(sec.id, 1)}
                                    disabled={qty >= MAX_TICKETS_PER_ORDER}
                                    className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-400"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelected && !sec.isSoldOut && (
                            <div className="absolute -top-2 -right-2 bg-[#026CDF] text-white rounded-full p-1 shadow-lg border-2 border-white">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between shadow-sm">
                  <div>
                    <h4 className="text-sm font-black uppercase text-gray-900">Standard Ticket</h4>
                    <p className="text-xl font-black text-gray-900">{formatPrice(show.standard)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {step === "info" && (
            <div className="flex flex-col h-full bg-gray-50">
              <div className="bg-black text-white px-4 py-4 sticky top-0 z-10 shadow-lg relative overflow-hidden border-t-4 border-[#026CDF]">
                <div className="relative z-10 flex items-center justify-between">
                  <button 
                    onClick={() => setStep("select")}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-xl font-black uppercase tracking-wide text-gray-300 block">GLOBAL STAGE®</span>
                    <h2 className="text-xl font-black uppercase tracking-wide leading-none text-white">CHECKOUT</h2>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full pb-40">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform transition-transform hover:scale-[1.01] z-20 relative -mt-8">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight text-gray-900 text-left">
                      BTS WORLD TOUR 'ARIRANG' IN {show.city.toUpperCase()}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide text-left mt-1">
                      {formatFullDateTime(show.date, show.day)}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase text-left mt-1">{show.venue} - {show.address.split(',')[1].trim()}</p>
                    <div className="pt-3 mt-2 border-t border-gray-100 space-y-1">
                      {allSeats.map((seat) => (
                        <p key={seat.id} className="text-sm font-bold text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                          {totalQuantity} Tickets - {seat.text}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-bold text-[#026CDF] uppercase whitespace-nowrap">Ticket Information</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 border-b border-gray-200">
                    <h4 className="text-lg font-black uppercase text-gray-900 tracking-wider pl-1">Payment</h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setCrypto("USDT")}
                        className={`relative p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-4 ${
                          crypto === "USDT"
                            ? "border-green-500 bg-green-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <UsdtIcon className="w-6 h-6" />
                          <div className="text-left">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-base font-black ${crypto === "USDT" ? "text-green-800" : "text-gray-900"}`}>
                                {totalPrice.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-bold text-gray-500">1 USDT = $1.00 (TRC-20)</span>
                            </div>
                          </div>
                        </div>
                        {crypto === "USDT" && (
                          <div className="text-green-600 shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => setCrypto("USDC")}
                        className={`relative p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-4 ${
                          crypto === "USDC"
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <UsdcIcon className="w-6 h-6" />
                          <div className="text-left">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-base font-black ${crypto === "USDC" ? "text-blue-800" : "text-gray-900"}`}>
                                {totalPrice.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-bold text-gray-500">1 USDC = $1.00 (Solana)</span>
                            </div>
                          </div>
                        </div>
                        {crypto === "USDC" && (
                          <div className="text-blue-600 shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-4"
                      onClick={() => setIsTotalOpen(!isTotalOpen)}
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black uppercase text-gray-900 tracking-wider">TOTAL</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-black">${totalPrice.toLocaleString()}</span>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isTotalOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isTotalOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="mb-4">
                        <p className="text-xs font-black uppercase text-black mb-3">Tickets</p>
                        <div className="space-y-3">
                          {allSeats.map((seat) => (
                            <div key={seat.id} className="flex justify-between items-center text-sm group">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 font-medium">
                                  {seat.sectionName}, Row {seat.row}, Seat {seat.seat}: <span className="text-gray-400">${seat.price.toLocaleString()} x 1</span>
                                </span>
                              </div>
                              <span className="font-bold text-gray-900">${seat.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-gray-200 my-4"></div>
                    </div>
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-[10px] sm:text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
                        I have read and agree to the current <span className="text-[#026CDF] font-bold underline">Terms of Use</span> and <span className="text-[#026CDF] font-bold underline">Standard Purchase Policy</span>.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => setStep("payment")}
                  disabled={!agreedToTerms || totalQuantity === 0}
                  className={`w-full py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 ${
                    agreedToTerms && totalQuantity > 0
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-500/30 active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  PLACE ORDER
                </button>
                <p className="text-[8px] sm:text-[9px] text-center text-gray-400 font-bold mt-2 uppercase tracking-wider">
                  Secure Checkout powered by Blockchain
                </p>
              </div>
            </div>
          )}
          {step === "payment" && (
            <PaymentPage
              orderInfo={{
                email,
                name,
                totalPrice,
                show,
                ticketType: totalQuantity > 0 ? "standard" : "vip",
                quantity: totalQuantity,
                crypto
              }}
              onBack={() => setStep("info")}
              onConfirmed={handleConfirmed}
              onNameChange={setName}
              onEmailChange={setEmail}
            />
          )}
          {step === "confirmed" && (
            <div className="p-4 text-left animate-in fade-in duration-500 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#26A17B] text-white shadow-lg flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none truncate">You're going!</h2>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1">Order # {orderNumber}</p>
                </div>
              </div>
              <div className="border border-gray-200 bg-white rounded-2xl p-4 mb-4 shadow-sm overflow-hidden">
                <h3 className="font-black text-base text-gray-900 uppercase tracking-tight mb-1 truncate">{show.venue}</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">{formatFullDateTime(show.date, show.day)}</p>
                {show.lat && show.lng ? (
                  <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-200 mb-3 relative z-0">
                    <MapContainer 
                      center={[show.lat, show.lng]} 
                      zoom={14} 
                      scrollWheelZoom={false} 
                      className="w-full h-full"
                      attributionControl={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[show.lat, show.lng]}><Popup>{show.venue}</Popup></Marker>
                    </MapContainer>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[9px] font-bold shadow pointer-events-none z-10 border border-gray-200">📍 Venue Location</div>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-gray-400 text-xs font-bold">Map data not available</div>
                )}
                <div className="pt-3 border-t border-gray-100">
                  <span className="font-black text-gray-900 uppercase tracking-wide text-sm">{totalQuantity} TICKETS</span>
                </div>
                
                {allSeats.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {allSeats.map((seat) => (
                      <div key={seat.id} className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-[8px] font-bold text-gray-500 uppercase">Section</p>
                            <p className="text-xs font-black text-gray-900">{seat.sectionName}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-500 uppercase">Row</p>
                            <p className="text-xs font-black text-gray-900">{seat.row}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-500 uppercase">Seat</p>
                            <p className="text-xs font-black text-gray-900">{seat.seat}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setStep("details")} className="w-full py-4 rounded-xl bg-[#050505] text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-all shadow-xl active:scale-95">View Order Details</button>
            </div>
          )}
          {step === "details" && (
            <div className="bg-white min-h-full flex flex-col relative">
              <div className="relative shrink-0">
                <div className="h-48 w-full relative">
                  <img src={getArtistImage(show)} alt="BTS Banner" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                  <button onClick={() => setStep("confirmed")} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </button>
                  <button onClick={() => setShowHelpModal(true)} className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-sm font-bold hover:bg-black/60 transition-all">Help</button>
                </div>
                <div className="relative bg-black text-white p-5 pb-4 z-10">
                  <p className="text-sm font-bold text-white uppercase tracking-wider mb-2 opacity-90">{formatFullDateTime(show.date, show.day)}</p>
                  <h1 className="text-2xl font-black uppercase leading-tight mb-1">BTS WORLD TOUR 'ARIRANG' IN<br/>{show.city.toUpperCase()}</h1>
                  <p className="text-sm font-medium text-gray-300 mt-1">{show.venue} • {show.address.split(', ')[1]}</p>
                </div>
                <div className="bg-[#026CDF] text-white p-3 text-center">
                  <button className="font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 w-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/></svg>
                    View Tickets
                  </button>
                </div>
              </div>
              <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
                <button className="flex-1 py-4 text-base font-bold text-black border-b-2 border-[#026CDF] relative">Tickets</button>
                <button className="flex-1 py-4 text-base font-bold text-gray-400 hover:text-gray-600">Extras</button>
              </div>
              <div className="flex-1 overflow-y-auto bg-white custom-scrollbar pb-24">
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-end px-1 border-b border-gray-100 pb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Order #{orderNumber}</span>
                      <span className="text-sm font-black text-black uppercase">{totalQuantity} Tickets</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                  </div>
                  {allSeats.map((seat, idx) => (
                    <div key={seat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200">
                        <span className="text-xs font-black text-gray-700 uppercase tracking-wide">ARMY MEMBERSHIP PRESALE</span>
                      </div>
                      <div className="p-4 grid grid-cols-3 gap-4 divide-x divide-gray-100">
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Section</p><p className="text-lg font-black text-gray-900">{seat.sectionName}</p></div>
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Row</p><p className="text-lg font-black text-gray-900">{seat.row}</p></div>
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Seat</p><p className="text-lg font-black text-gray-900">{seat.seat}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-50 pointer-events-none px-4">
                <div className="flex gap-3 pointer-events-auto w-full max-w-xs mx-auto">
                  <button onClick={handleTransferClick} className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white rounded-full shadow-xl border border-gray-200 text-gray-900 font-bold text-sm hover:bg-gray-50 transition-all transform hover:-translate-y-1 active:scale-95">
                    <svg className="w-5 h-5 text-[#026CDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Transfer
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white rounded-full shadow-xl border border-gray-200 text-gray-900 font-bold text-sm hover:bg-gray-50 transition-all transform hover:-translate-y-1 active:scale-95">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Sell
                  </button>
                </div>
              </div>
              {showTransferError && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowTransferError(false)}>
                  <div className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-xs mx-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="mb-2 flex justify-center"><svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
                    <h3 className="text-lg font-black uppercase tracking-wide mb-1">Already Transferred</h3>
                    <p className="text-sm font-medium opacity-90 leading-relaxed">This ticket has already been transferred to another account.</p>
                    <button onClick={() => setShowTransferError(false)} className="mt-4 w-full py-2.5 bg-white text-red-600 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-red-50 transition-colors">Confirm</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {step === "select" && (
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end mb-2">
              <span className="font-black text-black text-lg uppercase tracking-widest">Total ({totalQuantity})</span>
              <span className="font-black text-2xl tracking-tighter text-black leading-none">{formatPrice(totalPrice)}</span>
            </div>
            <button onClick={() => setStep("info")} disabled={totalQuantity === 0} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-sm uppercase tracking-[0.2em] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none shadow-lg hover:shadow-green-500/30 active:scale-95 flex items-center justify-center gap-2">
              Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
}