# Linhagem dos cérebros

Prova de conceito da disciplina de Aplicativos Híbridos: um app Expo que guarda, no próprio celular, a árvore de
herança dos cérebros treinados no TCC (Unity ML-Agents) e mostra, para qualquer run, a cadeia de
`--initialize-from` até o run treinado do zero, com os steps acumulados.

- Pergunta, alternativas, fontes e erros da IA: [PESQUISA.md](PESQUISA.md)
- Critérios de aceitação: [CRITERIOS.md](CRITERIOS.md)

## Rodar

```bash
npm install
npx expo start
```

Leia o QR Code com o Expo Go. Se a rede bloquear, use `npx expo start --tunnel`.

## Atualizar com os treinos novos

No PC de treino, no Anaconda Prompt (o ambiente do `mlagents-learn` já tem `onnx` e `tensorboard`):

```bash
conda activate mlagents
cd C:\dev\poc-linhagem-cerebros
python tools/exportar_linhagem.py "C:/Users/Arthur Lee/Unity/PROJECT-IA/results"
```

O script regrava `db/runsDoPc.json`. Com o `npx expo start` rodando, aperte `r` no terminal para recarregar o app:
os runs novos entram no banco do celular, e os registrados à mão continuam lá.

## Onde está cada coisa

| Arquivo | O que faz |
|---|---|
| `tools/exportar_linhagem.py` | Lê a `results/` do ML-Agents (logs do TensorBoard e `.onnx`) e gera `db/runsDoPc.json` |
| `db/migracao.ts` | Liga as chaves estrangeiras, cria a tabela (`PRAGMA user_version` 0 → 1 → 2) e junta os runs do PC a cada abertura |
| `db/consultas.ts` | Lista, linhagem (`WITH RECURSIVE`), filhos, descendentes e o INSERT de um run novo |
| `db/runsDoTcc.ts` | Os runs do TCC da v1 à v7.4.4 (Seeker, GraphExplorer e FreeExplorer), com versão e resultado escritos à mão com versão e resultado escritos à mão (GraphExplorer v5–v6 e FreeExplorer v7) |
| `db/runsDoPc.json` | Gerado pelo script: pai, steps e dados do cérebro de cada run, lidos dos logs |
| `components/` | Lista, linhagem, cartão do cérebro e formulário |
| `App.tsx` | A tela: `SQLiteProvider` e a troca entre lista, linhagem e formulário |

Para começar com o banco zerado de novo: apague os dados do Expo Go (ou desinstale o app de desenvolvimento).
