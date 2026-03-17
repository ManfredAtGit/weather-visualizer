export default function InfoTab({ loadingState, stats, maeStatsLoadingState, maeStats }) {
  if (loadingState === 'loading') return <div className="p-8 text-center">... loading weather-data ...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Creation Date Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Creation Date Range
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-sm text-slate-500">Von:</span>
              <span className="text-sm font-bold text-slate-900">{stats.creation_date_min || '---'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Bis:</span>
              <span className="text-sm font-bold text-slate-900">{stats.creation_date_max || '---'}</span>
            </div>
          </div>
        </div>

        {/* Prog Date Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Prognosis Date Range
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-sm text-slate-500">Von:</span>
              <span className="text-sm font-bold text-slate-900">{stats.prog_date_min || '---'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Bis:</span>
              <span className="text-sm font-bold text-slate-900">{stats.prog_date_max || '---'}</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Status-Anzeige */}
      <div className="text-center py-4 space-y-2">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
          (loadingState === 'success' && maeStatsLoadingState === 'success') ? 'bg-green-100 text-green-700' :
          (loadingState === 'error' || maeStatsLoadingState === 'error') ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          Loading Status: Weather {loadingState}, MAE {maeStatsLoadingState}
        </span>
        {maeStatsLoadingState === 'success' && (
          <div className="text-xs text-slate-500">
            MAE Stats: {maeStats.length} rows loaded successfully
          </div>
        )}
      </div>
    </div>
  );
}