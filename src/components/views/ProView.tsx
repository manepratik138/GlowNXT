import { Calendar, CheckCircle, Clock, Users, IndianRupee } from "lucide-react";

export default function ProView() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Welcome back, Priya!</h1>
          <p className="text-stone-500 mt-1">Here is what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-stone-600">Status:</span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Earnings", value: "₹4,500", icon: <IndianRupee size={24} className="text-rose-500" /> },
          { label: "Upcoming Bookings", value: "3", icon: <Calendar size={24} className="text-blue-500" /> },
          { label: "Completed This Week", value: "18", icon: <CheckCircle size={24} className="text-green-500" /> },
          { label: "Profile Views", value: "124", icon: <Users size={24} className="text-purple-500" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="bg-stone-50 p-3 rounded-xl">{stat.icon}</div>
            <div>
              <p className="text-sm text-stone-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-stone-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-xl font-bold text-stone-900 mb-4">Pending Requests</h2>
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-stone-900">Bridal Makeup Package</h3>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold">New Request</span>
              </div>
              <p className="text-sm text-stone-600 flex items-center gap-4">
                <span className="flex items-center gap-1"><Clock size={16} /> Tomorrow, 10:00 AM</span>
                <span className="flex items-center gap-1"><Users size={16} /> Ananya Gupta</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-6 py-2 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors">
                Decline
              </button>
              <button className="px-6 py-2 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors">
                Accept Booking
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
