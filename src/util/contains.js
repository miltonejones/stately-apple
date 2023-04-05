export const contains = (str1, str2) => 
  typeof str1 === 'string' && 
  typeof str2 === 'string' && 
  str1.toLowerCase().indexOf(str2.toLowerCase()) > -1