let receiptCounter = 1000;

export function generateReceiptNumber(prefix = 'RCP') {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  receiptCounter++;
  const counter = String(receiptCounter).padStart(4, '0');
  
  return `${prefix}-${year}${month}${day}-${counter}`;
}

export function generateInvoiceNumber(prefix = 'INV') {
  return generateReceiptNumber(prefix);
}

export function generatePurchaseOrderNumber(prefix = 'PO') {
  return generateReceiptNumber(prefix);
}
