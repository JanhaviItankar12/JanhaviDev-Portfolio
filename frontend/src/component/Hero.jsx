import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiDownload } from 'react-icons/fi';
import { SiGeeksforgeeks } from 'react-icons/si';


const Hero = () => {
  const handleDownloadResume = () => {
    // Replace with your actual resume URL
    const resumeUrl = 'https://drive.google.com/file/d/1Y4S6rxWBFbVss3yEPRQWVUQmrUMkwke9/view?usp=sharing';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'John_Doe_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const socialLinks = [
    {
      Icon: FiGithub,
      link: "https://github.com/JanhaviItankar12",
      label: "GitHub",
      color: "#333"
    },
    {
      Icon: FiLinkedin,
      link: "https://www.linkedin.com/in/itankarjanhavi12/",
      label: "LinkedIn",
      color: "#0077b5"
    },
    {
      Icon: SiGeeksforgeeks,
      link: "https://www.geeksforgeeks.org/profile/janhavi12",
      label: "GeeksforGeeks",
      color: "#2f8d46"
    },
    {
      Icon: FiMail,
      link: "mailto:itankarjanvi@gmail.com",
      label: "Email",
      color: "#ea4335"
    }
  ];




  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden ">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: 'linear-gradient(90deg, var(--color-accent-primary) 0%, transparent 50%, var(--color-accent-secondary) 100%)',
          opacity: 0.2
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              backgroundColor: 'var(--color-accent-primary)',
              opacity: 0.2
            }}
          />
        ))}
      </div>

      <div className="container mx-aut mt-20 o px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
              Hi, I'm Janhavi Itankar
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl text-gray-300 mb-8">
            Full Stack Developer
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            I'm a Computer Science student and Full Stack Developer specializing in the MERN stack.
            I build scalable and user-friendly web applications using React, Node.js, and modern web technologies.
          </p>
          <div className="flex justify-center space-x-6 mb-12">
            {socialLinks.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-3xl text-gray-400 hover:text-[var(--color-accent-primary)] transition-colors"
              >
                <item.Icon />
              </motion.a>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              View My Work
            </motion.a>

            <motion.button
              onClick={handleDownloadResume}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 cursor-pointer bg-transparent border-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              style={{
                borderColor: 'var(--color-accent-primary)',
                color: 'var(--color-accent-primary)'
              }}
            >
              <FiDownload />
              Download Resume
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;