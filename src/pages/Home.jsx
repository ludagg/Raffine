import { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ServiceCard from '../components/ServiceCard'

function Home() {
  const [sortBy, setSortBy] = useState('Recommended')
  const [viewMode, setViewMode] = useState('grid')
  const [displayedServices, setDisplayedServices] = useState(6)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: { min: 50, max: 500 },
    selectedServices: ['Spa & Massage'],
    selectedRatings: ['4.0']
  })

  const [allServices, setAllServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services`)
        const data = await response.json()
        if (response.ok) {
          setAllServices(data)
        }
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let filtered = [...allServices]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(service => 
        service.category === selectedCategory
      )
    }

    // Service type filter
    if (filters.selectedServices.length > 0) {
      filtered = filtered.filter(service =>
        filters.selectedServices.some(selected => 
          service.serviceType === selected
        )
      )
    }

    // Price range filter
    filtered = filtered.filter(service =>
      service.priceValue >= filters.priceRange.min &&
      service.priceValue <= filters.priceRange.max
    )

    // Rating filter
    if (filters.selectedRatings.length > 0) {
      filtered = filtered.filter(service => {
        return filters.selectedRatings.some(rating => {
          const minRating = parseFloat(rating)
          return service.rating >= minRating
        })
      })
    }

    // Sort
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.priceValue - b.priceValue)
        break
      case 'Price: High to Low':
        filtered.sort((a, b) => b.priceValue - a.priceValue)
        break
      case 'Top Rated':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'Recommended':
      default:
        // Keep original order
        break
    }

    return filtered
  }, [allServices, searchQuery, selectedCategory, filters, sortBy])

  const handleSearch = (query) => {
    setSearchQuery(query)
    setDisplayedServices(6) // Reset displayed count on new search
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category)
    setDisplayedServices(6)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleViewToggle = (mode) => {
    setViewMode(mode)
    if (mode === 'map') {
      alert('Map view\n\nThis will show services on a map when backend is ready.')
    }
  }

  const handleLoadMore = () => {
    setDisplayedServices(prev => Math.min(prev + 6, filteredAndSortedServices.length))
  }

  const services = filteredAndSortedServices.slice(0, displayedServices)
  const hasMore = displayedServices < filteredAndSortedServices.length

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header 
        onSearch={handleSearch} 
        onCategoryClick={handleCategoryClick}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {/* Main Layout */}
      <div className="layout-container flex flex-col md:flex-row h-full grow w-full max-w-[1440px] mx-auto pt-6 px-4 md:px-6 lg:px-10 pb-10 gap-8">
        <Sidebar onFiltersChange={setFilters} />
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-white text-2xl font-bold leading-tight">Premium Services</h1>
              <p className="text-text-muted text-sm mt-1">
                Showing {services.length} of {filteredAndSortedServices.length} results
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-surface-dark border border-surface-accent text-white text-sm font-medium rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
              <div className="flex bg-surface-dark border border-surface-accent rounded-lg p-1">
                <button 
                  onClick={() => handleViewToggle('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-surface-accent text-white shadow-sm' 
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] block">grid_view</span>
                </button>
                <button 
                  onClick={() => handleViewToggle('map')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-surface-accent text-white shadow-sm' 
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] block">map</span>
                </button>
              </div>
            </div>
          </div>
          {/* Service Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-text-muted mt-4">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <>
              <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : ''} gap-6`}>
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              {/* Pagination / Load More */}
              {hasMore && (
                <div className="flex justify-center mt-12 mb-8">
                  <button 
                    onClick={handleLoadMore}
                    className="flex items-center gap-2 border border-surface-accent bg-surface-dark text-white hover:bg-surface-accent px-6 py-3 rounded-lg font-bold transition-all"
                  >
                    Show More Results ({filteredAndSortedServices.length - displayedServices} remaining)
                    <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="material-symbols-outlined text-6xl text-text-muted mb-4">search_off</span>
              <p className="text-white text-xl font-bold mb-2">No services found</p>
              <p className="text-text-muted text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home
