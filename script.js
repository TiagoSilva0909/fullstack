// ========================================
// 1. GESTÃO DO CARRINHO
// ========================================
class CarrinhoCompras {
    constructor() {
        this.itens = [];
    }
    adicionarItem(nome, preco, descricao, desconto) {
        this.itens.push({ 
            nome: nome, 
            preco: parseFloat(preco),
            descricao: descricao || 'Sem descrição',
            desconto: desconto || '0%'
        });
        this.atualizarContador();
    }
    atualizarContador() {
        const contador = document.getElementById('contador-pedidos');
        if (contador) contador.textContent = this.itens.length;
    }
    calcularTotal() {
        return this.itens.reduce((total, item) => total + item.preco, 0);
    }
}
const carrinho = new CarrinhoCompras();

// ========================================
// 2. FUNÇÃO PARA ENVIAR DADOS AO BANCO
// ========================================
async function enviarParaBanco(url, dados) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        return await response.text();
    } catch (erro) {
        console.error(`Erro ao enviar para ${url}:`, erro);
    }
}

// ========================================
// 3. ANIMAÇÃO DE AGRADECIMENTO
// ========================================
function mostrarAnimacaoObrigado() {
    const overlay = document.createElement('div');
    overlay.id = 'animacao-obrigado';
    overlay.innerHTML = `
        <div class="conteudo-obrigado">
            <i class="fas fa-check-circle"></i>
            <h1>OBRIGADO PELA COMPRA!</h1>
            <p>Seu pedido está sendo preparado com muito carinho.</p>
        </div>
    `;
    document.body.appendChild(overlay);

    // Remove a animação e recarrega a página após 4 segundos
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => location.reload(), 500);
    }, 4000);
}

// ========================================
// 4. EVENTOS DE CLIQUE E FLUXO
// ========================================
document.addEventListener('click', async (e) => {
    // Adicionar ao carrinho
    const btnAdd = e.target.closest('.btn-comprar');
    if (btnAdd) {
        const { item, preco, ingredientes, desconto } = btnAdd.dataset;
        carrinho.adicionarItem(item, preco, ingredientes, desconto);
        return;
    }

    // Abrir modal de pedidos
    const btnPedidos = e.target.closest('#link-pedidos');
    if (btnPedidos) {
        e.preventDefault();
        if (carrinho.itens.length === 0) return alert("Carrinho vazio!");
        document.getElementById('modal-checkout').style.display = 'flex';
        mostrarEtapa('etapa-1');
    }

    // FECHAR MODAL
    if (e.target.closest('#btn-fechar-modal')) {
        document.getElementById('modal-checkout').style.display = 'none';
    }

    // --- SELECIONAR PIX (SALVA IMEDIATO NA TABELA FORMA_PAGAMENTO) ---
    if (e.target.closest('#btn-escolher-pix')) {
        await enviarParaBanco('forma_pagamento.php', { metodo: 'PIX' });
        mostrarEtapa('etapa-3-pix');
    }

    // --- SELECIONAR CARTÃO (SALVA IMEDIATO NA TABELA FORMA_PAGAMENTO) ---
    if (e.target.closest('#btn-escolher-cartao')) {
        await enviarParaBanco('forma_pagamento.php', { metodo: 'Cartão' });
        mostrarEtapa('etapa-3-cartao');
    }

    // FINALIZAR VIA PIX
    if (e.target.closest('#btn-finalizar-pix')) {
        for (const item of carrinho.itens) {
            await enviarParaBanco('pedidos.php', item);
        }
        mostrarAnimacaoObrigado();
    }
});

function mostrarEtapa(id) {
    ['etapa-1', 'etapa-2', 'etapa-3-pix', 'etapa-3-cartao'].forEach(etapa => {
        const el = document.getElementById(etapa);
        if (el) el.style.display = (etapa === id) ? 'block' : 'none';
    });
}

// SALVAR ENDEREÇO
document.getElementById('btn-ir-etapa-2')?.addEventListener('click', async () => {
    const form = document.getElementById('form-endereco');
    const dados = Object.fromEntries(new FormData(form).entries());
    await enviarParaBanco('endereco.php', dados);
    document.getElementById('resumo-total').innerText = carrinho.calcularTotal().toFixed(2);
    mostrarEtapa('etapa-2');
});

// --- FINALIZAR VIA CARTÃO (SALVA DADOS_CARTÃO E PEDIDOS) ---
const formCartao = document.getElementById('form-cartao');
if (formCartao) {
    formCartao.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dadosCartao = Object.fromEntries(new FormData(formCartao).entries());
        
        // 1. Salva na tabela dados_cartao
        await enviarParaBanco('dados_cartao.php', dadosCartao);
        
        // 2. Salva os itens na tabela pedidos
        for (const item of carrinho.itens) {
            await enviarParaBanco('pedidos.php', item);
        }

        mostrarAnimacaoObrigado();
    });
}