import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup.jsx';
const Footer = () => {
  return <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="https://horizons-cdn.hostinger.com/20aebe59-367d-486d-b6c5-8fc8284b40e6/fe61320c4da2579ac9246cab93342189.png" alt="Valookie" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Galletas artesanales hechas con amor en España. Cada bocado es una celebración de sabor y calidad.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/shop" className="text-sm hover:text-primary transition-colors duration-200">
                Tienda
              </Link>
              <Link to="/about" className="text-sm hover:text-primary transition-colors duration-200">
                Nosotros
              </Link>
              <Link to="/faq" className="text-sm hover:text-primary transition-colors duration-200">
                Preguntas Frecuentes
              </Link>
              <Link to="/contact" className="text-sm hover:text-primary transition-colors duration-200">
                Contacto
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contáctanos</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="opacity-90">El Torrent 1, Mataró</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:hello@valookie.com" className="hover:text-primary transition-colors duration-200 opacity-90">
                  Hola@valookie.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="opacity-90">+34 610 485 979</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Boletín</h3>
            <p className="text-sm mb-4 opacity-90">
              ¡Suscríbete para ofertas exclusivas y novedades!
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-90">
            © 2026 Valookie. Todos los derechos reservados.
          </p>

          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="hover:text-primary transition-colors duration-200 opacity-90">
              Política de Privacidad
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-200 opacity-90">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;