import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { trackEvent } from '../utils/analytics';

const Contact = () => {
  const ref = useRef(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Operations & Analytics Discussion',
    message: '',
    permission: false
  });

  // Validation & Submission State
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax translation for the big background text
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);

  // Email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error on change
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  // Form submission logic with honest mailto composition
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message text is required.";
    }
    if (!formData.permission) {
      newErrors.permission = "Please check the box to confirm you wish to connect.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatusMessage({
        type: 'error',
        text: 'Please review and resolve the highlighted fields below.'
      });
      return;
    }

    setErrors({});

    // Construct formatted email body
    const senderFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const emailSubject = formData.subject.trim() || 'Business Operations Inquiry';
    const emailBody = 
`Hi Vithun,

${formData.message.trim()}

---
Sender Details:
Name: ${senderFullName}
Email: ${formData.email.trim()}`;

    const mailtoUrl = `mailto:vithun2701@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Honest feedback: Explain that the email client is being triggered
    setStatusMessage({
      type: 'info',
      text: 'Opening your default email client with your prefilled message. Please click "Send" in your mail application to dispatch the email to vithun2701@gmail.com.'
    });

    // Track email interaction
    trackEvent('email_click');

    // Trigger the email client
    window.location.href = mailtoUrl;
  };

  return (
    <section ref={ref} id="contact" className="bg-[#3B211B] w-full min-h-screen relative overflow-hidden flex flex-col justify-center items-center py-20 md:py-32 px-4 md:px-8 border-t border-[#6B352A] select-none">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6B352A]/25 rounded-full blur-[70px] pointer-events-none z-0"></div>

      {/* Huge Background Parallax Watermark Text in Warm Brown */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center overflow-hidden pointer-events-none z-0 pt-16 md:pt-12 opacity-25"
      >
        <h1 
          className="text-[25vw] leading-[0.75] font-black text-[#4A2922] uppercase tracking-tighter select-none scale-y-[1.6] origin-top"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          CONTACT
        </h1>
      </motion.div>

      {/* Centered Form Card Container in Secondary Brown */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#4A2922] via-[#40231D] to-[#351C17] border border-[#6B352A] w-full p-8 md:p-14 text-[#F7EEDB] flex flex-col justify-between rounded-3xl shadow-[0_25px_60px_rgba(20,10,8,0.7)] relative overflow-hidden"
        >
          {/* Subtle internal top highlight glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#FFF1A6]/60 to-transparent opacity-90"></div>

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#3B211B] border border-[#6B352A] text-xs font-mono uppercase tracking-widest text-[#FFF1A6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFF1A6] animate-ping"></span>
                <span>GET IN TOUCH</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#F7EEDB]">
                LET'S CONNECT
              </h2>
              <p className="text-xs md:text-sm text-[#C9B8A8] font-light leading-relaxed max-w-xl">
                Interested in business operations, process improvement, or data-driven decision support? I'd be glad to connect and exchange ideas.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end text-xs font-mono text-[#C9B8A8] tracking-wider space-y-1">
              <span className="text-[#FFF1A6] font-bold">DIRECT TRANSMISSION:</span>
              <a 
                href="mailto:vithun2701@gmail.com" 
                onClick={() => trackEvent('email_click')}
                className="text-[#FFF1A6] hover:text-white transition-colors lowercase font-semibold"
              >
                vithun2701@gmail.com
              </a>
              <span className="text-[#C9B8A8]">LOCATION: BENGALURU, INDIA</span>
            </div>
          </div>

          {/* Status / Honest Guidance Feedback Banner */}
          {statusMessage && (
            <div 
              role="alert" 
              className={`p-4 rounded-xl text-xs font-mono mb-8 border transition-all ${
                statusMessage.type === 'error' 
                  ? 'bg-[#532E26] border-amber-500/80 text-amber-200' 
                  : 'bg-[#3B211B] border-[#6B352A] text-[#F7EEDB]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-[#FFF1A6] font-bold mt-0.5">&bull;</span>
                <p className="leading-relaxed">{statusMessage.text}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 md:gap-12 w-full">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full">
              
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-8">
                
                {/* First Name */}
                <div className="relative">
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name *" 
                    aria-required="true"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    className={`w-full bg-transparent border-b pb-3 text-lg focus:outline-none transition-colors placeholder-[#C9B8A8]/60 font-medium rounded-none text-[#F7EEDB] ${
                      errors.firstName ? 'border-amber-500 focus:border-amber-400' : 'border-[#6B352A] focus:border-[#FFF1A6]'
                    }`}
                  />
                  {errors.firstName && (
                    <span id="firstName-error" className="text-xs font-mono text-amber-300 mt-1 block">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative">
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name *" 
                    aria-required="true"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    className={`w-full bg-transparent border-b pb-3 text-lg focus:outline-none transition-colors placeholder-[#C9B8A8]/60 font-medium rounded-none text-[#F7EEDB] ${
                      errors.lastName ? 'border-amber-500 focus:border-amber-400' : 'border-[#6B352A] focus:border-[#FFF1A6]'
                    }`}
                  />
                  {errors.lastName && (
                    <span id="lastName-error" className="text-xs font-mono text-amber-300 mt-1 block">
                      {errors.lastName}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *" 
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full bg-transparent border-b pb-3 text-lg focus:outline-none transition-colors placeholder-[#C9B8A8]/60 font-medium rounded-none text-[#F7EEDB] ${
                      errors.email ? 'border-amber-500 focus:border-amber-400' : 'border-[#6B352A] focus:border-[#FFF1A6]'
                    }`}
                  />
                  {errors.email && (
                    <span id="email-error" className="text-xs font-mono text-amber-300 mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Subject */}
                <div className="relative">
                  <label htmlFor="subject" className="sr-only">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject" 
                    className="w-full bg-transparent border-b border-[#6B352A] pb-3 text-lg focus:outline-none focus:border-[#FFF1A6] transition-colors placeholder-[#C9B8A8]/60 font-medium rounded-none text-[#F7EEDB]"
                  />
                </div>

              </div>

              {/* Right Column: Message */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-full flex flex-col">
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea 
                    id="message" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message or project inquiry here... *" 
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full h-full min-h-[180px] bg-transparent border-b pb-3 text-lg focus:outline-none transition-colors placeholder-[#C9B8A8]/60 font-medium resize-none rounded-none text-[#F7EEDB] ${
                      errors.message ? 'border-amber-500 focus:border-amber-400' : 'border-[#6B352A] focus:border-[#FFF1A6]'
                    }`}
                  ></textarea>
                  {errors.message && (
                    <span id="message-error" className="text-xs font-mono text-amber-300 mt-1 block">
                      {errors.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row gap-8 mt-2 pt-6 border-t border-[#6B352A] items-start md:items-center justify-between">
              
              {/* Permission Checkbox */}
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-3 text-sm font-light text-[#F7EEDB]/90">
                  <input 
                    type="checkbox" 
                    id="permission" 
                    checked={formData.permission}
                    onChange={handleChange}
                    aria-invalid={!!errors.permission}
                    aria-describedby={errors.permission ? "permission-error" : undefined}
                    className="mt-1 w-4 h-4 rounded-sm border-[#6B352A] bg-transparent text-[#6B352A] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
                    style={{ accentColor: "#6B352A" }}
                  />
                  <label htmlFor="permission" className="cursor-pointer max-w-[340px] leading-snug text-xs sm:text-sm">
                    I give permission to receive a direct reply at this email address. *
                  </label>
                </div>
                {errors.permission && (
                  <span id="permission-error" className="text-xs font-mono text-amber-300 pl-7">
                    {errors.permission}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                <a
                  href="mailto:vithun2701@gmail.com"
                  className="px-6 py-3.5 rounded bg-[#3B211B] hover:bg-[#5A3229] text-[#FFF1A6] border border-[#6B352A] font-mono text-xs uppercase tracking-wider text-center transition-colors"
                >
                  Direct Email Client
                </a>

                <button 
                  type="submit" 
                  className="px-8 py-3.5 rounded bg-[#6B352A] hover:bg-[#824B3D] text-[#FFF1A6] border border-[#FFF1A6]/40 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300 group whitespace-nowrap shadow-[0_0_25px_rgba(107,53,42,0.7)] hover:scale-105 active:scale-95"
                >
                  <span>Compose Email</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

            </div>
          </form>

        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
