(function () {
  lib.default().then(function (emctx) {
    console.log(emctx)
    console.log(emctx.Module._add(1, 2));
    console.log(lib.add(3, 4));
    console.log(emctx.Module._spawn());
  });
})();
