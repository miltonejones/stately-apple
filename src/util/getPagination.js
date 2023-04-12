/**
 * Sorts a collection of items by a given key.
 * @param {string} key - The key by which to sort the items.
 * @param {number} off - The order in which to sort the items (ascending/descending).
 * @returns The sorted collection of items.
 */
const sorter = (key, off = 1) => (first, second) => (first[key] > second[key] ? 1 : -1) * off;

/**
 * Paginates a collection of items.
 * @param {Array} collection - The collection of items to paginate.
 * @param {Object} options - The pagination options.
 * @param {number} options.page - The current page number.
 * @param {number} options.pageSize - The maximum number of items to display per page.
 * @param {string} options.sortBy - The key by which to sort the items.
 * @param {number} options.sortUp - The order in which to sort the items (ascending/descending).
 * @returns An object with pagination data for the given collection of items.
 */
export const getPagination = (collection, {
  page = 1,
  pageSize = 10,
  sortBy = null,
  sortUp = 1
}) => {
  // Get the total number of items in the collection.
  const itemCount = collection?.length;

  // Calculate the total number of pages.
  const pageCount = Math.ceil(itemCount / pageSize);

  // Calculate the starting and ending item numbers for the current page.
  const startNum = (page - 1) * pageSize;
  const lastNum = Math.min(startNum + pageSize, itemCount);

  // Sort the items by the specified key, if applicable.
  const items = !sortBy ? collection : collection?.sort(sorter(sortBy, sortUp));

  // Get the items that are visible on the current page.
  const visible = items?.slice(startNum, lastNum);

  return {
    startNum: startNum + 1,
    itemCount,
    pageCount,
    visible,
    lastNum,
    items,
    pageSize,
    page
  };
}

// Critique: 
// It would be more efficient to calculate pageCount within the ternary operator that sets the value of items. This would ensure that pageCount is only calculated if it's needed.