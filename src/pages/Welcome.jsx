import { Link } from 'react-router-dom'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

function Welcome() {
  const heroRef = useRef(null)
  const buttonsRef = useRef(null)
  const featuresRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Explicit initial states (VERY IMPORTANT)
      gsap.set(heroRef.current.children, { opacity: 1, y: 0 })
      gsap.set(buttonsRef.current.children, { opacity: 1, y: 0 })
      gsap.set(featuresRef.current.children, { opacity: 1, y: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(heroRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15
      })
        .from(
          buttonsRef.current.children,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.15
          },
          '-=0.4'
        )
        .from(
          featuresRef.current.children,
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15
          },
          '-=0.2'
        )
    })

    return () => ctx.revert() // CLEANUP (critical)
  }, [])

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-surface-accent bg-surface-dark px-4 md:px-10 py-3 shadow-md">
        <div className="flex items-center gap-4 text-white">
          <span className="material-symbols-outlined text-3xl text-primary">
            spa
          </span>
          <h2 className="text-xl font-bold tracking-tight">
            Raffine
          </h2>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl text-center">
          {/* Hero */}
          <div ref={heroRef} className="mb-12">
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Discover Premium
              <span className="text-primary block">Services</span>
            </h1>
            <p className="text-text-muted text-lg md:text-xl max-w-xl mx-auto">
              Find the best spas, salons, fitness centers, and wellness services in your area
            </p>
          </div>

          {/* Actions */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              to="/login"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-transform hover:scale-[1.03] shadow-lg shadow-primary/20 text-lg"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-4 px-8 rounded-lg transition-transform hover:scale-[1.03] text-lg"
            >
              Create Account
            </Link>
          </div>

          {/* Features */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <div className="bg-surface-dark border border-surface-accent rounded-xl p-6 hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-4xl text-primary mb-4 block">
                spa
              </span>
              <h3 className="text-white text-xl font-bold mb-2">
                Premium Services
              </h3>
              <p className="text-text-muted text-sm">
                Discover top-rated spas and wellness centers
              </p>
            </div>

            <div className="bg-surface-dark border border-surface-accent rounded-xl p-6 hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-4xl text-primary mb-4 block">
                calendar_today
              </span>
              <h3 className="text-white text-xl font-bold mb-2">
                Easy Booking
              </h3>
              <p className="text-text-muted text-sm">
                Book appointments with just a few clicks
              </p>
            </div>

            <div className="bg-surface-dark border border-surface-accent rounded-xl p-6 hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-4xl text-primary mb-4 block">
                star
              </span>
              <h3 className="text-white text-xl font-bold mb-2">
                Trusted Reviews
              </h3>
              <p className="text-text-muted text-sm">
                Read authentic reviews from real customers
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Welcome
