import { verificarTema, trocarTema } from "../../helpers/tema-helper.js";

const botaoTema = document.querySelector(".tema button")
const assunto = localStorage.getItem("assunto")
const body = document.querySelector("body")

let quiz = {}
let pontos = 0
let pergunta = 1
let resposta = ""
let idInputResposta = ""
let RespostaCorretaId = ""
botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema)
})


verificarTema(body, botaoTema)



function alterarAssunto() {
    const divIcone = document.querySelector(".assunto_icone")
    const iconeImg = document.querySelector(".assunto_icone img")
    const assuntoTitulo = document.querySelector(".assunto h1")

    divIcone.classList.add(assunto.toLowerCase())
    iconeImg.setAttribute("src", `../../assets/images/icon-${assunto.toLowerCase()}.svg`)
    iconeImg.setAttribute("alt", `icone de ${assunto}`)
    assuntoTitulo.innerText = assunto
}


async function buscarPerguntas() {
    const urlDados = "../../data.json"
     await fetch(urlDados).then(resposta => resposta.json()).then(dados => {
        dados.quizzes.forEach(dado => {
            if (dado.title === assunto) {
                quiz = dado
            }
        })
    })
    console.log(quiz)
}

function montarPergunta() {
    const main = document.querySelector("main")
    
    main.innerHTML = `
        <section class="pergunta">
            <div>
                <p>Questão ${pergunta} de 10</p>


                <h2>${alterarSinais(quiz.questions[pergunta-1].question)}</h2>
            </div>
            <div class="barra_progresso">
                <div style="width:${pergunta * 10}%"></div>
            </div>
        </section>

        <section class="alternativas">
            <form action="">
                <label for="alternativa_a">
                    <input type="radio" id="alternativa_a" name="alternativa" value="${alterarSinais(quiz.questions[pergunta-1].options[0])}">

                    <div>
                        <span>A</span>

                        ${alterarSinais(quiz.questions[pergunta-1].options[0])}
                    </div>

                </label>
                <label for="alternativa_b">
                    <input type="radio" id="alternativa_b" name="alternativa" value="${alterarSinais(quiz.questions[pergunta-1].options[1])}">

                    <div>
                        <span>B</span>
                        ${alterarSinais(quiz.questions[pergunta-1].options[1])}
                    </div>
                </label>
                <label for="alternativa_c">
                    <input type="radio" id="alternativa_c"  name="alternativa" value="${alterarSinais(quiz.questions[pergunta-1].options[2])}">

                    <div>
                        <span>C</span>
                        ${alterarSinais(quiz.questions[pergunta-1].options[2])}
                    </div>
                </label>
                <label for="alternativa_d">
                    <input type="radio" id="alternativa_d" name="alternativa" value="${alterarSinais(quiz.questions[pergunta-1].options[3])}">

                    <div>
                        <span>D</span>
                        ${alterarSinais(quiz.questions[pergunta-1].options[3])}
                    </div>
                </label>
            </form>
            <button>Enviar</button>
        </section>`
}

function alterarSinais(texto) {
    return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;")

}

function guardarReposta(evento) {
    resposta = evento.target.value
    idInputResposta = evento.target.id

    const botaoEnviar = document.querySelector(".alternativas button")
    botaoEnviar.addEventListener("click", validarResposta)
}

function validarResposta() {
    if (resposta === quiz.questions[pergunta-1].answer) {
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "correta")
        pontos = pontos + 1
    }else {
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "errada")
        document.querySelector(`label[for='${RespostaCorretaId}']`).setAttribute("id", "correta")
    }
}

async function inciar() {
    alterarAssunto()
    await buscarPerguntas()
    montarPergunta()

    const inputsResposta = document.querySelectorAll(".alternativas input")
    inputsResposta.forEach(input => {
        input.addEventListener("click", guardarReposta)

        if (input.value === quiz.questions[pergunta-1].answer) {
            RespostaCorretaId = input.id
        }
    })
}

inciar()