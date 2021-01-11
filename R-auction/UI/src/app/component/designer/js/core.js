$(document).ready(function(){
  $(".header-search").click(function(){
      $(".search-slide").toggleClass("full-width");
      $(".header-search-input").focus();
  });
  $(".search-slide-close").click(function(){
      $(".search-slide").toggleClass("full-width");
      $(".header-search-input").val("")
  });  
});


function openMessage() {
    console.log('1');
    var element = document.getElementById("footer-slider");
    console.log('2');
    element.classList.toggle("slidemsgup");
 }