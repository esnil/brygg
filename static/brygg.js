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

function getTargetPathAt(timenow)
{
    return 42; //not implemented
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
    
    timectl.value=format(Math.floor(timenow/60),2)+":"+format(timenow%60,2);
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
        ctx.fillText(format(Math.floor(x/60),2)+":"+format(x%60,2),x1-10,y1);
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
    ctx.stroke();
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
    canvas.style.position='absolute';
    controls.style.position='absolute';
    
    canvas_x=x-30-sidePaneWidth;
    canvas_y=y-20;
    canvas.width=canvas_x;
    canvas.height=canvas_y;
    canvas.style.width=canvas_x;
    canvas.style.height=canvas_y;
    controls.style.left=x-sidePaneWidth-10;
    controls.style.width=sidePaneWidth;
    controls.style.height=y-20;


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
}
function onMouseClick(e)
{
    var mx=e.clientX;
    var my=e.clientY;
    var deg_c=(y2celsius(my));
    var minute=parseInt(x2minutes(mx));
    

    targetpath.push([minute,deg_c]);

    save();
    draw();
    
    
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

