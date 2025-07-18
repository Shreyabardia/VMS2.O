export function getPaginationPages(
  currentPage: number,
  totalPages: number,
  maxPages: number = 5,
): (string | number)[] {
  // Responsive maxPages: fewer pages on mobile for better UX
  const responsiveMaxPages = window.innerWidth < 640 ? 3 : maxPages;
  const halfMaxPages = Math.floor(responsiveMaxPages / 2);
  const pages: (string | number)[] = [];

  if (totalPages <= responsiveMaxPages) {
    // total pages less than max so show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // total pages more than max so calculate start and end pages
    let startPage = currentPage - halfMaxPages;
    let endPage = currentPage + halfMaxPages;

    if (startPage <= 0) {
      endPage -= startPage - 1;
      startPage = 1;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      if (endPage - responsiveMaxPages > 0) {
        startPage = endPage - responsiveMaxPages + 1;
      } else {
        startPage = 1;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // add ... to indicate more pages
    if (startPage > 1) {
      if (startPage > 2) {
        pages.unshift('...');
      }
      pages.unshift(1);
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
  }

  return pages;
}
