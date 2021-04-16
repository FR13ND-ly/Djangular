export { insertImage, changeView, formatText, init, addVideo }
function init() {
    var post_code = document.getElementById('post_code');
    var post_text = window.frames[0].document.getElementsByTagName("body")[0];
    var iframe_head = window.frames[0].document.getElementsByTagName("head")[0];
    var materialize = document.createElement('link');
    var materialize_script = document.createElement('script');
    var material_icons = document.createElement('link');
    post_code.spellcheck = false
    window.frames[0].document.getElementsByTagName("body")[0].contentEditable = true;
    window.frames[0].document.getElementsByTagName("body")[0].focus()
    materialize_script.src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"
    materialize.href = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css";
    material_icons.href = "https://fonts.googleapis.com/icon?family=Material+Icons"
    materialize.rel = 'stylesheet';
    material_icons.rel = 'stylesheet';
    iframe_head.appendChild(materialize);
    iframe_head.appendChild(materialize_script);
    iframe_head.appendChild(material_icons);
    post_text.style = "font-size:18px; padding:2px;";
    post_text.oninput = function() {
        let images = post_text.querySelectorAll('img')
        console.log(images)
        for (let i = 0; i < images.length; i++){
            images[i].addEventListener("click", function(e){create_img_tools(e.target.id)}, true)
        }
    }
    post_text.innerHTML = post_code.value
    document.getElementById('insertImage').onclick = function(){
        insertButon()
    }
}

function insertButon(){
    if (document.getElementById('insertImage').name == "insert"){
        insertImage()
    }
    else if (document.getElementById('insertImage').name == "edit"){
        editImage()
    }
}

function create_img_tools(img){
    let image = window.frames[0].document.getElementById(img);
    if (image.parentNode == window.frames[0].document.getElementsByTagName("body")[0]) {
        var img_container = document.createElement('div');
        img_container.id = img + 'container';
        img_container.style = "white-space: nowrap";
        img_container.onmouseleave=function(){
            remove_img_tools(img);
        }
        let img_tools_container = document.createElement('div');
        img_tools_container.id = img + 'tools_container';
        img_tools_container.style = "position: absolute;z-index:10;white-space: normal;display: inline-block;margin-top:10px; margin-left:" + String(image.offsetLeft + 10) + "px;";
        img_tools_container.className = "img_tools_container";
        var remove_img_icon = document.createElement('i');
        remove_img_icon.className = "material-icons";
        remove_img_icon.innerHTML = 'delete';
        var remove_img_tool = document.createElement('a');
        remove_img_tool.className = "btn center";
        remove_img_tool.id = img + 'remove';
        remove_img_tool.onclick = function(){
            img_container.remove();
        }
        var edit_img_icon = document.createElement('i');
        edit_img_icon.className = "material-icons";
        edit_img_icon.innerHTML = 'edit';
        var edit_img_tool = document.createElement('a');
        edit_img_tool.className="btn";
        edit_img_tool.id = img + 'edit';
        edit_img_tool.onclick = function(){
            first_stage_edit_img(img);
        }
        edit_img_tool.appendChild(edit_img_icon);
        remove_img_tool.appendChild(remove_img_icon);
        image.insertAdjacentElement("beforebegin", img_container);
        img_container.appendChild(img_tools_container);
        img_tools_container.appendChild(remove_img_tool);
        img_tools_container.appendChild(edit_img_tool);
        img_container.appendChild(image);
    }
}

function remove_img_tools(img){
    window.frames[0].document.getElementById(img + 'tools_container').remove();
    let img_container = window.frames[0].document.getElementById(img + 'container');
    let image = window.frames[0].document.getElementById(img);
    img_container.insertAdjacentElement("beforebegin", image);
    img_container.remove();
}

function first_stage_edit_img(img){
    M.Modal.getInstance(document.getElementById('modal2')).open();
    let image = window.frames[0].document.getElementById(img);
    document.getElementById('representative-img').src= image.src;
    document.getElementById('legend').value = image.title;
    document.querySelector('input[name="imageAlign"][value ="' + image.align + '"]').checked = true;
    document.getElementById('insertImage').setAttribute('name', 'edit')
}

function editImage(){
    let image = window.frames[0].document.getElementById(document.getElementById('representative-img').src)
    console.log(document.getElementById('representative-img').src)
    image.align = document.querySelector('input[name="imageAlign"]:checked').value
    image.tile = document.getElementById('legend').value
    if (document.getElementById('height') == null){
        image.style.width = document.getElementById('imgSize')[document.getElementById('imgSize').selectedIndex].value
    }
    else {
        image.height = document.getElementById('height').value
        image.width = document.getElementById('width').value
    }
    resetImageMenuSettings()
}

function formatText(type, value=false) {
    window.frames[0].document.execCommand(type, false, value);
}

function addVideo(){
    var video = prompt("Inserează link-ul la video");
    window.frames[0].document.execCommand('insertHTML', false, '<div class="video-container"><iframe src="https://www.youtube.com/embed/' + video.slice(-11) + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
}

function changeView(value){
    let post_code = document.getElementById('post_code')
    let post_text = window.frames[0].document.getElementsByTagName('body')[0]
    let visibleClass = "text_input s12 z-depth-1"
    let hiddenClass = "text_input s12 z-depth-1 hide"
    if (value == "code"){
        document.getElementById('post_text').className = visibleClass
        post_code.className = hiddenClass
        post_text.innerHTML = post_code.value
    }
    else {
        document.getElementById('post_text').className = hiddenClass
        post_code.className = visibleClass
        post_code.value = post_text.innerHTML
    }
}

function insertImage(){
    M.Modal.getInstance(document.getElementById('modal2')).close()
    let image = {
        legend : document.getElementById('legend').value,
        src : document.getElementById('representative-img').src,
        align : document.querySelector('input[name="imageAlign"]:checked').value,
    }
    if (document.getElementById('height') == null){
        image.customSize = false
        image.size = document.getElementById('imgSize')[document.getElementById('imgSize').selectedIndex].value
    }
    else {
        image.customSize = true
        image.height = document.getElementById('height').value
        image.width = document.getElementById('width').value
    }
    var code = 0
    if (image.customSize){
        code = "<img style='position: relative; object-fit: cover; overflow: hidden;' title='" + image.legend + "'  id='" + image + "' title='" + image.src + "' align='" + image.align + "' width='" + image.width + "' height='" + image.height + "' src='" + image.src + "'/>";
    }
    else{
        code = "<img title='" + image.legend + "' id='" + image.src + "' align='" + image.align + "' style='position:relative; width:" + image.size + "%'  src='" + image.src + "'/>";
    }
    window.frames[0].document.execCommand('insertHTML', false ,code);
    resetImageMenuSettings()
}

function resetImageMenuSettings(){
    document.getElementById('legend').value = ''
    document.querySelector('input[name="imageAlign"][value ="left"]').checked = true;
    document.getElementById('imgSize').selectedIndex = 1
}
