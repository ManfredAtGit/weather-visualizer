# Weather Forecast Monitor

## 1. Main Purpose of the App

The Weather Forecast Monitor is a web application designed to visualize and analyze weather forecast data. It loads weather data from CSV files and provides interactive charts and statistics to help users understand weather patterns, forecast accuracy, and historical trends. The app supports different viewing modes (backward and forward analysis) and allows users to explore data across various dates and time ranges.

## 2. Description of Main Pages (Content)

### Info Tab
- Displays the loading status of weather data
- Shows the date ranges for creation dates (when forecasts were made) and prognosis dates (forecasted dates)
- Provides an overview of the data coverage in the loaded CSV file

### Plot Tab
- Interactive visualization of weather data using Plotly.js charts
- Features a sidebar with controls for:
  - Type selection: Choose between "backward" (analyzing past forecasts) and "forward" (forecast progression) modes
  - Date selection: Pick specific dates to focus the analysis
  - Scale adjustment: Zoom in/out on the temperature charts
- Displays individual day cards showing temperature ranges, weather conditions, and forecast details for selected dates
- Each day card contains detailed weather plots with temperature minima/maxima and other meteorological data

### Help Tab
- Currently under development
- Will contain user guides, FAQs, and additional documentation

## 3. How to Interact

- **Navigation**: Use the tab buttons at the top to switch between Info, Plot, and Help views
- **Data Exploration**: In the Plot tab, select your preferred analysis type (backward/forward) from the dropdown
- **Date Filtering**: Choose specific dates from the date selection dropdown to focus on particular time periods
- **Visualization Control**: Adjust the scale slider to zoom in or out on temperature charts for better detail
- **Responsive Design**: The app adapts to different screen sizes, with the sidebar becoming a top bar on mobile devices

## 4. Software Architecture and Software Stack

### Architecture
The application follows a component-based architecture using React:
- **App.jsx**: Main application component managing state and data loading
- **Components**: Modular UI components (InfoTab, PlotTab, DayCard) for different sections
- **Data Flow**: CSV data is parsed on load, filtered based on user selections, and passed to visualization components
- **State Management**: React hooks (useState, useEffect) handle component state and data updates

### Software Stack
- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Charting Library**: Plotly.js 3.3.1 with React-Plotly.js 2.6.0
- **CSV Parsing**: PapaParse 5.5.3
- **Styling**: Tailwind CSS (via classes in JSX)
- **Linting**: ESLint with React-specific rules
- **Deployment**: GitHub Pages with gh-pages package

## 5. How to Run the App

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open your browser to `http://localhost:5173`

### Build for Production
1. Build the app: `npm run build`
2. Preview the build: `npm run preview`

### Deploy to GitHub Pages
1. Ensure the repository is set up on GitHub
2. Deploy automatically: `npm run deploy`
   - This runs `npm run build` and then deploys to GitHub Pages

**Live Demo**: [https://ManfredAtGit.github.io/weather-visualizer](https://ManfredAtGit.github.io/weather-visualizer)

## 6. Misc

- **Data Source**: The app loads weather data from `weather_data.csv` and `weather_data_alt.csv` files in the public directory
- **Icons**: Weather icons are stored in the `public/online-icons/` directory
- **Responsive**: Optimized for desktop and mobile viewing
- **Performance**: Uses React.memo and optimized rendering for smooth interactions
- **Browser Support**: Modern browsers with ES6+ support
- **License**: Private project (see package.json)
