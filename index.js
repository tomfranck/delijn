$('#top-nav .menu-btn').click(function(){
  $('body').addClass('menu-open');
});

$('.overlay').click(function(){
  $('body').removeClass('menu-open');
});