export default {
  process(src, filename, config, options) {
    console.log(src);
    console.log(filename);
    console.log(config);
    console.log(options);

    return 'export default {};';
  },
  getCacheKey() {
    // The output is always the same.
    return 'resourceTransform';
  },
};
