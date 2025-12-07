export function formatDate(date, format = 'default') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const formats = {
    default: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    },
    short: { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    datetime: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    }
  };
  
  return new Intl.DateTimeFormat('en-KE', formats[format] || formats.default).format(d);
}

export function formatRelativeTime(date) {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
}
