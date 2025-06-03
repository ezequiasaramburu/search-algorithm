export const removeDuplicatesByName = (arr) => {
  const seen = new Set();
  const filtered = arr.filter((item) => {
    if (seen.has(item.name)) {
      return false;
    } else {
      seen.add(item.name);
      return true;
    }
  });
  
  return filtered.map((item, index) => ({
    ...item,
    id: index + 1
  }));
};

