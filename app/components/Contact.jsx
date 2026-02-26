'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Envelope, MapPin, InstagramLogo, CheckCircle } from '@phosphor-icons/react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    error: false,
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          error: false,
          message: 'Votre message a ete envoye avec succes. Je vous repondrai dans les plus brefs delais.',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          error: true,
          message: 'Une erreur est survenue. Veuillez reessayer ou me contacter directement par email.',
        });
      }
    } catch {
      setFormStatus({
        submitted: true,
        success: false,
        error: true,
        message: 'Une erreur est survenue. Veuillez reessayer ou me contacter directement par email.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-zinc-950 text-zinc-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1400px] mx-auto max-w-3xl">
        <motion.h1
          className="text-4xl md:text-6xl tracking-tighter leading-none mb-8 md:mb-12 font-light"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          Contact
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.1 }}
          >
            <h2 className="text-xl font-light mb-6 tracking-tight">Echangeons</h2>
            <p className="text-base text-zinc-400 mb-8 leading-relaxed max-w-[65ch]">
              {"Pour l'achat d'un tirage, une demande de collaboration, un shooting ou simplement pour echanger sur la photographie, n'hesitez pas a me contacter."}
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <Envelope size={20} weight="light" className="text-zinc-500" />
                <a href="mailto:photos.pers@gmail.com" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  photos.pers@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} weight="light" className="text-zinc-500" />
                <span className="text-zinc-400">Nantes, France</span>
              </div>
            </div>

            <h3 className="text-lg font-light mb-4 tracking-tight">Suivez-moi</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/pcklerod"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-100 transition-colors"
                aria-label="Instagram"
              >
                <InstagramLogo size={24} weight="light" />
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
          >
            {formStatus.submitted && formStatus.success ? (
              <motion.div
                className="rounded-xl p-8 text-center border border-emerald-900/30 bg-emerald-950/20 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <CheckCircle size={48} weight="light" className="mx-auto text-emerald-400 mb-4" />
                <h3 className="text-xl font-light text-emerald-300 mb-2">Message envoye</h3>
                <p className="text-emerald-400/80 text-sm">{formStatus.message}</p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl p-6 md:p-8 border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                noValidate
              >
                <div>
                  <label htmlFor="name" className="block text-sm text-zinc-400 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-zinc-700/50 transition-all ${
                      errors.name ? 'border-red-500/60' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-sm text-red-400/80" role="alert">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-zinc-700/50 transition-all ${
                      errors.email ? 'border-red-500/60' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-sm text-red-400/80" role="alert">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-zinc-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-zinc-700/50 transition-all resize-none ${
                      errors.message ? 'border-red-500/60' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-sm text-red-400/80" role="alert">{errors.message}</p>
                  )}
                </div>

                {formStatus.error && (
                  <p className="text-sm text-red-400/80" role="alert">{formStatus.message}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                  whileHover={submitting ? {} : { scale: 1.02 }}
                  whileTap={submitting ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
