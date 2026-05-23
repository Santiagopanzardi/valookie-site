
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { CreditCard, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShippingCalculator from '@/components/ShippingCalculator.jsx';
import { useCart } from '@/hooks/useCart.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const [shippingInfo, setShippingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    postalCode: currentUser?.postalCode || '',
    phone: currentUser?.phone || ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }

    if (!shippingInfo) {
      toast.error('Por favor, calcula el costo de envío primero.');
      return;
    }

    setLoading(true);

    try {
      const cartWithImages = cart.map(item => ({
        ...item,
        imageUrl: item.image ? pb.files.getUrl(item, item.image) : null,
      }));

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cartWithImages,
          shippingCost: shippingInfo.isFree ? 0 : shippingInfo.cost,
          customerEmail: formData.email,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
          successUrl: `${window.location.origin}/order-success`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear la sesión de pago');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error('Error al procesar el pago. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shippingCost = shippingInfo?.cost || 0;
  const total = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">¡Añade algunas deliciosas galletas para empezar!</p>
            <Button
              onClick={() => navigate('/shop')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Explorar Productos
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Finalizar Compra - Valookie</title>
        <meta name="description" content="Completa tu pedido en Valookie. Pago rápido y seguro con múltiples opciones de pago." />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-balance" style={{letterSpacing: '-0.02em'}}>
            Finalizar Compra
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Información de envío</h2>
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="bg-white text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="bg-white text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <Separator />

                  <ShippingCalculator
                    orderTotal={subtotal}
                    onShippingCalculated={setShippingInfo}
                  />

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Método de pago</h3>
                    <div className="bg-muted/30 rounded-xl p-4 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <span className="text-muted-foreground">Pago seguro con tarjeta — procesado por Stripe</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !shippingInfo}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    {loading ? 'Redirigiendo al pago...' : `Pagar €${total.toFixed(2)}`}
                  </Button>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-card rounded-2xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Resumen del pedido</h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image && (
                        <img
                          src={pb.files.getUrl(item, item.image)}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">€{(item.price * item.quantity).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive ml-1"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-medium">
                      {shippingInfo ? (
                        shippingInfo.isFree ? (
                          <span className="text-accent">GRATIS</span>
                        ) : (
                          `€${shippingCost.toFixed(2)}`
                        )
                      ) : (
                        'Calcula el envío'
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;
