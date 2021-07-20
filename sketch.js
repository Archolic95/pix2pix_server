const SIZE = 256;
let inputImg, currentImg, inputCanvas, output, statusMsg, pix2pix, clearBtn, transferBtn, currentColor, currentStroke;

var shapes_coord = []
var shapes_colors = []

function setup() {
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class('border-box').parent('input');

  // Display initial input image
  inputImg = loadImage('images/blank.png', drawImage);
  currentImg = inputImg;

  // Selcect output div container
  output = select('#output');
  statusMsg = select('#status');

  // Get the buttons
  currentColor = color(0, 0, 255);
  currentStroke = 0;
  select('#color_void').mousePressed(() => currentColor = color(255, 255, 255));
  select('#color_0').mousePressed(() => currentColor = color(0, 0, 255));
  select('#color_1').mousePressed(() => currentColor = color(0, 255, 0));
  select('#color_2').mousePressed(() => currentColor = color(255, 0, 0));

  
  // Select 'transfer' button html element
  transferBtn = select('#transferBtn');

  // Select 'clear' button html element
  clearBtn = select('#clearBtn');

  randomBtn = select('#randomBtn');

  // Attach a mousePressed event to the 'clear' button
  clearBtn.mousePressed(function() {
    clearCanvas();
  });

  randomBtn.mousePressed(function() {
    var nb = Math.floor(Math.random() * 3) + 1  
    randImg = loadImage('images/random/'+nb+'.png', drawImage);
    background(randImg);
    redraw(); 
  });

  transferBtn.mousePressed(function() {
    transfer();
  });
}


let painting = false;
let x_a
let y_a
let radius = 20

// Draw on the canvas when mouse is pressed
function draw(){

  strokeWeight(20);
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
  window.console.log(responseString);

  const outIm = document.getElementById("output");
  outIm.src = "data:image/png;base64,"+responseString;
  var c = document.createElement('canvas');
  c.height = outIm.naturalHeight;
  c.width = outIm.naturalWidth;
  window.console.log(c.height);
  
  var ctx = c.getContext('2d');

  ctx.drawImage(outIm, 0, 0, 512, 512);

}

let responseString;
async function inference(baseString) {
  // construct url for GET /solve/definition.gh?name=value(&...)

  var imgData = {image: baseString};
  const url = new URL('/generate/', window.location.origin);
  //Object.keys(data.inputs).forEach(key => url.searchParams.append(key, data.inputs[key]))
  var bodydata = JSON.stringify(imgData);
  //console.log(bodydata.toString());
  console.log(bodydata);
  
  try {
    const response = await fetch(url,{method:"POST",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodydata
    });
  
    if(!response.ok) {
      // TODO: check for errors in response json
      throw new Error(response.statusText)
    }

    const responseJson = await response.json()
    console.log(response);
    console.log(responseJson.predicted);
    
    responseString = responseJson.predicted;
    //console.log(responseString);

  } catch(error) {
    console.error(error)
  }
}

