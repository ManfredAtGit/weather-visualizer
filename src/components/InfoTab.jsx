export default function InfoTab({ loadingState, stats }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn text-center">
      <div className="mb-8">
        {loadingState === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium text-blue-600">... loading weather-data ...</p>
          </div>
        )}
        {loadingState === 'success' && (
          <p className="text-lg font-medium text-green-600">✔ weather-data loaded</p>
        )}
      </div>

      {loadingState === 'success' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          <div className="p-4 bg-slate-50 rounded-lg border">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Creation Date Range</h3>
            <p className="text-sm">Min: {stats.creation_date_min} | Max: {stats.creation_date_max}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Prog Date Range</h3>
            <p className="text-sm">Min: {stats.prog_date_min} | Max: {stats.prog_date_max}</p>
          </div>
        </div>
      )}
    </div>
  );
}