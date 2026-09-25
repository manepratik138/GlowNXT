import { Users, Activity, Briefcase, IndianRupee, ShieldCheck } from "lucide-react";

export default function AdminView() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Admin Overview</h1>
        <p className="text-stone-500 mt-1">Platform statistics and management for GlowNXT.</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "₹2.4M", icon: <IndianRupee size={24} className="text-green-500" /> },
          { label: "Active Professionals", value: "342", icon: <Briefcase size={24} className="text-blue-500" /> },
          { label: "Total Customers", value: "12.5k", icon: <Users size={24} className="text-purple-500" /> },
          { label: "Bookings Today", value: "128", icon: <Activity size={24} className="text-rose-500" /> },
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

      {/* Verification Queue */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-stone-900">Pending Verifications</h2>
          <button className="text-rose-600 font-medium hover:text-rose-700 text-sm">View all queue</button>
        </div>
        
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
              <tr>
                <th className="px-6 py-4">Professional Name</th>
                <th className="px-6 py-4">Specialty</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="px-6 py-4 font-medium text-stone-900">Sneha Patel</td>
                <td className="px-6 py-4">Bridal Makeup</td>
                <td className="px-6 py-4">24 Oct, 2026</td>
                <td className="px-6 py-4">
                  <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium">3 uploaded</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium flex items-center gap-1 ml-auto">
                    <ShieldCheck size={14} /> Review
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-stone-900">Mohan Salon Services</td>
                <td className="px-6 py-4">Hair Stylist</td>
                <td className="px-6 py-4">23 Oct, 2026</td>
                <td className="px-6 py-4">
                  <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium">4 uploaded</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium flex items-center gap-1 ml-auto">
                    <ShieldCheck size={14} /> Review
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
