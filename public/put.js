function buscarDados() {
    var cpf = document.getElementById('identificadorCPF').value

    fetch('/usuarios', {
        method: 'GET'
    })
        .then(resposta => resposta.json())
        .then(dados => {
            let pessoaEncontrada = dados.find(pessoa => pessoa.cpf == cpf)

            if (pessoaEncontrada) {
                document.getElementById('identificador').value = pessoaEncontrada.id
                document.getElementById('nomeAtualizar').value = pessoaEncontrada.nome
                document.getElementById('sobrenomeAtualizar').value = pessoaEncontrada.sobrenome
                document.getElementById('emailAtualizar').value = pessoaEncontrada.email
                document.getElementById('senhaAtualizar').value = pessoaEncontrada.senha
                document.getElementById('ruaAtualizar').value = pessoaEncontrada.rua
                document.getElementById('cepAtualizar').value = pessoaEncontrada.cep
                document.getElementById('cidadeAtualizar').value = pessoaEncontrada.cidade
                document.getElementById('estadoAtualizar').value = pessoaEncontrada.estado
                document.getElementById('telefoneAtualizar').value = pessoaEncontrada.telefone
            } else {
                alert("Pessoa não encontrada")
            }
        })
}

function atualizarDados() {
    var id = document.getElementById('identificador').value

    if (!id) {
        alert('Busque um usuário primeiro.')
        return
    }

    var corpo = {
        nome: document.getElementById('nomeAtualizar').value,
        sobrenome: document.getElementById('sobrenomeAtualizar').value,
        cpf: document.getElementById('identificadorCPF').value,
        email: document.getElementById('emailAtualizar').value,
        senha: document.getElementById('senhaAtualizar').value,
        rua: document.getElementById('ruaAtualizar').value,
        cep: document.getElementById('cepAtualizar').value,
        cidade: document.getElementById('cidadeAtualizar').value,
        estado: document.getElementById('estadoAtualizar').value,
        telefone: document.getElementById('telefoneAtualizar').value
    }

    fetch(`/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
    })
    .then(resposta => resposta.json())
    .then(() => alert('Dados atualizados com sucesso!'))
    .catch(erro => console.error('Erro:', erro))
}
