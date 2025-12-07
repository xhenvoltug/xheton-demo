export function formatCurrency(amount, currency = 'KES') {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatCurrencySimple(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}
