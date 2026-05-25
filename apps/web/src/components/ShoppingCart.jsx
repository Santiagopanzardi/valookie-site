
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ShoppingCart as CartIcon, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart.js';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const ShoppingCart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-all duration-200 hover:bg-secondary/50">
          <CartIcon className="w-5 h-5" />
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              {getCartCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background border-l">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <CartIcon className="w-6 h-6" />
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6 overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <CartIcon className="w-12 h-12 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground mb-8">¡Añade algunas deliciosas cookies para empezar!</p>
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate('/shop');
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8"
              >
                Explorar Tienda
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-xl overflow-hidden">
                      {item.image ? (
                        <img
                          src={pb.files.getUrl(item, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CartIcon className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-semibold text-base truncate pr-6" title={item.name}>{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-primary font-bold text-lg">€{item.price.toFixed(2)}</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              €{item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-secondary/20 rounded-lg p-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-md hover:bg-background"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-md hover:bg-background"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t bg-background pt-6 mt-4 pb-2 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Artículos en total:</span>
                    <span>{getCartCount()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Subtotal:</span>
                    <span className="text-primary text-2xl">€{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 transition-transform duration-200 rounded-xl shadow-md"
                  size="lg"
                >
                  Ir al Pago
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  El envío y los impuestos se calcularán en el siguiente paso.
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
