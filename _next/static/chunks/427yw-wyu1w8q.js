(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,75853,e=>{"use strict";var t=e.i(43476),r=e.i(75056),s=e.i(98903),i=e.i(38408),o=e.i(31067),n=e.i(71645),a=e.i(90072);let u={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},l={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},c=n.forwardRef(({scale:e=10,frames:t=1/0,opacity:r=1,width:c=1,height:v=1,blur:m=1,near:d=0,far:h=10,resolution:f=512,smooth:x=!0,color:p="#000000",depthWrite:y=!1,renderOrder:g,...j},D)=>{let U,b,M=n.useRef(null),S=(0,i.f)(e=>e.scene),w=(0,i.f)(e=>e.gl),R=n.useRef(null);c*=Array.isArray(e)?e[0]:e||1,v*=Array.isArray(e)?e[1]:e||1;let[G,T,E,k,I,P,B]=n.useMemo(()=>{let e=new a.qL(f,f),t=new a.qL(f,f);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new a.CQ(c,v).rotateX(Math.PI/2),s=new a.kE(r),i=new a.QQ;i.depthTest=i.depthWrite=!1,i.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new a.Es(p)}},e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let o=new a.Zg(u),n=new a.Zg(l);return n.depthTest=o.depthTest=!1,[e,r,i,s,o,n,t]},[f,c,v,e,p]),C=e=>{k.visible=!0,k.material=I,I.uniforms.tDiffuse.value=G.texture,I.uniforms.h.value=e/256,w.setRenderTarget(B),w.render(k,R.current),k.material=P,P.uniforms.tDiffuse.value=B.texture,P.uniforms.v.value=e/256,w.setRenderTarget(G),w.render(k,R.current),k.visible=!1},L=0;return(0,s.f)(()=>{R.current&&(1/0===t||L<t)&&(L++,U=S.background,b=S.overrideMaterial,M.current.visible=!1,S.background=null,S.overrideMaterial=E,w.setRenderTarget(G),w.render(S,R.current),C(m),x&&C(.4*m),w.setRenderTarget(null),M.current.visible=!0,S.overrideMaterial=b,S.background=U)}),n.useImperativeHandle(D,()=>M.current,[]),n.createElement("group",(0,o.f)({"rotation-x":Math.PI/2},j,{ref:M}),n.createElement("mesh",{renderOrder:g,geometry:T,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},n.createElement("meshBasicMaterial",{transparent:!0,map:G.texture,opacity:r,depthWrite:y})),n.createElement("orthographicCamera",{ref:R,args:[-c/2,c/2,v/2,-v/2,d,h]}))});var v=e.i(20658),m=e.i(78140),d=e.i(79877),h=n,f=e.i(22326);let x="/draco/";m.f.preload(f.K[(0,f.u)()].three.model,x);let p=e=>Math.min(e,1/30);function y({position:e,rim:r,tyre:i,speedRef:o}){let n=(0,h.useRef)(null);return(0,s.f)((e,t)=>{n.current&&(n.current.rotation.y+=(.5+22*o.current)*p(t))}),(0,t.jsx)("group",{position:e,rotation:[Math.PI/2,0,0],children:(0,t.jsxs)("group",{ref:n,children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.34,.34,.36,24]}),(0,t.jsx)("meshStandardMaterial",{color:i,roughness:.85,metalness:.1})]}),(0,t.jsxs)("mesh",{position:[0,.19,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.19,.19,.02,24]}),(0,t.jsx)("meshStandardMaterial",{color:r,emissive:r,emissiveIntensity:.4,roughness:.4,metalness:.6})]})]})})}function g({c:e,speedRef:r}){let s=(e,r=.35,s=.55,i=0)=>(0,t.jsx)("meshStandardMaterial",{color:e,roughness:r,metalness:s,emissive:e,emissiveIntensity:i});return(0,t.jsxs)("group",{rotation:[0,-.55,0],position:[0,.02,0],children:[(0,t.jsxs)("mesh",{castShadow:!0,position:[0,.42,0],children:[(0,t.jsx)("boxGeometry",{args:[4.4,.22,.9]}),s(e.body,.28,.62,.1)]}),(0,t.jsxs)("mesh",{castShadow:!0,position:[2.35,.44,0],children:[(0,t.jsx)("boxGeometry",{args:[1.5,.18,.36]}),s(e.body,.28,.62,.1)]}),[-.62,.62].map(r=>(0,t.jsxs)("mesh",{castShadow:!0,position:[-.4,.42,r],children:[(0,t.jsx)("boxGeometry",{args:[2,.5,.32]}),s(e.body,.34,.56,.08)]},r)),(0,t.jsxs)("mesh",{castShadow:!0,position:[-1.2,.78,0],children:[(0,t.jsx)("boxGeometry",{args:[1.7,.5,.34]}),s(e.tyre,.6,.3)]}),(0,t.jsxs)("mesh",{castShadow:!0,position:[-.2,.7,0],children:[(0,t.jsx)("boxGeometry",{args:[.9,.32,.5]}),s(e.tyre,.6,.3)]}),(0,t.jsxs)("mesh",{position:[-.15,.9,0],children:[(0,t.jsx)("sphereGeometry",{args:[.15,20,20]}),s(e.accent,.4,.3,.1)]}),(0,t.jsxs)("mesh",{position:[-.2,.95,0],rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("torusGeometry",{args:[.34,.035,8,20,Math.PI]}),s(e.tyre,.5,.4)]}),(0,t.jsxs)("mesh",{castShadow:!0,position:[3,.16,0],children:[(0,t.jsx)("boxGeometry",{args:[.5,.05,1.9]}),s(e.tyre,.5,.3)]}),(0,t.jsxs)("mesh",{position:[3,.22,0],children:[(0,t.jsx)("boxGeometry",{args:[.5,.02,1.9]}),s(e.accent,.4,.5,.25)]}),(0,t.jsxs)("mesh",{castShadow:!0,position:[-2.35,.95,0],children:[(0,t.jsx)("boxGeometry",{args:[.1,.42,1.5]}),s(e.tyre,.5,.3)]}),(0,t.jsxs)("mesh",{position:[-2.28,1.12,0],children:[(0,t.jsx)("boxGeometry",{args:[.35,.05,1.5]}),s(e.body,.32,.5,.18)]}),(0,t.jsxs)("mesh",{position:[-2.42,.6,0],children:[(0,t.jsx)("boxGeometry",{args:[.05,.12,.5]}),s(e.edge,.2,.3,1.4)]}),(0,t.jsx)(y,{position:[1.7,.34,.72],rim:e.rim,tyre:e.tyre,speedRef:r}),(0,t.jsx)(y,{position:[1.7,.34,-.72],rim:e.rim,tyre:e.tyre,speedRef:r}),(0,t.jsx)(y,{position:[-1.7,.34,.78],rim:e.rim,tyre:e.tyre,speedRef:r}),(0,t.jsx)(y,{position:[-1.7,.34,-.78],rim:e.rim,tyre:e.tyre,speedRef:r})]})}function j({path:e}){let{scene:r}=(0,m.f)(e,x),s=(0,h.useMemo)(()=>{let e=r.clone(!0);e.traverse(e=>{e.isMesh&&(e.castShadow=!0)});let t=new a.VQ().setFromObject(e),s=new a.cE,i=new a.cE;t.getSize(s),t.getCenter(i);let o=4.6/Math.max(s.x,s.y,s.z);return e.scale.setScalar(o),e.position.set(-i.x*o,-t.min.y*o+.02,-i.z*o),e},[r]);return(0,t.jsx)("primitive",{object:s})}class D extends h.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}render(){return this.state.failed?this.props.fallback:this.props.children}}function U({c:e,speedRef:r,modelPath:i,reduced:o}){let n=(0,h.useRef)(null),a=(0,h.useRef)(0);(0,s.f)((e,t)=>{if(!n.current)return;let s=p(t),i=e.clock.getElapsedTime();a.current=Math.min(1,a.current+s/1.4);let u=o?1:1-Math.pow(1-a.current,3);n.current.position.x=(1-u)*15,o?n.current.rotation.y=-.9:n.current.rotation.y+=s*(.35+6*r.current),n.current.position.y=o?0:.01*Math.sin(2*i)});let u=(0,t.jsx)(g,{c:e,speedRef:r});return(0,t.jsx)("group",{ref:n,children:(0,t.jsx)(D,{fallback:u,children:(0,t.jsx)(h.Suspense,{fallback:u,children:(0,t.jsx)(j,{path:i})})},i)})}function b({c:e,speedRef:r,reduced:i,mobile:o}){let n=(0,h.useRef)(null);return(0,s.f)((e,t)=>{if(!n.current)return;let s=(2*!i+60*r.current)*p(t);n.current.children.forEach(e=>{e.position.x+=s,e.position.x>12&&(e.position.x-=42)})}),(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,0,0],children:[(0,t.jsx)("planeGeometry",{args:[80,40]}),(0,t.jsx)(v.f,{resolution:o?512:768,blur:o?[200,60]:[300,90],mixBlur:1,mixStrength:18,depthScale:1.1,minDepthThreshold:.4,maxDepthThreshold:1.3,roughness:.85,metalness:.5,color:e.canvas})]}),(0,t.jsx)("group",{ref:n,children:Array.from({length:14}).map((e,r)=>(0,t.jsxs)("mesh",{position:[-10+3*r,.012,0],rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("planeGeometry",{args:[1.4,.16]}),(0,t.jsx)("meshStandardMaterial",{color:"#f5f3ee",emissive:"#f5f3ee",emissiveIntensity:.2,roughness:.6})]},r))}),[-4.6,4.6].map(r=>(0,t.jsxs)("mesh",{position:[0,.012,r],rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("planeGeometry",{args:[80,.12]}),(0,t.jsx)("meshStandardMaterial",{color:e.edge,emissive:e.edge,emissiveIntensity:.6})]},r))]})}function M({reduced:e}){let{camera:t}=(0,i.f)(),r=(0,h.useRef)(0);return(0,s.f)((s,i)=>{let o=p(i),n=s.clock.getElapsedTime();r.current=Math.min(1,r.current+o/2.4);let u=1-Math.pow(1-r.current,3),l=2.3+(e?0:.05*Math.sin(.6*n)),c=a.rB.lerp(9.5,5.2,u),v=a.rB.lerp(5.5,l,u),m=a.rB.lerp(9.5,6.5,u);t.position.x=a.rB.lerp(t.position.x,c,2.4*o),t.position.y=a.rB.lerp(t.position.y,v,2.4*o),t.position.z=a.rB.lerp(t.position.z,m,2.4*o),t.lookAt(0,.7,0)}),null}e.s(["F1Scene",0,function({speedRef:e,reduced:s,colors:i,mobile:o}){let n=(0,h.useRef)(null),[u,l]=(0,h.useState)(!0);(0,h.useEffect)(()=>{let e=()=>l(!document.hidden);return document.addEventListener("visibilitychange",e),e(),()=>document.removeEventListener("visibilitychange",e)},[]);let v=(0,h.useMemo)(()=>new a.n5(i.canvas,13,34),[i.canvas]);return(0,t.jsx)("div",{ref:n,className:"fixed inset-0",children:(0,t.jsxs)(r.f,{shadows:!o,camera:{position:[9.5,5.5,9.5],fov:40},dpr:o?[1,1.3]:[1,1.7],frameloop:u&&!s?"always":"demand",gl:{antialias:!o},children:[(0,t.jsx)("color",{attach:"background",args:[i.canvas]}),(0,t.jsx)("primitive",{attach:"fog",object:v}),(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("directionalLight",{castShadow:!0,position:[6,10,4],intensity:2.8,color:"#fff3ea","shadow-mapSize":[1024,1024],"shadow-bias":-2e-4}),(0,t.jsx)("directionalLight",{position:[-8,3,-6],intensity:2,color:i.edge}),(0,t.jsx)("directionalLight",{position:[2,4,9],intensity:1.1,color:"#fff3ea"}),(0,t.jsx)("pointLight",{position:[0,3,5],intensity:10,color:i.accent,distance:20}),(0,t.jsx)("pointLight",{position:[-3,1,-3],intensity:14,color:i.bodyDk,distance:16}),(0,t.jsx)(U,{c:i,speedRef:e,modelPath:i.model,reduced:s}),(0,t.jsx)(b,{c:i,speedRef:e,reduced:s,mobile:o}),(0,t.jsx)(c,{position:[0,.015,0],opacity:.6,scale:22,blur:2.4,far:6,color:"#000000"}),(0,t.jsx)(M,{reduced:s}),!o&&(0,t.jsxs)(d.g,{children:[(0,t.jsx)(d.w,{intensity:.7,luminanceThreshold:.35,luminanceSmoothing:.9,mipmapBlur:!0,radius:.8}),(0,t.jsx)(d.a,{offset:.28,darkness:.72,eskil:!1})]})]})})}],75853)},89749,function(e){e.n(e.i(75853))}]);