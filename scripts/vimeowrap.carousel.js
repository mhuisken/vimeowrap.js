/*

 Vimeo Wrap - Carousel plugin

 Author: Wesley Luyten
 Version: 0.1 - (2012/03/18)
*/
(function(c){c.carousel=function(f,a){function l(b){m=b;d.length=b.length;for(var g=[],n=a.template,i=0;i<b.length;i++)g.push("<li>"),g.push(n.populate(b[i])),g.push("</li>");i=a.width-2*a.offsetx;d.visible=0<a.visible?a.visible:Math.floor(i/a.thumb.width);var n=Math.round((i-d.visible*a.thumb.width)/Math.max(d.visible-1,1)),f=document.getElementById(e.id+"_list");f.innerHTML=g.join("");g=f.getElementsByTagName("li");for(i=0;i<g.length;i++)c.utils.css(g[i],{styleFloat:"left",cssFloat:"left",width:a.thumb.width,
marginRight:n});d.offset=a.thumb.width+n;c.utils.css(f,{width:b.length*d.offset})}function j(b){b=b||window.event;if((b=b.target||b.srcElement)&&"li"!==b.nodeName.toLowerCase())for(;b&&!(b=b.parentNode,"li"===b.nodeName.toLowerCase()););for(var g=0,c=b.parentNode.children,d=0;d<c.length&&!(g=d,c[d]===b);d++);f.load(m[g],a.autoplay);return!1}function h(){k.style.left=d.x+"px"}var d=this,m=null,e,k;this.config=a=c.utils.extend({position:"bottom",width:f.config.width,height:130,offsetx:50,offsety:10,
autoplay:!1,template:'<div><a href="#vimeo.com/{{id}}" title="{{title}}"><img src="{{thumbnail|'+(a.thumb&&a.thumb.quality?a.thumb.quality:"small")+'}}" alt="" /><span>{{title}}</span></a></div>',easing:TWEEN.Easing.Exponential.EaseInOut,speed:250,thumb:{width:100,height:75}},a);this.length=this.offset=this.position=this.visible=this.x=0;TWEEN.start();this.setup=function(){var b=a.fontdir||"https://github.com/luwes/vimeowrap.js/raw/master/fonts/",b="@font-face {font-family:'Pictish'; src:url('"+b+
"pictish.eot'); src:url('"+b+"pictish.eot?#iefix') format('embedded-opentype'), url('"+b+"pictish.woff') format('woff'), url('"+b+"pictish.ttf') format('truetype'), url('"+b+"pictish.svg#PictishRegular') format('svg'); font-weight:normal; font-style:normal;}#{{id}} a {text-decoration:none;}#{{id}} a:active, #{{id}} a:focus {outline:none;}#{{id}} {font:bold 12px/14px helvetica,arial,sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);}#{{id}} ul li {line-height:14px;overflow:hidden;text-align:center;}#{{id}} ul li a {color:#{{color}};}#{{id}} ul li a img {border:none;width:{{thumb_width}}px;height:{{thumb_height}}px;}#{{id}}_navleft, #{{id}}_navright {color:#000;display:block;font-family:'Pictish';font-size:19px;position:absolute;top:32px;width:20px;height:19px;padding:10px;}#{{id}}_navright {right:0;}",
b=("ontouchstart"in window?b+"#{{id}} ul li a.pressed {color:#F75342;}#{{id}}_navleft.pressed, #{{id}}_navright.pressed {color:#{{color}};}":b+"#{{id}} ul li a:hover {color:#F75342;}#{{id}}_navleft:hover, #{{id}}_navright:hover {color:#{{color}};}")+a.style,b=document.createTextNode(b.populate({id:f.id+"_carousel",color:f.config.color,thumb_width:a.thumb.width,thumb_height:a.thumb.height})),d=document.createElement("style");d.type="text/css";document.getElementsByTagName("head")[0].appendChild(d);
d.styleSheet?d.styleSheet.cssText=b.nodeValue:d.appendChild(b);e=document.createElement("div");e.id=f.id+"_carousel";f.container.appendChild(e);c.utils.css(e,{width:a.width,height:a.height,position:"absolute",left:a.x,top:a.y});new c.carousel.NoClickDelay(e);b=document.createElement("div");b.id=e.id+"_wrap";e.appendChild(b);c.utils.css(b,{width:a.width-2*a.offsetx,height:a.height-a.offsety,overflow:"hidden",position:"absolute",left:a.offsetx,top:a.offsety});k=document.createElement("ul");k.id=e.id+
"_list";b.appendChild(k);c.utils.css(k,{height:a.height,position:"absolute","list-style-type":"none",margin:0,padding:0});k.onclick=j;b=document.createElement("a");b.id=e.id+"_navleft";b.href="#left";b.innerHTML="<span>[</span>";e.appendChild(b);b.onclick=this.left;b=document.createElement("a");b.id=e.id+"_navright";b.href="#right";b.innerHTML="<span>]</span>";e.appendChild(b);b.onclick=this.right;f.events.playlistAllLoaded.add(l)};this.left=function(){0<d.position&&d.to(d.position-d.visible);return!1};
this.right=function(){d.position<d.length-d.visible&&d.to(d.position+d.visible);return!1};this.to=function(b){d.position=b;(new TWEEN.Tween(d)).to({x:-b*d.offset},a.speed).onUpdate(h).easing(a.easing).start();return!1}}})(vimeowrap);(function(c){function f(a){"ontouchstart"in window&&(this.element="object"===typeof a?a:document.getElementById(a),this.element.addEventListener("touchstart",this,!1),this.element.addEventListener("click",this,!0))}f.prototype={handleEvent:function(a){this[a.type](a)},touchstart:function(a){this.moved=!1;this.theTarget=document.elementFromPoint(a.targetTouches[0].clientX,a.targetTouches[0].clientY);3==this.theTarget.nodeType&&(this.theTarget=theTarget.parentNode);this.theTarget.className+=" pressed";
this.element.addEventListener("touchmove",this,!1);this.element.addEventListener("touchend",this,!1)},touchmove:function(){this.moved=!0;this.theTarget.className=this.theTarget.className.replace(/ ?pressed/gi,"")},touchend:function(){this.element.removeEventListener("touchmove",this,!1);this.element.removeEventListener("touchend",this,!1);if(!this.moved&&this.theTarget){this.theTarget.className=this.theTarget.className.replace(/ ?pressed/gi,"");var a=document.createEvent("MouseEvents");a.initEvent("click",
!0,!0);this.theTarget.dispatchEvent(a)}this.theTarget=void 0},click:function(a){void 0===this.theTarget&&(a.stopImmediatePropagation(),a.preventDefault())}};c.NoClickDelay=f})(vimeowrap.carousel);/*

 @author sole / http://soledadpenades.com
 @author mr.doob / http://mrdoob.com
 @author Robert Eisele / http://www.xarg.org
 @author Philippe / http://philippe.elsass.me
 @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 @author Paul Lewis / http://www.aerotwist.com/
 @author lechecacharro
 @author Josh Faul / http://jocafa.com/
*/
var TWEEN=TWEEN||function(){var c,f,a=60,l=!1,j=[],h;return{setFPS:function(d){a=d||60},start:function(d){0!==arguments.length&&this.setFPS(d);f=setInterval(this.update,1E3/a)},stop:function(){clearInterval(f)},setAutostart:function(a){(l=a)&&!f&&this.start()},add:function(a){j.push(a);l&&!f&&this.start()},getAll:function(){return j},removeAll:function(){j=[]},remove:function(a){c=j.indexOf(a);-1!==c&&j.splice(c,1)},update:function(a){c=0;h=j.length;for(a=a||(new Date).getTime();c<h;)j[c].update(a)?
c++:(j.splice(c,1),h--);0===h&&!0===l&&this.stop()}}}();
TWEEN.Tween=function(c){var f={},a={},l={},j=1E3,h=0,d=null,m=TWEEN.Easing.Linear.EaseNone,e=null,k=null,b=null;this.to=function(a,b){null!==b&&(j=b);for(var d in a)null!==c[d]&&(l[d]=a[d]);return this};this.start=function(b){TWEEN.add(this);d=b?b+h:(new Date).getTime()+h;for(var e in l)null!==c[e]&&(f[e]=c[e],a[e]=l[e]-c[e]);return this};this.stop=function(){TWEEN.remove(this);return this};this.delay=function(a){h=a;return this};this.easing=function(a){m=a;return this};this.chain=function(a){e=a;
return this};this.onUpdate=function(a){k=a;return this};this.onComplete=function(a){b=a;return this};this.update=function(g){var h,i;if(g<d)return!0;g=(g-d)/j;g=1<g?1:g;i=m(g);for(h in a)c[h]=f[h]+a[h]*i;null!==k&&k.call(c,i);return 1==g?(null!==b&&b.call(c),null!==e&&e.start(),!1):!0}};TWEEN.Easing={Linear:{},Quadratic:{},Cubic:{},Quartic:{},Quintic:{},Sinusoidal:{},Exponential:{},Circular:{},Elastic:{},Back:{},Bounce:{}};
TWEEN.Easing.Exponential.EaseIn=function(c){return 0===c?0:Math.pow(2,10*(c-1))};TWEEN.Easing.Exponential.EaseOut=function(c){return 1==c?1:-Math.pow(2,-10*c)+1};TWEEN.Easing.Exponential.EaseInOut=function(c){return 0===c?0:1==c?1:1>(c*=2)?0.5*Math.pow(2,10*(c-1)):0.5*(-Math.pow(2,-10*(c-1))+2)};
