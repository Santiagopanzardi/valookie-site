
import React from 'react';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const FAQPage = () => {
  const faqs = [
    {
      question: '¿Qué ingredientes utilizan en sus galletas?',
      answer: 'Utilizamos solo ingredientes naturales y de primera calidad, que incluyen harina orgánica, mantequilla real, chocolate de alta calidad y huevos frescos. Todos nuestros ingredientes provienen de proveedores de confianza que comparten nuestro compromiso con la calidad. Nunca utilizamos conservantes, colorantes ni sabores artificiales.'
    },
    {
      question: '¿Ofrecen opciones libres de alérgenos?',
      answer: '¡Sí! Ofrecemos varias opciones amigables para alérgicos, incluyendo galletas sin gluten, sin lácteos y sin nueces. Cada página de producto enumera claramente todos los alérgenos. Sin embargo, ten en cuenta que todas nuestras galletas se preparan en instalaciones que procesan nueces, lácteos y gluten, por lo que puede haber contaminación cruzada.'
    },
    {
      question: '¿Cuánto tiempo se mantienen frescas las galletas?',
      answer: 'Nuestras galletas se hornean frescas y se mantienen deliciosas hasta por 2 semanas cuando se guardan en un recipiente hermético a temperatura ambiente. Para conservarlas más tiempo, puedes congelarlas hasta por 3 meses. Recomendamos disfrutarlas durante la primera semana para obtener el mejor sabor y textura.'
    },
    {
      question: '¿Cuáles son sus tiempos de entrega?',
      answer: 'Ofrecemos envíos a toda España con un tiempo de entrega estimado de 24-48 horas para la mayoría de las ubicaciones. Los pedidos realizados antes de las 2:00 p.m. suelen procesarse el mismo día. Recibirás un número de seguimiento una vez que tu pedido sea enviado para que puedas monitorear su progreso.'
    },
    {
      question: '¿Ofrecen envío gratuito?',
      answer: '¡Sí! Ofrecemos envío gratuito en todos los pedidos superiores a €40. Para pedidos menores a €40, los costos de envío varían según tu ubicación y se calculan en la caja al ingresar tu código postal.'
    },
    {
      question: '¿Cuál es su política de devoluciones?',
      answer: 'Queremos que estés completamente satisfecho con tu compra. Si recibes galletas dañadas o no estás contento con tu pedido, por favor contáctanos dentro de las 48 horas posteriores a la entrega. Coordinaremos un reemplazo o reembolso completo. Debido a la naturaleza perecedera de nuestros productos, no podemos aceptar devoluciones de paquetes abiertos.'
    },
    {
      question: '¿Puedo personalizar mi pedido?',
      answer: '¡Por supuesto! Ofrecemos cajas de galletas personalizadas para ocasiones especiales, regalos corporativos y eventos. Contáctanos a hello@valookie.com con tus requerimientos y nuestro equipo trabajará contigo para crear el pedido personalizado perfecto.'
    },
    {
      question: '¿Hacen envíos internacionales?',
      answer: 'Actualmente, solo enviamos dentro de España para asegurar que nuestras galletas lleguen frescas y en perfectas condiciones. Estamos trabajando para expandir nuestras opciones de envío y esperamos ofrecer entrega internacional en el futuro.'
    },
    {
      question: '¿Cómo debo guardar mis galletas?',
      answer: 'Guarda tus galletas Valookie en un recipiente hermético a temperatura ambiente, lejos de la luz solar directa y el calor. Esto las mantendrá frescas y conservará su textura. Evita refrigerar las galletas ya que esto puede hacer que se sequen y endurezcan.'
    },
    {
      question: '¿Sus galletas son aptas para veganos?',
      answer: 'Actualmente ofrecemos una selección limitada de galletas veganas hechas sin ningún producto de origen animal. Estas están marcadas claramente en nuestro sitio web. Trabajamos continuamente para expandir nuestra línea vegana y ofrecer más opciones deliciosas basadas en plantas.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Preguntas Frecuentes - Valookie</title>
        <meta name="description" content="Encuentra respuestas a preguntas frecuentes sobre las galletas Valookie, ingredientes, entregas, alérgenos y más." />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
              Preguntas Frecuentes
            </h1>
            <p className="text-lg text-muted-foreground">
              Todo lo que necesitas saber sobre nuestras galletas, entregas y más.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 bg-secondary/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">¿Aún tienes preguntas?</h2>
            <p className="text-muted-foreground mb-6">
              ¿No encuentras la respuesta que buscas? Nuestro equipo de servicio al cliente está aquí para ayudar.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-all duration-200"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FAQPage;
