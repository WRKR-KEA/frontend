// 2025-02-07T14:17:23.447877 -> 14:17
export const formatTime = (
    dateString: string | undefined,
  ): string | undefined => {
    if (!dateString) return undefined;
  
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${hours}:${minutes}`;
  };
  