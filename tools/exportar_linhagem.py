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
    if versao is None or comportamento is None:
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
        "versao": versao.group(1),
        "linha": comportamento,
        "pai": pai,
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
