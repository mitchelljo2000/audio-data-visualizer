let backgroundShader;
let foregroundShader;
//let foregroundShader2;
let oldTime;
let shaderBackgroundNdx = 0;
let shaderForegroundNdx = 1;
//let shaderForeground2Ndx = 0;
let w, h;
let shaderBackgroundTexture;
//let shaderForegroundTexture;
//let shaderForegroundTexture2;
let changeEvery =100;
let theShader, mic, table, tableLength;

let BINS = 4;

const shaders = [];

function preload() {
  // load the shaders
  shaders.push(loadShader("shader1.vert", "shader1.frag"));
  shaders.push(loadShader("shader2.vert", "shader2.frag"));
  shaders.push(loadShader("shader3.vert", "shader3.frag"));
  shaders.push(loadShader("shader3.vert", "shader4.frag"));
  shaders.push(loadShader("shader3.vert", "shader5.frag"));
  shaders.push(loadShader("shader3.vert", "shader6.frag"));
  shaders.push(loadShader("shader3.vert", "shader7.frag"));
  shaders.push(loadShader("shader3.vert", "shader8.frag"));
  shaders.push(loadShader("shader3.vert", "shader9.frag"));
  shaders.push(loadShader("shader3.vert", "shader10.frag"));
  shaders.push(loadShader("shader3.vert", "shader11.frag"));
  shaders.push(loadShader("shader3.vert", "shader12.frag"));
  shaders.push(loadShader("shader3.vert", "shader13.frag"));
  shaders.push(loadShader("shader3.vert", "shader14.frag"));
  theShader = shaders[0]; // start with the first shader
}

function setup() {
  frameRate(20);
  w = windowWidth;
  h = windowHeight;
  //creates canvas
  createCanvas(w, h, WEBGL);
  noStroke();

  // initialize the createGraphics layers
  shaderBackgroundTexture = createGraphics(w, h, WEBGL);
  shaderBackgroundTexture.noStroke();
  
  backgroundShader = shaders[shaderBackgroundNdx]; // [shaderBackgroundNdx]
  foregroundShader = shaders[shaderForegroundNdx];
  //foregroundShader2 = shaders[shaderForeground2Ndx];
  
  setupFFT();
}

function setupFFT(){
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(127);
  
  //let time = 0; // DELETE THIS LINE LATER
  let time = frameCount % changeEvery
  if (time == 0) {
    // increment shader index to the next shader but wrap around
    // back to 0 at then of the array of shaders
    // console.log("switching shader");
    backgroundShader = foregroundShader;
    //foregroundShader = foregroundShader2;
    shaderForegroundNdx = (shaderForegroundNdx + 1) % shaders.length;
    //shaderForegroundNdx =1
   // shaderForeground2Ndx = (shaderForeground2Ndx + 2) % shaders.length;
    foregroundShader = shaders[shaderForegroundNdx];
    //foregroundShader2 = shaders[shaderForeground2Ndx];
    //foregroundShader.setUniform("backgroundAlpha",0);
   //foregroundShader2.setUniform("backgroundAlpha",0);
    
  } // Uncomment this chunk to get back to fading

  // Background shader
  shaderBackgroundTexture.shader(backgroundShader);
  shaderBackgroundTexture.rect(0, 0, 2 * w, h);
  backgroundShader.setUniform("iResolution", [w, h]);
  backgroundShader.setUniform("iFrame", frameCount);
  backgroundShader.setUniform("iMouse", [mouseX, map(mouseY, 0, h, h, 0)]);
  backgroundShader.setUniform("iTime", millis() / 1000.0);
  backgroundShader.setUniform("u_resolution", [w, h]);
  backgroundShader.setUniform("u_time", millis() / 1000.0);
  backgroundShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, h, h, 0)]);
  
  backgroundShader.setUniform(
    "backgroundAlpha",
    map(time, 0, changeEvery, 1,0)
  );
  
  let arr = analyzeSpectrum();
  backgroundShader.setUniform("iData", arr);
  
  //backgroundShader.setUniform("backgroundAlpha",0.5);
  texture(shaderBackgroundTexture);
  rect(-windowWidth / 2, -windowHeight /2, windowWidth, windowHeight);

  // Foreground shader
  shaderBackgroundTexture.shader(foregroundShader);
  shaderBackgroundTexture.rect(0, 0, 2 * w, h);
  foregroundShader.setUniform("iResolution", [w, h]);
  foregroundShader.setUniform("iFrame", frameCount);
  foregroundShader.setUniform("iMouse", [mouseX, map(mouseY, 0, h, h, 0)]);
  foregroundShader.setUniform("iTime", millis() / 1000.0);
  foregroundShader.setUniform("u_resolution", [w, h]);
  foregroundShader.setUniform("u_time", millis() / 1000.0);
  foregroundShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, h, h, 0)]);
  //console.log("alpha: ", map(frameCount % changeEvery, 0, changeEvery-1, 0.0, 1.0)) ;
  
  foregroundShader.setUniform(
    "backgroundAlpha",
    map(time, 0, changeEvery, 0.0,1)
  );
  
  foregroundShader.setUniform("iData", arr);
  
  //foregroundShader.setUniform("backgroundAlpha",.5);
 
  

  texture(shaderBackgroundTexture);
  rect(
    -windowWidth / 2,
    -windowHeight / 2,
    windowWidth,
    windowHeight
  );
  
/*

  //foreground shader2
  shaderBackgroundTexture.shader(foregroundShader2);
  shaderBackgroundTexture.rect(0, 0, 2 * w, h);
  foregroundShader2.setUniform("iResolution", [w, h]);
  foregroundShader2.setUniform("iFrame", frameCount);
  foregroundShader2.setUniform("iMouse", [mouseX, map(mouseY, 0, h, h, 0)]);
  foregroundShader2.setUniform("iTime", millis() / 1000.0);
  foregroundShader2.setUniform("u_resolution", [w, h]);
  foregroundShader2.setUniform("u_time", millis() / 1000.0);
  foregroundShader2.setUniform("u_mouse", [mouseX, map(mouseY, 0, h, h, 0)]);
  // console.log("alpha: ", map(frameCount % changeEvery, 0, changeEvery-1, 0.0, 1.0)) ;
  foregroundShader2.setUniform(
    "backgroundAlpha",
    map(frameCount % changeEvery, 0, changeEvery-1, 0.0, .5)
  );

texture(shaderBackgroundTexture);
  rect(
    -windowWidth / 2,
    -windowHeight / 2,
    windowWidth,
    windowHeight
  );
*/
  
  // Resume Audio Context
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
  
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function analyzeSpectrum(){
  let arr = [];
  for (let i = 0; i < BINS; i++){
    arr[i] = 0;
  }
  
  let spectrum = fft.analyze();
  for (let i = 0; i< spectrum.length; i++){
    let arr_index = round(map(i, 0, spectrum.length - 1, 0, BINS-1));
    arr[arr_index] = arr[arr_index] + spectrum[i];
  }
  
  for (let i = 0; i < BINS; i++){
    arr[i] = map(arr[i], 0, (spectrum.length / BINS) * 255, 0.0, 1.0)
  }

  return arr;
}