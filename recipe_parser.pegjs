{
  const color_set = [
    "vec3(0.714,0.494,0.192)",
    "vec3(0.208,0.216,0.165)",
    "vec3(0.392,0.486,0.282)",
    "vec3(0.788,0.714,0.522)",
    "vec3(0.541,0.612,0.494)",
    "vec3(0.706,0.396,0.216)",
    "vec3(0.514,0.314,0.204)",
    "vec3(0.863,0.784,0.537)",
    "vec3(0.847,0.675,0.329)",
    "vec3(0.4,0.373,0.263)"
  ];
  
  const food_colors = {
	"sugar":	"vec3(0.1,0.1,0.1)",
	"cornstarch":	"vec3(0.9,0.2,0.9)",
	"water":	"vec3(0.1,0.3,0.9)",
	"orange juice": "vec3(0.175,0.2,0.4)",
	"salt": "vec3(34,0.5,0.7)",
	"egg": "vec3(5, 0.67, 0)",
	"orange": "vec3(sin(sin(time)),0.67,0)",
	"lemon juice": "vec3(.7, .9, 0)",
	"butter": "vec3(0.1, 0.1, 0.8)"
  };

  const movement = {
    "blend": "blend(abs(sin(time))/%x% + 1/%y%);",
    "roll": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    "trim": `
    union();
    color(0.1,0.1,cos(time));
    rotateY(time);
    torus(0.5,0.2);
    difference();
    displace(.5,0,0)
    box(.3,.25,.15)
    `,
    "wrap": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    "mix": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    "stir": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    "add": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    "cool": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    "return": "reset();"
  };
  
  const bread = `
reset();
union();
displace(sin(time/3));
rotateX(time/2);
color(0.7,0.5,0.3);
box(0.28, 0.03, 0.28);
mirrorX();
displace(0.15,0,0.18);
cylinder(0.18, 0.03);

reset();
displace(sin(time/3));
rotateX(time/2);
let noiseScale = 4;
let t = getSpace();
let h= 0.5 * noise(noiseScale * t + time) + 0.5;

color(1*h,0.4*h,0.1*h);
box(0.3, 0.03, 0.3);

mirrorX();
displace(0.15,0,0.18);
cylinder(0.2, 0.03);
reset();
`;

const torte = `
union;
rotateZ(sin(time) / 3);
rotateX(sin(time) * 2);
displace(0,0,cos(time) / 4);

let torte_scale = 2.0;
let torte_s = getSpace();
let torte_n = 0.2*noise(torte_scale * torte_s + time);
let torte_noiseScale = 10;
let torte_t = getSpace();
let torte_h = 1.9 * noise(torte_noiseScale * torte_t + time) + .75;


color(.38*torte_h,.1*torte_h,cos(time)*torte_h);
rotateY(time);

torus(.5,.2);
difference();
displace(.5,0,0);
box(.3,.25,.15);

color(.3,.1,0);
union();
displace(-.5,-.16,0);
cylinder(.69,.1);
difference();
cylinder(.33,.2);
displace(.5,0,0);
box(.3,.25,.15);
`

const pickles = `
	reset();
    union();
    let scale = 0.05
    let freq = 4
    let s = getSpace()
    let n = noise(s * freq + time) * scale
    n = noise(vec3(n+time*0,n+0.1-time*0.1,n+0.5-time*0.1)*2.1)*0.01

	displace(0,-.4,0);

    color(n,n*7.5,0);
    mirrorX();
    blend(0.2);
    displace(.4,-0.5);
    sphere(0.3+n*2);
    displace(0,.2,.0);
    sphere(0.3+n*2);
    displace(0,.4,0.);
    sphere(0.3+n*2);
    displace(0,.4);
    sphere(0.3+n*2);

`
const kids = `

  let x = 0;let y = 0;
  let img1 = new Image();
  img1.src = 'img/boy and girl.png';

  let timer = setInterval(function() {
    let overlap = document.getElementById('2d_canvas');
    const ctx = overlap.getContext("2d");
    if (x > overlap.width || y > overlap.height) { 
      x = 0;
      y = 0;
    }
    if (x % 100 == 0) 
      ctx.clearRect(0, 0, overlap.width, overlap.height);
    
    ctx.drawImage(img1, x, y, 295 * 2, 225 * 2);

    x+=4;y+=4;
  }, 200); 
`;

const second_bread = `
  let img_dog = new Image();
  img_dog.src = 'img/merita_bread.png';

  let timer = setInterval(function() {
    let overlap = document.getElementById('2d_canvas');
    const ctx = overlap.getContext("2d");

	ctx.clearRect(0, 0, overlap.width, overlap.height);
    
    ctx.drawImage(img_dog, Math.floor(Math.random() * overlap.width), Math.floor(Math.random() * overlap.height), 1098, 615);
  }, 2000);
`;

const dog = `
reset();
union();
color(0.256,0,0);

let halfCircle = shape(() => {  

  sphere(0.2);
  difference();
  displace(0,-.15,0);
  box(0.21,0.28,0.21);
})

let hat =(() => {
  
	halfCircle();
	blend(0.04);
	displace(0,0.23,0);
	sphere(0.02)
	displace(0,-0.08,0);
	torus(0.16,0.01);
})

displace(sin(time));
displace(0,0.1,0.4);
hat();

//nose
reset();
displace(sin(time));
color(0,0,0);
displace(0.02,-.1,-.2);
sphere(0.050);

//eyes
reset();
displace(sin(time));
mirrorX();
displace(0.15,0,0);
sphere(0.05);

//ears
color(.94,.80,.40);
displace(0.35,-0.3,0.3);

let s = getSpace();
displace(0,sin(s.y*3)*0.2, 0);
sphere(0.2);

//head
reset();
displace(sin(time));
blend(0.1);

rotateX(PI/6);
displace(0,0,0.50);
sphere(0.48);
blend(0.1);
displace(0,-.28,-.4);
sphere(0.20);

reset();
displace(sin(time));
displace(0,-0.7,0.3);


function oscillate(x) {
  return sin(24*x)*0.5;
}

rotateY(time);

let dog_n = toSpherical(getSpace());
let dog_m = min(oscillate(dog_n.y),oscillate(dog_n.z));
color(vec3(dog_m+0.5));
cylinder(0.5,0.03);
`
}

Program = t:Title newline ing:IngredientBlock newline ins:InstructionBlock _?
{
  let code = "";
  
  if (t.toLowerCase().includes("torte")) {
  	code += torte;
  }
  
  let bread_done = false;
  
  for(let i = 0; i < ing.length; i++) {
  
  	code += 'displace(' + i*.1 + ',' + i*(-.1) + ',' + i*.1 + ');\n';
  
  	// if it's bread, show the bread
    if (ing[i].type == "Merita") {
    	if (!bread_done) {
  			code += bread;
            bread_done = true;
        } else {
        	code += second_bread;
        }
  		continue;
  	}
    if (ing[i].food.includes("Pimiento")) {
    	code += kids;
        continue;
    }
    if (ing[i].food.includes("pickle")) {
    	code += pickles;
        continue;
    }
    if (ing[i].food.includes("salt") || ing[i].food.includes("pepper")) {
    	code += dog;
        continue;
    }
    
    if (i > 0 && i % 3 == 0) {
      code += `
      reset();
      blend(abs(sin(time))/%x%);
      `.replace("%x%",i);
    }

    // match color to ingredient. if there is no color defined, grab them in order from the preset list
    let matched_color = false;
    for (const [key, value] of Object.entries(food_colors)) {
      if (ing[i].food.includes(key)) {
          code += "color(" + value + ");\n";
            matched_color = true;
        }
    }
    if (!matched_color)
    code += "color(" + color_set[i] + ");\n";

    let shape = "";

    let sizes = ing[i].food.split(/\s+/).map(({length}) => length);
    if (ing[i].size != null) 
    	sizes.push(ing[i].size.length);
    while (sizes.length < 7) {
      sizes.push(sizes[sizes.length - 1]);
    }

    if (i < ins.length) {
      for (const [key, value] of Object.entries(movement)) {
        if ('instr' in ins[i] && ins[i].instr.includes(key)) {
          let ins_sizes = ins[i].instr.split(/\s+/).map(({length}) => length);
          let prep_value = value.replace("%x%",ins_sizes[0]);
          prep_value = prep_value.replace("%y%",ins_sizes[1]);
          code += "\n" + prep_value;
        }
      }
    }

    // determine shape from size
    if (ing[i].number != null) {
      if (ing[i].number < 1.5)
        shape = "sphere(" + sizes[0] + ");\n";
      if (ing[i].number <= 2)
        shape = "torus(" + 1/sizes[0] + ",1/" + sizes[1] + ",1/" + sizes[2] + ");\n";
      if (ing[i].number <= 3)
        shape = `line(vec3(1/${sizes[0]},1/${sizes[1]},1/${sizes[2] + 2}),vec3(1/${sizes[3]},1/${sizes[4]},1/${sizes[5]}),1/${sizes[6] + 2});\n`;
      else
        shape = `grid(1/${sizes[0]},1/${sizes[1]},1/(${sizes[2]} + 5));\n`;
    } else shape = `box(${1/sizes[0]},1/${sizes[1]},1/${sizes[2]});\n`;

    
    // determine ??? from action
    // for(let k = 0; k < ins.length; k++) {
    //   if (k.instr.toLowerCase().includes(ing[i].food.toLowerCase())) {
          
    //     }
    // }
    
    //code += ing[i].food +"\n";

	code += "displace(" + 1 / ing[i].food.length + ");\n";
    code += shape;
    // code += "sphere(" + ing[i].number * 0.1 + (i % 2 == 0 ? " * cos(time));\n" : " * sin(time));\n");
    
  }
  return code;
  return {
      "title": t,
        "ingredients": ing,
        "instructions": ins
    }
}

Title = d:[^\n]+[\n] { return d.join("").trim(); }

IngredientBlock = Ingredient+ 

Ingredient = n:Number? "\t" s:Size? f:Food
{
  var type = "";
  if (f.includes("Merita")) {
      type = "Merita";
    }

  return {
      number: n,
        size: s,
        food: f,
        type: type
    }
}

Number = i:Integer fr:Fraction?
{
  return i + fr;
} / fr:Fraction {
  return fr;
}

Size = s:"package" " ("[0-9] " oz.)"
{
	return s;
}
/ s:("tsp"/"tbsp"/"cups"/"cup"/"teaspoon"/"package") "."?
{
  return s;
}

Food = text:$(char+) newline
   { return text.trim(); }


InstructionBlock = Instruction+

Instruction
  = Output /
  c:[^.(;] d:[^.;]+ e:[.;]
  { 
    return { 
      instr: c.trim() + d.join("").trim(),
      end: e
    }; 
  } 

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

Fraction 
  = char:[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞] {
  const normalized = char.normalize("NFKD");
  const operands = normalized.split("⁄");
  return operands[0] / operands[1];
}

Output
 = _? "(" c:num_range _ o:[a-zA-Z]+ "."? _? ")"
 { 
 	return { 
    	type: "Output",
        count: c,
        content: o.join("").trim()
 	}; 
 } / _? [m,M] "akes" _? m:approx? _? c:num_range _ o:[^.]+ "." _?
 { 
 	return { 
    	type: "Output",
        count: c,
        modifiers: m,
        content: o.join("").trim()
 	}; 
} / _? "("? ([t,T] "his recipe" _?)? [s,S] "erves" _? m:approx? _? c:num_range "."? ")"? _?
 { 
 	return { 
    	type: "Output",
        count: c,
        modifiers: m,
        content: "people"
 	}; 
}

approx = a:("about"/"around") 
{
	return a;
}

num_range = l:[0-9]+ (" or " / "-") h:[0-9]+
{
	return {
    	low: parseInt(l.join("")),
        high: parseInt(h.join(""))
    };
} / c:[0-9]+
{
	return parseInt(c.join(""));
}

_ "whitespace"
  = [ \t\n\r]+
  
char = [^\n\r]
newline = '\n' / '\r' '\n'?