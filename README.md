# ZK-CargoPass

## Detalhes do Projeto

ZK-CargoPass é uma aplicação descentralizada (dApp) projetada para otimizar o desembaraço aduaneiro no Porto de Santos. A solução emprega tecnologia blockchain e provas de conhecimento zero (Zk Proofs) para verificar a documentação das cargas sem expor dados sensíveis.

## Exposição do Problema

Atualmente, cargas permanecem paradas por longos períodos em contêineres, levando a ineficiências e custos adicionais para pessoas físicas e jurídicas devido ao aluguel do espaço no porto. A ZK-CargoPass aborda essa questão adotando uma solução segura, privada e eficiente.

## Tecnologias Utilizadas

- **Frontend**: React com Vite
- **Blockchain**: Solidity para Smart Contracts
- **ZK Proofs**: Rust e Noir
- **Contêinerização**: Docker

## Como Rodar o Projeto Localmente

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js e npm instalados
- Rust environment configurado

### Passos

1. **Clone o repositório do projeto:**

   ```bash
   git clone https://github.com/sua-conta/ZK-CargoPass.git
   cd ZK-CargoPass

2. **Inicie o ambiente de desenvolvimento:**
   
   ```bash
   docker-compose up -d

3. **Instale as dependências do frontend:**
   
   ```bash
   cd frontend
   npm install

4. **Execute o frontend:**
   
   ```bash
   npm run dev

5. **Compile os Smart Contracts:**

- Navegue até o diretório dos contratos e compile:
   
   ```bash
   cd smart-contracts
   foundry compile

6. **Execute as provas ZK:**

- Navegue até o diretório específico e execute:
   
   ```bash
   cd zk-proofs
   cargo build --release

7. **Acesse a aplicação:**

- Abra o navegador e acesse `http://localhost:3001` para utilizar o aplicativo.

## Observações

As configurações adicionais das provas ZK devem ser ajustadas conforme necessário. Certifique-se de que as variáveis de ambiente estejam corretamente configuradas para o ambiente local.

## Considerações Finais

Este projeto visa não apenas solucionar problemas logísticos, mas também representar um avanço na aplicação de tecnologias emergentes, como blockchain e ZK Proofs, em ambientes de negócios reais.
