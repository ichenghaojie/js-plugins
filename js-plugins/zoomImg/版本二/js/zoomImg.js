/**
 * 图片缩放拖拽插件
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
var imgZoom = function () {
    this.initialize.apply(this, arguments)
};
    
imgZoom.prototype.initialize=function(oImg,oSrc,obuttons){
    var oThis=this;
    this.oBox = oImg;
    
    this.obj=document.createElement('img');
    this.obj.className="imgObj";
    this.obj.src=oSrc;
    this.oBox.appendChild(this.obj);
    
    for(var i=0; i<obuttons.length; i++){
        var imgElement=document.createElement('img');
        imgElement.src = obuttons[i];
        var imgButton=document.createElement("div");
        imgButton.appendChild(imgElement);
        this.oBox.appendChild(imgButton);
    };
    
    var buttons = getTag('div',this.oBox);
    this.zoomIn=buttons[0];
    this.zoomIn.className="zoomIn";
    this.zoomOut=buttons[1];
    this.zoomOut.className="zoomOut";
    this.zoomOrg=buttons[2];
    this.zoomOrg.className="zoomOrg";

    this.oWidth=this.obj.offsetWidth;
    this.oHeight=this.obj.offsetHeight;
    this.changeWidth = this.oWidth*(0.2);
    this.changeHeight = this.oHeight*(0.2);
    this.index=0;

    this.zoomIn.onclick=function(){
        oThis.oin();
    }
    this.zoomOut.onclick=function(){
        oThis.out();
    }
    this.zoomOrg.onclick=function(){
        oThis.org();
    }

    this.drag(this.obj);
};
    
imgZoom.prototype.oin=function(){
    if(this.index > 4){
        return;
    }
    
    var imgWidth=this.obj.offsetWidth;
    var imgHeight=this.obj.offsetHeight;
    var nowL=this.obj.style.left;
    nowL == '' && (nowL = '0px');
    var nowT=this.obj.style.top;
    nowT == '' && (nowT = '0px');
    
    this.obj.style.width=imgWidth+this.changeWidth+"px";
    this.obj.style.height=imgHeight+this.changeHeight+"px";
    this.obj.style.left = (parseInt(nowL.slice(0,nowL.length-2))+(-(this.changeWidth/2))) +'px';
    this.obj.style.top = (parseInt(nowT.slice(0,nowT.length-2))+(-(this.changeHeight/2)))+'px';
    this.index++;
};

imgZoom.prototype.out=function(){
    if(this.index < (-3)){
        return;
    }

    var imgWidth=this.obj.offsetWidth;
    var imgHeight=this.obj.offsetHeight;
    var nowL=this.obj.style.left;
    nowL == '' && (nowL = '0px');
    var nowT=this.obj.style.top;
    nowT == '' && (nowT = '0px');
    
    this.obj.style.width=imgWidth-this.changeWidth+"px";
    this.obj.style.height=imgHeight-this.changeHeight+"px";
    if(this.index>0){
        this.index--;
        var oL = (parseInt(nowL.slice(0,nowL.length-2))+(this.changeWidth/2));
        var disW = this.obj.offsetWidth - this.oBox.offsetWidth;
        oL >= 0 && (oL = 0);
        Math.abs(oL) >= (disW) && (oL = (-(disW)));
        
        var oT = (parseInt(nowT.slice(0,nowT.length-2))+(this.changeHeight/2));
        var disH = this.obj.offsetHeight - this.oBox.offsetHeight
        oT >= 0 && (oT = 0);
        Math.abs(oT) >= (disH) && (oT = (-(disH)));
        
        this.obj.style.left = oL +'px';
        this.obj.style.top = oT + 'px';
        
    }else{
        this.index--;
        var sIndex=Math.abs(this.index);
        this.obj.style.left = (this.changeWidth/2*sIndex)+'px';
        this.obj.style.top = (this.changeHeight/2*sIndex)+'px';
 
    }
};

imgZoom.prototype.drag=function(obj){
    
    var oThis = this;
    var handle = obj;
    handle.style.cursor = "move";
    handle.onmousedown=function(event){
        if(oThis.index<0){
            handle.style.cursor = "default";
            return ;
        }else{
            handle.style.cursor = "move";
        }
        var event=event||window.event;
        var disX=event.clientX-oThis.oBox.offsetLeft;
        var disY=event.clientY-oThis.oBox.offsetTop;
        
        var nowL=handle.style.left;
        var nowT=handle.style.top;
        
        document.onmousemove=function(event){
            var event=event||window.event;
            var iL=event.clientX-oThis.oBox.offsetLeft-disX;
            var iT=event.clientY-oThis.oBox.offsetTop-disY;
            
            var imgW=handle.style.width;
            var imgH=handle.style.height;
            var minx = -(parseInt(imgW.slice(0,imgW.length-2))-oThis.oBox.offsetWidth);
            var minY = -(parseInt(imgH.slice(0,imgH.length-2))-oThis.oBox.offsetHeight);

            var changeX = (parseInt(nowL.slice(0,nowL.length-2))+iL);
            changeX > 0 && (changeX = 0);
            changeX < minx && (changeX = minx);
            
            var changeY = (parseInt(nowT.slice(0,nowT.length-2))+iT);
            changeY > 0 && (changeY = 0);
            changeY < minY && (changeY = minY);

            handle.style.left=changeX+'px';
            handle.style.top=changeY+'px';
            
            return false;
        }
        document.onmouseup=function(){
            document.onmousemove=null;
            document.onmouseup=null;

            handle.releaseCapture && handle.releaseCapture()
        }

        this.setCapture && this.setCapture();
        return false;
    }

};

imgZoom.prototype.org=function(){
    this.obj.style.width=this.oWidth+"px";
    this.obj.style.height=this.oHeight+"px";
    this.obj.style.left = 0+'px';
    this.obj.style.top = 0+'px';
    this.index=0;
}

imgZoom.prototype.changeImg=function(oSrc){
    var imgBox = getTag('img', this.oBox)[0];
    imgBox.src = oSrc;
    this.org();
}