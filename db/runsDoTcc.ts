import type { Run } from './tipos';

// Runs do TCC (repositório PROJECT-IA, docs/graph/fases-de-treino.md e historico-de-treinos.md).
// Em ordem de criação: o pai sempre vem antes do filho, senão a chave estrangeira recusa o INSERT.
// steps_m = steps do próprio run, em milhões (null = não registrado).
export const RUNS_DO_TCC: Run[] = [
  // GraphExplorer (v5–v6): grafo de nós, salas e portas
  { run_id: 'v4_s1_01', versao: 'v5.0', linha: 'GraphExplorer', pai: null, steps_m: 0.2, resultado: 'Etapa S1 sozinha (salas e portas, sem seta); base do run da noite', modelo: null, data: '2026-10-01' },
  { run_id: 'v4_noite_01', versao: 'v5.0', linha: 'GraphExplorer', pai: 'v4_s1_01', steps_m: 10, resultado: 'S1 a S6 numa noite: ~70% das salas, pega o hider em ~2/3', modelo: 'GraphExplorer_v4.0.onnx', data: '2026-10-02' },
  { run_id: 'v4.1_noite_01', versao: 'v5.1', linha: 'GraphExplorer', pai: null, steps_m: 7.1, resultado: 'Planta de salas: explora 76–83% das salas, pega 83%', modelo: 'GraphExplorer_v4.1.onnx', data: '2026-10-02' },
  { run_id: 'v4.2_noite_01', versao: 'v5.1.1', linha: 'GraphExplorer', pai: null, steps_m: 3.72, resultado: 'Abandonado: parou de bater na parede e também de explorar', modelo: null, data: '2026-10-03' },
  { run_id: 'v4.3_caca_01', versao: 'v5.1.2', linha: 'GraphExplorer', pai: 'v4.1_noite_01', steps_m: 0.532, resultado: 'Caça: vê ~89% dos hiders, pega ~72%', modelo: 'GraphExplorer_v4.3.onnx', data: '2026-10-03' },
  { run_id: 'v5.0_zero_02', versao: 'v5.2', linha: 'GraphExplorer', pai: null, steps_m: 3.15, resultado: 'Abandonado: decorou um loop de salas baratas perto do spawn', modelo: null, data: '2026-10-04' },
  { run_id: 'v5.1_zero_01', versao: 'v5.3', linha: 'GraphExplorer', pai: null, steps_m: 50, resultado: 'Economia de salas: ~24 de 26 salas, pega 97–99%', modelo: 'GraphExplorer_05_50M.onnx', data: '2026-10-07' },
  { run_id: 'v5.2_caca_01', versao: 'v6.0', linha: 'GraphExplorer', pai: 'v5.1_zero_01', steps_m: 8, resultado: 'Caça com NavMesh: pega 99.8%, ~25 s da 1ª vista à captura', modelo: 'GraphExplorer_v5.2.onnx', data: '2026-10-10' },

  // FreeExplorer (v7): só NavMesh e pontos de visão
  { run_id: 'v8.0_zero_02', versao: 'v7.0', linha: 'FreeExplorer', pai: null, steps_m: 9.5, resultado: 'Explorador livre: pega ~99% na Foge, ~13 s da 1ª vista à captura', modelo: 'FreeExplorer_v8.0_9.5M.onnx', data: '2026-10-10' },
  { run_id: 'v8.1_zero_01', versao: 'v7.1', linha: 'FreeExplorer', pai: null, steps_m: 35, resultado: 'Currículo completo com chaves: pega ~95%, cobertura ~0.48', modelo: 'FreeExplorer_v8.1M_35M.onnx', data: '2026-10-13' },
  { run_id: 'v8.2_mapa_01', versao: 'v7.2', linha: 'FreeExplorer', pai: 'v8.1_zero_01', steps_m: null, resultado: 'Map - V8 com os números do jogo (visão 80°/30 m)', modelo: null, data: '2026-10-13' },
  { run_id: 'v8.2_mapa_02', versao: 'v7.2', linha: 'FreeExplorer', pai: 'v8.2_mapa_01', steps_m: null, resultado: 'Procurar passa a contar como campar', modelo: null, data: '2026-10-14' },
  { run_id: 'v8.2_mapa_03', versao: 'v7.2', linha: 'FreeExplorer', pai: 'v8.2_mapa_02', steps_m: null, resultado: 'Sem a presa rápida; a presa se esconde ao despistar', modelo: null, data: '2026-10-14' },
  { run_id: 'v8.2_mapa_04', versao: 'v7.2', linha: 'FreeExplorer', pai: 'v8.2_mapa_03', steps_m: 3.18, resultado: 'Pega ~0.79, mas faz sempre a mesma ronda', modelo: 'FreeExplorer_v8.2_3.2M.onnx', data: '2026-10-14' },
  { run_id: 'v8.2_mapa_05', versao: 'v7.2', linha: 'FreeExplorer', pai: 'v8.2_mapa_04', steps_m: 10, resultado: 'Visão 3D e presa que se esconde: pega ~0.43, cobertura 0.535', modelo: 'FreeExplorer_v8.2_10M.onnx', data: '2026-10-15' },
  { run_id: 'v7.3_ronda_01', versao: 'v7.3', linha: 'FreeExplorer', pai: 'v8.2_mapa_05', steps_m: 3.6, resultado: 'Parado: a ronda fixa não mudou', modelo: null, data: '2026-10-17' },
  { run_id: 'v7.3_ronda_02', versao: 'v7.3.1', linha: 'FreeExplorer', pai: 'v7.3_ronda_01', steps_m: 11.46, resultado: 'Gamma 0.999: pega ~0.48, exploração igual', modelo: null, data: '2026-10-17' },
  { run_id: 'v7.4_final_01', versao: 'v7.4', linha: 'FreeExplorer', pai: 'v7.3_ronda_02', steps_m: 1.02, resultado: 'Primeiro run no mapa do jogo (Cena Final)', modelo: null, data: '2026-10-17' },
  { run_id: 'v7.4.1_ronda_01', versao: 'v7.4.1', linha: 'FreeExplorer', pai: 'v7.4_final_01', steps_m: 1, resultado: 'Raridade em curva: cobertura 0.34 → 0.39, captura 0.66 → 0.51', modelo: null, data: '2026-10-18' },
  { run_id: 'v7.4.2_salas_01', versao: 'v7.4.2', linha: 'FreeExplorer', pai: 'v7.4.1_ronda_01', steps_m: 6.5, resultado: 'Entrar em sala nova paga: cobertura 0.50, captura 0.47', modelo: null, data: '2026-10-18' },
  { run_id: 'v7.4.3_visitar_01', versao: 'v7.4.3', linha: 'FreeExplorer', pai: 'v7.4.2_salas_01', steps_m: 7.49, resultado: 'Objetivo vira entrar em toda sala: entra em ~0.6 delas', modelo: 'FreeExplorer_v7.4.3_7.5M.onnx', data: '2026-10-18' },
  { run_id: 'v7.4.4_planta_01', versao: 'v7.4.4', linha: 'FreeExplorer', pai: 'v7.4.3_visitar_01', steps_m: 15, resultado: 'Planta mostra as salas entradas: pega ~0.66, entra em 0.63 das salas', modelo: 'FreeExplorer_v7.4.4_15M.onnx', data: '2026-10-19' },
  { run_id: 'v7.4.5_ajustado_01', versao: 'v7.4.5', linha: 'FreeExplorer', pai: 'v7.4.4_planta_01', steps_m: 1.15, resultado: 'Mapa AJUSTADO, o mesmo do jogo', modelo: 'FreeExplorer_v7.4.5_1.15M.onnx', data: '2026-10-22' },
];
