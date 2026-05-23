
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await pb.collection('email_signups').create({ email }, { $autoCancel: false });
      toast.success('¡Gracias por suscribirte! Revisa tu correo electrónico para ver un mensaje de bienvenida.');
      setEmail('');
    } catch (error) {
      if (error.message.includes('email')) {
        toast.error('Este correo electrónico ya está suscrito.');
      } else {
        toast.error('Error al suscribirse. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <Input
        type="email"
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 bg-white text-gray-900 placeholder:text-gray-500"
      />
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? 'Suscribiendo...' : 'Suscribirse'}
      </Button>
    </form>
  );
};

export default NewsletterSignup;
