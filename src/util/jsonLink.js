export const jsonLink = (json) => { 
  const jsonStr = JSON.stringify(json);
  const blob = new Blob([jsonStr], { type: "application/json" });
  return URL.createObjectURL(blob);
}