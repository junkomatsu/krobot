$(document).ready(function() {
  $('#go').click(function() {
    $.get('/go'); return false;
  });
  $('#stop').click(function() {
    $.get('/stop'); return false;
  });
  $('#back').click(function() {
    $.get('/back'); return false;
  });
  $('#left').click(function() {
    $.get('/left'); return false;
  });
  $('#right').click(function() {
    $.get('/right'); return false;
  });
});
