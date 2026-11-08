# Critérios de aceitação

Escritos antes da implementação. Cada um é conferido no app rodando, não na resposta do chat.

- [ ] **Lista offline.** Com o app aberto, ligar o modo avião: a lista mostra os runs de treino do TCC (Seeker v1–v3,
      GraphExplorer v4–v6 e FreeExplorer v7), cada um com a versão, o run-id e de quem herdou ("do zero" quando não herdou de
      ninguém), e tocar num run continua mostrando a linhagem.
- [ ] **Linhagem completa.** Ao tocar em `v7.4.4_planta_01`, a tela mostra a cadeia de `--initialize-from` desde o
      run do zero (`v8.1_zero_01`, que é a v7.1: o run-id usa a numeração de antes de 16/10) até ele, do mais antigo
      para o mais novo: 13 gerações, com os steps de cada run e o total de steps que aquele cérebro acumulou.
- [ ] **Run do zero.** Ao tocar em `v5.1_zero_01`, a linhagem tem uma geração só e diz "treinado do zero"; logo
      abaixo aparecem os runs que herdaram dele (`v5.2_caca_01`).
- [ ] **Persistência.** Registrar o run `v7.4.5_teste_01` herdando de `v7.4.4_planta_01`, fechar o app por completo
      (tirar da lista de apps recentes) e abrir de novo: o run continua na lista, e a linhagem dele tem 14 gerações.
- [ ] **Erro: run-id repetido.** Registrar de novo um run-id que já existe mostra "Esse run-id já existe" e não grava
      nada.
- [ ] **Erro: pai inexistente.** Registrar um run cujo pai não está cadastrado (ex.: `v9.9_nada_01`) mostra "Run pai
      não encontrado" e não grava nada.

### Importação dos logs do PC (escritos antes do script)

- [ ] **Importação automática.** Fazer um treino curto de verdade herdando de `v7.4.4_planta_01`, rodar
      `tools/exportar_linhagem.py` e recarregar o app: o run novo aparece na lista com o pai, a versão e os steps
      vindos dos logs, sem nada digitado no celular.
- [ ] **Dados do cérebro.** Na linhagem de `v7.4.4_planta_01` aparecem as entradas (437 números), as saídas (4
      ações), o tamanho da rede (2 camadas de 256), a captura, a cobertura e as horas de treino.
- [ ] **Herança mesmo com `--resume`.** Depois da importação, `v7.4.4_planta_01` continua com 13 gerações, embora o
      `configuration.yaml` dele diga `initialize_from: null` (o run foi retomado com `--resume`).
- [ ] **Registro manual sobrevive.** O `v7.4.5_teste_01` registrado à mão continua na lista depois de rodar o script
      de novo e reabrir o app.

### Da v1 à v7 (escritos antes da mudança, a partir da vitrine da branch `exhibit`)

- [ ] **Linha completa.** A lista tem as três linhas, da v1 à v7.4.4: Seeker (`SeekerV1`–`V3`), GraphExplorer (v4.0
      a v6.0) e FreeExplorer (v7.0 a v7.4.4), com os 18 cérebros da vitrine.
- [ ] **Árvore com galhos.** Ao tocar em `node4_e3_01` (v4.3.6, etapa E3), a linhagem começa em `node4_e1_01`
      (etapa E1); ao tocar em `node4_e1_01`, aparecem dois filhos diretos (`node4_e2_01` e `node4_e2_02`).
- [ ] **Origem desconhecida não vira "do zero".** Ao tocar em `SeekerV1`, a tela diz "origem a confirmar" (o run de
      treino não está nos logs deste PC), e o cartão do cérebro mostra as entradas e saídas lidas do `.onnx`.

**Verificado em:** ( ) aparelho físico ( ) emulador

**Resultado:** ( ) passou ( ) reprovou
