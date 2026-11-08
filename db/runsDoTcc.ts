import type { Run } from './tipos';

// Runs do TCC (repositório PROJECT-IA, docs/graph/fases-de-treino.md e historico-de-treinos.md; cérebros da vitrine
// da branch exhibit). Em ordem de criação: o pai sempre vem antes do filho, senão a chave estrangeira recusa o INSERT.
// steps_m = steps do próprio run, em milhões (null = não registrado).
export const RUNS_DO_TCC: Run[] = [
  // Seeker (v1–v3): modelos do PR #7 (05/09); o run de treino não está neste PC
  { run_id: 'SeekerV1', versao: 'v1', linha: 'Seeker', pai: null, steps_m: null, resultado: 'Seeker: perseguir o hider com memória em grade (Map_8). Run de treino não está neste PC', modelo: 'SeekerV1.onnx', data: '2026-09-05' },
  { run_id: 'SeekerV2', versao: 'v2', linha: 'Seeker', pai: null, steps_m: null, resultado: 'Seeker: perseguir o hider com memória em grade (Map_8). Run de treino não está neste PC', modelo: 'SeekerV2.onnx', data: '2026-09-05' },
  { run_id: 'SeekerV3', versao: 'v3', linha: 'Seeker', pai: null, steps_m: null, resultado: 'Seeker: perseguir o hider com memória em grade (Map_8). Run de treino não está neste PC', modelo: 'SeekerV3.onnx', data: '2026-09-05' },

  // GraphExplorer (v4): grafo de nós com seta
  { run_id: 'GraphExplorerV1', versao: 'v4.0', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Primeiro GraphExplorer: grafo de nós com seta (mapa Nodes). Run não está neste PC', modelo: 'GraphExplorerV1.onnx', data: '2026-09-08' },
  { run_id: 'graph_10', versao: 'v4.x', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Versão a confirmar: v4.0 (mapa Nodes, até 18/09) ou v4.1 (Nodes_2)', modelo: null, data: '2026-09-15' },
  { run_id: 'graph_11', versao: 'v4.x', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Versão a confirmar: v4.0 (mapa Nodes, até 18/09) ou v4.1 (Nodes_2)', modelo: null, data: '2026-09-18' },
  { run_id: 'graph_12', versao: 'v4.x', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Versão a confirmar: v4.0 (mapa Nodes, até 18/09) ou v4.1 (Nodes_2)', modelo: null, data: '2026-09-18' },
  { run_id: 'graph_14', versao: 'v4.1.1', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Tirar a seta de vez: cobertura 2–7%, revertido no mesmo dia', modelo: null, data: '2026-09-19' },
  { run_id: 'graph_16', versao: 'v4.1.1', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Tirar a seta de vez: cobertura 2–7%, revertido no mesmo dia', modelo: null, data: '2026-09-19' },
  { run_id: 'graph_18', versao: 'v4.1', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Seta sumindo aos poucos: ótimo com a seta, colapsa sem ela', modelo: null, data: '2026-09-19' },
  { run_id: 'night_01', versao: 'v4.1', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Seta sumindo aos poucos: reward chegou a 17.6 e terminou em 6.9', modelo: null, data: '2026-09-19' },
  { run_id: 'night_04', versao: 'v4.1.2', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Sem seta (branch node-unexplored): cobertura de 67% caiu a 29%; trocou explorar por colecionar ping', modelo: null, data: '2026-09-19' },
  { run_id: 'node4_01', versao: 'v4.3.0', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Inválido: grafo de mão única, só 6 de 133 nós alcançáveis', modelo: null, data: '2026-09-27' },
  { run_id: 'node4_noarrow_01', versao: 'v4.3.1', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Sem seta, do zero, no Node_4: cobertura travou em ~13%', modelo: 'GraphExplorer_node4_noarrow_9M.onnx', data: '2026-09-27' },
  { run_id: 'node4_noarrow_02--resume', versao: 'v4.3.2', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Correções de base (o nome do run saiu com “--resume” junto)', modelo: null, data: '2026-09-27' },
  { run_id: 'node4_noarrow_03', versao: 'v4.3.2', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Correções de base: em 500k, cobertura 18% contra 5% antes', modelo: null, data: '2026-09-27' },
  { run_id: 'node4_patrol_02', versao: 'v4.3.3', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Exploração + patrulha: cobriu 88%, mas 43% do tempo na parede', modelo: 'GraphExplorer_node4_patrol_02_7025k.onnx', data: '2026-09-28' },
  { run_id: 'node4_search_01', versao: 'v4.3.5', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Procura + ping do zero: ficava na sala de nascimento (cobertura ~2%)', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_search_02', versao: 'v4.3.5', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Procura + ping do zero: ficava na sala de nascimento (cobertura ~2%)', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_search_03', versao: 'v4.3.5', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Procura + ping do zero: ficava na sala de nascimento (cobertura ~2%)', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_search_04', versao: 'v4.3.5', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Procura + ping do zero: não aprendeu, mudanças demais de uma vez', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_e1_01', versao: 'v4.3.6', linha: 'GraphExplorer', pai: null, steps_m: null, resultado: 'Etapa E1, explorar com seta: cobertura 93–96% em 190k', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_e2_01', versao: 'v4.3.6', linha: 'GraphExplorer', pai: 'node4_e1_01', steps_m: null, resultado: 'Etapa E2, explorar tirando a seta', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_e2_02', versao: 'v4.3.6', linha: 'GraphExplorer', pai: 'node4_e1_01', steps_m: null, resultado: 'Etapa E2, explorar tirando a seta', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_e2_03', versao: 'v4.3.6', linha: 'GraphExplorer', pai: 'node4_e2_02', steps_m: null, resultado: 'Etapa E2, explorar tirando a seta', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_e2_04', versao: 'v4.3.6', linha: 'GraphExplorer', pai: 'node4_e2_02', steps_m: null, resultado: 'Etapa E2: a seta vai sumindo; a etapa parou em ~42% de cobertura', modelo: 'GraphExplorer_node4_e2_04_187k.onnx', data: '2026-09-28' },
  { run_id: 'node4_e2_05', versao: 'v4.3.6', linha: 'GraphExplorer', pai: 'node4_e2_04', steps_m: null, resultado: 'Etapa E2, explorar tirando a seta', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_e2_06', versao: 'v4.3.6', linha: 'GraphExplorer', pai: 'node4_e2_05', steps_m: null, resultado: 'Etapa E2, explorar tirando a seta', modelo: null, data: '2026-09-28' },
  { run_id: 'node4_e3_01', versao: 'v4.3.6', linha: 'GraphExplorer', pai: 'node4_e2_06', steps_m: null, resultado: 'Etapa E3, achar o hider parado: pega 25% → 56% dos episódios', modelo: 'GraphExplorer_node4_e3_01_748k.onnx', data: '2026-09-28' },

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
];
