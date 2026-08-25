function InputField({ label, name, type = "text", placeholder, icon, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border ${
            error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
          } focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all duration-200`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default InputField;
