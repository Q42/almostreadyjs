/*
	CSS1 selectors, <div to create>, element(s), array, window
 */
$ = function(s) {
	var d = document, qs = 'querySelectorAll', hi=!!d[qs], u = undefined, cn = 'className', pn = 'parentNode';

	function _getEls(sel, par) {
		if (!sel) return [];
		if (typeof(sel) == 'object') {
			if(sel==window) return [window];
			if(sel.nodeType) return [sel];
			if(sel.length != u) return sel;
		}
		if(/^\</.test(sel)) {var fr = d.createElement('div');fr.innerHTML = sel;return fr.childNodes;}
		if (sel && hi) return (par||d)[qs](sel);
		// single selector tag#id.class1.class2
		if (/^[#\.]?[\w\-_\*]+$/.test(sel)) {
			// #id
			if (/^#/.test(sel)) { 
				var r = d.getElementById(sel.substr(1)),p;
				if (r) {
					if (!par || par==d) // #id by document, serve cold
						return [r];
					// otherwise traverse ancestor tree
					for(p=r[pn];p!=d;p=p[pn])
						if (p==par) 
							return [r];
				}
				return [];
			}
			// .class
			if (/^\./.test(sel)) { var els = []; new _$(par||d).find('*').each(function(){ if ($(this).hasClass(sel.substr(1))) els.push(this); }); return els; }
			return (par||d).getElementsByTagName(sel);
		}
		var r=[],$els,root;
		each(sel.replace(/^\s+|\s{2}|\s+$/gi,'').split(','),function(i2,sel2){ // split double selectors: foo,bar
			root = par||d;
			each(sel2.replace(/^\s+|\s+$/gi,'').split(' '), function(i3,sel3,l3) { // split ancestor paths: foo bar
				$els = 0;
				sel3.replace(/^[\w\*]+|#[\w_-]+|\.[\w_-]+/gi, function(sel4) { // split single rules tag#foo,bar
					// for each part of a single tag#div.class1.class2 selector, do a filter, except for the first
					$els = $els? $els.filter(sel4) : new _$(root).find(sel4);
				});
				if ($els) {
					root = $els.get();
					if (i3==l3-1)
						$els.each(function(i,o){if (indexOf(r,o)<0) r.push(o)});
				}
			});
		});
		return r;
	}

	function each(arr, f) {
		for(var i=0;i<arr.length;i++) f.call(arr[i],i,arr[i],arr.length);
	}

	function indexOf(arr,o) {
		for (var i=0;i<arr.length;i++)
			if (arr[i]==o) return i;
		return -1;
	}

	function _$(sel,par){ 
		var _ = _getEls(sel,par); 
		for(var x in _) 
			this[x]=_[x]; 
		if(!this.length) 
			this.length = _.length; 
		this._ = _;
	}

	_$.prototype = {
		closest			: function(sel)  	{ var r=[],test,closest; this.each(function() {test = $(this);do {closest = test.filter(sel),stop = (test[0] == d);if (closest.length) {stop = true;closest.each(function(i,o){if(indexOf(r,o)<0)r.push(o)});}test = test.parent();}while (test.length && !stop);});return new _$(r);},
		each        : function(f)    	{ each(this,f); return this },
		remove      : function()     	{ this.each(function(){this[pn].removeChild(this)}); return this },
		replaceWith : function(el)   	{ var me = this; if(me[0]) { if(el.each) el.each(function(){ me[0][pn].insertBefore(this,me[0]); }); else me[0][pn].insertBefore(el,me[0]); me.remove(); } return this },
		appendTo    : function(el)   	{ el=el.length?el[0]:el;this.each(function(){el.appendChild(this)}); return this },
		append      : function(sel)  	{ var me = this; if(me[0]) { new _$(sel).each(function(){ me[0].appendChild(this)}); }return this },
		parent      : function()     	{ var r = [];this.each(function(){if(indexOf(r,this[pn])<0) r.push(this[pn])});return new _$(r); },
		children    : function(sel)  	{ var ce = [], res, e; this.each(function(){ e = this.childNodes; for(var i=0;i<e.length;i++) ce.push(e[i]); }); res = new _$(ce); return sel? res.filter(sel) : res; },
		find        : function(sel)  	{ var r = [],cs,i; this.each(function(){ cs = _getEls(sel, this); for (i=0;i<cs.length;i++) if (indexOf(r,cs[i])<0) r.push(cs[i]);}); return new _$(r); },
		filter      : function(s,iv) 	{ s = _getEls(s); var r = [],i; this.each(function() { for(i=0;i<s.length;i++) if (s[i]==this&&!iv||s[i]!=this&&iv) r.push(this) }); return new _$(r); },
		not         : function(sel)  	{ return this.filter(sel,true) },
		eq          : function(i)    	{ return new _$(this[i]) },
		has         : function(el)   	{ for(var i=0;i<this.length;i++) if(this[i]==el) return true },
		get 				: function(i)	 		{ return i==u? this._ : this._[i] },
		attr        : function(k,v)  	{ if(v===u) return this[0]&&this[0].getAttribute(k); this.each(function(){this[((v===null)?'remove':'set')+'Attribute'](k,v)}); return this },
		on          : function(e,f)  	{ e=e.toLowerCase().split(' '); this.each(function(i,o){ for(var x in e) { this['on' + e[x]] = function() { return f.apply(o, arguments); }; }}); return this },
		off         : function(e)  	 	{ e=e.toLowerCase().split(' '); this.each(function(){ for(var x in e) this['on' + e[x]] = null; }); return this },
		click       : function(h)    	{ this.on('click',f); return this },
		text        : function(t)    	{ if(t===u) return this[0]&&this[0].textContent; this.each(function(){this.textContent=t}); return this },
		html        : function(h)    	{ if(h===u) return this[0]&&this[0].innerHTML; this.each(function(){this.innerHTML=h}); return this },
		hasClass    : function(cl,h) 	{ h=0;this.each(function(){ h+=new RegExp('(^| )' + cl + '( |$)', 'gi').test(this[cn])&&1||0;});return !!h; },
		addClass    : function(cl)   	{ this.removeClass(cl);cl=cl.split(' ');this.each(function(){for(var i in cl)this[cn] = (this[cn] + ' ' + cl[i]).replace(/^ |(\s)\s+|\s+$/g,'$1');});return this },
		removeClass : function(cl)   	{ cl=cl.split(' ');this.each(function(){for(var i in cl)this[cn] = this[cn].replace(new RegExp('(^| )' + cl[i] + '\\b', 'gi'), '').replace(/^ |(\s)\s+|\s+$/g,'$1');});return this },
		toggleClass : function(cl)   	{ cl=cl.split(' ');for(var x in cl) if(cl[x]) this[(this.hasClass(cl[x])?'remove':'add')+'Class'](cl[x]); return this },
		setCss      : function(p,v)  	{ this.each(function(){this.style[p]=v}); return this },
		getCss      : function(p)    	{ return this[0]&&this[0].style[p]; },
		css         : function(a,b)  	{ if(typeof a == 'string') if(b===u) return this.getCss(a); else this.setCss(a,b);else for(var x in a) this.setCss(x,a[x]); return this },
		hide        : function()     	{ this.setCss('display','none'); return this },
		val					: function(v)	 		{ if (v==u) return this[0]?this[0].value:u; this.each(function(i,o){o.value=v});return this},
		show        : function()     	{ this.setCss('display','block'); return this },
		focus				: function()	 		{ if (this.length) this[0].focus(); return this }
	};

	return new _$(s);
};

$.browser = new function(){
	var ualc = navigator.userAgent.toLowerCase();

	this.webkit = /applewebkit/.test(ualc);
	this.firefox = /firefox/.test(ualc);
	this.safari = /safari/.test(ualc) && !/chrome/.test(ualc);
	this.ie = /msie/.test(ualc) || /trident/.test(ualc);
	this.iemobile = /iemobile/.test(ualc);
	this.iOS = /ipad|iphone|ipod/.test(ualc);
	this.android = /android/.test(ualc);
	this.s40 = /series40/.test(ualc); // nokia
	this.mobile = this.iOS || this.android || this.iemobile;
	this.unknown = !this.webkit&&!this.firefox&&!this.ie&&!this.iOS&&!this.android;

	this.version = parseFloat(this.webkit?ualc.match(/applewebkit\/(\d+)\./)[1]
		: this.firefox?ualc.match(/firefox\/(\d+)\./)[1]
		: this.ie?ualc.match(/(msie\s|rv\:)(\d+)\./)[2]
		: -1);

	this.retina = (window.devicePixelRatio && window.devicePixelRatio >= 2) && this.iOS;
};