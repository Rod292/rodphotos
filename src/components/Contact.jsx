import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'Demande générale'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Réinitialiser le formulaire après quelques secondes
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: '',
          email: '',
          message: '',
          subject: 'Demande générale'
        });
      }, 3000);
    }, 1500);
  };

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

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/pcklerod/' },
    { name: 'Email', url: 'mailto:photos.pers@gmail.com' }
  ];

  return (
    <motion.section 
      className="py-24 px-6 bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="mb-12 text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h2 
            className="text-4xl font-light mb-3"
            variants={item}
          >
            Contact
          </motion.h2>
          <motion.p 
            className="text-lg opacity-70 max-w-2xl mx-auto"
            variants={item}
          >
            Intéressé par mon travail ou vous souhaitez discuter d'une collaboration ? N'hésitez pas à me contacter.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <h3 className="text-xl font-medium mb-4">Envoyez-moi un message</h3>
            
            {isSubmitted ? (
              <motion.div 
                className="bg-green-900/30 text-green-200 p-6 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-lg font-medium">Message envoyé !</p>
                <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                      Sujet
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="Demande générale">Demande générale</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Séance photo">Séance photo</option>
                      <option value="Achat de photos">Achat de photos</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-white"
                      required
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="btn btn-primary w-full bg-white text-black"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : "Envoyer le message"}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
          
          <motion.div variants={item}>
            <h3 className="text-xl font-medium mb-4">Informations de contact</h3>
            
            <motion.div className="space-y-6">
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Email</h4>
                <p>photos.pers@gmail.com</p>
              </div>
              
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Instagram</h4>
                <p>@pcklerod</p>
              </div>
              
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Localisation</h4>
                <p>Bretagne, France</p>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Suivez-moi</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-gray-700 rounded-lg text-sm hover:bg-white hover:text-black transition-colors"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {social.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact; 