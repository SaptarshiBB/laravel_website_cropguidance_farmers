import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FarmerDashboard from './pages/FarmerDashboard'
import WeatherPage from './pages/WeatherPage'
import CropRecommendationPage from './pages/CropRecommendationPage'
import PestAlertPage from './pages/PestAlertPage'
import SchemesPage from './pages/SchemesPage'
import ChatbotPage from './pages/ChatbotPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCrops from './pages/admin/AdminCrops'
import AdminAlerts from './pages/admin/AdminAlerts'
import AdminSchemes from './pages/admin/AdminSchemes'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'

function Page({ children }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .25 }}>{children}</motion.div>
}

export default function App() {
  const location = useLocation()
  return <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
    <Route path="/" element={<Page><LandingPage /></Page>} />
    <Route path="/login" element={<Page><LoginPage /></Page>} />
    <Route path="/register" element={<Page><RegisterPage /></Page>} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Page><FarmerDashboard /></Page>} />
      <Route path="/weather" element={<Page><WeatherPage /></Page>} />
      <Route path="/crops" element={<Page><CropRecommendationPage /></Page>} />
      <Route path="/pest-alerts" element={<Page><PestAlertPage /></Page>} />
      <Route path="/schemes" element={<Page><SchemesPage /></Page>} />
      <Route path="/chatbot" element={<Page><ChatbotPage /></Page>} />
      <Route path="/profile" element={<Page><ProfilePage /></Page>} />
    </Route>
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<Page><AdminDashboard /></Page>} />
      <Route path="/admin/users" element={<Page><AdminUsers /></Page>} />
      <Route path="/admin/crops" element={<Page><AdminCrops /></Page>} />
      <Route path="/admin/alerts" element={<Page><AdminAlerts /></Page>} />
      <Route path="/admin/schemes" element={<Page><AdminSchemes /></Page>} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AnimatePresence>
}
