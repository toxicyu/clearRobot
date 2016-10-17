/**
 * Created by Diego on 16/3/3.
 */
var w=35;
var h=35;
var per_h=62;
var per_w=50;
var p={};
var flag=true;
var keyCodeFlag=false;
var dirFlag;

var preDir="";
var curMap;//当前地图数据数组，初始与CurLevel相同，游戏中改变
var CurLevel;//当前级地图数据，游戏中不变，用来判断游戏是否结束
var iCurLevel=parseInt(document.getElementById('level').getAttribute("value"));
var curMan;//当前机器人图片
var mycanvas=document.getElementById('myCanvas');
var context = mycanvas.getContext('2d');
var block=document.getElementById("block");
var gray_u=document.getElementById("gray_u");
var gray_l=document.getElementById("gray_l");
var gray_r=document.getElementById("gray_r");
var gray_d=document.getElementById("gray_d");
var gray_ul=document.getElementById("gray_ul");
var gray_ur=document.getElementById("gray_ur");
var gray_dl=document.getElementById("gray_dl");
var gray_dr=document.getElementById("gray_dr");
var box=document.getElementById("box");
var ball=document.getElementById("ball");
var wall=document.getElementById("wall");
var pdown=document.getElementById("pdown");
var pup=document.getElementById("pup");
var pleft=document.getElementById("pleft");
var pright=document.getElementById("pright");
var msg=document.getElementById("msg");
function Point(x,y)
{
    this.x=x;
    this.y=y;
}
var per_position={};
var startPos={};//起始坐标
startPos.x=0;
startPos.y=0;
var path="";//路径
var direct="";//方向
//添加事件响应   决定机器人初始位置
mycanvas.addEventListener('click', function(e){
    e.stopPropagation();
    if(flag){
        p = getEventPosition(e);
        console.log(p);
        showPos(p);
        keyCodeFlag=true;
    }
}, false);

//得到点击的坐标
function getEventPosition(ev){
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    }else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return {x: x, y: y};
}
//当前机器人位置
function showPos(p){
    for(var j =0;j<CurLevel.length;j++)
    {
        for(var i=0;i<CurLevel[0].length;i++)
        {
            if(w*i<p.x && w*(i+1)>p.x && h*j<p.y &&h*(j+1)>p.y)
            {
                per_position.x=j;
                per_position.y=i;
                startPos.x=j;
                startPos.y=i;
                //console.log(startPos);
                showMoveInfo();
                if(curMap[j][i]!=1&&curMap[j][i]!=3)
                {
                    curMap[j][i]=4;
                    context.drawImage(curMan,w*i-(curMan.width-w)/2,h*j-(curMan.height-h),curMan.width,curMan.height);
                    flag=false;
                }
                else{
                    alert("雅蠛蝶 太高了上不去。");
                }
            }
        }
    }
}
function init()
{
    initLevel();
    showMoveInfo();
}

function initLevel()
{
    curMap=copyArray(levels[iCurLevel]);
    CurLevel=copyArray(levels[iCurLevel]);
    curMan=pdown;
    //初始化的时候顺便重置canvas的宽高
    myCanvas.setAttribute("width",(CurLevel.length+1)*w);
    myCanvas.setAttribute("height",(CurLevel[0].length)*h);
    InitMap();
    DrawMap(curMap);

}

function showMoveInfo()
{
    msg.innerHTML="起始x坐标：" + startPos.x+"<br>起始y坐标："+startPos.y+"<br>路径："+path;
    showHelp=false;
}
//画地板，平铺方块
function InitMap()
{

    for(var j =1;j<CurLevel.length-1;j++)
    {
        for(var i=1;i<CurLevel[0].length-1;i++)
        {
            context.drawImage(block,w*i,h*j,w,h);
        }
    }

}
function DrawMap(level)
{
    for(var i=1;i<level.length-1;i++)//y轴
    {
        for(var j=1;j<level[i].length-1;j++)//x轴
        {
            var pic=block;
            switch(level[i][j])
            {
                case 1:
                    pic=wall;
                    break;
                case 2:
                    pic=gray_u;
                    break;
                case 3:
                    pic=box;
                    break;
                case 5:
                    pic=gray_l;
                    break;
                case 6:
                    pic=gray_d;
                    break;
                case 7:
                    pic=gray_r;
                    break;
                case 8:
                    pic=gray_ul;
                    break;
                case 9:
                    pic=gray_ur;
                    break;
                case 10:
                    pic=gray_dl;
                    break;
                case 11:
                    pic=gray_dr;
                    break;
                case 12:
                    pic=ball;
                    break;
                case 4:
                    pic=curMan;
                    per_position.x=i;
                    per_position.y=j;

            }
            context.drawImage(pic,w*j-(pic.width-w)/2,h*(i)-(pic.height-h),pic.width,pic.height);//(图片，x,y,width,height)
        }
    }

}

function go(dir)//根据方向使机器人到达当前方向所能到达的地方
{
    var p1;
    var p2;
    var cx=per_position.x;
    var cy=per_position.y;
    switch(dir)
    {
        case "up":					//上
            curMan=pup;
            for(var i=0;;i++)
            {
                if(curMap[cx-1][cy]==0)
                {
                    --cx-1;
                }
                else{
                    break;
                }
            };
            for(var j=cx;j<=per_position.x;j++)
            {
                curMap[j][cy]=2;
            }
            if(preDir=="left")curMap[per_position.x][per_position.y]=8;
            if(preDir=="right")curMap[per_position.x][per_position.y]=9;
            if(preDir=="")curMap[per_position.x][per_position.y]=12;
            if(cx==per_position.x)
            {direct=""}
            else{direct="u";}
            p1=new Point(cx,cy);

            p2=2;
            break;
        case "down":					//下
            curMan=pdown;
            for(var i=0;;i++)
            {
                if(curMap[cx+1][cy]==0)
                {
                    ++cx+1;
                }
                else{
                    break;
                }
            }
            for(var j=per_position.x;j<=cx;j++)
            {
                curMap[j][cy]=6;
            }
            if(preDir=="left")curMap[per_position.x][per_position.y]=10;
            if(preDir=="right")curMap[per_position.x][per_position.y]=11;
            if(preDir=="")curMap[per_position.x][per_position.y]=12;
            if(cx==per_position.x)
            {direct=""}
            else{direct="d";}
            p1=new Point(cx,cy);
            p2=6;
            break;
        case "left":					  //左
            curMan=pleft;
            for(var i=0;;i++)
            {
                if(curMap[cx][cy-1]==0)
                {
                    --cy-1;
                }
                else{
                    break;
                }
            }
            for(var j=cy;j<=per_position.y;j++)
            {
                curMap[cx][j]=5;
            }

            if(preDir=="up")curMap[per_position.x][per_position.y]=11;
            if(preDir=="down")curMap[per_position.x][per_position.y]=9;
            if(preDir=="")curMap[per_position.x][per_position.y]=12;
            if(cy==per_position.y)
            {direct=""}
            else{direct="l";}
            p1=new Point(cx,cy);
            p2=5;
            break;
        case "right":						//右
            curMan=pright;
            for(var i=0;;i++)
            {
                if(curMap[cx][cy+1]==0)
                {
                    ++cy+1;
                }
                else{
                    break;
                }
            }
            for(var j=per_position.y;j<=cy;j++)
            {
                curMap[cx][j]=7;
            }

            if(preDir=="up")curMap[per_position.x][per_position.y]=10;
            if(preDir=="down")curMap[per_position.x][per_position.y]=8;
            if(preDir=="")curMap[per_position.x][per_position.y]=12;
            if(cy==per_position.y)
            {direct=""}
            else{direct="r";}
            p1=new Point(cx,cy);
            p2=7;
            break;
    }
    if(p1.x==per_position.x && p1.y==per_position.y){}
    else preDir=dir;
    if(TryGo(p1,p2,direct))
    {
        showMoveInfo();
    }
    InitMap();
    DrawMap(curMap);

    if(CheckFinish())
    {
		NextLevel(1);
    }
}
function TryGo(p1,p2,direct)//p1是当前到达的位置
{
    //console.log(p1);
    if(p1.x<0) return false;
    if(p1.y<0) return false;
    if(p1.x>=curMap.length) return false;
    if(p1.y>=curMap[0].length) return false;
    if(curMap[p1.x][p1.y]==1||curMap[p1.x][p1.y]==3)return false;//如果是墙或者障碍物，不能通行

    //机器人前进

    //curMap[per_position.x][per_position.y]=p2;
    curMap[p1.x][p1.y]=4;
    per_position=p1;
    path+=direct

    return true;
}

//判断是否完成本关
function CheckFinish()
{
    for(var i=0;i<curMap.length;i++)//y轴
    {
        for(var j=0;j<curMap[i].length;j++)//x轴
        {

            if(curMap[i][j]==0)
            {
                //console.log("asd");
                return false;
            }
        }
    }
    return true;
}
function NextLevel(i)
{
    path="";
    preDir="";
    flag=true;
    iCurLevel=iCurLevel+i;
	document.getElementById("curlevel").innerHTML=iCurLevel+1;
    if(iCurLevel<0)
    {
        iCurLevel=0;
        return;
    }
    var len=levels.length;
    if(iCurLevel>len-1)
    {
        iCurLevel=len-1;
        return;
    }
    initLevel();

    showMoveInfo();
}

function DoKeyDown(event)
{
    switch(event.keyCode)
    {
        case 37://left
            go('left');
            break;
        case 38://up
            go('up');
            break;
        case 39://right
            go('right');
            break;
        case 40://down
            go('down');
            break;
    }
}
var showHelp=false;
function DoHelp()
{
    showHelp=!showHelp;
    if(showHelp)
    {
        msg.innerHTML="选择一个空地放下机器人,用键盘上的上、下、左、右键移动机器人并且每次移动都会到该方向的尽头";
    }
    else
        showMoveInfo();
}
//克隆二维数组
function copyArray(arr)
{
    var b=[];
    for(i=0;i<arr.length;i++)
    {
        b[i]=arr[i].concat();
    }
    return b;
}
window.onload=init;
NextLevel(0);
