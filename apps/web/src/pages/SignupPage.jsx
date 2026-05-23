
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
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

    if (formData.password !== formData.passwordConfirm) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.passwordConfirm, formData.name);
      toast.success('¡Cuenta creada con éxito!');
      navigate('/dashboard');
    } catch (error) {
      if (error.message.includes('email')) {
        toast.error('Este correo electrónico ya está registrado.');
      } else {
        toast.error('Error al crear la cuenta. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Registrarse - Valookie</title>
        <meta name="description" content="Crea tu cuenta en Valookie para empezar a comprar deliciosas galletas artesanales." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{letterSpacing: '-0.02em'}}>Únete a Valookie</h1>
            <p className="text-muted-foreground">Crea tu cuenta para empezar a comprar</p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-lg">
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
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="Al menos 8 caracteres"
                />
              </div>

              <div>
                <Label htmlFor="passwordConfirm">Confirmar Contraseña</Label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  required
                  className="bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="Vuelve a ingresar tu contraseña"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
