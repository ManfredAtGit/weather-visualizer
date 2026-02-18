import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import InfoTab from './components/InfoTab';
import PlotTab from './components/PlotTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('info');
  const [loadingState, setLoadingState] = useState('idle');
  const [weatherData, setWeatherData] = useState([]);
  const [stats, setStats] = useState({ creation_date_min: '', creation_date_max: '', prog_date_min: '', prog_date_max: '' });
  const [typeSelection, setTypeSelection] = useState('backward');
  const [dateSelection, setDateSelection] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoadingState('loading');
      try {
        const response = await fetch('./weather_data.csv');
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true, dynamicTyping: true, skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            const cDates = data.map(d => d.creation_date).filter(Boolean).sort();
            const pDates = data.map(d => d.prog_date).filter(Boolean).sort();
            const newStats = {
              creation_date_min: cDates[0] || '', creation_date_max: cDates[cDates.length-1] || '',
              prog_date_min: pDates[0] || '', prog_date_max: pDates[pDates.length-1] || ''
            };
            setStats(newStats);
            setWeatherData(data);
            setLoadingState('success');
            setDateSelection(newStats.prog_date_max);
          }
        });
      } catch (e) { setLoadingState('error'); }
    };
    loadData();
  }, []);

  // Dieser Effekt korrigiert die Auswahl, wenn der Modus gewechselt wird
  useEffect(() => {
    if (stats.creation_date_max && stats.prog_date_max) {
      if (typeSelection === 'backward') {
        setDateSelection(stats.prog_date_max);
      } else {
        setDateSelection(stats.creation_date_max);
      }
    }
  }, [typeSelection, stats]);


  // Dieser Teil berechnet die Skala NUR basierend auf den aktuell angezeigten Daten
  const filteredRows = weatherData.filter(row => 
    typeSelection === 'backward' ? row.prog_date === dateSelection : row.creation_date === dateSelection
  );

  const uniqueCreationDates = [...new Set(filteredRows.map(r => r.creation_date))].sort((a, b) => b.localeCompare(a));

  /*
  // 2. Erzeuge die Liste der Daten für die Karten-Köpfe
  // Wir nennen sie 'displayDates', da sie je nach Modus 
  // entweder creation_dates oder prog_dates enthält.
  const displayDates = typeSelection === 'backward'
    ? [...new Set(filteredRows.map(r => r.creation_date))].sort().reverse() // Neueste Läufe zuerst
    : [...new Set(filteredRows.map(r => r.prog_date))].sort();              // Chronologische Vorhersage
  */

  // 2. ROBUSTE Berechnung von displayDates
  const displayDates = React.useMemo(() => {
    if (!filteredRows || filteredRows.length === 0) return [];

    if (typeSelection === 'backward') {
      return [...new Set(filteredRows.map(r => r.creation_date))]
        .filter(Boolean) // Entfernt null, undefined, leere Strings
        .sort((a, b) => String(b).localeCompare(String(a))); // Absteigend (neueste zuerst)
    } else {
      return [...new Set(filteredRows.map(r => r.prog_date))]
        .filter(Boolean) // Entfernt null, undefined, leere Strings
        .sort((a, b) => String(a).localeCompare(String(b))); // Aufsteigend
    }
  }, [filteredRows, typeSelection]);
  
  
  const getDateRange = () => typeSelection === 'backward' 
    ? { min: stats.prog_date_min, max: stats.prog_date_max } 
    : { min: stats.creation_date_min, max: stats.creation_date_max };

  console.log('just testing');
  console.log("Anzahl Karten:", displayDates.length);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/*}
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold">Weather Forecast Monitor</h1>
      </header>
      */}



      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          {/* Der Titel */}
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Weather Forecast Monitor
          </h1>


          {/* Container für mehrere animierte SVGs */}
          <div className="flex items-center gap-3">
            <img 
              src="./online-icons/thunderstorms-day-rain-line.svg" 
              alt="Animation 1" 
              className="w-12 h-12 object-contain hover:scale-110 transition-transform"
              /* Falls die Animation per CSS gesteuert werden muss, 
                kannst du hier noch Klassen hinzufügen */
            />
            <img 
              src="./online-icons/wetter-verlauf.svg" 
              alt="Animation 2" 
              className="w-12 h-12 object-contain hover:scale-110 transition-transform"
            />
            <img 
              src="./online-icons/windsock-line.svg" 
              alt="Animation 3" 
              className="w-12 h-12 object-contain hover:scale-110 transition-transform"
            />
          </div>


        </div>

        {/* Optional: Hier könnten noch User-Infos oder ein Settings-Icon stehen */}
      </header>

      
      <nav className="bg-white border-b flex justify-center">
        {['info', 'plot', 'help'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-4 text-sm font-bold uppercase ${activeTab === t ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400'}`}>{t}</button>
        ))}
      </nav>

      <main className="flex-grow container mx-auto p-6 max-w-7xl">
        {activeTab === 'info' && <InfoTab loadingState={loadingState} stats={stats} />}
        {activeTab === 'plot' && (
          <PlotTab 
            typeSelection={typeSelection} setTypeSelection={setTypeSelection}
            dateSelection={dateSelection} setDateSelection={setDateSelection}
            /* dateRange={getDateRange()} uniqueCreationDates={uniqueCreationDates} */
            dateRange={getDateRange()} displayDates={displayDates}
            filteredRows={filteredRows}
          />
        )}
      </main>
    </div>
  );
}