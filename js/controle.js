/*
 O html do jogo é simplesmente um body com uma div chamada "palco"
 Quando a pagina carrega, ela carrega as tags <script> que contém os arquivos de javascript que geram o jogo
 Quando os scripts são carregados é criado uma div "menu" e seu conteudo
 Através das interações com os botões o html é gerado e destruido dinamicamente pelo javscript

 O css está sendo usado de maneira mista tanto inline (dentro do html) como por arquivos externos (css)
 */

var background = document.createElement("AUDIO");
//background.setAttribute("src", "audio/palavraCerta.mp3");

var audioTeclas = document.createElement("AUDIO");
audioTeclas.setAttribute("src", "audio/efeitoTeclas.wav");
audioTeclas.volume = 0.4;
//background.loop = true
var origemMenu;
var origemDerrota;
var opcao;
var estado;
var realizaLeitura = false;
var pulouMenu;
var pulouDerrota;
var pulouVitoria;

function criarCamadaMenu()
{	
	pulouMenu = false;
	estado = "menu";
	opcao = 0;

	if(origemDerrota){
		background.currentTime = 0
	}
	origemDerrota = 0
	background.play()

	var el = document.createElement("div");
	el.setAttribute("id", "camadaMenu");
	el.setAttribute("tabIndex", "0");
	$("#palco").append(el);


	var imgMenu = document.createElement("div");
	imgMenu.setAttribute("id", "imgMenu");
	el.appendChild(imgMenu);


	var caixaBotoes = document.createElement("div");
	caixaBotoes.setAttribute("id", "caixaBotoes");
	el.appendChild(caixaBotoes);

	//Cria botao de instruções e adiciona a caixa de botões
	var botaoInstrucoes = document.createElement("div");
	botaoInstrucoes.setAttribute("id", "btnInstrucoes");
	botaoInstrucoes.setAttribute("tabIndex" , "-1");
	botaoInstrucoes.setAttribute("class" , "botao");
	caixaBotoes.appendChild(botaoInstrucoes);
	
	botaoInstrucoes.onclick = function()
	{
		ativarBotaoInstrucoes();
	}
	botaoInstrucoes.onmouseenter = function()
	{
		botaoInstrucoes.focus();
		opcao = 0;
		clearTimeout(delayInicializaFocus);
	}

	var botaoJogar = document.createElement("div");
	botaoJogar.setAttribute("id" , "btnJogar");
	botaoJogar.setAttribute("tabIndex" , "-1");
	botaoJogar.setAttribute("class" , "botao");
	caixaBotoes.appendChild(botaoJogar);


	botaoJogar.onclick = function()
	{
		ativarBotaoJogar();
	}
	botaoJogar.onmouseenter = function()
	{
		botaoJogar.focus();
		opcao = 1;
		clearTimeout(delayInicializaFocus);
	}

	//Cria botao de créditos na caixa de botoes
	var botaoCreditos = document.createElement("div");
	botaoCreditos.setAttribute("id" , "btnCreditos");
	botaoCreditos.setAttribute("tabIndex" , "-1");
	botaoCreditos.setAttribute("class" , "botao");
	caixaBotoes.appendChild(botaoCreditos);


	botaoCreditos.onclick = function()
	{
		ativarBotaoCreditos();
	}
	botaoCreditos.onmouseenter = function()
	{
		botaoCreditos.focus();
		opcao = 2;
		clearTimeout(delayInicializaFocus);
	}
	
	inicializaFalaInicial();
	inicializaFocus();


	$("#camadaMenu").keydown(function (e){
		selecionaOpcao(e);	
	
		switch (opcao){
			case 0:
				document.getElementById("btnInstrucoes").focus();
				break;
			case 1:
				document.getElementById("btnJogar").focus();
				break;
			case 2:
				document.getElementById("btnCreditos").focus();
				break;
		}
	})

	origemMenu = 1
}

function ativarBotaoJogar()
{
	clearTimeout(delayInicializaFocus);
	destruirCamadaMenu();
	criarCamadaJogo();
}

function ativarBotaoInstrucoes()
{
	clearTimeout(delayInicializaFocus);
	destruirCamadaMenu();
	criarCamadaInstrucoes();
}

function ativarBotaoCreditos()
{
	clearTimeout(delayInicializaFocus);
	destruirCamadaMenu();
	criarCamadaCreditos();
}

function ativarBotaoReiniciar()
{
	clearTimeout(delayInicializaFocus);
	destruirCamadaDerrota();
	destruirCamadaJogo();
	sendData(jogo.pontos, jogo.pontosParciais , false, jogo.erros, jogo.fase, jogo.faseId,jogo.bd.length, false);
	//salvaPontuacao(jogo.nome, pontos);
	iniciarNovoJogo();
	criarCamadaJogo();
}

function ativarBotaoSair()
{
	clearTimeout(delayInicializaFocus);
	destruirCamadaVitoria();
	destruirCamadaDerrota();
	destruirCamadaJogo();
	sendData(jogo.pontos, jogo.pontosParciais , false, jogo.erros, jogo.fase, jogo.faseId,jogo.bd.length, false);
	//salvaPontuacao(jogo.nome, pontos);
	iniciarNovoJogo();
	criarCamadaMenu();
}

function ativarProxPalavra()
{
	clearTimeout(delayInicializaFocus);
	sendData(jogo.pontos, jogo.pontosParciais , false, jogo.erros, jogo.fase, jogo.faseId,jogo.bd.length, false);
	destruirCamadaVitoria();
	criarCamadaJogo();
	//salvaPontuacao(jogo.nome, pontos);	
}

function destruirCamadaMenu()
{
	$("#camadaMenu").remove();
}

function criarCamadaJogo()
{
	if(!origemMenu){
		background.currentTime = 0
	}
	origemMenu = 0
	background.play()

	var el = document.createElement("div");
	el.setAttribute("id", "camadaJogo");
	$("#palco").append(el);

	iniciar();
	//leituraDica();
	var texto = jogo.dicaPalavra + ". " + tamanhoPalavraSemEspaco() + " letras.";
	testeLeitura(texto);
}

function destruirCamadaJogo()
{
	$("#camadaJogo").remove();
	background.pause()
}

var audioCreditos = document.createElement("AUDIO");
audioCreditos.setAttribute("src", "audio/creditostxt.mp3");
audioCreditos.currentTime = 0

function criarCamadaCreditos()
{
	var texto = "Créditos. Coordenação. Delano Medeiros Beder. Joice Lee Otsuka. Equipe. Marcelo Lopes Lotufo. Murilo Dell Agnolo Garcia. Luiz Valério Neto. Henrique Souza Barros. Kátia Carnier. Rafaela Ferraz Majaron. Diana Gomes Ragnole Silva. Catarine Santana Ohnuma."
	testeLeitura(texto);

	/*audioCreditos.currentTime = 0
	audioCreditos.play();*/
	estado = "creditos";

	var el = document.createElement("div");
	el.setAttribute("id", "camadaCreditos");
	$("#palco").append(el);

	var para = $('<br>').appendTo(el);
	var para = $('<br>').appendTo(el);
	var para = $('<br>').appendTo(el);

	var para = document.createElement("h1");
	para.innerHTML = "Créditos";
	el.appendChild(para);

	var para = document.createElement("h1");
	para.innerHTML = "Coordenação";
	el.appendChild(para);

	var coord = document.createElement("div");
	el.appendChild(coord);

	var colLeft = document.createElement("div");
	colLeft.setAttribute("style", "width: 250px; float: left;  text-align: right;");
	coord.appendChild(colLeft);

	var para = document.createElement("p");
	para.innerHTML = "Delano Medeiros Beder";
	colLeft.appendChild(para);

	var colRight = document.createElement("div");
	colRight.setAttribute("style", "width: 250px; float: right; text-align: left;");
	coord.appendChild(colRight);

	var para = document.createElement("p");
	para.innerHTML = "Joice Lee Otsuka";
	colRight.appendChild(para);

	var para = document.createElement("h1");
	para.innerHTML = "Equipe";
	el.appendChild(para);

	var equipe = document.createElement("div");
	el.appendChild(equipe);

	var colLeft = document.createElement("div");
	colLeft.setAttribute("style", "width: 250px; float: left;  text-align: right;");
	equipe.appendChild(colLeft);

	var para = document.createElement("p");
	para.innerHTML = "Marcelo Lopes Lotufo";
	colLeft.appendChild(para);

	var para = document.createElement("p");
	para.innerHTML = "Murilo Dell Agnolo Garcia";
	colLeft.appendChild(para);

	var para = document.createElement("p");
	para.innerHTML = "Luiz Valério Neto";
	colLeft.appendChild(para);

	var para = document.createElement("p");
	para.innerHTML = "Henrique Souza Barros";
	colLeft.appendChild(para);

	var colRight = document.createElement("div");
	colRight.setAttribute("style", "width: 250px; float: right; text-align: left;");
	equipe.appendChild(colRight);

	var para = document.createElement("p");
	para.innerHTML = "Kátia Carnier";
	colRight.appendChild(para);
	var para = document.createElement("p");
	para.innerHTML = "Rafaela Ferraz Majaron";
	colRight.appendChild(para);
	var para = document.createElement("p");
	para.innerHTML = "Diana Gomes Ragnole Silva";
	colRight.appendChild(para);
	var para = document.createElement("p");
	para.innerHTML = "Catarine Santana Ohnuma";
	colRight.appendChild(para);


	var caixaBotoes = document.createElement("div");
	caixaBotoes.setAttribute("id", "caixaBotoes");
	el.appendChild(caixaBotoes);


	var botaoMenu = document.createElement("div");
	botaoMenu.setAttribute("id" , "btnMenu");
	botaoMenu.setAttribute("tabIndex" , "-1");
	botaoMenu.setAttribute("class" , "botao");
	caixaBotoes.appendChild(botaoMenu);

	botaoMenu.onmousedown = function()
	{
		destruirCamadaCreditos();
		criarCamadaMenu();
	}
	/*botaoMenu.onmouseenter = function()
	{
		testeLeitura("Menu");
		//AudioBotoes("audio/menu.mp3");
	}*/
	document.onkeydown = function(e)
	{
		e = window.event||e;
		if((e.which == 27 || e.keyCode == 27 || e.charCode == 24) && estado == "creditos")
		{
			destruirCamadaCreditos();
			criarCamadaMenu();
		}
	}
}

function destruirCamadaCreditos()
{
	//audioCreditos.pause()
	pararLeitura()
	$("#camadaCreditos").remove();
}

var audioVit = document.createElement("AUDIO");
audioVit.setAttribute("src", "audio/frasevitoria.mp3");

var audioVitP = document.createElement("AUDIO");
vitoria2 = false
function criarCamadaVitoria()
{
	estado = "vitoria";
	opcao = 0;
	pulouVitoria = false;
	/*vitoria1 = setTimeout(function(){
		audioVit.currentTime = 0
		audioVit.volume = 1
		audioVit.play();
	}, 3000);*/
	vitoria2 = setTimeout(function(){
		/*var txt = "audio/" + numeroSorteado() + ".mp3"
		audioVitP.setAttribute("src", txt);
		audioVitP.currentTime = 0
		audioVitP.volume = 1
		audioVitP.play();*/
		var texto = "Você acertou, a palavra é: " + jogo.palavraSorteada;
		testeLeitura(texto);
	}, 3800);

	var audio = document.createElement("AUDIO");
	audio.setAttribute("src", "audio/vitoria2.ogg");
	//var audio = document.getElementById("vitoria"); 
	audio.currentTime = 0
	setTimeout(function(){
		audio.play();
	}, 500);

	var fase;
	var faseId;
	var el = document.createElement("div");
	el.setAttribute("id", "camadaVitoria");
	el.setAttribute("tabIndex", "0");
	$("#palco").append(el);

	/*if((jogo.bdTamanho) == 0) {
		$('<p>').attr('id', 'pontosNaTela')
			.html('Pontos: ' + parseInt(jogo.pontos))
			.appendTo($('#camadaVitoria'));
	}*/

	jogo.palavraNaTela = document.createElement("p");
	jogo.palavraNaTela.setAttribute("id", "palavraNaTela");
	jogo.palavraNaTela.setAttribute("tabIndex", "2");
	jogo.palavraNaTela.setAttribute("role", "textbox");
	jogo.palavraNaTela.innerHTML = "<h2> Você acertou! </h2> <br> A palavra é " + jogo.palavraSorteada;

	jogo.imgBonecoVitoria = document.createElement("div");
	jogo.imgBonecoVitoria.setAttribute("id", "imgBonecoVitoria");

	jogo.botoesVitoria = document.createElement("div");
	jogo.botoesVitoria.setAttribute("id", "botoesTelaVitoria");
	
	$("#camadaVitoria").append(jogo.palavraNaTela);
	$("#camadaVitoria").append(jogo.imgBonecoVitoria);
	$("#camadaVitoria").append(jogo.botoesVitoria);

	$("<button>").attr("id", "btnProxPalavra").click(
		function(){
			ativarProxPalavra();	
		}
	).appendTo($("#botoesTelaVitoria"));
	/*document.getElementById("btnProxPalavra").onfocus = function()
	{
		AudioBotoes("audio/proxima.mp3");
	}*/
	document.getElementById("btnProxPalavra").onmouseenter = function()
	{
		document.getElementById("btnProxPalavra").focus();
		opcao = 0;
		clearTimeout(delayInicializaFocus);
	}

	$("<button>").attr("id", "btnMenu").click(
		function(){
			ativarBotaoSair();
		}
	).appendTo($("#botoesTelaVitoria"));
	document.getElementById("btnMenu").onmouseenter = function()
	{
		document.getElementById("btnMenu").focus();
		opcao = 1;
		clearTimeout(delayInicializaFocus);
	}

	document.addEventListener("keyup", proximaFase);

	inicializaFocus();

	$("#camadaVitoria").keydown(function (e){
		selecionaOpcao(e);	
	
		if(opcao == 0){
			document.getElementById("btnProxPalavra").focus();
		}
		else if(opcao == 1){
			document.getElementById("btnMenu").focus();
		}
		//console.log(opcao);
	})
}

function proximaFase(e)
{
	e.preventDefault();

	if(e.keycode == 32 || e.which == 32 || e.charcode == 32)
	{
		sendData(jogo.pontos, jogo.pontosParciais , false, jogo.erros, jogo.fase, jogo.faseId,jogo.bd.length, false);
		destruirCamadaVitoria();
		criarCamadaJogo();
	}
}

function destruirCamadaVitoria()
{
	//clearTimeout(vitoria1)
	clearTimeout(vitoria2)
	audioVit.pause()
	audioVitP.pause()
	document.removeEventListener("keyup", proximaFase);
	$("#camadaVitoria").remove();
}

function criarCamadaFimdeJogo()
{
	estado = "fimdeJogo";
	var audio = document.createElement("AUDIO");
	audio.setAttribute("src", "audio/vitoria1.ogg");
	//var audio = document.getElementById("vitoria"); 
	audio.currentTime = 0;
	setTimeout(function(){
		audio.play();
	}, 500);

	var fase;
	var faseId;
	var el = $('<div>').attr("id", "camadaFimdeJogo").appendTo($("#palco"));
	/*$('<p>').attr('id', 'pontosNaTela')
		.html('Pontos: ' + parseInt(jogo.pontos))
		.appendTo($('#camadaFimdeJogo'));*/

	jogo.palavraNaTela = document.createElement("p");
	jogo.palavraNaTela.setAttribute("id", "palavraNaTela");
	jogo.palavraNaTela.setAttribute("tabIndex", "2");
	jogo.palavraNaTela.setAttribute("role", "textbox");
	jogo.palavraNaTela.innerHTML = "<h2> Parabéns! Você escapou da forca! </h2><h3>Pontuação final: "+jogo.pontos + "</h3> A palavra é " + jogo.palavraSorteada;

	jogo.imgBonecoVitoria = document.createElement("div");
	jogo.imgBonecoVitoria.setAttribute("id", "imgBonecoVitoria");

	jogo.botoesVitoria = document.createElement("div");
	jogo.botoesVitoria.setAttribute("id", "botoesTelaVitoria");

	$("#camadaFimdeJogo").append(jogo.palavraNaTela);
	$("#camadaFimdeJogo").append(jogo.imgBonecoVitoria);
	$("#camadaFimdeJogo").append(jogo.botoesVitoria);

	/*jogo.fimdeJogo = document.createElement("p");
	jogo.fimdeJogo.setAttribute("id", "fimdeJogo");
	jogo.fimdeJogo.setAttribute("tabIndex", "3");
	jogo.fimdeJogo.setAttribute("role", "textbox");
	jogo.fimdeJogo.innerHTML = "Tela de Fim de Jogo"
	$("#camadaFimdeJogo").append(jogo.fimdeJogo);*/

	$("<button>").attr("id", "btnMenu").click(
		function(){
			sendData(jogo.pontos, jogo.pontosParciais , false, jogo.erros, jogo.fase, jogo.faseId,jogo.bd.length, false);
			destruirCamadaFimdeJogo();
			//salvaPontuacao(jogo.nome, pontos);
			criarCamadaMenu();
			iniciarNovoJogo();	
		}
	).appendTo($("#botoesTelaVitoria"));
	/*document.getElementById("btnMenu").onmouseenter = function()
	{
		testeLeitura("Menu");
		//AudioBotoes("audio/menu.mp3");
	}*/

	inicializaFocus();
	/*$('<div>').css({
		'position': 'absolute',
		'width': '800px',
		'height': '600px',
		'background-image': 'url("imgs/vitoria.png")'})
	.click(function(){
			sendData(jogo.pontos, jogo.pontosParciais , true, jogo.erros, jogo.fase, jogo.faseId, jogo.bd.length, false);
			destruirCamadaFimdeJogo();
			criarCamadaMenu();
			iniciarNovoJogo();
	})
	.appendTo(el);*/

	document.onkeydown = function(e)
	{
		e = window.event||e;
		var setas = e.which || e.keyCode || e.charCode;
		if((setas == 37 || setas == 39) && estado == "fimdeJogo")
		{
			AudioBotoes("audio/menu.mp3");
		}
	}

	document.addEventListener("keyup", fimdeJogoMenu);
}

function fimdeJogoMenu(e){
	e.preventDefault();

	if(e.keyCode == 32)
	{
		sendData(jogo.pontos, jogo.pontosParciais , true, jogo.erros, jogo.fase, jogo.faseId, jogo.bd.length, false);
		destruirCamadaFimdeJogo();
		criarCamadaMenu();
		iniciarNovoJogo();
	}
}

function destruirCamadaFimdeJogo()
{
	$("#camadaFimdeJogo").remove();
	document.removeEventListener("keyup", fimdeJogoMenu);
}

var audioDer = document.createElement("AUDIO");
audioDer.setAttribute("src", "audio/frasederrota.mp3");
var pontfinal = document.createElement("AUDIO");
pontfinal.setAttribute("src", "audio/pontuacaofinal.mp3");

derrota1 = false
derrota2 = false
derrota3 = false
derrota4 = false
derrota5 = false
derrota6 = false
derrota7 = false
derrota8 = false
derrota9 = false
derrota10 = false

function criarCamadaDerrota()
{
	estado = "derrota";
	opcao = 0;
	pulouDerrota = false;
	/*derrota1 = setTimeout(function(){
		audioDer.currentTime = 0
		audioDer.play()
	}, 3000);
	derrota2 = setTimeout(function(){
		var txt = "audio/" + numeroSorteado() + ".mp3"
		audioVitP.setAttribute("src", txt);
		audioVitP.currentTime = 0
		audioVitP.play();
	}, 5300);
	derrota3 = setTimeout(function(){
		pontfinal.currentTime = 0
		pontfinal.play()
	}, 7300);*/

	derrota1 = setTimeout(function(){
		testeLeitura("Você errou. A palavra correta é: " + jogo.palavraSorteada + ". Pontuação final: "+pontuacao())
	}, 3000);

	/*var aux
	var centena
	
	derrota4 = setTimeout(function(){
		if(pontuacao() <= 20 || (pontuacao() % 10 == 0 && pontuacao() < 100) || (pontuacao() % 100 == 0 && pontuacao() > 100) || pontuacao() == 1000){
			unidade = "audio/p" + pontuacao() + ".mp3"
			unidadeLer.setAttribute("src", unidade)
			unidadeLer.currentTime = 0
			unidadeLer.play()
		}
		else if(pontuacao() <= 99)
		{
			unidade = pontuacao()%10
			dezena = pontuacao() - unidade

			aux = "audio/p" + dezena + ".mp3"
			dezenaLer.setAttribute("src", aux)
			dezenaLer.currentTime = 0
			dezenaLer.play()

			derrota5 = setTimeout(function(){
				letraE.setAttribute("src", "audio/letraE.mp3")
				letraE.currentTime = 0;
				letraE.play();
			}, 600)

			derrota6 = setTimeout(function(){
				aux = "audio/p" + unidade + ".mp3"
				unidadeLer.setAttribute("src", aux)
				unidadeLer.currentTime = 0;
				unidadeLer.play();
			}, 800)
		}
		else if(pontuacao() == 100){
			unidadeLer.setAttribute("src", "audio/pcem.mp3")
			unidadeLer.currentTime = 0
			unidadeLer.play()
		}
		else
		{
			unidade = pontuacao()%10
			dezena = pontuacao()%100 - unidade
			centena = pontuacao() - unidade - dezena

			aux = "audio/p" + centena + ".mp3"
			centenaLer.setAttribute("src", aux)
			centenaLer.currentTime = 0
			centenaLer.play()

			var aux2 = pontuacao() - centena
			if(aux2 >= 20)
			{
				if(dezena != 0){
					derrota7 = setTimeout(function(){
						letraE.setAttribute("src", "audio/letraE.mp3")
						letraE.currentTime = 0;
						letraE.play();
					}, 600)
				}

				derrota8 = setTimeout(function(){
					aux = "audio/p" + dezena + ".mp3"
					dezenaLer.setAttribute("src", aux)
					dezenaLer.currentTime = 0
					dezenaLer.play()
				}, 800)

				if(unidade != 0){
					derrota9 = setTimeout(function(){
						letraE.setAttribute("src", "audio/letraE.mp3")
						letraE.currentTime = 0;
						letraE.play();
					}, 1200)

					derrota10 = setTimeout(function(){
						aux = "audio/p" + unidade + ".mp3"
						unidadeLer.setAttribute("src", aux)
						unidadeLer.currentTime = 0;
						unidadeLer.play();
					}, 1500)
				}
			}
			else
			{
				derrota7 = setTimeout(function(){
					letraE.setAttribute("src", "audio/letraE.mp3")
					letraE.currentTime = 0;
					letraE.play();
				}, 600)
				derrota8 = setTimeout(function(){
					aux = "audio/p" + aux2 + ".mp3"
					unidadeLer.setAttribute("src", aux)
					unidadeLer.currentTime = 0;
					unidadeLer.play();
				}, 800)
			}
		}
	}, 8300)*/

	var audio = document.createElement("AUDIO");
	audio.setAttribute("src", "audio/derrota1.ogg");
	//var audio = document.getElementById("derrota"); 
	setTimeout(function(){
		audio.play();
	}, 500);
	origemDerrota = 1

	var fase;
	var faseId;
	//var pontos = jogo.pontos;

	var el = document.createElement("div");
	el.setAttribute("id", "camadaDerrota");
	el.setAttribute("tabIndex", "0");
	$("#palco").append(el);

		
	jogo.imgBoneco = document.createElement("div");
	jogo.imgBoneco.setAttribute("id", "imgBonecoDerrota");

	jogo.palavraNaTela = document.createElement("p");
	jogo.palavraNaTela.setAttribute("id", "palavraNaTela");
	jogo.palavraNaTela.setAttribute("role", "textbox");
	jogo.palavraNaTela.innerHTML = "<h2> Você errou :( </h2> A palavra correta é " + jogo.palavraSorteada;
	
	jogo.botoes = document.createElement("div");
	jogo.botoes.setAttribute("id", "botoesFimDeJogo");

	jogo.jogadorPontos = document.createElement("p");
	jogo.jogadorPontos.setAttribute("id", "jogadorPontos");
	jogo.jogadorPontos.innerHTML = "Pontuação final: " + parseInt(jogo.pontos);


	$("#camadaDerrota").append(jogo.imgBoneco);
	$("#camadaDerrota").append(jogo.palavraNaTela);
	$("#camadaDerrota").append(jogo.jogadorPontos);
	$("#camadaDerrota").append(jogo.botoes);


	//criando botoes clicáveis
	
	$("<button>").attr("id", "btnReiniciar").click(
		function(){
			ativarBotaoReiniciar();	
		}
	).appendTo($("#botoesFimDeJogo"));
	document.getElementById("btnReiniciar").onmouseenter = function()
	{
		document.getElementById("btnReiniciar").focus();
		opcao = 0;
		clearTimeout(delayInicializaFocus);
	}

	$("<button>").attr("id", "btnMenu").click(
		function(){
			ativarBotaoSair();	
		}
	).appendTo($("#botoesFimDeJogo"));
	document.getElementById("btnMenu").onmouseenter = function()
	{
		document.getElementById("btnMenu").focus();
		opcao = 1;
		clearTimeout(delayInicializaFocus);
	}

	document.addEventListener("keyup", derrotaMenu);

	inicializaFocus();

	$("#camadaDerrota").keydown(function (e){
		selecionaOpcao(e);	
		//console.log(opcao);
	
		if(opcao == 0){
			document.getElementById("btnReiniciar").focus();
		}
		else if(opcao == 1){
			document.getElementById("btnMenu").focus();
		}
	})
}

function derrotaMenu(e){
	e.preventDefault();

	if(e.keycode == 32 || e.charcode == 32 || e.which == 32)
	{
		sendData(jogo.pontos, jogo.pontosParciais , false, jogo.erros, jogo.fase, jogo.faseId,jogo.bd.length, false);
		destruirCamadaDerrota();
		destruirCamadaJogo();
		criarCamadaMenu();	
	}
}

function destruirCamadaDerrota()
{
	clearTimeout(derrota1)

	pararLeitura()

	document.removeEventListener("keyup", derrotaMenu);
	$("#camadaDerrota").remove();
}

function criarCamadaRanking()
{
	$('<div>').attr('id', 'camadaRanking')
		.css({
			'width': '800px',
			'height': '600px',
			'position': 'absolute',
			'top': '0px'
		})
		.click(function(){
			destruirCamadaRanking();
			criarCamadaMenu();
		})
		.appendTo($('#palco'));

	var colRank = $('<div>').css({
			'width': '250px',
			'position': 'absolute',
			'text-align': 'center',
			'top': '36%',
			'left': '1%'
		})
		.appendTo($('#camadaRanking'));

	$('<p>').html('Ranking').appendTo(colRank);

	for (i = 0; i < ranking.length; i++) {
		$('<p>').html((i+1) + '.').appendTo(colRank);
	}

	var colNome = $('<div>').css({
			'width': '340px',
			'position': 'absolute',
			'text-align': 'center',
			'top': '36%',
			'left': '15%'
		})
		.appendTo($('#camadaRanking'));

	$('<p>').html('Nome').appendTo(colNome);

	for (i = 0; i < ranking.length; i++) {
		$('<p>').html(ranking[i]["jogador"]).appendTo(colNome);
	}

	var colPontuacao = $('<div>').css({
			'width': '100px',
			'position': 'absolute',
			'text-align': 'center',
			'top': '36%',
			'left': '400px'
		})
		.appendTo($('#camadaRanking'));

	$('<p>').html('Pontuação').appendTo(colPontuacao);

	for (i = 0; i < ranking.length; i++) {
		$('<p>').html(ranking[i]["pontos"]).appendTo(colPontuacao);
	}

	var colData = $('<div>').css({
			'width': '210px',
			'position': 'absolute',
			'text-align': 'center',
			'top': '36%',
			'left': '530px'
		})
		.appendTo($('#camadaRanking'));

	$('<p>').html('Data').appendTo(colData);

	for (i = 0; i < ranking.length; i++) {
		$('<p>').html(formataData(ranking[i]["data"])).appendTo(colData);
	}
}

function formataData(strData)
{
	var data = new Date(strData);
	var v = data.getDate();
	var s = (v < 10 ? '0' + v : v) + "/";
	v = data.getMonth() + 1;
	s += (v < 10 ? '0' + v: v) + "/";
	s += data.getFullYear() + " ";
	v = data.getHours();
	s += (v < 10 ? '0' + v: v) + ":";
	v = data.getMinutes();
	s += (v < 10 ? '0' + v: v) + ":";
	v = data.getSeconds();
	s += (v < 10 ? '0' + v: v);
	return s;
}

function destruirCamadaRanking()
{
	$("#camadaRanking").remove();
}

function criarCamadaInstrucoes()
{
	var texto = "Instruções. Escape da forca acertando todos os desafios! Para isso, você deve decifrar qual palavra corresponde à dica. Cada letra que você acerta é colocada na palavra. A ";
	texto += "cada vez que você erra, uma parte do corpo é colocada na forca. Se errar cinco letras da mesma palavra, você perde e tem que recomeçar. A ";
	texto += "cada palavra que você acerta, você ganha dez pontos; porém, para cada letra que erra, perde um ponto. Você pode jogar usando o teclado do jogo ou o seu próprio";
	texto += " teclado. Atalhos sonoros: Para usá-los, pressione os números no seu teclado";
	texto += " alfanumérico. 1. Ouça a dica. 2. Ouça o que você descobriu da palavra até agora. 3. Saiba quantas vidas você ainda tem. 4. Relembre as letras que você já";
	texto += " escolheu. 5. Saiba sua pontuação atual. Esc. Voltar para o menu";
	testeLeitura(texto);

	estado = "instrucoes"

	var el = document.createElement("div");
	el.setAttribute("id", "camadaInstrucoes");
	el.setAttribute("tabIndex", "0");
	$("#palco").append(el);

	var imgLogo = document.createElement("div");
	imgLogo.setAttribute("id", "imgLogoInstrucoes");
	el.appendChild(imgLogo);

	//criação camada de instruções
	//$('<div>').attr('id', 'camadaInstrucoes').appendTo($('#palco'));

	//conteúdo instruções
	jogo.instrucoes = document.createElement("p")
	jogo.instrucoes.setAttribute("id", "instrucoesText")
	jogo.instrucoes.innerHTML = 
	"<h1>Instruções</h1> <h3>Escape da forca acertando todos os desafios!</h3> <br>Para isso, você deve decifrar qual palavra corresponde à dica. <br>"+
	 "Cada letra que você acerta é colocada na palavra. <br>"+
	 "A cada vez que você erra, uma parte do corpo é colocada na forca. <br>Se errar cinco letras da mesma palavra, você perde e tem que recomeçar. <br>"+
	 "A cada palavra que você acerta, você ganha dez pontos; porém, para cada letra que erra, perde um ponto."+
	 "<br>Você pode jogar usando o teclado do jogo ou o seu próprio teclado.<br><br>"+
	 "<h3>Atalhos sonoros:</h3><br>"+
	 "Para usá-los, pressione os números no seu teclado alfanumérico.<br>"+
	 "1 - Ouça a dica<br>"+
	 "2 - Ouça o que você descobriu da palavra até agora<br>"+
	 "3 - Saiba quantas vidas você ainda tem<br>"+
	 "4 - Relembre as letras que você já escolheu<br>"+
	 "5 - Saiba sua pontuação atual<br>"+
	 "Esc - Voltar para o menu<br>"

	//inserindo instrucoes a camada de instruções
	$('#camadaInstrucoes').append(jogo.instrucoes);	

	var caixaBotoes = document.createElement("div");
	caixaBotoes.setAttribute("id", "caixaBotoes");
	el.appendChild(caixaBotoes);

	var botaoMenu = document.createElement("div");
	botaoMenu.setAttribute("id" , "btnMenu");
	botaoMenu.setAttribute("tabIndex" , "-1");
	botaoMenu.setAttribute("class" , "botao");
	caixaBotoes.append(botaoMenu);

	botaoMenu.onclick = function()
	{
		destruirCamadaInstrucoes();
		criarCamadaMenu();
	}
	/*botaoMenu.onmouseenter = function()
	{
		testeLeitura("Menu");
		//AudioBotoes("audio/menu.mp3");
	}*/
	document.onkeydown = function(e)
	{
		e = window.event||e;
		if((e.which == 27 || e.keyCode == 27 || e.charCode == 24) && estado == "instrucoes")
		{
			destruirCamadaInstrucoes();
			criarCamadaMenu();
		}
	}
}

function destruirCamadaInstrucoes()
{
	pararLeitura();
	$("#camadaInstrucoes").remove();
}

function selecionaOpcao(e)
{
	switch(e.keyCode){
		case 13: //Enter
			paraDeFalar();
			switch(opcao){
				case 0:
					if(estado == "menu")
						ativarBotaoInstrucoes();
					else if(estado== "vitoria")
						ativarProxPalavra();
					else if(estado == "derrota")
						ativarBotaoReiniciar();
					else if(estado == "opcoes")
						ativarOpcaoContinuar();
					opcao = -1;
				break;

				case 1:
					if(estado == "menu")
						ativarBotaoJogar();
					else if(estado == "vitoria" || estadoo == "derrota")
						ativarBotaoSair();
					opcao = -1;
				break;

				case 2:
					if(estado == "menu"){
						ativarBotaoCreditos();
						opcao = -1;
					}
				break;
			}
		break;
		case 37: //ArrowLeft
			paraDeFalar();
			if(estado == "menu"){
				if(opcao > 0){
					tocaAudio();
					opcao--;
				}
				if(opcao == 0)
				{
					testeLeitura("Instruções");
					//AudioBotoes("audio/jogar.mp3");
				}
				if(opcao == 1)
				{
					testeLeitura("Jogar");
					//AudioBotoes("audio/ajuda.mp3");
				}
			}
			else if(estado == "derrota"){
				if(opcao > 0){
					tocaAudio();
					opcao--;
				}
				if(opcao == 0)
				{
					testeLeitura("Recomeçar");
					//AudioBotoes("audio/jogar.mp3");
				}
				if(opcao == 1)
				{
					testeLeitura("Menu");
					//AudioBotoes("audio/ajuda.mp3");
				}
			}
			else if(estado == "vitoria"){
				if(opcao > 0){
					tocaAudio();
					opcao--;
				}
				if(opcao == 0)
				{
					testeLeitura("Continuar");
					//AudioBotoes("audio/jogar.mp3");
				}
				if(opcao == 1)
				{
					testeLeitura("Menu");
					//AudioBotoes("audio/ajuda.mp3");
				}
			}
		break;

		case 39: //ArrowRight
			paraDeFalar();
			if(estado == "menu"){
				if(opcao < 2){
					tocaAudio();
					opcao++;
				}
				if(opcao == 1)
				{
					testeLeitura("Jogar");
					//AudioBotoes("audio/ajuda.mp3");
				}
				if(opcao == 2)
				{
					testeLeitura("Créditos");
					//AudioBotoes("audio/creditos.mp3");
				}
			}
			else if(estado == "derrota" || estado == "vitoria"){
				if(opcao < 1){
					tocaAudio();
					testeLeitura("Menu");
					//AudioBotoes("audio/menu.mp3");
					opcao++;
				}
				if(opcao == 1){
					if(estado == "derrota")
						testeLeitura("Reiniciar");
					else if(estado == "vitoria")
						testeLeitura("Continuar");
				}
				if(opcao == 1)
					testeLeitura("Menu");
			}
		break;

	}
}

function tocaAudio() {
	audioTeclas.currentTime = 0;
	audioTeclas.play();
}

function AudioBotoes(nomeAudio)
{
	var audio = document.createElement("AUDIO");
	audio.setAttribute("src", nomeAudio);
	audio.play();
}

/*
opcoes = 0 - instruções
		1 - jogar
		2 - creditos
		3 - reiniciar
		4 - sair
		5 - prox palavra
*/

var delayInicializaFocus

function inicializaFocus(){
	if(estado == "menu"){
		document.getElementById("camadaMenu").focus();
		document.getElementById("btnInstrucoes").focus();
		delayInicializaFocus = setTimeout(function(){
			if(!pulouMenu)
				testeLeitura("Instruções");
				//AudioBotoes("audio/jogar.mp3");
		}, 8000);
	}
	else if(estado == "derrota"){
		document.getElementById("camadaDerrota").focus();
		document.getElementById("btnReiniciar").focus();
		delayInicializaFocus = setTimeout(function(){
			if(!pulouDerrota)
				testeLeitura("Recomeçar");
				//AudioBotoes("audio/recomecar.mp3");
		}, 9200);
	}
	else if(estado == "vitoria"){
		document.getElementById("camadaVitoria").focus();
		document.getElementById("btnProxPalavra").focus();
		delayInicializaFocus = setTimeout(function(){
			if(!pulouVitoria)
				testeLeitura("Continuar");
				//AudioBotoes("audio/proxima.mp3");
		}, 7000);
	}
	else if(estado == "jogando"){
		document.getElementById("palavraNaTela").focus();
	}
	else if(estado == "fimdeJogo"){
		document.getElementById("camadaFimdeJogo").focus();
		document.getElementById("btnMenu").focus();
		delayInicializaFocus = setTimeout(function(){
			testeLeitura("Menu");
			//AudioBotoes("audio/menu.mp3");
		}, 7000);
	}
	else if(estado == "opcoes"){
		document.getElementById("opcaoContinuar").focus();
	}
}

function inicializaFalaInicial(){
	var txtInicial = "Bem-vindo ao jogo da Forca, navegue utilizando as teclas direcionais para esquerda ou direita e pressione enter para selecionar a opção";
	var msg = new SpeechSynthesisUtterance(txtInicial);
	msg.volume = 1; // 0 to 1
	msg.rate = 1.3; // 0.1 to 10
	msg.lang = "pt-BR";
	window.speechSynthesis.speak(msg);
}

function paraDeFalar(){
	pulouMenu = true;
	pulouDerrota = true;
	pulouVitoria = true;
	window.speechSynthesis.cancel();
}

function criarCamadaOpcoes(){

	estado = "opcoes";
	opcao = 0;


	//Cria div camada opcoes
	var el = document.createElement("div");
	el.setAttribute("id", "camadaOpcoes");
	el.setAttribute("tabIndex", 0);
	$("#palco").append(el);
	el.focus();
	/*Opcoes : ->Continuar
			   ->Áudio
			   ->Instruções
			   ->Menu*/


	//titulo

	var divOpcoes = document.createElement("div");
	divOpcoes.setAttribute("id", "divOpcoes");
	el.appendChild(divOpcoes);

	var opcoesTxt = document.createElement("p");
	opcoesTxt.setAttribute("id", "opcoesTxt");
	opcoesTxt.innerHTML = "Opções";
	divOpcoes.appendChild(opcoesTxt);

	//Cria div caixa de botoes
	var caixaBotoes = document.createElement("div");
	caixaBotoes.setAttribute("id", "caixaBotoesOpcao");
	divOpcoes.appendChild(caixaBotoes);

	//btnContinuar
	var opcoesContinuar = document.createElement("div");
	opcoesContinuar.setAttribute("id", "opcaoContinuar");
	opcoesContinuar.setAttribute("tabIndex", 0);

	//btnAudio
	var opcoesAudio = document.createElement("div");
	opcoesAudio.setAttribute("id", "opcaoAudio");
	opcoesAudio.setAttribute("tabIndex", 0);

	//btnIntrucoes
	var opcoesInstrucoes = document.createElement("div");
	opcoesInstrucoes.setAttribute("id", "opcaoInstrucoes");
	opcoesInstrucoes.setAttribute("tabIndex", 0);

	//btnMenu
	var opcoesMenu = document.createElement("div");
	opcoesMenu.setAttribute("id", "opcaoMenu");
	opcoesMenu.setAttribute("tabIndex", 0);

	//adicionando botões a caixa de botoes
	caixaBotoes.appendChild(opcoesContinuar);
	caixaBotoes.appendChild(opcoesAudio);
	caixaBotoes.appendChild(opcoesInstrucoes);
	caixaBotoes.appendChild(opcoesMenu);

	//Inicializa o foco da camada
	inicializaFocus();

	$("#camadaOpcoes").keydown(function (e){
		selecionaOpcao(e);	
	
		if(opcao == 0){
			document.getElementById("opcaoContinuar").focus();
		}
		else if(opcao == 1){
			document.getElementById("opcaoAudio").focus();
		}
		else if(opcao == 2){
			document.getElementById("opcaoInstrucoes").focus();
		}
		else if(opcao == 3){
			document.getElementById("opcaoMenu").focus();
		}
		//console.log(opcao);
	})
}

function destruirCamadaOpcoes(){
	$("#camadaOpcoes").remove();
}

function ativarOpcaoContinuar(){
	estado = "jogando";
	destruirCamadaOpcoes();
}



jogo.palco = new Palco();
jogo.palco.criar();
iniciarNovoJogo();
criarCamadaMenu();
