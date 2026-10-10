import * as T from 'three';

// Shared sculpted characters. Front-facing details follow the poster silhouettes.
function sculpt(parent, mat) {
  function mesh(geometry, color, x=0, y=0, z=0, p=parent) {
    const m=new T.Mesh(geometry,mat(color));m.position.set(x,y,z);
    m.castShadow=true;m.receiveShadow=true;p.add(m);return m;
  }
  function oval(color,x,y,z,sx,sy=sx,sz=sx,p=parent) {
    const m=mesh(new T.SphereGeometry(1,24,16),color,x,y,z,p);
    m.scale.set(sx,sy,sz);return m;
  }
  function stroke(color,points,r=.02,p=parent) {
    return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),Math.max(12,points.length*5),r,7,false),color,0,0,0,p);
  }
  function patch(shape,color,z,depth=.025,bevel=.025,p=parent) {
    return mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:5,steps:1,curveSegments:20}),color,0,0,z,p);
  }
  function rounded(x,y,w,h,r=.08) {
    const s=new T.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  return {mesh,oval,stroke,patch,rounded};
}
const P={white:0xfffcf3,ink:0x201c1b,blush:0xe8a0bb,red:0xa63f36,denim:0x355a80,cuff:0x7d9baf,thread:0xc8aa6d,leaf:0x428847,orange:0xf48935};

export function addRabbit(world,moving,mat,x,z,scale=1,theme=0) {
  const g=new T.Group();g.name='poster-rabbit';g.position.set(x,.2,z);g.scale.setScalar(scale);world.add(g);
  const {oval,stroke,patch,rounded,mesh}=sculpt(g,mat);
  const sitting=theme!==0,lake=theme===2;
  const body=new T.Group();g.add(body);
  oval(lake?0x73a4be:P.red,0,.85,0,.49,.52,.30,body);
  if(!lake) {
    for(const y of [.64,.83,1.02,1.19]) {
      const band=mesh(new T.CylinderGeometry(.47,.47,.085,40),P.white,0,y,0,body);band.scale.z=.63;
    }
  }
  // Sleeve segments are attached to shoulder pivots so waving stays coherent.
  const arms=[];
  for(const side of [-1,1]) {
    const arm=new T.Group();arm.position.set(side*.46,1.08,0);body.add(arm);arm.rotation.z=side*.54;arms.push(arm);
    oval(lake?0x73a4be:P.red,0,-.24,0,.18,.39,.18,arm);
    if(!lake)for(const y of [-.1,-.29,-.45])mesh(new T.CylinderGeometry(.183,.183,.10,24),P.white,0,y,0,arm);
    oval(P.white,0,-.57,.015,.175,.20,.16,arm);
  }
  if(lake) {
    patch(rounded(-.46,.45,.92,.73,.1),0x73a4be,.19,.04,.04,body);
    for(const side of [-1,1]) {
      const lapel=new T.Shape();lapel.moveTo(side*.06,1.24);lapel.lineTo(side*.35,1.19);lapel.lineTo(side*.19,.92);lapel.closePath();patch(lapel,0x94bbcf,.31,.025,.007,body);
    }
    stroke(0x527d98,[[0,.46,.35],[0,1.05,.35]],.018,body);
    patch(rounded(.16,.73,.22,.19,.035),0x396788,.34,.02,.008,body);
    const emblem=mesh(new T.TorusGeometry(.10,.016,6,24),P.white,-.22,.84,.35,body);emblem.rotation.z=.4;
    stroke(P.white,[[-.27,.76,.35],[-.18,.92,.35]],.013,body);
  } else {
    // Denim bib, blue shoulder straps, brass buttons, stitched front pocket.
    oval(P.denim,0,.59,.02,.49,.40,.32,body);
    patch(rounded(-.36,.64,.72,.49,.055),P.denim,.27,.075,.03,body);
    for(const side of [-1,1]) {
      stroke(P.denim,[[side*.31,1.23,.15],[side*.30,1.08,.31],[side*.27,.98,.39]],.06,body);
      oval(P.thread,side*.27,.99,.417,.053,.053,.018,body);
      for(let i=0;i<5;i++)stroke(P.thread,[[side*.31,1.17-i*.038,.38],[side*.31,1.154-i*.038,.38]],.007,body);
    }
    const pocket=new T.Shape();pocket.moveTo(-.22,.87);pocket.lineTo(.22,.87);pocket.lineTo(.20,.69);pocket.quadraticCurveTo(0,.55,-.20,.69);pocket.closePath();patch(pocket,0x2e5075,.376,.018,.009,body);
    for(let i=0;i<7;i++)stroke(P.thread,[[-.19+i*.058,.849,.41],[-.163+i*.058,.849,.41]],.007,body);
    for(const side of [-1,1])for(let i=0;i<4;i++)stroke(P.thread,[[side*(.18-i*.018),.79-i*.04,.408],[side*(.175-i*.018),.769-i*.04,.408]],.007,body);
  }
  for(const side of [-1,1]) {
    const leg=new T.Group();leg.position.set(side*.26,.47,0);body.add(leg);
    if(sitting)leg.rotation.x=-.9;
    oval(lake?0x6598b3:P.denim,0,-.18,.015,.245,.32,.25,leg);
    oval(lake?0x87b2c8:P.cuff,0,-.35,.04,.25,.09,.255,leg);
    oval(lake?0x343536:P.white,0,-.45,.14,.285,.10,.40,leg);
    oval(lake?0x343536:P.red,0,-.40,.18,.267,.14,.36,leg);
    if(!lake) {
      oval(P.white,0,-.31,.23,.14,.06,.16,leg);
      for(let i=0;i<2;i++)stroke(P.white,[[-.115,-.30+i*.03,.23],[0,-.285+i*.03,.29],[.115,-.30+i*.03,.23]],.016,leg);
    }
  }
  oval(P.white,0,.61,-.33,.19,.18,.16,body);
  // One continuous silhouette avoids seams between the cheeks and ears.
  const head=new T.Shape();head.moveTo(-.78,1.49);
  head.bezierCurveTo(-1.01,1.73,-.98,2.12,-.72,2.34);
  head.lineTo(-.72,2.90);head.bezierCurveTo(-.74,3.30,-.27,3.40,-.19,3.01);
  head.lineTo(-.10,2.55);head.quadraticCurveTo(0,2.59,.09,2.56);
  head.lineTo(.25,3.04);head.bezierCurveTo(.35,3.39,.81,3.27,.73,2.91);
  head.lineTo(.58,2.33);head.bezierCurveTo(.94,2.18,1.02,1.75,.82,1.51);
  head.bezierCurveTo(.54,1.25,-.51,1.22,-.78,1.49);head.closePath();
  patch(head,P.white,-.22,.59,.09);
  // Flat graphic face, wide cheeks and the reference's double-lobed smile.
  for(const side of [-1,1]) {
    const eye=oval(P.ink,side*.36,1.87,.477,.085,.156,.031);eye.rotation.z=-side*.11;
    oval(P.blush,side*.64,1.61,.472,.135,.065,.022);
  }
  oval(P.ink,0,1.73,.488,.066,.062,.026);
  stroke(P.ink,[[-.19,1.60,.49],[-.13,1.53,.49],[-.05,1.54,.49],[0,1.57,.49],[.07,1.53,.49],[.14,1.54,.49],[.20,1.60,.49]],.032);
  // Carrot hair clip: tapered orange root, engraved marks, three green leaves.
  const clip=new T.Group();clip.position.set(-.48,2.51,.48);clip.rotation.z=-.31;g.add(clip);
  const root=new T.Shape();root.moveTo(-.24,-.095);root.quadraticCurveTo(-.34,0,-.24,.09);root.lineTo(.09,.13);root.quadraticCurveTo(.20,0,.08,-.13);root.closePath();patch(root,P.orange,0,.035,.025,clip);
  for(let i=0;i<3;i++){const leaf=oval(P.leaf,.14+i*.055,.06+(i%2)*.08,.02,.08,.15,.045,clip);leaf.rotation.z=-.5+i*.55}
  for(let i=0;i<2;i++)stroke(0xdc702c,[[-.16+i*.12,-.025,.07],[-.12+i*.12,.052,.07]],.014,clip);
  // Garden iris and lake lotus leaf umbrella are held by the left hand.
  let plant=null;
  if(theme===0) {
    plant=new T.Group();plant.position.set(-1.03,.72,.12);plant.rotation.z=.1;g.add(plant);
    stroke(P.leaf,[[0,0,0],[-.10,.7,0],[-.15,1.55,0],[-.19,2.1,0]],.046,plant);
    const leaf=oval(P.leaf,-.19,.84,-.02,.115,.54,.045,plant);leaf.rotation.z=.38;
    for(let i=0;i<6;i++) {const angle=i*Math.PI/3;const p=oval(i%2?0x6f579b:0x8370ad,-.18+Math.cos(angle)*.33,2.10+Math.sin(angle)*.31,.02,.28,.38,.10,plant);p.rotation.z=angle-Math.PI/2;if(i<3)oval(0xf4cf5b,-.18+Math.cos(angle)*.16,2.10+Math.sin(angle)*.16,.13,.10,.13,.025,plant)}
  } else if(lake) {
    plant=new T.Group();plant.position.set(-.93,.7,.08);g.add(plant);
    stroke(P.leaf,[[0,0,0],[-.04,1.3,0],[-.12,2.45,0]],.043,plant);
    const leaf=oval(0x64a840,-.1,2.55,0,.94,.09,.67,plant);leaf.rotation.z=-.12;
    for(let i=0;i<7;i++) {const a=i*Math.PI*2/7;stroke(0x529636,[[-.1,2.64,0],[-.1+Math.cos(a)*.42,2.65,Math.sin(a)*.31],[-.1+Math.cos(a)*.85,2.59,Math.sin(a)*.57]],.014,plant)}
    oval(0xe9f8d9,.2,2.67,.12,.075,.035,.07,plant);
  }
  const baseY=sitting?.35:.2;
  moving.push(t=>{g.position.y=baseY+Math.sin(t*1.7)*.026;g.rotation.y=.32+Math.sin(t*.65)*.045;arms[1].rotation.z=.52+Math.sin(t*1.6)*.045;if(plant)plant.rotation.z=.08+Math.sin(t*.8)*.025});
  return g;
}

export function addBeeCarrot(world,moving,mat,x,z) {
  const g=new T.Group();g.name='carrot-in-bee-costume';g.position.set(x,.22,z);world.add(g);
  const {oval,stroke,mesh}=sculpt(g,mat);
  const gold=0xf5d273,brown=0x684331;
  // Pale golden hood surrounds an orange carrot face; leaves remain exposed.
  oval(gold,0,1.29,0,.59,.62,.36);
  oval(0xf5b650,0,1.28,.30,.46,.46,.13);
  oval(P.orange,0,1.28,.40,.385,.385,.055);
  for(const side of [-1,1]) {
    const white=oval(P.white,side*.145,1.40,.456,.115,.17,.027);white.rotation.z=side*.16;
    const eye=oval(0x344974,side*.145,1.40,.483,.067,.12,.019);eye.rotation.z=side*.16;
    stroke(gold,[[side*.35,1.78,0],[side*.52,2.01,.02],[side*.60,2.11,.04]],.027);
    oval(0xf0bf4c,side*.6,2.13,.04,.14);
    oval(brown,side*.34,.10,.06,.13,.13,.17);
  }
  stroke(P.ink,[[-.14,1.15,.469],[-.06,1.12,.469],[0,1.17,.469],[.075,1.12,.469],[.15,1.15,.469],[.16,1.21,.469]],.026);
  for(let i=0;i<3;i++) {const leaf=oval(i%2?0x67a342:P.leaf,(i-1)*.145,1.97,0,.14,.27,.08);leaf.rotation.z=(1-i)*.30;stroke(0x80b553,[[(i-1)*.14,1.83,.083],[(i-1)*.17,2.07,.083]],.016)}
  // Bee suit is a rounded abdomen with fitted horizontal brown bands.
  oval(gold,0,.54,0,.40,.52,.30);
  for(const y of [.25,.56,.84]) {
    const r=.40*Math.sqrt(1-((y-.54)/.52)**2);
    const stripe=mesh(new T.CylinderGeometry(r,r,.13,36),brown,0,y,0);stripe.scale.z=.765;
  }
  const stinger=mesh(new T.ConeGeometry(.10,.20,16),brown,0,-.01,-.10);stinger.rotation.z=Math.PI;
  const wings=[];
  for(const side of [-1,1]) {
    const wing=new T.Group();wing.position.set(side*.30,.63,-.20);g.add(wing);wings.push(wing);
    const top=oval(0xeaf3ed,side*.20,.16,0,.30,.16,.075,wing);top.rotation.z=side*.55;
    const lower=oval(0xeaf3ed,side*.18,-.15,0,.24,.14,.07,wing);lower.rotation.z=-side*.4;
    oval(brown,side*.41,.69,.17,.12,.14,.115);
  }
  // The sunflower held by the costumed carrot is visible in the poster.
  stroke(P.leaf,[[-.10,.33,.34],[-.36,.72,.37]],.025);
  for(let i=0;i<9;i++){const a=i*Math.PI*2/9;const petal=oval(0xe9b73e,-.37+Math.cos(a)*.20,.83+Math.sin(a)*.20,.42,.09,.15,.028);petal.rotation.z=a-Math.PI/2}
  oval(0x9b682e,-.37,.83,.457,.165,.165,.035);
  for(const [dx,dy] of [[-.04,.04],[.07,.035],[.02,-.075]])oval(brown,-.37+dx,.83+dy,.493,.025,.025,.012);
  moving.push(t=>{g.position.y=.24+Math.sin(t*2)*.07;g.rotation.y=.32+Math.sin(t*.75)*.06;g.rotation.z=-.08+Math.sin(t*1.5)*.06;wings.forEach((w,i)=>{w.rotation.y=Math.sin(t*8)*(i?-.20:.20)})});
  return g;
}
