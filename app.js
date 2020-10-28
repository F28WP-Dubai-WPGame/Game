var character= document.getElementById("character1");
var block= document.getElementById("block");

function jump(){
    if(character.classList != "animate"){
        character.classList.add("animate");
    }
    setTimeout(function(){
        character.classList.remove("animate");
    },500);
}
var check= setInterval(function(){
    var characterTop= parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var blockLeft= parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if((blockLeft<50 && blockLeft>-40) && characterTop>=250){
        block.style.animation="none";
        block.style.display="none";
        alert("u lose");
    }
},10);