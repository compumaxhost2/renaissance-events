import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Home', num: '01' },
    { to: '/about', label: 'About', num: '02' },
    { to: '/services', label: 'Services', num: '03' },
  ];

  const isHomePage = location.pathname === '/';
  const showNav = !isHomePage || isScrolled;
  // Once revealed, the mobile menu button stays permanently visible on and off scroll
  const [hasRevealedMenu, setHasRevealedMenu] = useState(!isHomePage || isScrolled);

  useEffect(() => {
    if (!isHomePage || isScrolled) {
      setHasRevealedMenu(true);
      return;
    }

    // If already revealed once, NEVER hide it again on scroll
    if (hasRevealedMenu) {
      return;
    }

    const handleLogoPressed = () => {
      setHasRevealedMenu(true);
    };

    window.addEventListener('hero-logo-pressed', handleLogoPressed);
    const timer = setTimeout(() => {
      setHasRevealedMenu(true);
    }, 1900);

    return () => {
      window.removeEventListener('hero-logo-pressed', handleLogoPressed);
      clearTimeout(timer);
    };
  }, [isHomePage]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        showNav || isMobileMenuOpen
          ? 'h-32 sm:h-40 lg:h-36 bg-[#06369c]/95 backdrop-blur-2xl shadow-2xl border-b border-white/10'
          : 'h-32 sm:h-40 lg:h-48 bg-transparent border-b border-transparent shadow-none'
      )}
    >
      <div className="max-w-screen-2xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 h-full">
        <div className="flex items-center justify-between h-full px-0">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center py-1 shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="Renaissance logo"
              className="h-20 sm:h-24 lg:h-36 max-w-[320px] sm:max-w-[440px] lg:max-w-[560px] w-auto object-contain transition-all duration-500 filter drop-shadow-xl"
            />
          </Link>

          {/* Desktop Navigation - Always visible except on top of Home Hero */}
          <nav
            className={cn(
              'hidden lg:flex items-center space-x-8 transition-all duration-500',
              showNav
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'nav-link text-sm tracking-widest uppercase transition-colors duration-300',
                  location.pathname === link.to
                    ? 'text-white font-semibold underline underline-offset-4'
                    : 'text-white/80 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="btn-luxury bg-white hover:bg-white/90 text-[#06369c] px-6 py-3 text-sm tracking-widest uppercase font-medium"
            >
              Get in Touch
            </Link>
          </nav>

          {/* Mobile Menu Button - Appears when the logo performs the click button effect and stays fixed permanently */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "ml-auto lg:hidden text-white p-2 h-10 w-10 rounded-full border border-white/15 bg-white/10 shadow-md hover:bg-white/20 transition-all duration-500 flex items-center justify-center",
              hasRevealedMenu
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-75 pointer-events-none"
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (ported to body to avoid stacking-context issues) */}
      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-[9998]" role="dialog" aria-modal="true">
              {/* Soft Dimmed Blur Backdrop */}
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Left-to-Right Slide Drawer - Silky Smooth 60fps Compositor Glide */}
              <motion.aside
                key="mobile-drawer-left"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{
                  x: '-100%',
                  transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] }
                }}
                transition={{
                  duration: 0.42,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{ willChange: 'transform' }}
                className="fixed top-0 bottom-0 left-0 h-full h-[100dvh] w-[58vw] min-w-[230px] max-w-[300px] z-[9999] flex flex-col justify-between overflow-hidden border-r border-white/20 bg-[#06369c]/95 backdrop-blur-2xl shadow-[15px_0_50px_rgba(0,0,0,0.55)]"
              >
                {/* Ambient Glow Orbs */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#041a4a]/80 rounded-full blur-3xl pointer-events-none" />

                {/* Drawer Header */}
                <div className="relative z-10 flex items-center justify-between px-5 py-5 border-b border-white/10">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.35em] text-white/50 block font-medium">Navigation</span>
                    <span className="font-serif text-base tracking-[0.14em] uppercase text-white font-medium">Renaissance</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all shadow-md shrink-0 ml-2"
                    aria-label="Close menu"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Drawer Nav Links - Pure Typographic Elegance (No Boxes) */}
                <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.03, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="group flex items-center justify-between py-2 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "font-mono text-xs tracking-wider transition-colors",
                              isActive ? "text-white font-semibold" : "text-white/40 group-hover:text-white/70"
                            )}>
                              {link.num}
                            </span>
                            <span className={cn(
                              "font-serif text-xl sm:text-2xl tracking-wide transition-all group-hover:translate-x-1",
                              isActive ? "text-white font-medium underline underline-offset-8 decoration-white/50" : "text-white/80 group-hover:text-white"
                            )}>
                              {link.label}
                            </span>
                          </div>
                          <ArrowUpRight className={cn(
                            "w-4 h-4 transition-all duration-300",
                            isActive
                              ? "text-white opacity-100 translate-x-0.5 -translate-y-0.5"
                              : "text-white/30 opacity-40 group-hover:opacity-100 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          )} />
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Brand Tagline Note */}

                </div>

                {/* Drawer Footer: Get in Touch CTA */}
                <div className="relative z-10 p-4 border-t border-white/10 bg-black/15 space-y-2">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest font-sans text-center">

                  </div>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group w-full flex items-center justify-center gap-2 bg-white hover:bg-white/95 text-[#06369c] font-semibold text-[11px] uppercase tracking-[0.2em] py-3 rounded-full shadow-lg transition-all active:scale-[0.98]"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
