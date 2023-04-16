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
    setBase64Image(s1);
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
        document.getElementById(output_id).value = base64;
    };
}
function setBase64Image(base64){
    document.getElementById("pic").src=base64;
    document.getElementById("sz").innerHTML = parseInt(base64.length/2014,0) + "kb";
}
