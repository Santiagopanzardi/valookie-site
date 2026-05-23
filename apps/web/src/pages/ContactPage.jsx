
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Mail, Phone, MapPin, Clock, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('¡Mensaje enviado! Nos pondremos en contacto pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      toast.error('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contacto - Valookie</title>
        <meta name="description" content="Ponte en contacto con Valookie. Estamos en Mataró, Barcelona. Escríbenos para pedidos personalizados, dudas o lo que necesites." />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
              Ponte en contacto
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes una pregunta o quieres un pedido especial? ¡Escríbenos!
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
                        C/ El Torrent 1<br />
                        Mataró, Barcelona
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                      <a href="mailto:hola@valookie.com" className="text-primary hover:underline">
                        hola@valookie.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono / WhatsApp</h3>
                      <a href="tel:+34610485979" className="text-primary hover:underline">
                        +34 610 485 979
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horario de pedidos online</h3>
                      <p className="text-muted-foreground">
                        Lunes – Viernes: 9:00 – 20:00<br />
                        Sábado: 10:00 – 18:00<br />
                        Domingo: Cerrado
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Redes sociales</h3>
                      <div className="flex flex-col gap-1">
                        <a
                          href="https://www.instagram.com/valookie.cookies"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Instagram className="w-4 h-4" /> @valookie.cookies
                        </a>
                        <a
                          href="https://www.tiktok.com/@valookie.cookies"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <TikTokIcon /> @valookie.cookies
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="rounded-2xl overflow-hidden border">
                <iframe
                  title="Valookie en Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2982.3!2d2.4426!3d41.5401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a4b028a4ece7%3A0x8bafe78bf850446a!2sValookie!5e0!3m2!1ses!2ses!4v1716000000000!5m2!1ses!2ses"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="bg-secondary/30 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Pedidos personalizados</h3>
                <p className="text-foreground leading-relaxed mb-4">
                  ¿Planeas una boda, cumpleaños o evento corporativo? Hacemos cajas de galletas personalizadas para cualquier ocasión.
                </p>
                <p className="text-foreground leading-relaxed">
                  Escríbenos por WhatsApp o email y te preparamos un presupuesto sin compromiso.
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
