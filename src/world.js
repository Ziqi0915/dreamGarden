import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {addRabbit,addBeeCarrot} from './characters';
const C={green:0x6d995e,leaf:0x4e8452,yellow:0xf5c84e,pink:0xeb8da3,cream:0xfff7df,white:0xfffcf0,blue:0x496982,orange:0xee8545};
export function createWorld(el,theme,onReady){
 const scene=new T.Scene(); const night=theme===1;
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;el.appendChild(renderer.domElement);
 const camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(11,9,13);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.1,0);controls.enableDamping=true;controls.minDistance=9;controls.maxDistance=26;controls.maxPolarAngle=Math.PI/2.12;controls.enablePan=false;
 scene.add(new T.HemisphereLight(night?0xaebeff:0xfff8e5,0x82957b,2.3));const sun=new T.DirectionalLight(0xffedcf,4);sun.position.set(-5,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9});sun.shadow.bias=-.0005;scene.add(sun);
 const world=new T.Group();scene.add(world);const moving=[];const mats=new Map();
 function mat(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.8}));return mats.get(color)}
 function mesh(g,color,parent=world,x=0,y=0,z=0){const m=new T.Mesh(g,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function ball(p,c,x,y,z,sx,sy=sx,sz=sx){const m=mesh(new T.SphereGeometry(1,24,16),c,p,x,y,z);m.scale.set(sx,sy,sz);return m}
 function box(p,c,x,y,z,w,h,d){return mesh(new T.BoxGeometry(w,h,d),c,p,x,y,z)}
 function cyl(p,c,x,y,z,r,h,r2=r){return mesh(new T.CylinderGeometry(r2,r,h,48),c,p,x,y,z)}
 function group(x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);world.add(g);return g}
 function label(text,w,h){const cv=document.createElement('canvas');cv.width=1024;cv.height=256;const ctx=cv.getContext('2d');ctx.fillStyle='#fff8df';ctx.font='900 100px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,128);const tx=new T.CanvasTexture(cv);const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tx,transparent:true,side:T.DoubleSide}));return m}
 cyl(world,night?0x54618c:0xb3ba89,0,-.32,0,5.4,.65);cyl(world,night?0x487d9e:theme===2?0x80bfc5:0xa9bd7e,0,.02,0,5.36,.16);
 // sculpted pebble edge
 for(let i=0;i<55;i++){const a=i/55*Math.PI*2;ball(world,night?0x7a87ae:0xe1d4b3,Math.cos(a)*5.1,.17,Math.sin(a)*5.1,.19,.13,.17)}
 function flower(x,z,size=1,color=C.pink){const g=group(x,.16,z);g.scale.setScalar(size);cyl(g,C.leaf,0,.48,0,.045,.85);const leaf=ball(g,C.green,.17,.35,0,.23,.065,.12);leaf.rotation.z=.5;for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ball(g,color,Math.cos(a)*.23,1+Math.sin(a)*.23,0,.19,.19,.095)}ball(g,C.yellow,0,1,.1,.14,.14,.08);moving.push(t=>{g.rotation.z=Math.sin(t*1.2+x)*.065});return g}
 function bush(x,z,s=1){const g=group(x,.15,z);for(let i=0;i<5;i++)ball(g,i%2?C.green:C.leaf,Math.sin(i*2.3)*.4,.35+i%2*.2,Math.cos(i*2.3)*.3,.52,.55,.5);g.scale.setScalar(s);return g}
 function rabbit(x,z,scale=1){return addRabbit(world,moving,mat,x,z,scale,theme)}
 function carrot(x,z){const g=group(x,.24,z);ball(g,C.orange,0,.45,0,.43,.47,.4);for(let i=0;i<3;i++){const leaf=ball(g,C.leaf,(i-1)*.17,.96,0,.13,.3,.11);leaf.rotation.z=(1-i)*.4}for(const s of [-1,1]){ball(g,C.white,s*.15,.52,.36,.1,.14,.04);ball(g,0x30312d,s*.15,.52,.397,.05,.075,.022)}ball(g,0x30312d,0,.3,.39,.08,.03,.02);moving.push(t=>{g.rotation.z=Math.sin(t*1.7+z)*.09});return g}
 function bee(x,y,z){const g=group(x,y,z);ball(g,C.yellow,0,0,0,.3,.29,.44);for(const k of [-.18,.12]){const stripe=cyl(g,0x554431,0,0,k,.3,.09);stripe.rotation.x=Math.PI/2}for(const s of [-1,1]){ball(g,0xfff8ed,s*.28,.2,0,.24,.08,.33);ball(g,0x302c29,s*.1,.07,.4,.045)}moving.push(t=>{g.position.y=y+Math.sin(t*2+x)*.23;g.position.x=x+Math.sin(t*.8)*.4;g.rotation.z=Math.sin(t*5)*.12})}
 function arch(){const g=group(-2.2,.16,-1.8);const a=mesh(new T.TorusGeometry(1.35,.22,16,48,Math.PI),C.leaf,g,0,1.55,0);for(const s of [-1,1])cyl(g,C.leaf,s*1.35,.8,0,.22,1.6);const l=label('STAYREAL',2.4,.6);l.position.set(0,2.2,.26);g.add(l);for(let i=0;i<9;i++){const a=i/8*Math.PI;const f=flower(-2.2+Math.cos(a)*1.5,-1.8,.45,i%2?C.yellow:C.pink);f.position.y=1.55+Math.sin(a)*1.5}}
 function fence(x,z,n=5){const g=group(x,.12,z);for(let i=0;i<n;i++){box(g,C.cream,i*.43,.48,0,.14,.9,.13);const cap=mesh(new T.ConeGeometry(.105,.16,4),C.cream,g,i*.43,.99,0);cap.rotation.y=Math.PI/4}box(g,C.cream,(n-1)*.215,.35,0,n*.43,.09,.09);box(g,C.cream,(n-1)*.215,.7,0,n*.43,.09,.09)}
 function cloud(x,y,z){const g=group(x,y,z);for(let i=0;i<4;i++)ball(g,night?0xa0a5cc:C.white,(i-1.5)*.4,Math.sin(i)*.13,0,.45,.25,.25);moving.push(t=>{g.position.x=x+Math.sin(t*.25+x)*.25})}
 function boat(x,z,large=false){const g=group(x,.42,z);const hull=ball(g,large?0x253e68:0xb76f3e,0,0,0,large?1.8:1.1,.35,large?.85:.48);box(g,C.cream,0,.35,0,large?3:1.75,.18,large?1.3:.75);box(g,large?C.cream:0xc99755,0,.65,-.08,large?2.15:1.1,.5,large?.85:.65);box(g,large?C.yellow:0xdaa343,0,.97,0,large?2.4:1.4,.12,large?1:.8);for(let i=0;i<5;i++)box(g,0x477a96,(i-2)*(large?.4:.21),.7,large?.46:.34, .13,.21,.7); // windows
 moving.push(t=>{g.position.y=.43+Math.sin(t*1.2+x)*.09;g.rotation.z=Math.sin(t*1.3)*.035;g.position.x=x+Math.sin(t*.3)*.23});return g}
 if(theme===0){
 arch();rabbit(.7,1.3,1.12);addBeeCarrot(world,moving,mat,-1.05,1.8);bee(-.8,2.7,1.3);bee(3,2,-1);
 for(let i=0;i<28;i++){const a=i*2.399;const r=3.3+(i%3)*.45;flower(Math.cos(a)*r,Math.sin(a)*r,.55+(i%4)*.13,[C.pink,C.yellow,C.white,0xdd7756][i%4])}
 for(const p of [[-3.5,-1],[3,-2],[0,-3.8],[-3,2.3]])bush(...p);
 fence(-1.4,-3.7,8);fence(2.5,-2.7,4);
 const path=mesh(new T.CylinderGeometry(1.4,1.4,.025,48),0xe5d4b0,world,.4,.125,1.1);path.scale.set(1,1,1.5);
 const sign=group(2.8,.2,.1);box(sign,0xc59253,0,.65,0,1,.95,.12);box(sign,0x475447,0,.67,.075,.85,.78,.02);const l=label('BE HAPPY',.76,.21);l.position.set(0,.76,.1);sign.add(l);for(const s of [-1,1])box(sign,0xc59253,s*.37,.23,0,.09,.5,.1);
 const cart=group(-2.7,.3,1.7);box(cart,0xcb644d,0,.32,0,1.1,.5,.65);for(const s of [-1,1]){const w=cyl(cart,0x3d4840,s*.6,0,0,.22,.1);w.rotation.z=Math.PI/2}box(cart,C.yellow,.9,.3,0,.9,.06,.08);for(let i=0;i<4;i++){const f=flower(-2.9+i*.18,1.7,.45,C.yellow);f.position.y=.75}
 } else if(theme===1){
 // The seated bunny rests on a pier, matching the poster's river terrace.
 box(world,0xa6acb7,2.6,.29,1.15,2.9,.45,1.95);box(world,C.cream,2.6,.525,1.15,3.02,.08,2.04);
 for(let i=0;i<8;i++)cyl(world,C.cream,1.25+i*.38,.84,.25,.035,.55);
 box(world,C.cream,2.58,1.12,.25,2.8,.055,.055);box(world,C.cream,2.58,.79,.25,2.8,.035,.035);
 rabbit(2.3,1.2,.86);const pierCarrot=carrot(3.6,1.6);pierCarrot.position.y=.60;boat(-.6,1.4,true);const moon=ball(world,C.yellow,.8,4.5,-3.3,1.62,1.62,.36);for(let i=0;i<8;i++)ball(world,0xe7b848,.8+Math.sin(i*2.4)*1.2,4.5+Math.cos(i*2.4)*1.2,-2.95,.14+(i%3)*.05,.14,.025);
 const tower=group(-3,.12,-2);cyl(tower,C.cream,0,2,0,.17,4);for(const y of [1,2.8,4]){ball(tower,0xc76c95,0,y,0,y===2.8?.65:.4,.38,y===2.8?.65:.4);cyl(tower,0x656494,0,y-.05,0,y===2.8?.66:.41,.14)}cyl(tower,C.cream,0,4.7,0,.06,1.2);ball(tower,C.yellow,0,5.32,0,.09);
 for(let i=0;i<8;i++){const x=-1.9+i*.7;const h=.7+(i*7%5)*.32;box(world,[0x526d9e,0x6588ab,0x7270a0][i%3],x,h/2,-3.2,.48,h,.55);for(let k=0;k<3;k++)box(world,C.yellow,x,h*.25+k*.25,-2.91,.09,.1,.02)}
 for(let i=0;i<18;i++){const a=i*2.4;ball(world,C.yellow,Math.cos(a)*4.1,2.6+(i%5)*.6,-2-Math.sin(a),.045)}
 for(let i=0;i<18;i++){const ring=mesh(new T.TorusGeometry(.22+(i%3)*.1,.012,5,32),0xb6d9da,world,Math.sin(i*4)*4.3,.16,Math.cos(i*4)*4.1);ring.rotation.x=Math.PI/2;moving.push(t=>{ring.scale.setScalar(1+Math.sin(t+i)*.2)})}
 }else{
 // Cream stone landing supports the lakeside sitting pose.
 cyl(world,0xd7c4a5,1.8,.30,1.6,1.15,.45);cyl(world,0xecdbc0,1.8,.535,1.6,1.18,.06);
 for(let i=0;i<7;i++){const a=i*.9;ball(world,0xf5e8d0,1.8+Math.cos(a)*.89,.575,1.6+Math.sin(a)*.89,.12,.014,.09)}
 rabbit(1.8,1.6,1);carrot(.3,2.4);boat(-1.9,.8);boat(2.7,-2.2);
 const bridge=group(-2,.2,-2.3);const arc=mesh(new T.TorusGeometry(1.1,.2,10,40,Math.PI),0xe9d5b3,bridge,0,0,0);arc.scale.set(1.7,1,1);for(let i=0;i<13;i++){const x=(i-6)*.28;const y=Math.sqrt(Math.max(0,1-(x/1.85)**2));box(bridge,C.cream,x,y+.33,.2,.075,.45,.08)}
 const pagoda=group(-3.6,.2,-2.8);for(let i=0;i<5;i++){const w=1.15-i*.15;box(pagoda,0xf1d3ab,0,.25+i*.48,0,w,.4,w);const roof=mesh(new T.ConeGeometry(w*.87,.32,4),0x967495,pagoda,0,.53+i*.48,0);roof.rotation.y=Math.PI/4}cyl(pagoda,C.yellow,0,2.9,0,.04,.55);
 for(let i=0;i<18;i++){const a=i*2.4,r=3.4+(i%3)*.35;const x=Math.cos(a)*r,z=Math.sin(a)*r;const leaf=cyl(world,C.green,x,.21,z,.43,.045);if(i%2===0)flower(x,z,.55,C.pink);moving.push(t=>{leaf.position.y=.22+Math.sin(t+i)*.025})}
 const balloon=group(3.1,4.3,-1.8);ball(balloon,C.yellow,0,.4,0,.63,.84,.63);for(const s of [-1,1])cyl(balloon,0xb39756,s*.3,-.5,0,.018,.75);box(balloon,0xcf9345,0,-.95,0,.62,.4,.5);const l=label('DREAM',.85,.25);l.position.set(0,.4,.61);balloon.add(l);moving.push(t=>{balloon.position.y=4.3+Math.sin(t*.7)*.22;balloon.rotation.z=Math.sin(t*.5)*.08});
 for(const p of [[-4,1],[3.8,1],[.3,-4]])bush(...p,.7);
 }
 cloud(-3.7,4.5,-2.7);cloud(3.7,5,-3.7);
 const clock=new T.Clock();let raf;let paused=false;function resize(){const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}const ro=new ResizeObserver(resize);ro.observe(el);resize();let time=0;function render(){raf=requestAnimationFrame(render);const dt=clock.getDelta();if(!paused)time+=dt;moving.forEach(f=>f(time));controls.update();renderer.render(scene,camera)}render();onReady?.();return {pause(v){paused=v},reset(){camera.position.set(11,9,13);controls.target.set(0,1.1,0);controls.update()},zoom(f){camera.position.sub(controls.target).multiplyScalar(f).add(controls.target)},dispose(){cancelAnimationFrame(raf);ro.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose()});mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()}};
}
