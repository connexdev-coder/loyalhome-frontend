export function sortByColumn<T>(
  data: T[],
  column: keyof T,
  currentSortType: "asc" | "desc"
): { sortedData: T[]; nextSortType: "asc" | "desc" } {
  const nextSortType = currentSortType === "asc" ? "desc" : "asc";

  const sortedData = [...data].sort((a, b) => {
    let comparison = 0;

    const valA = a[column];
    const valB = b[column];

    // Handle number and string comparisons
    const parsedValA = isNaN(Number(valA)) ? valA : parseFloat(String(valA));
    const parsedValB = isNaN(Number(valB)) ? valB : parseFloat(String(valB));

    // Compare values
    if (parsedValA > parsedValB) {
      comparison = 1;
    } else if (parsedValA < parsedValB) {
      comparison = -1;
    }

    // Adjust comparison based on sort type
    return currentSortType === "desc" ? -comparison : comparison;
  });

  return { sortedData, nextSortType };
}
