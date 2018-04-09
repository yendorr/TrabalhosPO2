const dimensaoMaxima = 17, dimensaoMinima = 2;//limita o numero de nós
const M = (27+10+1998)*999999999999; // infinito
var result = false;
var stringResult;

$(document).ready(function(){
	atualizaTabela();
	$("#dimensao").change(atualizaTabela);//listenner pra atualizar a tabela
	$("#fonte").change(validaFonte);
	$("#destino").change(validaDestino);
	$("#calcula").click(main);
});

function validaValores(){
	let dimensao = $("#dimensao").val();
	if(dimensao>dimensaoMaxima)
		$("#dimensao").val(dimensaoMaxima);
	if(dimensao<dimensaoMinima)
		$("#dimensao").val(dimensaoMinima);
}

function validaFonte(){
	let dimensao = Number($("#dimensao").val());
	let fonte = Number($("#fonte").val());
	if(fonte>dimensao){
		$("#fonte").val(dimensao);
	}
	if(fonte<1)
		$("#fonte").val(dimensaoMinima);
}

function validaDestino(){
	let dimensao = Number($("#dimensao").val());
	let destino = Number($("#destino").val());
	if(destino>dimensao)
		$("#destino").val(dimensao);
	if(destino<1)
		$("#destino").val(dimensaoMinima);
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
	validaFonte();
	validaDestino();
}

function pegarValoresDaTabela(tabela, dimensao, fonte, destino){
		let i, j;
		validaValores();

		//	PEGANDO VALORES DA TABELA PARA A MATRIZ
		for(i = 1;i <= dimensao; i++)
			for(j = 1; j <= dimensao; j++){
				if(i != j && j != fonte && i != destino){
					tabela[i][j] = Number($("#A"+i+""+j).val());
					if($("#A"+i+""+j).val() == "" || $.isNumeric($("#A"+i+""+j).val()) == false){
						tabela[i][j] = undefined;
					}
				}
				else{
					tabela[i][j] = undefined;
				}
			}
		return tabela;
}

function ordenarArcos(tabela, dimensao, fonte, destino, tabelaIndex){
	let i, j, t, quantidade, bubble;

	for(j = 1; j <= dimensao; ++j){
		for(i = 1, quantidade = 0; i <= dimensao; ++i){
			if(tabela[j][i] != undefined){ // sim i e j nisso aqui são invertidos
				tabelaIndex[++quantidade][j] = i;
			}
		}
		tabelaIndex[0][j] = quantidade;

		for(i = 1; i <= quantidade - 1; ++i){
			for(t = i + 1; t <= quantidade; ++t){
				if(tabela[j][tabelaIndex[i][j]] > tabela[j][tabelaIndex[t][j]]){
					bubble = tabelaIndex[i][j];
					tabelaIndex[i][j] = tabelaIndex[t][j];
					tabelaIndex[t][j] = bubble;
				}
			}
		}
	}
}

//O indexD é passado de forma que todos os arcos que vão de K para S são OBLITERADOS com amor, para todo K. Porém não elimina arcos de nós já visitados.
function procurarEDestruir(indexD, tabelaIndex, dimensao, noOrigem, visitados){
	let i, j, t, sair;
	for(j = 1; j <= dimensao; ++j){
		if(visitados[j] == false){
			for(i = 1, sair = true; i <= tabelaIndex[0][j] && sair; ++i){
				if(tabelaIndex[i][j] == indexD){ //Se o arco tiver o mesmo destino que o indexD elimina esse arco, esse outro for só arruma o tabelaIndex para continuar funcionando como uma lista
					for(t = i; t <= tabelaIndex[0][j]; ++t){
						if(t < tabelaIndex[0][j])
							tabelaIndex[t][j] = tabelaIndex[t + 1][j]
						else
							tabelaIndex[t][j] = undefined;
					}
					--tabelaIndex[0][j];
					sair = false;
				}
			}
		}
	}
}


function recursao(tabela, dimensao, fonte, destino, tabelaIndex, visitados, noAtual, caminho, caminhoCusto){
	let i, j, melhorCusto, melhorNo, umaVisita;
	var custo = []; //Armazena o custo do caminho total de todos os arcos deste nó até o destino por meio de cada um deles. São comparados para se obter o melhor, e este custo será armazenado no caminhoCusto deste nó. E o nó que leva para este caminho propicio é armazenado em caminho
	melhorCusto = M;
	visitados[noAtual] = true; //Uma vez visitado ele está visitado pra sempre. tenho medo que essa logica esteja errada, mas pelos testes que eu fiz e casos que eu pensei deve ser assim
	for(i = 1, melhorNo = 1, umaVisita = false; i <= tabelaIndex[0][noAtual]; ++i){
		if(visitados[tabelaIndex[i][noAtual]] == false) //Se o destino desse arco nunca foi visitado
			procurarEDestruir(tabelaIndex[i][noAtual], tabelaIndex, dimensao, noAtual, visitados);
		custo[i] = recursao(tabela, dimensao, fonte, destino, tabelaIndex, visitados, tabelaIndex[i][noAtual], caminho, caminhoCusto);
		if(custo[i] + tabela[noAtual][tabelaIndex[i][noAtual]] <=  custo[melhorNo] + tabela[noAtual][tabelaIndex[melhorNo][noAtual]])
			melhorNo = i;
	}
	if(tabelaIndex[0][noAtual] > 0)
		melhorCusto = custo[melhorNo] + tabela[noAtual][tabelaIndex[melhorNo][noAtual]];
	else
		melhorNo = 0;

	if(noAtual == destino)
		melhorCusto = 0;

	caminho[noAtual] = melhorNo;
	caminhoCusto[noAtual] = melhorCusto;
	//console.log("No atual: " + noAtual + " melhorNo: " + melhorNo + " melhor custo:" + melhorCusto);
	//visitados[noAtual] = false;
	return melhorCusto;
}

function main(){
	var i,j;
	var tabela = []; //Onde estao armazenados os arcos
	var tabelaIndex = []; //Armazena os arcos válidos de forma ordenada. Representa tabela de forma transposta porém os elementos estão ordenados como listas para cada coluna com elementos variaveis, a quantidade de arcos por coluna está armazenada na linha zero e na respectiva coluna. Me odeio por ter feito assim
	var visitados = []; //Booleano que armazena se o arco foi visitado ou não
	var caminho = []; //Onde armazena a resposta, indica o nó com melhor caminho para a resposta final em cada nó.
	var caminhoCusto = []; //O mesmo que o anterior mas armazena o custo total melhor do rfespectivo nó até o nó destino
	var resulto;

	var dimensao = Number($("#dimensao").val());
	var fonte = Number($("#fonte").val());
	var destino = Number($("#destino").val());

	if(fonte == destino){
		alert("O nó fonte não deve ser o mesmo que o nó destino\nPor favor selecione nós diferentes");
		$("#resultado").text("");
		return false;
	}

	for(i=1;i<=dimensao;i++){ //Inicializando variaveis
		caminho[i] = 0;
		caminhoCusto[i] = M;
		visitados[i] = false;
		tabela[i] = []; //criando tabela
		tabelaIndex[i] = [];
	}
	tabelaIndex[0] = []; //Será usado para marcar quantos arcos ainda validos existem em cada nó

	pegarValoresDaTabela(tabela, dimensao, fonte, destino); //Ao pegar os valores, eu elimino todos os arcos que vão à fonte, e aqueles que saem de destino
	ordenarArcos(tabela, dimensao, fonte, destino, tabelaIndex); //Coloca os valores dos arcos viaveis de forma ordenada na tabelaIndex
	recursao(tabela, dimensao, fonte, destino, tabelaIndex, visitados, fonte, caminho, caminhoCusto); //Aqui que a magia acontece

	//Daqui até o final estou printando os resultados
	for(i = fonte, resulto = "", j = true; j == true && i != destino;){
		resulto = resulto + i + "(" + tabela[i][tabelaIndex[caminho[i]][i]] + ")--> ";
		if(caminho[i] == 0){
			resulto = "Não há como chegar no destino";
			j = false;
		}
		i = tabelaIndex[caminho[i]][i];
	}
	if(i == destino)
		resulto = resulto + destino + " Custo total: " + caminhoCusto[fonte];
	$("#resultado").text(resulto);
	console.log(tabela);
}
