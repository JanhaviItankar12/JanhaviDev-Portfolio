import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaReact, FaNodeJs, FaPython, FaJava, 
  FaAws, FaDocker, FaGit, FaFigma, 
  FaGithub
} from 'react-icons/fa';
import { 
  SiTypescript, SiJavascript, SiTailwindcss, 
  SiMongodb, SiPostgresql, SiRedis, 
  SiC,
  SiHtml5,
  SiCss,
  SiMysql,
  SiExpress,
  SiBootstrap,
  SiMui,
  SiRedux,
  SiShadcnui
} from 'react-icons/si';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills = [
  // Languages
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'C', icon: SiC, color: '#00599C' },
  { name: 'Java', icon: FaJava, color: '#007396' },
  { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', icon: SiCss, color: '#1572B6' },
  
  // Databases
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  
  // Frameworks & Libraries
  { name: 'React', icon: FaReact, color: '#61DAFB' },
  { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
  { name: 'Express.js', icon: SiExpress, color: '#FFFFFF' },
  { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Material UI', icon: SiMui, color: '#007FFF' },
  { name: 'Redux', icon: SiRedux, color: '#764ABC' },
  { name: 'Shadcn UI', icon: SiShadcnui, color: '#FFFFFF' },
  
  // Tools
  { name: 'Git', icon: FaGit, color: '#F05032' },
  { name: 'GitHub', icon: FaGithub, color: '#FFFFFF' },
  { name: 'Figma', icon: FaFigma, color: '#F24E1E' },
];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section id="skills" className="py-20 bg-dark-200">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center p-4 bg-dark-300 rounded-lg hover:shadow-xl transition-all duration-300 group"
              >
                <skill.icon 
                  className="text-5xl mb-3 transition-transform group-hover:rotate-12" 
                  style={{ color: skill.color }}
                />
                <span className="text-sm text-gray-300 text-center">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;