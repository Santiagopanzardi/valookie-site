import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Nosotros - Valookie</title>
        <meta name="description" content="Conoce la historia de Valookie. Somos Valentina y Santiago, pareja y emprendedores que abrieron su local de cookies artesanales en Mataró en diciembre de 2025." />
      </Helmet>

      <Header />

      <main>

        {/* Hero */}
        <section className="relative bg-secondary/20 py-20 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                Nuestra <span className="text-primary">Historia</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Un sueño de infancia, una pareja con ganas de comerse el mundo y las cookies más brutales de Mataró.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Val y Santi + historia */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img
                  src="/val-santi.png"
                  alt="Valentina y Santiago, fundadores de Valookie"
                  className="w-full max-w-sm mx-auto rounded-3xl shadow-xl object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Quiénes somos</p>
                  <h2 className="text-4xl font-bold mb-4 text-balance" style={{ letterSpacing: '-0.02em' }}>
                    Valentina y Santiago
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Somos pareja en la vida y en el negocio. Dos personas que pusieron todo su corazón en crear algo propio desde cero.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Valookie</strong> nació del sueño de infancia de Vale de ser pastelera. El nombre lo dice todo: <em>Val</em> de Valentina y <em>ookie</em> de cookie, nuestro producto estrella. Personal, nuestro y con olor a recién horneado.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Las cookies las hace Vale de forma autodidacta pero con una base muy sólida: trabajó en grandes hoteles en Francia, donde adquirió una experiencia y un nivel que se nota en cada mordisco.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* El local */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6 order-2 lg:order-1"
              >
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Nuestro local</p>
                  <h2 className="text-4xl font-bold mb-4 text-balance" style={{ letterSpacing: '-0.02em' }}>
                    Un proyecto que llegó con todo
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  El 15 de diciembre de 2025 abrimos las puertas de nuestro local en Mataró. Un proyecto que tardó en llegar, pero llegó con todo.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Todos nuestros productos los elaboramos nosotros de forma completamente artesanal. Nada de industrial, nada de atajos. Solo ingredientes de calidad, tiempo y mucho amor.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Puedes visitarnos en <strong className="text-foreground">C/ El Torrent 1, Mataró</strong> o hacer tu pedido online y recibirlo en casa en 24/48h.
                </p>
                <Button
                  onClick={() => navigate('/contact')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  Visítanos o escríbenos
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <img
                  src="/local-valookie.jpg"
                  alt="Local de Valookie en Mataró"
                  className="w-full rounded-3xl shadow-xl object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                Lo que nos mueve
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cada detalle de Valookie está pensado para que tu experiencia sea especial.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Star className="w-7 h-7 text-primary" />,
                  title: "Calidad sin compromisos",
                  text: "Ingredientes premium, procesos artesanales y cero atajos. Así de simple."
                },
                {
                  icon: <Heart className="w-7 h-7 text-primary" />,
                  title: "Hecho con amor",
                  text: "Cada cookie sale de nuestras manos y lleva dentro el sueño que nos trajo hasta aquí."
                },
                {
                  icon: <Users className="w-7 h-7 text-primary" />,
                  title: "Trato cercano",
                  text: "Somos Val y Santi, no una cadena. Queremos conocerte y que te sientas como en casa."
                },
                {
                  icon: <Clock className="w-7 h-7 text-primary" />,
                  title: "Siempre frescos",
                  text: "Elaboramos a diario para que cada bocado sea exactamente como tiene que ser."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Horario */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                Horario
              </h2>
              <p className="text-lg text-muted-foreground">
                Puedes visitarnos en tienda o pedir online cuando quieras.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border max-w-lg mx-auto"
            >
              <div className="space-y-4">
                {[
                  { days: "Lunes, miércoles, jueves y viernes", hours: "9:00–13:00 y 16:30–20:00" },
                  { days: "Sábado y domingo", hours: "10:00–14:00 y 16:30–20:00" },
                  { days: "Martes", hours: "Cerrado", closed: true },
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between items-center py-3 ${i < 2 ? 'border-b border-border' : ''}`}>
                    <span className="font-medium text-foreground">{item.days}</span>
                    <span className={`text-sm font-semibold ${item.closed ? 'text-muted-foreground' : 'text-primary'}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                ¿Tienes un evento especial?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Hacemos pedidos personalizados para bodas, cumpleaños y eventos corporativos. Escríbenos y preparamos algo único para ti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/shop')}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold"
                >
                  Ver nuestras cookies
                </Button>
                <Button
                  onClick={() => navigate('/contact')}
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
                >
                  Contactar
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
