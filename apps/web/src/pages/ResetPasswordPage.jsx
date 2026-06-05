import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== passwordConfirm) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
      toast.success('¡Contraseña actualizada! Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      toast.error('El enlace ha expirado o no es válido. Solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Enlace no válido</h1>
          <p className="text-muted-foreground mb-6">Este enlace no contiene un token de restablecimiento.</p>
          <Button onClick={() => navigate('/login')}>Volver al inicio de sesión</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Nueva contraseña - Valookie</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
              Nueva contraseña
            </h1>
            <p className="text-muted-foreground">Ingresa tu nueva contraseña</p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <Label htmlFor="passwordConfirm">Confirmar contraseña</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  className="bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="Repite tu contraseña"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
