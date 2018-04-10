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

function passeia(dimensao,matriz,matrizOriginal,no,R,loop){
	let arcoDefeituoso = {};
	arcoDefeituoso.i = 0;
	arcoDefeituoso.j = 0;
	loop.vezes[0] = 1;

	let i,j;
	no.matriz = [];
	for(i=1;i<=dimensao;i++){
		no.matriz[i] = [];
		for(j=1;j<=dimensao;j++)
			no.matriz[i][j]  = matriz[i][j];
	}

	no.valido = false;
	no.z = M;
	no.caminho = [];
	no.caminho[1] = [];
	no.caminho[2] = [];
	no.p1 = null;
	no.p2 = null;
	resolve(no,matrizOriginal);
	if(deuRuim(no,dimensao,arcoDefeituoso,loop.vezes[0])){

		var p = {};
		var q = {};
		no.p1 = p;
		no.p2 = q;

		// if(loopou(loop,no,dimensao)) return 0;

		 passeia(dimensao,penaliza(dimensao,no.matriz,matrizOriginal,arcoDefeituoso.i,arcoDefeituoso.j,0),matrizOriginal,p,R,loop);
		 passeia(dimensao,penaliza(dimensao,no.matriz,matrizOriginal,arcoDefeituoso.i,arcoDefeituoso.j,1),matrizOriginal,q,R,loop);
	}
	else if(R.z>no.z){
			R = no;
			R.valido = true;
	}
}

function loopou(loop,no,dimensao){
	let k;
	for(k=1;k<=loop.contadorDeCaminhos;k++)
		if(caminhosIguais(loop,no,k,dimensao)){
			loop.vezes[k]++;
			break;
		}
	
	salvaCaminho(loop,no,dimensao);
	if(loop.vezes[k] >= 5){
		loop.vezes[0]%=(dimensao-1);
		loop.vezes[0]++;

	for(k=1;k<=100;k++)	loop.vezes[k] = 0;
	return true;
	}
	return false;
}

function salvaCaminho(loop,no,dimensao){
	let i,j,k;
	loop.contadorDeCaminhos ++;
	for(k=1;k<=dimensao;k++){
		loop.caminhosPercorridos[loop.contadorDeCaminhos][1][k] = no.caminho[1][k];
		loop.caminhosPercorridos[loop.contadorDeCaminhos][2][k] = no.caminho[2][k];
	}
}
function caminhosIguais(loop,no,k,dimensao){
	let i;
	let eqq=0;
	for(i=1;i<=dimensao;i++)
		if(loop.caminhosPercorridos[k][1][i] == no.caminho[1][i] && loop.caminhosPercorridos[k][2][i] == no.caminho[2][i]){
			eqq ++;
		}
	if(eqq == dimensao)
	return true;
	return false;				
	
}

function resolve(no,matriz){
	let dimensao = $("#dimensao").val();
	subtraiLinha(no);
	subtraiColuna(no);
	restoDoHungaro(no,dimensao,matriz);
}

function calculaZ(no,matriz,dimensao){
	let soma = 0;
	let k;
	for(k=1;k<=dimensao;k++)
		soma+=Number(matriz[no.caminho[1][k]][no.caminho[2][k]]);
	return soma;
}

function subtraiLinha(no){
	let menor,i,j;
	let dimensao = $("#dimensao").val();
	for(i = 1;i<=dimensao;i++){
		menor = M;
		for(j=1;j<=dimensao;j++)
			if(no.matriz[i][j] < menor ) menor = no.matriz[i][j]
		if(menor)	
			for(j=1;j<=dimensao;j++) no.matriz[i][j] -= menor;
	}
}

function subtraiColuna(no){
	let menor,i,j;
	let dimensao = $("#dimensao").val();
	for(j = 1;j<=dimensao;j++){
		menor = M;
		for(i=1;i<=dimensao;i++)
			if(no.matriz[i][j] < menor) menor = no.matriz[i][j];
		if(menor)
			for(i = 1; i<=dimensao;i++) no.matriz[i][j] -= menor;
	}
}

function deuRuim(no,dimensao,arcoDefeituoso,a){
	let contadorVisitadas = 1;
	let visitadas = [];
	visitadas[1] = no.caminho[1][a];
	let i,k = no.caminho[1][1];
		for(i=1;i<=dimensao;i++){
			if(no.caminho[1][i] == k){
				k = no.caminho[2][i];
				if(!jaVisitadas(k,visitadas,contadorVisitadas) || k==no.caminho[1][1]){
					visitadas[++contadorVisitadas] = k;
					i=0;
				}
				else{
					arcoDefeituoso.i = no.caminho[1][i];
					arcoDefeituoso.j = no.caminho[2][i];
					return true;
				}
			}
		}
	return false;
}

function jaVisitadas(k,visitadas,contadorVisitadas){
	let i;
	for(i=1;i<=contadorVisitadas;i++){
		if(k==visitadas[i])
			return true;
	}
	return false;
}

function penaliza(dimensao,matriz,matrizOriginal,I,J,n){
	var mat = [];
	let i,j;

	for(i=1;i<=dimensao;i++){
		mat[i] = [];
		for(j=1;j<=dimensao;j++)
			mat[i][j] = matrizOriginal[i][j];
	}

	if(n){
		for(i=1;i<I;i++)	mat[i][J] = M;
		for(i=I+1;i<=dimensao;i++)	mat[i][J] = M;
			
		for(j=1;j<J;j++)	mat[I][j] = M;
		for(j=J+1;j<=dimensao;j++)	mat[I][j] = M;
		return mat;
	}

	mat[I][J] = M;
	return mat;
}

function restoDoHungaro(no,dimensao,matriz){
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

	contaZeros(no.matriz,zeros,dimensao);

	while(temZeros(zeros,dimensao))marcaERisca(no.matriz,zeros,riscados,marcados,dimensao,contador); //tenta fazer uma alocação
	

	while(contador.marcados < dimensao){

		marcaLinhasSemZero(marcadas,marcados,riscados,contador,dimensao);

		zeraMarcadosERiscados(marcados,riscados,contador);

		trocaLinha(marcadas,dimensao);

		subSomaMenor(marcadas,no,dimensao)//*//

		contaZeros(no.matriz,zeros,dimensao)
		
		while(temZeros(zeros,dimensao))marcaERisca(no.matriz,zeros,riscados,marcados,dimensao,contador); //tenta fazer uma alocação	
	}
	no.caminho=marcados;
	no.z = calculaZ(no,matriz,dimensao);
}

function subSomaMenor(marcadas,no,dimensao){
	let i,j;
	let menor = M;
	for(i=1;i<=dimensao;i++)
		for(j=1;j<=dimensao;j++)
			if(!assinalado(marcadas,i,j,dimensao) && no.matriz[i][j]<menor)
				menor = no.matriz[i][j];
	for(i=1;i<=dimensao;i++)
		for(j=1;j<=dimensao;j++)
			if(!assinalado(marcadas,i,j,dimensao))
				no.matriz[i][j] -= menor;
			else if(assinaladasso(marcadas,i,j,dimensao))
				no.matriz[i][j] += menor;
}

function assinaladasso(marcadas,i,j,dimensao){
		if(marcadas.linhas[i] && marcadas.colunas[j])
			return true;
	return false;
}

function assinalado(marcadas,i,j,dimensao){
		if(marcadas.linhas[i] || marcadas.colunas[j])
			return true;
	return false;
}

function contaZeros(tabela,zeros,dimensao){
	let i,j;
	for(i=1;i<=dimensao;i++){
		zeros[i] = 0;
		for(j=1;j<=dimensao;j++)
			if(!tabela[i][j]) zeros[i]++;
	}
}

function trocaLinha(marcadas,dimensao){
	let i;
	for(i=1;i<=dimensao;i++) marcadas.linhas[i] = !marcadas.linhas[i];
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

function zeraMarcadosERiscados(marcados,riscados,contador)
{	while(contador.riscados){
		riscados[1][contador.riscados] = 0;
		riscados[2][contador.riscados] = 0;
		contador.riscados--;
	}
	while(contador.marcados){
		marcados[1][contador.marcados] = 0;
		marcados[2][contador.marcados] = 0;
		contador.marcados--;
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
	let i;
	var tabela = [];
	var dimensao = $("#dimensao").val();
	for(i=1;i<=dimensao;i++) tabela[i] = [];
	pegarValoresDaTabela(tabela);
	var no = {};
	var r = {};
	r.matriz = tabela;
	r.valido = false;
	r.z = M;
	r.caminho = [];
	r.caminho[1] = [];
	r.caminho[2] = [];
	r.p1 = null;
	r.p2 = null;
	
	loop = {};
	loop.contadorDeCaminhos = 0;
	loop.caminhosPercorridos = [];
	loop.vezes = [];
	for(i=1;i<=100;i++){
		loop.vezes[i] = 0;
		loop.caminhosPercorridos[i] = [];
		loop.caminhosPercorridos[i][1] = [];
		loop.caminhosPercorridos[i][2] = [];
	}

	passeia(dimensao,tabela,tabela,no,r,loop);

}