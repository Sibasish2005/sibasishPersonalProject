let  tablinks =  document.getElementsByClassName("tab-links")
let  tabContents =  document.getElementsByClassName("tab-contents")
function opentab(tabName){
    for( tablink of tablinks){
        tablink.classList.remove("active-link")
    }
    for( tabContent of tabContents){
        tabContent.classList.remove("active-tab")
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabName).classList.add("active-tab")
}


var sidemenu = document.getElementById("sidemenu");

function openMenu(){
    sidemenu.style.right = "0";
}

function closeMenu(){
    sidemenu.style.right = "-200px";
}