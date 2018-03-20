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
	var conteudo="<th></th>";
	var linha;
	var dimensao = $("#dimensao").val();

	$("#divTabela").empty();
	for(j=1;j<=dimensao;j++)
		conteudo+="<th class='tabeleiro'>"+j+"</th>";

	for(var i=1;i<=dimensao;i++){
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
	var I,J;
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
	var i,j;

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

function main(){
	var i,j;
	var tabela = [];
	
	var dimensao = $("#dimensao").val();
	for(i=1;i<=dimensao;i++) tabela[i] = [];
	pegarValoresDaTabela(tabela);
	subtraiLinha(tabela);
	subtraiColuna(tabela);
	do{

	}
}