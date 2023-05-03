window.appProperties = {
  filter: {},
  getCategoryFilter() {
    let categoryId = null;
    if (this.filter.category != null) {
      categoryId = this.filter.category.categoryId;
    }
    return categoryId === null ? "" : categoryId;
  },
  getPhaseFilter() {
    const phaseId = this.filter.phaseId;
    return phaseId === undefined ? "" : phaseId;
  },
  setPhaseFilter(opts) {
    this.filter.phaseId = opts.phaseId;
  },
  getDefaultYear() {
    const defaultYear = this.filter.defaultYear;
    return defaultYear === undefined ? "" : defaultYear;
  },
  setDefaultYear(opts) {
    this.filter.defaultYear = opts.defaultYear;
  },
  getRegion() {
    const region = this.filter.region;
    return region === undefined ? {} : region;
  },
  setRegion(opts) {
    this.filter.region = opts.region;
  },
  getRegions() {
    const regions = this.filter.regions;
    return regions === undefined ? [] : regions;
  },
  setRegions(opts) {
    this.filter.regions = opts;
  },
  setCategory(opts) {
    this.filter.category = opts.category;
  },
  getCategory() {
    const category = this.filter.category;
    return category === undefined ? {} : category;
  },
};
