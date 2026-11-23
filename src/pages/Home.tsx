import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronDown, Play, Pause, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlobalContactSection from '../components/GlobalContactSection';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textSectionRef, { once: true, amount: 0.15 });

  // Mobile Hero Opening Animation Stages: 'merging' -> 'docking' -> 'pressing' -> 'revealed'
  const [animStage, setAnimStage] = useState<'merging' | 'docking' | 'pressing' | 'revealed'>('merging');
  const [dockOffset, setDockOffset] = useState({ x: -111, y: -358 });
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const computeDock = () => {
      // In docked position (header), logo center is at: X = 16 + 136/2 = 84px, Y = 64px
      const targetCenterX = 84;
      const targetCenterY = 64;
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;

      setDockOffset({
        x: targetCenterX - screenCenterX,
        y: targetCenterY - screenCenterY,
      });
    };

    computeDock();
    window.addEventListener('resize', computeDock);
    return () => window.removeEventListener('resize', computeDock);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fast, snappy choreography:
    // 1. Logo halves merge in center: 0 -> 0.5s
    // 2. Quick metallic shine sweep: 0.55s -> 1.15s
    // 3. Logo glides into top-left header slot: 1.25s -> 1.85s
    const tDock = setTimeout(() => {
      setAnimStage('docking');
    }, 1250);

    // 4. Logo plays quick tactile button press bounce: 1.9s -> 2.15s
    const tPress = setTimeout(() => {
      setAnimStage('pressing');
      window.dispatchEvent(new CustomEvent('hero-logo-pressed'));
    }, 1900);

    // 5. Wave immediately bursts from logo and reveals content: 2.2s
    const tReveal = setTimeout(() => {
      setAnimStage('revealed');
    }, 2200);

    return () => {
      clearTimeout(tDock);
      clearTimeout(tPress);
      clearTimeout(tReveal);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
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
        vDesktop.play().catch(() => {});
      }
      if (vMobile) {
        vMobile.defaultMuted = true;
        vMobile.muted = true;
        vMobile.play().catch(() => {});
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
  }, []);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const heroDim = useTransform(scrollY, [0, 600], [1, 0.7]);

  const headlineText = "Who We Are";
  const words = headlineText.split(" ");

  const paragraph1Text = "With over 30 years of experience, Renaissance Meetings & Special Events is a full-service event management and marketing firm creating memorable brand experiences. From conferences and special events to fundraising and sponsorships, we combine creativity, strategy, and expertise to deliver unique experiences that connect people, elevate brands, and bring our clients' visions to life.";
  const paragraph1Words = paragraph1Text.split(" ");

  const paragraph2Text = "";
  const paragraph2Words = paragraph2Text.split(" ");

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

  const p2ContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025,
        delayChildren: 0.95,
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
        className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
      >
        {/* DESKTOP & LAPTOP HERO: Video Player (hidden on mobile & tablets, visible on lg+) */}
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroDim }}
          className="hidden lg:block absolute inset-0 bg-black overflow-hidden"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/images/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Video Play / Pause Toggle Button (Desktop & Laptop only - lg+) */}
        <button
          onClick={togglePlayPause}
          className="hidden lg:flex absolute bottom-14 right-6 sm:bottom-[60px] sm:right-[7.2%] z-20 group w-16 h-16 sm:w-[82px] sm:h-[82px] rounded-full border border-white/35 hover:border-white bg-black/95 hover:bg-black text-white items-center justify-center backdrop-blur-md shadow-xl transition-transform duration-300 cursor-pointer hover:scale-105 active:scale-95"
          aria-label={isPaused ? 'Play background video' : 'Pause background video'}
          title={isPaused ? 'Play video' : 'Pause video'}
        >
          {isPaused ? (
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <Pause className="w-5 h-5 fill-white text-white transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>

        {/* MOBILE & TABLET HERO: Cinematic Lens-Blurred Video + Royal Blue Brand Overlay (lg:hidden) */}
        <div className="lg:hidden absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#041a4a]">
          {/* Background Video with Lens Blur & Royal Blue Brand Depth */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video
              ref={mobileVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover scale-110 filter blur-[6px] opacity-75"
            >
              <source src="/images/mobile-video.mp4" type="video/mp4" />
            </video>

            {/* Signature Royal Blue Brand Overlays (reduced opacity so video is visible) */}
            <div className="absolute inset-0 bg-[#06369c]/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06369c]/30 via-[#06369c]/40 to-[#031b4e]/75" />
          </div>

          {/* Ambient Lighting Accents */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-400/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-700/35 rounded-full blur-[120px] pointer-events-none" />

          {/* THE UNIQUE SPLIT-LOGO CONTAINER: Centered in screen, glides into top-left header position (lg:hidden) */}
          <div className="lg:hidden fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <motion.div
              initial={false}
              animate={{
                x: animStage === 'merging' ? 0 : dockOffset.x,
                y: animStage === 'merging' ? 0 : dockOffset.y,
                scale: animStage === 'merging' ? 1.65 : animStage === 'pressing' ? 0.88 : 1.0,
                opacity: isScrolledPastHero ? 0 : 1,
              }}
              transition={{
                x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                scale: animStage === 'pressing'
                  ? { duration: 0.25, ease: 'easeInOut' }
                  : { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25 },
              }}
              className="relative h-22 w-[136px] flex items-center justify-center origin-center"
            >
              {/* Top Half of Logo: Slides down into center */}
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: 'inset(0 0 50% 0)' }}
              >
                <img
                  src="/images/logo.png"
                  alt="Renaissance Meetings and Special Events"
                  className="h-22 w-auto max-w-none object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Bottom Half of Logo: Slides up into center */}
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: 'inset(50% 0 0 0)' }}
              >
                <img
                  src="/images/logo.png"
                  alt="Renaissance Meetings and Special Events"
                  className="h-22 w-auto max-w-none object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Fast Crisp Metallic Diagonal Shine Sweep */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{
                  maskImage: 'url(/images/logo.png)',
                  WebkitMaskImage: 'url(/images/logo.png)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              >
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  animate={{
                    x: ['-150%', '150%'],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.55,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="w-36 h-full bg-gradient-to-r from-transparent via-white to-transparent -skew-x-25 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                />
              </div>

              {/* Polished Glass Sheen Flare */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: [0, 0.85, 0],
                  x: [-100, 100],
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.55,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-25 blur-sm"
              />
            </motion.div>
          </div>

          {/* Expanding Energy Wave Crests: Emitted from the logo at top-left across to bottom-right (GPU accelerated via scale) */}
          {animStage === 'revealed' && (
            <>
              {/* Primary Glowing Wave Crest */}
              <motion.div
                initial={{ scale: 0, opacity: 0.95 }}
                animate={{
                  scale: 22,
                  opacity: [0.95, 0.7, 0],
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.2, 0.8, 0.25, 1],
                }}
                className="absolute top-[64px] left-[84px] w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white/80 pointer-events-none shadow-[0_0_25px_rgba(255,255,255,0.85)] z-20 will-change-transform"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(96,165,250,0.15) 55%, transparent 70%)',
                }}
              />

              {/* Secondary Soft Echo Wave */}
              <motion.div
                initial={{ scale: 0, opacity: 0.65 }}
                animate={{
                  scale: 20,
                  opacity: [0.65, 0.4, 0],
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.06,
                  ease: [0.2, 0.8, 0.25, 1],
                }}
                className="absolute top-[64px] left-[84px] w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-blue-200/60 pointer-events-none shadow-[0_0_15px_rgba(191,219,254,0.6)] z-20 will-change-transform"
              />
            </>
          )}

          {/* Wave Reveal Content Container: Expands from top-left (logo) to bottom-right where the wave goes */}
          <motion.div
            initial={false}
            animate={{
              opacity: animStage === 'revealed' ? 1 : 0,
              clipPath: animStage === 'revealed'
                ? 'circle(180% at 84px 64px)'
                : 'circle(0% at 84px 64px)',
            }}
            transition={{
              duration: 0.85,
              ease: [0.2, 0.8, 0.25, 1],
            }}
            style={{ willChange: 'clip-path, opacity' }}
            className="relative z-10 w-full h-full flex flex-col px-6 pt-24 sm:pt-28 pb-8"
          >
            <div className="my-auto space-y-6 sm:space-y-7">
              {/* Bold Editorial Headline (Perfect balance of above and below space) */}
              <motion.div
                initial={false}
                animate={animStage === 'revealed' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                <h1 className="font-serif text-white tracking-tight leading-[1.1]">
                  <span className="block text-3xl sm:text-4xl text-white/95 font-normal">
                    Let’s create something
                  </span>
                  <span className="block text-[2.85rem] sm:text-5xl lg:text-6xl font-medium text-white mt-1 tracking-tight">
                    unforgettable
                  </span>
                </h1>
                <p className="text-white/90 text-[15px] sm:text-base leading-relaxed font-sans pt-1 max-w-[400px]">
                  We bring events to life through expert planning, creative production, and seamless execution, creating memorable experiences of every scale.
                </p>
              </motion.div>

              {/* Mobile CTA Buttons */}
              <motion.div
                initial={false}
                animate={animStage === 'revealed' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 flex flex-col sm:flex-row gap-3 pointer-events-auto"
              >
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#06369c] text-xs uppercase tracking-[0.2em] font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <span>Plan Your Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/40 hover:border-white text-white text-xs uppercase tracking-[0.2em] font-semibold text-center backdrop-blur-sm active:scale-95 transition-all"
                >
                  Explore Services
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

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

          {/* Paragraph 2 Word-by-Word Scroll Reveal */}
          {paragraph2Text.trim().length > 0 && (
            <motion.p
              variants={p2ContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-[#06369c] text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium flex flex-wrap justify-center gap-x-[0.25em] gap-y-1.5"
            >
              {paragraph2Words.map((word, index) => (
                <span key={index} className="inline-block overflow-hidden py-0.5">
                  <motion.span
                    variants={bodyWordVariants}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.p>
          )}
        </div>
      </section>

      {/* Reusable Architectural Editorial Contact Section */}
      <GlobalContactSection />
    </main>
  );
}
