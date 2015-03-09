sidePaneWidth=300;
size_x=640;
size_y=480;
canvas_x=500;
canvas_y=460;
minutes=60;
degrees=100.0;

timenow=4;

targetpath=[[0,20],[10,60],[15,45],[50,26]];
actualpath=[30,35,38,39,39,41,43,49,53,56,56,57,58,59,60,61,60,59,58,57,56,55,54,53,51,49,47,40];

cx=400; //size of active portion of canvas
cy=300;
rx=1.33; //convesion constant
ry=1.33;

function MathMax(x,y)
{
    if (x>y)
        return x;
    return y;
}
function format(num, l) {
    var ret = '' + num;
    while (ret.length < l)
        ret = '0' + ret;
    return ret;
}

function celsius2y(celsius)
{
    return canvas_y-40-10-celsius*100.0*ry/degrees;
}
function y2celsius(y)
{
    return -(y-canvas_y+40+10)*degrees/ry/100.0;    
}
function minutes2x(minute)
{
    return 10+60 + minute*1.0*100.0*rx/minutes;
}
function x2minutes(x)
{
    return (x -10-60)*minutes/rx/100.0;
}

function fmt(x)
{
    if (x)
        return ''+x.toFixed(1);
    return '';
}
function add_path_point()
{
    var minute=0;
    if (targetpath.length>0)
        minute=targetpath[targetpath.length-1][0];
        
    targetpath.push([minute+1,25]);
    draw();
    update_text();
}
function getTargetPathAt(timenow)
{
    if (targetpath.length==0)
        return 0;
    if (targetpath.length==1)
        return targetpath[0][1];            
    for(var i=0;i<targetpath.length-1;++i)
    {
        var a=targetpath[i];
        var b=targetpath[i+1];
        
        var amin=a[0];
        var bmin=b[0];
        var adeg=a[1];
        var bdeg=b[1];
        
        if (timenow>=amin && timenow<=bmin)
        {
            var p=(timenow-amin)/(bmin-amin);
            var deg=adeg + (bdeg-adeg)*p;
            return deg;
        }                
    }
    if (timenow<=targetpath[0][0])
        return targetpath[0][1];
    if (timenow>=targetpath[targetpath.length-1][0])
        return targetpath[targetpath.length-1][1];
    return 0;
}

function draw() 
{
    var timectl=document.getElementById('timenow');
    var realtempctl=document.getElementById('realtemp');
    var shouldtempctl=document.getElementById('shouldtemp');
    var coolingctl=document.getElementById('cooling');
    var heatingctl=document.getElementById('heating');
    
    var targ=getTargetPathAt(timenow);
    if (actualpath[timenow] && targ)
    {
        var act=actualpath[timenow];
        if (act>targ+1.0)
        {
            coolingctl.value='På';
            heatingctl.value='Av';
        }
        else if (act<targ-1.0)
        {
            coolingctl.value='Av';
            heatingctl.value='På';
        }
        else
        {
            coolingctl.value='Av';
            heatingctl.value='Av';
        }
    }
    else
    {
        coolingctl.value='';
        heatingctl.value='';
    }
    
    timectl.value=''+timenow;
    realtempctl.value=fmt(actualpath[timenow]);
    shouldtempctl.value=fmt(getTargetPathAt(timenow));
    
    var c=document.getElementById('canvas');
    var ctx = c.getContext("2d");
    ctx.clearRect ( 0 , 0 , c.width, c.height );
    ctx.font = '14pt normal';
    ctx.globalAlpha=1.0;
    ctx.fillStyle=  "#000000";
    ctx.strokeStyle = '#000000';
    ctx.lineWidth=1.0;
    ctx.beginPath();
    ctx.moveTo(60,40);
    ctx.lineTo(60,canvas_y-30);
    ctx.lineTo(cx-20,canvas_y-30);          
    ctx.stroke();
    
    
    
    ctx.beginPath();
    for(var x=0;x<minutes;x+=5)
    {
        var x1=minutes2x(x);
        var y1=canvas_y-5;
        ctx.fillText(format(x),x1-10,y1);
        ctx.moveTo(x1,canvas_y-33);
        ctx.lineTo(x1,canvas_y-27);
        
    }
    ctx.stroke();

    ctx.beginPath();
    for(var y=0;y<degrees;y+=5)
    {
        var x1=15;
        var y1=celsius2y(y);
        ctx.fillText(y+'°',10,y1);
        ctx.moveTo(57,y1);
        ctx.lineTo(63,y1);
        
    }
    ctx.stroke();

    ctx.fillText('Bör-värde',190,17);

    ctx.fillText('Verkligt värde',390,17);

    ctx.beginPath();
    ctx.moveTo(100,15);
    ctx.lineTo(180,15);
    
   
    for(var i=0;i<targetpath.length;++i)
    {
        var x1=minutes2x(targetpath[i][0]);
        var y1=celsius2y(targetpath[i][1]);
        if (i==0)
            ctx.moveTo(x1,y1);
        else
            ctx.lineTo(x1,y1);        
    }
    ctx.lineWidth=3.0;
    ctx.strokeStyle = '#109f10';
    ctx.fillStyle = '#109f10';
    ctx.stroke();

    for(var i=0;i<targetpath.length;++i)
    {
        ctx.beginPath();
        var x1=minutes2x(targetpath[i][0]);
        var y1=celsius2y(targetpath[i][1]);
        ctx.arc(x1,y1,MathMax(rx*0.3,ry*0.3),0,2*Math.PI);
        ctx.fill();
    }
    
    
    ctx.strokeStyle = '#000000';


    ctx.beginPath();
    ctx.moveTo(300,15);
    ctx.lineTo(380,15);
   
    for(var i=0;i<actualpath.length;++i)
    {
        var x1=minutes2x(i);
        var y1=celsius2y(actualpath[i]);
        if (i==0)
            ctx.moveTo(x1,y1);
        else
            ctx.lineTo(x1,y1);
        
    }
     ctx.lineWidth=3.0;
     ctx.strokeStyle = '#2020ff';
     ctx.stroke();


    ctx.globalAlpha=0.5;
    ctx.lineWidth=5.0;
    ctx.strokeStyle="#ff7070";
    ctx.fillStyle="#ff7070";
    var x1=minutes2x(timenow);
    ctx.beginPath();
    ctx.moveTo(x1,40);
    ctx.lineTo(x1,cy);
    ctx.stroke();
    ctx.fillText("Nu",x1+5,60);

    //ctx.moveTo(10,10);
    //ctx.lineTo(200,200);
    //ctx.stroke();    
}

function onresize()
{
    var canvas=document.getElementById('canvas');
    var controls=document.getElementById('controls');
    
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    
    size_x=x;
    size_y=y;
    canvas.style.position='fixed';
    controls.style.position='fixed';
    
    canvas_x=x-80-sidePaneWidth;
    canvas_y=y-50;
    canvas.width=canvas_x;
    canvas.height=canvas_y;
    canvas.style.width=canvas_x;
    canvas.style.height=canvas_y;
    controls.style.left=''+(size_x-sidePaneWidth-40)+'px';
    controls.style.width=sidePaneWidth;
    controls.style.height=canvas_y;


    cx=canvas_x-70;
    cy=canvas_y-60;
    rx=cx/100.0;
    ry=cy/100.0;
}

function removeAll()
{
    targetpath=[];
    
    save();
    draw();
    update_text();
}
function onresizeevent()
{
    onresize();
    draw();

}
function onMouseClick(e)
{
    var canvas=document.getElementById('canvas');
    canoffset = $(canvas).offset();
    var mx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    var my = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

    var deg_c=(y2celsius(my));
    var minute=parseInt(x2minutes(mx));

    var edited=0;
    for(var i=0;i<targetpath.length;++i)
    {
        var tminute=targetpath[i][0];
        var tdeg_c=targetpath[i][1];
        if (minute==tminute && Math.abs(tdeg_c-deg_c)<ry)
        {
            targetpath.splice(i,1);
            edited=1;    
            break;
        }
        else
        if (minute==tminute)
        {
            targetpath[i][1]=deg_c;
            edited=1;    
            break;
        }
    }
    
    if (!edited)
    {
        if (targetpath.length==0 || targetpath[targetpath.length-1][0]<minute)
        {
            edited=1;
            targetpath.push([minute,deg_c]);    
        }
        else if (targetpath[0][0]>minute)
        {
            edited=1;
            targetpath.splice(0,0,[minute,deg_c]);
        }
        else
        {
            for(var i=0;i<targetpath.length-1;++i)
            {
                var a=targetpath[i][0];
                var b=targetpath[i+1][0];
                if (a<minute && minute<b)
                {
                    targetpath.splice(i+1,0,[minute,deg_c]);
                    edited=1;
                    break;
                }
            }
        }
    }


    draw();
    update_text();
    save();
    
}
text_no_validate=0;
function textchanged(idx,elemname,axis)
{
    axis=parseInt(axis);
    var elem=document.getElementById(elemname);
    
    var value=parseFloat(elem.value);
    if (axis==1)
        value=parseInt(value);
      
    idx=parseInt(idx);
    if (axis==0 && text_no_validate!=1)
    {
        fixed=0;
        if (idx!=0)
        {
            var bef=targetpath[idx-1][0];
            if (value<=bef)
            {
                value=bef+1;
                fixed=1;
            }
        }
        if (idx!=targetpath.length-1)
        {
            var aft=targetpath[idx+1][0];
            if (value>=aft)
            {
                value=aft-1;        
                fixed=1;
            }
        }
    }
    
    targetpath[idx][axis]=value;
    
    draw();
    save();
    
}
function Remove(idx)
{
    targetpath.splice(parseInt(idx),1);
    draw();
    save();
    update_text();
}
function update_text()
{
    text_no_validate=1;
    var e=document.getElementById('textvalues');
    
    var s='<table><tr><td>Tid</td><td>Temp</td></tr>';
    
    for(var i=0;i<targetpath.length;++i)
    {
        var minval=targetpath[i][0];
        var degval=targetpath[i][1];
        var idnamex='path'+i+'x';
        s+='<tr><td><input type="text" size="3" id="'+idnamex+'" onchange="textchanged('+i+',\''+idnamex+'\',0)" value="'+minval+'" /></td> ';
        var idnamey='path'+i+'y';
        s+='<td><input type="text" size="3" id="'+idnamey+'" onchange="textchanged('+i+',\''+idnamey+'\',1)" value="'+degval.toFixed()+'" />°</td>';
        s+='<td><button onclick="Remove('+i+')">x</button></td></tr> ';
    }
    s+='<tr><td colspan="2"><button onclick="add_path_point()">Lägg till punkt</button></td></tr>';
    s+="</table>";
    e.innerHTML=s;
    text_no_validate=0;
    
}

function play()
{
    alert('Inte implementerat än!');
    draw();
}
function rewind()
{
    timenow-=1;
    draw();
}
function forward()
{
    timenow+=1;
    draw();
}

function registermouseevents()
{
    var canvas=document.getElementById('canvas');
    canvas.onclick=onMouseClick;


}
function save()
{
    var status=document.getElementById('status');
    status.innerHTML='Saving';

    $.ajax( {
        type: "POST",
        url: "/save",
        data: '',
        success: function( data ) {
            var status=document.getElementById('status');
            status.innerHTML='OK';
        },
        dataType:'json'    
    });

}

