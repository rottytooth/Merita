const codeblock = document.getElementById("script");
const draw = document.getElementById("draw");

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

const default_recipe = "CREAMED SHRIMP ON TOAST";

const update_dropdown = () => {
  //    alert(document.getElementById("recipe").value);
  var client = new XMLHttpRequest();
  client.open('GET', `./recipes/${document.getElementById("recipe").value}`);
  client.onreadystatechange = function() {
    // alert(client.responseText);
    document.getElementById("source").innerHTML = client.responseText;
  }
  client.send();

}

window.addEventListener('load', function() { 
  // if the function is loaded yet
  if (typeof sculptToMinimalRenderer === "function") 
    sculptToMinimalRenderer(document.querySelector('#output_canvas'), codeblock.value);

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
    // try {
      // sculptToMinimalRenderer(newCanv, codeblock.value);
    // }
    // catch(e) {
    //   errorOutput.innerText = e;
    // }
    let draw = document.getElementById("draw");
    draw.innerHTML = null;
    draw.appendChild(newCanv);
  });
  
  document.getElementById("pegUpdateBtn").addEventListener("click", function() {
    const pegcodeblock = document.getElementById("source");
    recipe_nodes = recipeParser.parse(pegcodeblock.value);
    alert(
      `TITLE: ${recipe_nodes.title}\n` +
      `INGREDIENTS: ${recipe_nodes.ingredients.length}\n` +
      `INSTRUCTIONS: ${recipe_nodes.instructions.length}`
    );
  });


}, false);

