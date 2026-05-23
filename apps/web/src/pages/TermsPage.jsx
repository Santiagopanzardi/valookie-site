import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones - Valookie</title>
        <meta name="description" content="Términos y condiciones de uso y compra en Valookie. Conoce tus derechos y obligaciones al comprar nuestras galletas artesanales." />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{ letterSpacing: '-0.02em' }}>
            Términos y Condiciones
          </h1>
          <p className="text-muted-foreground mb-12">Última actualización: mayo de 2026</p>

          <div className="space-y-10 text-foreground leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-4">1. Información general</h2>
              <p><strong>Valookie</strong> es una empresa de galletas artesanales con domicilio en El Torrent 1, Mataró, Barcelona (08302). Correo electrónico: <a href="mailto:hola@valookie.com" className="text-primary hover:underline">hola@valookie.com</a>. Teléfono: +34 610 485 979.</p>
              <p className="mt-3">El uso de este sitio web y la realización de pedidos implica la aceptación de estos términos y condiciones en su totalidad.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Productos</h2>
              <p>Todos nuestros productos son galletas artesanales elaboradas de forma artesanal. Las imágenes de los productos son orientativas y pueden variar ligeramente del producto final. Nos reservamos el derecho a modificar la disponibilidad de productos sin previo aviso.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Precios</h2>
              <p>Todos los precios mostrados en el sitio web incluyen el IVA aplicable. Los gastos de envío se calculan por separado durante el proceso de compra según el código postal de destino. Nos reservamos el derecho de modificar los precios en cualquier momento, aunque los pedidos confirmados respetarán el precio en el momento de la compra.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Proceso de compra</h2>
              <p className="mb-3">Para realizar un pedido debes:</p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Seleccionar los productos y añadirlos al carrito</li>
                <li>Introducir tus datos de envío</li>
                <li>Seleccionar el método de pago</li>
                <li>Confirmar y pagar el pedido</li>
              </ol>
              <p className="mt-4">Recibirás un correo de confirmación una vez procesado el pedido. El contrato de compraventa se formaliza en el momento en que recibes dicha confirmación.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Envíos y entregas</h2>
              <p className="mb-3">Realizamos envíos a toda España peninsular. Los tiempos de entrega estimados son:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Envío estándar:</strong> 24-48 horas laborables</li>
                <li>Los pedidos realizados antes de las 14:00h se procesan el mismo día</li>
                <li>El envío es gratuito en pedidos superiores a €40</li>
              </ul>
              <p className="mt-4">Los plazos de entrega son orientativos y pueden verse afectados por causas ajenas a Valookie (condiciones meteorológicas, huelgas, etc.).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Devoluciones y reembolsos</h2>
              <p className="mb-3">Dado que nuestros productos son bienes perecederos y personalizables, el derecho de desistimiento general de 14 días no aplica según el artículo 103 del Real Decreto Legislativo 1/2007.</p>
              <p className="mb-3">Sin embargo, aceptamos devoluciones o realizamos reembolsos completos en los siguientes casos:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Producto recibido en mal estado o dañado</li>
                <li>Error en el pedido por nuestra parte</li>
                <li>Producto que no corresponde al pedido realizado</li>
              </ul>
              <p className="mt-4">Para solicitar una devolución, contáctanos en <a href="mailto:hola@valookie.com" className="text-primary hover:underline">hola@valookie.com</a> dentro de las <strong>48 horas</strong> siguientes a la recepción del pedido, adjuntando fotos del producto.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Alérgenos</h2>
              <p>Nuestros productos se elaboran en instalaciones donde se manipulan <strong>gluten, lácteos, huevos y frutos secos</strong>. Aunque indicamos los alérgenos de cada producto, puede existir contaminación cruzada. Si tienes alergias graves, te recomendamos contactarnos antes de realizar tu pedido.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Propiedad intelectual</h2>
              <p>Todos los contenidos de este sitio web (textos, imágenes, logotipos, diseño) son propiedad de Valookie y están protegidos por la legislación vigente en materia de propiedad intelectual. Queda prohibida su reproducción o uso sin autorización expresa.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Responsabilidad</h2>
              <p>Valookie no se hace responsable de los daños o perjuicios derivados del mal uso de los productos, información incorrecta proporcionada por el cliente, o circunstancias fuera de nuestro control (fuerza mayor, fallos de terceros, etc.).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Legislación aplicable</h2>
              <p>Estos términos y condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Mataró (Barcelona), salvo que la normativa aplicable establezca otro fuero.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contacto</h2>
              <p>Para cualquier consulta sobre estos términos, puedes contactarnos en:</p>
              <ul className="list-none pl-0 space-y-1 text-muted-foreground mt-3">
                <li>📧 <a href="mailto:hola@valookie.com" className="text-primary hover:underline">hola@valookie.com</a></li>
                <li>📞 +34 610 485 979</li>
                <li>📍 El Torrent 1, Mataró, Barcelona (08302)</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TermsPage;
