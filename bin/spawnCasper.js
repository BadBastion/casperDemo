var path = require('path')
var childProcess = require('child_process')

const spawnCasper =
  script => {
    var childArgs = [
      'test',
      path.join(__dirname, script)
    ]

    if(process.argv[3]) childArgs.push("--mode="+process.argv[3])

    childProcess.execFile("casperjs", childArgs, function(err, stdout, stderr) {
      console.log(
        "\n------------\n" +
        "-- OUTPUT --"     +
        "\n------------\n" +
        stdout             +
        "\n------------\n" +
        "-- ERROUT --"     +
        "\n------------\n" +
        stderr             +
        "\n------------\n" +
        "-- OUTPUT --"     +
        "\n------------\n" +
        err);
    })
  };

spawnCasper(process.argv[2] + "/gohealth_test.js")
