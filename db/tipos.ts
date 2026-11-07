export type Run = {
  run_id: string;
  versao: string;
  linha: string;
  pai: string | null;
  steps_m: number | null;
  resultado: string;
  modelo: string | null;
  data: string;
};

// Vem dos logs do PC (tools/exportar_linhagem.py); fica null em run registrado à mão.
export type DadosDoCerebro = {
  horas_treino: number | null;
  captura: number | null;
  cobertura: number | null;
  reward: number | null;
  camadas: number | null;
  neuronios: number | null;
  learning_rate: number | null;
  gamma: number | null;
  entradas_total: number | null;
  entradas_formato: string | null;
  acoes: number | null;
  parametros: number | null;
  arquivo_onnx: string | null;
};

export type RunDoPc = Run & DadosDoCerebro;

// Um elo da linhagem: geracao 1 = o run do zero.
export type Elo = RunDoPc & { geracao: number };
