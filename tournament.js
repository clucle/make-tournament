var canvas;
var ctx;


//array
var players;
var rand_players;


var num_tournament;

//count
var count_players;
var count_tournament;
var unwin;

var box_size_x;
var box_size_y;

var protoArray = [];

function InitCanvas() {
    // 변수, 캔버스 초기화
    canvas = document.getElementById("tournamentCanvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width  = document.getElementById('tournamentCanvas').clientWidth;
    ctx.canvas.height  = document.getElementById('tournamentCanvas').clientHeight;

	players = [];
	rand_players = [];
	num_tournament = 0;

	canvas.addEventListener("mousedown", mouseDownListener, false);

    InputPlayers();
}

var dragging;
var dragIndex;

function mouseDownListener(evt) {
    var blank = canvas.getBoundingClientRect();
    var canvas_x = (evt.clientX - blank.left) * (canvas.width / blank.width);
    var canvas_y = (evt.clientY - blank.top) * (canvas.height / blank.height);
    var index;

    for (index = 0; index < protoArray.length; index++) {
        if (protoArray[index].HitTest(canvas_x, canvas_y)) {
            dragging = true;
            dragIndex = index;
        }
    }
    if (dragging) {
        window.addEventListener("mousemove", mouseMoveListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);
    }
    //canvas.removeEventListener("mousedown", mouseDownListener, false);
}

function mouseMoveListener(evt) {
    var blank = canvas.getBoundingClientRect();
    var canvas_x = (evt.clientX - blank.left) * (canvas.width/blank.width);
    var canvas_y = (evt.clientY - blank.top) * (canvas.height/blank.height);
    protoArray[dragIndex].x = canvas_x;
    protoArray[dragIndex].y = canvas_y;
}
function mouseUpListener(evt) {
    window.removeEventListener("mousemove", mouseMoveListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
    dragging = false;
}





function InitBox(){
	box_size_x = canvas.width / count_tournament;
	box_size_y = ctx.canvas.height / 10;
}

function Display(){
	//출력
	ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(' + 255 + ',' + 255 + ',' + 255 + ',' + 1 + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    for(i = 0; i < num_tournament + 1; i++){

    	var line_top = canvas.height / (num_tournament + 1);
    	var count_line = Math.pow(2, i)
		var line_left = canvas.width / 2 / count_line;

    	for(j = 0; j < count_line; j++){
    		ctx.beginPath();
			ctx.moveTo(line_left + (line_left * 2) * j, i * line_top);
			ctx.lineTo(line_left + (line_left * 2) * j, (i+1) * line_top * 9 / 10);
			ctx.lineWidth = 2;

			// set line color
			ctx.strokeStyle = '#000000';
			ctx.stroke();
    	}


    }
    
	for(i = 0; i < count_tournament; i++) {
		ctx.fillStyle = protoArray[i].color;
		ctx.fillRect(protoArray[i].x, protoArray[i].y, protoArray[i].width, protoArray[i].height);

		ctx.fillStyle = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',' + 1 + ')';
		ctx.font="12px Arial";
		ctx.fillText(rand_players[i],
                protoArray[i].x + 10, protoArray[i].y + 10);
	}
	
}

function InputPlayers(){
	//사람수 입력
	count_players = prompt("Enter Num of Players", "");
	count_tournament = 1;
	while(count_players > count_tournament){
		num_tournament++;
		count_tournament = Math.pow(2, num_tournament)
	}
	unwin = count_tournament - count_players; // 부전승
	//13명일시 num_tournament 4 count_tournament 16

	for(i = 0; i < count_players; i++) {
		players[i] = prompt("Enter Nameof of Player" + i, "");
	}
	InitBox();
	RandPlayers();
}

function RandPlayers(){
	for(i = 0; i < count_tournament; i++) {
		rand_players[i] = "*S(&";
	}
	for(i = 0; i < unwin; i++) {
		rand_players[count_tournament-1-(2*i)] = "NULL";
	}
	for(i = 0; i < count_tournament; i++) {
		if(rand_players[i] == "*S(&"){
			var check = false;
			var rand = Math.floor(Math.random() * count_players);
			//alert(rand);
			for(j = 0; j < i; j++){
				if(rand_players[j] == rand) check = true;
			}
			while(check == true){
				check = false;
				rand = Math.floor(Math.random() * count_players);
				for(j = 0; j < i - 1; j++){
					if(rand_players[j] == rand) check = true;
				}
			}
			rand_players[i] = rand;
		}
		
	}
	for(i = 0; i < count_tournament; i++) {
		if(rand_players[i] != "NULL") rand_players[i] = players[rand_players[i]];
		var color_R = parseInt(Math.random() * 255) + 1;
   		var color_G = parseInt(Math.random() * 255) + 1;
	    var color_B = parseInt(Math.random() * 255) + 1;

	    var color = 'rgba(' + color_R + ',' + color_G + ','
	        +color_B + ',' + 0.5 + ')';
		protoArray.push(new PrototypePlayer(rand_players[i], i * box_size_x, canvas.height * 9 / 10, box_size_x, box_size_y * 9 / 10, color));
	}
	Loop();
	setInterval(Loop, 1000/100);
}
function Loop(){
    Display();
}

function PrototypePlayer (name, mx, my,mwidth, mheight, mcolor) {
	this.name = name;
    this.x = mx;
    this.y = my;
    this.width = mwidth;
    this.height = mheight;
    this.color = mcolor;
}

PrototypePlayer.prototype.HitTest = function(cx, cy) {
    return ((cx > this.x) && (cx < this.x + this.width)
        && (cy > this.y) && (cy < this.y + this.height));
}