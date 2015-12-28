function addEvents() {
   document.addEventListener( 'keydown', function(event) {
      var movement;
      switch( event.keyCode ) {
         case  38 : movement = 0; break;
         case  39 : movement = 1; break;
         case  40 : movement = 2; break;
         case  37 : movement = 3; break;
       }
   //   send( JSON.stringify(movement));
   });
}

/*
 *  UI
 */

function pageHeader( user ) {
  var html = document.getElementById("header");
  var str = html.innerHTML;
  var userName = (function getRandomName( ) {
            var names = [ "Asgaroth", "Gabriel", 
                          "Lilith",   "Ishtar", 
                          "Hel",      "Abaddon" 
                        ];
            return names[Math.floor(Math.random()*(names.length))];
  })();

  var userHP   = user.health;
  var newHTML  = str.replace(/@/, userName );

  newHTML = newHTML.replace(/\+/, function(match){ 
            var hp= "o"; 
            for( i = 0 ; i < userHP-1 ; i++ ) hp += "o";      
         return hp;
  });
  html.innerHTML = newHTML;
}


/*
 * Codes :
 *    0 -- empty cell    "  "
 *                       "  "
 *    1 -- right cell  
 *                       " #"
 *                       " #"
 *    2 -- bottom cell 
 *                       "  "
 *                       "##"
 *    3 -- both
 *                       " #"
 *                       "##"
 *    10 -- heal-items   "!"
 *    20 -- trap-items   "."
 *    30 -- other-users  "W"
 *    40 -- main-user    "@"            
 */

function pageBody( map, mobs ) {

  var width       = map.parameters.width;
  var height      = map.parameters.height;
  var user        = mobs.user.pos; // scalar  
  var area_array  = map.area;
  var wb, we, hb, he;  
  var BLOCKW = 40, BLOCKH = 20;
  
  var ph = Math.ceil( user / BLOCKW )-1; 
  var pw = user - ph*BLOCKW; 
   

  if( (width - pw) < BLOCKW ){ we = width-1; wb = width - BLOCKW;}
  else if( pw < BLOCKW )     { wb = 0; we = BLOCKW-1;}
  else                       { wb = pw-BLOCKW*Math.floor(pw/BLOCKW); we = wb + BLOCKW-1;}

  if((height - ph) < BLOCKH ){ he = height-1; hb = height - BLOCKH-1;}
  else if( ph < BLOCKH )     { hb = 0; he = BLOCKH-1;}
  else                       { hb = ph-BLOCKH*Math.floor(ph/BLOCKH); he = hb + BLOCKH-1;}


  var area_string = ( function getLine() {
                  var str = "";
                  for( i = 0; i < BLOCKW*2; i++){ str += "#"; }
                  return str + "#\n";
  })();

  for( i = 0, len = area_array.length; i < len; i++) {
     if( i < mobs.items.heals.pos.length) { area_array[mobs.items.heals.pos[i]] += 10;}
     if( i < mobs.items.traps.pos.length) { area_array[mobs.items.traps.pos[i]] += 20;}
     if( i < mobs.others.pos.length)      { area_array[mobs.others.pos[i]] += 30; }
   }
  area_array[user] += 40;
  
  for( j = 0; j < height;  j++) {
    var str1="",str2="", tmp_str1="", tmp_str2="";
    for( i = 0; i < width; i++) {
     if((j<=he)&&(j>=hb)&&(i<=we)&&(i>=wb)) {
         var tmp = area_array[i+j*width];
              if( tmp == 0){ str1="  ";str2="  ";}
         else if( tmp == 1){ str1=" #";str2=" #";}
         else if( tmp == 2){ str1="  ";str2="##";}
         else if( tmp == 3){ str1=" #";str2="##";}
         else if( tmp == 10){ str1="! ";str2="  ";}
         else if( tmp == 11){ str1="!#";str2=" #";}
         else if( tmp == 12){ str1="! ";str2="##";}
         else if( tmp == 13){ str1="!#";str2="##";}
         else if( tmp == 20){ str1=". ";str2="  ";}
         else if( tmp == 21){ str1=".#";str2=" #";}
         else if( tmp == 22){ str1=". ";str2="##";}
         else if( tmp == 23){ str1=".#";str2="##";}
         else if( tmp == 30){ str1="W ";str2="  ";}
         else if( tmp == 31){ str1="W#";str2=" #";}
         else if( tmp == 32){ str1="W ";str2="##";}
         else if( tmp == 33){ str1="W#";str2="##";}
         else if( tmp == 40){ str1="@ ";str2="  "; console.log(i, j);}
         else if( tmp == 41){ str1="@#";str2=" #"; console.log(i, j);}
         else if( tmp == 42){ str1="@ ";str2="##"; console.log(i, j);}
         else if( tmp == 43){ str1="@#";str2="##"; console.log(i, j);}
         else { throw new Error();}
         tmp_str1 += str1;
         tmp_str2 += str2;
      }
    }
    if((j<=he)&&(j>=hb)) area_string += "#" + tmp_str1+"\n#"+tmp_str2+"\n";
  }

  area_string = area_string.replace(/@/g, "<span class=\"user\">@</span>");
  area_string = area_string.replace(/!/g, "<span class=\"heals\">!</span>");
  area_string = area_string.replace(/\./g, "<span class=\"traps\">.</span>");
  area_string = area_string.replace(/W/g, "<span class=\"others\">W</span>");
  document.getElementById("map").innerHTML = area_string; 
}


function printErrorPage( ) {
  var html = document.getElementById("map");
  html.innerHTML = "<h1 style=\"color:red;\"> Error </h1>";
}


/* C-style? Bad? (Yup.)*/
function init_frames( ) {
   try{
      var map  = getMap();
      var mobs = getMobs();
      var user = mobs.user;
      pageHeader( user );
      pageBody( map, mobs );
      addEvents();
   }
   catch( err ){
      printErrorPage();
   }
}

/*
 *  Test functions. 
 *
 */

function getMobs() {
   var mobs = "{\"user\":{\"ID\":6666,\"health\":40,\"pos\":1222},\"items\":{\"traps\":{\"pos\":[275,959,1175,551,962,1250,218,381,130,890,47,1571,1428,1328,78,870,1140,632,1412,1392,162,1491,510,879,1488,737,56,768,619,280,598,1257]},\"heals\":{\"pos\":[215,882,818,521,1083,190,17,475,177,899,1233,16,1313,552,150,1261,695,1536,544,1021,221,829,1513,1516,1143,490,1146,30,583,897,915,1382,624,1188,1311,1031,1435,250,839,842]}},\"others\":{\"pos\":[ 543, 1160,2,34 ]}}";
   return JSON.parse( mobs );
}
function getMap() {
 
 var map = "{\"parameters\":{\"width\":\"40\",\"height\":\"40\"},\"area\": [0,3,0,3,0,2,0,0,0,1,1,1,2,1,2,1,1,1,1,0,2,2,3,1,0,1,0,3,0,3,0,0,3,2,2,0,2,0,3,1,2,1,2,1,0,3,3,3,3,1, 0,1,2,1,0,2,2,2,1,1,0,2,0,2,1,2,0,0,0,1,1,0,2,3,1,2,3,2,2,1,1,1,2,0,3,1,2,2,2,3,1,0,3,0,1,1,0,1,1,2,1,1,3,1,2,1,3,1,3,3,3,0,2,1,0,3,0,1,1,1,0,2,3,0,3,1 ,0,0,3,0,1,3,1,1,3,0,3,0,1,0,2,2,1,1,1,2,3,3,2,0,2,3,1,3,2,1,1,0,1,1,0,1,2,1,0,0,3,1,2,1,0,2,2,2,1,0,3,3,0,2,2,1,0,1,2,0,3,0,3,1,1,1,1,2,1,0,1,3,0,3 ,1,3,0,2,3,3,0,0,3,1,0,3,0,3,1,0,0,3,2,2,1,1,3,0,0,1,1,0,3,2,2,1,2,1,1,1,3,0,2,3,1,0,0,3,0,0,1,1,1,3,1,1,0,3,1,1,3,0,1,1,1,1,2,3,1,2,2,1,1,1,1,1,2,2,1,3,1,1,1,1,1,3,3,1,1,3,1,0,1,1,2,1,1,0,1,0,0,3,2,3,3,0,1,1,2,2,3,0,0,0,1,1,1,1,1,0,1,0,2,1,1,2,1,1,2,3,1,1,2,2,2,2,1,3,1,3,0,0,2,0,1,3,2,2,0,1,2,3,3,1,3,0,0,2,2,1,2,3,2,3,2,0,2,0,0,3,3,0,3,2,1,0,0,3,3,2,1,3,1,3,0,0,0,3,1,0,2,2,1,2,2,1,0,3,1,3,1,1,0,1,1,2,1,3,1,1,2,3,1,0,3,3,3,1,2,0,0,2,3,0,1,3,3,0,3,0,2,3,3,0,2,1,1,1,1,1,1,2,3,1,1,1,0,3,1,2,1,0,1,2,1,0,3,1,2,3,2,1,0,3,3,1,1,2,1,0,0,3,0,1,1,3,3,2,1,1,0,3,1,1,0,0,1,1,1,1,0,1,1,2,2,1,0,3,1,2,1,1,2,3,0,0,1,2,1,1,2,3,3,0,3,1,1,1,1,0,0,0,2,1,3,3,1,1,3,1,1,3,0,1,1,1,1,1,2,2,1,3,1,1,3,3,1,1,3,0,0,3,1,2,0,1,0,0,3,3,1,1,2,3,1,2,1,1,2,1,0,3,1,2,3,0,3,1,2,1,1,1,1,1,2,1,0,1,1,3,2,1,2,1,3,2,3,1,1,0,1,2,0,3,1,2,2,1,1,2,0,1,3,1,1,1,0,3,0,0,2,0,1,0,1,1,1,1,2,0,0,1,2,0,3,1,1,0,1,3,1,2,2,1,0,3,1,1,0,2,1,0,0,1,1,2,2,1,1,0,3,1,1,1,0,3,1,3,1,3,1,0,3,0,0,0,2,1,0,2,1,2,2,1,2,2,1,1,2,1,3,1,3,1,1,1,1,1,1,2,1,3,0,3,3,1,2,2,1,1,3,0,3,3,1,1,2,1,1,0,2,2,3,1,1,2,0,3,1,0,3,3,1,2,2,2,2,0,1,2,1,1,2,1,1,2,1,0,3,1,0,0,3,1,1,3,1,1,1,1,1,2,1,3,2,1,0,1,0,0,2,2,2,2,3,1,0,3,2,3,0,3,2,1,1,1,2,2,2,2,3,3,2,0,1,1,0,1,3,2,1,1,1,1,2,1,1,3,3,1,1,2,1,1,2,1,0,0,2,1,1,2,0,2,1,1,0,0,1,1,0,0,2,1,1,2,1,0,0,1,0,1,0,1,1,2,0,1,1,1,0,0,3,0,1,0,1,3,1,3,2,1,1,0,2,2,1,1,0,3,1,0,1,3,3,1,3,1,3,1,3,2,1,1,0,1,1,2,1,0,3,1,1,1,1,1,1,1,1,0,3,1,3,0,3,1,1,3,2,0,3,1,0,1,0,0,0,2,3,3,1,1,1,3,3,1,2,3,0,2,1,2,0,3,3,3,2,3,0,2,2,1,2,2,1,2,1,1,1,0,3,1,3,3,1,1,0,3,0,2,1,1,1,1,1,2,2,0,1,0,1,2,2,1,1,2,0,1,0,3,1,1,1,0,1,0,1,0,2,3,0,0,0,1,1,3,2,3,2,3,1,2,3,1,1,0,1,3,3,3,1,2,2,1,1,2,1,0,2,0,1,2,1,1,1,3,3,1,0,1,1,1,3,3,0,3,2,2,1,2,0,3,1,1,1,3,1,1,1,0,1,2,1,1,1,0,1,3,0,3,1,0,3,1,0,0,3,3,1,2,3,3,1,1,0,3,0,3,1,1,0,1,1,1,2,2,0,2,1,1,3,2,2,2,3,1,2,1,2,3,3,3,0,3,3,0,2,3,0,0,2,3,2,1,0,0,2,3,1,1,1,1,2,1,0,3,0,3,3,0,3,2,2,2,1,1,1,3,2,0,3,2,2,3,1,2,1,2,3,2,0,2,2,3,3,3,2,0,2,0,1,2,2,1,0,2,2,0,3,0,1,1,2,1,1,1,2,1,0,2,3,1,1,1,0,1,1,1,1,2,3,1,1,1,2,1,1,0,1,1,0,1,1,3,2,1,1,3,2,3,3,1,1,1,1,2,2,3,2,1,1,1,2,1,3,1,1,1,1,0,3,0,2,3,1,0,0,3,1,3,3,3,1,1,2,1,1,1,1,0,3,1,1,1,0,3,0,3,1,1,2,1,1,1,0,2,2,1,0,0,1,1,2,0,0,3,0,1,2,1,1,0,3,1,1,1,1,0,1,0,3,0,3,1,1,2,0,1,0,0,0,2,3,0,2,2,3,3,3,3,0,3,0,1,3,0,1,3,0,1,1,0,0,1,1,0,3,3,2,1,1,0,0,2,0,3,1,3,1,3,1,2,1,1,0,3,1,1,1,2,2,1,3,3,0,3,2,3,1,3,1,3,3,1,0,1,0,2,0,0,3,1,0,1,3,1,0,2,1,2,1,1,1,1,2,1,1,2,1,1,1,2,1,0,3,2,0,2,2,0,3,2,0,3,3,2,0,1,3,1,2,1,1,1,0,3,1,0,0,3,3,0,2,1,1,1,2,0,2,1,1,2,1,2,1,1,3,1,1,2,3,1,0,3,0,3,1,3,0,2,0,3,3,2,0,2,3,1,1,0,0,1,1,1,1,1,2,1,1,1,1,1,0,1,2,2,1,1,1,1,0,2,0,3,2,0,1,1,1,0,2,0,0,3,2,1,0,3,0,1,3,0,1,1,2,1,1,3,2,1,2,2,1,2,0,3,1,1,1,1,0,1,3,1,1,3,1,1,3,3,0,3,3,1,1,3,0,3,1,2,3,3,3,3,1,2,1,0,2,3,2,1,1,0,3,1,1,1,1,0,1,2,1,1,2,2,2,2,2,3,2,2,2,2,3,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,3,2,3,2,3]}";   
 
   return JSON.parse(map);
}
