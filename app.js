// app.js
// Referência ao banco de dados
const dbRef = database.ref('despesas');

// Função para ADICIONAR despesas
function adicionarDespesa(descricao, valor, data) {
  dbRef.push({
    descricao: descricao,
    valor: parseFloat(valor),
    data: data,
    timestamp: Date.now()
  });
}

// Função para LISTAR despesas
function listarDespesas() {
  dbRef.on('value', (snapshot) => {
    const despesas = snapshot.val();
    const tabela = document.getElementById('tabela-despesas');
    tabela.innerHTML = ''; // Limpa tabela atual
    
    if (despesas) {
      Object.keys(despesas).forEach(id => {
        const despesa = despesas[id];
        const row = tabela.insertRow();
        row.innerHTML = `
          <td>${despesa.descricao}</td>
          <td>R$ ${despesa.valor.toFixed(2)}</td>
          <td>${new Date(despesa.data).toLocaleDateString()}</td>
          <td>
            <button onclick="editarDespesa('${id}')">✏️ Editar</button>
            <button onclick="excluirDespesa('${id}')">🗑️ Excluir</button>
          </td>
        `;
      });
    }
  });
}

// Função para EXCLUIR
function excluirDespesa(id) {
  if (confirm('Tem certeza que deseja excluir?')) {
    database.ref(`despesas/${id}`).remove();
  }
}

// Carrega os dados quando a página abre
window.onload = () => {
  listarDespesas();
};
