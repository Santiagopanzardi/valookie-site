
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Award, Leaf, Users } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Hechas con amor',
      description: 'Cada galleta es elaborada a mano con cuidado y pasión por nuestro dedicado equipo de panaderos en Barcelona.'
    },
    {
      icon: Award,
      title: 'Calidad premium',
      description: 'Utilizamos solo los mejores ingredientes provenientes de proveedores de confianza para asegurar un sabor y calidad excepcionales.'
    },
    {
      icon: Leaf,
      title: 'Ingredientes naturales',
      description: 'Sin conservantes ni aditivos artificiales. Solo ingredientes puros y naturales que puedes saborear en cada bocado.'
    },
    {
      icon: Users,
      title: 'Enfoque en la comunidad',
      description: 'Creemos en construir relaciones con nuestros clientes y en apoyar a nuestra comunidad local.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Nosotros - Valookie</title>
        <meta name="description" content="Aprende sobre la historia de Valookie, nuestra misión y compromiso para crear las mejores galletas artesanales en Barcelona." />
      </Helmet>

      <Header />

      <main>
        <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-accent/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance" style={{letterSpacing: '-0.02em'}}>
                Nuestra historia
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Valookie nació de una simple pasión: crear galletas que aporten alegría a cada momento. Lo que comenzó como un pequeño experimento de cocina en Barcelona se ha convertido en una marca amada y reconocida por su calidad excepcional y sabores inolvidables.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6 text-balance" style={{letterSpacing: '-0.02em'}}>
                  Elaborado con pasión
                </h2>
                <p className="text-lg text-foreground leading-relaxed mb-4">
                  Cada galleta Valookie es un trabajo de amor. Nuestros panaderos se levantan antes del amanecer para preparar lotes frescos utilizando técnicas tradicionales pasadas de generación en generación, combinadas con sabores innovadores que sorprenden y deleitan.
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  Creemos que las mejores galletas provienen de los mejores ingredientes. Por eso obtenemos chocolate premium, harina orgánica y mantequilla fresca de proveedores locales que comparten nuestro compromiso con la calidad.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-secondary/30 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold mb-4">Nuestra misión</h3>
                <p className="text-foreground leading-relaxed mb-4">
                  Crear momentos de felicidad a través de galletas excepcionales que celebren la calidad, la creatividad y el simple placer de un postre perfectamente horneado.
                </p>
                <p className="text-foreground leading-relaxed">
                  Estamos comprometidos con la sostenibilidad, con el apoyo a las comunidades locales y con hacer que cada cliente se sienta parte de la familia Valookie.
                </p>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
                  Nuestros valores
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Estos principios guían todo lo que hacemos, desde el desarrollo de recetas hasta el servicio al cliente.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl p-6 text-center"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
              </div>
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
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance" style={{letterSpacing: '-0.02em'}}>
                Únete a la familia Valookie
              </h2>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                Somos más que una empresa de galletas. Somos una comunidad de personas que creen que los momentos más dulces de la vida merecen los mejores sabores. Gracias por ser parte de nuestro viaje.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
