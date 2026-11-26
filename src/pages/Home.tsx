import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronDown, Play, Pause } from 'lucide-react';
import GlobalContactSection from '../components/GlobalContactSection';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );
  const textSectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textSectionRef, { once: true, amount: 0.15 });

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hero-logo-pressed'));

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const togglePlayPause = () => {
    const video = isDesktop ? videoRef.current : mobileVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPaused(false)).catch(() => { });
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    const vDesktop = videoRef.current;
    const vMobile = mobileVideoRef.current;

    const playBoth = () => {
      if (vDesktop) {
        vDesktop.defaultMuted = true;
        vDesktop.muted = true;
        vDesktop.play().catch(() => { });
      }
      if (vMobile) {
        vMobile.defaultMuted = true;
        vMobile.muted = true;
        vMobile.play().catch(() => { });
      }
    };

    playBoth();

    const handleFirstInteraction = () => {
      playBoth();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [isDesktop]);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const heroDim = useTransform(scrollY, [0, 600], [1, 0.7]);

  const headlineText = "Who We Are";
  const words = headlineText.split(" ");

  const paragraph1Text = "With over 30 years of experience, Renaissance Meetings & Special Events is a full-service event management and marketing firm creating memorable brand experiences. From conferences and special events to fundraising and sponsorships, we combine creativity, strategy, and expertise to deliver unique experiences that connect people, elevate brands, and bring our clients' visions to life.";
  const paragraph1Words = paragraph1Text.split(" ");

  // Framer Motion Animation Variants
  const headlineContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const p1ContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.012,
        delayChildren: 0.2,
      },
    },
  };

  const headlineWordVariants = {
    hidden: {
      opacity: 0,
      y: 45,
      filter: 'blur(10px)',
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1] as const,
      },
    },
  };

  const bodyWordVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: 'blur(6px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1] as const,
      },
    },
  };
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[100svh] lg:h-screen w-full flex items-center justify-center overflow-hidden bg-black"
      >
        {/* DESKTOP & LAPTOP HERO: Only mounted on lg+ so mobile never downloads the 47MB desktop video */}
        {isDesktop && (
          <motion.div
            style={{ y: heroY, scale: heroScale, opacity: heroDim }}
            className="absolute inset-0 bg-black overflow-hidden"
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onPlay={() => setIsPaused(false)}
              onPause={() => setIsPaused(true)}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/images/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        )}

        {/* Video Play / Pause Toggle Button (Desktop & Mobile) */}
        <button
          onClick={togglePlayPause}
          className="flex absolute bottom-6 right-5 sm:bottom-10 sm:right-8 lg:bottom-[60px] lg:right-[7.2%] z-20 group w-16 h-16 sm:w-[82px] sm:h-[82px] rounded-full border border-white/35 hover:border-white bg-black/95 hover:bg-black text-white items-center justify-center backdrop-blur-md shadow-xl transition-transform duration-300 cursor-pointer hover:scale-105 active:scale-95"
          aria-label={isPaused ? 'Play background video' : 'Pause background video'}
          title={isPaused ? 'Play video' : 'Pause video'}
        >
          {isPaused ? (
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <Pause className="w-5 h-5 fill-white text-white transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>

        {/* MOBILE & TABLET HERO: Fast-start H.264 Mobile Video */}
        {!isDesktop && (
          <div className="absolute inset-0 bg-black overflow-hidden">
            <video
              ref={mobileVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onPlay={() => setIsPaused(false)}
              onPause={() => setIsPaused(true)}
              className="absolute inset-0 w-full h-full object-cover object-center"
            >
              <source src="/images/renaissance-mobile.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Scroll Button (Desktop / Laptop only - hidden on mobile) */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.85,
              behavior: 'smooth',
            });
          }}
          className="hidden lg:flex absolute bottom-12 left-1/2 -translate-x-1/2 z-20 group flex-col items-center gap-2 text-white/80 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto"
          aria-label="Scroll down"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            Scroll
          </span>
          <div className="w-8 h-12 rounded-full border-2 border-white/40 group-hover:border-white flex items-center justify-center p-1 backdrop-blur-sm bg-white/10 transition-all duration-300 shadow-lg">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.button>
      </section>

      {/* Unique Scroll Reveal Text Section */}
      <section
        ref={textSectionRef}
        className="relative pt-20 pb-16 sm:py-20 lg:py-28 bg-white text-[#06369c]"
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-12 text-center space-y-8 sm:space-y-10">
          {/* Headline Word-by-Word Scroll Reveal */}
          <motion.h1
            variants={headlineContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.2] text-[#06369c] tracking-tight flex flex-wrap justify-center gap-x-[0.3em] gap-y-2"
          >
            {words.map((word, index) => (
              <span key={index} className="inline-block overflow-hidden py-1">
                <motion.span
                  variants={headlineWordVariants}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Decorative Animated Line Accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-20 sm:w-24 h-[2px] bg-[#06369c] mx-auto origin-center rounded-full"
          />

          {/* Paragraph 1 Word-by-Word Scroll Reveal - Perfectly Aligned on Both Sides & Equal Margins */}
          <motion.p
            variants={p1ContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-[#06369c] text-[15px] sm:text-lg lg:text-xl leading-[1.85] font-normal sm:font-medium text-justify [text-align-last:center] [text-justify:inter-word] tracking-normal"
          >
            {paragraph1Words.map((word, index) => (
              <span key={index}>
                <span className="inline-block overflow-hidden py-0.5 align-baseline">
                  <motion.span
                    variants={bodyWordVariants}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
                {index < paragraph1Words.length - 1 && ' '}
              </span>
            ))}
          </motion.p>
        </div>
      </section>

      {/* Reusable Architectural Editorial Contact Section */}
      <GlobalContactSection />
    </main>
  );
}
