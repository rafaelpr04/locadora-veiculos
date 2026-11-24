# Guia para os diagramas manuscritos

Desenhe à mão, em A4 branco liso, com seus próprios traços e disposição.

## 1. DER (conforme schema.prisma)

Entidades e atributos (PK, FK, UK):

- **Usuario**: id (PK), nome, email (UK), senha (hash bcrypt), criadoEm
- **Veiculo**: id (PK), marca, modelo, placa (UK), ano, valorDiaria, disponivel
- **Locacao**: id (PK), usuarioId (FK), veiculoId (FK), dataInicio, dataPrevistaDevolucao, dataDevolucao (opcional), valorTotal, status (ATIVA | FINALIZADA)

Relacionamentos:

- Usuario 1 --- N Locacao (Locacao.usuarioId referencia Usuario.id)
- Veiculo 1 --- N Locacao (Locacao.veiculoId referencia Veiculo.id)

Restrições a anotar: email único, placa única, FKs com ON DELETE RESTRICT (histórico preservado).

## 2. Diagrama de sequência: registro de locação

Participantes, da esquerda para a direita: Usuário, React, Route/Controller, Service, Prisma/Banco.

1. Usuário preenche veículo e datas e clica em "Registrar locação".
2. React envia `POST /locacoes` com `Authorization: Bearer <JWT>` e `{ veiculoId, dataInicio, dataPrevistaDevolucao }`.
3. Route/Controller: o middleware valida o JWT e consulta o usuário no banco (se inválido: 401 de volta ao React).
4. Controller chama `locacaoService.criar(usuarioId, dados)`.
5. Service valida os dados e confirma que a data prevista é posterior ao início (se não: 400).
6. Service consulta o veículo no Prisma (`findUnique`). Se não existe: 404.
7. Service verifica `disponivel`.
   - **Alternativo (indisponível)**: Service lança erro, Controller responde 409 "Veículo indisponível", React exibe a mensagem de erro ao usuário.
8. Service calcula o valor: `ceil(horas / 24) * valorDiaria`.
9. Service abre transação no Prisma: `updateMany` marca o veículo como indisponível apenas se ainda estiver disponível (se count = 0: 409) e `locacao.create` grava a locação com status ATIVA.
10. Banco confirma a transação; Prisma devolve a locação com os dados do veículo.
11. Service retorna ao Controller, que responde 201 com a locação.
12. React atualiza a lista e mostra a mensagem de sucesso com o valor total.
