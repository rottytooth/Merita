import {sculptToMinimalRenderer} from 'shader-park-core';

const recipes = [
  "CHEESE-OLIVE CANAPES",
  "DEVILED TONGUE",
  "PINWHEELS",
  "CORNED BEEF HASH",
  "HOT CHEESE-TOMATO",
  "RIBBONS",
  "CRAB CANAPES",
  "MINCED CHICKEN",
  "ROLLED",
  "CREAMED SHRIMP ON TOAST",
  "ORANGE ANGEL FOOD TORTE"
];

const setup = `
  let s = getSpace();
  let noiseScale = 340;
  setGeometryQuality(8);
`

const default_recipe = "DEVILED TONGUE";

const update_dropdown = () => {
  //    alert(document.getElementById("recipe").value);
  var client = new XMLHttpRequest();
  client.open('GET', `recipes/${document.getElementById("recipe").value}`);
  client.onreadystatechange = function() {
    // alert(client.responseText);
    document.getElementById("source").value = client.responseText;
    document.getElementById('updateBtn').click();
  }
  client.send();
}

window.addEventListener('load', function() { 

  const recipe_list = document.getElementById("recipe");
  for(let i = 0; i < recipes.length; i++) {
    var opt = document.createElement('option');
    opt.value = recipes[i] + ".recipe";
    opt.innerHTML = recipes[i];
    if (recipes[i] == default_recipe)
      opt.selected = true;
    recipe_list.appendChild(opt);
  }

  recipe_list.addEventListener("change", update_dropdown);
  update_dropdown();

  document.getElementById("updateBtn").addEventListener("click", function() {
    let errorOutput = document.getElementById("error");
    errorOutput.innerHTML = "";
    let newCanv = document.createElement("canvas");
    newCanv.id = "output_canvas";
    let pegcodeblock = document.getElementById("source");

    let program = setup + recipeParser.parse(pegcodeblock.value);

    // clear any remaining timers
    for (var i = 1; i < 99999; i++)
        window.clearInterval(i);  
    
    // load new program
    try {
      sculptToMinimalRenderer(newCanv, program);
    }
    catch(e) {
      errorOutput.innerText = e;
    }
    let draw = document.getElementById("draw");
    draw.innerHTML = null;
    draw.appendChild(newCanv);

    // set overlap div
    document.getElementById('overlapper').style.height = newCanv.clientHeight + "px";

    let overlap = document.getElementById('2d_canvas');
    overlap.height = newCanv.height;
    overlap.width = newCanv.width;

    // window.alert(`width: ${newCanv.width}\nheight: ${newCanv.height}\n clientWidth: ${newCanv.style.clientWidth}, clientHeight: ${newCanv.style.clientHeight}`);

  });

  document.getElementById('updateBtn').click();

}, false);
