import type { SQLiteDatabase } from 'expo-sqlite';
import runsDoPc from './runsDoPc.json';
import { RUNS_DO_TCC } from './runsDoTcc';
import type { RunDoPc } from './tipos';

const COLUNAS_DA_VERSAO_2 = [
  'horas_treino REAL',
  'captura REAL',
  'cobertura REAL',
  'reward REAL',
  'camadas INTEGER',
  'neuronios INTEGER',
  'learning_rate REAL',
  'gamma REAL',
  'entradas_total INTEGER',
  'entradas_formato TEXT',
  'acoes INTEGER',
  'parametros INTEGER',
  'arquivo_onnx TEXT',
  'pai_conhecido INTEGER NOT NULL DEFAULT 1',
];

// Roda a cada abertura do banco (onInit do SQLiteProvider), antes da primeira tela.
export async function migrarSeNecessario(db: SQLiteDatabase) {
  // A chave estrangeira do SQLite vem DESLIGADA e vale por conexão: sem isto, um pai inexistente grava calado.
  await db.execAsync('PRAGMA foreign_keys = ON');

  const resultado = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let versaoAtual = resultado?.user_version ?? 0;

  if (versaoAtual === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE runs (
        run_id    TEXT PRIMARY KEY NOT NULL,
        versao    TEXT NOT NULL,
        linha     TEXT NOT NULL,
        pai       TEXT REFERENCES runs(run_id),
        steps_m   REAL,
        resultado TEXT NOT NULL DEFAULT '',
        modelo    TEXT,
        data      TEXT NOT NULL,
        CHECK (pai IS NULL OR pai <> run_id)
      );
      CREATE INDEX idx_runs_pai ON runs(pai);
    `);
    // Só na criação: depois disso o banco é do usuário, e reabrir o app não pode apagar o que ele registrou.
    await db.withTransactionAsync(async () => {
      for (const run of RUNS_DO_TCC) {
        await db.runAsync(
          'INSERT INTO runs (run_id, versao, linha, pai, steps_m, resultado, modelo, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [run.run_id, run.versao, run.linha, run.pai, run.steps_m, run.resultado, run.modelo, run.data]
        );
      }
    });
    versaoAtual = 1;
  }

  if (versaoAtual === 1) {
    // Quem já tinha o banco da versão 1 ganha as colunas sem perder os runs registrados à mão.
    await db.withTransactionAsync(async () => {
      for (const coluna of COLUNAS_DA_VERSAO_2) {
        await db.execAsync(`ALTER TABLE runs ADD COLUMN ${coluna}`);
      }
    });
    versaoAtual = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${versaoAtual}`);
  await importarDoPc(db, (runsDoPc as { runs: RunDoPc[] }).runs);
}

// A cada abertura, porque o script do PC pode ter gerado runs novos desde a última vez.
// O medido nos logs (pai, steps, cérebro) se sobrepõe; versão, resultado, modelo e data escritos à mão ficam.
async function importarDoPc(db: SQLiteDatabase, runs: RunDoPc[]) {
  await db.withTransactionAsync(async () => {
    for (const r of runs) {
      await db.runAsync(
        `INSERT INTO runs (run_id, versao, linha, pai, steps_m, resultado, modelo, data,
           horas_treino, captura, cobertura, reward, camadas, neuronios, learning_rate, gamma,
           entradas_total, entradas_formato, acoes, parametros, arquivo_onnx, pai_conhecido)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (run_id) DO UPDATE SET
           linha = excluded.linha, pai = excluded.pai, steps_m = excluded.steps_m,
           horas_treino = excluded.horas_treino, captura = excluded.captura, cobertura = excluded.cobertura,
           reward = excluded.reward, camadas = excluded.camadas, neuronios = excluded.neuronios,
           learning_rate = excluded.learning_rate, gamma = excluded.gamma,
           entradas_total = excluded.entradas_total, entradas_formato = excluded.entradas_formato,
           acoes = excluded.acoes, parametros = excluded.parametros, arquivo_onnx = excluded.arquivo_onnx,
           pai_conhecido = excluded.pai_conhecido`,
        [
          r.run_id, r.versao, r.linha, r.pai, r.steps_m, r.resultado, r.modelo, r.data,
          r.horas_treino, r.captura, r.cobertura, r.reward, r.camadas, r.neuronios, r.learning_rate, r.gamma,
          r.entradas_total, r.entradas_formato, r.acoes, r.parametros, r.arquivo_onnx, r.pai_conhecido,
        ]
      );
    }
  });
}
