import React, { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'

const LandingPage = React.lazy(() => import('./pages/LandingPage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const FarmerDashboard = React.lazy(() => import('./pages/FarmerDashboard'))
const WeatherPage = React.lazy(() => import('./pages/WeatherPage'))
const CropRecommendationPage = React.lazy(() => import('./pages/CropRecommendationPage'))
const PestAlertPage = React.lazy(() => import('./pages/PestAlertPage'))
const SchemesPage = React.lazy(() => import('./pages/SchemesPage'))
const ChatbotPage = React.lazy(() => import('./pages/ChatbotPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'))
const AdminCrops = React.lazy(() => import('./pages/admin/AdminCrops'))
const AdminAlerts = React.lazy(() => import('./pages/admin/AdminAlerts'))
const AdminSchemes = React.lazy(() => import('./pages/admin/AdminSchemes'))

function Page({ children }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .25 }}>{children}</motion.div>
}

function PageFallback() {
  return <div className="flex h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"></div></div>
}

export default function App() {
  const location = useLocation()
  return <Suspense fallback={<PageFallback />}><AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
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
  </Routes></AnimatePresence></Suspense>
}
