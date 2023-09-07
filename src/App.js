import './App.css';
import { useState } from 'react';
import BarChart from './components/BarChart';
import ChoroplethMapChart from './components/ChoroplethMapChart';
import HeatMapChart from './components/HeatMapChart';

function App() {

  const [activeTab, setActiveTab] = useState('bar');

  return (
    <div className="App">
      <nav className='nav'>
        <div className='logo'>ChartFolio</div>
        <div className='sidebar'>
          <button onClick={() => setActiveTab('bar')}>Bar Chart</button>
          <button onClick={() => setActiveTab('choropleth')}>Choropleth Map Chart</button>
          <button onClick={() => setActiveTab('heat')}>Heat Map Chart</button>
        </div>
        <p>Dataset source: freeCodeCamp</p>
      </nav>
      <div className='chart'>
        {activeTab === 'bar' && <BarChart />}
        {activeTab === 'choropleth' && <ChoroplethMapChart />}
        {activeTab === 'heat' && <HeatMapChart />}
      </div>
    </div>
  );
}

export default App;
