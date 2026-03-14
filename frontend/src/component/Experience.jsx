import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useGetWorkExperienceQuery } from '../api/publicApi';
import dayjs from 'dayjs';

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: experienceData, isLoading, isError } = useGetWorkExperienceQuery();
  const experiences = experienceData?.data || [];

  if (isLoading) return <p className="text-center text-gray-400 py-10">Loading experiences...</p>;
  if (isError) return <p className="text-center text-red-500 py-10">Failed to load experiences.</p>;

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

            {experiences.map((exp, index) => {
              const start = dayjs(exp.startDate).format('MMM YYYY');
              const end = exp.currentlyWorking
                ? 'Present'
                : exp.endDate
                ? dayjs(exp.endDate).format('MMM YYYY')
                : '';

              return (
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
                  <div
                    className={`ml-16 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'
                    }`}
                  >
                    <div className="bg-dark-200 p-6 rounded-lg shadow-xl">
                      <div className="flex items-center mb-2">
                        {exp.companyLogo && (
                          <img
                            src={exp.companyLogo}
                            alt={exp.company}
                            className="w-8 h-8 mr-2 rounded-full object-cover"
                          />
                        )}
                        <FiBriefcase className="text-accent-primary mr-2" />
                        <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      </div>

                      <h4 className="text-accent-secondary mb-2">{exp.company}</h4>

                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <FiCalendar className="mr-1" />
                        <span>{start} - {end}</span>
                      </div>

                      {exp.location && (
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                          <FiMapPin className="mr-1" />
                          <span>{exp.location}</span>
                        </div>
                      )}

                      <p className="text-gray-400 mb-2">{exp.description}</p>

                      {exp.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exp.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-dark-300 text-accent-primary text-sm rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;