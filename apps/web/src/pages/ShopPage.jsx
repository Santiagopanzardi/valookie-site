
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Star, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FilterPanel from '@/components/FilterPanel.jsx';
import ActiveFilters from '@/components/ActiveFilters.jsx';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/hooks/useCart.js';

const ShopPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableAllergens, setAvailableAllergens] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      // Extract unique categories
      const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
      setAvailableCategories(categories);

      // Extract unique allergens
      const allergenSet = new Set();
      products.forEach(p => {
        if (p.allergens) {
          p.allergens.split(',').forEach(a => allergenSet.add(a.trim()));
        }
      });
      setAvailableAllergens(Array.from(allergenSet));

      // Calculate price range
      const prices = products.map(p => p.price);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [products]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy, categoryFilter, priceRange, selectedAllergens]);

  const fetchProducts = async () => {
    try {
      const data = await pb.collection('products').getFullList({
        sort: '-createdAt',
        $autoCancel: false
      });
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar los productos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter (nuevo campo categories es array)
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => {
        const cats = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);
        return cats.includes(categoryFilter);
      });
    }

    // Price range filter
    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Allergen filter (exclusion logic)
    if (selectedAllergens.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.allergens) return true;
        const productAllergens = p.allergens.toLowerCase().split(',').map(a => a.trim());
        return !selectedAllergens.some(allergen =>
          productAllergens.includes(allergen.toLowerCase())
        );
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  // Clear filter functions
  const clearSearch = () => setSearchQuery('');
  const clearCategory = () => setCategoryFilter('all');
  const clearPriceRange = () => setPriceRange([minPrice, maxPrice]);
  const clearAllergen = (allergen) => {
    setSelectedAllergens(prev => prev.filter(a => a !== allergen));
  };
  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceRange([minPrice, maxPrice]);
    setSelectedAllergens([]);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>Comprar Todas las Galletas - Valookie</title>
        <meta name="description" content="Explora nuestra colección completa de galletas artesanales. Filtra por tipo, alérgenos y precio para encontrar tu delicia perfecta." />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
              Comprar todas las galletas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Descubre nuestra colección completa de galletas artesanales hechas con amor en Barcelona
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar galletas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-gray-900 placeholder:text-gray-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Active Filters */}
          <ActiveFilters
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedAllergens={selectedAllergens}
            onClearSearch={clearSearch}
            onClearCategory={clearCategory}
            onClearPriceRange={clearPriceRange}
            onClearAllergen={clearAllergen}
            onClearAll={clearAllFilters}
          />

          {/* Layout: sidebar izquierdo + productos */}
          <div className="flex gap-8 items-start">

            {/* Sidebar de filtros — fijo en desktop, oculto en móvil */}
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-base font-semibold mb-6">Filtros</h2>
              <FilterPanel
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                availableCategories={availableCategories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                selectedAllergens={selectedAllergens}
                setSelectedAllergens={setSelectedAllergens}
                availableAllergens={availableAllergens}
              />
              {(searchQuery || categoryFilter !== 'all' || priceRange[0] !== minPrice || priceRange[1] !== maxPrice || selectedAllergens.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="mt-6 w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpiar todos los filtros
                </Button>
              )}
            </aside>

            {/* Columna de productos */}
            <div className="flex-1 min-w-0">
              {/* Contador de resultados */}
              {!loading && (
                <div className="mb-4 text-sm text-muted-foreground">
                  Mostrando {filteredProducts.length} de {products.length} productos
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-card rounded-2xl overflow-hidden">
                      <div className="aspect-square bg-muted animate-pulse"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                        <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-2xl">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No se encontraron galletas</h3>
                  <p className="text-muted-foreground mb-6">
                    Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Limpiar Todos los Filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {product.image && (
                        <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                          <img
                            src={pb.files.getUrl(product, product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6 space-y-4">
                        <div>
                          {/* Badges */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.isBestSeller && (
                              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">⭐ Más Vendida</span>
                            )}
                            {product.isPopular && (
                              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">🔥 Popular</span>
                            )}
                            {product.isVegan && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">🌱 Vegana</span>
                            )}
                            {product.isGlutenFree && (
                              <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full font-medium">Sin Gluten</span>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-2 cursor-pointer hover:text-primary transition-colors duration-200" onClick={() => navigate(`/product/${product.id}`)}>
                            {product.name}
                          </h3>
                          {product.rating > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">{renderStars(Math.round(product.rating))}</div>
                              <span className="text-sm text-muted-foreground">
                                ({product.reviewCount || 0})
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</p>
                            {product.originalPrice > product.price && (
                              <p className="text-sm text-muted-foreground line-through">€{product.originalPrice.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            addToCart(product);
                            toast.success('¡Agregado al carrito!');
                          }}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Agregar al Carrito
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ShopPage;
