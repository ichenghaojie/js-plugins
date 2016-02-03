/**
 * 拖拽排序插件
 * @author chenghaojie
 */

//获取tagName
var getTag = function (tagName, oParent) {return (oParent || document).getElementsByTagName(tagName)};

//获取class
var getClass = function (sClass, oParent) {
	var aClass = [],
	i = 0,
	reClass = new RegExp("(\\s|^)" + sClass + "($|\\s)"),
	aElement = getTag("*", oParent);
	for (i = 0; i < aElement.length; i++)reClass.test(aElement[i].className) && aClass.push(aElement[i]);
	return aClass
};

var dragList=function(){
	this.initialize.apply(this,arguments);
}

dragList.prototype.initialize=function(obj, len){
	this.box = obj;
    this.oUl = document.createElement('ul');
    for(var i=0; i<len; i++){
    	var aFrag = document.createDocumentFragment();
    	var oLis = document.createElement('li');
    	oLis.innerHTML = i;
    	this.oUl.appendChild(oLis); 
    }
    this.box.appendChild(this.oUl);
    this.oLi = getTag('li', this.oUl);
    this.pos = [];
    this.dom = document.documentElement || document.body;
    this.zIndex = 1;

    this.layOut();
}
dragList.prototype.layOut=function(){
	this.box.style.height = this.box.offsetHeight -2 +'px';
	this.pos.length = 0;
	for(var i=0; i<this.oLi.length; i++){
		this.oLi[i].style.cssText = '';
		this.oLi[i].index = i;
		this.oLi[i].style.top = this.getPosition(this.oLi[i]).top + 'px';
		this.oLi[i].style.left = this.getPosition(this.oLi[i]).left + 'px';
		this.pos.push( {left:this.getPosition(this.oLi[i]).left, top:this.getPosition(this.oLi[i]).top} );	
	}
	for(var i=0; i<this.oLi.length; i++){
		this.oLi[i].style.position = 'absolute';
		this.oLi[i].style.margin = 0;
		this.drag(this.oLi[i]);
	}
}
dragList.prototype.drag=function(obj){
	var oThis = this;
	obj.style.cursor = 'move';
	obj.onmousedown = function(event){
		var event = event||window.event;
		var disX = event.clientX - obj.offsetLeft;
		var disY = event.clientY -obj.offsetTop;
		var oNear = null;
        obj.style.zIndex = oThis.zIndex++;
		document.onmousemove = function(event){
			var event = event||window.event;
			var iL = event.clientX - disX;
			var iT = event.clientY - disY;
            
			var maxL = Math.max(oThis.dom.clientWidth, oThis.dom.scrollWidth);
			var maxT = Math.max(oThis.dom.clientHeight, oThis.dom.scrollHeight);

			iL < 0 && (iL = 0);
			iL > maxL && (iL = maxL);
			iT < 0 && (iT = 0);
			iT > maxT && (iT = maxT);

			obj.style.left = iL + 'px';
			obj.style.top = iT + 'px';

            oNear = oThis.findNear(obj);

            for(var i=0; i<oThis.oLi.length; i++){
            	oThis.oLi[i].className = '';
            }
            oNear && (oNear.className = 'hig');
            return false;
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			if(oNear){
				var temp = obj.index;
				obj.index = oNear.index;
				oNear.index = temp;
                oNear.style.zIndex = oThis.zIndex++;
                
                oThis.doMove(obj, oThis.pos[obj.index]);
                oThis.doMove(oNear, oThis.pos[oNear.index]);
                oNear.className = '';
			}else{
				oThis.doMove(obj, oThis.pos[obj.index]);
			}
			obj.releaseCapture && obj.releaseCapture();
		}
		this.setCapture && this.setCapture();
		return false
	};
}
dragList.prototype.findNear=function(obj){
	var aDis = [];
	var i = 0; 
	for(i=0; i<this.oLi.length; i++){
		this.oLi[i] == obj ? aDis[i] = Number.MAX_VALUE : aDis[i] = this.getDis(obj, this.oLi[i]);
	}
	var minDis = Number.MAX_VALUE;
	var minLi = null;
	for(i=0; i<aDis.length; i++){
		minDis > aDis[i] && (minDis = aDis[i], minLi = this.oLi[i]);
	}

	return this.isButt(obj, minLi) ? minLi : null;
}
dragList.prototype.getDis=function(obj1,obj2){
	var x1 = obj1.offsetLeft + obj1.offsetWidth/2;
	var y1 = obj1.offsetTop + obj1.offsetHeight/2;
	var x2 = obj2.offsetLeft + obj2.offsetWidth/2;
	var y2 = obj2.offsetTop + obj2.offsetHeight/2;

	return dis = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}
dragList.prototype.isButt=function(obj1, obj2){
	var l1 = obj1.offsetLeft;
	var t1 = obj1.offsetTop;
	var r1 = l1 + obj1.offsetWidth;
	var b1 = t1 + obj1.offsetHeight;
	
	var l2 = obj2.offsetLeft;
	var t2 = obj2.offsetTop;
	var r2 = l2 + obj2.offsetWidth;
	var b2 = t2 + obj2.offsetHeight;
	
	return !(r1 < l2 || b1 < t2 || r2 < l1 || b2 < t1)
}
dragList.prototype.doMove=function(obj, position){
	var oThis = this;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var nowL = obj.offsetLeft;
	    var nowT = obj.offsetTop;
	    var speedL = (position.left - nowL)/5;
	    var speedT = (position.top - nowT)/5;
	    speedL = speedL > 0 ? Math.ceil(speedL) : Math.floor(speedL);
	    speedT = speedT > 0 ? Math.ceil(speedT) : Math.floor(speedT);

	    ((nowL != position.left) || (nowT != position.top)) ? (obj.style.left = nowL + speedL + 'px',obj.style.top = nowT + speedT + 'px') : 
	    (clearInterval(obj.timer))
	},30);

}
dragList.prototype.getPosition=function(obj){
	var oTop = obj.offsetTop;
	var oLeft = obj.offsetLeft;
	while(obj.offsetParent){
		oTop += obj.offsetParent.offsetTop;
		oLeft += obj.offsetParent.offsetLeft;
		obj = obj.offsetParent;
	}

	return {top:oTop, left:oLeft}
}