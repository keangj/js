function bind (asThis, ...agrs) {
  const fn = this;
  return function (...agrs2) {
    return fn.call(asThis, ...agrs, ...agrs2);
  }
}

module.exports = bind;

if (!Function.prototype.bind) {
  Function.prototype.bind = bind;
}