export const getChildren = (str: string, ...keys: string[]) => {
  const check1 = keys.length > 0;
  const out: string[] = [];
  if (check1) {
    keys.forEach(key => {
      const check2 = str !== key;
      const check3 = key.includes(str);

      const check4 = check2 && check3;
      if (check4) {
        out.push(key);
      }
    });
  }

  return out;
};
