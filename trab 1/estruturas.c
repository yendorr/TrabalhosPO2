#include <stdio.h>
#include <stdlib.h>

typedef linha* conexao;
typedef struct linha{
	destino; // pra onde vai 
	custo; 	 // qnt custa pra it
};

typedef grafo* no;
typedef struct grafo{
	cidade;			// chave primaria do no
	linha[] saidas; // representa muitas saidas
	linha saidaBoa;	// saida ideal
	no conector;	//pra fazer a verificação de visitados
};

typedef passos* passo;
typedef passos{
	grafo inicial; //necessario?
	matrix[][]; // tabela pra resolver	
};
