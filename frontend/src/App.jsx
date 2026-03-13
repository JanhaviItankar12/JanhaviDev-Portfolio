import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Navbar from './component/NavBar'
import Hero from './component/Hero'
import Skills from './component/Skills'
import Projects from './component/Projects'
import Experience from './component/Experience'
import Contact from './component/Contact'
import Footer from './component/Footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark-100)' }}>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
    </>
  )
}

export default App
