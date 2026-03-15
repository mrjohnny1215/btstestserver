interface EventCardProps {
  show: Show;
  onClick: () => void;
}

export function EventCard({ show, onClick }: EventCardProps) {
  if (show.isTBA) {
    return (
      <div className="border rounded-lg overflow-hidden shadow bg-gray-50 opacity-75">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{show.city}</h3>
            <span className="text-sm text-orange-500 font-semibold">STAY TUNED</span>
          </div>
          
          <p className="text-gray-600 mb-1">Details Coming Soon</p>
          <p className="text-gray-500 text-sm mb-3">To Be Announced</p>
          
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed">
            <span className="text-gray-400">TBA</span>
            <span className="text-gray-400">TBA</span>
          </div>
        </div>
      </div>
    );
  }

   return (
    <div 
      onClick={onClick}
      className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{show.city}</h3>
          <span className="text-sm text-gray-500">{show.date}</span>
        </div>
        
        <p className="text-gray-600 mb-1">{show.venue}</p>
        <p className="text-gray-500 text-sm mb-3">{show.day}</p>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t">
          <div>
            {show.vipSeats === 0 ? (
              <span className="text-red-500 text-sm font-medium">VIP Unavailable</span>
            ) : (
              <span className="text-purple-600 text-sm">VIP ${show.vip}</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-green-600 font-bold text-lg">
              from ${show.standard}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}