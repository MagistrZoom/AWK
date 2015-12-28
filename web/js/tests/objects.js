function Params( width, height ) {
   this.width = width;
   this.height = height;
}
function Map ( width, height, area ) {
   this.parameters = new Params( width, height );
   this.area = area;
}

function map_state( ) {

}

function main() {
   var map = new Map( 34, 42, [ 1, 2, 3, 4, 5, 6 ]);
   var json = JSON.stringify( map );
   console.log(json);
}
