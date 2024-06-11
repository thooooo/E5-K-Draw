var c = $('#canvas')[0];
var ctx = c.getContext('2d');
var selectedColor = document.getElementById('picker').value;
var selectedThickness = 24;
var selectedLayer = 1;
var isPressed = false;
var prevPoint = [0, 0];

// Sets width of canvas

c.width = 1400;
c.height = 1000;

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, c.width, c.height);

// Event listeners

$('.color').on('click', function(){
	$('.color.active').removeClass('active');
	$(this).addClass('active');
	
	selectedColor = $(this).data('color');
});

$('.picker').on('change click', function(){
	selectedColor = this.value;
	this.style.boxShadow = "0 7px 25px " + selectedColor;
	document.getElementById('picker').style.color = this.value;
});

$('.thickness').on('click', function(){
	$('.thickness.active').removeClass('active');
	$(this).addClass('active');
	
	selectedThickness = $(this).data('thickness');
});

$(c).on('mousemove', function(e){
	var x = e.offsetX * 2;
	var y = e.offsetY * 2;
	
	if(isPressed){
		drawLine(x, y);
	}
});

$(c).on('mousedown', function(e){
	prevPoint = [(e.offsetX * 2), e.offsetY * 2];
	ctx.beginPath();
	ctx.moveTo(prevPoint[0], prevPoint[1]);
	isPressed = true;
});

$(c).on('mouseup mouseleave', function(){
	isPressed = false;
	ctx.closePath();
	saveImage();
});

$('[data-clear]').on('click', function(){
	clearCanvas();
});

$('#save').on('click', function(){
	saveImage();
	clearCanvas();
});

// Does what is says

function clearCanvas(){
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, c.width, c.height);
}

// Saves image to bg

function saveImage(){
	var image = c.toDataURL('image/png');
	
	document.getElementById('drawing').value = image;

	$('.bg-img').css({
		'background-image': 'url(' + image + ')'
	});
}

// Draws a line

function drawLine(x, y){
	ctx.lineTo(x, y);
	ctx.lineWidth = selectedThickness;
	ctx.strokeStyle = selectedColor;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.stroke();
	
	prevPoint = [x, y];
}