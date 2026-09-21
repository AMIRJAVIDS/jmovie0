const AdminStatCard = ({ title, value, icon, color = "red" }) => {
  const colorClasses = {
    red: "bg-red-600/10 text-red-500 border-red-600/20",
    blue: "bg-blue-600/10 text-blue-500 border-blue-600/20",
    green: "bg-green-600/10 text-green-500 border-green-600/20",
    purple: "bg-purple-600/10 text-purple-500 border-purple-600/20",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        </div>

        <div
          className={[
            "w-12 h-12 rounded-xl flex items-center justify-center text-xl border",
            colorClasses[color],
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
