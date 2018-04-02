const dimensaoMaxima = 17, dimensaoMinima = 2;//limita o numero de nós
const M = (27+10+1998)*999999999999; // infinito

$(document).ready(function(){
	atualizaTabela();
	$("#dimensao").change(atualizaTabela);//listennner pra atualizar a tabela
	$("#calcula").click(main);
});

// function criarMatriz() {
//   var vetor = [];
//   for (let i=1;i<=$("#dimensao").val();++i) {
//      vetor[i] = [];
//   }
//   return vetor;
// }

function validaValores(){
	if($("#dimensao").val()>dimensaoMaxima)
		$("#dimensao").val(dimensaoMaxima);
	if($("#dimensao").val()<dimensaoMinima)
		$("#dimensao").val(dimensaoMinima);
}

function pegarValoresDaTabela(tabela){
		let i, j;
		validaValores();
		let dimensao = $("#dimensao").val();
		
		//	CRIANDO MATRIZ
		// var tabela = [];
		// for(i=1;i<=dimensao;i++)
		// 	tabela[i] = [];
		

		//	PEGANDO VALORES DA TABELA PARA A MATRIZ
		for(i = 1;i <= dimensao; i++)
			for(j = 1; j <= dimensao; j++){
				if(i != j){
					tabela[i][j] = $("#A"+i+""+j).val();
				}
				else
					tabela[i][j] = M;
			}
		return tabela;
}

function atualizaTabela(){
	validaValores();
	let conteudo="<th></th>";
	let linha;
	let dimensao = $("#dimensao").val();

	$("#divTabela").empty();
	for(j=1;j<=dimensao;j++)
		conteudo+="<th class='tabeleiro'>"+j+"</th>";

	for(let i=1;i<=dimensao;i++){
		linha="<td class='tabeleiro'>"+i+"</td>";

		for(j=1;j<=dimensao;j++){
			linha+="<td>";
			if(i==j)
				// linha+= "<span class='barra'></span>"
				linha += "<input type='input' disabled class='A B'  id='A"+i+j+"'>"
			else
				linha+="<input type='input' class='A' id='A"+i+j+"'>"
			linha+="</td>"	
		}
			conteudo+="<tr>"+linha+"</tr>";
	}
	$("#divTabela").append("<table>"+conteudo+"</table>");
}

function passeia(dimensao,matriz,no,R){
	let I,J;
	no.matriz = matriz;
	no.valido = false;
	no.z = M;
	no.caminho = [];
	no.p1 = null;
	no.p2 = null;

	resolve(no);

	if(deuRuim(no,I,J)){
		var p = {};
		var q = {};
		no.p1 = p;
		no.p2 = q;
		
		if(R.z>no.z)
			R = no;

		passeia(dimensao,penaliza(dimensao,matriz,I,J,0),p,R);
		passeia(dimensao,penaliza(dimensao,matriz,I,J,1),q,R);
	}
}

function resolve(no){
	subtraiLinha(no.matriz);
	subtraiColuna(no.matriz);	
}

function subtraiLinha(matriz){
	let menor,i,j;
	let dimensao = $("#dimensao").val();
	for(i = 1;i<=dimensao;i++){
		menor = M;
		for(j=1;j<=dimensao;j++)
			if(matriz[i][j] < menor ) menor = matriz[i][j]
		if(menor)		
			for(j=1;j<=dimensao;j++) matriz[i][j] -= menor;
	}
}

function subtraiColuna(matriz){
	let menor,i,j;
	let dimensao = $("#dimensao").val();
	for(j = 1;j<=dimensao;j++){
		menor = M;
		for(i=1;i<=dimensao;i++)
			if(matriz[i][j] < menor) menor = matriz[i][j];
		if(menor)
			for(i = 1; i<=dimensao;i++) matriz[i][j] -= menor;
	}
}

function deuRuim(no,I,J){
	
}

function penaliza(dimensao,matriz,I,J,n){
	var mat = [];
	let i,j;

	for(i=1;i<=dimensao;i++)	mat[i] = [];
	mat = matriz;

	if(n){
		for(i=1;i<I;i++)	mat[i][J] = m;
		for(i=I+1;i<=dimensao;i++)	mat[i][J] = m;
		for(j=1;j<J;j++)	mat[I][j] = m;
		for(j=J+1;j<=dimensao;j++)	mat[i][J] = m;
		return mat;
	}

	mat[I][J] = m;
	return mat;
}

function restoDoHungaro(tabela,dimensao){
	var zeros = [];	 	//salva quantos zeros existem em cada linha por indice(primeira posiçao do vetor salva quantos zeros existem na linha 1)
	var marcados = [];	//coordenada dos valores marcados a serem possivelmente alocados
	var riscados = [];	//coodenada de zeros que nao podem ser alocados
	var marcadas = {};
	marcadas.linhas = []; 	//salva linhas marcadas
	marcadas.colunas = [];	//salva colunas marcadas
	var contador = {};
	contador.marcados = 0;		//quantidade de 0 marcados
	contador.riscados = 0;		//quantidade de 0 riscados
	 	
	let i,j,k;					//contadores
						//imagina ele na horizontal
	marcados[1] = [];	//marca i do elemento
	marcados[2] = [];	//marca j do elemento
	riscados[1] = [];	//marca i do elemento riscado
	riscados[2] = [];	//marca j do elemento riscado

	//conta zeros
	for(i=1;i<=dimensao;i++){	
		zeros[i] = 0;
		for(j=1;j<=dimensao;j++)
			if(!tabela[i][j]) zeros[i]++;
	}


	
	while(temZeros(zeros,dimensao))marcaERisca(tabela,zeros,riscados,marcados,dimensao,contador); //tenta fazer uma alocação
	
	// while(contador.marcados<dimensao){

		marcaLinhasSemZero(marcadas,marcados,riscados,contador,dimensao);

		// if(contador.marcados<dimensao)
			// while(temZeros(zeros,dimensao))marcaERisca(tabela,zeros,riscados,marcados,dimensao,contador);
	// }
}

function marcaLinhasSemZero(marcadas,marcados,riscados,contador,dimensao){
	let i;
	
	for(i=1;i<=dimensao;i++){
		marcadas.linhas[i] = false;
		marcadas.colunas[i] = false;
	}


	for(i=1;i<=dimensao;i++){
		marcadas.linhas[i] = !(linhaTemZeroMarcado(i,marcados,contador));
		if(marcadas.linhas[i])
			marcaColuna(i,marcadas,riscados,marcados,contador,dimensao);
	}
}

function marcaColuna(linha,marcadas,riscados,marcados,contador,dimensao){
	let j;
	for(j=1;j<=dimensao;j++){
		if(elementoTaRiscado(linha,j,riscados,contador)){
			marcadas.colunas[j] = true;
			marcaLinha(j,marcadas,riscados,marcados,contador,dimensao);
		}
	}
}

function marcaLinha(coluna,marcadas,riscados,marcados,contador,dimensao){
	let i;
	for(i=1;i<=dimensao;i++){
		if(elementoTaMarcado(i,coluna,marcados,contador)){
			marcadas.linhas[i] = true;
			marcaColuna(i,marcadas,riscados,marcados,contador,dimensao);
		}
	}
}

// function temPraMarcar(marcadas,dimensao){
// 	let i;
// 	for(i=1;i<=dimensao;i++)
// 		if( !marcadas.colunas[i] || !marcadas.linhas[i]) return true;
// 	return false;
// }

//verifica se existe zeros nao marcados nem riscados para a alocação
function temZeros(zeros,dimensao){
	let i;
	for(i=1;i<=dimensao;i++)
		if(zeros[i]) return true;
	return false;	
}

//marca e risca zeros
function marcaERisca(tabela,zeros,riscados,marcados,dimensao,contador){
	let i,j,k;

	i=linhaComMenosZeros(zeros, dimensao);

	for(j=1; j<=dimensao; j++){
		if(tabela[i][j] == 0)
			if(!elementoTaRiscado(i,j,riscados,contador)){
				marcados[1][++contador.marcados] = i;
				marcados[2][contador.marcados] = j;
				zeros[i]--;
				//risca zeros pra n ter alocação errada
				for(k=1; k<=dimensao; k++){		//risca na linha
					if(!tabela[i][k] && k!=j && !elementoTaRiscado(i,k,riscados,contador)){
						riscados[1][++contador.riscados] = i;
						riscados[2][contador.riscados] = k;
						zeros[i]--;
					}
					if(!tabela[k][j] && k!=i && !elementoTaRiscado(k,j,riscados,contador)){	//risca na coluna
						riscados[1][++contador.riscados] = k;
						riscados[2][contador.riscados] = j;
						zeros[k]--;
					}
				}
				break;
			}
	}
}

//verifica se o elemento i j esta presente na matriz riscados
function elementoTaRiscado(i,j,riscados,contador){
	let k;
	for(k=1;k<=contador.riscados ;k++)
		if(riscados[1][k] == i && riscados[2][k] == j ) return true;
	return false;
}

function elementoTaMarcado(i,j,marcados,contador){
	let k;
	for(k=1;k<=contador.marcados;k++)
		if(marcados[1][k] == i && marcados[2][k] == j) return true;
	return false;
}

//verifica se a linha tem um zero marcado
function linhaTemZeroMarcado(i,marcados,contador){
	let k;
	let marcado = false;
	for(k=1;k<=contador.marcados && !marcado;k++)
		if(marcados[1][k] == i)
			marcado = true;
	return marcado;
}



function linhaComMenosZeros(zeros,dimensao){
	let indice = 0, menor = M;
	let i;
	for(i=1;i<=dimensao;i++)
		if(zeros[i]<menor&&zeros[i]>0){
			menor = zeros[i];
			indice = i;
		}
	
	return indice;
}

function main(){
	var i,j;
	var tabela = [];
	
	var dimensao = $("#dimensao").val();
	for(i=1;i<=dimensao;i++) tabela[i] = [];
	pegarValoresDaTabela(tabela);
	subtraiLinha(tabela);
	subtraiColuna(tabela);
	restoDoHungaro(tabela,dimensao);
}
