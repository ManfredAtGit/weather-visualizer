import React, { useState } from 'react';
import DayCard from './DayCard';

export default function PlotTab({ 
  typeSelection, setTypeSelection, 
  dateSelection, setDateSelection, 
  dateRange, uniqueCreationDates, displayDates = [], filteredRows = [] // Default-Werte verhindern Crash
}) {

  // --- NEU: State für die Skalierung (0.3 bis 1.0) ---
  const [scale, setScale] = useState(0.7);

  // --- WICHTIG: Globale Skalierung berechnen ---
  const allTemps = filteredRows.flatMap(r => [r.temp_min, r.temp_max]).filter(t => t !== null && t !== undefined);
  
  const globalTempMin = allTemps.length > 0 ? Math.min(...allTemps) : 0;
  const globalTempMax = allTemps.length > 0 ? Math.max(...allTemps) : 30;
  const tRange = Math.max(globalTempMax - globalTempMin, 5);

  // Der Bereich, den jede Karte als Y-Achse nutzt
  const yAxisMin = globalTempMin - (tRange * 0.5);
  const yAxisMax = globalTempMax + (tRange * 4.5);
  const yRange = [yAxisMin, yAxisMax];

  // Basiswerte der DayCard für die Layout-Korrektur
  const originalWidth = 320; // Entspricht w-80 (80 * 4px)
  const originalHeight = 1000;

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-250px)]">
      {/* Sidebar mit Filtern und dem neuen Zoom-Slider */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-white p-5 rounded-xl border border-slate-200 shadow-sm self-start">
        <div className="space-y-6">

          {/* Type Selection */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
              Type Selection
            </label>
            <select 
              value={typeSelection} 
              onChange={(e) => setTypeSelection(e.target.value)}
              /* text-slate-900 sorgt dafür, dass der Text nicht weiß auf weiß ist */
              className="w-full p-2 bg-white border border-slate-300 rounded text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="backward">Backward (Target Date)</option>
              <option value="forward">Forward (Model Run)</option>
            </select>
          </div>


          {/* Date Selection */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
              Date Selection
            </label>
            <input 
              type="date" 
              value={dateSelection} 
              min={dateRange?.min} 
              max={dateRange?.max} 
              onChange={(e) => setDateSelection(e.target.value)}
              /* "scheme-light" erzwingt das Standard-Icon in Edge/Chrome */
              className="w-full p-2 bg-white border border-slate-300 rounded text-sm font-bold text-slate-900 color-scheme-light focus:ring-2 focus:ring-blue-500 focus:outline-none"
              style={{ colorScheme: 'light' }} 
            />
          </div>

          {/* Der neue Skalierungs-Slider */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
              Karten-Zoom: {Math.round(scale * 100)}%
            </label>
            <input 
              type="range" 
              min="0.3" 
              max="1.0" 
              step="0.05" 
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>30%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Hauptbereich für die Karten */}
      
      <div className="flex-grow overflow-auto p-4 bg-slate-100 rounded-xl">
        <div className="flex flex-row flex-nowrap gap-4 items-start min-h-max w-max">
          {displayDates.map(dateKey => {
            // HIER die wichtige Unterscheidung beim Filtern der Karten-Daten
            const cardData = filteredRows.filter(r => 
              typeSelection === 'backward' ? r.creation_date === dateKey : r.prog_date === dateKey
            );

            // Dynamisches Label bestimmen
            const dateLabel = typeSelection === 'backward' ? 'Model-Run' : 'Forecast for';

            // Falls für dieses Datum keine Daten da sind, Karte überspringen
            if (cardData.length === 0) return null;

            return (
              <div 
                key={dateKey} 
                style={{ 
                  transform: `scale(${scale})`, 
                  transformOrigin: 'top left',
                  width: `${originalWidth * scale}px`, 
                  height: `${originalHeight * scale}px`,
                  flexShrink: 0
                }}
              >
                <DayCard 
                  cDate={dateKey} 
                  dateLabel={dateLabel} // <-- NEU: Das Label wird mitgegeben
                  data={cardData} 
                  yRange={yRange} 
                  tRange={tRange} 
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}