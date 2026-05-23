
import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Star, Trash2, ShoppingCart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const Wishlist = ({ wishlistItems, onRemove, onAddToCart }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
      />
    ));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Tu lista de favoritos está vacía</h2>
        <p className="text-muted-foreground mb-6">¡Comienza a agregar tus galletas favoritas!</p>
        <Button
          onClick={() => window.location.href = '/shop'}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Explorar Productos
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((item) => (
        <div key={item.id} className="bg-card rounded-2xl overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl">
          {item.product?.image && (
            <div className="aspect-square overflow-hidden">
              <img
                src={pb.files.getUrl(item.product, item.product.image)}
                alt={item.product.name}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{item.product?.name}</h3>
              {item.product?.rating > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{renderStars(Math.round(item.product.rating))}</div>
                  <span className="text-sm text-muted-foreground">
                    ({item.product.reviewCount || 0})
                  </span>
                </div>
              )}
              <p className="text-2xl font-bold text-primary">€{item.product?.price.toFixed(2)}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onAddToCart(item.product)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar al Carrito
              </Button>
              <Button
                onClick={() => onRemove(item.id)}
                variant="outline"
                size="icon"
                title="Eliminar de Favoritos"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
