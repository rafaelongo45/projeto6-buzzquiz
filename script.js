const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
let quizzesData = null;
let listaRespostas = [];
let arrayLevels = [];
let clicks = 0;
let acertos = 0;
let porcentagemAcertos = null;
let meusQuizzes = [];
let listaIDMeusQuizzes = [];
let listaId = [];

let createdQuizz = {};
let quizzInfo = null;


function pegarDadosAPI() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promessa.then(pegaQuizz);
    promessa.catch();
}

function pegaQuizz(elemento) {
    quizzesData = elemento.data;
    renderizaTela01(quizzesData);
}

function renderizaTela01(dadoSite) {
    const tela01 = document.querySelector('.tela01')
    tela01.innerHTML = `<!-- Criar quizz -->    
    <div class="criar-quizz escondido">
        
    </div>

    <!-- Seus quizzes -->
    <div class="todos-os-quizzes">
        <div>
            <h2>Seus Quizzes</h2>
            <ion-icon name="add-circle" onclick = "createQuizz()" data-identifier="create-quizz"></ion-icon>
        </div>
        <ul class = "quizzes-usuario" data-identifier="user-quizzes">

        </ul>
    </div>

    <!-- Todos os quizzes -->
    <div class="todos-os-quizzes">
        <div>
            <h2>Todos os Quizzes</h2>
        </div>
        <ul class = "quizzes-site" data-identifier="general-quizzes">
        </ul>
    </div>`

    const todosQuizzesUsuario = document.querySelector('.quizzes-usuario');

    renderizaTodosOsMeusQuizzes(todosQuizzesUsuario);
    renderizaQuizzesUsuario();
    renderizaTodosOsQuizzes(dadoSite);
}

function renderizaQuizzesUsuario() {
    const janelaCriarQuizz = document.querySelector('.criar-quizz');
    const janelaSeusQuizzes = document.querySelector('.quizzes-usuario').parentNode;
    janelaCriarQuizz.innerHTML = `
    <p>Você não criou nenhum quizz ainda :(</p>
    <button onclick = "createQuizz()" data-identifier="create-quizz">Criar quizz</button>
    `
    if(listaIDMeusQuizzes.length === 0){
        janelaCriarQuizz.classList.remove('escondido');
        janelaSeusQuizzes.classList.add('escondido');
    }else{
        janelaSeusQuizzes.classList.remove('escondido');
        janelaCriarQuizz.classList.add('escondido');
    }
}

function renderizaTodosOsQuizzes(dadoSite) {
    const ul = document.querySelector('.quizzes-site');

    for (let i = 0; i < dadoSite.length; i++){
        if(listaId.includes(dadoSite[i].id)){

        }else{
            ul.innerHTML += `
        <li class="quizz-thumb" onclick = "clicouQuizz(this)" data-identifier="quizz-card">
            <img src="${dadoSite[i].image}">
            <p>${dadoSite[i].title}</p>
            <span class = "id escondido"> ${dadoSite[i].id}</span>
        </li>
        `
        }
        
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

        <section class="resultado" data-identifier="quizz-result">
        </section>

        <div class="container-botoes">
            <button class="botao-vermelho" onclick = "restartQuizz(this)">Reiniciar Quizz</button>
            <button class="botao-home" onclick = "backHome()">Voltar pra home</button>
        </div>
    `;
    const listaPerguntas = document.querySelector('.lista-perguntas');

    const perguntasSite = data.questions;
    const levels = data.levels;

    for (let i = 0; i < perguntasSite.length; i++) {
        listaPerguntas.innerHTML +=
            `
        <li class="pergunta" data-identifier="question">
            <div class="titulo-pergunta" style="background-color: ${perguntasSite[i].color}">
                <h2>${perguntasSite[i].title}</h2>
            </div>

            <ul class="container-respostas">
                
            </ul>
        </li>
        `;
    }
    
    const containerRespostas = document.querySelectorAll('.container-respostas')

    for (let i = 0; i < levels.length; i++){
        arrayLevels.push(levels[i]);
    }

    console.log(arrayLevels)

    for (let i = 0; i < containerRespostas.length; i++){
        listaRespostas.push([])
        for (let j = 0; j < perguntasSite[i].answers.length; j++){
            listaRespostas[i].push({imagem: perguntasSite[i].answers[j].image, texto: perguntasSite[i].answers[j].text, acertou: perguntasSite[i].answers[j].isCorrectAnswer, });
        }
     
    }

    for (let i = 0; i < listaRespostas.length; i++){
        listaRespostas[i].sort(comparador);
    }

    for (let i = 0; i < containerRespostas.length; i++){
        for (let j = 0; j < perguntasSite[i].answers.length; j++){
            containerRespostas[i].innerHTML += 
            `
                <li class="resposta" onclick = "clicaResposta(this)" data-identifier="answer">
                <img src="${listaRespostas[i][j].imagem}" alt="">
                <p>${listaRespostas[i][j].texto} <span class = "escondido">${listaRespostas[i][j].acertou}</span></p>
                </li>
            `
        }
    }
    
    tela01.classList.add('escondido');
    tela02.classList.remove('escondido');
    scrollTo(0,0);
}

function comparador() { 
	return Math.random() - 0.5; 
}

function clicaResposta(elemento){
    const containerElemento = elemento.parentNode;
    const todasRespostas = containerElemento.querySelectorAll('.resposta');
    const todasRespostasTexto = containerElemento.querySelectorAll('p');
    const elementSpan = elemento.querySelector('span');

    for (let i = 0; i < todasRespostas.length; i++){
        if(todasRespostas[i] === elemento){

        }else{
            todasRespostas[i].classList.add('deixa-esbranquiçado')
        }
        todasRespostas[i].removeAttribute("onclick")
    }

    for (let i = 0; i < todasRespostasTexto.length; i++){
        if (todasRespostasTexto[i].querySelector('span').innerText === 'true'){
            todasRespostasTexto[i].classList.add('certo')
        }else{
            todasRespostasTexto[i].classList.add('errado')
        }
    }

    if (elementSpan.innerText === 'true'){
        acertos += 1;
    }
    
    const questionsArray = containerElemento.parentNode.parentNode.querySelectorAll('.pergunta');

    if (clicks === questionsArray.length - 1){
        const resultado = document.querySelector('.resultado');
        setTimeout( () => renderResults(acertos, questionsArray), 2000);
        setTimeout(() => resultado.scrollIntoView(), 2050)
        console.log(porcentagemAcertos)
        clicks = 0;
        return
    }

    setTimeout( () => {scrollNextQuestion(questionsArray[clicks])}, 2000);
    clicks += 1;    
}

function scrollNextQuestion(questionsArray){
    questionsArray.scrollIntoView({block: "center"});
}


function renderResults(acertos, questionsArray){
    const resultado = document.querySelector('.resultado');
    let levels = [];
    let orderedLevels = [];
    calculaAcertos(acertos, questionsArray.length);
    for (let i = 0; i < arrayLevels.length; i++){
        levels.push(parseInt(arrayLevels[i].minValue));
    }

    levels = levels.sort( function (a,b) { return a-b})

    for (let i = 0; i < levels.length; i++){
        for (let x = 0; x < arrayLevels.length; x ++){
            if (levels[i] === parseInt(arrayLevels[x].minValue)){
                orderedLevels.push(arrayLevels[x]);
            }
        }
    }

   for (let i = 0; i < orderedLevels.length; i++){
       if (i !== orderedLevels.length - 1 && porcentagemAcertos >= Math.round(orderedLevels[i].minValue) && porcentagemAcertos <= Math.round(orderedLevels[i + 1].minValue)){
        resultado.innerHTML = `
        <div class="titulo-resultado">
            <h2>${porcentagemAcertos}% de acerto: ${orderedLevels[i].title}</h2>
        </div>
        <div class="resultado-mensagem">
            <img src="${orderedLevels[i].image}" alt="">
            <p>${orderedLevels[i].text}</p>
        </div>
        `
       }else if(i === orderedLevels.length - 1 && porcentagemAcertos >= Math.round(orderedLevels[i].minValue)){
        resultado.innerHTML = `
        <div class="titulo-resultado">
            <h2>${porcentagemAcertos}% de acerto: ${orderedLevels[i].title}</h2>
        </div>
        <div class="resultado-mensagem">
            <img src="${orderedLevels[i].image}" alt="">
            <p>${orderedLevels[i].text}</p>
        </div>
        `
       }
   }
}

function calculaAcertos(acertos, questionsLength){
    porcentagemAcertos = Math.round((acertos/questionsLength) * 100);
}

function restartQuizz(){
    clicks = 0;
    acertos = 0;
    porcentagemAcertos = null;
    const todasRespostas = document.querySelectorAll('.resposta');
    const containers = document.querySelectorAll('.container-respostas');
    const resultado = document.querySelector('.resultado');

    for (let i = 0; i < todasRespostas.length; i++){
        if(todasRespostas[i].classList.contains('deixa-esbranquiçado')){
            todasRespostas[i].classList.remove('deixa-esbranquiçado')
        }
        todasRespostas[i].setAttribute("onclick", "clicaResposta(this)")
    }

    for (let i = 0; i < containers.length; i++){
        let containerP = containers[i].querySelectorAll('p');
        for(let x = 0; x < containerP.length; x++){
            if (containerP[x].classList.contains('errado') || containerP[x].classList.contains('certo')){
                containerP[x].classList.remove('certo')
                containerP[x].classList.remove('errado')
            }
        }
        
    }

    resultado.innerHTML = "";

    scrollTo(0,0);
}

function backHome(){
    window.location.reload();
}

function createQuizz(){
    const firstPage = document.querySelector('.tela01');
    const createQuizzPage = document.querySelector('.tela03');
    
    firstPage.classList.toggle('escondido');
    createQuizzPage.classList.toggle('escondido');

    createQuizzPage.innerHTML = `<!-- layout tela 3.1: info básica -->
    <section class="criacao-info">
        <div class="criacao-titulo">
            <h2>Começe pelo começo</h2>
        </div>
        <form onsubmit="fillQuizzInfo(event)">
            <input type="text" minlength="20" maxlength="65" name="titulo-quizz" id="titulo-quizz" placeholder="Título do seu quizz" required>
            <input type="url" name="url-quizz" id="url-quizz" placeholder="URL da imagem do seu quizz" required>
            <input type="number" min="3" name="qtd-perguntas" id="qtd-perguntas" placeholder="Quantidade de perguntas do quizz" required>
            <input type="number" min="2" name="qtd-niveis" id="qtd-niveis" placeholder="Quantidade de níveis do quizz" required>
            <button>
                Prosseguir pra criar perguntas
            </button>
        </form>
    </section>
    <!-- layout tela 3.2: perguntas -->
    <section class="criacao-perguntas escondido">
        <div class="criacao-titulo">
            <h2>Crie suas perguntas</h2>
        </div>
        <form onsubmit="fillQuizzQuestions(event)">
            <ul></ul>
            <button>
                Prosseguir pra criar níveis
            </button>
        </form>
    </section>
    <!-- layout tela 3.3: níveis -->
    <section class="criacao-niveis escondido">
        <div class="criacao-titulo">
            <h2>Agora, decida os níveis!</h2>
        </div>
        <form onsubmit="fillQuizzLevels(event)">
            <ul></ul>
            <button>
                Finalizar Quizz
            </button>
        </form>
    </section>
    <!-- layout tela 3.4: sucesso -->
    <section class="criacao-sucesso escondido"></section>`

}


function fillQuizzInfo(event) {
    event.preventDefault();
    createdQuizz = {};
    const inputs = document.querySelectorAll('.criacao-info form input');
    const inputValues = [...inputs].map(input => input.value);
    
    quizzInfo = {
        title: inputValues[0],
        image: inputValues[1],
        numQuestions: parseInt(inputValues[2]),
        numLevels: parseInt(inputValues[3])
    };
    
    const validTitle = quizzInfo.title.length >= 20 && quizzInfo.title.length <= 65;
    const validImage = validateURL(quizzInfo.image);
    const validQuestions = quizzInfo.numQuestions >= 3 && Number.isInteger(quizzInfo.numQuestions);
    const validLevels = quizzInfo.numLevels >= 2 && Number.isInteger(quizzInfo.numLevels);

    if (validTitle && validImage && validQuestions && validLevels) {
        document.querySelector('.criacao-info').classList.toggle('escondido');
        document.querySelector('.criacao-perguntas').classList.toggle('escondido');
        displayQuizzQuestions();

        createdQuizz.title = quizzInfo.title;
        createdQuizz.image = quizzInfo.image;
    } else {
        alert('Preencha os dados corretamente');
    }
}

function displayQuizzQuestions() {
    const questionList = document.querySelector('.criacao-perguntas ul');
    for (let i=0; i<quizzInfo.numQuestions; i++) {
        questionList.innerHTML += `
        <li>
            <div class="pergunta-form" onclick="toggleItem(this)">
                <h2>Pergunta ${i+1}</h2>
                <ion-icon name="create-outline"></ion-icon>
            </div>

            <div class="pergunta-info escondido">
                <input type="text" minlength="20" name="texto-pergunta" id="texto-pergunta" placeholder="Texto da pergunta" required>
                <input type="text" pattern="#[0-9a-fA-F]{6}" name="cor-pergunta" id="cor-pergunta" placeholder="Cor de fundo da pergunta" required">
                
                <label>Resposta correta</label>
                <input type="text" name="resposta-correta" id="resposta-correta" placeholder="Resposta correta" required>
                <input type="url" name="url-correta" id="url-correta" placeholder="URL da imagem" required>
                
                <label>Respostas incorretas</label>
                <input type="text" name="resposta-incorreta" id="resposta-incorreta" placeholder="Resposta incorreta 1" required>
                <input type="url" name="url-incorreta" id="url-incorreta" placeholder="URL da imagem 1" required>
                <input type="text" name="resposta-incorreta" id="resposta-incorreta" placeholder="Resposta incorreta 2">
                <input type="url" name="url-incorreta" id="url-incorreta" placeholder="URL da imagem 2">
                <input type="text" name="resposta-incorreta" id="resposta-incorreta" placeholder="Resposta incorreta 3">
                <input type="url" name="url-incorreta" id="url-incorreta" placeholder="URL da imagem 3">
            </div>
        </li>
        `;
    }
}

function fillQuizzQuestions(event) {
    event.preventDefault();
    const questionNodes = document.querySelectorAll('.criacao-perguntas .pergunta-info');

    const questionsList = [];
    for (let i=0; i<quizzInfo.numQuestions; i++) {
        const inputs = questionNodes[i].querySelectorAll('input');
        const inputList = [...inputs].filter(input => input.value);

        const question = {
            title: inputList.find(input => input.id === 'texto-pergunta').value,
            color: inputList.find(input => input.id === 'cor-pergunta').value,
            answers: [
                {
                    text: inputList.find(input => input.id === 'resposta-correta').value,
                    image: inputList.find(input => input.id === 'url-correta').value,
                    isCorrectAnswer: true
                }
            ]
        };

        const wrongAnswers = inputList.filter(input => input.id === 'resposta-incorreta');
        const wrongURLs = inputList.filter(input => input.id === 'url-incorreta');
        for (let j=0; j<wrongAnswers.length; j++) {
            const wrongAnswer = {
                text: wrongAnswers[j].value,
                image: wrongURLs[j].value,
                isCorrectAnswer: false
            }
            question.answers.push(wrongAnswer);
        }

        questionsList.push(question);
    }

    if(validateQuestionInputs(questionsList)) {
        createdQuizz.questions = questionsList;
        document.querySelector('.criacao-perguntas').classList.toggle('escondido');
        document.querySelector('.criacao-niveis').classList.toggle('escondido');
        displayQuizzLevels();
    } else {
        alert('Preencha os dados corretamente');
    }

}

function validateQuestionInputs(questionsList) {
    const regexColor = /^#[0-9a-fA-F]{6}$/;
    
    for (let i=0; i<questionsList.length; i++) {
        const question = questionsList[i];
        const validTitle = question.title.length >= 20;
        const validColor = regexColor.test(question.color);

        if(!(validTitle && validColor)) return false;

        const numAnswers = question.answers.length;
        for (let j=0; j<numAnswers; j++) {
            const answer = question.answers[j];
            const validText = answer.text !== '';
            
            if (!(validText && validateURL(answer.image))) return false;
        }
    }
    return true;
}

function toggleItem(elem) {
    const questionsInfo = elem.nextElementSibling;
    questionsInfo.classList.toggle('escondido');
    elem.querySelector('ion-icon').classList.toggle('escondido');
}

function validateURL(string) {
    const regexURL = /^(http(s)?:\/\/)|(www\.)/;
    const regexImage = /\.(jpeg|jpg|png|gif|svg)/;
    const isValid = regexURL.test(string) && regexImage.test(string);

    return isValid;
}

function displayQuizzLevels() {
    const levels = document.querySelector('.criacao-niveis ul');
    for (let i=0; i<quizzInfo.numLevels; i++) {
        levels.innerHTML += `
            <li>
                <div class="pergunta-form" onclick="toggleItem(this)">
                    <h2>Nível ${i+1}</h2>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <div class="pergunta-info escondido">
                    <input type="text" minlength="10" name="titulo-nivel" id="titulo-nivel" placeholder="Título do nível" required>
                    <input type="number" min="0" max="100" name="acerto-nivel" id="acerto-nivel" placeholder="% de acerto mínima" required>
                    <input type="url" name="url-nivel" id="url-nivel" placeholder="URL da imagem do nível" required>
                    <textarea name="descricao-nivel" minlength="30" id="descricao-nivel" cols="30" rows="10" placeholder="Descrição do nível" required></textarea>
                </div>
            </li>
        `;
    }
}

function fillQuizzLevels(event) {
    event.preventDefault();
    const levelNodes = document.querySelectorAll('.criacao-niveis .pergunta-info');

    const levelList = [];
    for (i=0; i<levelNodes.length; i++) {
        const node = levelNodes[i];
        
        const level = {
            title: node.querySelector('#titulo-nivel').value,
            image: node.querySelector('#url-nivel').value,
            text: node.querySelector('#descricao-nivel').value,
            minValue: parseInt(node.querySelector('#acerto-nivel').value)
        };

        levelList.push(level);
    }
    if (validateLevelInputs(levelList)) {
        createdQuizz.levels = levelList;
        sendQuizz();
    } else {
        alert('Preencha os dados corretamente');
    }
}

function validateLevelInputs(levelList) {
    for (let i=0; i<levelList; i++) {
        const level = levelList[i];
        const validTitle = level.title.length >= 10;
        const validMin = level.minValue >= 0 && level.minValue <= 100 && Number.isInteger(level.minValue);
        const validText = level.text.length >= 30;

        if (!(validTitle && validMin && validText)) return false;
    }

    const haveZero = levelList.find(level => level.minValue === 0);
    const notZero = levelList.find(level => level.minValue !== 0);
    if (haveZero && notZero) {
        return true;
    } else return false;
}

function sendQuizz() {
    const promise = axios.post(`${QUIZZ_API}/quizzes`, createdQuizz);
    promise.then((response) => {
        console.log(response.data);
        const quizzString = JSON.stringify(response.data); 
        const idQuizz = JSON.stringify(response.data.id);
        localStorage.setItem(idQuizz, quizzString); 
 
        renderSucess(response.data);        
    });
    promise.catch((error) => {
        console.log(error.response);
    });
}

function renderSucess(quizz) {
    document.querySelector('.criacao-niveis').classList.toggle('escondido');
    document.querySelector('.criacao-sucesso').classList.toggle('escondido');

    const sucess = document.querySelector('.criacao-sucesso');
    sucess.innerHTML = `
        <div class="criacao-titulo">
            <h2>Seu quizz está pronto!</h2>
        </div>
        <div class="quizz-thumb" onclick="renderCreatedQuizz()">
            <img src="${quizz.image}" alt="">
            <p>${quizz.title}</p>
            <span class="id escondido">${quizz.id}</span>
        </div>
        <div class="container-botoes">
            <button class="botao-vermelho" onclick="renderCreatedQuizz()">Acessar Quizz</button>
            <button class="botao-home" onclick="backHome()">Voltar pra home</button>
        </div>        
    `;
}

function renderCreatedQuizz() {
    document.querySelector('.criacao-sucesso').classList.toggle('escondido');
    renderizaTela02(createdQuizz);
}

function pegaQuizzCriado (){
    for ( let i = 0; i < localStorage.length; i++ ) {
        listaIDMeusQuizzes.push(localStorage.key(i));
    }
    listaIDMeusQuizzes = listaIDMeusQuizzes.sort( function (a,b){return a - b});
}

function listaMeusQuizzes(){
    for (let i = 0; i < listaIDMeusQuizzes.length; i++ ){
        meusQuizzes.push((JSON.parse(localStorage.getItem(listaIDMeusQuizzes[i]))));
        listaId.push(meusQuizzes[i].id)
    }
    console.log(meusQuizzes)
}

function renderizaTodosOsMeusQuizzes(todosQuizzesUsuario){

    for (let i = 0; i < meusQuizzes.length; i++){
        todosQuizzesUsuario.innerHTML += `
        <li class="quizz-thumb" onclick = "clicouQuizzUsuario(this)" data-identifier="quizz-card">
        <img src="${meusQuizzes[i].image}" alt="">
        <p>${meusQuizzes[i].title} <span class = "id escondido">${meusQuizzes[i].id}</span></p> 
        </li>
    `
    }
}

function clicouQuizzUsuario(elemento){
    const id = elemento.querySelector('.id');
    const idNumero = parseInt(id.innerText);
    renderizaQuizzUsuarioCLicado(idNumero);
}

function renderizaQuizzUsuarioCLicado(id) {
    for (let i = 0; i < meusQuizzes.length; i++) {
        if (id === meusQuizzes[i].id) {
            renderizaTela02(meusQuizzes[i]);
        }
    }
}

pegaQuizzCriado();
listaMeusQuizzes();
pegarDadosAPI();
