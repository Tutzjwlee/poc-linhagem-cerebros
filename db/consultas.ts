import type { SQLiteDatabase } from 'expo-sqlite';
import type { Elo, Run, RunDoPc } from './tipos';

export function listarRuns(db: SQLiteDatabase) {
  return db.getAllAsync<Run>('SELECT * FROM runs ORDER BY linha, data, run_id');
}

// Sobe pelos pais até o run do zero. O limite de 100 só protege contra um ciclo que o banco não deveria ter.
export async function buscarLinhagem(db: SQLiteDatabase, runId: string): Promise<Elo[]> {
  const linhas = await db.getAllAsync<RunDoPc & { nivel: number }>(
    `WITH RECURSIVE ancestrais(run_id, pai, nivel) AS (
       SELECT run_id, pai, 0 FROM runs WHERE run_id = ?
       UNION ALL
       SELECT r.run_id, r.pai, a.nivel + 1
       FROM runs r JOIN ancestrais a ON r.run_id = a.pai
       WHERE a.nivel < 100
     )
     SELECT r.*, a.nivel FROM ancestrais a JOIN runs r ON r.run_id = a.run_id
     ORDER BY a.nivel DESC`,
    [runId]
  );
  return linhas.map(({ nivel, ...run }, indice) => ({ ...run, geracao: indice + 1 }));
}

export function buscarFilhos(db: SQLiteDatabase, runId: string) {
  return db.getAllAsync<Run>('SELECT * FROM runs WHERE pai = ? ORDER BY data, run_id', [runId]);
}

export async function contarDescendentes(db: SQLiteDatabase, runId: string) {
  const linha = await db.getFirstAsync<{ total: number }>(
    `WITH RECURSIVE descendentes(run_id) AS (
       SELECT run_id FROM runs WHERE pai = ?
       UNION ALL
       SELECT r.run_id FROM runs r JOIN descendentes d ON r.pai = d.run_id
     )
     SELECT COUNT(*) AS total FROM descendentes`,
    [runId]
  );
  return linha?.total ?? 0;
}

export type NovoRun = Pick<Run, 'run_id' | 'versao' | 'pai' | 'steps_m' | 'resultado'>;

// Quem barra run-id repetido e pai inexistente é o próprio banco (PRIMARY KEY e REFERENCES), não o formulário.
export async function registrarRun(db: SQLiteDatabase, novo: NovoRun) {
  await db.runAsync(
    `INSERT INTO runs (run_id, versao, linha, pai, steps_m, resultado, modelo, data)
     VALUES (?, ?, COALESCE((SELECT linha FROM runs WHERE run_id = ?), 'FreeExplorer'), ?, ?, ?, NULL, date('now', 'localtime'))`,
    [novo.run_id, novo.versao, novo.pai, novo.pai, novo.steps_m, novo.resultado]
  );
}

export function mensagemDoErro(erro: unknown) {
  const texto = erro instanceof Error ? erro.message : String(erro);
  if (texto.includes('UNIQUE constraint failed')) return 'Esse run-id já existe.';
  if (texto.includes('FOREIGN KEY constraint failed')) return 'Run pai não encontrado.';
  if (texto.includes('CHECK constraint failed')) return 'Um run não pode herdar de si mesmo.';
  return `Não foi possível gravar: ${texto}`;
}
