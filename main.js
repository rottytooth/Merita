import {sculptToMinimalRenderer} from 'shader-park-core';

const recipes = [
  "CHEESE-OLIVE CANAPES",
  "DEVILED TONGUE",
  "PINWHEELS",
  "CORNED BEEF HASH",
  "HOT CHEESE-TOMATO",
  "CRAB CANAPES",
  "MINCED CHICKEN",
  "ROLLED",
  "CREAMED SHRIMP ON TOAST",
  "ORANGE ANGEL FOOD TORTE"
];

const default_recipe = "HOT CHEESE-TOMATO";

const load_recipe = () => {
  let draw = document.getElementById("draw");
  draw.innerHTML = null;
  let errorOutput = document.getElementById("error");
  errorOutput.innerHTML = "";

  // clear any remaining timers
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);  

  let newCanv = document.createElement("canvas");
  newCanv.id = "output_canvas";
  let pegcodeblock = document.getElementById("source");

  let program = recipeParser.parse(pegcodeblock.value);

//  alert(program);
  
  // load new program
  try {
    sculptToMinimalRenderer(newCanv, program);
  }
  catch(e) {
    errorOutput.innerText = e;
  }

  // newCanv.width = 2482;
  // newCanv.height = 2498;
  // newCanv.style.width = '941px';
  // newCanv.style.height = '949px';
  newCanv.width = 2082; //1982;
  newCanv.height = 2098; //1924;
  newCanv.style.width = '841px';
  newCanv.style.height = '849px';
  newCanv.setAttribute('powerpreference','high-performance');
  // newCanv.setAttribute('data-engine','three.js r155');
  draw.appendChild(newCanv);

  // set overlap div
  document.getElementById('overlapper').style.height = newCanv.clientHeight + "px";

  let overlap = document.getElementById('2d_canvas');
  overlap.height = newCanv.height;
  overlap.width = newCanv.width;
  overlap.style.height = (newCanv.clientHeight + 100) + "px";
  overlap.style.width = (newCanv.clientWidth + 100) + "px";
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

  // document.getElementById("updateBtn").addEventListener("click", load_recipe);

  document.getElementById('source').addEventListener("input", load_recipe);

  load_recipe();

}, false);
