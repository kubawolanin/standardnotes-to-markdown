const pickBy = (obj) =>
  Object.entries(obj).reduce(
    (a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }),
    {}
  );

module.exports = {
  pickBy,
};
