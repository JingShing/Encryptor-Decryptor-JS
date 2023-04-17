    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }
    var dropZone = document.querySelector('#content');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    var fileInput = document.querySelector('#fileInput1');
    fileInput.addEventListener('change', handleFileSelect, false);

    var dropZone2 = document.querySelector('#content2');
    dropZone2.addEventListener('dragover', handleDragOver, false);
    dropZone2.addEventListener('drop', handleFileSelect, false);

    var fileInput2 = document.querySelector('#fileInput2');
    fileInput2.addEventListener('change', handleFileSelect, false);
    

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var new_id = "";
        var old_id = String(event.target.id);
        if(old_id.includes("fileInput")){
            var file = evt.target.files[0];
            if(old_id.includes("1"))new_id = "content";
            else if(old_id.includes("2"))new_id = "content2";
        }
        else{
            var file = evt.dataTransfer.files[0];
            new_id = old_id;
        }
        var file_name = file.name;
        console.log(file_name);

        if(file_name.includes(".png")||file_name.includes(".jpg")){
            cutImageBase64(file, null, 900, 0.7, "output");
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
                document.getElementById("pic").src=base64;
                console.log(base64);
                document.getElementById("sz").innerHTML = parseInt(base64.length/2014,0) + "kb";
                document.getElementById(output_id).value = base64;
            };
        }
