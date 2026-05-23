
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy, categoryFilter]);

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

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

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

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar galletas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                <SelectItem value="cookie_type">Tipo de Galleta</SelectItem>
                <SelectItem value="pack_size">Tamaño del Paquete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="popularity">Más Populares</SelectItem>
                <SelectItem value="rating">Mejor Calificadas</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              <p className="text-muted-foreground mb-6">Intenta ajustar tu búsqueda o filtros</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Limpiar Filtros
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
