export function formatNumber(value, options = {}) {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  
  const {
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ','
  } = options;
  
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return `${prefix}${formatted}${suffix}`;
}

export function formatCompactNumber(value) {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}
