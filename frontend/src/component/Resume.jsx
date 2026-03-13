import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiAward, FiBook, FiBriefcase } from 'react-icons/fi';

const Resume = () => {
  const handleDownload = () => {
    // Replace with your actual resume PDF URL
    const resumeUrl = '/path-to-your-resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'John_Doe_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qualifications = [
    {
      icon: <FiBriefcase className="text-2xl" />,
      title: 'Experience',
      items: ['5+ Years in Web Development', '20+ Projects Completed', '3 Tech Companies']
    },
    {
      icon: <FiBook className="text-2xl" />,
      title: 'Education',
      items: ['B.Tech Computer Science', 'Full Stack Certification', 'AWS Certified']
    },
    {
      icon: <FiAward className="text-2xl" />,
      title: 'Achievements',
      items: ['Hackathon Winner 2023', 'Open Source Contributor', 'Tech Speaker']
    }
  ];

  return (
    <section id="resume" className="py-20" style={{ backgroundColor: 'var(--color-dark-100)' }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
              Resume
            </span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Download my resume to learn more about my experience, skills, and achievements
          </p>

          {/* Qualifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {qualifications.map((qual, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: 'var(--color-dark-200)' }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'var(--color-dark-300)',
                    color: 'var(--color-accent-primary)'
                  }}
                >
                  {qual.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{qual.title}</h3>
                <ul className="space-y-2">
                  {qual.items.map((item, i) => (
                    <li key={i} className="text-gray-400">{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Download Button and Stats */}
          <div className="flex flex-col items-center">
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">20+</div>
                <div className="text-sm text-gray-400">Projects Done</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10+</div>
                <div className="text-sm text-gray-400">Technologies</div>
              </div>
            </div>

            {/* Download Button */}
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-lg font-semibold text-white overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))'
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <FiFileText className="text-xl" />
                Download Resume (PDF)
                <FiDownload className="text-xl group-hover:translate-y-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-accent-secondary), var(--color-accent-primary))'
                }}
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <p className="text-sm text-gray-500 mt-4">
              Includes: Experience, Education, Skills, Projects & Certifications
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;