(()=>{"use strict";var e,a,f,t,r,b={},o={};function c(e){var a=o[e];if(void 0!==a)return a.exports;var f=o[e]={id:e,loaded:!1,exports:{}};return b[e].call(f.exports,f,f.exports,c),f.loaded=!0,f.exports}c.m=b,c.c=o,e=[],c.O=(a,f,t,r)=>{if(!f){var b=1/0;for(i=0;i<e.length;i++){f=e[i][0],t=e[i][1],r=e[i][2];for(var o=!0,d=0;d<f.length;d++)(!1&r||b>=r)&&Object.keys(c.O).every((e=>c.O[e](f[d])))?f.splice(d--,1):(o=!1,r<b&&(b=r));if(o){e.splice(i--,1);var n=t();void 0!==n&&(a=n)}}return a}r=r||0;for(var i=e.length;i>0&&e[i-1][2]>r;i--)e[i]=e[i-1];e[i]=[f,t,r]},c.n=e=>{var a=e&&e.__esModule?()=>e.default:()=>e;return c.d(a,{a:a}),a},f=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,c.t=function(e,t){if(1&t&&(e=this(e)),8&t)return e;if("object"==typeof e&&e){if(4&t&&e.__esModule)return e;if(16&t&&"function"==typeof e.then)return e}var r=Object.create(null);c.r(r);var b={};a=a||[null,f({}),f([]),f(f)];for(var o=2&t&&e;"object"==typeof o&&!~a.indexOf(o);o=f(o))Object.getOwnPropertyNames(o).forEach((a=>b[a]=()=>e[a]));return b.default=()=>e,c.d(r,b),r},c.d=(e,a)=>{for(var f in a)c.o(a,f)&&!c.o(e,f)&&Object.defineProperty(e,f,{enumerable:!0,get:a[f]})},c.f={},c.e=e=>Promise.all(Object.keys(c.f).reduce(((a,f)=>(c.f[f](e,a),a)),[])),c.u=e=>"assets/js/"+({53:"935f2afb",170:"8b0d950b",327:"e7928ab4",420:"1c9ea255",752:"e1b6b0a8",920:"b8c37621",1065:"e438b990",1317:"33a056c1",1498:"9dc0f37b",1606:"47a03c7f",1833:"7b45617e",2181:"9ff7e1f8",2182:"da9277bc",3135:"c3e2f4d4",3188:"145425bc",3237:"1df93b7f",3362:"6728e797",3441:"63181745",3549:"4a4fb967",3751:"3720c009",4011:"861d4b97",4121:"55960ee5",4598:"2b5cb6b8",4796:"ce17b301",4803:"08a54ed9",4871:"24a07a83",4881:"fd1937a7",4930:"501cbb42",5075:"51658ad1",5318:"e0854532",5766:"33f24359",5834:"19d620af",5893:"657027a7",6275:"03224537",6378:"3bb7a4af",6605:"d6ab422f",6610:"b3d1732c",6649:"f523b160",6862:"d0e08e4a",7043:"a0d6a633",7145:"d01c4de2",7508:"7acb6f50",7706:"ff2c7cca",7738:"a951c726",7918:"17896441",8154:"4e09609f",8674:"a8f9d519",9179:"a8646ade",9340:"fe9b09bf",9514:"1be78505",9671:"0e384e19",9853:"3192f89a",9924:"df203c0f"}[e]||e)+"."+{53:"2177258f",170:"186b12f4",327:"24e9e98d",420:"2afd9a1e",752:"71642da8",920:"e6c5a930",1065:"c5f25776",1317:"4165a98d",1498:"0a74036e",1606:"8d512caf",1762:"d87ba151",1833:"f3329851",2181:"0615b0ab",2182:"c4c64042",3135:"0f3eb543",3188:"2417be62",3237:"e3db55dc",3362:"3143ff97",3441:"eccb0964",3549:"4e3e3e72",3751:"2e4d724a",4011:"8412a511",4121:"70a6722f",4598:"119655b1",4796:"b3ad8387",4803:"8e2c568d",4871:"3635a4d2",4881:"cb169282",4930:"42ad5ff9",4972:"31c7e1e9",5075:"ae0b366c",5318:"8c5cffc2",5766:"50e0f1d1",5834:"f3599307",5893:"3de18f64",6275:"7229d4fa",6378:"395622f8",6605:"d36f7228",6610:"90cbd637",6649:"79450198",6862:"a793e1c9",7043:"385029c7",7145:"8bf07534",7508:"695868c3",7706:"dc158ee7",7738:"a41ec691",7918:"2b21bbcb",8154:"50b2b967",8674:"1611621b",9179:"b55f1d56",9340:"81150860",9514:"399ff68c",9671:"8b8d30d1",9853:"9c0f9198",9924:"89c8e82c"}[e]+".js",c.miniCssF=e=>{},c.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),c.o=(e,a)=>Object.prototype.hasOwnProperty.call(e,a),t={},r="ignite-cookbook:",c.l=(e,a,f,b)=>{if(t[e])t[e].push(a);else{var o,d;if(void 0!==f)for(var n=document.getElementsByTagName("script"),i=0;i<n.length;i++){var l=n[i];if(l.getAttribute("src")==e||l.getAttribute("data-webpack")==r+f){o=l;break}}o||(d=!0,(o=document.createElement("script")).charset="utf-8",o.timeout=120,c.nc&&o.setAttribute("nonce",c.nc),o.setAttribute("data-webpack",r+f),o.src=e),t[e]=[a];var u=(a,f)=>{o.onerror=o.onload=null,clearTimeout(s);var r=t[e];if(delete t[e],o.parentNode&&o.parentNode.removeChild(o),r&&r.forEach((e=>e(f))),a)return a(f)},s=setTimeout(u.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=u.bind(null,o.onerror),o.onload=u.bind(null,o.onload),d&&document.head.appendChild(o)}},c.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),c.p="/",c.gca=function(e){return e={17896441:"7918",63181745:"3441","935f2afb":"53","8b0d950b":"170",e7928ab4:"327","1c9ea255":"420",e1b6b0a8:"752",b8c37621:"920",e438b990:"1065","33a056c1":"1317","9dc0f37b":"1498","47a03c7f":"1606","7b45617e":"1833","9ff7e1f8":"2181",da9277bc:"2182",c3e2f4d4:"3135","145425bc":"3188","1df93b7f":"3237","6728e797":"3362","4a4fb967":"3549","3720c009":"3751","861d4b97":"4011","55960ee5":"4121","2b5cb6b8":"4598",ce17b301:"4796","08a54ed9":"4803","24a07a83":"4871",fd1937a7:"4881","501cbb42":"4930","51658ad1":"5075",e0854532:"5318","33f24359":"5766","19d620af":"5834","657027a7":"5893","03224537":"6275","3bb7a4af":"6378",d6ab422f:"6605",b3d1732c:"6610",f523b160:"6649",d0e08e4a:"6862",a0d6a633:"7043",d01c4de2:"7145","7acb6f50":"7508",ff2c7cca:"7706",a951c726:"7738","4e09609f":"8154",a8f9d519:"8674",a8646ade:"9179",fe9b09bf:"9340","1be78505":"9514","0e384e19":"9671","3192f89a":"9853",df203c0f:"9924"}[e]||e,c.p+c.u(e)},(()=>{var e={1303:0,532:0};c.f.j=(a,f)=>{var t=c.o(e,a)?e[a]:void 0;if(0!==t)if(t)f.push(t[2]);else if(/^(1303|532)$/.test(a))e[a]=0;else{var r=new Promise(((f,r)=>t=e[a]=[f,r]));f.push(t[2]=r);var b=c.p+c.u(a),o=new Error;c.l(b,(f=>{if(c.o(e,a)&&(0!==(t=e[a])&&(e[a]=void 0),t)){var r=f&&("load"===f.type?"missing":f.type),b=f&&f.target&&f.target.src;o.message="Loading chunk "+a+" failed.\n("+r+": "+b+")",o.name="ChunkLoadError",o.type=r,o.request=b,t[1](o)}}),"chunk-"+a,a)}},c.O.j=a=>0===e[a];var a=(a,f)=>{var t,r,b=f[0],o=f[1],d=f[2],n=0;if(b.some((a=>0!==e[a]))){for(t in o)c.o(o,t)&&(c.m[t]=o[t]);if(d)var i=d(c)}for(a&&a(f);n<b.length;n++)r=b[n],c.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return c.O(i)},f=self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[];f.forEach(a.bind(null,0)),f.push=a.bind(null,f.push.bind(f))})()})();