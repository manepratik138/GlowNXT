import { Search, MapPin, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MOCK_PROFESSIONALS = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Senior Hair Stylist",
    rating: 4.9,
    reviews: 128,
    distance: "1.2 km",
    time: "Available in 30 mins",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Haircut", "Coloring", "Bridal"],
  },
  {
    id: "2",
    name: "Ayesha Khan",
    role: "Makeup & Mehendi Artist",
    rating: 4.8,
    reviews: 95,
    distance: "2.5 km",
    time: "Available tomorrow",
    image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Bridal Makeup", "Mehendi", "Facial"],
  },
  {
    id: "3",
    name: "Rahul Verma",
    role: "Grooming Expert",
    rating: 4.7,
    reviews: 210,
    distance: "0.8 km",
    time: "Available in 15 mins",
    image: "https://images.unsplash.com/photo-1622281189295-f62f3f1e5828?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Men's Grooming", "Beard Styling", "Kids"],
  },
];

export default function CustomerView() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-8 sm:p-16 lg:p-24 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-slate-900 z-0 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/30 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/30 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 text-sm font-medium text-rose-100">
            <Star size={16} className="text-rose-400" />
            <span>India's Premium At-Home Beauty Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Your Personal Beauty Services <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">Delivered At Home</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
            Book verified beauty professionals, makeup artists, and grooming experts directly to your doorstep.
          </p>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl rounded-full p-2 flex flex-col sm:flex-row shadow-2xl border border-white/20 max-w-4xl mx-auto gap-2">
            <div className="flex-1 flex items-center px-6 py-4 border-b sm:border-b-0 sm:border-r border-white/10">
              <MapPin className="text-rose-400 mr-3 shrink-0" size={24} />
              <input 
                type="text" 
                placeholder="Your location (e.g. Bandra West)" 
                className="w-full bg-transparent focus:outline-none text-white placeholder-slate-400 font-medium text-lg"
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-4">
              <Search className="text-slate-400 mr-3 shrink-0" size={24} />
              <input 
                type="text" 
                placeholder="Search services (e.g. Haircut)" 
                className="w-full bg-transparent focus:outline-none text-white placeholder-slate-400 font-medium text-lg"
              />
            </div>
            <button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-10 py-4 font-bold transition-all w-full sm:w-auto shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-slate-500 mt-2 font-medium">Find the perfect beauty service for your needs</p>
          </div>
          <button className="text-rose-600 font-bold hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-5 py-2.5 rounded-full transition-colors text-sm">View all services</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {[
            { name: "Haircut & Styling", icon: "✂️", color: "from-orange-400 to-rose-400", shadow: "shadow-orange-200" },
            { name: "Bridal Makeup", icon: "👑", color: "from-rose-400 to-pink-500", shadow: "shadow-pink-200" },
            { name: "Mehendi Art", icon: "🌿", color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200" },
            { name: "Skincare", icon: "✨", color: "from-blue-400 to-indigo-500", shadow: "shadow-blue-200" },
            { name: "Kids Haircut", icon: "🎈", color: "from-purple-400 to-fuchsia-500", shadow: "shadow-purple-200" },
            { name: "Elder Care", icon: "❤️", color: "from-red-400 to-rose-500", shadow: "shadow-red-200" }
          ].map((category, idx) => (
            <div key={idx} className="bg-white rounded-[1.5rem] p-5 text-center border border-slate-100 hover:shadow-xl hover:-translate-y-2 cursor-pointer transition-all duration-300 group">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${category.color} text-white shadow-lg ${category.shadow} group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Professionals */}
      <section className="py-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Rated Near You</h2>
            <p className="text-slate-500 mt-2 font-medium">Highly recommended experts in your area</p>
          </div>
          <button className="text-rose-600 font-bold hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-5 py-2.5 rounded-full transition-colors text-sm">Explore experts</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROFESSIONALS.map((pro) => (
            <div key={pro.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-rose-100/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-6 flex gap-5 items-start">
                <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-rose-50 shadow-md">
                  <Image 
                    src={pro.image} 
                    alt={pro.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-xl text-slate-900">{pro.name}</h3>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold shadow-sm">Verified</div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-2">{pro.role}</p>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <Star className="text-amber-400 fill-amber-400" size={18} />
                    <span>{pro.rating}</span>
                    <span className="text-slate-400 font-normal">({pro.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 flex flex-wrap gap-2">
                {pro.tags.map(tag => (
                  <span key={tag} className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center text-sm font-medium text-slate-600 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-100 p-1.5 rounded-full text-rose-600"><MapPin size={16} /></div> {pro.distance}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-full text-blue-600"><Clock size={16} /></div> {pro.time}
                  </div>
                </div>
                <Link href={`/pro/${pro.id}`} className="block w-full py-3.5 bg-slate-900 text-white font-bold text-center rounded-2xl hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95">
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
