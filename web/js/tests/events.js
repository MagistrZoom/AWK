document.addEventListener( 'keydown', function(event) {
    switch( event.keyCode ) {
      case  38 : pressed_up(); break;
      case  37 : pressed_left(); break;
      case  39 : pressed_right(); break;
      case  40 : pressed_down(); break;
    }
});
