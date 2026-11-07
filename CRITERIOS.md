# Critérios de aceitação

Escritos antes da implementação. Cada um é conferido no app rodando, não na resposta do chat.

- [ ] **Lista offline.** Com o app aberto, ligar o modo avião: a lista mostra os runs de treino do TCC (GraphExplorer
      v5–v6 e FreeExplorer v7), cada um com a versão, o run-id e de quem herdou ("do zero" quando não herdou de
      ninguém), e tocar num run continua mostrando a linhagem.
- [ ] **Linhagem completa.** Ao tocar em `v7.4.4_planta_01`, a tela mostra a cadeia de `--initialize-from` desde o
      run do zero (`v8.1_zero_01`) até ele, do mais antigo para o mais novo: 13 gerações, com os steps de cada run e o
      total de steps que aquele cérebro acumulou.
- [ ] **Run do zero.** Ao tocar em `v5.1_zero_01`, a linhagem tem uma geração só e diz "treinado do zero"; logo
      abaixo aparecem os runs que herdaram dele (`v5.2_caca_01`).
- [ ] **Persistência.** Registrar o run `v7.4.6_teste_01` herdando de `v7.4.5_ajustado_01`, fechar o app por completo
      (tirar da lista de apps recentes) e abrir de novo: o run continua na lista, e a linhagem dele tem 15 gerações.
- [ ] **Erro: run-id repetido.** Registrar de novo um run-id que já existe mostra "Esse run-id já existe" e não grava
      nada.
- [ ] **Erro: pai inexistente.** Registrar um run cujo pai não está cadastrado (ex.: `v9.9_nada_01`) mostra "Run pai
      não encontrado" e não grava nada.

### Importação dos logs do PC (escritos antes do script)

- [ ] **Importação automática.** Fazer um treino curto de verdade herdando de `v7.4.5_ajustado_01`, rodar
      `tools/exportar_linhagem.py` e recarregar o app: o run novo aparece na lista com o pai, a versão e os steps
      vindos dos logs, sem nada digitado no celular.
- [ ] **Dados do cérebro.** Na linhagem de `v7.4.4_planta_01` aparecem as entradas (437 números), as saídas (4
      ações), o tamanho da rede (2 camadas de 256), a captura, a cobertura e as horas de treino.
- [ ] **Herança mesmo com `--resume`.** Depois da importação, `v7.4.4_planta_01` continua com 13 gerações, embora o
      `configuration.yaml` dele diga `initialize_from: null` (o run foi retomado com `--resume`).
- [ ] **Registro manual sobrevive.** O `v7.4.6_teste_01` registrado à mão continua na lista depois de rodar o script
      de novo e reabrir o app.

**Verificado em:** ( ) aparelho físico ( ) emulador

**Resultado:** ( ) passou ( ) reprovou
