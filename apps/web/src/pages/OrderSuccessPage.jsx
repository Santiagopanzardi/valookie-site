import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useCart } from '@/hooks/useCart.js';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <>
      <Helmet>
        <title>¡Pedido confirmado! - Valookie</title>
      </Helmet>

      <Header />

      <main className="min-h-[70vh] flex items-center justify-center py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-14 h-14 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{ letterSpacing: '-0.02em' }}>
              ¡Pedido confirmado!
            </h1>

            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando con mucho amor.
            </p>

            <p className="text-muted-foreground mb-10">
              Recibirás un correo de confirmación con los detalles de tu pedido y el seguimiento del envío.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/shop')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                Seguir comprando
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
              >
                Ir al inicio
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderSuccessPage;
