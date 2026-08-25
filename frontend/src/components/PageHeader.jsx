import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

// Consistent page header with breadcrumb
function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <div className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <FaChevronRight className="text-xs text-gray-600" />}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-yellow-400 transition">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-yellow-400">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageHeader;
