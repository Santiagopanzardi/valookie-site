
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import NewsletterSignup from '@/components/NewsletterSignup.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/hooks/useCart.js';

const GoogleIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const ReviewCard = ({ review, index, renderStars }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-card rounded-2xl p-6 h-full flex flex-col"
  >
    <div className="flex items-center gap-3 mb-3">
      {review.photo && (
        <img src={review.photo} alt={review.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
      )}
      <div>
        <span className="font-medium block">{review.name}</span>
        <div className="flex">{renderStars(review.rating)}</div>
      </div>
    </div>
    <p className="text-foreground leading-relaxed mb-4 text-sm line-clamp-5 flex-1">{review.text}</p>
    <div className="flex justify-between items-center">
      <a href={review.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
        <GoogleIcon /> Google
      </a>
      <span className="text-xs text-muted-foreground">
        {new Date(review.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    </div>
  </motion.div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [googleReviews, setGoogleReviews] = useState([]);
  const [googleRating, setGoogleRating] = useState(null);
  const [googleTotal, setGoogleTotal] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchGoogleReviews();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const products = await pb.collection('products').getFullList({
        filter: 'isFeatured = true',
        sort: '-createdAt',
        $autoCancel: false
      });
      setFeaturedProducts(products.slice(0, 6));
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoogleReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setGoogleReviews(data.reviews || []);
      setGoogleRating(data.rating);
      setGoogleTotal(data.totalReviews);
    } catch (error) {
      console.error('Error al cargar reseñas de Google:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-primary text-primary' : 'text-gray-300'}`} />
    ));
  };

  return (
    <>
      <Helmet>
        <title>Valookie - Galletas Artesanales Hechas con Amor</title>
        <meta name="description" content="Descubre las deliciosas galletas artesanales de Valookie hechas en España. Ingredientes premium, sabores únicos, entregadas frescas en tu puerta." />
      </Helmet>

      <Header />

      <main>
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Imagen de fondo */}
          <div className="absolute inset-0">
            <img
              src="/hero-cookies.jpg"
              alt="Cookies Valookie"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <img
                src="https://horizons-cdn.hostinger.com/20aebe59-367d-486d-b6c5-8fc8284b40e6/fe61320c4da2579ac9246cab93342189.png"
                alt="Valookie"
                className="h-32 w-auto mx-auto mb-6"
              />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white text-balance" style={{letterSpacing: '-0.02em'}}>
                Las Cookies Más <span className="text-primary">Brutales</span> de Mataró
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Descubre Valookie: Cookies gigantes, tiernas y llenas de sabor. Desde la clásica Nutella hasta Red Velvet, enviamos felicidad a tu puerta en 24/48h
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/shop')}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8"
                >
                  Comprar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => navigate('/about')}
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-white/10 text-white border-white/40 hover:bg-white/20"
                >
                  Nuestra Historia
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
                Galletas Destacadas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubre nuestras creaciones más amadas, horneadas frescas a diario con los mejores ingredientes.
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {product.image && (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={pb.files.getUrl(product, product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
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
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/product/${product.id}`)}
                          variant="outline"
                          className="flex-1"
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          onClick={() => {
                            addToCart(product);
                            toast.success('¡Agregado al carrito!');
                          }}
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Agregar al Carrito
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button
                onClick={() => navigate('/shop')}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Ver Todos los Productos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{ letterSpacing: '-0.02em' }}>
                Lo que dicen nuestros clientes
              </h2>
              {googleRating && (
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="flex">{renderStars(Math.round(googleRating))}</div>
                  <span className="text-2xl font-bold">{googleRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({googleTotal} reseñas en Google)</span>
                </div>
              )}
              <a
                href="https://www.google.com/maps/place/Valookie+-+Cookies+estilo+New+York+en+Matar%C3%B3/@41.5405146,2.4377717,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Ver todas las reseñas en Google Maps
              </a>
            </motion.div>

            {googleReviews.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {googleReviews.slice(0, 3).map((review, index) => (
                    <ReviewCard key={index} review={review} index={index} renderStars={renderStars} />
                  ))}
                </div>
                {googleReviews.length > 3 && (
                  <div className="flex flex-col md:flex-row justify-center gap-6">
                    {googleReviews.slice(3).map((review, index) => (
                      <div key={index + 3} className="w-full md:w-[calc(33.333%-12px)]">
                        <ReviewCard review={review} index={index + 3} renderStars={renderStars} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
                Obtén ofertas exclusivas
              </h2>
              <p className="text-lg mb-8 opacity-90">
                ¡Suscríbete a nuestro boletín y sé el primero en conocer nuevos sabores, promociones especiales y secretos de nuestras galletas!
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterSignup />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-10 bg-white border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <img
              src="/subvencio-logos.webp"
              alt="Generalitat de Catalunya - Cofinançat per la Unió Europea - Ministerio de Trabajo - SEPE - Sistema Nacional de Garantía Juvenil"
              className="mx-auto max-w-full h-auto mb-4"
              style={{ maxHeight: '60px' }}
            />
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Aquesta actuació està impulsada i subvencionada pel Departament d'Empresa i Treball i cofinançada per la Unió Europea mitjançant el Fons Social Europeu Plus.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
