// Função para validar o formulário
function validarFormulario(descricao, valor) {
    if (!descricao.trim()) {
        alert('Descrição é obrigatória!');
        return false;
    }
    if (isNaN(valor) || valor <= 0) {
        alert('Valor deve ser um número positivo!');
        return false;
    }
    return true;
}

// Função para adicionar transação
async function adicionarTransacao(evento) {
    evento.preventDefault();
    
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;
    
    if (!validarFormulario(descricao, valor)) return;
    
    try {
        // Adicionar documento ao Firestore
        const docRef = await addDoc(window.transacoesRef, {
            descricao,
            valor,
            tipo,
            data: new Date().toISOString()
        });
        
        console.log("Transação adicionada com ID: ", docRef.id);
        document.getElementById('form-transacao').reset();
        atualizarExibicao();
    } catch (error) {
        console.error("Erro ao adicionar transação: ", error);
        alert("Erro ao salvar transação. Tente novamente.");
    }
}

// Função para carregar transações do Firestore
async function carregarTransacoes() {
    try {
        // Ordenar por data decrescente
        const q = query(window.transacoesRef, orderBy("data", "desc"));
        const querySnapshot = await getDocs(q);
        const transacoes = [];
        
        querySnapshot.forEach((doc) => {
            transacoes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return transacoes;
    } catch (error) {
        console.error("Erro ao carregar transações: ", error);
        return [];
    }
}

// Função para atualizar a exibição das transações
async function atualizarExibicao() {
    const transacoes = await carregarTransacoes();
    const tabela = document.getElementById('tabela-transacoes').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    
    let totalReceitas = 0;
    let totalDespesas = 0;
    
    transacoes.forEach(transacao => {
        const row = tabela.insertRow();
        
        // Formatar valor com duas casas decimais
        const valorFormatado = transacao.valor.toFixed(2);
        
        // Adicionar classes para estilização
        row.innerHTML = `
            <td>${transacao.descricao}</td>
            <td>R$ ${valorFormatado}</td>
            <td>${transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}</td>
            <td>
                <button class="editar" onclick="editarTransacao('${transacao.id}')">Editar</button>
                <button class="excluir" onclick="excluirTransacao('${transacao.id}')">Excluir</button>
            </td>
        `;
        
        // Calcular totais
        if (transacao.tipo === 'receita') {
            totalReceitas += transacao.valor;
        } else {
            totalDespesas += transacao.valor;
        }
    });
    
    // Atualizar resumo
    document.getElementById('total-receitas').textContent = totalReceitas.toFixed(2);
    document.getElementById('total-despesas').textContent = totalDespesas.toFixed(2);
    document.getElementById('saldo').textContent = (totalReceitas - totalDespesas).toFixed(2);
}

// Função para editar transação
async function editarTransacao(id) {
    try {
        const transacaoRef = doc(window.db, "transacoes", id);
        const docSnap = await getDoc(transacaoRef);
        
        if (docSnap.exists()) {
            const transacao = docSnap.data();
            document.getElementById('transacao-id').value = id;
            document.getElementById('descricao').value = transacao.descricao;
            document.getElementById('valor').value = transacao.valor;
            document.getElementById('tipo').value = transacao.tipo;
            document.getElementById('btn-submit').textContent = 'Atualizar';
            
            // Mudar o evento do formulário para atualizar
            const form = document.getElementById('form-transacao');
            form.onsubmit = function(evento) {
                evento.preventDefault();
                salvarAtualizacao(id);
            };
        }
    } catch (error) {
        console.error("Erro ao carregar transação para edição: ", error);
    }
}

// Função para salvar a atualização
async function salvarAtualizacao(id) {
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;
    
    if (!validarFormulario(descricao, valor)) return;
    
    try {
        const transacaoRef = doc(window.db, "transacoes", id);
        await updateDoc(transacaoRef, {
            descricao,
            valor,
            tipo
        });
        
        console.log("Transação atualizada com sucesso");
        
        // Resetar formulário
        document.getElementById('form-transacao').reset();
        document.getElementById('btn-submit').textContent = 'Adicionar';
        
        // Restaurar o evento original do formulário
        const form = document.getElementById('form-transacao');
        form.onsubmit = adicionarTransacao;
        
        atualizarExibicao();
    } catch (error) {
        console.error("Erro ao atualizar transação: ", error);
        alert("Erro ao atualizar transação. Tente novamente.");
    }
}

// Função para excluir transação
async function excluirTransacao(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        try {
            await deleteDoc(doc(window.db, "transacoes", id));
            console.log("Transação excluída com sucesso");
            atualizarExibicao();
        } catch (error) {
            console.error("Erro ao excluir transação: ", error);
            alert("Erro ao excluir transação. Tente novamente.");
        }
    }
}

// Inicializar o aplicativo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar o formulário
    const form = document.getElementById('form-transacao');
    form.onsubmit = adicionarTransacao;
    
    // Carregar transações
    atualizarExibicao();
});

// Tornar as funções globais para serem chamadas pelo HTML
window.editarTransacao = editarTransacao;
window.excluirTransacao = excluirTransacao;
