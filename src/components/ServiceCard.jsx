import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'

function ServiceCard({ service }) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToCart } = useCart()
  const favorite = isFavorite(service.id)

  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const buttonRef = useRef(null)

  const handleFavorite = (e) => {
    e.stopPropagation()
    toggleFavorite(service)

    // micro tap feedback
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.9 },
      { scale: 1, duration: 0.25, ease: 'power3.out' }
    )
  }

  const handleBookNow = (e) => {
    e.stopPropagation()
    addToCart(service)
    alert(`${service.name} added to cart!\n\nThis will open booking details when backend is ready.`)
  }

  const handleCardClick = () => {
    alert(`Viewing details for ${service.name}\n\nService detail page will be implemented when backend is ready.`)
  }

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -8,
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      duration: 0.35,
      ease: 'power3.out'
    })

    gsap.to(imageRef.current, {
      scale: 1.08,
      duration: 0.5,
      ease: 'power3.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
      duration: 0.35,
      ease: 'power3.out'
    })

    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.5,
      ease: 'power3.out'
    })
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={i}
          className="material-symbols-outlined filled text-yellow-500 text-[16px]"
        >
          star
        </span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span
          key="half"
          className="material-symbols-outlined filled text-yellow-500 text-[16px]"
        >
          star_half
        </span>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          className="material-symbols-outlined text-[16px] opacity-30 text-[16px]"
        >
          star
        </span>
      )
    }

    return stars
  }

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col bg-surface-dark border border-surface-accent rounded-xl overflow-hidden cursor-pointer transition-colors"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          ref={imageRef}
          alt={service.alt}
          src={service.image}
          className="h-full w-full object-cover"
        />

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-colors ${
            favorite
              ? 'bg-primary text-white'
              : 'bg-black/40 text-white hover:bg-primary'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] block ${
              favorite ? 'filled' : ''
            }`}
          >
            favorite
          </span>
        </button>

        {/* Badge */}
        {service.badge && (
          <div className="absolute bottom-3 left-3 z-20">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${service.badge.color} text-white backdrop-blur-md`}
            >
              {service.badge.text}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        <p className="text-text-muted text-sm mb-2">
          {service.description}
        </p>

        <div className="flex items-center gap-1 mb-4">
          {renderStars(service.rating)}
          <span className="text-white text-sm font-medium ml-1">
            {service.rating}
          </span>
          <span className="text-text-muted text-xs">
            ({service.reviews} reviews)
          </span>
          <span className="mx-2 text-surface-accent">•</span>
          <span className="text-white text-sm">{service.priceRange}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-surface-accent">
          <div>
            {service.originalPrice ? (
              <>
                <span className="text-text-muted text-xs line-through">
                  {service.originalPrice}
                </span>
                <span className="block text-white font-bold">
                  {service.price}
                </span>
              </>
            ) : (
              <>
                <span className="text-text-muted text-xs">
                  {service.priceLabel || 'From'}
                </span>
                <span className="block text-white font-bold">
                  {service.price}
                </span>
              </>
            )}
          </div>

          <button
            ref={buttonRef}
            onClick={handleBookNow}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-lg shadow-primary/20 transition-transform hover:scale-[1.04]"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
