const SectionTitle = ({ children }) => (
  <h2 className="flex items-center gap-3 mb-6 text-xl font-black text-white">
    <span className="block h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
    {children}
  </h2>
);

export default SectionTitle;
