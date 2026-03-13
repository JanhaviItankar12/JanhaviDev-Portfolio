import React from 'react'
import Navbar from './NavBar'
import Hero from './Hero'
import Skills from './Skills'
import Projects from './Projects'
import Experience from './Experience'
import Contact from './Contact'
import Footer from './Footer'

const MainLayout = () => {
  return (
    <div> <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer /></div>
  )
}

export default MainLayout