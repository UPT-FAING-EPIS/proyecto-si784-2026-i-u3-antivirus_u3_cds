module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['tests/steps/**/*.ts'],
    format: ['html:reports/cucumber-report.html']
  }
};
