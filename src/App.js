import './App.css';
import { useState  } from 'react';
import BarChart from './components/BarChart';
import ChoroplethMapChart from './components/ChoroplethMapChart';
import HeatMapChart from './components/HeatMapChart';

function App() {

  const [activeTab, setActiveTab] = useState('bar');

  return (
    <div className="App">
      <div className='tabs'>
        <button onClick={() => setActiveTab('bar')}>Bar Chart</button>
        <button onClick={() => setActiveTab('choropleth')}>Choropleth Map Chart</button>
        <button onClick={() => setActiveTab('heat')}>Heat Map Chart</button>
      </div>
      {activeTab === 'bar' && <BarChart />}
      {activeTab === 'choropleth' && <ChoroplethMapChart />}
      {activeTab === 'heat' && <HeatMapChart />}
    </div>
  );
}

export default App;
