import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';

function HomePage() {
  return (
    <>
      <Header />
      <section id="home">
        <Hero />
      </section>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router basename={import.meta.env.VITE_BASE_PATH || '/' }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<><Header /><About /><Footer /></>} />
          <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;