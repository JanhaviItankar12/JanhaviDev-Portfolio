import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { useGetProjectsQuery } from '../api/publicApi';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data, isLoading, isError } = useGetProjectsQuery();

  // Adjust this according to your API response
  const projects = data?.data || [];

  if (isLoading) return (
    <div className="py-20" style={{ backgroundColor: 'var(--color-dark-100)' }}>
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-accent-primary)' }}></div>
        <p className="text-gray-400 mt-4">Loading projects...</p>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="py-20" style={{ backgroundColor: 'var(--color-dark-100)' }}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-red-500">Failed to load projects. Please try again later.</p>
      </div>
    </div>
  );

  return (
    <section id="projects" className="py-20" style={{ backgroundColor: 'var(--color-dark-100)' }}>
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <motion.div
                  key={project._id || index}
                  whileHover={{ y: -8 }}
                  className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 max-w-sm mx-auto w-full"
                  style={{ backgroundColor: 'var(--color-dark-200)' }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden group" style={{ height: '200px' }}>
                    <img
                      src={project.imageURL || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-200)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full" 
                        style={{ 
                          backgroundColor: 'var(--color-accent-primary)',
                          color: 'white'
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm">{project.description}</p>

                    {/* All Technologies - No Limits */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.techStack.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 text-xs rounded-full"
                            style={{ 
                              backgroundColor: 'var(--color-dark-300)', 
                              color: 'var(--color-accent-primary)' 
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-dark-300)' }}>
                      {/* GitHub Link */}
                      {project.githubLink ? (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-400 hover:text-[var(--color-accent-primary)] transition-colors text-sm"
                        >
                          <FiGithub className="text-lg" />
                          <span>Code</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 text-gray-600 cursor-not-allowed text-sm">
                          <FiGithub className="text-lg" />
                          <span>Code</span>
                        </span>
                      )}

                      {/* Live Demo Link - only if available */}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-400 hover:text-[var(--color-accent-secondary)] transition-colors text-sm"
                        >
                          <FiExternalLink className="text-lg" />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {/* If no links at all */}
                      {!project.githubLink && !project.liveLink && (
                        <span className="text-gray-500 text-sm">No links available</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">No projects found.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;