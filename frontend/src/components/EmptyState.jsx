// Empty state placeholder component
function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <Icon className="text-3xl text-gray-400" />
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
      )}
      {actionLabel && actionLink && (
        <a
          href={actionLink}
          className="inline-flex items-center gap-2 bg-black text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}

export default EmptyState;
