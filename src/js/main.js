/* -------------------- Begin File Reader -------------------- */

function startRead() {
    // disable the form
    //  obtain  input element through DOM
    var file  = document.getElementById('gcode-file').files[0];
    if(file){
        getAsText(file);
    }
}

function getAsText(readFile) {

    var reader  = new FileReader();

    //  Read  file  into  memory  as  UTF-8
    reader.readAsText(readFile, "UTF-8");
    reader.onprogress = updateProgress;
    reader.onload = loaded;
  }

function loaded (evt) {
  var fileString = evt.target.result;

  // Start evaluation
  startEval(fileString);
}

function updateProgress(evt) {
  if (evt.lengthComputable) {
    var loaded = (evt.loaded/evt.total);
    if(loaded <= 1)
    document.getElementById('progressBar').setAttribute("style", "width: " + loaded*100 + "%");
  }
}

/* -------------------- End File Reader -------------------- */

/* -------------------------------------------------------------------------- */

/* -------------------- Begin Globals -------------------- */

// Set of tools and their width of cut -- nothing at zero
var toolData = new Array(null, '.25', '.5', '1', '2', '4');

// set default tool and rapid speed
var toolByDefault = 2, RAPID_SPEED = 8000;

// number of divisions to divide the G02 & G03 arc
var ARC_DIVISIONS = 5;

var WORKPIECE_RADIUS = 32;  // Radius of the workpiece which is being cut

/* -------------------- End Globals -------------------- */

/* -------------------------------------------------------------------------- */

/* -------------------- Tokenizer Globals BEGIN -------------------- */

// Block descriptors (parameterized codes) which are supported by program
var supportedCodes = new Array("G00", "G01", "G02", "G03", "G04", 
                              "G28", "G71", "G72", "G75", "M03", 
                              "M04", "M06", "G90", "G76", "G70"
                              );

// Codes which don't have parameters
var controlCodes = new Array("G21", "G98", "M05", "M08", "M09", "M30");

/* -------------------- Tokenizer Globals  END  -------------------- */

/* -------------------------------------------------------------------------- */

/* -------------------- MAIN PROGRAM BEGIN -------------------- */
function startEval (input) {
  // Hide all previous errors...
  hideAlertBoxes();

  // Process the input string
  var tokens = tokenizer(input);

  // Validate the tokens
  var validTokens = validateTokens(tokens);

  // test getting line block
  // alert(JSON.stringify(getLineBlock(validTokens, 'N1')));
  // return;

  // Get array of points
  var pointsArray = getPoints(validTokens);

  // var pointsArray = [{"x":0,"z":0,"feed":8000,"rpm":0,"dia":0.5},
  //                   {"x":0,"z":0,"feed":8000,"rpm":0,"dia":0.5},
  //                   {"x":40,"z":10,"feed":500,"rpm":0,"dia":4},
  //                   {"x":40,"z":-15,"feed":300,"rpm":0,"dia":4},
  //                   {"x":32,"z":-15.1,"feed":200,"rpm":1800,"dia":4},
  //                   {"x":28,"z":-15,"feed":100,"rpm":1800,"dia":4},
  //                   {"x":40,"z":-15.1,"feed":100,"rpm":1800,"dia":4}];

  // pointsArray = [];
  // for (i = 0; 40 > i; ++i) pointsArray.push({x:31-.25 * i, z:10, feed:8E3, rpm:1500, dia:4}), 
  //   pointsArray.push({x:51 - .5 * i, z:-50, feed:8E3, rpm:1500, dia:4});

  window.loadJob = function() {
    for(var i = 0; i < pointsArray.length; ++i)
      window.addStep(pointsArray[i].x, 
        pointsArray[i].z, pointsArray[i].feed, 
        pointsArray[i].rpm, pointsArray[i].dia);
  };

  window.runSimulation();

  // Show the output over the screen  -- Dev
  // alert(JSON.stringify(tokens));
  // alert(JSON.stringify(pointsArray));
}

/* -------------------- MAIN PROGRAM END -------------------- */