BEGIN {
	system("gcc -ansi -pedantic -o lock lock.c");
	amountUsers = 0;

	OFS = "";
	OUT = "maze";
	DATA = "data";

	sizeX = 40;
	sizeY = 40;

	srand();
	generate();

#wait for message
	newThread();
}

function newThread() {
#getPort
	clientPort = 100;
	system("gawk -f thread.awk "clientPort);
}

function generate(   i) {
	size = sizeX * sizeY; # Размер лабиринта (количество ячеек)

	generateMaze(sizeX,sizeY);

	amountFruits = int(size / 40);
	amountTraps = int(size / 50);
	generateMods(amountFruits + amountTraps);
	
	writeMods();
}

function generateMaze(sizeX,sizeY) {

	ORS="";
	print(sizeX" "sizeY"\n") > OUT;
	setUnique = 1; # Текущий номер уникального множества
	
	# Инициализируем переменные
	for(i = 0; i < size; i++) {
		set[i] = 0;
		rightBound[i] = 0;
		bottomBound[i] = 0;
		bounds[i] = 0;
	}
	
	# Цикл по строкам лабиринта
	for(i = 0; i < sizeY; i++) {
		offset = i * sizeX;
		# Цикл по столбцам лабиринта
		for(j = offset; j < offset + sizeX; j++) {
			# Присвоим пустым ячейкам уникальное множество
			if(!set[j]) {
				set[j] = setUnique++;
			}
		}
	
	# Создадим границы справа
		for(j = offset; j < offset + (sizeX - 1); j++) {
			# Решим, добавлять ли границу справа
			bound = rand();
			if(bound > 0.5) bound = 1;
			else bound = 0;
			
			# Создадим границу, если текущая
			# ячейка и ячейка справа
			# принадлежат одному множеству
			if(set[j] == set[j+1]) {
				bound = 1;
			}
			
			if(bound) rightBound[j] = 1;
			else union(set[j], set[j+1]);
		}
		rightBound[offset+sizeX-1] = 1;
		
		# Создадим границы снизу
		for(j = offset; j < offset + sizeX; j++) {
			# Решим, добавлять ли границу снизу
			bound = rand();
			if(bound > 0.5) bound = 1;
			else bound = 0;
			
			# Если ячейка одна в своем множестве,
			# то нижняя граница не добавляется
			alone = 1;
			for(k = offset; k < offset + sizeX; k++) {
				if((set[j] == set[k]) && (j != k)) {
					alone = 0;
					break;
				}
			}
			if(alone) bound = 0;
			
			# Если ячейка одна в своем множестве без
			# нижней границы, то нижняя граница не
			# создается
			alone = 1;
			for(k = offset; k < offset + sizeX; k++) {
				if((set[j] == set[k]) && (j != k)) {
					if(!bottomBound[k]) {
						alone = 0;
						break;
					}
				}
			}
			if(alone) bound = 0;
			if(bound) bottomBound[j] = 1;
		}
		
		if(i != (sizeY - 1)) {
			# Скопируем строку в следующую
			for(j = offset; j < offset + sizeX; j++) {
				set[sizeX+j] = set[j];
				bottomBound[sizeX+j] = bottomBound[j];
				
				# Удалим ячейки с нижней границей из их множества
				if(bottomBound[sizeX+j]) {
					set[sizeX+j] = 0;
				}
				# Удалим все нижние границы
				bottomBound[sizeX+j] = 0;
			}
		}
		else {
			for(j = offset; j < offset + (sizeX - 1); j++) {
				# Добавим нижнюю границу к каждой ячейке
				bottomBound[j] = 1;
				
				# Удалим правую границу, если соседние
				# ячейки принадлежат разным множествам
				if(set[j] != set[j+1]) {
					rightBound[j] = 0;
					# И объеденим эти множества
					union(set[j], set[j+1]);
				}
			}
			bottomBound[size-1] = 1;	
		}
	}
	for(i = 0; i < size; i++){
		bounds[i] = rightBound[i] + 2 * bottomBound[i];
		print(bounds[i]) >> OUT;
	}
	close(OUT);
	ORS="\n";
}

function generateMods(amount,  i,j,r,rep) {
	for(i = 0; i < amount; i++) {
		rep = 1;
		mods[i] = size + 1;

		while(rep) {
			rep = 0;
			r = randCell();

			for(j = 0; j < i; j++) {
				if(mods[j] == r) {
					rep = 1;
					break;
				}
			}
		}
		mods[i] = r;
	}
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

function union(set1,set2) {
	# Объединение множеств
	for(s = 0; s < size; s++) {
		if(set[s] == set2) {
			set[s] = set1;
		}
	}
}

function randCell() {
	return int((size - 1) * rand());  
}
