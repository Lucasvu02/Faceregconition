'use strict';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const save = document.getElementById('save');
const errorMsgElement = document.getElementById('spanErrorMsg');

const constraints = {
    audio: true,
    video: {
        width: 640, height: 480
    }
};

// Access webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    }
    catch(e) {
        // errorMsgElement.innerHTML = `navigator.getUserMedia.error:${e.toString()}`;
        console.log(e);
    }
}

// Success
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

// Load init
init();

// Draw Image
var context = canvas.getContext('2d');
snap.addEventListener("click", function() {
    context.drawImage(video, 0, 0, 640, 480);
});


// Check canvas has image
function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}

// Save capture image
save.addEventListener("click", (e) => {
    if (!isCanvasBlank(canvas)) {
        save.setAttribute('download', 'image.png');
        save.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    }
})

// send images to api server
function send_data_api() {
    // event.preventDefault();
    var imageFile = document.getElementById('imageFile');
    var formData = new FormData();
    formData.append('file', imageFile.files[0])

    fetch('http://27.71.16.202:8000/api/verification', {
      method: 'POST',
      body: formData,
    })
    // .then(response => response.json())
    // .then(data => console.log(data));
    .then(response => {
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(response);
        // Parse the response as JSON
        return response.json();
    })
    .then(data => {
        // Handle the JSON data
        console.log(data);
        var res = data['data']
        if (res['similarity_percentage'] < 0) {
            document.getElementById("result-div").className = "alert alert-danger m-3";
            document.getElementById("result").innerHTML = `Unrecognizable face!`;
        }
        else {
            document.getElementById("result-div").className = "alert alert-success m-3";
            document.getElementById("result").innerHTML = `Holla ${res['person_name']}, similariy: ${(Math.round(res['similarity_percentage'] * 100)).toFixed(2)}%`;
            var image = new Image();
            // image.onload = function() {
            // ctx.drawImage(image, 0, 0);
            // 
            // };
            image.onload = function() {
                context.drawImage(this, 0, 0, canvas.width, canvas.height);
            }
            image.src = `data:image/png;base64,${res['base64_detection_image']}`;
        }

    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
    
}

// Make a POST request
document.querySelector("form").addEventListener("submit", send_data_api);
document.getElementById('imageFile').addEventListener('change', handleFiles);
function handleFiles(e) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var img = new Image;
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}






// ================
// boostrap
document.querySelector("#sidebar").classList.toggle("expand");
const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});