import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function normalizeSeries(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return values.map(() => 0);
  return values.map((v) => (v - min) / range);
}

export default function GraphStack({ maeStats = [] }) {
  const [currentPlotIndex, setCurrentPlotIndex] = useState(0);

  const plots = useMemo(() => {
    if (!maeStats || maeStats.length === 0) {
      // Fallback: Platzhalterplots
      return Array.from({ length: 8 }, (_, i) => ({
        x: Array.from({ length: 10 }, (_, j) => j + 1),
        y: Array.from({ length: 10 }, (_, j) => Math.sin(j * (i + 1) * 0.5) * 10),
        mode: 'lines',
        name: `Plot ${i + 1}`,
        line: { color: COLORS[i % COLORS.length] }
      }));
    }

    const diffCols = Object.keys(maeStats[0] || {}).filter((k) => k.endsWith('_diff'));
    const lags = maeStats.map((_, rowIndex) => rowIndex + 1);

    const plotsArray = [];

    // Plot 1: Normalisierter Zusammenfassungsplot mit allen Merkmalen
    const normalizedTraces = diffCols.map((col, i) => {
      const values = maeStats.map((row) => Math.abs(Number(row[col]) || 0));
      const normalizedValues = normalizeSeries(values);
      return {
        x: lags,
        y: normalizedValues,
        mode: 'lines+markers',
        name: col.replace('_diff', ''),
        line: { color: COLORS[i % COLORS.length], width: 3 },
        marker: { size: 6 }
      };
    });
    plotsArray.push({
      data: normalizedTraces,
      title: 'Normalisierter MAE-Verlauf (Forecast Decay) | Lag 1 bis N',
      xaxis: { title: 'Lag (Zeile)', dtick: 1 },
      yaxis: { title: 'Normalisierter Fehler (0 = Min, 1 = Max)' },
      showlegend: true,
      legend: { orientation: 'h', y: -0.3, x: 0.5, xanchor: 'center' },
      margin: { l: 40, r: 40, t: 40, b: 80 }
    });

    // Plots 2-8: Einzelne nicht-normalisierte Plots pro Merkmal
    diffCols.forEach((col, i) => {
      const values = maeStats.map((row) => Math.abs(Number(row[col]) || 0));
      plotsArray.push({
        data: [{
          x: lags,
          y: values,
          mode: 'lines+markers',
          name: col.replace('_diff', ''),
          line: { color: COLORS[i % COLORS.length], width: 3 },
          marker: { size: 6 }
        }],
        title: col.replace('_diff', ''),
        xaxis: { title: 'Lag (Zeile)', dtick: 1 },
        yaxis: { title: 'MAE-Wert' },
        showlegend: true,
        legend: { orientation: 'h', y: -0.3, x: 0.5, xanchor: 'center' },
        margin: { l: 40, r: 40, t: 60, b: 80 }
      });
    });

    return plotsArray;
  }, [maeStats]);

  const goToPreviousPlot = () => {
    setCurrentPlotIndex((prev) => (prev === 0 ? plots.length - 1 : prev - 1));
  };

  const goToNextPlot = () => {
    setCurrentPlotIndex((prev) => (prev === plots.length - 1 ? 0 : prev + 1));
  };

  // Keep index within bounds if plots array changes
  const currentIndex = Math.min(currentPlotIndex, Math.max(0, plots.length - 1));

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Plot Container */}
      <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
        <Plot
          data={plots[currentIndex]?.data || []}
          layout={{
            title: plots[currentIndex]?.title || 'Plot',
            xaxis: plots[currentIndex]?.xaxis || { title: 'X' },
            yaxis: plots[currentIndex]?.yaxis || { title: 'Y' },
            margin: plots[currentIndex]?.margin || { l: 40, r: 40, t: 60, b: 40 },
            autosize: true,
            showlegend: plots[currentIndex]?.showlegend || false,
            legend: plots[currentIndex]?.legend || {}
          }}
          config={{ responsive: true }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4 px-2">
        <button
          onClick={goToPreviousPlot}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          title="Vorheriger Plot"
        >
          ◀
        </button>

        <div className="flex-grow text-center">
          <span className="text-xs font-bold text-slate-600 uppercase">
            Plot {currentIndex + 1} von {plots.length}
          </span>
        </div>

        <button
          onClick={goToNextPlot}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          title="Nächster Plot"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
