const QUIZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
let quizzesData = null;
let listaRespostas = [];
let arrayLevels = [];
let clicks = 0;
let acertos = 0;
let porcentagemAcertos = null;

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
    <div class="criar-quizz ">
        
    </div>

    <!-- Seus quizzes -->
    <div class="todos-os-quizzes escondido">
        <div>
            <h2>Seus Quizzes</h2>
            <ion-icon name="add-circle"></ion-icon>
        </div>
        <ul>
            <li class="quizz-thumb">
                <img src="./imagens/potter.png" alt="Simpsons imagem">
                <p>O quão Potterhead é você?</p>
            </li>
            <li class="quizz-thumb">
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
        <li class="quizz-thumb" onclick = "clicouQuizz(this)">
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
            <button class="botao-reiniciar" onclick = "restartQuizz(this)">Reiniciar Quizz</button>
            <button class="botao-home" onclick = "backHome()">Voltar pra home</button>
        </div>
    `;
    const listaPerguntas = document.querySelector('.lista-perguntas');

    const perguntasSite = data.questions;
    const levels = data.levels;

    for (let i = 0; i < perguntasSite.length; i++) {
        listaPerguntas.innerHTML +=
            `
        <li class="pergunta ">
            <div class="titulo-primeira-pergunta">
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
                <li class="resposta" onclick = "clicaResposta(this)">
                <img src="${listaRespostas[i][j].imagem}" alt="">
                <p>${listaRespostas[i][j].texto} <span class = "">${listaRespostas[i][j].acertou}</span></p>
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
    calculaAcertos(acertos, questionsArray.length);

   for (let i = 0; i < arrayLevels.length; i++){
       if (i !== arrayLevels.length - 1 && porcentagemAcertos >= Math.round(arrayLevels[i].minValue) && porcentagemAcertos <= Math.round(arrayLevels[i + 1].minValue)){
        resultado.innerHTML = `
        <div class="titulo-resultado">
            <h2>${porcentagemAcertos}% de acerto: ${arrayLevels[i].title}</h2>
        </div>
        <div class="resultado-mensagem">
            <img src="${arrayLevels[i].image}" alt="">
            <p>${arrayLevels[i].text}</p>
        </div>
        `
       }else if(i === arrayLevels.length -1 && porcentagemAcertos >= Math.round(arrayLevels[i].minValue)){
        resultado.innerHTML = `
        <div class="titulo-resultado">
            <h2>${porcentagemAcertos}% de acerto: ${arrayLevels[i].title}</h2>
        </div>
        <div class="resultado-mensagem">
            <img src="${arrayLevels[i].image}" alt="">
            <p>${arrayLevels[i].text}</p>
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


function fillQuizzInfo(event) { //use input IDs
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
            <div class="pergunta-form" onclick="toggleQuestion(this)">
                <h2>Pergunta ${i+1}</h2>
                <ion-icon name="create-outline"></ion-icon>
            </div>

            <div class="pergunta-info escondido">
                <input type="text" minlength="20" name="texto-pergunta" id="texto-pergunta" placeholder="Texto da pergunta" required value="titulo da pergunta maneira">
                <input type="text" pattern="#[0-9a-fA-F]{6}" name="cor-pergunta" id="cor-pergunta" placeholder="Cor de fundo da pergunta" required value="#123456">
                
                <label>Resposta correta</label>
                <input type="text" name="resposta-correta" id="resposta-correta" placeholder="Resposta correta" required value="resposta correta">
                <input type="url" name="url-correta" id="url-correta" placeholder="URL da imagem" required value="https://gofrag.ru/images/73/gas_station_simulator-1.jpg">
                
                <label>Respostas incorretas</label>
                <input type="text" name="resposta-incorreta" id="resposta-incorreta" placeholder="Resposta incorreta 1" required value="resposta incorreta po">
                <input type="url" name="url-incorreta" id="url-incorreta" placeholder="URL da imagem 1" required value="https://gofrag.ru/images/73/gas_station_simulator-1.jpg">
                <input type="text" name="resposta-incorreta" id="resposta-incorreta" placeholder="Resposta incorreta 2">
                <input type="url" name="url-incorreta" id="url-incorreta" placeholder="URL da imagem 2">
                <input type="text" name="resposta-incorreta" id="resposta-incorreta" placeholder="Resposta incorreta 3">
                <input type="url" name="url-incorreta" id="url-incorreta" placeholder="URL da imagem 3">
            </div>
        </li>
        `;
    }
}

function fillQuizzQuestions(event) {  /* too many loops? */
    console.log(createdQuizz);
    event.preventDefault();
    const questionNodes = document.querySelectorAll('.criacao-perguntas .pergunta-info');

    const questionsList = [];
    for (let i=0; i<quizzInfo.numQuestions; i++) {
        const inputs = questionNodes[0].querySelectorAll('input');
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

        console.log(createdQuizz);
    } else {
        alert('Preencha os dados corretamente');
    }

}

function validateQuestionInputs(questionsList) {
    console.log(questionsList);
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

function toggleQuestion(elem) {
    const questionsInfo = elem.nextElementSibling;
    questionsInfo.classList.toggle('escondido');
    elem.querySelector('ion-icon').classList.toggle('escondido');
}

function validateURL(string) {
    const regexURL = /^(http(s)?:\/\/)|(www\.)/;
    const regexImage = /\.(jpeg|jpg|png|gif|svg)$/;
    const isValid = regexURL.test(string) && regexImage.test(string);

    return isValid;
}


pegarDadosAPI();
