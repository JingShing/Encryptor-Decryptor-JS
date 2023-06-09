function encrypt_button(){
    let line = document.getElementById("content").value;
    let key = document.getElementById("key").value;
    document.getElementById("output").value = encrypt(line, key);
}
function decrypt_button(){
    let line = document.getElementById("content").value;
    let key = document.getElementById("key").value;
    document.getElementById("output").value = decrypt(line, key);
}

function key_line_len(line, key) {
  if (key.length > 0) {
    while (key.length < line.length) {
      key += key;
    }
  } else {
    key = key_line_len(line, 'RRR'); // default key
  }
  return key;
}

// encryption
function encrypt(line, key) {
    key = key_line_len(line, key);
    let en_str = "";
    for (let i = 0; i < line.length; i++) {
    const j = key[i]; // i is data, j is key
    const temp = String.fromCharCode(line.charCodeAt(i) + j.charCodeAt(0)); // encryption character = character Unicode + key Unicode
    en_str += temp;
    }
    const s1 = btoa(en_str);
    // setBase64Image(s1);
    return s1;
}

// decryption
function decrypt(line, key) {
    key = key_line_len(line, key);
    const p = atob(line);
    let de_str = "";
    for (let i = 0; i < p.length; i++) {
        const j = key[i]; // i is data, j is key
        const temp = String.fromCharCode(p.charCodeAt(i) - j.charCodeAt(0)); // decryption = (encryption Unicode character - key Unicode) character
        de_str += temp;
    }
    setBase64Image(de_str);
    generateBlurPreview(de_str, -1, -1, 0.2, 2, "preview")
    // pixelateImageBase(de_str, 2, "preview");
    return de_str;
}

function list_encrypt(data, key) {
  const en_list = [];
  for (const line of data) {
    en_list.push(encrypt(line, key));
  }
  return en_list;
}

function list_decrypt(data, key) {
  const de_list = [];
  for (const line of data) {
    de_list.push(decrypt(line, key));
  }
  return de_list;
}

// drag and drop
function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }
var dropZone = document.querySelector('#content');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

var fileInput = document.querySelector('#fileInput_content');
fileInput.addEventListener('change', handleFileSelect, false);

var dropZone2 = document.querySelector('#key');
dropZone2.addEventListener('dragover', handleDragOver, false);
dropZone2.addEventListener('drop', handleFileSelect, false);

var fileInput2 = document.querySelector('#fileInput_key');
fileInput2.addEventListener('change', handleFileSelect, false);


function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var new_id = "";
    var old_id = String(event.target.id);
    if(old_id.includes("fileInput")){
        var file = evt.target.files[0];
        if(old_id.includes("content"))new_id = "content";
        else if(old_id.includes("key"))new_id = "key";
    }
    else{
        var file = evt.dataTransfer.files[0];
        new_id = old_id;
    }
    var file_name = file.name;

    if(file_name.includes(".png")||file_name.includes(".jpg")){
        cutImageBase64(file, null, 900, 0.7, new_id);
        generateBlurPreview(file, -1, -1, 0.2, 2, "preview");
        // pixelateImage(file, 4, "preview");
    }
    else{
        var reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById(new_id).value = event.target.result;
        };
        reader.readAsText(file);
    }
    clearAllInput();
}
function clearAllInput(){
var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}

// image
function cutImageBase64(m_this,id,wid,quality, output_id) {
    var file = m_this;
    var URL = window.URL || window.webkitURL;
    var blob = URL.createObjectURL(file);
    var base64;
    var img = new Image();
    img.src = blob;
    img.onload = function() {
        var that = this;
        //size
        var w = that.width,
            h = that.height,
            scale = w / h;
            w = wid || w;
            h = w / scale;
        //generate canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(that, 0, 0, w, h);
        // generate base64
        if(file.name.includes('.jpg'))base64 = canvas.toDataURL('image/jpeg', quality || 0.9);
        else if(file.name.includes('.png'))base64 = canvas.toDataURL('image/png', quality || 0.9);
        document.getElementById("pic").src = base64;
        document.getElementById(output_id).value = base64;
    };
}
function setBase64Image(base64){
    document.getElementById("pic").src=base64;
    document.getElementById("sz").innerHTML = parseInt(base64.length/2014,0) + "kb";
}
function generateBlurPreview(input, width, height, quality, scale, output_id) {
    // quality is 0~1
    // scale 1 means normal, 2 means 1/2 size
    const img = new Image();
    if(typeof input == "string"){
        img.src = base64String;
    }
    else{
        const reader = new FileReader();
        reader.readAsDataURL(input);
        reader.onload = function (event) {
        img.src = event.target.result;
        };
    }

    img.onload = function () {
        if (width==-1 && height == -1){
            const canvas = document.createElement('canvas');
            canvas.width = img.width/scale;
            canvas.height = img.height/scale;
            const ctx = canvas.getContext('2d');
            ctx.filter = 'blur(5px)';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // return the preview as a base64 string
            const preview = canvas.toDataURL('image/jpeg', quality);
            document.getElementById(output_id).src = preview;
        }
        else{
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.filter = 'blur(5px)';
            ctx.drawImage(img, 0, 0, width, height);
            // return the preview as a base64 string
            const preview = canvas.toDataURL('image/jpeg', quality);
            document.getElementById(output_id).src = preview;
        }
    };
};
