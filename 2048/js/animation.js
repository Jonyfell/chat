function showNumAnimation(i,j,randNum) {
	var numberCell=$("#number-cell-"+i+"-"+j);
	numberCell.css("backgroundColor",getNumberBgColor(randNum));
	numberCell.css("color",getNumberColor(randNum));
	numberCell.text(randNum);
	numberCell.animate({
		width:cellSideLength+"px",
		height:cellSideLength+"px",
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	})
}


function showMoveAnimation(fromx,fromy,tox,toy) {
	var numberCell=$("#number-cell-"+fromx+"-"+fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
}

function updateScore(score) {
	 $("#score").text(score);
}