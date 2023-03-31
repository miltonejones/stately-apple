
export  const getPagination = (collection,  {
  page = 1, 
  pageSize 
}) => {

  const itemCount = collection?.length;
  const pageCount = Math.ceil(itemCount / pageSize);
  const startNum = (page - 1) * pageSize;  
  const lastNum = Math.min(startNum + pageSize, itemCount);
  const visible = collection?.slice(startNum, lastNum);



  return {
    startNum: startNum + 1,
    itemCount,
    pageCount,
    visible,
    lastNum,
    pageSize
  }

  
}