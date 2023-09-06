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

Size = s:("tsp"/"tbsp"/"cups"/"cup") "."?
{
  return s;
}

Food = text:$(char+) EOL
   { return text.trim(); }


InstructionBlock = Instruction+ //Serves?

Instruction
  = c:[^.(;] d:[^.;]+ e:[.;]
  { 
    return { 
      instr: c + d.join("").trim(),
      end: e
    }; 
  }  / _? "(" d:[^)]+ ")"
  { 
    return { 
      instr: d.join("").trim(),
      end: ")",
      type: "Serving Size"
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

_ "whitespace"
  = [ \t\n\r]+
  
char = [^\n\r]
newline = '\n' / '\r' '\n'?
EOL = newline / !.