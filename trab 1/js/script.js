$(document).ready(function(){
	atualizaTabela();

	const botaoCalcula = document.querySelectorAll("button.btn")[0];
	const botaoLimpa = document.querySelectorAll("button.btn")[1];
	var tabela; //É onde serão armazenados os valores
	botaoCalcula.onclick = function(){tabela = pegarValoresDaTabela(botaoCalcula);} //ao clicar no botão calcula tabela receberá os valores que estão na tabela do site
});

function criarMatriz() { //Função que deixa as variaveis receberem valores como matrizes
  var vetor = [];
  for (let i=0;i<$("#dimensao").val();++i) {
     vetor[i] = [];
  }
  return vetor;
}

function pegarValoresDaTabela(botaoCalcula){
		let i, j, percorreVetor, dimensao;
		var tabela = criarMatriz();
		tabela[1][2] = 33;
		for(i = percorreVetor = 0, dimensao = $("#dimensao").val(); i < dimensao; ++i){
			for(j = 0; j < dimensao; ++j, ++percorreVetor){
				if(i != j)
					tabela[i][j] = document.querySelectorAll("input.casaTabela")[percorreVetor].value;
				else
					tabela[i][j] = null;
			}
		}
		document.querySelector("p.teste").innerHTML = tabela[0][1];
		return tabela;
}

function atualizaTabela(){
	var conteudo = "";
	var linha;
	var dimensao =$("#dimensao").val();
	for(var i=1;i<=dimensao;i++){
		linha="<td>";
		for(j=1;j<=dimensao;j++){
			// if(i==j)
			// 	linha+= "<span class='barra'>-</span>"
			// else
				//linha+="<input type='input' id='"+i+j+"'>"
				linha += "<input type='input' class='casaTabela'>"
		}
		linha+="</td>"
		conteudo+="<tr>"+linha+"</tr>"
	}

	$("#divTabela").append("<table>"+conteudo+"</table>");
}

function passeia(dimensao,matriz,no,R){
	var I,J;
	no.matriz = matriz;
	no.valido = false;
	no.z = m;
	no.caminho = [];
	no.p1 = null;
	no.p2 = null;

	resolve(no);

	if(deuRuim(no,I,J)){
		var p = {};
		var q = {};
		no.sim = p;
		no.nao = q;

		passeia(dimensao,penaliza(dimensao,matriz,I,J,0),p,R);
		passeia(dimensao,penaliza(dimensao,matriz,I,J,1),q,R);
	}
	if(R.z>no.z)
		R = no;
}

function resolve(no){
	subtraiLinha(no);
	subtraiColuna(no);

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
