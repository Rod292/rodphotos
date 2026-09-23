'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { spring } from '../lib/motion';
import Image from 'next/image';
import { Envelope, MapPin, InstagramLogo, CheckCircle } from '@phosphor-icons/react';
import { photos } from '../data/photos';

const SUBJECTS = ['Tirage', 'Séance photo', 'Collaboration', 'Autre'];

const Contact = () => {
  const searchParams = useSearchParams();
  const photoId = searchParams.get('photo');
  const selectedPhoto = photoId ? photos.find(p => p.id === photoId) : null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '', // honeypot — reste vide pour un humain
  });
  const formStartRef = useRef(Date.now());
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    error: false,
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPhoto) {
      setFormData(prev => ({
        ...prev,
        subject: 'Tirage',
        message: `Bonjour,\n\nJe souhaite obtenir des renseignements concernant la photo « ${selectedPhoto.title} » (réf: ${selectedPhoto.id}).\n\nMerci.`,
      }));
    }
  }, [selectedPhoto]);

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
        body: JSON.stringify({
          ...formData,
          elapsed: Date.now() - formStartRef.current,
        }),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          error: false,
          message: 'Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          error: true,
          message: 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.',
        });
      }
    } catch {
      setFormStatus({
        submitted: true,
        success: false,
        error: true,
        message: 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-white text-zinc-900">
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="text-4xl md:text-6xl tracking-tighter leading-none mb-8 md:mb-12 font-light">
          Contact
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left column: contact info + photo if selected */}
          <motion.div>
            <h2 className="text-xl font-light mb-6 tracking-tight">Échangeons</h2>
            <p className="text-base text-zinc-600 mb-8 leading-relaxed max-w-[65ch]">
              {"Pour l'achat d'un tirage, une demande de collaboration, un shooting ou simplement pour échanger sur la photographie, n'hésitez pas à me contacter."}
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <Envelope size={20} weight="light" className="text-zinc-500" />
                <a href="mailto:contact@photosrod.com" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                  contact@photosrod.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} weight="light" className="text-zinc-500" />
                <span className="text-zinc-600">Bretagne, France</span>
              </div>
            </div>

            <h3 className="text-lg font-light mb-4 tracking-tight">Suivez-moi</h3>
            <div className="flex gap-4 mb-10">
              <a
                href="https://instagram.com/pcklerod"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition-colors"
                aria-label="Instagram"
              >
                <InstagramLogo size={24} weight="light" />
              </a>
            </div>

            {/* Photo preview — left column on desktop */}
            {selectedPhoto && (
              <motion.div
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 overflow-hidden"
              >
                <div className="rounded-lg overflow-hidden mb-4">
                  <Image
                    src={selectedPhoto.path}
                    alt={selectedPhoto.alt}
                    width={600}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="w-full h-auto max-h-[280px] object-contain"
                  />
                </div>
                <p className="text-sm text-zinc-700 font-light">{selectedPhoto.title}</p>
                <p className="text-xs text-zinc-500 mt-1">Réf: {selectedPhoto.id}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div>
            {formStatus.submitted && formStatus.success ? (
              <motion.div
                className="rounded-xl p-8 text-center border border-emerald-200 bg-emerald-50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring.smooth}
              >
                <CheckCircle size={48} weight="light" className="mx-auto text-emerald-600 mb-4" />
                <h3 className="text-xl font-light text-emerald-800 mb-2">Message envoyé</h3>
                <p className="text-emerald-700 text-sm">{formStatus.message}</p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl p-6 md:p-8 border border-zinc-200 bg-zinc-50"
                noValidate
              >
                {/* Honeypot anti-spam : champ invisible que seuls les bots remplissent */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                  <label htmlFor="website">Site web</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm text-zinc-600 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-300/60 transition-all ${
                      errors.name ? 'border-red-500/70' : 'border-zinc-200 focus:border-zinc-400'
                    }`}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-sm text-red-600" role="alert">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-zinc-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-300/60 transition-all ${
                      errors.email ? 'border-red-500/70' : 'border-zinc-200 focus:border-zinc-400'
                    }`}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-sm text-red-600" role="alert">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-zinc-600 mb-2">
                    Téléphone <span className="text-zinc-500 font-light">(optionnel)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-300/60 focus:border-zinc-400 transition-all"
                  />
                </div>

                <fieldset>
                  <legend className="block text-sm text-zinc-600 mb-2">
                    Objet <span className="text-zinc-500 font-light">(optionnel)</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(subject => (
                      <label
                        key={subject}
                        className={`cursor-pointer px-4 py-2 rounded-full text-sm border transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-zinc-600 ${
                          formData.subject === subject
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={subject}
                          checked={formData.subject === subject}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {subject}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="message" className="block text-sm text-zinc-600 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-300/60 transition-all resize-none ${
                      errors.message ? 'border-red-500/70' : 'border-zinc-200 focus:border-zinc-400'
                    }`}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-sm text-red-600" role="alert">{errors.message}</p>
                  )}
                </div>

                {formStatus.error && (
                  <p className="text-sm text-red-600" role="alert">{formStatus.message}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="btn-solid w-full disabled:opacity-40 disabled:cursor-not-allowed"
                  whileTap={submitting ? {} : { scale: 0.97 }}
                  transition={spring.smooth}
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : 'Envoyer'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
