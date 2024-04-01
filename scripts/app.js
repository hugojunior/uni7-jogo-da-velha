class JogoDaVelha {
    constructor() {
        this.jogadorAtual = 'X';
        this.modo = 'jxj';
        this.jogoTerminou = false;
        this.jogoHabilitado = true;
        this.quadro = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    }

    checarStatus() {
        for (let i = 0; i < 3; i++) {
            if (this.quadro[i][0] !== '' && this.quadro[i][0] === this.quadro[i][1] && this.quadro[i][0] === this.quadro[i][2]) {
                this.marcarComoGanhador([`${i}0`, `${i}1`, `${i}2`]);
                return this.quadro[i][0];
            }
        }
        for (let i = 0; i < 3; i++) {
            if (this.quadro[0][i] !== '' && this.quadro[0][i] === this.quadro[1][i] && this.quadro[0][i] === this.quadro[2][i]) {
                this.marcarComoGanhador([`0${i}`, `1${i}`, `2${i}`]);
                return this.quadro[0][i];
            }
        }
        if (this.quadro[0][0] !== '' && this.quadro[0][0] === this.quadro[1][1] && this.quadro[0][0] === this.quadro[2][2]) {
            this.marcarComoGanhador([`00`, `11`, `22`]);
            return this.quadro[0][0];
        }
        if (this.quadro[0][2] !== '' && this.quadro[0][2] === this.quadro[1][1] && this.quadro[0][2] === this.quadro[2][0]) {
            this.marcarComoGanhador([`02`, `11`, `20`]);
            if (this.modo === 'jxj') {
                this.mostrarNotas();
            } 
            return this.quadro[0][2];
        }
        if (this.empatou()) {
            return 'empate';
        }

        return null;
    }

    marcarComoGanhador(posicao) {
        posicao.forEach(p => {
            document.querySelector(`#pos${p} .v`).classList.add('ganhou');
        });
    }

    empatou() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.quadro[i][j] === '') {
                    return false;
                }
            }
        }
        return true;
    }

    jogadaDoJogador(linha, coluna) {
        if (this.jogoTerminou) {
            return;
        }

        if (this.modo === 'jxj') {
            if (this.quadro[linha][coluna] === '') {
                this.quadro[linha][coluna] = this.jogadorAtual;
                this.desenharQuadro();
                const status = this.checarStatus();
                this.atualizarStatus(status);
                this.trocarJogador();
            }
        } else if (this.modo === 'jxc') {
            if (this.jogadorAtual === 'X' && this.quadro[linha][coluna] === '') {
                this.quadro[linha][coluna] = this.jogadorAtual;
                this.desenharQuadro();
                const status = this.checarStatus();
                this.atualizarStatus(status);
                this.trocarJogador();
                if (!this.jogoTerminou) {
                    this.jogadaDoComputador();
                }
            }
        }
    }

    atualizarStatus(status) {
        const textoDeStatus = document.getElementById("status");
        if (status === 'X' || status === 'O') {
            this.jogoTerminou = true;
            textoDeStatus.textContent = `Jogador ${status} venceu!`;
            textoDeStatus.classList.add('ganhou', 'mostrar');
        } else if (status === 'empate') {
            this.jogoTerminou = true;
            textoDeStatus.textContent = 'Jogo Empatado!';
            textoDeStatus.classList.add('empatou', 'mostrar');
        }
    }

    trocarJogador() {
        this.jogadorAtual = this.jogadorAtual === 'X' ? 'O' : 'X';
        document.querySelector('#info .jogador').textContent = `Vez do Jogador ${this.jogadorAtual}`;
    }

    atualizarModoDeJogo() {
        let info = "";

        if (this.modo === 'jxj') {
            info = "Jogador Vs Jogador (JXJ)";
        } else if (this.modo === 'jxc') {
            info = "Jogador Vs Computador (JXC)";
        } else if (this.modo === 'cxc') {
            info = "Computador Vs Computador (CXC)";
        }
        document.querySelectorAll('button').forEach((btn) => {
            btn.classList.remove('ativo');
        });
        document.querySelector(`[data-modo="${this.modo}"]`).classList.add('ativo');
        document.querySelector('#info .modo').textContent = info;
    }

    desenharQuadro() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let peso = document.getElementById(`pos${i}${j}`).querySelector('.p').textContent;
                document.getElementById(`pos${i}${j}`).innerHTML = `
                    <div class="p">${peso}</div>
                    <div class="v">${this.quadro[i][j]}</div>
                `;
            }
        }
    }

    minimax(quadro, profundidade, maximizador, jogador, oponente) {
        const status = this.checarStatus();
        if (status !== null) {
            if (status === jogador) {
                return 1; // Ganhou
            } else if (status === oponente) {
                return -1; // Perdeu
            } else {
                return 0; // Empatou
            }
        }

        if (maximizador) {
            let melhorPeso = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (quadro[i][j] === '') {
                        quadro[i][j] = jogador; // Simula jogada do jogador
                        const peso = this.minimax(quadro, profundidade + 1, false, jogador, oponente);
                        quadro[i][j] = ''; // Desfaz a jogada
                        melhorPeso = Math.max(peso, melhorPeso);
                    }
                }
            }
            return melhorPeso;
        } else {
            let melhorPeso = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (quadro[i][j] === '') {
                        quadro[i][j] = oponente; // Simula jogada do oponente
                        const peso = this.minimax(quadro, profundidade + 1, true, jogador, oponente);
                        quadro[i][j] = ''; // Desfaz a jogada
                        melhorPeso = Math.min(peso, melhorPeso);
                    }
                }
            }
            return melhorPeso;
        }
    }

    selecionarMelhorJogada(jogador, oponente) {
        let melhorPeso = -Infinity;
        let melhorJogada;
        let limparPesos = document.querySelectorAll('.quadro .p');
        limparPesos.forEach((p) => {
            p.textContent = '';
        });
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.quadro[i][j] === '') {
                    this.quadro[i][j] = jogador;
                    const peso = this.minimax(this.quadro, 0, false, jogador, oponente);
                    this.mostrarPesoDaJogada(i, j, peso);
                    this.quadro[i][j] = '';
                    if (peso > melhorPeso) {
                        melhorPeso = peso;
                        melhorJogada = { linha: i, coluna: j };
                    } else if (peso === melhorPeso) {
                        const aleatorio = Math.random();
                        if (aleatorio > 0.5) {
                            melhorPeso = peso;
                            melhorJogada = { linha: i, coluna: j };
                        }
                    }
                }
            }
        }
        return melhorJogada;
    }

    jogadaDoComputador(jogador = 'O') {
        const oponente = jogador === 'X' ? 'O' : 'X';

        let melhorJogada = this.selecionarMelhorJogada(jogador, oponente);

        if (melhorJogada) {
            this.quadro[melhorJogada.linha][melhorJogada.coluna] = jogador;
            this.desenharQuadro();
            const status = this.checarStatus();
            this.atualizarStatus(status);
            this.trocarJogador();
        }
    }

    jogarCxC() {
        if (!this.jogoTerminou && this.jogoHabilitado) {
            this.jogoHabilitado = false;
            this.jogadaDoComputador(this.jogadorAtual);
            const status = this.checarStatus();
            this.atualizarStatus(status);
            if (status === null) {
                setTimeout(() => {
                    this.jogoHabilitado = true;
                    this.jogarCxC();
                }, 2000);
            } else {
               this.jogoHabilitado = true;
            }
        }
    }

    mostrarPesoDaJogada(linha, coluna, peso = "") {
        document.querySelector(`#pos${linha}${coluna} .p`).textContent = peso;
    }

    mostrarNotas() {
        const notas = document.querySelector('.sec-notas');
        const inputRange = document.querySelector('.sec-notas input[type="range"]');
        let valorAtual = 0;
        
        setInterval(() => {
            valorAtual += 1;
            if (valorAtual > parseInt(inputRange.max)) {
                valorAtual = parseInt(inputRange.min);
            }
            inputRange.value = valorAtual;
        }, 500);

        notas.classList.add('mostrar');
    }

    reiniciarJogo() {
        this.jogadorAtual = 'X';
        this.jogoTerminou = false;
        this.quadro = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        const status = document.getElementById("status");
        status.textContent = '';
        status.classList.remove('ganhou', 'perdeu', 'empatou', 'mostrar');
        status.classList.add('esconder');

        document.querySelectorAll('.quadro .p, .quadro .v').forEach((quadro) => {
            quadro.textContent = '';
        });
        document.querySelector('#info .jogador').textContent = 'Vez do Jogador X';
        document.querySelector('.sec-notas').classList.remove('mostrar');
    }

    jogar(modo = 'jxj') {
        if (this.jogoHabilitado) {
            this.modo = modo;
            this.reiniciarJogo();
            this.atualizarModoDeJogo();
    
            if (this.modo === 'cxc') {
                this.jogarCxC();
            }
        }
    }
}

const jogo = new JogoDaVelha();
jogo.jogar();
