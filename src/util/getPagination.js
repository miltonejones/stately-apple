

const sorter =  (key, off = 1) => (first, second) => (first[key] > second[key] ? 1 : -1) * off;


export  const getPagination = (collection,  {
  page = 1, 
  pageSize ,
  sortBy,
  sortUp = 1
}) => {

  const itemCount = collection?.length;
  const pageCount = Math.ceil(itemCount / pageSize);
  const startNum = (page - 1) * pageSize;  
  const lastNum = Math.min(startNum + pageSize, itemCount);
  const items = !sortBy ? collection : collection?.sort(sorter(sortBy, sortUp));
  const visible = items?.slice(startNum, lastNum);



  return {
    startNum: startNum + 1,
    itemCount,
    pageCount,
    visible,
    lastNum,
    items,
    pageSize
  }

  
}