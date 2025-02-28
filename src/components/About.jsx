import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      className="min-h-screen py-24 px-6 bg-black text-white flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <motion.div 
              className="relative w-full aspect-square rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src="/profilepicture.JPG" 
                alt="Portrait de ROD"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
          </motion.div>

          <motion.div variants={container}>
            <motion.h2 
              className="text-4xl font-light mb-6"
              variants={item}
            >
              À propos
            </motion.h2>
            
            <motion.div className="space-y-4" variants={item}>
              <p className="leading-relaxed">
                Je suis ROD, un photographe breton de 24 ans passionné par la capture de moments simples, la nature, et les couleurs uniques du film argentique.
              </p>
              
              <p className="leading-relaxed">
                Mon approche photographique se concentre sur la beauté du quotidien, les paysages naturels et l'authenticité des instants capturés. J'aime particulièrement travailler avec la photographie argentique pour sa richesse de tons et son caractère inimitable.
              </p>
              
              <p className="leading-relaxed">
                Je réalise également des photos de surf, capturant l'énergie des vagues et la passion des surfeurs en action. Pour découvrir mon travail dédié à l'univers du surf, visitez Arode Studio.
              </p>
              
              <p className="leading-relaxed">
                Je propose mes photos à la vente et je réalise également des séances photo de style lifestyle pour vos futures campagnes. N'hésitez pas à me contacter pour discuter de vos projets ou pour acquérir mes œuvres.
              </p>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-wrap gap-4"
              variants={item}
            >
              <motion.a
                href="https://www.instagram.com/pcklerod/" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary bg-white text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Instagram
              </motion.a>
              
              <motion.a
                href="mailto:photos.pers@gmail.com" 
                className="btn border border-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.a>
              
              <motion.a
                href="https://www.arodestudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-white flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">🏄‍♂️</span>
                <span>Arode Studio</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About; 