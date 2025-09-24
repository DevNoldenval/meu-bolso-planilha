// js/app.js
// js/app.js (adicione isso no início)
import { database } from './firebase-config.js';
import { ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Restante do código...

// TESTE DE CONEXÃO
console.log("Testando conexão com Firebase...");
const testRef = ref(database, '.info/connected');
onValue(testRef, (snap) => {
  console.log("Status da conexão:", snap.val() ? "CONECTADO" : "DESCONECTADO");
});

import { database } from './firebase-config.js';
import { ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const despesasRef = ref(database, 'despesas');

function adicionarDespesa() {
  const descricao = document.getElementById('descricao').value;
  const valor = document.getElementById('valor').value;
  const data = document.getElementById('data').value;
  
  if (descricao && valor && data) {
    push(despesasRef, {
      descricao: descricao,
      valor: parseFloat(valor),
      data: data,
      timestamp: Date.now()
    });
    
    document.getElementById('form-despesa').reset();
    alert('Despesa adicionada!');
  } else {
    alert('Preencha todos os campos!');
  }
}

function listarDespesas() {
  onValue(despesasRef, (snapshot) => {
    const despesas = snapshot.val();
    const tabela = document.getElementById('tabela-despesas');
    tabela.innerHTML = '';
    
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

function excluirDespesa(id) {
  if (confirm('Tem certeza?')) {
    const despesaRef = ref(database, `despesas/${id}`);
    remove(despesaRef);
  }
}

function editarDespesa(id) {
  const novaDescricao = prompt('Nova descrição:');
  if (novaDescricao) {
    const despesaRef = ref(database, `despesas/${id}`);
    update(despesaRef, { descricao: novaDescricao });
  }
}

window.onload = () => {
  listarDespesas();
};
