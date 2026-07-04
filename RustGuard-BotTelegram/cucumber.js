export default {
  default: {
    paths: ['tests/features/**/*.feature'],
    import: ['tests/steps/**/*.js'],
    format: ['html:reports/cucumber-report.html']
  }
};
