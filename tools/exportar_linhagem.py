"""Lê a pasta results/ do ML-Agents e gera db/runsDoPc.json, que o app junta ao banco a cada abertura.

Uso (Anaconda Prompt, com o ambiente que tem onnx e tensorboard, o mesmo do mlagents-learn):
    conda activate mlagents
    python tools/exportar_linhagem.py "C:/Users/Arthur Lee/Unity/PROJECT-IA/results"
"""
import argparse
import datetime
import glob
import json
import os
import re
import sys

import onnx
from tensorboard.backend.event_processing.event_accumulator import EventAccumulator

# Só o monstro: o diretor e os experimentos antigos (node4_*, graph_*) ficam de fora.
COMPORTAMENTOS = ("FreeExplorer", "GraphExplorer")
NOME_COM_VERSAO = re.compile(r"^(v\d+(?:\.\d+)*)_")
# Abaixo disso é começo abortado (ex.: v4c_fuga_01, 28 mil steps), não um cérebro.
STEPS_MINIMOS = 100_000
# Runs que estão na results/ mas não fazem parte do TCC (a linha oficial termina no v7.4.4_planta_01).
FORA_DO_PROJETO = {"v7.4.5_ajustado_01", "v7.4.6_demo_01"}
# Renumeração de 16/10 (PROJECT-IA, docs/graph/fases-de-treino.md): o run-id guarda o nome da época.
# Ex.: v8.1_zero_01 é a v7.1, anterior à v7.3. Runs criados depois seguem vM.m.p_tarefa_NN e saem do próprio nome.
VERSAO_POR_RUN = {
    "v4_s1_01": "v5.0",
    "v4_noite_01": "v5.0",
    "v4.1_noite_01": "v5.1",
    "v4.2_noite_01": "v5.1.1",
    "v4.3_caca_01": "v5.1.2",
    "v5.0_zero_02": "v5.2",
    "v5.1_zero_01": "v5.3",
    "v5.2_caca_01": "v6.0",
    "v8.0_zero_02": "v7.0",
    "v8.1_zero_01": "v7.1",
    "v8.2_mapa_01": "v7.2",
    "v8.2_mapa_02": "v7.2",
    "v8.2_mapa_03": "v7.2",
    "v8.2_mapa_04": "v7.2",
    "v8.2_mapa_05": "v7.2",
    "v7.3_ronda_02": "v7.3.1",
    # v4: nomes sem versão. graph_10..12 ficam entre a v4.0 (mapa Nodes, até 18/09) e a v4.1 (Nodes_2): a confirmar.
    "graph_10": "v4.x",
    "graph_11": "v4.x",
    "graph_12": "v4.x",
    "graph_14": "v4.1.1",
    "graph_16": "v4.1.1",
    "graph_18": "v4.1",
    "night_01": "v4.1",
    "night_04": "v4.1.2",
    "node4_01": "v4.3.0",
    "node4_noarrow_01": "v4.3.1",
    "node4_noarrow_02--resume": "v4.3.2",
    "node4_noarrow_03": "v4.3.2",
    "node4_patrol_02": "v4.3.3",
    "node4_search_01": "v4.3.5",
    "node4_search_02": "v4.3.5",
    "node4_search_03": "v4.3.5",
    "node4_search_04": "v4.3.5",
    "node4_e1_01": "v4.3.6",
    "node4_e2_01": "v4.3.6",
    "node4_e2_02": "v4.3.6",
    "node4_e2_03": "v4.3.6",
    "node4_e2_04": "v4.3.6",
    "node4_e2_05": "v4.3.6",
    "node4_e2_06": "v4.3.6",
    "node4_e3_01": "v4.3.6",
}
# Cérebros da vitrine (branch exhibit) cujo run não está na results/ deste PC: só o .onnx, origem a confirmar.
MODELOS_SEM_LOG = {
    "SeekerV1": ("v1", "Seeker", "Assets/SeekerV1.onnx"),
    "SeekerV2": ("v2", "Seeker", "Assets/SeekerV2.onnx"),
    "SeekerV3": ("v3", "Seeker", "Assets/SeekerV3.onnx"),
    "GraphExplorerV1": ("v4.0", "GraphExplorer", "Assets/Brains/_Antigos/GraphExplorerV1.onnx"),
}
# Média dos últimos pontos do TensorBoard (10 = 100 mil steps): o último sozinho oscila demais.
PONTOS_DA_MEDIA = 10

SAIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "db", "runsDoPc.json")


def arquivos_de_log(pasta):
    # O nome traz o horário de criação; um run retomado com --resume tem um arquivo por retomada.
    arquivos = glob.glob(os.path.join(pasta, "events.out.tfevents.*"))
    return sorted(arquivos, key=lambda f: int(os.path.basename(f).split(".")[3]))


def ler_logs(arquivos):
    texto_config = None
    escalares = {}
    horas = 0.0
    for arquivo in arquivos:
        log = EventAccumulator(arquivo, size_guidance={"scalars": 0, "tensors": 1})
        log.Reload()
        if texto_config is None and "Hyperparameters/text_summary" in log.Tags().get("tensors", []):
            evento = log.Tensors("Hyperparameters/text_summary")[0]
            texto_config = b"".join(evento.tensor_proto.string_val).decode("utf-8", "ignore")
        for tag in log.Tags()["scalars"]:
            escalares.setdefault(tag, []).extend(log.Scalars(tag))
        reward = log.Scalars("Environment/Cumulative Reward") if "Environment/Cumulative Reward" in log.Tags()["scalars"] else []
        if len(reward) > 1:
            # Por arquivo: o tempo parado entre um Ctrl+C e o --resume não conta como treino.
            horas += (reward[-1].wall_time - reward[0].wall_time) / 3600
    for pontos in escalares.values():
        pontos.sort(key=lambda p: p.step)
    return texto_config, escalares, horas


def valor_da_config(texto, chave):
    achado = re.search(rf"^\s*{chave}:\s*(\S+)", texto or "", re.MULTILINE)
    return achado.group(1) if achado else None


def numero(texto):
    try:
        return float(texto)
    except (TypeError, ValueError):
        return None


def media_final(escalares, tag):
    pontos = escalares.get(tag)
    if not pontos:
        return None
    ultimos = pontos[-PONTOS_DA_MEDIA:]
    return round(sum(p.value for p in ultimos) / len(ultimos), 3)


def onnx_mais_recente(pasta_run, comportamento):
    final = os.path.join(pasta_run, f"{comportamento}.onnx")
    if os.path.exists(final):
        return final
    # Run interrompido sem exportar o final: o checkpoint de mais steps é o cérebro mais novo.
    checkpoints = glob.glob(os.path.join(pasta_run, comportamento, f"{comportamento}-*.onnx"))
    if not checkpoints:
        return None
    return max(checkpoints, key=lambda f: int(re.search(r"-(\d+)\.onnx$", f).group(1)))


def ler_onnx(caminho):
    # Sem os pesos externos (.onnx.data): para formato e contagem, o cabeçalho basta.
    modelo = onnx.load(caminho, load_external_data=False)

    def formato(tensor):
        return [d.dim_value for d in tensor.type.tensor_type.shape.dim][1:]  # tira o lote

    entradas = [formato(t) for t in modelo.graph.input if t.name.startswith("obs_")]
    total = 0
    for dims in entradas:
        produto = 1
        for d in dims:
            produto *= d
        total += produto
    acoes = None
    for saida in modelo.graph.output:
        if saida.name == "continuous_actions":
            acoes = formato(saida)[-1]
    parametros = 0
    for peso in modelo.graph.initializer:
        produto = 1
        for d in peso.dims:
            produto *= d
        parametros += produto
    return {
        "entradas_total": total,
        "entradas_formato": " + ".join("×".join(str(d) for d in dims) for dims in entradas),
        "acoes": acoes,
        "parametros": parametros,
    }


def ler_run(pasta_run):
    nome = os.path.basename(pasta_run)
    versao = NOME_COM_VERSAO.match(nome)
    comportamento = next((c for c in COMPORTAMENTOS if os.path.isdir(os.path.join(pasta_run, c))), None)
    if (versao is None and nome not in VERSAO_POR_RUN) or comportamento is None or nome in FORA_DO_PROJETO:
        return None
    arquivos = arquivos_de_log(os.path.join(pasta_run, comportamento))
    if not arquivos:
        return None

    texto_config, escalares, horas = ler_logs(arquivos)
    reward = escalares.get("Environment/Cumulative Reward", [])
    steps = reward[-1].step if reward else 0
    if steps < STEPS_MINIMOS:
        return None

    # A herança sai do PRIMEIRO log, não do configuration.yaml: o --resume regrava o yaml com initialize_from: null.
    init_path = valor_da_config(texto_config, "init_path")
    pai = re.search(r"results[\\/]([^\\/]+)[\\/]", init_path).group(1) if init_path and init_path != "None" else None

    run = {
        "run_id": nome,
        "versao": VERSAO_POR_RUN[nome] if nome in VERSAO_POR_RUN else versao.group(1),
        "linha": comportamento,
        "pai": pai,
        "pai_conhecido": 1,
        "steps_m": round(steps / 1e6, 3),
        "resultado": "",
        "modelo": None,
        "data": datetime.datetime.fromtimestamp(reward[0].wall_time).strftime("%Y-%m-%d"),
        "horas_treino": round(horas, 1),
        "captura": media_final(escalares, "Hunt/Caught"),
        "cobertura": media_final(escalares, "Exploration/Coverage"),
        "reward": media_final(escalares, "Environment/Cumulative Reward"),
        "camadas": int(numero(valor_da_config(texto_config, "num_layers")) or 0) or None,
        "neuronios": int(numero(valor_da_config(texto_config, "hidden_units")) or 0) or None,
        "learning_rate": numero(valor_da_config(texto_config, "learning_rate")),
        "gamma": numero(valor_da_config(texto_config, "gamma")),
        "entradas_total": None,
        "entradas_formato": None,
        "acoes": None,
        "parametros": None,
        "arquivo_onnx": None,
    }
    caminho_onnx = onnx_mais_recente(pasta_run, comportamento)
    if caminho_onnx:
        run.update(ler_onnx(caminho_onnx))
        run["arquivo_onnx"] = os.path.basename(caminho_onnx)
    return run


def ler_modelo_sem_log(projeto, run_id, versao, linha, caminho):
    arquivo = os.path.join(projeto, caminho)
    if not os.path.exists(arquivo):
        print(f"  aviso: {caminho} não encontrado; {run_id} fica sem os dados do cérebro.")
        dados = {}
    else:
        dados = ler_onnx(arquivo)
    run = {
        "run_id": run_id, "versao": versao, "linha": linha, "pai": None, "pai_conhecido": 0, "steps_m": None,
        "resultado": "", "modelo": None, "data": "", "horas_treino": None, "captura": None, "cobertura": None,
        "reward": None, "camadas": None, "neuronios": None, "learning_rate": None, "gamma": None,
        "entradas_total": None, "entradas_formato": None, "acoes": None, "parametros": None,
        "arquivo_onnx": os.path.basename(caminho),
    }
    run.update(dados)
    return run


def pais_antes_dos_filhos(runs):
    # O app grava na ordem da lista, e a chave estrangeira recusa um filho antes do pai.
    por_id = {r["run_id"]: r for r in runs}
    ordem, vistos = [], set()

    def visitar(run):
        if run["run_id"] in vistos:
            return
        vistos.add(run["run_id"])
        if run["pai"] in por_id:
            visitar(por_id[run["pai"]])
        ordem.append(run)

    for run in sorted(runs, key=lambda r: (r["data"], r["run_id"])):
        visitar(run)
    return ordem


def main():
    parser = argparse.ArgumentParser(description="Exporta a linhagem dos cérebros para o app.")
    parser.add_argument("results", help="pasta results/ do ML-Agents")
    args = parser.parse_args()
    if not os.path.isdir(args.results):
        sys.exit(f"Pasta não encontrada: {args.results}")

    runs = []
    for pasta in sorted(glob.glob(os.path.join(args.results, "*"))):
        if os.path.isdir(pasta):
            run = ler_run(pasta)
            if run:
                runs.append(run)
                print(f"  {run['run_id']:<22} {run['steps_m']:>7}M  pai: {run['pai'] or '(do zero)'}")
    if not runs:
        sys.exit("Nenhum run do monstro encontrado nessa pasta.")

    # A results/ fica na raiz do PROJECT-IA; os .onnx sem log são lidos de lá.
    projeto = os.path.dirname(os.path.abspath(args.results))
    for run_id, (versao, linha, caminho) in MODELOS_SEM_LOG.items():
        runs.append(ler_modelo_sem_log(projeto, run_id, versao, linha, caminho))
        print(f"  {run_id:<22}       ?   (só o .onnx: {caminho})")

    ids = {r["run_id"] for r in runs}
    for run in runs:
        if run["pai"] and run["pai"] not in ids:
            # Pai apagado ou renomeado: sem isso a chave estrangeira derrubaria a importação inteira no celular.
            print(f"  aviso: {run['run_id']} herdou de {run['pai']}, que não está na pasta; vai como 'do zero'.")
            run["resultado"] = f"Herdou de {run['pai']}, que não está nos logs"
            run["pai"] = None

    with open(SAIDA, "w", encoding="utf-8") as arquivo:
        json.dump({"geradoEm": datetime.datetime.now().isoformat(timespec="minutes"), "runs": pais_antes_dos_filhos(runs)},
                  arquivo, ensure_ascii=False, indent=1)
    print(f"{len(runs)} runs exportados para {os.path.normpath(SAIDA)}")


if __name__ == "__main__":
    main()
