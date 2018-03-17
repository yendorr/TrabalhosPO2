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