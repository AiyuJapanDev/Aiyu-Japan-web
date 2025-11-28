/**
 * Pagination utilities for static blog generation
 */

export const POSTS_PER_PAGE = 6;

/**
 * Calculate total number of pages needed for pagination
 */
export function calculateTotalPages(total: number, perPage: number): number {
  return Math.ceil(total / perPage);
}

/**
 * Generate an array of page numbers to display in pagination UI
 * Shows max 7 page numbers with ellipsis for large ranges
 * Example: [1, '...', 4, 5, 6, '...', 10]
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const delta = 2; // Number of pages to show on each side of current page

  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];

  // Always include first page
  range.push(1);

  // Calculate range around current page
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }

  // Always include last page
  range.push(totalPages);

  // Add ellipsis where there are gaps
  let prev = 0;
  for (const page of range) {
    if (typeof page === "number") {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (page - prev !== 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(page);
      prev = page;
    }
  }

  return rangeWithDots;
}

/**
 * Calculate offset for Strapi pagination
 */
export function calculateOffset(page: number, perPage: number): number {
  return (page - 1) * perPage;
}
