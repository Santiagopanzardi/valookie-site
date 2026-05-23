
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

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
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

  const testimonials = [
    {
      name: 'Maya Chen',
      rating: 5,
      text: '¡Estas galletas son absolutamente divinas! El sabor a matcha está perfectamente equilibrado y no es demasiado dulce.',
      date: '2026-04-12'
    },
    {
      name: 'Lucia Torres',
      rating: 5,
      text: 'Las mejores galletas que he probado. El empaque es hermoso y llegaron frescas y deliciosas.',
      date: '2026-04-08'
    },
    {
      name: 'Raj Patel',
      rating: 5,
      text: 'Las pedí para una fiesta y a todos les encantaron. ¡Definitivamente volveré a pedir!',
      date: '2026-03-28'
    }
  ];

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
        <title>Valookie - Galletas Artesanales Hechas con Amor</title>
        <meta name="description" content="Descubre las deliciosas galletas artesanales de Valookie hechas en España. Ingredientes premium, sabores únicos, entregadas frescas en tu puerta." />
      </Helmet>

      <Header />

      <main>
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-accent/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,0,24,0.1),transparent_50%)]"></div>
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
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
                ¡Amantes de las <span className="text-primary">galletas!</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Galletas artesanales hechas con ingredientes premium en Barcelona. Cada bocado es una celebración de sabor y calidad.
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
                  className="text-lg px-8"
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Únete a miles de amantes de las galletas en toda España
              </p>
            </motion.div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 break-inside-avoid"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                  </div>
                  <p className="text-foreground leading-relaxed mb-4">{testimonial.text}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{testimonial.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(testimonial.date).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
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
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
