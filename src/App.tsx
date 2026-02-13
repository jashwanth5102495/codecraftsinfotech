import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import ProjectsPage from './components/ProjectsPage'
import ProjectEnrollment from './components/ProjectEnrollment'
import CheckoutPage from './components/CheckoutPage'
import PaymentPage from '@/components/PaymentPage'
import InternshipPage from '@/components/InternshipPage'
import AdminPage from '@/components/AdminPage'

function HomePage() {
  return (
    <>
      <Header />
      <section id="home">
        <Hero />
      </section>
      <Footer />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router basename={import.meta.env.VITE_BASE_PATH || '/' }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<><Header /><About /><Footer /></>} />
            <Route path="/internship" element={<><Header /><InternshipPage /><Footer /></>} />
            <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
            <Route path="/projects" element={<><Header /><ProjectsPage /><Footer /></>} />
            <Route path="/projects/enroll" element={<><Header /><ProjectEnrollment /><Footer /></>} />
            <Route path="/checkout" element={<><Header /><CheckoutPage /><Footer /></>} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/admin" element={<><Header /><AdminPage /><Footer /></>} />
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App