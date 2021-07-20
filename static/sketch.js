const SIZE = 256;
let inputImg, currentImg, inputCanvas, output, statusMsg, pix2pix, clearBtn, transferBtn, currentColor, currentStroke, currentRadius, randomFlag;

var shapes_coord = []
var shapes_colors = []

function setup() {
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class('border-box').parent('input');

  // Display initial input image
  inputImg = loadImage('static/images/blank.png', drawImage);
  currentImg = inputImg;

  // Selcect output div container
  output = select('#output');
  statusMsg = select('#status');

  // Get the buttons
  currentColor = color(0, 0, 255);
  currentStroke = 0;
  currentRadius = 20;
  select('#color_void').mousePressed(() => currentColor = color(255, 255, 255));
  select('#color_0').mousePressed(() => currentColor = color(0, 0, 255));
  select('#color_1').mousePressed(() => currentColor = color(0, 255, 0));
  select('#color_2').mousePressed(() => currentColor = color(255, 0, 0));
  

  // Change Stroke Weight
  select("#customRange").changed(()=>currentRadius = document.getElementById("customRange").value);
  
  // Select 'transfer' button html element
  transferBtn = select('#transferBtn');

  // Select 'clear' button html element
  clearBtn = select('#clearBtn');

  // randomBtn = select('#randomBtn');

  // Attach a mousePressed event to the 'clear' button
  clearBtn.mousePressed(function() {
    clearCanvas();
  });

  // randomBtn.mousePressed(function() {
  //   var nb = Math.floor(Math.random() * 3) + 1
  //   window.console.log(nb);
  //   randomImg = loadImage('static/images/'+nb+'.png', drawImage);
  //   randomFlag = true;
  // });

  transferBtn.mousePressed(function() {
    transfer();
  });
}

let responseString;
let painting = false;
let x_a
let y_a
// Draw on the canvas when mouse is pressed
function draw(){
  if(randomFlag)
  {
    background(currentImg);
    randomFlag = false;
  }
  
  strokeWeight(currentRadius);
  stroke(currentColor);
  if(mouseIsPressed){
    fill(currentColor);
    line(mouseX,mouseY,pmouseX,pmouseY) 
  }
}

// Draw the input image to the canvas
function drawImage() {
  image(inputImg, 0, 0,SIZE, SIZE);
}

// Clear the canvas
function clearCanvas() {
  background(255);
  currentImg = inputImg;
}

function transfer() {
  const p5canvas = document.getElementById("defaultCanvas0");

  var base64StringIn = p5canvas.toDataURL('image/jpeg',1.0).split(';base64,')[1];

  var outString;
  var outImInf = inference(base64StringIn);
  //window.console.log(responseString);

  const outIm = document.getElementById("output");
  outIm.src = "data:image/png;base64,"+responseString;
}


async function inference(baseString) {
  // construct url for GET /solve/definition.gh?name=value(&...)

  var imgData = {image: baseString};
  const url = new URL('/generate/', window.location.origin);
  //Object.keys(data.inputs).forEach(key => url.searchParams.append(key, data.inputs[key]))
  var bodydata = JSON.stringify(imgData);
  //console.log(bodydata.toString());
  //console.log(bodydata);
  
  try {
    const response = await fetch(url,{method:"POST",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodydata
    });

    //console.log(response);
    if(!response.ok) {
      // TODO: check for errors in response json
      throw new Error(response.statusText)
    }

    const responseJson = await response.json()
    //console.log(responseJson);

    responseString = JSON.parse(responseJson).predicted;
    //console.log(responseString);

  } catch(error) {
    console.error(error)
  }
}

