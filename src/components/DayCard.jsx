import React from 'react';
import Plot from 'react-plotly.js';

const getBeaufort = (ms) => {
  if (ms < 0.3) return 0; if (ms < 1.6) return 1; if (ms < 3.4) return 2;
  if (ms < 5.5) return 3; if (ms < 8.0) return 4; if (ms < 10.8) return 5;
  if (ms < 13.9) return 6; if (ms < 17.2) return 7; if (ms < 20.8) return 8;
  if (ms < 24.5) return 9; if (ms < 28.5) return 10; if (ms < 32.7) return 11;
  return 12;
};

export default function DayCard({ cDate, dateLabel, data, yRange, tRange }) {
if (!data || data.length === 0 || !yRange) return null;
  const row = data[0];

  const avgBft = getBeaufort(row.wind_avg);
  const maxBft = getBeaufort(row.wind_max);
  const dirDeg = row.wind_dir_avg;

  const yMin = yRange[0];
  const H = yRange[1] - yRange[0]; 
  const y_wind_center = yMin + H * 0.45;

  // Zone 4: Wettericon (belegt jetzt 30% der Höhe)
  // Wir setzen das Zentrum auf 85% der Gesamthöhe, 
  // damit das Icon nach oben und unten 15% Platz hat (insgesamt 30%).
  const y_icon_center = yMin + H * 0.85;

  // Radien-Berechnung für Kreisform bei 300x1000px
  const r_x = 0.35; 
  const r_y = r_x * (H / 1.2) * (300 / 1000); 

  const getPos = (angle, radFactX, radFactY) => {
    const rad = ((90 - angle) * Math.PI) / 180;
    return {
      x: 1 + Math.cos(rad) * r_x * radFactX,
      y: y_wind_center + Math.sin(rad) * r_y * radFactY
    };
  };

  // 12 Sektoren-Markierungen (alle 30 Grad)
  const sectorLines = [];
  for (let i = 0; i < 360; i += 30) {
    const pStart = getPos(i, 0.6, 0.6);
    const pEnd = getPos(i, 1.0, 1.0);
    sectorLines.push({
      type: 'line',
      x0: pStart.x, y0: pStart.y,
      x1: pEnd.x, y1: pEnd.y,
      line: { color: 'lightgrey', width: 1 }
    });
  }

  // Windpfeil-Koordinaten
  // Windpfeil-Koordinaten berechnen
  const p1 = getPos(dirDeg, 0.6, 0.6);      // Spitze (am inneren Ring)
  const p2 = getPos(dirDeg - 25, 1.1, 1.1); // Basis links (leicht über äußeren Ring hinaus)
  const p3 = getPos(dirDeg + 25, 1.1, 1.1); // Basis rechts

  // Bestimmung des Füllmodus basierend auf Beaufort
  let fillType = 'none';
  let fillPattern = {}; // Für die "halbgefüllte" Optik
  let lineWeight = 1.5;

  if (avgBft > 2 && avgBft <= 5) {
    fillType = 'toself';
    // Wir nutzen ein Streifenmuster, um "halb gefüllt" zu simulieren
    fillPattern = { shape: "/", solidity: 0.5 }; 
    lineWeight = 1.5;
  } else if (avgBft > 5) {
    fillType = 'toself';
    fillPattern = { shape: "" }; // Vollflächig
    lineWeight = 2.5;
  }

  // 1. Hole den Prozentwert (Sicherstellung, dass er zwischen 0 und 100 liegt)
  const sunPct = Math.min(Math.max(row.sunshine_percent_total || 0, 0), 100);

  // 2. Berechne den Blau-Wert: 
  // 0% Sonne -> 255 Blau (ergibt Weiß: 255,255,255)
  // 100% Sonne -> 0 Blau (ergibt Gelb: 255,255,0)
  const blueValue = Math.floor(255 * (1 - sunPct / 100));
  const sunColor = `rgb(255, 255, ${blueValue})`;


  const traces = [
    { // 1. Temperatur
      x: [0.85, 1.15], 
      y: [row.temp_max, row.temp_min],
      mode: 'markers+text',
      text: [`${Math.round(row.temp_max)}°`, `${Math.round(row.temp_min)}°`],
      textposition: ['top center', 'bottom center'],
      textfont: { size: 14, weight: 'bold', color: ['red', 'blue'] },
      marker: { color: ['red', 'blue'], size: 10 }, 
      type: 'scatter'
    },

    {
    // 2. Windpfeil
      x: [p1.x, p2.x, p3.x, p1.x], 
      y: [p1.y, p2.y, p3.y, p1.y],
      fill: fillType, 
      fillcolor: 'black',
      fillpattern: fillPattern, // Wendet das Muster an
      line: { 
        color: 'black', 
        width: lineWeight 
      }, 
      type: 'scatter', 
      mode: 'lines', 
      hoverinfo: 'none'
    },

    { // 3. Sonnenbalken
      x: [1], 
      y: [H * 0.06], 
      base: yMin + H * 0.62, 
      width: 0.6, 
      type: 'bar',
      marker: { 
        color: sunColor, // Die dynamische Farbe
        line: { color: 'black', width: 1 } 
      },
      text: [`${(row.sunshine_total_h || 0).toFixed(1)} h`],
      textposition: 'inside', 
      font: { size: 11, color: 'black' }
    }

  ];

  return (
    <div className="flex-shrink-0 bg-white rounded-xl border shadow-lg flex flex-col w-72 md:w-80 h-[1000px]">
      {/* ... Header ... */}

      <div className="p-3 border-b text-center bg-slate-50 font-bold text-slate-700">
        <div className="text-[10px] uppercase text-slate-400 font-black leading-none mb-1">
          {dateLabel} {/* <-- Hier wird jetzt dynamisch "Modell-Lauf" oder "Prognose für" angezeigt */}
        </div>
        <div className="text-sm tracking-wide">{cDate}</div>
      </div>

      {/*
      <div className="p-3 border-b text-center bg-slate-50 rounded-t-xl sticky top-0 z-10 font-bold text-slate-700">
        <div className="text-[10px] uppercase text-slate-400 font-black leading-none mb-1">Creation date</div>
        <div className="text-sm tracking-wide">{cDate}</div>
      </div>
      */}

      <div className="flex-grow">
        <Plot
          data={traces}
          layout={{
            width: 300,
            height: 1000,
            xaxis: { visible: false, range: [0.4, 1.6], fixedrange: true },
            yaxis: { visible: false, range: yRange, fixedrange: true },
            margin: { l: 0, r: 0, t: 40, b: 40 },
            showlegend: false,
            shapes: [
              // Äußerer und innerer Ring
              { type: 'circle', x0: 1-r_x, x1: 1+r_x, y0: y_wind_center-r_y, y1: y_wind_center+r_y, line: {color: 'lightgrey', width: 1} },
              { type: 'circle', x0: 1-r_x*0.6, x1: 1+r_x*0.6, y0: y_wind_center-r_y*0.6, y1: y_wind_center+r_y*0.6, line: {color: 'lightgrey', width: 1} },
              ...sectorLines // Die 12 Markierungen
            ],
            annotations: [
              { x: 1, y: y_wind_center, text: `<b>${avgBft}</b>`, showarrow: false, font: {size: 14} },
              // Alle 4 Himmelsrichtungen
              { x: 1, y: y_wind_center + r_y * 1.3, text: 'N', showarrow: false, font: {size: 11, color: 'grey'} },
              { x: 1 + r_x * 1.3, y: y_wind_center, text: 'O', showarrow: false, font: {size: 11, color: 'grey'} },
              { x: 1, y: y_wind_center - r_y * 1.3, text: 'S', showarrow: false, font: {size: 11, color: 'grey'} },
              { x: 1 - r_x * 1.3, y: y_wind_center, text: 'W', showarrow: false, font: {size: 11, color: 'grey'} },
              // Böen-Text tiefer setzen
              { x: 1, y: y_wind_center - r_y * 1.6, text: `in Böen: ${maxBft}`, showarrow: false, font: {size: 10, color: 'grey'} }
            ],

            images: [{
              source: `./online-icons/w_${row.weather_type}.svg`,
              xref: "x",
              yref: "y",
              x: 1,
              y: y_icon_center,
              // sizex: 0.8 sorgt dafür, dass es in der Breite nicht abgeschnitten wird
              sizex: 0.8, 
              // sizey: H * 0.3 entspricht exakt deinen gewünschten 30% der Kartenhöhe
              sizey: H * 0.3, 
              xanchor: "center",
              yanchor: "middle"
            }]

          }}
          config={{ staticPlot: true, responsive: false }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}