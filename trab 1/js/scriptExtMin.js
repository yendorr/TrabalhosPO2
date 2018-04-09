function extensãoMinima(matriz, dimensão){
	var participa = []; //indica quais nós foram atingidos na rede
	var contParticipa = 1; //quantidade de nós atingidos
	participa[1] = true; // Setando posição um como atingido (nó inicial)
	
	//Criando matriz de marcados 
	var marcados = [];
	for(i=1; i<=dimensão; i++){
		marcados[i] = [];
		for(j=1; j<=dimensão; j++{
			marcados[i][j] = false;
		}
	}

	//zerando matriz de marcados
	//for(i=1; i<=dimensão; i++){
	//}


	//Percorrendo matriz de pesos para achar o proximo a ser marcado
	var menorI; //indica qual o índice I do menor na matriz
	var menorJ; //indica qual o índice J do menor na matriz
	var menor; //indica qual o menor peso dos possíveis

	for(i=1; i<=dimensão; i++){
		menor = 9999999999;
		for(i=1; i<=dimensão; i++){
			if(participa[i]){ //caso a linha participe ele compara aquela linha (podendo se fazer ligações apenas a partir de nós que ja estão na rede)
				for(j=1; j<=dimensão; j++){
					if(matriz[i][j]<menor && marcados[i][j] = false) { //Caso o peso seja o menor de todos e ainda não esteja em uso na rede, ele vira o menor
						menor = matriz[i][j];
						menorI = i;
						menorJ = j;
					}
				}
			}
		}
		marcados[i][j] = true; 	//Coloca aquela ligação como sendo usada
		participa [i] = true;  	//Coloca nó i como participante da rede
		participa [j] = true;	//Coloca nó j como participante da rede
		contParticipa ++;		//Contador de participantes sobe um
	}
	console.log(contParticipa);
	console.log(marcados);
}