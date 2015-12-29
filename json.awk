#   Map 
#   ===
#    JS-object:
#    var map = {
#       parametrs : {
#          width  : <VALUE>,
#          heigth : <VALUE>
#       },
#       area : [ <ARRAY> ]
#    }; 
# 
#    JSON string:
#    {
#       "parametrs" : {
#          "width"  : <VALUE>,
#          "heigth" : <VALUE>
#       },
#       "area" : [ <ARRAY> ]
#    }
#
# Data
# ====
#    JS-object:
# 
#    var objects = {
#       user : {
#          pos    : <CELL>,
#          ID     : <ID>,
#          health : <HP>,
#       }
#       itmes : {
#          # What is the best decision? An array of poss? 
#          #   Is there more clever idea?   
#           
#          trap : {
#             pos : [ <ARRAY> ] 
#          },
#          heal : {
#             pos : [ <ARRAY> ] 
#          }
#       }
#       other : {
#          pos    : [ <ARRAY> ]      
#       }
#    };
# 
#    JSON-object: 
#    {
#       "user": {
#          "ID"       : <ID>,
#          "health"   : <HP>
#          "pos"      : <CELL>,
#       },
#       "itmes" : {
#          "traps" : {
#                "pos" : [ <ARRAY> ]
#          },
#          "heals" : { 
#                "pos" : [ <ARRAY> ]
#          }
#       },
#       "other" : {
#          "pos"      :  [ <ARRAY> ]
#       }
#    }
# 

# port     -- port of the main user
# filename -- name of file with data
# OR string is more suitable? 

function map_to_json( filename ) {
   
   old_delim = FS
   FS=" "

   template = "{\"parametrs\":{\"width\":\"%d\",\"heigth\":\"%d\"},\"area\": [%s]}"

   getline params < filename
   getline area < filename
  
   gsub(/./, "&,", area)
   gsub(/.$/,"",area) # make it easer, stupid
   
   $0 = params
   json = sprintf( template, $1, $2, area )
   
   FS = old_delim
   return json
}

function data_to_json( port, filename ) {
   
   old_delim = FS
   FS = " "
   template_user = "{\"user\":{\"ID\":%d,\"health\":%d,\"pos\":%d},"
   template_items = "\"items\":{\"traps\":{\"pos\":[%s]},\"heals\":{\"pos\":[%s]},"
   template_others = "\"other\":{\"pos\":[%s]}"

   heal_count = 0; heal_pos = ""
   trap_count = 0; trap_pos = ""
   user = ""
   others = ""
   offset = 0
   count = 0
   while(( getline line < filename ) > 0 ) {
      if( count == 0 ) {
         heal_count = int(line)
         offset += heal_count;
         
         for( i = 0; i < heal_count; i++) {
            getline  line < filename
            heal_pos =  line RT "," RT heal_pos 
            count++
         }
         gsub(/,\n$/,"",heal_pos)
      }
      else if( count == offset ) {
         trap_count = int(line)        
         for( i=0; i < trap_count; i++) {
            getline line < filename
            trap_pos = line RT "," RT trap_pos
            count++
         }
         gsub(/,\n$/,"",trap_pos)
      }
      else {
         $0 = line
         if( $3 == port ) {
            user = sprintf( template_user, $3, $2, $1 )
         }
         else {
               others = $2 "," others   
            }
            count++
         }
      }
      gsub(/,$/,"",others)

      # This condition correspond to the error:
      # either user's port is incocrrect or my algorithm failed. 
      if( user == "" ) {
         user = sprintf( template_user, 0, 0, 0)
      }
      # If there is only one user at the time.
      if( others == "") {
         others = sprintf(template_others, -1)
      }
      items  = sprintf( template_items, trap_pos, heal_pos)
      others = sprintf( template_others, others)
      result = user RT items RT others RT "}"
      gsub(/\n/,"",result)
      FS = old_delim
      return result
}

# From clients server gets the information about users' movements. 
#
#  
#  JS-object
#        var movement = <MOVE>  
#  
#  JSON-object
#     { 
#        <MOVE>
#     }
#
#     MOVE -> [ 0, 1, 2, 3]
#       --  0 - up
#       --  1 - right
#       --  2 - down 
#       --  3 - left
#     ( Yse, it is only a number. Surprise? )
function from_json( json ) {
   gsub( /[^0-9]+/, "", json);
   return json;
}
