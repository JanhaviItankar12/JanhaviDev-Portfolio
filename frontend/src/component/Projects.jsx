import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const projects = [
    {
      title: 'AI Task Manager',
      description: 'A smart task management application with AI-powered prioritization and scheduling.',
      image: 'https://via.placeholder.com/600x400',
      tags: ['React', 'Node.js', 'TensorFlow.js', 'MongoDB'],
      github: '#',
      live: '#',
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-featured e-commerce platform with real-time inventory and payment processing.',
      image: 'https://via.placeholder.com/600x400',
      tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
      github: '#',
      live: '#',
    },
    {
      title: 'DevOps Dashboard',
      description: 'Comprehensive dashboard for monitoring and managing cloud infrastructure.',
      image: 'https://via.placeholder.com/600x400',
      tags: ['React', 'D3.js', 'AWS', 'Docker'],
      github: '#',
      live: '#',
    },
    {
      title: 'Social Analytics Tool',
      description: 'Real-time social media analytics and engagement tracking platform.',
      image: 'https://via.placeholder.com/600x400',
      tags: ['Vue.js', 'Express', 'WebSocket', 'Chart.js'],
      github: '#',
      live: '#',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-dark-100">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-dark-200 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-dark-300 text-accent-primary text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      className="flex items-center space-x-2 text-gray-400 hover:text-accent-primary transition-colors"
                    >
                      <FiGithub />
                      <span>Code</span>
                    </a>
                    <a
                      href={project.live}
                      className="flex items-center space-x-2 text-gray-400 hover:text-accent-primary transition-colors"
                    >
                      <FiExternalLink />
                      <span>Live Demo</span>
                    </a>
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

export default Projects;