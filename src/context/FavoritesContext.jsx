import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { updateFavorites as updateFavoritesAPI, getUserProfile } from '../api'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState([])

  // Load initial favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem('raffine_favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        localStorage.removeItem('raffine_favorites')
      }
    }
  }, [])

  // Sync favorites with backend if authenticated
  useEffect(() => {
    const syncFavorites = async () => {
      if (isAuthenticated) {
        try {
          const profile = await getUserProfile()
          if (profile.favorites && profile.favorites.length > 0) {
            const formattedFavorites = profile.favorites.map(service => ({
              ...service,
              id: service._id
            }))
            setFavorites(formattedFavorites)
          }
        } catch (error) {
          console.error('Failed to sync favorites', error)
        }
      }
    }
    syncFavorites()
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('raffine_favorites', JSON.stringify(favorites))

    // Update backend if authenticated
    if (isAuthenticated) {
      const backendFavorites = favorites.map(item => item._id || item.id)
      updateFavoritesAPI(backendFavorites).catch(console.error)
    }
  }, [favorites, isAuthenticated])

  const toggleFavorite = (service) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === service.id)
      if (exists) {
        return prev.filter(item => item.id !== service.id)
      }
      return [...prev, service]
    })
  }

  const isFavorite = (serviceId) => {
    return favorites.some(item => item.id === serviceId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

