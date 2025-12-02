const form = document.getElementById('formularioNotas');

const resultadoDiv = document.getElementById('resultado');

 function carregarHistorico() {
        const user = auth.currentUser; //verifica o usuario logado
        const historicoDiv = document.getElementById('historicoNotas');

        historicoDiv.innerHTML = '<h2>Carregando Histórico...</h2>'; //limpa o histórico antes de carregar

        if (!user) {
            historicoDiv.innerHTML = '<h2>Por favor, faça login para ver o histórico de notas.</h2>';
            return;
        }

        db.collection('usuarios').doc(user.uid).collection('notas') //entra na coleção usuarios, procura o documento com o ID do usuario logado, entra na subcoleção notas

        .orderBy('materia', 'asc') //ordena por matéria em ordem alfabética
        .get() //pega os documentos
        .then((querySnapshot) => { //se der certo, faz o seguinte
           let htmlHistorico = ''; 

           querySnapshot.forEach((doc) => { //para cada documento, faz o seguinte
            const nota = doc.data(); //pega os dados do documento

            const corStatus = nota.statusAprovacao === 'Aprovado' ? 'verde' : 'vermelho'; //se aprovado, cor verde, se reprovado, cor vermelho

            htmlHistorico += `<div class="notaItem"> 
                <h3>Matéria: ${nota.materia}</h3>
                <p>1º Trimestre: ${nota.notaPrimeiro}</p>
                <p>2º Trimestre: ${nota.notaSegundo}</p>
                <p>3º Trimestre: ${nota.notaTerceiro}</p>
                <p>Média Final: ${nota.mediaFinal}</p>
                <p class="status ${corStatus}">Status: ${nota.statusAprovacao}</p>
            </div>
            `;
            carregarHistorico();
              
           });



           if (htmlHistorico === '') {
            historicoDiv.innerHTML = '<h2>Nenhuma nota encontrada no histórico.</h2>';
           } 
           else {
            historicoDiv.innerHTML = htmlHistorico;
    }

  


})        .catch((error) => {
            console.error("Erro ao carregar histórico: ", error);
            historicoDiv.innerHTML = '<h2>Erro ao carregar histórico de notas.</h2>';
        }
)}



form.addEventListener('submit', function(event) {
    event.preventDefault();


    const user = auth.currentUser;

    if (!user) {
        resultadoDiv.innerHTML = 'Por favor, faça login para calcular a média final.';
        return; //INTERROMPE A EXECUÇÃO SE NÃO ESTIVER LOGADO
    }




const notaPrimeiro = parseFloat(document.getElementById('notaPrimeiro').value);
const notaSegundo = parseFloat(document.getElementById('notaSegundo').value);
const notaTerceiro = parseFloat(document.getElementById('notaTerceiro').value);

const materia = document.getElementById('materia').value;


const calcularMediaFinal = (notaPrimeiro * 3 + notaSegundo * 3 + notaTerceiro * 4) / 10;

if (calcularMediaFinal >= 6) {
    resultadoDiv.innerHTML = `Média Final: ${calcularMediaFinal.toFixed(2)} - Parabéns você está Aprovado em ${materia}!`;
} else { 
    resultadoDiv.innerHTML = `Média Final: ${calcularMediaFinal.toFixed(2)} - Infelizmente você está Reprovado em ${materia}.`;
}

const status = calcularMediaFinal >= 6 ? 'Aprovado' : 'Reprovado';

const dadosDoAluno = {
    notaPrimeiro: notaPrimeiro,
    notaSegundo: notaSegundo,
    notaTerceiro: notaTerceiro,
    materia: materia,
    mediaFinal: calcularMediaFinal.toFixed(2),
    statusAprovacao: status
};


const NotasExistente = db.collection('usuarios').doc(user.uid).collection('notas');

NotasExistente.where('materia', '==', dadosDoAluno.materia) //verifica se já existe uma nota para a matéria
.get()
.then((querySnapshot) => {
    if (!querySnapshot.empty) {
        resultadoDiv.innerHTML += `<br>Já existe uma nota cadastrada para a matéria ${dadosDoAluno.materia}. Atualize a nota existente em vez de adicionar uma nova.`;
    
    } else {
        


db.collection('usuarios').doc(user.uid).collection('notas').add(dadosDoAluno) //vai entrar no banco de dados, na coleção usuarios, procurar o documento user.uid com o ID do usuario, entrar na subcoleção notas e adicionar os dados, isso faz com que cada dado seja adicionado a cada usuario






.then((docRef) => {console.log("Documento adicionado com ID: ", docRef.id) //se tudo der certo, mostra o ID do documento
})  //docRef = referência do documento, é um objeto que contém informações sobre o documento adicionado
.catch((error) => {console.error("Erro ao adicionar documento: ", error);
}); //se der erro, mostra o erro no console

//Vá para a coleção notas_finais e adicione este novo documento. Em seguida (.then), se der certo, me diga o ID que ele gerou. Caso contrário (.catch), me diga o motivo do erro."
    
    }
    carregarHistorico(); //atualiza o histórico após adicionar a nota
})
.catch((error) => {
    console.error("Erro ao verificar notas existentes: ", error);
});

});



//CADASTRO DE USUÁRIO COM FIREBASE AUTHENTICATION

document.getElementById('btnCadastrar').addEventListener('click', () => {
    const email = document.getElementById('authEmail').value;
    const senha = document.getElementById('authSenha').value;
    const mensagem = document.getElementById('authMessage');

    auth.createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
        mensagem.innerHTML = `Cadastro Realizado com Sucesso! Usuário: ${userCredential.user.email}`;

    })
    .catch ((error) => {
        mensagem.innerHTML = `Erro ao Cadastrar: ${error.message}`;
        console.log("Erro ao Cadastrar: ", error.message);
    })
});

//LOGIN DE USUARIO COM FIREBASE AUTHENTICATION

document.getElementById('btnLogin').addEventListener('click', () => {
    const email = document.getElementById('authEmail').value;
    const senha = document.getElementById('authSenha').value;
    const mensagem = document.getElementById('authMessage');

    auth.signInWithEmailAndPassword(email, senha)
    .then((userCredential) => {
        mensagem.innerHTML = `Login Realizado com Sucesso! Usuário: ${userCredential.user.email}`;

    })
    .catch ((error) => {
        mensagem .innerHTML= `Erro ao Fazer Login: ${error.message}`;
        console.log("Erro ao Fazer Login: ", error.message);
    })
});


//SABER SE ESTÁ LOGADO OU NÃO

auth.onAuthStateChanged((user) => {
    if (user) { //se está logado
        console.log("Usuário está logado: ", user.email);

        document.getElementById("authContainer").style.display = "none"; //esconde o container de login/cadastro
        document.getElementById("formularioNotas").style.display = "block"; //mostra o formulário de notas

        carregarHistorico(); //chama a função para carregar o histórico de notas 

    } else { //se não está logado
        console.log("Usuário não está logado.");

        document.getElementById("authContainer").style.display = "block"; //mostra o container de login/cadastro
        document.getElementById("formularioNotas").style.display = "none"; //esconde o formulário de notas
    }

});


   

    //se o usuario está logado, esconde o container de login e mostra o formulario de notas, se não está logado, mostra a tela de login e esconde o formulario.



// Adicione este bloco em seu calculos.js

document.getElementById('btnLogout').addEventListener('click', () => {
    // O método signOut() do Firebase encerra a sessão do usuário
    auth.signOut( ) 
        .then(() => {
            // Sucesso no Logout
            console.log("Usuário deslogado com sucesso.");
            // O onAuthStateChanged (que você já fez) automaticamente
            // detecta essa mudança e esconde o formulário, mostrando a tela de login.
            
            // Opcional: Exibe uma mensagem na tela de login
            document.getElementById('authMessage').textContent = 'Você deslogou com sucesso.';
            carregarHistorico(); //atualiza o histórico após adicionar a nota
        })
        
       .catch((error) => {
            // Falha no Logout
            console.error("Erro ao deslogar:", error);
            document.getElementById('authMessage').textContent = `Erro ao deslogar: ${error.message}`;
        });

        
});



