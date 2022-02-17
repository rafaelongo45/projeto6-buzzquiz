const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
let quizzesData = null;

function pegarDadosAPI() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    console.log(promessa);
    promessa.then(pegaQuizz);
    promessa.catch();
}

function pegaQuizz(elemento) {
    quizzesData = elemento.data;
    renderizaTela01(quizzesData);
    console.log(quizzesData);

}

function renderizaTela01(dadoSite) {
    const tela01 = document.querySelector('.tela01')
    tela01.innerHTML = `<!-- Criar quizz -->
    <div class="criar-quizz ">
        
    </div>

    <!-- Seus quizzes -->
    <div class="todos-os-quizzes escondido">
        <div>
            <h2>Seus Quizzes</h2>
            <ion-icon name="add-circle"></ion-icon>
        </div>
        <ul>
            <li class="quizz">
                <img src="./imagens/potter.png" alt="Simpsons imagem">
                <p>O quão Potterhead é você?</p>
            </li>
            <li class="quizz">
                <img src="./imagens/ferias.png" alt="Simpsons imagem">
                <p>É ex-BBB ou ex-De férias com o Ex?</p>
            </li>
        </ul>
    </div>

    <!-- Todos os quizzes -->
    <div class="todos-os-quizzes">
        <div>
            <h2>Todos os Quizzes</h2>
        </div>
        <ul class = "quizzes-site">
        </ul>
    </div>`

    renderizaQuizzesUsuario(dadoSite)
    renderizaTodosOsQuizzes(dadoSite);
}

function renderizaQuizzesUsuario(dadoSite) {
    const janelaCriarQuizz = document.querySelector('.criar-quizz');
    janelaCriarQuizz.innerHTML = `
    <p>Você não criou nenhum quizz ainda :(</p>
    <button>Criar quizz</button>
    `

    //se o usuario ja tiver criado quizz fazer a estrutura do Seus quizzes, se não tiver encaixa o que ta em cima no else.
}

function renderizaTodosOsQuizzes(dadoSite) {
    const ul = document.querySelector('.quizzes-site');
    for (let i = 0; i < dadoSite.length; i++) {
        ul.innerHTML += `
        <li class="quizz" onclick = "clicouQuizz(this)">
            <img src="${dadoSite[i].image}">
            <p>${dadoSite[i].title}</p>
            <span class = "id escondido"> ${dadoSite[i].id}</span>
        </li>
        `
    }
}

function clicouQuizz(elemento) {
    const id = elemento.querySelector('.id');
    const idNumero = parseInt(id.innerText);
    renderizaQuizzCLicado(idNumero)
}

function renderizaQuizzCLicado(id) {
    for (let i = 0; i < quizzesData.length; i++) {
        if (id === quizzesData[i].id) {
            renderizaTela02(quizzesData[i]);
        }
    }
}

function renderizaTela02(data) {
    const tela01 = document.querySelector('.tela01');
    const tela02 = document.querySelector('.tela02');

    tela02.innerHTML = `
        <div class="titulo-quizz">
            <img src=${data.image} alt="">
            <h2>${data.title}</h1>
        </div>

        <ul class="lista-perguntas"> 
        </ul>

        <section class="resultado">
        </section>

        <div class="container-botoes">
            <button class="botao-reiniciar">Reiniciar Quizz</button>
            <button class="botao-home">Voltar pra home</button>
        </div>
    `;
    const listaPerguntas = document.querySelector('.lista-perguntas');
    const resultado = document.querySelector('.resultado');

    const perguntasSite = data.questions;

    for (let i = 0; i < perguntasSite.length; i++) {
        listaPerguntas.innerHTML +=
            `
        <li class="pergunta">
            <div class="titulo-primeira-pergunta">
                <h2>${perguntasSite[i].title}</h2>
            </div>

            <ul class="container-respostas">
                
            </ul>
        </li>
        `;
    }
    
    const containerRespostas = document.querySelectorAll('.container-respostas')
    let listaRespostas = [];
    
    for (let i = 0; i < containerRespostas.length; i++){
        listaRespostas.push([])
        for (let j = 0; j < perguntasSite[i].answers.length; j++){
            listaRespostas[i].push({imagem: perguntasSite[i].answers[j].image, texto: perguntasSite[i].answers[j].text});
        }
     
    }

    for (let i = 0; i < listaRespostas.length; i++){
        listaRespostas[i].sort(comparador);
    }

    for (let i = 0; i < containerRespostas.length; i++){
        for (let j = 0; j < perguntasSite[i].answers.length; j++){
            containerRespostas[i].innerHTML += 
            `
                <li class="resposta">
                <img src="${listaRespostas[i][j].imagem}" alt="">
                <p>${listaRespostas[i][j].texto}</p>
                </li>
            `
        }
    }
    
    console.log(listaRespostas);

    resultado.innerHTML = `
    <div class="titulo-resultado">
        <h2>88% de acerto: Você é praticamente um aluno de Hogwarts!</h2>
    </div>
    <div class="resultado-mensagem">
        <img src="./imagens/image 10.png" alt="">
        <p>Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no botão
        abaixo para usar o vira-tempo e reiniciar este teste.</p>
    </div>
    `

    tela01.classList.add('escondido');
    tela02.classList.remove('escondido');

}

function comparador() { 
	return Math.random() - 0.5; 
}

pegarDadosAPI();


/*containerRespostas[i].innerHTML += `
<li class="resposta">
    <img src="${perguntasSite[i].answers[j].image}" alt="">
    <p>${perguntasSite[i].answers[j].text}</p>
</li>
`*/