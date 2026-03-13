import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiCalendar } from 'react-icons/fi';

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const experiences = [
    {
      title: 'Mobile UI Developer Intern',
      company: 'InnovateMore (Remote)',
      period: 'Feb 2025 – Nov 2025',
      description: 'Built 10+ Android UI screens using Jetpack Compose and Kotlin.Converted 15+ Figma designs into responsive mobile interfaces.Implemented reusable UI components to improve development speed.Improved UI consistency and reduced UI rework by ~20%',
    },
   
  ];

  return (
    <section id="experience" className="py-20 bg-dark-100">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Work Experience
            </span>
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-dark-300" />

            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row mb-12 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-primary rounded-full animate-glow" />

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'
                }`}>
                  <div className="bg-dark-200 p-6 rounded-lg shadow-xl">
                    <div className="flex items-center mb-2">
                      <FiBriefcase className="text-accent-primary mr-2" />
                      <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                    </div>
                    <h4 className="text-accent-secondary mb-2">{exp.company}</h4>
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <FiCalendar className="mr-1" />
                      <span>{exp.period}</span>
                    </div>
                    <p className="text-gray-400">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;