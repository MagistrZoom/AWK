#Documentation   

###Maze
####Parameters 
 maze[] -- array of borders (global).
  
| Code  | Type  |
| ----- |:-----:|
| 0 |empty| 
| 1 |bottom| 
| 2 |right|
| 3 |both|

size -- size of maze (global)   
sizeX -- width (global)   
sizeY -- height (global)   

##Content 
mods[] -- array of mobs' position -- traps, fruits (global).     
amountFruits, amountTraps - count of fruits and trps (global).    


mods[from 0 to (amountFruits - 1)] - fruits   
mods[from amountFruits to (amountTraps - 1)] - traps   

##Players 
users[] - array of all players (global).    
amountUsers -- count of players.          


users[id][] -- array of each user's parameters.  
  users[id][0] - location of user   
  users[id][1] - HP   
