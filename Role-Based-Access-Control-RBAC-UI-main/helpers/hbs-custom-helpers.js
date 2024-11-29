
//some custom Handlebars Helpers for UI Operations
module.exports = {
  ifEquals(v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  indexIncrement(val) {
    return val + 1;
  },
};