module.exports = {
    // other configurations...
    resolve: {
      fallback: {
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "fs": false, // fs is not supported in the browser, so use false if not needed
        "util": require.resolve("util/"),
      },
    },
  };
