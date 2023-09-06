import './App.css';
import { useState  } from 'react';
import BarChart from './components/BarChart';
import MapChart from './components/MapChart';

function App() {

  const [activeTab, setActiveTab] = useState('bar');

  return (
    <div className="App">
      <div className='tabs'>
        <button onClick={() => setActiveTab('bar')}>Bar Chart</button>
        <button onClick={() => setActiveTab('map')}>Map Chart</button>
      </div>
      {activeTab === 'bar' && <BarChart />}
      {activeTab === 'map' && <MapChart />}
    </div>
  );
}

export default App;
