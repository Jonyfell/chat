var board=new Array();
var score=0;//分数
var hasConfiltered=new Array();//是否被合并过

var startx=0;
var starty=0;
var endx=0;
var endy=0;

document.addEventListener("touchstart", function(event) {
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
})
document.addEventListener("touchmove", function(event) {
	event.preventDefault();
})
document.addEventListener("touchend", function(event) {
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	var dx=endx-startx;
	var dy=endy-starty;

	//判断是滑动还是点击
	if(Math.abs(dx)<0.3*documentWidth && Math.abs(dy)<0.3*documentWidth)
		return;

	if(Math.abs(dx)>=Math.abs(dy)){
		if(dx>0){
			if(moveRight()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			if(moveLeft()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}else{
		if(dy>0){
			if(moveDown()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			if(moveTop()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}
})

$(document).ready(function(){
	prepareForMobile();
	newgame();
})
function prepareForMobile() {
	if(documentWidth>500){
		gridContainerWidth=500;
		cellSpace=20;
		cellSideLength=100;
	}

	  $("#grid-container").css("width",gridContainerWidth-2*cellSpace);
	  $("#grid-container").css("height",gridContainerWidth-2*cellSpace);
	  $("#grid-container").css("padding",cellSpace);
	  $("#grid-container").css("border-radius",gridContainerWidth*0.02);

	  $(".grid-cell").css("width",cellSideLength);
	  $(".grid-cell").css("height",cellSideLength);
	  $(".grid-cell").css("border-radius",0.02*cellSideLength);
}

function newgame() {
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateNumber();
	generateNumber();
}

function init() {
	//初始化grid-cell棋盘格
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	//初始化board二维数组
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConfiltered[i]=new Array();
		for(var j=0;j<4;j++)
			board[i][j]=0;
			hasConfiltered[i][j]=false;
	}
	updateBoardView();	
	score=0;
}

function updateBoardView() {
	$(".number-cell").remove();
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>");
			var numberCell=$("#number-cell-"+i+"-"+j);
			if(board[i][j]==0){
				numberCell.css("width","0px");
				numberCell.css("height","0px");
				numberCell.css("top",getPosTop(i,j)+cellSideLength/2);
				numberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
			}else{
				numberCell.css("width",cellSideLength+"px");
				numberCell.css("height",cellSideLength+"px");
				numberCell.css("top",getPosTop(i,j));
				numberCell.css("left",getPosLeft(i,j));
				numberCell.css("backgroundColor",getNumberBgColor(board[i][j]));
				numberCell.css("color",getNumberColor(board[i][j]));
				numberCell.text(board[i][j]);
			}
			hasConfiltered[i][j]=false;
		}
	$(".number-cell").css("line-height",cellSideLength+"px");
	$(".number-cell").css("font-size",0.6*cellSideLength+"px");


}

function generateNumber() {
	if(nospace(board))
		return false;
	//随机一个位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	var times=0;
	while(times<50){
		if(board[randx][randy]==0)
			break;
		randx=parseInt(Math.floor(Math.random()*4));
		randy=parseInt(Math.floor(Math.random()*4));
		times++;
	}
	//优化随机生成位置
	if(times==50){
		for(var i=0;i<4;i++)
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;
			}
		}
	}

	//随机一个数字
	var randNum=Math.random()<0.5?2:4;
	//在随机位置显示数字
	board[randx][randy]=randNum;
	showNumAnimation(randx,randy,randNum);

	return true;
}


//键盘控制方向
$(document).keydown(function(event) {

	switch(event.keyCode){
		case 37:
			event.preventDefault();
			if(moveLeft()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38:
			event.preventDefault();
			if(moveTop()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39:
			event.preventDefault();
			if(moveRight()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40:
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
})
function isgameover() {
	if(nospace(board) && nomove(board)){
		gameover();
	}
}
function gameover() {
	alert("gameover!");
}


//moveLeft():考虑落脚点
//1、落脚点是否为空
//2、落脚位置数字和待定位置数字相同
//3、移动路径中是否有障碍物:noBlock()
function moveLeft() {
	if(!canMoveLeft(board))
		return false;

	//moveLeft
	for(var i=0;i<4;i++)
	 	for(var j=1;j<4;j++){
	 		if(board[i][j]!=0){
	 			for(var k=0;k<j;k++){
	 				if(board[i][k]==0 && noBlockLeft(i,k,j,board)){
	 					//move
	 					showMoveAnimation(i,j,i,k);
	 					board[i][k]=board[i][j];
	 					board[i][j]=0;
	 					continue;
	 				}
	 				else if(board[i][k]==board[i][j] && noBlockLeft(i,k,j,board) && !hasConfiltered[i][k]){
	 					//move
	 					showMoveAnimation(i,j,i,k);
	 					//add
	 					board[i][k]+=board[i][j];
	 					board[i][j]=0;
	 					score+=board[i][k];
	 					updateScore(score);
	 					hasConfiltered[i][j]=true;
	 					continue;
	 				}
	 			}
	 		}
	 	}	
	updateBoardView();
 	return true;
}

function moveRight() {
	if(!canMoveRight(board))
		return false;

	//moveRight
	for(var i=0;i<4;i++)
	 	for(var j=2;j>=0;j--){
	 		if(board[i][j]!=0){
	 			for(var k=3;k>j;k--){
	 				if(board[i][k]==0 && noBlockRight(i,k,j,board)){
	 					//move
	 					showMoveAnimation(i,j,i,k);
	 					board[i][k]=board[i][j];
	 					board[i][j]=0;
	 					continue;
	 				}
	 				else if(board[i][k]==board[i][j] && noBlockRight(i,k,j,board) && !hasConfiltered[i][k]){
	 					//move
	 					showMoveAnimation(i,j,i,k);
	 					//add
	 					board[i][k]+=board[i][j];
	 					board[i][j]=0;
	 					score+=board[i][k];
	 					updateScore(score);
	 					hasConfiltered[i][j]=true;
	 					continue;
	 				}
	 			}
	 		}
	 	}	
	updateBoardView();
 	return true;
}

function moveTop() {
	if(!canMoveTop(board))
		return false;

	//moveTop
	for(var j=0;j<4;j++)
	 	for(var i=0;i<4;i++){
	 		if(board[i][j]!=0){
	 			for(var k=0;k<i;k++){
	 				if(board[k][j]==0 && noBlockTop(j,k,i,board)){
	 					//move
	 					showMoveAnimation(i,j,k,j);
	 					board[k][j]=board[i][j];
	 					board[i][j]=0;
	 					continue;
	 				}
	 				else if(board[k][j]==board[i][j] && noBlockTop(j,k,i,board) && !hasConfiltered[i][k]){
	 					//move
	 					showMoveAnimation(i,j,k,j);
	 					//add
	 					board[k][j]+=board[i][j];
	 					board[i][j]=0;
	 					score+=board[k][j];
	 					updateScore(score);
	 					hasConfiltered[i][j]=true;
	 					continue;
	 				}
	 			}
	 		}
	 	}	
	updateBoardView();
 	return true;
}

function moveDown() {
	if(!canMoveDown(board))
		return false;

	//moveDown
	for(var j=0;j<4;j++)
	 	for(var i=2;i>=0;i--){
	 		if(board[i][j]!=0){
	 			for(var k=3;k>i;k--){
	 				if(board[k][j]==0 && noBlockDown(j,k,i,board)){
	 					//move
	 					showMoveAnimation(i,j,k,j);
	 					board[k][j]=board[i][j];
	 					board[i][j]=0;
	 					continue;
	 				}
	 				else if(board[k][j]==board[i][j] && noBlockDown(j,k,i,board) && !hasConfiltered[i][k]){
	 					//move
	 					showMoveAnimation(i,j,k,j);
	 					//add
	 					board[k][j]+=board[i][j];
	 					board[i][j]=0;
	 					score+=board[k][j];
	 					updateScore(score);
	 					hasConfiltered[i][j]=true;
	 					continue;
	 				}
	 			}
	 		}
	 	}	
	updateBoardView();
 	return true;
}



