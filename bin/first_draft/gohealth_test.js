const required_fields = [
  "div[person='household.primary()'] input[name='dobDay']",
  "div[person='household.primary()'] input[name='dobMonth']",
  "div[person='household.primary()'] input[name='dobYear']",
  "input#primary-radio-male",
  "input#primary-radio-female",
  "input#primary-radio-yes",
  "input#primary-radio-no",

  "div#spouse-survey input[name='dobDay']",
  "div#spouse-survey input[name='dobMonth']",
  "div#spouse-survey input[name='dobYear']",
  "input#spouse-radio-male",
  "input#spouse-radio-female",
  "input#spouse-radio-yes",
  "input#spouse-radio-no",

  "div#dependent0-survey input[name='dobDay']",
  "div#dependent0-survey input[name='dobMonth']",
  "div#dependent0-survey input[name='dobYear']",
  "input#dependent0-radio-male",
  "input#dependent0-radio-female",
  "input#dependent0-radio-yes",
  "input#dependent0-radio-no",

  "input#firstName",
  "input#lastName",
  "input#email",
  "input#phone"
]

casper.test.begin('gohealthinsurance tests', 25, function suite(test) {
  casper.start('https://www.gohealthinsurance.com/marketplace/#/', function() {
      this.waitForSelector('form[ng-submit="next()"]');
  });

  casper.then(function() {
     this.fill('form[ng-submit="next()"]', { 'zipCodeField': 97223 }, true);
  });

  casper.waitForSelector('form[ng-submit="next(subsidy, zipCode, countyValue.county)"]', function() {
    this.click('button#addSpouseButton');
    this.waitForSelector('div#spouse-survey');

    this.click('button#addDependentButton');
    this.waitForSelector('div#dependent0-survey');

    this.click('#applicantInfoExpandButton');
    this.waitForSelector('button#submitApplicantInfoBtn');
  });

  casper.then(function(){
    required_fields.forEach(function(field){ casper.test.assertExists(field); });
  });

  casper.run(function(){
    test.done();
  });
});
