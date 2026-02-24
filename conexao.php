<?php
// conexao.php - Arquivo de conexão com o banco de dados
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "lanches_e_bebidas";

// Criando conexão
$conn = new mysqli($servidor, $usuario, $senha, $banco);

// Verificando conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
// Removi o 'else' daqui! Se a conexão der certo, o PHP apenas continua em silêncio.
?>