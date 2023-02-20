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
    const yearValue = this.filter.yearValue;
    return yearValue === undefined ? "" : yearValue;
  },
  setDefaultYear(opts) {
    this.filter.yearValue = opts.yearValue;
  },
};
