export function usePrice(subtotal: number, promo: number) {
  const TAX = 13; // %
  const SERVICE_FEE = 5; // %
  const ORDER_FEE = 0.99;
  const DELIVERY_FEE = 0.99;
  let more = false;
  const copySubtotal = Number(subtotal).toFixed(2);
  let total = 0;
  let off;

  if (typeof Number(promo) === "number" && Number(promo) > 0) {
    off = (subtotal * Number(promo)) / 100;
    subtotal = subtotal - off;
  }

  if (Number(subtotal) <= 12) {
    more = false;
    total =
      subtotal + ORDER_FEE + DELIVERY_FEE + (subtotal / 100) * SERVICE_FEE;
  } else {
    more = true;
    total = subtotal + DELIVERY_FEE + (subtotal * SERVICE_FEE) / 100;
  }
  let tax = (total / 100) * TAX;

  if (subtotal === 0) total = 0;
  else total = total + (total / 100) * TAX;

  return [
    total,
    tax,
    more,
    (subtotal * SERVICE_FEE) / 100,
    ORDER_FEE,
    DELIVERY_FEE,
    off,
    copySubtotal
  ];
}
