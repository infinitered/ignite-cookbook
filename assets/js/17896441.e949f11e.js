"use strict";(self.webpackChunkignite_cookbook=self.webpackChunkignite_cookbook||[]).push([[6752],{32:(e,t,a)=>{a.d(t,{c:()=>_});var s=a(1504),l=a(5456),n=a(5864),c=a(1262),o=a(9784),r=a(7790),i=a(1096);const d={lastUpdated:"lastUpdated_VsjB"},u={root:"root_lrOk",grid:"grid_uXr7",reactionButton:"reactionButton_NJtd",reactionIcon:"reactionIcon_kBHw",reactionText:"reactionText_KjFJ",footer:"footer_VuXo"};var h;function p(){return p=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e},p.apply(this,arguments)}const m=e=>{let{title:t,titleId:a,...l}=e;return s.createElement("svg",p({xmlns:"http://www.w3.org/2000/svg",className:"ionicon",viewBox:"0 0 512 512","aria-labelledby":a},l),t?s.createElement("title",{id:a},t):null,h||(h=s.createElement("path",{fill:"#349636",d:"m456 192-156-12 23-89.4c6-26.6-.78-41.87-22.47-48.6l-34.69-9.85a4 4 0 0 0-4.4 1.72l-129 202.34a8 8 0 0 1-6.81 3.81H16V448h117.61a48 48 0 0 1 15.18 2.46l76.3 25.43a80 80 0 0 0 25.3 4.11h177.93c19 0 31.5-13.52 35.23-32.16L496 305.58V232c0-22.06-18-38-40-40z"})))};var j,x,f;function g(){return g=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e},g.apply(this,arguments)}const v=e=>{let{title:t,titleId:a,...l}=e;return s.createElement("svg",g({xmlns:"http://www.w3.org/2000/svg",className:"ionicon",viewBox:"0 0 512 512","aria-labelledby":a},l),t?s.createElement("title",{id:a},t):null,j||(j=s.createElement("path",{fill:"#DC1818",d:"m56 320 156.05 12-23 89.4c-6.08 26.6.7 41.87 22.39 48.62l34.69 9.85a4 4 0 0 0 4.4-1.72l129-202.34a8 8 0 0 1 6.81-3.81H496V64H378.39a48 48 0 0 1-15.18-2.46l-76.3-25.43a80 80 0 0 0-25.3-4.11H83.68c-19 0-31.5 13.52-35.23 32.16L16 206.42V280c0 22.06 18 38 40 40z"})),x||(x=s.createElement("path",{d:"M378.45 273.93A15.84 15.84 0 0 1 386 272a15.93 15.93 0 0 0-7.51 1.91zm-40.59 69.29-.13.22a2.53 2.53 0 0 1 .13-.22c20.5-35.51 30.36-55 33.82-62-3.47 7.06-13.34 26.51-33.82 62z",fill:"none"})),f||(f=s.createElement("path",{d:"m372.66 279.16-1 2a16.29 16.29 0 0 1 6.77-7.26 16.48 16.48 0 0 0-5.77 5.26z"})))};var b=a(7624);const w=()=>(0,b.jsx)("span",{children:"Thanks for your feedback! We hope this recipe has been helpful."}),N=()=>(0,b.jsx)("span",{children:"Thanks for your feedback. We will update this recipe as soon as we can."});function k(e){let{resourceId:t}=e;const[a,l]=(0,s.useState)(null),n="yes"===a||"no"===a,c=e=>{l(e),gtag("event",`feedback_${t}_${e}`,{event_category:"feedback",event_label:t})};return(0,b.jsxs)("div",{className:u.root,children:[(0,b.jsx)("h3",{className:u.title,children:"Is this page still up to date? Did it work for you?"}),n?"no"===a?(0,b.jsx)(N,{}):(0,b.jsx)(w,{}):(0,b.jsxs)("div",{className:u.grid,children:[(0,b.jsxs)("button",{className:u.reactionButton,onClick:()=>c("yes"),"aria-label":"Yes",children:[(0,b.jsx)(m,{className:u.reactionIcon}),(0,b.jsx)("div",{className:u.reactionText,children:"Yes"})]}),(0,b.jsxs)("button",{className:u.reactionButton,onClick:()=>c("no"),"aria-label":"No",children:[(0,b.jsx)(v,{className:u.reactionIcon}),(0,b.jsx)("div",{className:u.reactionText,children:"No"})]})]})]})}function U(e){return(0,b.jsx)("div",{className:(0,l.c)(n.W.docs.docFooterTagsRow,"row margin-bottom--sm"),children:(0,b.jsx)("div",{className:"col",children:(0,b.jsx)(i.c,{...e})})})}function y(e){let{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:s,formattedLastUpdatedAt:c}=e;return(0,b.jsxs)("div",{className:(0,l.c)(n.W.docs.docFooterEditMetaRow,"row"),children:[(0,b.jsx)("div",{className:"col",children:t&&(0,b.jsx)(r.c,{editUrl:t})}),(0,b.jsx)("div",{className:(0,l.c)("col",d.lastUpdated),children:(a||s)&&(0,b.jsx)(o.c,{lastUpdatedAt:a,formattedLastUpdatedAt:c,lastUpdatedBy:s})})]})}function _(){const{metadata:e}=(0,c.G)(),{editUrl:t,lastUpdatedAt:a,formattedLastUpdatedAt:s,lastUpdatedBy:o,tags:r,id:i}=e,d=r.length>0,u=!!(t||a||o);return d||u?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(k,{resourceId:i}),(0,b.jsxs)("footer",{className:(0,l.c)(n.W.docs.docFooter,"docusaurus-mt-lg"),children:[d&&(0,b.jsx)(U,{tags:r}),u&&(0,b.jsx)(y,{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:o,formattedLastUpdatedAt:s})]})]}):null}}}]);