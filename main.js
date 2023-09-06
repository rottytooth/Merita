const codeblock = document.getElementById("script");
const pegcodeblock = document.getElementById("source");
const draw = document.getElementById("draw");

window.addEventListener('load', function() { 
  // if the function is loaded yet
  if (typeof sculptToMinimalRenderer === "function") 
    sculptToMinimalRenderer(document.querySelector('#output_canvas'), codeblock.value);

  document.getElementById("updateBtn").addEventListener("click", function() {
    let errorOutput = document.getElementById("error");
    errorOutput.innerHTML = "";
    let newCanv = document.createElement("canvas");
    try {
      sculptToMinimalRenderer(newCanv, codeblock.value);
    }
    catch(e) {
      errorOutput.innerText = e;
    }
    draw.innerHTML = null;
    draw.appendChild(newCanv);
  });
  
  document.getElementById("pegUpdateBtn").addEventListener("click", function() {
    recipe_nodes = recipeParser.parse(pegcodeblock.value);
    alert(
      `TITLE: ${recipe_nodes.title}\n` +
      `INGREDIENTS: ${recipe_nodes.ingredients.length}\n` +
      `INSTRUCTIONS: ${recipe_nodes.instructions.length}`
    );
  });


}, false);

