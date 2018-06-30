"use strict";

function uploadImages(uploader, callback) {
	uploader.onchange = function () {
		var reader = new FileReader();
		reader.onload = function () {
			var image = new Image();
			image.onload = function () {
				callback(image);
			};
			image.src = reader.result;
		};
		reader.readAsDataURL(uploader.files[0]);
	};
}

function convert(data) { //do the thing
	var string = "";
	for (var i = 16; i < data.length; i += 16) {
		var chr = 0;
		for (var j = 0; j < 16; j++)
			chr |= (data[(i + j) * 4 + 1] >= 128 ? 1 : 0) << 15 - j;
		if(!chr)
			return string;
		string = String.fromCharCode(chr) + string;
	}
}

var canvas = document.createElement("canvas");
var c2d = canvas.getContext("2d");
uploadImages(document.getElementById("imageUpload"), function (image) {
	if(image.width!=400 || image.height!=240){
		alert("Incorrect image size. (Expected 400x240)");
		return;
	}
	canvas.width = image.width;
	canvas.height = image.height;
	c2d.drawImage(image, 0, 0);
	var code = convert(c2d.getImageData(0, 0, 256, canvas.height).data);
	putcode(code);
});