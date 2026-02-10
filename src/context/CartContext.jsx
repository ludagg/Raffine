import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { updateCart as updateCartAPI, getUserProfile } from '../api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])

  // Load initial cart
  useEffect(() => {
    const savedCart = localStorage.getItem('raffine_cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        localStorage.removeItem('raffine_cart')
      }
    }
  }, [])

  // Sync cart with backend if authenticated
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        try {
          // When logging in, we might want to merge or just fetch
          const profile = await getUserProfile()
          // Simplify: just use backend cart if it has items, otherwise use local
          if (profile.cart && profile.cart.length > 0) {
            const formattedCart = profile.cart.map(item => ({
              ...item.service,
              quantity: item.quantity,
              id: item.service._id // Map _id to id for frontend compatibility
            }))
            setCartItems(formattedCart)
          }
        } catch (error) {
          console.error('Failed to sync cart', error)
        }
      }
    }
    syncCart()
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('raffine_cart', JSON.stringify(cartItems))

    // Update backend if authenticated
    if (isAuthenticated) {
      const backendCart = cartItems.map(item => ({
        service: item._id || item.id,
        quantity: item.quantity
      }))
      updateCartAPI(backendCart).catch(console.error)
    }
  }, [cartItems, isAuthenticated])

  const addToCart = (service) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === service.id)
      if (exists) {
        return prev.map(item => 
          item.id === service.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...service, quantity: 1 }]
    })
  }

  const removeFromCart = (serviceId) => {
    setCartItems(prev => prev.filter(item => item.id !== serviceId))
  }

  const updateQuantity = (serviceId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(serviceId)
      return
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === serviceId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

