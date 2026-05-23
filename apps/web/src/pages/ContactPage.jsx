
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contacto - Valookie</title>
        <meta name="description" content="Ponte en contacto con Valookie. Estamos aquí para responder tus preguntas sobre nuestras galletas artesanales, pedidos y solicitudes especiales." />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
              Ponte en contacto
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes una pregunta o deseas hacer un pedido personalizado? ¡Nos encantaría saber de ti!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="bg-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white text-gray-900 placeholder:text-gray-500"
                      placeholder="Tu nombre"
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
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-white text-gray-900 placeholder:text-gray-500"
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    {loading ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dirección</h3>
                      <p className="text-muted-foreground">
                        Barcelona, España<br />
                        08001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                      <a
                        href="mailto:hello@valookie.com"
                        className="text-primary hover:underline"
                      >
                        hello@valookie.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <a
                        href="tel:+34123456789"
                        className="text-primary hover:underline"
                      >
                        +34 123 456 789
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horario de atención</h3>
                      <p className="text-muted-foreground">
                        Lunes - Viernes: 9:00 AM - 6:00 PM<br />
                        Sábado: 10:00 AM - 4:00 PM<br />
                        Domingo: Cerrado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Pedidos personalizados</h3>
                <p className="text-foreground leading-relaxed mb-4">
                  ¿Planeas un evento especial o necesitas galletas para tu negocio? Ofrecemos cajas de galletas personalizadas y pedidos al por mayor para bodas, eventos corporativos y celebraciones.
                </p>
                <p className="text-foreground leading-relaxed">
                  ¡Contáctanos para discutir tus necesidades y crearemos algo especial solo para ti!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;
