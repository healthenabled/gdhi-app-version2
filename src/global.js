window.appProperties = {
  filter: {},
  setCategoryFilter(opts) {
    this.filter.categoryId = opts.categoryId;
  },
  getCategoryFilter() {
    const categoryId = this.filter.categoryId;
    return categoryId === undefined ? "" : categoryId;
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
};
