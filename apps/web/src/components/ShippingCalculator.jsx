
import React, { useEffect } from 'react';

const SHIPPING_COST = 5.90;
const FREE_SHIPPING_THRESHOLD = 40;

const ShippingCalculator = ({ orderTotal, onShippingCalculated }) => {
  useEffect(() => {
    const isFree = orderTotal >= FREE_SHIPPING_THRESHOLD;
    const info = {
      cost: isFree ? 0 : SHIPPING_COST,
      originalCost: SHIPPING_COST,
      isFree,
    };
    if (onShippingCalculated) {
      onShippingCalculated(info);
    }
  }, [orderTotal]);

  const isFree = orderTotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">Envío:</span>
        <span className="text-lg font-bold">
          {isFree ? (
            <span className="text-accent">GRATIS</span>
          ) : (
            `€${SHIPPING_COST.toFixed(2)}`
          )}
        </span>
      </div>
      {!isFree && (
        <p className="text-sm text-accent font-medium">
          ¡Agrega €{(FREE_SHIPPING_THRESHOLD - orderTotal).toFixed(2)} más para envío gratis!
        </p>
      )}
      {isFree && (
        <p className="text-sm text-muted-foreground">
          ¡Envío gratis aplicado por compra superior a €{FREE_SHIPPING_THRESHOLD}!
        </p>
      )}
    </div>
  );
};

export default ShippingCalculator;
