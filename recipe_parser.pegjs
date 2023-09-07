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
}

Program = t:Title newline ing:IngredientBlock newline ins:InstructionBlock _?
{
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