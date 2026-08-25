function LoadingSpinner({ size = 5 }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-${size} h-${size} border-2 border-yellow-400 border-t-transparent rounded-full animate-spin`}
        style={{ width: `${size}rem`, height: `${size}rem` }}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
