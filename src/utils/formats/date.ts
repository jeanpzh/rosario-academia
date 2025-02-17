export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const getNextFormattedDate = (dateString: string): string => {
  if (!dateString) {
    throw new Error("Fecha no definida");
  }
  // Reemplazar espacio por "T" si es necesario
  let isoString = dateString.includes("T") ? dateString : dateString.replace(" ", "T");
  // Si la zona horaria viene como "+00" sin dos puntos, se añade ":00"
  isoString = isoString.replace(/([+-]\d{2})$/, "$1:00");

  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`Fecha inválida luego de la conversión: ${isoString}`);
  }
  date.setMonth(date.getMonth() + 1);
  return formatDate(date.toISOString());
};

export function getDaysRemaining(lastChange: string | null) {
  if (!lastChange) return 0; // Si nunca se cambió, se permite el cambio
  const lastChangeDate = new Date(lastChange as string);
  const today = new Date();
  const daysSince = Math.floor(
    (today.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysRemaining = 30 - daysSince;
  return daysRemaining > 0 ? daysRemaining : 0;
}
