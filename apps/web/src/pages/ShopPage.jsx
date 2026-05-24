
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Star, Search, Filter, X } from 'lucide-react';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
              Comprar todas las galletas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Descubre nuestra colección completa de galletas artesanales hechas con amor en Barcelona
            </p>
          </div>

          {/* Desktop: Search + Filter Button */}
          <div className="hidden md:flex gap-4 mb-6">
            <div className="relative flex-1">
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

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                  {(selectedAllergens.length > 0 || categoryFilter !== 'all' ||
                    priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                    <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">
                      {selectedAllergens.length +
                        (categoryFilter !== 'all' ? 1 : 0) +
                        (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[350px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros y Ordenamiento</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
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
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile: Search + Filter Button */}
          <div className="flex md:hidden gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Filter className="w-5 h-5" />
                  {(selectedAllergens.length > 0 || categoryFilter !== 'all' ||
                    priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {selectedAllergens.length +
                        (categoryFilter !== 'all' ? 1 : 0) +
                        (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
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
                </div>
              </SheetContent>
            </Sheet>
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

          {/* Results Count */}
          {!loading && (
            <div className="mb-4 text-sm text-muted-foreground">
              Mostrando {filteredProducts.length} de {products.length} productos
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <p className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</p>
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
      </main>

      <Footer />
    </>
  );
};

export default ShopPage;
