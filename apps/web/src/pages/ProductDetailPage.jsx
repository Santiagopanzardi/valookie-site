
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Star, Heart, Plus, Minus, ShoppingCart, CheckCircle2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductReviews from '@/components/ProductReviews.jsx';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/hooks/useCart.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  useEffect(() => {
    fetchProduct();
    if (isAuthenticated) {
      checkWishlist();
    }
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      const data = await pb.collection('products').getOne(id, { $autoCancel: false });
      setProduct(data);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      toast.error('Producto no encontrado.');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const wishlist = await pb.collection('wishlist').getFullList({
        filter: `userId = "${currentUser.id}" && productId = "${id}"`,
        $autoCancel: false
      });
      if (wishlist.length > 0) {
        setIsWishlisted(true);
        setWishlistId(wishlist[0].id);
      }
    } catch (error) {
      console.error('Error al comprobar favoritos:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Por favor, inicia sesión para agregar artículos a tus favoritos.');
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await pb.collection('wishlist').delete(wishlistId, { $autoCancel: false });
        setIsWishlisted(false);
        setWishlistId(null);
        toast.success('Eliminado de favoritos');
      } else {
        const record = await pb.collection('wishlist').create({
          userId: currentUser.id,
          productId: id
        }, { $autoCancel: false });
        setIsWishlisted(true);
        setWishlistId(record.id);
        toast.success('¡Agregado a favoritos!');
      }
    } catch (error) {
      toast.error('Error al actualizar favoritos. Por favor, inténtalo de nuevo.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`¡Agregado ${quantity} ${quantity === 1 ? 'artículo' : 'artículos'} al carrito!`);
    setQuantity(1); // Reset quantity after adding
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Horneando detalles del producto...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Valookie`}</title>
        <meta name="description" content={product.description || `Compra ${product.name} en Valookie. Cookies artesanales hechas con amor en Barcelona.`} />
      </Helmet>

      <Header />

      <main className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Button 
            variant="ghost" 
            className="mb-8 pl-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate('/shop')}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver a la tienda
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Product Image Section */}
            <div className="bg-secondary/10 rounded-[2rem] overflow-hidden p-6 lg:p-10 flex items-center justify-center relative shadow-sm border border-border/50">
              {hasDiscount && (
                <div className="absolute top-6 left-6 z-10">
                  <Badge className="bg-destructive text-destructive-foreground text-sm font-bold uppercase px-3 py-1 shadow-md">
                    Oferta Especial
                  </Badge>
                </div>
              )}
              {product.image ? (
                <img
                  src={pb.files.getUrl(product, product.image)}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="aspect-square w-full bg-muted/30 rounded-2xl flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                  <span>Imagen no disponible</span>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-balance text-foreground tracking-tight leading-tight">
                  {product.name}
                </h1>
                
                {product.rating > 0 && (
                  <div className="flex items-center gap-3 mb-6 bg-secondary/20 inline-flex px-4 py-2 rounded-full">
                    <div className="flex">{renderStars(Math.round(product.rating))}</div>
                    <span className="text-lg font-bold text-foreground">{product.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground font-medium">
                      ({product.reviewCount || 0} {product.reviewCount === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </div>
                )}

                {/* Price Display with Discount Logic */}
                <div className="mb-6">
                  {hasDiscount ? (
                    <div className="flex items-end gap-4">
                      <p className="text-5xl font-extrabold text-primary tracking-tight">
                        €{product.price.toFixed(2)}
                      </p>
                      <span className="text-2xl text-muted-foreground line-through font-medium mb-1">
                        €{product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-5xl font-extrabold text-primary tracking-tight">
                      €{product.price.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Short excerpt description */}
                {product.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-secondary/10 px-4 py-3 rounded-xl border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Horneado fresco a diario
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-secondary/10 px-4 py-3 rounded-xl border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Ingredientes 100% naturales
                </div>
              </div>

              {/* Actions Box */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center justify-between w-full sm:w-auto bg-secondary/30 rounded-xl border border-border/50 p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-12 h-12 rounded-lg hover:bg-background transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-12 h-12 rounded-lg hover:bg-background transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    size="lg"
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    Añadir al Carrito
                  </Button>

                  <Button
                    onClick={toggleWishlist}
                    variant="outline"
                    size="icon"
                    title={isWishlisted ? "Eliminar de Favoritos" : "Agregar a Favoritos"}
                    className={`w-14 h-14 rounded-xl border-2 transition-all duration-200 ${isWishlisted ? 'bg-primary/10 border-primary text-primary' : 'hover:border-primary/50'}`}
                  >
                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-primary' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description and Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20 pt-16 border-t border-border/50">
            <div className="lg:col-span-2 space-y-12">
              {product.description && (
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Descripción del Producto</h2>
                  <div className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed text-balance">
                    {product.description.split('\n').map((paragraph, index) => (
                      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null
                    ))}
                  </div>
                </section>
              )}

              {product.ingredients && (
                <section className="bg-secondary/10 p-8 rounded-3xl border border-border/50">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    Ingredientes Destacados
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.ingredients}
                  </p>
                </section>
              )}
            </div>

            <div className="lg:col-span-1">
              {product.allergens && (
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm sticky top-28">
                  <h2 className="text-xl font-bold mb-4">Información de Alérgenos</h2>
                  <div className="bg-destructive/10 text-destructive-foreground p-4 rounded-2xl border border-destructive/20">
                    <p className="font-medium text-destructive">
                      Atención: Contiene los siguientes alérgenos.
                    </p>
                    <p className="mt-2 text-sm text-destructive/90 leading-relaxed font-semibold">
                      {product.allergens}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
                    Nuestras cookies se preparan en instalaciones que procesan nueces, lácteos y gluten. Puede haber contaminación cruzada.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20 pt-16 border-t border-border/50">
            <ProductReviews productId={id} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetailPage;
