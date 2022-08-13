export const itemIn = <T>(list: T[]) => {
  const set = new Set(list);
  return (item: T) => {
    return set.has(item);
  };
};

export const itemNotIn = <T>(list: T[]) => {
  const set = new Set(list);
  return (item: T) => {
    return !set.has(item);
  };
};