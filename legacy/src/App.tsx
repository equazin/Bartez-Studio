import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './app/AppLayout'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { ServicesPage } from './pages/ServicesPage'
import { StudioPage } from './pages/StudioPage'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/servicios/:slug" element={<ServiceDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/nosotros" element={<StudioPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  )
}

export default App
