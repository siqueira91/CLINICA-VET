const formAgendamento = document.getElementById('form-agendamento');

formAgendamento.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const animal = document.getElementById('animal').value;
    const tipoConsulta = document.getElementById('tipoConsulta').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    // Validação de nome (implemente outras validações de acordo com a necessidade)
    if (nome.trim() === '') {
        alert('O campo "Nome" é obrigatório!');
        return;
    }

    // Validação de e-mail (expressão regular simples)
    const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+)(\.[^<>()\[\]\\.,;:\s@"]+)*)@(([\w-]+\.)+[\w-]{2,})$/i;
    if (!reEmail.test(email)) {
        alert('O e-mail informado é inválido!');
        return;
    }

    // Validação de data (permite apenas dias de segunda a sexta)
    const dataSelecionada = new Date(data);
    const diaSemana = dataSelecionada.getDay(); // 0 = domingo, 6 = sábado
    if (diaSemana === 0 || diaSemana === 6) {
        alert('Agendamentos indisponíveis aos sábados e domingos.');
        return;
    }

    // Validação de hora (permite apenas horário comercial e intervalos de 30 minutos)
    const horaSelecionada = parseInt(hora.split(':')[0]);
    const minutoSelecionado = parseInt(hora.split(':')[1]);

    if (horaSelecionada < 8 || horaSelecionada > 18 || minutoSelecionado !== 0 || minutoSelecionado !== 30) {
        alert('Atendimento disponível das 8h às 18h, com intervalos de 30 minutos.');
        return;
    }

    // Verificar disponibilidade de horário no banco de dados (implemente a lógica de acordo com seu banco de dados)
    axios.get('verificar-disponibilidade.php', {
        data: data,
        hora: hora
    })
    .then(function (response) {
        if (response.data.disponivel) {
            // Enviar dados para agendar consulta
            enviarDadosAgendamento(nome, email, animal, tipoConsulta, data, hora);
        } else {
            mostrarNotificacaoErro('Horário indisponível. Tente outro horário.');
        }
    })
    .catch(function (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        mostrarNotificacaoErro('Erro ao agendar consulta. Tente novamente mais tarde.');
    });
});

function enviarDadosAgendamento(nome, email, animal, tipoConsulta, data, hora) {
    // Implemente a lógica para enviar os dados para o servidor (via Ajax, Axios, etc.)
    // Trate os erros de comunicação e banco de dados
    // Exiba mensagens de erro para o usuário

    mostrarNotificacaoSucesso(nome, animal, data, hora, tipoConsulta, email); // Adicione o 'email' como parâmetro
}

function mostrarNotificacaoSucesso(nomeCliente, nomeAnimal, dataConsulta, horaConsulta, tipoConsulta, email) {
    const notificacao = document.getElementById('notificacao-agendamento');
    notificacao.classList.remove('erro'); // Remove classe de erro (se existir)
    notificacao.classList.add('sucesso'); // Adiciona classe de sucesso

    document.getElementById('nome-cliente').textContent = nomeCliente;
    document.getElementById('nome-animal').textContent = nomeAnimal;
    document.getElementById('data-consulta').textContent = formataData(dataConsulta);
    document.getElementById('hora-consulta').textContent = horaConsulta;
    document.getElementById('tipo-consulta').textContent = tipoConsulta;
    document.getElementById('email-consulta').textContent = email; // Adiciona campo para email

    notificacao.style.display = 'block'; // Exibe a notificação

}
