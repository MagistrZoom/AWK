BEGIN {
	amountUsers = 0;

	STARTHP = 100;
	MAXHP = 150;

	DRAND = 10;
	DAMAGE = 10;
	DTRAPS = 20;
	HEAL = 25;

	clientPort = ARGV[1];

	OFS = "";
	MAZE = "maze";
	DATA = "data";

	sizeX = 0;
	sizeY = 0;
	size = 0;

	srand();
#ID = serverPort;
	ID = 20;
	
	start();
}

function start( i) {
	loadMaze();
	addUser(ID);

	deleteUser(ID);
}

function addUser(id) {
	lock();
	updateInf();
	print(getFreeCell()" "STARTHP" "id) >> DATA;
	close(DATA);
	unlock();

	amountUsers++;
}

function updateInf(  i,j) {
	getline amountFruits < DATA;

	for(i = 0; i < amountFruits; i++) {
		getline mods[i] < DATA;
	}
	getline amountTraps < DATA;

	for(i = amountFruits; i < amountFruits + amountTraps; i++) {
		getline mods[i] < DATA;
	}
	amountUsers = 0;
	while(getline i < DATA > 0) {
		for(j = 1; j <= 3; j++) {
			users[amountUsers][j] = 0;
		}
		split(i, users[amountUsers], " ");
		if (users[amountUsers][3] == ID) thisUser = amountUsers;
		amountUsers++;
	}

	close(DATA);
}

function writeMods(  i) {
	print(amountFruits) > DATA;
	for(i = 0; i < amountFruits; i++) {
		print(mods[i]) >> DATA;
	}
	print(amountTraps) >> DATA;
	for(i = amountFruits; i < amountFruits + amountTraps; i++) {
		print(mods[i]) >> DATA;
	}
	close(DATA);
}

function writeUsers(  i) {
	for(i = 0; i < amountUsers; i++) {
		print(users[i][1]" "users[i][2]" "users[i][3]) >> DATA;
	}
	close(DATA);
}

function deleteUser(id, x,list) {
	lock();
	getline list < DATA;
	while(getline x < DATA > 0) {
		if(!match(x,".+ .+ "id"\\>"))
			list = list"\n"x;
	}
	print(list) > DATA;
	close(DATA);
	unlock();
}

function replaceMod(mod, i) {
	mods[mod] = getFreeCell();
}

function randCell() {
	return int((size - 1) * rand());  
}

function getFreeCell( r,rep,i) {
	rep = 1;

	while(rep) {
		rep = 0;
		r = randCell();

		for(i = 0; i < amountFruits + amountTraps; i++) {
			if(mods[i] == r) {
				rep = 1;
				break;
			}
		}
		for(i = 0; i < amountUsers; i++) {
			if(users[i][1] == r) {
				rep = 1;
				break;
			}
		}
	}
	return r;
}

function goRight( newCell) {
	newCell = users[thisUser][1] + 1;
	if(!rightBound[users[thisUser][1]])
		goToCell(newCell);
}

function goLeft( newCell) {
	if((users[thisUser][1] % sizeX)&&(!rightBound[users[thisUser][1] - 1]))
	newCell = users[thisUser][1] - 1;
		goToCell(newCell);
}

function goUp( newCell) {
	newCell = users[thisUser][1] - sizeX;
	if((newCell >= 0) && (!bottomBound[newCell])) goToCell();
		goToCell(newCell);
}

function goDown( newCell) {
	newCell = users[thisUser][1] + sizeX;
	if(!bottomBound[newCell])
		goToCell(newCell);
}

function goToCell(cell, i) {
	for(i = 0; i < amountFruits + amountTraps; i++) {
		if(mods[i] == cell) {
			if(i < amountFruits) {
				users[thisUser][2] += HEAL;
				if(users[thisUser][2] >= MAXHP) {
					users[thisUser][2] = MAXHP;
				}
			} else {
				users[thisUser][2] -= int(DTRAPS + DRAND * rand());
				if(users[thisUser][2] <= 0) {
					dead(thisUser);
					mods[i] = getFreeCell();
					return;
				}
			}
			
			users[thisUser][1] = cell;
			mods[i] = getFreeCell();
			return;
		}
	}

	for(i = 0; i < amountUsers; i++) {
		if(users[i][1] == cell) {
			attack(i);
			return;
		}
	}

	users[thisUser][1] = cell;
}

function attack( user) {
	users[user][2] -= int(DAMAGE + DRAND * rand());
	if(users[user][2] <= 0) {
		dead(user);
	}
}

function dead( user) {
	users[user][1] = getFreeCell();
	users[user][2] = STARTHP;
}

function loadMaze( x,y,i,bounds) {
	getline x < MAZE;
	y[1] = 0; y[2] = 0;
	split(x,y," "); 
	sizeX = y[1]; sizeY = y[2]; size = y[1] * y[2];

	getline x < MAZE;
	for(i = 0; i < size; i++){
		bounds = substr(x, i + 1, 1);
		bottomBound[i] = 0;
		rightBound[i] = 0;
		if(bounds >= 2) bottomBound[i]++;
		if((bounds == 3)||(bounds == 1)) rightBound[i]++;
	}
}

function lock( input) {
	"./lock" | getline input;
	close("./lock");
}

function unlock() {
	system("rm -f maze.lock");
}
