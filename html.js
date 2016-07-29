		// Console stuff
		
var specialLog = [];
var completeLog = specialLog;

var log = function(text){
	$("#console").append(text+"<br>");
	var elem = document.getElementById('console');
	elem.scrollTop = elem.scrollHeight;
}

		// HTML functions

// Update the upgradeBox

var updateUpgrades = function(){
	$(".upgradeBoxes").remove();
	for( var i = 0; i<player.upgradeList.length; i++){
		if( player.upgradeList[i].require <= boughtUpgrades() && 
		    !player.upgradeList[i].bought && 
			(alreadyUpgradeId(player.upgradeList[i].requiredUpgrade) || player.upgradeList[i].requiredUpgrade == null )){
			
			var upgrade = player.upgradeList[i];
			if(player.money > upgrade.cost){
				$("#upgradeBox").append("<button type=button id=Upgrade"+upgrade.id+" title=s class='upgradeBoxes btn btn-primary col-sm-12'>"+upgrade.name+"<br>Cost: "+upgrade.cost+"</button>");
			}
			else {
				$("#upgradeBox").append("<button type=button id=Upgrade"+upgrade.id+" title=s class='upgradeBoxes disabled btn btn-primary col-sm-12'>"+upgrade.name+"<br>Cost: "+upgrade.cost+"</button>");	
			}
			document.getElementById("Upgrade"+upgrade.id).title = upgrade.flavorText;
		}
	}
}


		
// Update the list of caught pokemon
var updateCaughtList = function(){

	var pokemonHtml = ""
	// var pokemonHeight = $("#pokemonBody").height()
	// if( pokemonHeight > 1000){
	// 	$("#pokemons").height(1000);
	// }
	// else {
	// 	$("#pokemons").height(pokemonHeight + 120);
	// }

	// var pokemonHeight = $("#pokemonBody").height()

	// if( pokemonHeight > 1000){
	// 	$("#pokemons").height(1000);
	// }
	// else {
	// 	$("#pokemons").height(pokemonHeight + 120);
	// }

	for (var i = 0; i<player.caughtPokemonList.length; i++){
		pokemonHtml += "<tr>";
		if(isShiny(player.caughtPokemonList[i].name)){
			pokemonHtml += "<th><img class=smallShinyImage src=images/shinypokemon/"+player.caughtPokemonList[i].id+".png>"+player.caughtPokemonList[i].name + "</th>";
		} else {
			pokemonHtml += "<th><img class=smallImage src=images/pokemon/"+player.caughtPokemonList[i].id+".png>"+player.caughtPokemonList[i].name + "</th>";
		}
		pokemonHtml += "<th>" + Math.ceil(experienceToLevel(player.caughtPokemonList[i].experience,player.caughtPokemonList[i].levelType)*(player.caughtPokemonList[i].attack)/100) +"</th>";
		pokemonHtml += "<th>" + experienceToLevel(player.caughtPokemonList[i].experience,player.caughtPokemonList[i].levelType) + "</th>";
		pokemonHtml += "</tr>";
		
	}

	$("#pokemonBody").html(pokemonHtml);

	$("#caughtPokemon").html("<br>Name<br>");
	$("#AttackCaughtPokemon").html("<br>Attack <br><br>");
	$("#LevelCaughtPokemon").html("<br>Level <br><br>");
	
	if( player.caughtPokemonList.length == 0){
		$("#caughtPokemon").append("None");
		$("#AttackCaughtPokemon").append("<br>");
		$("#LevelCaughtPokemon").append("<br>");
	}

}

var updateItems = function(){

	var itemHtml = ""

	for (var i = 0; i<player.inventoryList.length; i++){
		itemHtml += "<tr>";
		if(player.inventoryList.length == 0 || isInventoryEmpty()==true){
			itemHtml += "<th>You have no items</th>";
			itemHtml += "<th></th>";
		}
		if(player.inventoryList[i] != undefined){
			if(player.inventoryList[i].quantity > 0){
				itemHtml += "<th><img class=smallImage onclick=\"useItem("+i+")\" src=images/items/"+player.inventoryList[i].id+".png>"+player.inventoryList[i].name+"</th>";
				itemHtml += "<th>"+player.inventoryList[i].quantity+"</th>";
				if(player.inventoryList[i].inUse == 1){
					itemHtml += "<th>"+player.inventoryList[i].timeLeft+"</th>"
				}
			}
		}
		itemHtml += "</tr>";

	}

	$("#itemBody").html(itemHtml);


}

// Update the stats
var updateStats = function(){
	$("#statBody").html("<tr><th>Money</th><th>$"+player.money+"</th></tr>" +
		"<tr><th>Dungeon Tokens</th><th>$"+player.dungeonTokens+"</th></tr>" +
		"<tr><th>Click attack</th><th>"+getClickAttack()+"</th></tr>" +
		"<tr><th>Pokemon attack</th><th>"+getPokemonAttack()+"</th></tr>" +
		"<tr><th>Exp multiplier</th><th>"+player.expMultiplier.toFixed(2)+"</th></tr>" +
		"<tr><th>Catch bonus</th><th>"+getBonusCatchrate()+"%</th></tr>" +
		"<tr><th>Catch time</th><th>"+player.catchTime/1000+" sec</th></tr>" +
		"<tr><th>Pokemon Caught</th><th>"+player.totalCaught+"</th></tr>");
//	$("#statBody").html("Stats<br><br>Money<br>Click attack<br>Pokemon attack<br>Exp multiplier<br>Catch bonus<br>Catch time<br>Route<br>Pokemon Caught");
//	$("#statBoxStats").html("<br><br>$"+player.money+"<br>"+player.clickAttack*player.clickMultiplier+"<br>"+player.attack*player.attackMultiplier+"<br>"+player.expMultiplier.toFixed(2)+"x<br>"+player.catchBonus+"%<br>"+player.catchTime/1000+" sec<br>"+player.route+"<br>"+player.totalCaught);	
}

var getHeight = function(){
	return $(window).height();
}


var updateRoute = function(){

	if (player.routeKills[1] >= player.routeKillsNeeded){
		oakExplainMap();
	}

	if (player.routeKills[2] >= player.routeKillsNeeded){
		oakExplainTown();
	}

	var html = "Route "+player.route;
	if(routeCompleted(player.route)){
		html += "<a title='You have caught all available Pokemon on this route!'><img id='alreadyCaughtImage' src='images/Pokeball.PNG'></a>";
	}
	html += "<br>" + Math.min(player.routeKillsNeeded, player.routeKills[player.route])+"/"+player.routeKillsNeeded;
	$("#currentRoute").html(html);
	// if(accessToRoute(player.route+1)){
	// 	$("#routeRight").show();
	// }
	// else{
	// 	$("#routeRight").hide();
	// }
	// if(player.route == 1){
	// 	$("#routeLeft").hide();
	// } 
	// else{
	// 	$("#routeLeft").show();
	// }

	for(var i = 1; i< 26; i++){
		if(player.routeKills[i] >= player.routeKillsNeeded){
			if( i == 19){
				$("#route_"+i+"a").attr('style', "fill:#FCB612" );	
			}
			$("#route_"+i).attr('style', "fill:#FCB612" );
		}
		else if (accessToRoute(i)){
			if( i == 19){
				$("#route_"+i+"a").attr('style', "fill:#D89803");
			}
			$("#route_"+i).attr('style', "fill:#D89803");
		}
		else {
			if( i == 19){
				$("#route_"+i+"a").attr('style', "fill:#BD1952");	
			}
			$("#route_"+i).attr('style', "fill:#BD1952");	
		}
		
	}

	if( inProgress == 1){
		$("#route_"+player.route).attr('style', "fill:green" );
		if( player.route == 19){
			$("#route_"+player.route+"a").attr('style', "fill:green" );	
		}
	}
}

// Update the health of the current enemy
var updateEnemy = function(){
    if (curEnemy.health <0){
        curEnemy.health = 0;
    }
    if(curEnemy.health == 0 ){
        enemyDefeated();
    }
    if (curEnemy.alive){
    	if(curEnemy.shiny){
    		$("#enemyInfo").html("<br>"+curEnemy.name+" <img class='shinyEnemyStar' src='images/shinypokemon/star.png'><br><img id=enemy class='shinyFiller' src=images/shinypokemon/"+curEnemy.id+".png>");
    	} else {
			if(alreadyCaught(curEnemy.name)){
            	$("#enemyInfo").html("<br>"+curEnemy.name+" <img id=alreadyCaughtImage src=images/Pokeball.PNG><br><img id=enemy src=images/pokemon/"+curEnemy.id+".png>"); 
            } else {
            	$("#enemyInfo").html("<br>"+curEnemy.name+"<br><img id=enemy src=images/pokemon/"+curEnemy.id+".png>");
            }   		
    	}

    }
        $("#healthBar").width(100*curEnemy.health/curEnemy.maxHealth+"%"); 
        $("#healthDisplay").html(curEnemy.health+"/"+curEnemy.maxHealth);
}



var hideAllViews = function(){
	$("#currentEnemy").hide();
	$("#gymView").hide();
	$("#townView").hide();
	$("#dungeonView").hide();
}
