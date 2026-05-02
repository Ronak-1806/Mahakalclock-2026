import MahakalClock from './MahakalClock'
import HumanBody from './HumanBody'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/mahakalclock" replace />} />
        <Route path="/mahakalclock" element={<MahakalClock />} />
        <Route path="/HumanBody" element={<HumanBody />} />
      </Routes>
    </BrowserRouter>
  )
}
