(()=>{"use strict";var e,a,f,b,c,d={},t={};function r(e){var a=t[e];if(void 0!==a)return a.exports;var f=t[e]={id:e,loaded:!1,exports:{}};return d[e].call(f.exports,f,f.exports,r),f.loaded=!0,f.exports}r.m=d,e=[],r.O=(a,f,b,c)=>{if(!f){var d=1/0;for(i=0;i<e.length;i++){f=e[i][0],b=e[i][1],c=e[i][2];for(var t=!0,o=0;o<f.length;o++)(!1&c||d>=c)&&Object.keys(r.O).every((e=>r.O[e](f[o])))?f.splice(o--,1):(t=!1,c<d&&(d=c));if(t){e.splice(i--,1);var n=b();void 0!==n&&(a=n)}}return a}c=c||0;for(var i=e.length;i>0&&e[i-1][2]>c;i--)e[i]=e[i-1];e[i]=[f,b,c]},r.n=e=>{var a=e&&e.__esModule?()=>e.default:()=>e;return r.d(a,{a:a}),a},f=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,r.t=function(e,b){if(1&b&&(e=this(e)),8&b)return e;if("object"==typeof e&&e){if(4&b&&e.__esModule)return e;if(16&b&&"function"==typeof e.then)return e}var c=Object.create(null);r.r(c);var d={};a=a||[null,f({}),f([]),f(f)];for(var t=2&b&&e;"object"==typeof t&&!~a.indexOf(t);t=f(t))Object.getOwnPropertyNames(t).forEach((a=>d[a]=()=>e[a]));return d.default=()=>e,r.d(c,d),c},r.d=(e,a)=>{for(var f in a)r.o(a,f)&&!r.o(e,f)&&Object.defineProperty(e,f,{enumerable:!0,get:a[f]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce(((a,f)=>(r.f[f](e,a),a)),[])),r.u=e=>"assets/js/"+({8:"cecd52bc",16:"145425bc",40:"72dfd944",56:"7acb6f50",95:"b3d1732c",140:"fe9b09bf",222:"33f24359",328:"e1b6b0a8",492:"215698ba",622:"99d16955",656:"5fd7ef2e",784:"47c232e1",900:"9fc76e3d",916:"a2f5d017",1016:"76759531",1176:"b16fadc1",1236:"f50f3884",1264:"c3e2f4d4",1388:"ce17b301",1412:"c75b21fd",1528:"b33180cb",1784:"d699663a",1904:"1fdec661",2008:"3bb7a4af",2044:"abfb2977",2160:"985027d8",2288:"e0854532",2324:"51ea30c5",2328:"51892623",2372:"b8c37621",2464:"abaad534",2596:"dce6faa4",2816:"30b0babe",2928:"eba20459",3008:"a8646ade",3128:"4e09609f",3132:"2fbc58fd",3180:"657027a7",3324:"ecce3b64",3336:"47a03c7f",3400:"df203c0f",3480:"9b01ede9",3504:"f523b160",3800:"37e9da98",3960:"8b0d950b",3966:"19d620af",3980:"ad7b1610",4e3:"69dd30cd",4116:"fd1937a7",4212:"7f8cce85",4224:"78a0b2f7",4264:"6fd287af",4296:"55960ee5",4304:"5e95c892",4424:"24a07a83",4428:"bbaf8084",4492:"3720c009",4666:"a94703ab",4822:"b832b2ff",4955:"b3fb1bb5",4992:"3192f89a",5032:"c47fa949",5064:"51e76fb5",5156:"08a54ed9",5276:"d63d2b89",5284:"03224537",5292:"52d269c5",5320:"569bff92",5524:"0825c398",5548:"63181745",5576:"e965bea7",5592:"3663082a",5640:"18d888f3",5696:"935f2afb",5708:"e33e793e",5819:"bc1a59c9",5856:"da9277bc",6044:"954f316d",6216:"a8f9d519",6252:"ff2c7cca",6264:"d7af48b9",6328:"0e384e19",6460:"e7928ab4",6500:"a7bd4aaa",6568:"ee0b98b5",6704:"9dc0f37b",6728:"4890b90f",6752:"17896441",6756:"4a4fb967",6928:"1ab29606",7136:"9ec24567",7164:"e2041b9b",7224:"d01c4de2",7300:"94ee064e",7338:"6558e733",7556:"b747e1af",7572:"dd3340a6",7600:"ccf3150e",7620:"6c727604",7706:"e2d058df",7732:"a0d6a633",7820:"82139467",7920:"04c3832a",8200:"a951c726",8368:"199ff765",8436:"7b45617e",8440:"4699e3bd",8500:"cc1d3934",8552:"1df93b7f",8576:"54a9c7e8",8616:"6728e797",8636:"1c9ea255",8762:"d6ab422f",8780:"cf59a740",8872:"c5ca3bf3",9016:"d0e08e4a",9144:"dec1aed8",9208:"9b650fc1",9380:"ffe4833d",9576:"51658ad1",9607:"c5abe9fe",9632:"31ac2bc7",9648:"1a4e3797",9828:"24c3776a",9960:"b6b5631c"}[e]||e)+"."+{8:"5cac4503",16:"ead2eef0",40:"5ad7245c",56:"049a03a2",95:"e48871b5",140:"18b32ed9",222:"1a82a5fc",328:"c1ce8154",492:"fbe16a1e",622:"7e304c24",656:"2d0a39a8",784:"403201ca",900:"ed59a072",916:"2b66b8ca",1016:"5ba16058",1176:"c927db5c",1236:"56663aa0",1264:"d72207a7",1388:"28e56656",1412:"e50e8147",1528:"9800c449",1676:"c9d2671a",1784:"f014bef9",1904:"7240b51b",2008:"1da259c8",2044:"8a00de12",2096:"74eff994",2160:"ffa3d60d",2288:"85981248",2324:"045bca0d",2328:"932413fa",2372:"53ba3f4c",2464:"a38ab67c",2528:"8598cbba",2596:"bb991aa5",2816:"f4d14fbe",2928:"622feac1",3008:"b82994a5",3128:"2523db88",3132:"35c646d0",3180:"4f11d809",3324:"40438a91",3336:"b037daf5",3400:"ccf22ee4",3480:"28f40488",3504:"480a17f2",3800:"22e74fbb",3960:"1e5c3e49",3966:"19ce1467",3980:"7f1883e4",4e3:"b3334896",4116:"f9d1089f",4212:"75a81484",4224:"2498fe76",4264:"aaf028f5",4296:"d8b58ca8",4304:"a1a3902d",4424:"0255ff7d",4428:"8d59b503",4492:"90b28f7c",4552:"5546624d",4666:"bc075c24",4822:"485a5f70",4955:"53e657fe",4992:"0e2472bc",5032:"21ff503c",5064:"00a25006",5156:"ae90e2d7",5276:"67ab2f65",5284:"3e229ba5",5292:"7a9cdc05",5320:"6fa65900",5524:"9b659c34",5548:"e4cd1fce",5576:"121a0ad3",5592:"f553a0ef",5640:"bc56ec6a",5696:"494b2b1d",5708:"c3d5b985",5819:"fb923954",5856:"4a7d8a34",6044:"e5bd89ea",6216:"09bf796b",6252:"d4c7d7de",6264:"d7bd4e35",6328:"6913847e",6432:"3595069d",6460:"2d1d024b",6500:"863e31a6",6568:"96e769fa",6704:"c3f6a1bf",6728:"aebbf5a0",6752:"e949f11e",6756:"29a9d42c",6928:"0f3e92f7",7136:"4a5f31fb",7164:"77142519",7224:"84e66c4d",7300:"02247c6e",7338:"09ef56bf",7556:"980c6b16",7572:"18339ed6",7600:"4086fd43",7620:"37636773",7656:"b8ebdf4f",7706:"74155de1",7732:"7be17bd4",7820:"f947d4d2",7920:"f3796c30",8200:"e5dd733a",8368:"efe7b80f",8436:"19821363",8440:"63ddf3c2",8500:"bc103179",8552:"f374507e",8576:"242f3b45",8616:"8544732d",8636:"7b69dcf0",8762:"29142d83",8780:"c57f377b",8872:"0df131ce",8879:"af5ac17e",8908:"beb80ef0",9016:"72946f9e",9144:"ebff3da0",9208:"53da09c6",9380:"9c311379",9576:"bac109c3",9607:"8b6bdf3b",9632:"aec33520",9648:"e6d0374d",9828:"fc65ee23",9960:"2e740d0e"}[e]+".js",r.miniCssF=e=>{},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,a)=>Object.prototype.hasOwnProperty.call(e,a),b={},c="ignite-cookbook:",r.l=(e,a,f,d)=>{if(b[e])b[e].push(a);else{var t,o;if(void 0!==f)for(var n=document.getElementsByTagName("script"),i=0;i<n.length;i++){var l=n[i];if(l.getAttribute("src")==e||l.getAttribute("data-webpack")==c+f){t=l;break}}t||(o=!0,(t=document.createElement("script")).charset="utf-8",t.timeout=120,r.nc&&t.setAttribute("nonce",r.nc),t.setAttribute("data-webpack",c+f),t.src=e),b[e]=[a];var u=(a,f)=>{t.onerror=t.onload=null,clearTimeout(s);var c=b[e];if(delete b[e],t.parentNode&&t.parentNode.removeChild(t),c&&c.forEach((e=>e(f))),a)return a(f)},s=setTimeout(u.bind(null,void 0,{type:"timeout",target:t}),12e4);t.onerror=u.bind(null,t.onerror),t.onload=u.bind(null,t.onload),o&&document.head.appendChild(t)}},r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),r.p="/",r.gca=function(e){return e={17896441:"6752",51892623:"2328",63181745:"5548",76759531:"1016",82139467:"7820",cecd52bc:"8","145425bc":"16","72dfd944":"40","7acb6f50":"56",b3d1732c:"95",fe9b09bf:"140","33f24359":"222",e1b6b0a8:"328","215698ba":"492","99d16955":"622","5fd7ef2e":"656","47c232e1":"784","9fc76e3d":"900",a2f5d017:"916",b16fadc1:"1176",f50f3884:"1236",c3e2f4d4:"1264",ce17b301:"1388",c75b21fd:"1412",b33180cb:"1528",d699663a:"1784","1fdec661":"1904","3bb7a4af":"2008",abfb2977:"2044","985027d8":"2160",e0854532:"2288","51ea30c5":"2324",b8c37621:"2372",abaad534:"2464",dce6faa4:"2596","30b0babe":"2816",eba20459:"2928",a8646ade:"3008","4e09609f":"3128","2fbc58fd":"3132","657027a7":"3180",ecce3b64:"3324","47a03c7f":"3336",df203c0f:"3400","9b01ede9":"3480",f523b160:"3504","37e9da98":"3800","8b0d950b":"3960","19d620af":"3966",ad7b1610:"3980","69dd30cd":"4000",fd1937a7:"4116","7f8cce85":"4212","78a0b2f7":"4224","6fd287af":"4264","55960ee5":"4296","5e95c892":"4304","24a07a83":"4424",bbaf8084:"4428","3720c009":"4492",a94703ab:"4666",b832b2ff:"4822",b3fb1bb5:"4955","3192f89a":"4992",c47fa949:"5032","51e76fb5":"5064","08a54ed9":"5156",d63d2b89:"5276","03224537":"5284","52d269c5":"5292","569bff92":"5320","0825c398":"5524",e965bea7:"5576","3663082a":"5592","18d888f3":"5640","935f2afb":"5696",e33e793e:"5708",bc1a59c9:"5819",da9277bc:"5856","954f316d":"6044",a8f9d519:"6216",ff2c7cca:"6252",d7af48b9:"6264","0e384e19":"6328",e7928ab4:"6460",a7bd4aaa:"6500",ee0b98b5:"6568","9dc0f37b":"6704","4890b90f":"6728","4a4fb967":"6756","1ab29606":"6928","9ec24567":"7136",e2041b9b:"7164",d01c4de2:"7224","94ee064e":"7300","6558e733":"7338",b747e1af:"7556",dd3340a6:"7572",ccf3150e:"7600","6c727604":"7620",e2d058df:"7706",a0d6a633:"7732","04c3832a":"7920",a951c726:"8200","199ff765":"8368","7b45617e":"8436","4699e3bd":"8440",cc1d3934:"8500","1df93b7f":"8552","54a9c7e8":"8576","6728e797":"8616","1c9ea255":"8636",d6ab422f:"8762",cf59a740:"8780",c5ca3bf3:"8872",d0e08e4a:"9016",dec1aed8:"9144","9b650fc1":"9208",ffe4833d:"9380","51658ad1":"9576",c5abe9fe:"9607","31ac2bc7":"9632","1a4e3797":"9648","24c3776a":"9828",b6b5631c:"9960"}[e]||e,r.p+r.u(e)},(()=>{var e={296:0,2176:0};r.f.j=(a,f)=>{var b=r.o(e,a)?e[a]:void 0;if(0!==b)if(b)f.push(b[2]);else if(/^2(17|9)6$/.test(a))e[a]=0;else{var c=new Promise(((f,c)=>b=e[a]=[f,c]));f.push(b[2]=c);var d=r.p+r.u(a),t=new Error;r.l(d,(f=>{if(r.o(e,a)&&(0!==(b=e[a])&&(e[a]=void 0),b)){var c=f&&("load"===f.type?"missing":f.type),d=f&&f.target&&f.target.src;t.message="Loading chunk "+a+" failed.\n("+c+": "+d+")",t.name="ChunkLoadError",t.type=c,t.request=d,b[1](t)}}),"chunk-"+a,a)}},r.O.j=a=>0===e[a];var a=(a,f)=>{var b,c,d=f[0],t=f[1],o=f[2],n=0;if(d.some((a=>0!==e[a]))){for(b in t)r.o(t,b)&&(r.m[b]=t[b]);if(o)var i=o(r)}for(a&&a(f);n<d.length;n++)c=d[n],r.o(e,c)&&e[c]&&e[c][0](),e[c]=0;return r.O(i)},f=self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[];f.forEach(a.bind(null,0)),f.push=a.bind(null,f.push.bind(f))})()})();