
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ShippingCalculator = ({ orderTotal, onShippingCalculated }) => {
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!postalCode) return;

    setLoading(true);
    try {
      const rates = await pb.collection('shipping_rates').getFullList({
        filter: `postalCode = "${postalCode}"`,
        $autoCancel: false
      });

      if (rates.length === 0) {
        toast.error('No hay envíos disponibles para este código postal.');
        setShippingInfo(null);
        return;
      }

      const rate = rates[0];
      const isFreeShipping = orderTotal >= 40;
      const finalCost = isFreeShipping ? 0 : rate.shippingCost;

      const info = {
        cost: finalCost,
        originalCost: rate.shippingCost,
        isFree: isFreeShipping,
        deliveryDays: rate.deliveryDays || '24-48 horas',
        region: rate.region
      };

      setShippingInfo(info);
      if (onShippingCalculated) {
        onShippingCalculated(info);
      }

      if (isFreeShipping) {
        toast.success('¡Envío gratis aplicado!');
      }
    } catch (error) {
      toast.error('Error al calcular el envío. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCalculate} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="postalCode">Código Postal</Label>
          <Input
            id="postalCode"
            type="text"
            placeholder="Ingresa tu código postal"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className="bg-white text-gray-900 placeholder:text-gray-500"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="self-end bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </Button>
      </form>

      {shippingInfo && (
        <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Costo de Envío:</span>
            <span className="text-lg font-bold text-primary">
              {shippingInfo.isFree ? (
                <span className="text-accent">GRATIS</span>
              ) : (
                `€${shippingInfo.cost.toFixed(2)}`
              )}
            </span>
          </div>
          {shippingInfo.isFree && shippingInfo.originalCost > 0 && (
            <p className="text-sm text-muted-foreground">
              ¡Ahorraste €{shippingInfo.originalCost.toFixed(2)} con el envío gratis!
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Entrega estimada: {shippingInfo.deliveryDays}
          </p>
          {!shippingInfo.isFree && orderTotal < 40 && (
            <p className="text-sm text-accent font-medium">
              ¡Agrega €{(40 - orderTotal).toFixed(2)} más para envío gratis!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
