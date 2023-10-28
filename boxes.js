const boxes = (num) => {

    let ing_count = Math.round(num);

    const colorlist = {
      1: "color(0.25,0.6*s_sq.x,0.03*s_sq.y);",
      2: "color(.03*m_sq,.05*m_sq,0);",
      3: "color(25*y_sq,3*n_sq*y_sq,1.5*n_sq);",
      5: "color(3*y_sq,0.04*y_sq,0.03);",
      7: "color(vec3(abs(n2_sq)*2)+normal*.3+vec3(25,1,0));",
      11: "color(9*y_sq+m_sq,1*y_sq+m_sq,0);",
      13: "color(.4*p_sq,.28*p_sq,.04*p_sq);",
      17: "color(3,nsin(33*ds_sq[2]),0);",
      19: "color(1.9*p_sq,0.09*y_sq,0.03*p_sq);",
      23: "color(0,0.05*n_sq,0);",
      29: "color(16*m_sq,15*m_sq,8*m_sq);",
      31: "color(.28*m_sq*wave,.06*m_sq*wave,.002);"
    };

    if (ing_count > 10 && Object.keys(colorlist).includes(String(ing_count))) return "";


    let colorret = [];

    while (ing_count > 0) {
      for(let x = Object.keys(colorlist).length - 1; x >= 0; x--) {
        if (Object.keys(colorlist)[x] <= ing_count) {
          colorret.push(Object.keys(colorlist)[x]);
          ing_count -= Object.keys(colorlist)[x];
          break;
        }
      }
    }

    code = 
    `
      // SQUARES
      let s_size = 1
      let size_sq = vec3(s_size)
      let noiseScale_sq = 340;
      let s_sq = getSpace();
      let n1_sq = noise(s_sq*10);
      let n2_sq = noise(s_sq*10+vec3(0,0,time));        
      let n3_sq = noise(s_sq*2+vec3(0,0,time));
      let n4_sq = noise(s_sq*2+vec3(0,0,time) + noise(s_sq*2+vec3(0,0,time)));
      let n5_sq = noise(s_sq*4+time);
      let wave = sin(s_sq.y*100+time+400);
      let y_sq = 1 * noise((noiseScale_sq -350) * s_sq) + 1.9;
      let n_sq = 2.5 * noise(noiseScale_sq -30 * s_sq + time) + .5;
      let p_sq = .5 * noise((noiseScale_sq -350) * s_sq) + 1.5;
      let m_sq = .3 * noise((noiseScale_sq -380) * s_sq) + .5;

      function twirl(pn, tm) {
          let r = length(vec2(pn.x, pn.y));
          let th = atan(pn.x, pn.y);
          let r2 = 1;
          let f = 3; // # petals
          let amp = .06;
          let r3 = r2 + amp * sin(f * th + tm);
          let v = pn.z;
          let v2 = v + amp*cos(f * th - tm);
          let d = sqrt(v2 * v2 + r3 * r3) - 0.4;
        return [d * 0.28, v2, r3];
      }

      //row1
      %PLACEMENT%
      //olive gradient
      displace(-s_size,s_size*2,0);
      %COLOR%
      box(size_sq);

      //olive skin
      reset();
      %PLACEMENT%
      displace(0,s_size*2,0);
      %COLOR%
      box(size_sq);

      //pink lumpy spread
      reset();
      %PLACEMENT%
      displace(s_size,s_size*2,0);
      %COLOR%
      box(size_sq);

      //row2

      //tomato cherry
      reset();
      %PLACEMENT%
      displace(-s_size,s_size,0);
      // color(.4*p_sq,.28*p_sq,.04*p_sq);
      %COLOR%
      //color(1.9*p_sq,0.16*y_sq,0.03*p_sq);
      box(size_sq);

      //pink shrimp
      reset();
      %PLACEMENT%
      displace(0,s_size,0);
      %COLOR%
      box(size_sq);

      //yellow corn
      reset();
      %PLACEMENT%
      displace(s_size,s_size,0);
      %COLOR%
      box(size_sq);

      //row3

      //olive skin
      reset();
      %PLACEMENT%
      displace(-s_size,0,0);
      %COLOR%
      box(size_sq);

      //yellow yolk twirl
      reset();
      %PLACEMENT%


      let rad_sq = length(s_sq);
      let ds_sq = twirl(s_sq, time);
      %COLOR%
      box(size_sq);

      //salmon spread
      reset();
      %PLACEMENT%
      displace(s_size,0,0);
      %COLOR%
      box(size_sq);

      //row4

      //green garnish
      reset();
      %PLACEMENT%
      displace(-s_size,-s_size,0);
      %COLOR%
      box(size_sq);

      //merita enrich bread
      reset();
      %PLACEMENT%
      displace(0,-s_size,0);
      %COLOR%
      box(size_sq);

      //anchovie
      reset();
      %PLACEMENT%
      displace(s_size,-s_size,0);
      %COLOR%
      box(size_sq);
    `;

    const box_sizes = Math.ceil(9 / colorret.length);
    let z_count = 0;

    for (let z = colorret.length - 1; z >= 0; z--) {
        code = code.replace("%COLOR%", colorlist[colorret[z_count]]);
        if (z % box_sizes == 0)
            z_count++;
    }
    while(code.includes("%COLOR")) {
        code = code.replace("%COLOR%", colorlist[colorret[colorret.length - 1]]);
    }
    while(code.includes("%PLACEMENT%")) {
        code = code.replace("%PLACEMENT%","displace(-.7,0,1.5);")
    }

    return code;
} 

output = boxes(1.5);

