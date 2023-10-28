import {sculptToMinimalRenderer} from 'shader-park-core';

const recipes = [
  "DEVILED TONGUE",
  "PINWHEELS",
  "CORNED BEEF HASH",
  "HOT CHEESE-TOMATO",
  "CRAB CANAPES",
  "MINCED CHICKEN",
  "CREAMED SHRIMP ON TOAST",
  "ORANGE ANGEL FOOD TORTE"
];

const default_recipe = "HOT CHEESE-TOMATO";

const load_recipe = () => {
  let draw = document.getElementById("draw");
  let errorOutput = document.getElementById("error");
  errorOutput.innerHTML = "";

  // clear any remaining timers
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);  

  let newCanv = document.createElement("canvas");
  newCanv.id = "output_canvas";
  let pegcodeblock = document.getElementById("source");
  
  // load new program
  try {
    let program = recipeParser.parse(pegcodeblock.value);
    sculptToMinimalRenderer(newCanv, program);
  }
  catch(e) {
    errorOutput.innerText = e;  
  }

  draw.innerHTML = null;

  newCanv.width = 2082;
  newCanv.height = 2098;
  newCanv.style.width = '861px';
  newCanv.style.height = '849px';
  newCanv.setAttribute('powerpreference','high-performance');
  draw.appendChild(newCanv);

  // set overlap div
  let canvas2d = document.getElementById('2d_canvas');
  canvas2d.height = newCanv.height;
  canvas2d.width = newCanv.width;
  canvas2d.style.height = (newCanv.clientHeight) + "px";
  canvas2d.style.width = (newCanv.clientWidth) + "px";

  let overlapper = document.getElementById('overlapper');
  overlapper.height = newCanv.height;
  overlapper.width = newCanv.width;
  overlapper.style.height = (newCanv.clientHeight) + "px";
  overlapper.style.width = (newCanv.clientWidth) + "px";
};

const update_dropdown = () => {
  var client = new XMLHttpRequest();
  client.open('GET', `recipes/${document.getElementById("recipe").value}`);
  client.onreadystatechange = function() {
    document.getElementById("source").value = client.responseText;
    load_recipe();
  }
  client.send();
};

window.addEventListener('load', function() { 

  const recipe_list = document.getElementById("recipe");
  for(let i = 0; i < recipes.length; i++) {
    var opt = document.createElement('option');
    opt.value = recipes[i] + ".txt";
    opt.innerHTML = recipes[i];
    if (recipes[i] == default_recipe)
      opt.selected = true;
    recipe_list.appendChild(opt);
  }

  recipe_list.addEventListener("change", update_dropdown);
  update_dropdown();

  document.getElementById('source').addEventListener("input", load_recipe);

  load_recipe();

}, false);
