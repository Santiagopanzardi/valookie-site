
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Menu, User, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import ShoppingCart from './ShoppingCart.jsx';

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/shop', label: 'Tienda' },
    { to: '/about', label: 'Nosotros' },
    { to: '/contact', label: 'Contacto' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://horizons-cdn.hostinger.com/20aebe59-367d-486d-b6c5-8fc8284b40e6/fe61320c4da2579ac9246cab93342189.png"
              alt="Valookie"
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-5 py-2 rounded-full font-medium tracking-wide transition-all duration-200 text-foreground/80 hover:text-primary hover:bg-primary/8"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ShoppingCart />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/wishlist')}
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="w-4 h-4 mr-2" />
                    Panel de Control
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Iniciar Sesión
              </Button>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors duration-200"
                      >
                        Panel de Control
                      </Link>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        variant="outline"
                      >
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate('/login');
                        setMobileOpen(false);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Iniciar Sesión
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
