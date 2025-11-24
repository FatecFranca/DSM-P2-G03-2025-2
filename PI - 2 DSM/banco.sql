CREATE DATABASE IF NOT EXISTS `bancopi`;
USE `bancopi`;


CREATE TABLE usuario(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    senha VARCHAR(50),
    telefone VARCHAR(15),
    cpf VARCHAR(11) UNIQUE 
);


CREATE TABLE profissional(
    id_profissional INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    profissao VARCHAR(75), 
    CONSTRAINT fk_profissional_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE servico(
    id_servico INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_profissional INT,
    fk_id_usuario INT,      
    tipo VARCHAR(30),
    horarios VARCHAR(15),
    CONSTRAINT fk_servico_profissional FOREIGN KEY (fk_id_profissional) REFERENCES profissional(id_profissional),
    CONSTRAINT fk_servico_usuario FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE orcamento(
    id_orcamento INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_servico INT,        
    fk_id_usuario INT,        
    fk_id_profissional INT,   
    localizacao VARCHAR(50),
    valor DOUBLE,
    CONSTRAINT fk_orcamento_servico FOREIGN KEY (fk_id_servico) REFERENCES servico(id_servico),
    CONSTRAINT fk_orcamento_usuario FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_orcamento_profissional FOREIGN KEY (fk_id_profissional) REFERENCES profissional(id_profissional)
);

ALTER TABLE profissional ADD descricao TEXT;
