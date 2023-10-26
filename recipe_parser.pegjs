{
  const setup = `
    let s = getSpace();
    let noiseScale = 340;
    // setGeometryQuality(10); 
    // setStepSize(.99);
    // setMaxIterations(50);
  
    // color behaviors
    let w_sugar = noise (s*80); 
    let n_cornstarch = 2.5 * noise(noiseScale * s + time) + 1.5;
    let o_range = .5 * noise((noiseScale -350) * s + time) +  1.2;
    let r_hotbrown = 1.9 * noise((noiseScale -350) * s) + 1;
    let p_fudge = .5 * noise((noiseScale -350) * s) + 1.5;
    let y_red = 1 * noise((noiseScale -350) * s) + 1.9;
    let i_silver = noise(s*0.3+vec3(time,0,0));
  `

  const get_3d_movement = (ins, selected_shape) => {
    for(let k = 0; k < ins.length; k++) {
      // match ingredient to that instruction
      if (selected_shape != undefined && ins[k].instr != undefined && 
        selected_shape.keywords.some(v => ins[k].instr.toLowerCase().includes(v))) {
        // find movement in that instruction
        for (const [key, value] of Object.entries(movements)) {
          if (ins[k].instr.toLowerCase().includes(key)) {
            return value;
          }
        }
      }
    }
    
    return "";
  };

  const color_set = [
    "vec3(.45*i_silver,.45*i_silver,.45*i_silver)",//silver goodness
    "vec3(0.003,0.008,0.005)",//garnish green
    "vec3(130*n_cornstarch,14*n_cornstarch,1.4*n_cornstarch)",//tender blended beige
    "vec3(0.7*y_red,0.04*y_red,0.02*y_red)",//tempting red
    "vec3(2,.7,0.1)",//laboratory beige
    "vec3(0.48*p_fudge,0.1*p_fudge,0*p_fudge)",//high quality fudge
    "vec3(0.28,0.6,0.35)",//festive teal
    "vec3(80*w_sugar,90*w_sugar,8*w_sugar)",//tested white
  	"vec3(18,1,0.1)", //margarine yellow
    "vec3(1,0.3,0)", //naturalcompanion yellow
    "vec3(0.028,0.06,0.035)", //every occasion teal
    "vec3(120*o_range,0.30*o_range,0*o_range)", //angel orange",
    "vec3(0.05*r_hotbrown,0.009*r_hotbrown,0)", //hot brown
    "vec3(2.8,0.08,0.03)" //outstanding red
  ];
  
  const food_colors = {
    "sugar":	"vec3(80*w,90*w,8*w)",
    "cornstarch":	"vec3(130*n_cornstarch,14*n_cornstarch,1.4*n_cornstarch);", //tender blended beige
    "water":	"vec3(0.28,0.6,0.35)", // festive teal
    "orange juice": "vec3(0.175,0.2,0.4)",
    "salt": "vec3(34,0.5,0.7)",
    "egg": "vec3(5, 0.67, 0)",
    "orange": "vec3(120*o_range,0.30*o_range,0*o_range)",
    "lemon juice": "vec3(.7, .9, 0)",
    "butter": "vec3(0.1, 0.1, 0.8)"
  };

  const movements = {
    "toast": "displace(0,sin(time)/4,0);",
    "blend": "blend(abs(sin(time))/2 + 1/2);",
    "roll": "displace(sin(time)/2,cos(time)/2,0);",
    "trim": `
    union();
    color(0.1,0.1,cos(time));
    rotateY(time);
    torus(0.5,0.2);
    difference();
    displace(.5,0,0);
    box(.3,.25,.15);
    `,
    "wrap": "displace(sin(time)/2,cos(time)/2,0);",
    "place": "displace(0,sin(time),0);",
    // "mix": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    // "stir": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    // "add": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    // "cool": "displace(sin(time)/%x%,cos(time)/%y%,0);",
    "return": "reset();"
  };
  
  const shapes =  {};

  shapes["tomato"] = {
    dim: "3D",
    code: `
      reset();
  
      let bpm_max = 256;
      let bpm = 128;
      let bpm_normalized = bpm/bpm_max;
      let arrangement_tom = [.5,.2];  
      let p_tomatoes={
        size:.6,
        scale:2,
        noise:0.6,
      };
      
      let apple = shape((p,newPos, newAngle,movingData) => { 
        //base
        let s = getSpace(); 
        let rad = p.size*p.scale;
        let adjustedSize  =  vec3(1,0.96, 1);
      setSpace(s * adjustedSize); 
        
        let yPos = p.size*p.scale*adjustedSize.y;
        displace(0,yPos, 0); // pivot around bottom

        displace(0,p.size*-2,0); // push to base xyz
        displace(newPos); //now finally move where user wants
        let yAngle = (1-newAngle.y )* 360  ;
      rotateX((time+newAngle.y*10)*100*PI/180); 
      rotateY((time+newAngle.y*10)*50*PI/180); 
        rotateZ(yAngle*PI/180); 
        
        
        //color Main
        let n =1 * noise( s*6.8 )*0.2;
        n = clamp(n,0,0.8);
        let red  =vec3(0.6,0.04,0.01); 
        
        let offset = vec3(-0.3,-0.6,-0.3);
        red+=offset*movingData;
        color(red); 
        sphere(rad );  
        displace(0,p.size*3*yPos,0); // push to base xyz
        difference();
        box(rad,rad,rad);
      
        mixGeo(0.29);
        
        displace(0,rad*-1.5,.02*rad);   
        let w = 1.8; 
        sphere(rad*.8);

        union();
        
        
        //stem
        
        displace(rad*-0.05,rad*-0.8,-.01*rad); 
        let pieceDist = 0.3; 
        
          
      let stems =4; 
        for(let i=0;i<stems;i++){
          let col = i%2 ? vec3(0,1,0 ) : vec3(1,0,1);

          let t = 1;
          
          let maxPos = 0.06+ movingData*0.2;
          let timeMult = 6;
          let pos1 =vec3(sin(i/stems)*sin(time*timeMult)*maxPos*(i-1)*rad,rad*pieceDist*(i-1),0);
          let pos2 = vec3(sin(i/stems )*sin(time*timeMult)*maxPos*(i+1)*rad,rad*pieceDist*i,0);
          let stemColor = vec3(0,0.3-0.3 *(stems-i)/stems,0.01);  ;
          
        let stemColorHighlited  =vec3(0.8,-0.3,0.01);  
          stemColor+=stemColorHighlited*movingData;
          color(stemColor);
          let thickness = rad*0.05;
          thickness *=0.8+i*0.08+movingData;
          color(0, .3, 0);
          line(pos1, pos2, thickness); 
          color(0, .1, 0);
          cylinder(.027, .03);
        };

      });  

      lightDirection(1,-1,1);
      shine(0.8);
      let apples = arrangement_tom.length; 
      for(let i=0;i<apples;i++){
        let perc = i/apples;
        let pos = vec3(0);
        let angle = vec3(0,perc,0);
        let rad = 0.3;
        let s = arrangement_tom[i];
        let percOffset = time*60*bpm_normalized;
        let percNew = (perc*360+percOffset);
        pos.x = sin(percNew*PI/180);
        
        pos.y = cos(percNew*PI/180); 
        pos.y+=rad+1.24;
        pos*=rad;
        
        let min = -0.2;
        let max = 0.1;
        p_tomatoes.scale = 0.35;
        p_tomatoes.scale+=s*0.1;
        s*=max;
        pos.x+=sin(percNew*PI/180)*s;
        pos.y+=cos(percNew*PI/180)*s;
          
        displace(pos);
        apple(p_tomatoes,pos,angle,arrangement_tom[i]);
        reset();
      }; 
    `,
    keywords: ["tomato","tomatoes"]
  }

  shapes["hash"] = {
    dim: "3D",
    code: `
      reset();
  
      %MOVEMENT%
      let scale_hash = 2.0;
      let s_hash = getSpace();
      let n_hash = 0.1*noise(scale_hash * s_hash + time);
      let noiseScale_hash = 50;
      let t_hash = getSpace();
      let h_hash = 1.9 * noise(noiseScale_hash * t_hash + time) + .75;

      color(2*h_hash,0.4*h_hash,0.1*h_hash);
      cylinder(0.9, 0.1 + n_hash);
    `,
    keywords: ["hash"]
  };

  shapes["shrimp"] = {
    dim: "3D",
    code: `
      reset();
  
		  let s_shrimp = getSpace ();
      let noiseScale_shrimp = 340;
      let y_shrimp = 1 * noise((noiseScale_shrimp -350) * s_shrimp) + 1.9;
      let n_shrimp = 2.5 * noise(noiseScale_shrimp -30 * s_shrimp + time) + .5;
      let p_shrimp = .5 * noise((noiseScale_shrimp -350) * s_shrimp) + 1.5;

  		displace(-.5,-.3,0);
//      %MOVEMENT%

      //salmon spread
      color(1.9*p_shrimp,0.09*y_shrimp,0.03*p_shrimp);


      let shrimp = shape (()=> {
        
      const ang = 2*nsin(0.3);
      cappedTorus(vec2(sin(ang),cos(ang)),0.5,0.15);
      blend(.2);
      displace(0.35,0.3,0);
      sphere(.2);
      blend(.3);
      displace(-0.3,0,0,);
      sphere(.15);

      });

      let shrimpTail = shape (()=> {

        let s = getSpace();
              
        rotateX(-30);
        displace(.05,s.y*.7,0.15);
        sphere(.14);
        blend(.3);
        reset();
    
        rotateX(30);
        displace(.05,s.y*.7,0.15);
        sphere(.14);
        
      });

      shrimp();
      reset();
  
  		displace(-.5,-.3,0);
//      %MOVEMENT%

      displace(-0.49,0,0);
      rotateX(14);
      rotateY(4);
      shrimpTail();

      reset();
  
  		displace(-.5,-.3,0);
//      %MOVEMENT%

      color(0,0,0);
      displace(0.6,0.2,.1);
      sphere(.05);
      reset();
  

  		displace(-.5,-.3,0);
//      %MOVEMENT%

      displace(0.6,0.2,-.11);
      sphere(.05);

    `,
    keywords: ["shrimp"]};

  shapes["olive"] = {
    dim: "3D",
    code: `
      reset();
      color(0,0.3,0);
      let scale_olive = 3;
      let n_olive = 0.1*noise(scale_olive * getSpace() + time);
      sphere(0.35 + n_olive);

      mirrorX();
      color(0.40,0.8,0.30);
      torus(.5,abs(sin(time))/32);

      color(n_olive,n_olive,n_olive);
      displace(cos(time),-0.2,cos(time));
      sphere(0.2);

    `,
    keywords: ["olive","olives"]
  }

  shapes["bread"] = {
    dim: "3D", 
    code: `
    reset();
    union();
    %MOVEMENT%
    color(0.7,0.5,0.3);
    box(0.28, 0.03, 0.28);
    mirrorX();
    displace(0.15,0,0.18);
    cylinder(0.18, 0.03);

    reset();
    %MOVEMENT%
    let t = getSpace();
    let h= 0.5 * noise(noiseScale * t + time) + 0.5;

    color(1*h,0.4*h,0.1*h);
    box(0.3, 0.03, 0.3);

    mirrorX();
    displace(0.15,0,0.18);
    cylinder(0.2, 0.03);
    reset();
    `, 
    keywords: ["bread","merita"],
    type: "Merita"};

  shapes["torte"] = { 
    dim: "3D",
    code: `
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
  `, keywords: ["torte","yolk"]};

  shapes["pickles"] = {
    dim: "3D",
    code: `
    reset();
    union();

    let freq = 4
    let n = noise(s * freq + time) * 0.05;
    n = noise(vec3(n+time*0,n+0.1-time*0.1,n+0.5-time*0.1)*2.1)*0.01

    displace(-.5,-.7,0);

    color(n,n*7.5,0);
//    mirrorX();
    blend(0.2);
    displace(.2,-0.25);
    sphere(0.15+n*2);
    displace(0,.1,.0);
    sphere(0.15+n*2);
    displace(0,.2,0.);
    sphere(0.15+n*2);
    displace(0,.2);
    sphere(0.15+n*2);
  `, keywords: ["pickle","pickles","dill"]};

  shapes["dog"] = {
    dim: "3D",
    code: `
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

    %MOVEMENT%
    displace(0,0.1,0.4);
    hat();

    //nose
    reset();

    %MOVEMENT%
    color(0,0,0);
    displace(0.02,-.1,-.2);
    sphere(0.050);

    //eyes
    reset();

    %MOVEMENT%
    mirrorX();
    displace(0.15,0,0);
    sphere(0.05);

    //ears
    color(.94,.80,.40);
    displace(0.35,-0.3,0.3);
    sphere(0.2);

    //head
    reset();

    %MOVEMENT%
    blend(0.1);

    rotateX(PI/6);
    displace(0,0,0.50);
    sphere(0.48);
    blend(0.1);
    displace(0,-.28,-.4);
    sphere(0.20);

    reset();
    %MOVEMENT%
    displace(0,-0.7,0.3);


    function oscillate(x) {
      return sin(24*x)*0.5;
    }

    rotateY(time);

    let dog_n = toSpherical(getSpace());
    let dog_m = min(oscillate(dog_n.y),oscillate(dog_n.z));
    color(vec3(dog_m+0.5));
    cylinder(0.5,0.03);
  `, keywords: ["salt","pepper"]};

  shapes["kids"] = { 
    dim: "2D",
    code: `
    let kids_x = 0;let kids_y = 0;
    let img1 = new Image();
    img1.src = 'img/boy_and_girl.png';

    setInterval(function() {
      let overlap = document.getElementById('2d_canvas');
      const ctx = overlap.getContext("2d");
      if (kids_x > overlap.width || kids_y > overlap.height) { 
        kids_x = 0;
        kids_y = 0;
      }
      if (kids_x % 100 == 0) 
        ctx.clearRect(0, 0, overlap.width, overlap.height);
      
      ctx.drawImage(img1, kids_x, kids_y, 295 * 2, 225 * 2);

      kids_x+=4;kids_y+=4;
    }, 200); 
  `, keywords: ["pimiento"]};

    shapes["eggs"] = { 
    dim: "2D",
    code: `
    let kids_x = 0;let kids_y = 0;
    let img1 = new Image();
    img1.src = 'img/devil_egg.png';

    setInterval(function() {
      let overlap = document.getElementById('2d_canvas');
      const ctx = overlap.getContext("2d");
      if (kids_x > overlap.width || kids_y > overlap.height) { 
        kids_x = 0;
        kids_y = 0;
      }
      if (kids_x % 100 == 0) 
        ctx.clearRect(0, 0, overlap.width, overlap.height);
      
      ctx.drawImage(img1, kids_x, kids_y, 295 * 2, 225 * 2);

      kids_x+=4;kids_y+=4;
    }, 200); 
  `, keywords: ["egg"]};
      
  shapes["second_bread"] = {
    dim: "2D",
    code:`
    let img_dog = new Image();
    img_dog.src = 'img/merita_bread.png';

    setInterval(function() {
      let overlap = document.getElementById('2d_canvas');
      const ctx = overlap.getContext("2d");

//      ctx.clearRect(0, 0, overlap.width, overlap.height);
      
      ctx.drawImage(img_dog, Math.floor(Math.random() * overlap.width), Math.floor(Math.random() * overlap.height), 1098, 615);
    }, 2000);
    `, keywords: ["bread","merita"],
    type: "Merita"};

  shapes["butter_family"] = {
    dim: "2D",
    code:`
    let img_meita = new Image();
    img_meita.src = 'img/merita_family.png';

    setInterval(function() {
      let overlap = document.getElementById('2d_canvas');
      const ctx = overlap.getContext("2d");

      ctx.clearRect(0, 0, overlap.width, overlap.height);
      
      ctx.drawImage(img_meita, Math.floor(Math.random() * overlap.width), Math.floor(Math.random() * overlap.height), 855, 619);
    }, 2100);
    `, keywords: ["butter","milk"]};

  shapes["second_salt"] = {
    dim: "2D",
    code:`
    let img_salt = new Image();
    img_salt.src = 'img/porcellain_dog.png';

    setInterval(function() {
      let overlap = document.getElementById('2d_canvas');
      const ctx = overlap.getContext("2d");

//      ctx.clearRect(0, 0, overlap.width, overlap.height);
      
      ctx.drawImage(img_salt, Math.floor(Math.random() * overlap.width), Math.floor(Math.random() * overlap.height), 275, 429);
    }, 1900);
    `, keywords: ["salt","pepper"]};

}

Program = t:Title newline ing:IngredientBlock newline ins:InstructionBlock _?
{
  let code = setup;
  
  // if torte in title, include torte code
  if (t.toLowerCase().includes("torte")) {
  	code += shapes["torte"].code;
  }
  
  for(let i = 0; i < ing.length; i++) {
  
    let shape = "";
    let completed = false;
    let selected_shape = undefined;

    if (ing[i].food.toLowerCase().includes("worcestershire")) {
      // alert("turned off dog");
      shapes["dog"].done = true;
    }

    for(var key in shapes) {
      if (Object.hasOwn(shapes[key], "type" && !shapes[key].done) 
        && ing[i].type == shapes[key].type) {

        shape += shapes[key].code;
        selected_shape = shapes[key];
        shapes[key].done = true;
        completed = true;
        break;
      } else if (ing[i].food.toLowerCase().split(" ").some(r=> shapes[key].keywords.map(shape => shape.toLowerCase()).includes(r))
       && !shapes[key].done) {
        // alert("in add shape for " + key);
        shape += shapes[key].code;
        selected_shape = shapes[key];
        shapes[key].done = true;
        completed = true;
        break;
      }
    }

    // determine movement from action
    let location = "";

    if (selected_shape && selected_shape.dim == "3D") {
      // starting place + movement
      location = `displace(${((i%3)*.3)},${((Math.floor(i/2)%3)*.3+.7)},0);\n` + get_3d_movement(ins, selected_shape);
    } else { // 2D
      location = "";
    }

    // apply movement
    while(shape.includes("%MOVEMENT%"))
      shape = shape.replace("%MOVEMENT%", location);
  

  	code += "displace(" + 1 / ing[i].food.length + ");\n";
    code += shape;
    
  } // end loop

  // comment out to see json representation
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