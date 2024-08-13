const myCanvas = document.getElementById('my-canvas'); 
const myContext = myCanvas.getContext('2d');
const img = new Image();
var fReader = new FileReader();

// upload image
const upload_image_input = document.getElementById("upload-image-input")
const upload_image_btn = document.getElementById("upload-image-btn")

upload_image_btn.addEventListener("click", function() {
    upload_image_input.click()
});

function drawImageScaled(img, ctx) {
    var canvas = ctx.canvas ;
    var hRatio = canvas.width  / img.width    ;
    var vRatio =  canvas.height / img.height  ;
    var ratio  = Math.min ( hRatio, vRatio );
    var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
    var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(img, 0,0, img.width, img.height,
                        centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
}

upload_image_input.addEventListener("change", function() {
    if (upload_image_input.files[0].name) {
        fReader.readAsDataURL(upload_image_input.files[0]);
        fReader.onloadend = function(event){
            img.src = event.target.result;
            img.onload = () => {
                drawImageScaled(img, myContext);
            }
        }
    }
});