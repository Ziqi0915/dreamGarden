import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {addRabbit,addBeeCarrot} from './characters';
import {createTextilePalette,decoratePlushGarden,addFeltGround} from './textiles';
const C={green:0x6d995e,leaf:0x4e8452,yellow:0xf5c84e,pink:0xeb8da3,cream:0xfff7df,white:0xfffcf0,blue:0x496982,orange:0xee8545};
export function createWorld(el,theme,onReady){
 const scene=new T.Scene(); const night=theme===1;
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;el.appendChild(renderer.domElement);
 const defaultView=theme===0?new T.Vector3(6.5,5.8,14):new T.Vector3(11,9,13);
 const camera=new T.PerspectiveCamera(theme===0?30:34,1,.1,100);camera.position.copy(defaultView);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,theme===0?.85:1.1,0);controls.enableDamping=true;controls.minDistance=9;controls.maxDistance=26;controls.maxPolarAngle=Math.PI/2.12;controls.enablePan=false;
 scene.add(new T.HemisphereLight(night?0xaebeff:0xfff8e5,0x82957b,theme===0?1.8:2.3));const sun=new T.DirectionalLight(0xffedcf,theme===0?3.2:4);sun.position.set(-5,12,8);sun.castShadow=true;sun.shadow.mapSize.set(theme===0?1024:2048,theme===0?1024:2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9});sun.shadow.bias=-.0005;sun.shadow.normalBias=.025;sun.shadow.radius=3;if(theme===0)sun.shadow.autoUpdate=false;scene.add(sun);
 const world=new T.Group();scene.add(world);const moving=[];const mats=new Map();const textiles=theme===0?createTextilePalette():null;
 const denimColors=new Set([0x355a80,0x2e5075,0x9eb0bc]);const plushColors=new Set([0xfffcf3,0xfffcf0,0xf5d273]);
 function mat(color){if(!mats.has(color))mats.set(color,textiles?textiles.get(color,denimColors.has(color)?'denim':plushColors.has(color)?'plush':'felt'):new T.MeshStandardMaterial({color,roughness:.8}));return mats.get(color)}
 function mesh(g,color,parent=world,x=0,y=0,z=0){const m=new T.Mesh(g,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function ball(p,c,x,y,z,sx,sy=sx,sz=sx){const m=mesh(new T.SphereGeometry(1,24,16),c,p,x,y,z);m.scale.set(sx,sy,sz);return m}
 function box(p,c,x,y,z,w,h,d){return mesh(new T.BoxGeometry(w,h,d),c,p,x,y,z)}
 function cyl(p,c,x,y,z,r,h,r2=r){return mesh(new T.CylinderGeometry(r2,r,h,48),c,p,x,y,z)}
 function group(x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);world.add(g);return g}
 function label(text,w,h){const cv=document.createElement('canvas');cv.width=1024;cv.height=256;const ctx=cv.getContext('2d');ctx.fillStyle='#fff8df';ctx.font='900 100px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,128);const tx=new T.CanvasTexture(cv);const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tx,transparent:true,side:T.DoubleSide}));return m}
 cyl(world,night?0x54618c:theme===0?0xd4bf9d:0xb3ba89,0,-.32,0,5.4,.65);cyl(world,night?0x487d9e:theme===2?0x80bfc5:0x9caf7c,0,.02,0,5.36,.16);
 // sculpted pebble edge
 for(let i=0;i<55;i++){const a=i/55*Math.PI*2;ball(world,night?0x7a87ae:0xe1d4b3,Math.cos(a)*5.1,.17,Math.sin(a)*5.1,.19,.13,.17)}
 function flower(x,z,size=1,color=C.pink){const g=group(x,.16,z);g.scale.setScalar(size);cyl(g,C.leaf,0,.48,0,.045,.85);const leaf=ball(g,C.green,.17,.35,0,.23,.065,.12);leaf.rotation.z=.5;for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ball(g,color,Math.cos(a)*.23,1+Math.sin(a)*.23,0,.19,.19,.095)}ball(g,C.yellow,0,1,.1,.14,.14,.08);moving.push(t=>{g.rotation.z=Math.sin(t*1.2+x)*.065});return g}
 function bush(x,z,s=1){const g=group(x,.15,z);for(let i=0;i<5;i++)ball(g,i%2?C.green:C.leaf,Math.sin(i*2.3)*.4,.35+i%2*.2,Math.cos(i*2.3)*.3,.52,.55,.5).name='felt-shrub';g.scale.setScalar(s);return g}
 function rabbit(x,z,scale=1){return addRabbit(world,moving,mat,x,z,scale,theme)}
 function carrot(x,z){const g=group(x,.24,z);ball(g,C.orange,0,.45,0,.43,.47,.4);for(let i=0;i<3;i++){const leaf=ball(g,C.leaf,(i-1)*.17,.96,0,.13,.3,.11);leaf.rotation.z=(1-i)*.4}for(const s of [-1,1]){ball(g,C.white,s*.15,.52,.36,.1,.14,.04);ball(g,0x30312d,s*.15,.52,.397,.05,.075,.022)}ball(g,0x30312d,0,.3,.39,.08,.03,.02);moving.push(t=>{g.rotation.z=Math.sin(t*1.7+z)*.09});return g}
 function bee(x,y,z){const g=group(x,y,z);ball(g,C.yellow,0,0,0,.3,.29,.44);for(const k of [-.18,.12]){const stripe=cyl(g,0x554431,0,0,k,.3,.09);stripe.rotation.x=Math.PI/2}for(const s of [-1,1]){ball(g,0xfff8ed,s*.28,.2,0,.24,.08,.33);ball(g,0x302c29,s*.1,.07,.4,.045)}moving.push(t=>{g.position.y=y+Math.sin(t*2+x)*.23;g.position.x=x+Math.sin(t*.8)*.4;g.rotation.z=Math.sin(t*5)*.12})}
 function arch(){const g=group(0,.16,-1.8);mesh(new T.TorusGeometry(1.85,.24,20,56,Math.PI),C.leaf,g,0,1.55,0);for(const s of [-1,1])cyl(g,C.leaf,s*1.85,.8,0,.24,1.6);const l=label('STAYREAL',2.6,.55);l.position.set(0,2.65,.26);g.add(l);for(let i=0;i<15;i++){const a=i/14*Math.PI;const f=flower(Math.cos(a)*1.92,-1.63,.48,i%3===0?C.white:i%2?C.yellow:C.pink);f.children.slice(0,2).forEach(o=>{f.remove(o);o.geometry.dispose()});f.position.y=1.05+Math.sin(a)*1.95}}
 function fence(x,z,n=5){const g=group(x,.12,z);for(let i=0;i<n;i++){box(g,C.cream,i*.43,.48,0,.14,.9,.13);const cap=mesh(new T.ConeGeometry(.105,.16,4),C.cream,g,i*.43,.99,0);cap.rotation.y=Math.PI/4}box(g,C.cream,(n-1)*.215,.35,0,n*.43,.09,.09);box(g,C.cream,(n-1)*.215,.7,0,n*.43,.09,.09)}
 function cloud(x,y,z){const g=group(x,y,z);for(let i=0;i<4;i++)ball(g,night?0xa0a5cc:C.white,(i-1.5)*.4,Math.sin(i)*.13,0,.45,.25,.25).name='felt-cloud';moving.push(t=>{g.position.x=x+Math.sin(t*.25+x)*.25})}
 function boat(x,z,large=false){const g=group(x,.42,z);const hull=ball(g,large?0x253e68:0xb76f3e,0,0,0,large?1.8:1.1,.35,large?.85:.48);box(g,C.cream,0,.35,0,large?3:1.75,.18,large?1.3:.75);box(g,large?C.cream:0xc99755,0,.65,-.08,large?2.15:1.1,.5,large?.85:.65);box(g,large?C.yellow:0xdaa343,0,.97,0,large?2.4:1.4,.12,large?1:.8);for(let i=0;i<5;i++)box(g,0x477a96,(i-2)*(large?.4:.21),.7,large?.46:.34, .13,.21,.7); // windows
 moving.push(t=>{g.position.y=.43+Math.sin(t*1.2+x)*.09;g.rotation.z=Math.sin(t*1.3)*.035;g.position.x=x+Math.sin(t*.3)*.23});return g}
 if(theme===0){
 arch();rabbit(.65,1.2,1.22);addBeeCarrot(world,moving,mat,-1.35,1.8);bee(-2.8,2.7,.3);bee(3,3,-1);
 addFeltGround(world,new T.MeshStandardMaterial({color:0xffffff,roughness:1}));
 for(let i=0;i<56;i++){const a=i*2.399;const r=3.4+(i%4)*.30;flower(Math.cos(a)*r,Math.sin(a)*r,.38+(i%4)*.10,[C.pink,C.yellow,C.white,0xdd7756][i%4])}
 for(const p of [[-3.5,-1],[3,-2],[0,-3.8],[-3,2.3]])bush(...p);
 fence(-1.4,-3.7,8);fence(2.5,-2.7,4);
 const path=mesh(new T.CylinderGeometry(1.4,1.4,.025,48),0xe5d4b0,world,.4,.125,1.1);path.scale.set(1,1,1.5);
 const sign=group(2.8,.2,1.4);box(sign,0xc59253,0,.65,0,1,.95,.12);box(sign,0x475447,0,.67,.075,.85,.78,.02);const l=label('BE HAPPY',.76,.21);l.position.set(0,.76,.1);sign.add(l);for(const s of [-1,1])box(sign,0xc59253,s*.37,.23,0,.09,.5,.1);
 const cart=group(3,.4,-.9);box(cart,0xb89261,0,.32,0,1.25,.55,.75);for(let i=0;i<3;i++)box(cart,0xcda774,0,.12+i*.18,.40,1.3,.13,.045);for(const s of [-1,1]){const w=cyl(cart,0x6e5138,s*.7,0,0,.27,.12);w.rotation.z=Math.PI/2;const hub=cyl(cart,0xb89261,s*.78,0,0,.12,.13);hub.rotation.z=Math.PI/2}box(cart,0xb89261,.96,.3,0,.8,.065,.09);for(let i=0;i<6;i++){const f=flower(2.6+i*.16,-.9+(i%2)*.18,.47,[C.yellow,C.pink,C.white][i%3]);f.position.y=.78}
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
 cloud(-3.7,theme===0?3.8:4.5,-2.7);cloud(3.7,theme===0?4.1:5,-3.7);
 if(theme===0)decoratePlushGarden(world);
 const clock=new T.Clock();let raf;let paused=false;let viewChanged=true,lastRender=-1,lastShadow=-1,time=0;
 controls.addEventListener('change',()=>{viewChanged=true});
 function resize(){const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.zoom=Math.min(1,camera.aspect/(theme===0?1.45:1.0));camera.updateProjectionMatrix();viewChanged=true}
 const ro=new ResizeObserver(resize);ro.observe(el);resize();
 function render(){raf=requestAnimationFrame(render);const dt=clock.getDelta();if(!paused)time+=dt;controls.update();
   if((!paused||viewChanged)&&clock.elapsedTime-lastRender>=1/30){
     moving.forEach(f=>f(time));
     if(theme===0&&(lastShadow<0||time-lastShadow>.25)){sun.shadow.needsUpdate=true;lastShadow=time}
     renderer.render(scene,camera);lastRender=clock.elapsedTime;viewChanged=false;
   }
 }
 render();onReady?.();return {pause(v){paused=v;viewChanged=true},reset(){camera.position.copy(defaultView);controls.target.set(0,theme===0?.85:1.1,0);controls.update();viewChanged=true},zoom(f){camera.position.sub(controls.target).multiplyScalar(f).add(controls.target);viewChanged=true},dispose(){cancelAnimationFrame(raf);ro.disconnect();controls.dispose();const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))});materials.forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v)});m.dispose()});textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());mats.forEach(m=>{if(!materials.has(m))m.dispose()});textiles?.disposeUnused(materials);renderer.dispose();renderer.domElement.remove()}};
}
