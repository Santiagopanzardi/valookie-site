import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad - Valookie</title>
        <meta name="description" content="Política de privacidad de Valookie. Cómo recopilamos, usamos y protegemos tu información personal." />
      </Helmet>

      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{ letterSpacing: '-0.02em' }}>
            Política de Privacidad
          </h1>
          <p className="text-muted-foreground mb-12">Última actualización: mayo de 2026</p>

          <div className="space-y-10 text-foreground leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-4">1. Responsable del tratamiento</h2>
              <p>El responsable del tratamiento de tus datos personales es <strong>Valookie</strong>, con domicilio en El Torrent 1, Mataró, Barcelona (08302) y correo electrónico de contacto: <a href="mailto:hola@valookie.com" className="text-primary hover:underline">hola@valookie.com</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Datos que recopilamos</h2>
              <p className="mb-3">Recopilamos los siguientes datos personales cuando realizas un pedido, te registras o nos contactas:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección postal de envío</li>
                <li>Historial de pedidos</li>
                <li>Datos de navegación y cookies técnicas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Finalidad del tratamiento</h2>
              <p className="mb-3">Utilizamos tus datos para:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Gestionar y procesar tus pedidos</li>
                <li>Enviarte confirmaciones y actualizaciones de tu pedido</li>
                <li>Gestionar tu cuenta de usuario</li>
                <li>Responderte cuando nos contactas</li>
                <li>Enviarte nuestro boletín informativo (solo si te has suscrito voluntariamente)</li>
                <li>Cumplir con nuestras obligaciones legales y fiscales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Base legal del tratamiento</h2>
              <p>El tratamiento de tus datos se basa en la ejecución del contrato de compraventa, tu consentimiento expreso para comunicaciones comerciales, y el cumplimiento de obligaciones legales según el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Conservación de datos</h2>
              <p>Conservamos tus datos durante el tiempo necesario para cumplir la finalidad para la que fueron recogidos y para atender posibles responsabilidades legales. Los datos de pedidos se conservan durante un mínimo de 5 años por obligaciones fiscales.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cesión de datos a terceros</h2>
              <p>No vendemos ni cedemos tus datos a terceros. Únicamente compartimos la información estrictamente necesaria con:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Empresas de transporte y mensajería para la entrega de tus pedidos</li>
                <li>Pasarelas de pago para procesar transacciones de forma segura</li>
                <li>Proveedores tecnológicos necesarios para el funcionamiento del sitio web</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Tus derechos</h2>
              <p className="mb-3">Puedes ejercer en cualquier momento los siguientes derechos enviando un correo a <a href="mailto:hola@valookie.com" className="text-primary hover:underline">hola@valookie.com</a>:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti</li>
                <li><strong>Rectificación:</strong> corregir datos inexactos</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de tus datos</li>
                <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos</li>
                <li><strong>Portabilidad:</strong> recibir tus datos en formato electrónico</li>
                <li><strong>Limitación:</strong> solicitar que limitemos el uso de tus datos</li>
              </ul>
              <p className="mt-4">Si consideras que tus derechos han sido vulnerados, puedes presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Cookies</h2>
              <p>Este sitio web utiliza cookies técnicas necesarias para su funcionamiento. No utilizamos cookies de seguimiento publicitario ni compartimos datos de navegación con terceros con fines comerciales.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Seguridad</h2>
              <p>Aplicamos medidas técnicas y organizativas para proteger tus datos contra accesos no autorizados, pérdida o alteración. Todas las transmisiones de datos se realizan mediante conexión cifrada (HTTPS).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Cambios en esta política</h2>
              <p>Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos cualquier cambio relevante por correo electrónico o mediante un aviso en el sitio web.</p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPage;
