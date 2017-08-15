const fs = require('fs');
const form_path = fs.workingDirectory + '/gohealth/gohealth_form.html';
const mode = casper.cli.get("mode") || false;

const filled_fields = {
  "div[person='household.primary()'] input[name='dobDay']": "04",
  "div[person='household.primary()'] input[name='dobMonth']": "09",
  "div[person='household.primary()'] input[name='dobYear']": "1980",

  "div#spouse-survey input[name='dobDay']": "05",
  "div#spouse-survey input[name='dobMonth']": "11",
  "div#spouse-survey input[name='dobYear']": "1969",

  "div#dependent0-survey input[name='dobDay']": "02",
  "div#dependent0-survey input[name='dobMonth']": "04",
  "div#dependent0-survey input[name='dobYear']": "2008",
  "input#firstName": "nam",
  "input#lastName": "nanos",
  "input#email": "erwr@asdr.com",
  "input#phone": "7372327570"
}

const clicked_fields = [
  "input#primary-radio-female",
  "input#primary-radio-no",
  "input#spouse-radio-male",
  "input#spouse-radio-yes",
  "input#dependent0-radio-female",
  "input#dependent0-radio-no"
]

// TODO: Really bad demo code. Removes variant request data.
const deleteVariants = function(params){
  params.applicants.primary.applicantId = undefined;
  params.applicants.spouse.applicantId = undefined;
  params.applicants.dependents[0].applicantId = undefined;
  params.affiliateId = undefined;
  params.linkId = undefined;
  params.insuranceSearchId = undefined;
}


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
    for (var key in filled_fields) {
      filled_fields.hasOwnProperty(key) ? this.sendKeys(key, filled_fields[key]): false;
    }
    for (var i in clicked_fields) {
       this.click(clicked_fields[i]);
    }

    this.click('button#submitApplicantInfoBtn');
    this.waitWhileSelector('button#submitApplicantInfoBtn');
    this.echo(fs.workingDirectory + '/third_draft/gohealth_form.json')
  });

  casper.options.onResourceRequested = function(request, requestData, networkRequest) {
    const postData = JSON.parse(requestData.postData)

    if(requestData.method === "POST" && postData.contactInfo){
      deleteVariants(postData);
      const params = JSON.stringify(postData);
      const saveLocation = fs.workingDirectory + '/third_draft/gohealth_form.json';

      if(mode === "save") {
        fs.write(saveLocation, params);
        this.test.assert(true, "form content saved");
      } else {
        this.test.assert(params === fs.read(saveLocation), "form content is the same");
      }

      networkRequest.abort();
    }
  };

  casper.then(function() {
    this.echo('Page aborted at: ' + this.evaluate(function() {
       return document.URL;
     }), 'INFO');
  });


  casper.run();
});
