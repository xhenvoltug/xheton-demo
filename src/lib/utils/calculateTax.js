export function calculateTax(amount, taxRate = 16, inclusive = false) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  if (typeof taxRate !== 'number') {
    taxRate = parseFloat(taxRate) || 0;
  }
  
  if (inclusive) {
    // Amount already includes tax
    const taxAmount = amount * (taxRate / (100 + taxRate));
    const netAmount = amount - taxAmount;
    return {
      netAmount,
      taxAmount,
      grossAmount: amount,
      taxRate
    };
  } else {
    // Add tax to amount
    const taxAmount = amount * (taxRate / 100);
    const grossAmount = amount + taxAmount;
    return {
      netAmount: amount,
      taxAmount,
      grossAmount,
      taxRate
    };
  }
}

export function calculateDiscount(amount, discount, isPercentage = true) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  if (typeof discount !== 'number') {
    discount = parseFloat(discount) || 0;
  }
  
  const discountAmount = isPercentage 
    ? amount * (discount / 100) 
    : discount;
    
  return {
    original: amount,
    discount: discountAmount,
    final: amount - discountAmount,
    discountRate: isPercentage ? discount : (discountAmount / amount) * 100
  };
}
