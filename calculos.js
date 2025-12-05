const form = document.getElementById('formularioNotas');

const calculo = document.getElementById("calculoNota");

const resultadoDiv = document.getElementById('resultado');

let Temporizador;

let idNotaEditando = null; //variável para armazenar o ID da nota que está sendo editada




 function carregarHistorico() {
        const user = auth.currentUser; //verifica o usuario logado
        const historicoDiv = document.getElementById('listaNotas');

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
            const idNota = doc.id; //pega o ID do documento
            const corStatus = nota.statusAprovacao === 'Aprovado' ? 'verde' : 'vermelho'; //se aprovado, cor verde, se reprovado, cor vermelho

            htmlHistorico += `<li class="notaItem" id="nota-${idNota}"> 
                <h3>Matéria: ${nota.materia}</h3>
                <p>1º Trimestre: ${nota.notaPrimeiro}</p>
                <p>2º Trimestre: ${nota.notaSegundo}</p>
                <p>3º Trimestre: ${nota.notaTerceiro}</p>
                <p>Média Final: ${nota.mediaFinal}</p>
                <p class="status ${corStatus}">Status: ${nota.statusAprovacao}</p>


          <div class="acoes-nota">
                    <button class="btn-editar" onclick="prepararEdicao('${idNota}', '${nota.materia}', ${nota.notaPrimeiro}, ${nota.notaSegundo}, ${nota.notaTerceiro})">Editar</button>
                    <button class="btn-excluir" onclick="deletarNota('${idNota}', '${nota.materia}')">Excluir</button>
                </div>
            </li>
            `;
            
            
              
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

document.getElementById('btnAnonimo').addEventListener('click', () => {
    auth.signInAnonymously()
    .then(() => {
        console.log("Login anônimo realizado com sucesso.");
    })
    .catch((error) => {
        console.error("Erro ao fazer login anônimo:", error);
    });
});


window.deletarNota = function(idNota, materia) {
    const user = auth.currentUser;
   

    if(confirm(`Tem certeza que deseja excluir a nota de ${materia}?`)) {
        db.collection('usuarios').doc(user.uid).collection('notas').doc(idNota).delete() //vai entrar na coleção chamada usuarios, procurar o documento com o id do usuario logado, entrar na subcoleção notas, procurar o documento com a idnota e deletar

    .then(() => {
        console.log("Nota deletada com sucesso!");
        carregarHistorico(); //atualiza o histórico após deletar a nota

        if (idNotaEditando === idNota) {
            cancelarEdicao(); //se a nota que está sendo editada for deletada, cancela a edição
        }
    })
    .catch((error) => {
        console.error("Erro ao deletar nota: ", error);
    });
    
}

}

window.prepararEdicao = function(idNota, materia, notaPrimeiro, notaSegundo, notaTerceiro) {

    document.getElementById('materia').value = materia;
    document.getElementById('notaPrimeiro').value = notaPrimeiro;
    document.getElementById('notaSegundo').value = notaSegundo;
    document.getElementById('notaTerceiro').value = notaTerceiro;

    idNotaEditando = idNota; //armazena o ID da nota que está sendo editada


    const botaoSubmit = document.querySelector('#formularioNotas button[type="submit"]');
    botaoSubmit.textContent = 'Atualizar Nota'; //muda o texto do botão para "Atualizar Nota"
    
    document.getElementById('formularioNotas').scrollIntoView({ behavior: 'smooth' }); //rola a página até o formulário

}

function cancelarEdicao() {
    idNotaEditando = null; //reseta a variável de edição
    document.getElementById('formularioNotas').reset(); //reseta o formulário
    const botaoSubmit = document.querySelector('#formularioNotas button[type="submit"]');
    botaoSubmit.textContent = 'Calcular Média Final'; //muda o texto do botão de volta para "Calcular Média Final"
}

calculo.addEventListener('click', function(event) {
    event.preventDefault();

    const notaPrimeiro = parseFloat(document.getElementById('notaPrimeiro').value);
const notaSegundo = parseFloat(document.getElementById('notaSegundo').value);
const notaTerceiro = parseFloat(document.getElementById('notaTerceiro').value);

const materia = document.getElementById('materia').value;

let erroNaValidade = false;

var media = document.getElementById("escalaNotas").value

//novo esquema de escala : o usuario tem um input que ele coloca QUAL A MÉDIA DE APROVAÇÃO DELE, ai o java script pega o valor do input, e coloco dentro de uma variavel, ai eu faço, se a escala for 10, a média de aprovação não pode ser maior que 10, e vice versa, mas enfim, ai eu faço, se maximo for 10, e a media de aprovação for = ou menor que o maximo,

//se a escala for 10, ele pega a media de aprovação e ve, o valor dela é = ou menor que 10?, então faz o calculo normal

//media de aprovação: 70, se calcular media for => que media de aprovação


var mediaInput = document.getElementById("escalaNotas")

 if (mediaInput.value.trim() === '') {
    mediaInput.setCustomValidity("Preencha este campo")
    mediaInput.reportValidity()
    erroNaValidade = true;
     return;
 }
 // Limpa a validação se o campo estiver OK
    mediaInput.setCustomValidity(""); 
    mediaInput.reportValidity();


 const inputsDeNota = document.querySelectorAll('.notas');


    inputsDeNota.forEach((input) => {

        
 if (input.value.trim() === '') {
    input.setCustomValidity("Preencha este campo")
    input.reportValidity()
    erroNaValidade = true;
    return;
 }
  input.setCustomValidity(""); 
    input.reportValidity();

        if (input.value <= 10 && media == 6 || media == 7 || media == 8 || media == 5 || media == 4 || media == 3 || media == 2 || media == 1 || media == 9 || media == 10 ) {


        input.setAttribute('max', 10);
        input.setAttribute('step', 10 ? '0.1' : '1.0'); //se for escala 10, passo de 0.1, se for 100, passo de 1.0
        if (input.value.trim() > 10 ) {
            input.setCustomValidity(`O valor deve ser menor ou igual a 10.`)
            input.reportValidity()
            erroNaValidade = true;
            return;
        } 

        input.setCustomValidity(""); 
    input.reportValidity();

        } else {
        input.setAttribute('max', 100);
        input.setAttribute('step', 100 ? '0.1' : '1.0'); //se for escala 10, passo de 0.1, se for 100, passo de 1.0
        }

    
    })

    if (erroNaValidade == true) {
        return;
    } 


const calcularMediaFinal = (notaPrimeiro * 3 + notaSegundo * 3 + notaTerceiro * 4) / 10;

  


if (calcularMediaFinal >= media) {
    resultadoDiv.innerHTML = `Média Final: ${calcularMediaFinal} - Parabéns você está Aprovado em ${materia}!`;
} else { 
    resultadoDiv.innerHTML = `Média Final: ${calcularMediaFinal} - Infelizmente você está Reprovado em ${materia}.`;
}




});


        form.addEventListener('submit', function(event) {
    event.preventDefault();


    const user = auth.currentUser;

    if (!user) {
        resultadoDiv.innerHTML = 'Por favor, faça login para calcular a média final.';
        return; //INTERROMPE A EXECUÇÃO SE NÃO ESTIVER LOGADO
    }

let erroNaValidade = false;


const notaPrimeiro = parseFloat(document.getElementById('notaPrimeiro').value);
const notaSegundo = parseFloat(document.getElementById('notaSegundo').value);
const notaTerceiro = parseFloat(document.getElementById('notaTerceiro').value);

const materia = document.getElementById('materia').value;

var media = document.getElementById("escalaNotas").value;


var mediaInput = document.getElementById("escalaNotas")

 if (mediaInput.value.trim() === '') {
    mediaInput.setCustomValidity("Preencha este campo")
    mediaInput.reportValidity()
    erroNaValidade = true;
     return;
 }
 // Limpa a validação se o campo estiver OK
    mediaInput.setCustomValidity(""); 
    mediaInput.reportValidity();


 const inputsDeNota = document.querySelectorAll('.notas');


    inputsDeNota.forEach((input) => {

        
 if (input.value.trim() === '') {
    input.setCustomValidity("Preencha este campo")
    input.reportValidity()
    erroNaValidade = true;
    return;
 }
  input.setCustomValidity(""); 
    input.reportValidity();

        if (input.value <= 10 && media == 6 || media == 7 || media == 8 || media == 5 || media == 4 || media == 3 || media == 2 || media == 1 || media == 9 || media == 10 ) {


        input.setAttribute('max', 10);
        input.setAttribute('step', 10 ? '0.1' : '1.0'); //se for escala 10, passo de 0.1, se for 100, passo de 1.0
        if (input.value.trim() > 10 ) {
            input.setCustomValidity(`O valor deve ser menor ou igual a 10.`)
            input.reportValidity()
            erroNaValidade = true;
            return;
        } 

        input.setCustomValidity(""); 
    input.reportValidity();

        } else {
        input.setAttribute('max', 100);
        input.setAttribute('step', 100 ? '0.1' : '1.0'); //se for escala 10, passo de 0.1, se for 100, passo de 1.0
        }

    
    })

    if (erroNaValidade == true) {
        return;
    } 


const calcularMediaFinal = (notaPrimeiro * 3 + notaSegundo * 3 + notaTerceiro * 4) / 10;



if (calcularMediaFinal >= media) {
    resultadoDiv.innerHTML = `Média Final: ${calcularMediaFinal} - Parabéns você está Aprovado em ${materia}!`;
} else { 
    resultadoDiv.innerHTML = `Média Final: ${calcularMediaFinal} - Infelizmente você está Reprovado em ${materia}.`;
}

const status = calcularMediaFinal >= media ? 'Aprovado' : 'Reprovado';

const dadosDoAluno = {
    notaPrimeiro: notaPrimeiro,
    notaSegundo: notaSegundo,
    notaTerceiro: notaTerceiro,
    materia: materia,
    mediaFinal: calcularMediaFinal,
    statusAprovacao: status
};

 const NotasExistente = db.collection('usuarios').doc(user.uid).collection('notas');

if (idNotaEditando) {
    NotasExistente.doc(idNotaEditando).update(dadosDoAluno) //atualiza o documento com o ID armazenado
    .then(() => {
        console.log("Nota atualizada com sucesso!");
        carregarHistorico(); //atualiza o histórico após atualizar a nota
        cancelarEdicao(); //reseta o formulário e o estado de edição
        resultadoDiv.innerHTML += `<br>Nota atualizada com sucesso para a matéria ${dadosDoAluno.materia}.`;
    })
    .catch((error) => {
        console.error("Erro ao atualizar nota: ", error);
    });

} else {


NotasExistente.where('materia', '==', dadosDoAluno.materia) //verifica se já existe uma nota para a matéria
.get()
.then((querySnapshot) => {
    if (!querySnapshot.empty) {
        resultadoDiv.innerHTML += `<br>Já existe uma nota cadastrada para a matéria ${dadosDoAluno.materia}. Atualize a nota existente em vez de adicionar uma nova.`;
    
    } else {

        NotasExistente.add(dadosDoAluno) //adiciona os dados do aluno na coleção notas
        .then((docRef) => {
            console.log("Documento adicionado com ID: ", docRef.id); //se tudo der certo, mostra o ID do documento
            carregarHistorico(); //atualiza o histórico após adicionar a nota
            form.reset(); //reseta o formulário após adicionar a nota
            resultadoDiv.innerHTML += `<br>Nota adicionada com sucesso para a matéria ${dadosDoAluno.materia}.`;

        })  //docRef = referência do documento, é um objeto que contém informações sobre o documento adicionado
        .catch((error) => {
            console.error("Erro ao adicionar documento: ", error);
        }); //se der erro, mostra o erro no console
    }

    setTimeout(() => {
        resultadoDiv.innerHTML = ''; //limpa o resultado após 10 segundos
    }, 5000);

    
})
}

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

    const telaLogin = document.getElementById("tela-login");
    const telaDashboard = document.getElementById("tela-dashboard");

    if (user) { //se está logado
        console.log("Usuário está logado: ", user.email);


        telaLogin.style.display = "none";
        telaDashboard.style.display = "flex";


        carregarHistorico(); //atualiza o histórico após adicionar a nota

    } else { //se não está logado
        console.log("Usuário não está logado.");

        telaLogin.style.display = "flex";
        telaDashboard.style.display = "none";

         const saudacaoUsuario = document.getElementById('saudacao-usuario');

        saudacaoUsuario.innerHTML = `Olá Estudante!`; 

    }

});


   

    //se o usuario está logado, esconde o container de login e mostra o formulario de notas, se não está logado, mostra a tela de login e esconde o formulario.



// BOTAO DE LOGOUT

document.getElementById('btnLogout').addEventListener('click', () => {
    limparTemporizador()
    // O método signOut() do Firebase encerra a sessão do usuário
    
    const user = auth.currentUser; //verifica o usuario logado
    const authMessage = document.getElementById('authMessage')

    if (!user) {
        auth.signOut(); // Simplesmente encerra qualquer sessão residual
        authMessage.textContent = 'Você não estava logado.';
        return; 
    }


    if (user.isAnonymous) {

        const uid = user.uid

        deletarAnonimo(uid)
        .finally(() => {


            user.delete()
            .then(() => {
                console.log("Usuário anônimo deletado após logout.");
            })
        })

    } else {
    auth.signOut( ) 
        .then(() => {
            // Sucesso no Logout
            console.log("Usuário deslogado com sucesso.");
            // O onAuthStateChanged (que você já fez) automaticamente
            // detecta essa mudança e esconde o formulário, mostrando a tela de login.

        


        location.reload(true);
        
            // Opcional: Exibe uma mensagem na tela de login
            document.getElementById('authMessage').textContent = 'Você deslogou com sucesso.';
            
        })

       
        
       .catch((error) => {
            // Falha no Logout
            console.error("Erro ao deslogar:", error);
            document.getElementById('authMessage').textContent = `Erro ao deslogar: ${error.message}`;
        });

    }

      

        
});

//CALCULAR MEDIA TRIMESTRAL

let contadordeTrabalhos = 3; //começa após o trabalho 2

document.getElementById('btnAddTrabalho').addEventListener('click', () => {
    limparTemporizador()
    const container = document.getElementById('containerNotasTrabalhos'); //pega o container onde os inputs serão adicionados

    //cria a label

    const label = document.createElement('label');
    label.setAttribute('for', `trabalho${contadordeTrabalhos}`);
    label.textContent = `Nota do Trabalho ${contadordeTrabalhos}:`;

    const input = document.createElement('input'); //cria o input
    input.setAttribute('type', 'number');
    input.setAttribute('id', `trabalho${contadordeTrabalhos}`);
    input.setAttribute('min', '0');
    input.setAttribute('max', '100.0');
    input.setAttribute('step', '0.1');
    input.setAttribute('value', '0');

    container.appendChild(label); //adiciona a label ao container
    container.appendChild(input); //adiciona o input ao container
    contadordeTrabalhos++; //incrementa o contador
}); //a lógica é o seguinte: quando houver o clique, ele vai criar um novo input e uma nova label, adicionar ao container e incrementar o contador para o próximo trabalho.

//REMOVER TRABALHO

document.getElementById('btnRemoverTrabalho').addEventListener('click', () => {
    limparTemporizador()
    const container = document.getElementById('containerNotasTrabalhos');

    const totalInputs = container.getElementsByTagName('input').length;

    if (totalInputs > 2) { //garante que sempre haverá pelo menos 2 trabalhos

        const label  = container.getElementsByTagName('label')
        const input = container.getElementsByTagName('input');

        container.removeChild(label[totalInputs -1]); //remove a última label
        container.removeChild(input[totalInputs -1]); //remove o último input

        contadordeTrabalhos--; //decrementa o contador
    }

}); //a lógica é: quando clicar no botão, ele vai pegar o container, contar quantos inputs tem, se tiver mais de 2, ele remove o último input e a última label, e decrementa o contador.


//calculo da nota trimestral

document.getElementById('formularioParcial').addEventListener('submit', function(event) {
    limparTemporizador()
    event.preventDefault(); //impede o comportamento padrão do formulário

    const inputNotas = document.querySelectorAll('#containerNotasTrabalhos input'); //seleciona todos os inputs dentro do container


    let somaNotas = 0;
    let numTrabalhos = 0; 

    inputNotas.forEach((input) => {

    let valor = parseFloat(input.value); //pega o valor do input e converte para float
    let nota = parseFloat(valor) // 0; //se for NaN, atribui 0

    somaNotas += nota; //soma as notas
    numTrabalhos++; //incrementa o número de trabalhos
    }); 
//a lógica é: pega o formulario enviado, seleciona todos os input dentro do container, para cada input, pega o valor, converte para float, soma as notas e incrementa o número de trabalhos.



const mediaAtual = numTrabalhos > 0 ? (somaNotas / numTrabalhos) : 0; //calcula a média atual

var media = document.getElementById("escalaNotas").value

const resultadoDiv = document.getElementById('resultadoParcial');

var notaDesejada = media;






var mensagem = `Sua média atual do trimestre é ${mediaAtual}. `;



if (mediaAtual >= notaDesejada) {
    mensagem += `Parabéns! Você já atingiu a média necessária de ${notaDesejada} para aprovação neste trimestre.`;
}

else {

    var notaNecessaria = (notaDesejada * (numTrabalhos + 1)) - somaNotas; //calcula a nota necessária no próximo trabalho
    console.log(notaNecessaria)

   if (media == 6 || media == 7 || media == 8 || media == 5 || media == 4 || media == 3 || media == 2 || media == 1 || media == 9 || media == 10) {

    if (notaNecessaria > 10) {
        mensagem += `Infelizmente, mesmo que você tire a nota máxima no próximo trabalho, não será suficiente para atingir a média necessária de ${notaDesejada} para aprovação neste trimestre.`;
    }
    else if (notaNecessaria <= 0) {
        mensagem += `Parabéns! Você já atingiu a média necessária de ${notaDesejada} para aprovação neste trimestre.`;
    }
    else {
        mensagem += `Você precisa tirar pelo menos ${notaNecessaria.toFixed(2)} no próximo trabalho para atingir a média necessária de ${notaDesejada} para aprovação neste trimestre.`;
}
    } else {
        if (notaNecessaria > 100){
                mensagem += `Infelizmente, mesmo que você tire a nota máxima no próximo trabalho, não será suficiente para atingir a média necessária de ${notaDesejada} para aprovação neste trimestre.`;
    }
    else if (notaNecessaria <= 0) {
        mensagem += `Parabéns! Você já atingiu a média necessária de ${notaDesejada} para aprovação neste trimestre.`;
    }
    else {
        mensagem += `Você precisa tirar pelo menos ${notaNecessaria.toFixed(2)} no próximo trabalho para atingir a média necessária de ${notaDesejada} para aprovação neste trimestre.`;

    }

}
}


    resultadoDiv.innerHTML = mensagem;

    clearTimeout(Temporizador); //limpa o temporizador anterior, se houver

     Temporizador = setTimeout(() => {  
    resultadoDiv.innerHTML = ''; //limpa o resultado após 10 segundos
     }, 7000) 

    
    });

    function limparTemporizador() {
    clearTimeout(Temporizador);
    resultadoDiv.innerHTML = ''; //limpa o resultado imediatamente
    }


function ajustarLimiteNotas() {
    const media = document.getElementById("escalaNotas").value

    
        


    const inputsDeNota = document.querySelectorAll('input[type="number"][name^="nota"], #containerNotasTrabalhos input[type="number"]');

    inputsDeNota.forEach((input) => {
        if (media == 6 || media == 7 || media == 8 || media == 5 || media == 4 || media == 3 || media == 2 || media == 1 || media == 9 || media == 10) {
        input.setAttribute('max', 10);
        input.setAttribute('step', 10 ? '0.1' : '1.0'); //se for escala 10, passo de 0.1, se for 100, passo de 1.0
        } else {
        input.setAttribute('max', 100);
        input.setAttribute('step', 100 ? '0.1' : '1.0'); //se for escala 10, passo de 0.1, se for 100, passo de 1.0
        }
    });
}

document.getElementById('escalaNotas').addEventListener('change', ajustarLimiteNotas);
//chama a função ao carregar a página para definir o limite inicial
document.addEventListener('DOMContentLoaded', ajustarLimiteNotas);




function limparBotao() {
    let botaoLimpar = document.getElementById('btnLimparTudo');

    botaoLimpar.addEventListener('click', () => {
        const container = document.getElementById('containerNotasTrabalhos');

     const inputsDeNota = container.querySelectorAll('input[type="number"][name^="nota"], #containerNotasTrabalhos input[type="number"]');

     const inputNotasForm = document.querySelectorAll('#formularioNotas input[type="number"]');

     inputNotasForm.forEach((input) => {
        input.value = '0'; //reseta o valor do input para 0
     });


     inputsDeNota.forEach((input) => {
        input.value = '0'; //reseta o valor do input para 0
     });
    })
}

limparBotao();


function deletarAnonimo(uid) {
    return db.collection('usuarios').doc(uid).collection('notas').get() //pega todas as notas do usuário anônimo
        .then(snapshot => {
            const batch = db.batch();
            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            console.log("Dados do usuário anônimo deletados com sucesso.");
            return db.collection('usuarios').doc(uid).delete() //deleta o documento do usuário anônimo
        }
    )
        

    }



