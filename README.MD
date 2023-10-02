# API ENERGY STATION

Projeto com fim de gerenciar recargas de recursos energéticos para planetas e viajantes intergaláticos.

## Descrição

Sistema é capaz de gerenciar recarga de recursos energéticos com uma cobertura de descobrir quais planetas podem receber os postos de recarga e otimizar a experiência dos viajantes espaciais.

Utilizamos a API de exoplanetas da NASA, para conseguir identificar os planetas capazes de receber os postos.

## Stack utilizada

**Back-end:** Node, Apollo GraphQL Server, Typescript, Axios, Zod, MongoDB(Mongoose), Docker e Docker-compose

## Instalação e Inicialização

1. **Faça o clone do projeto**:

```bash
  git clone URL
  cd api-energy-station
```

2. **Instale as dependências**:

```bash
  npm install
```

3. **Copie o .env.example e renomeie para .env**
4. **Adicione os valores das variáveis de ambiente**

Caso queira, crie uma conta no mongo atlas : https://account.mongodb.com/account/login para utilizar o proprio banco de dados na nuvém.

5. **Rode a aplicação localmente**:

```bash
  npm run start
```

**Outros recursos**:

**Execute a aplicação no container docker**

```bash
  docker-compose --env-file .env up
```

**Execute os testes**:

```bash
  npm run test

  //ou para covarage

  npm run test:covarage
```

## Requisitos

- [x] Crie um servidor em Node.js usando [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server/)
  - [x] Crie o schema GraphQL com uma query `suitablePlanets`, que retorna os dados dos planetas com gravidade alta
  - [x] Crie uma mutation `installStation`, que dado um planeta, instala uma estação de carregamento no planeta(é sugerido criar uma tabela em algum DB que guarde a informação de aonde estão instaladas as estações)
  - [x] Crie uma query `stations`, que irá listar todas as estações instaladas nos planetas
  - [x] Crie uma mutation `recharge`, que dado uma estação e um datetime de quanto a recarga irá finalizar, realiza uma recarga, começando a partir do momento em que a mutation foi chamada e finalizando com a datetime passada.
    - Só é possível realizar uma recarga na estação por vez
    - Essa recarga deve estar atrelado a um usuário - sinta-se livre para implementar da maneira que você desejar.
    - Um usuário só pode ter no máximo uma recarga em andamento
- [x] Documente o seu projeto, e explique como rodar ele
- [x] Crie o projeto em algum repositório privado no GitHub ou GitLab
- [x] Envie junto com o repositório do seu desafio um vídeo curto demonstrando o funcionamento básico do sistema, de formato livre, mostrando as funcionalidades implementadas.

### Extras

- [ ] Adicione testes usando [Jest] ou qualquer outro framework para testes
- [x] Usar Typescript
- [x] Coloque um docker-compose, que simplifique rodar o seu servidor e o DB
- [x] Usamos [prisma](prisma.io) mas sinta-se livre para usar qualquer ORM - Utilizei Mongoose
- [ ] Adicione autenticação (apenas um usuário autenticado poderá fazer uma recarga ou uma reserva)
- [x] Crie uma mutation `reservation`, que dado uma estação, um usuário e um intervalo de tempo, cria uma reserva da estação para o usuário naquele determinado intervalo de tempo.
  - Não deve ser possível criar uma reserva que conflite com o intervalo de outra reserva ou de uma recarga já em andamento
  - Para realizar uma recarga de uma determinada reserva, é necessário chamar uma mutation (podendo ser a própria `recharge` ou uma nova mutation - como você preferir) passando apenas um `reservationId`. A utilização só pode ocorrer dentro do próprio intervalo de tempo da reserva (e.g. Se a reserva foi de 12:00 até 13:00, só deve ser possível utilizá-la entre 12:00 e 13:00).
  - A recarga de uma reserva deve ser finalizada ao final do intervalo da reserva.
- [x] Crie uma query `stationHistory`, onde será possível visualizar o histórico de recargas de uma estação (mostrar o horário, o tempo de duração da recarga e o usuário que realizou-a)

## Comentários:

- Utilizei uma arquitetura similar a [Monolito modular](https://medium.com/@abel.ncm/arquitetura-monol%C3%ADtica-modular-estrutura%C3%A7%C3%A3o-escal%C3%A1vel-do-projecto-8888ed51f53b).
- Utilizado recursos do SOLID:
  - Utilizado para delimitar os módulos e seus sub-recursos.
  - Criando classes abstratas para manter um contrato, em caso de mudar implementação, os contratos continuariam sendo respeitados.
  - Recursos sem alto acoplamento (Dependendo de abstração e não de concretização)
- Fiquei em um impasse de onde faria a validação de informações vinda das mutations, e decidi copiar a técnica do NestJs, onde é feito nos [DTOs](https://docs.nestjs.com/techniques/validation) via [ZOD](https://github.com/colinhacks/zod/issues/641)
- Foi adicionado uma especie de cache utilizando o banco de dados para as informações vindas da API da NASA, onde defini um tempo de 7 dias de expiração.
- Caso puderem, gostaria de um guia/norte de como trabalhar com data em GraphQL, utilizei essa [doc](https://the-guild.dev/graphql/tools/docs/scalars) como base.
- Faltando apenas adicionar os testes, autenticar usuários e o observador de recarga/reserva. Além disse, gostaria de ter trabalhado melhor nos logs e retorno de erros padronizado.
