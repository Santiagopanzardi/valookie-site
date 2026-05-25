
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Wishlist from '@/components/Wishlist.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.js';
import pb from '@/lib/pocketbaseClient';

const WishlistPage = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const items = await pb.collection('wishlist').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false
      });

      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          try {
            const product = await pb.collection('products').getOne(item.productId, { $autoCancel: false });
            return { ...item, product };
          } catch (error) {
            console.error('Error al cargar el producto:', error);
            return null;
          }
        })
      );

      setWishlistItems(itemsWithProducts.filter(item => item !== null));
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      toast.error('Error al cargar la lista de favoritos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistId) => {
    try {
      await pb.collection('wishlist').delete(wishlistId, { $autoCancel: false });
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));
      toast.success('Eliminado de favoritos');
    } catch (error) {
      toast.error('Error al eliminar el artículo. Por favor, inténtalo de nuevo.');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('¡Agregado al carrito!');
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Mis Favoritos - Valookie</title>
        <meta name="description" content="Visualiza y gestiona tus cookies Valookie favoritas." />
      </Helmet>

      <Header />

      <main className="py-12 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
              Mis favoritos
            </h1>
            <p className="text-lg text-muted-foreground">
              Tus cookies favoritas, guardadas para después
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Wishlist
              wishlistItems={wishlistItems}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
};

export default WishlistPage;
