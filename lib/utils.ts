const pickBy = (obj: Object) =>
  Object.entries(obj).reduce(
    (a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }),
    {}
  );

export { pickBy };
