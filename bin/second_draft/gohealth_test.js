const fs = require('fs');

const mode = casper.cli.get("mode") || false;

casper.test.begin('gohealthinsurance tests', 1, function suite(test) {

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
    const saveLocation = fs.workingDirectory + '/second_draft/gohealth_form.html';
    const innerHTML = this.evaluate(function(){
        return document.querySelector('form[name="applicantInfoForm"]').innerHTML;
    });

    if(mode === "save") {
      fs.write(saveLocation, innerHTML);
      this.test.assert(true, "form content saved");
    } else {
      this.test.assert(innerHTML === fs.read(saveLocation), "form content is the same")
    }
  });

  casper.run(function(){
    test.done();
  });
});
