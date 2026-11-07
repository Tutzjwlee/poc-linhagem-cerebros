import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { buscarFilhos, buscarLinhagem, contarDescendentes } from '../db/consultas';
import type { Elo, Run } from '../db/tipos';
import { CerebroCard } from './CerebroCard';
import { corDaLinha, cores } from './cores';

type Props = {
  runId: string;
  onSelecionar: (runId: string) => void;
  onVoltar: () => void;
  onRegistrarFilho: (paiId: string) => void;
};

type Dados = { runId: string; linhagem: Elo[]; filhos: Run[]; descendentes: number };

export function LinhagemView({ runId, onSelecionar, onVoltar, onRegistrarFilho }: Props) {
  const db = useSQLiteContext();
  const [dados, setDados] = useState<Dados | null>(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([buscarLinhagem(db, runId), buscarFilhos(db, runId), contarDescendentes(db, runId)]).then(
      ([linhagem, filhos, descendentes]) => {
        // Tocar em outro elo antes da consulta voltar não pode mostrar a linhagem do run anterior.
        if (ativo) setDados({ runId, linhagem, filhos, descendentes });
      }
    );
    return () => {
      ativo = false;
    };
  }, [db, runId]);

  // "Carregando" é derivado: os dados guardados são de outro run (ou ainda não chegaram).
  if (dados === null || dados.runId !== runId) {
    return <ActivityIndicator style={{ marginTop: 40 }} color={cores.destaque} />;
  }

  const { linhagem, filhos, descendentes } = dados;
  const atual = linhagem[linhagem.length - 1];
  const stepsConhecidos = linhagem.reduce((soma, elo) => soma + (elo.steps_m ?? 0), 0);
  const semNumero = linhagem.filter((elo) => elo.steps_m === null).length;

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <Pressable onPress={onVoltar} accessibilityRole="button" style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Todos os runs</Text>
      </Pressable>

      <Text style={styles.titulo}>{atual.run_id}</Text>
      <Text style={styles.subtitulo}>
        {atual.linha} · {atual.versao} · {atual.data}
      </Text>
      {atual.resultado ? <Text style={styles.resultado}>{atual.resultado}</Text> : null}
      {atual.modelo ? <Text style={styles.modelo}>Modelo: {atual.modelo}</Text> : null}

      <View style={styles.resumo}>
        {linhagem.length === 1 ? (
          <Text style={styles.resumoTexto}>Treinado do zero</Text>
        ) : (
          <Text style={styles.resumoTexto}>{linhagem.length} gerações</Text>
        )}
        <Text style={styles.resumoDetalhe}>
          {semNumero > 0 ? 'pelo menos ' : ''}
          {formatarSteps(stepsConhecidos)} steps acumulados neste cérebro
          {semNumero > 0 ? ` (${semNumero} ${semNumero === 1 ? 'run sem número' : 'runs sem número'})` : ''}
        </Text>
      </View>

      {/* Run registrado à mão não tem logs: o cartão só aparece para o que veio do PC. */}
      {atual.entradas_total !== null || atual.horas_treino !== null ? <CerebroCard cerebro={atual} /> : null}

      <Text style={styles.secao}>Linhagem (do zero até aqui)</Text>
      {linhagem.map((elo) => {
        const ehAtual = elo.run_id === atual.run_id;
        return (
          <Pressable
            key={elo.run_id}
            onPress={() => onSelecionar(elo.run_id)}
            disabled={ehAtual}
            accessibilityRole="button"
            style={styles.elo}
          >
            <View style={styles.trilho}>
              <View style={[styles.ponto, { backgroundColor: corDaLinha(elo.linha) }, ehAtual && styles.pontoAtual]} />
              {elo.geracao < linhagem.length ? <View style={styles.linhaTrilho} /> : null}
            </View>
            <View style={styles.eloCorpo}>
              <Text style={[styles.eloTitulo, ehAtual && styles.eloTituloAtual]}>
                {elo.geracao}. {elo.run_id}
              </Text>
              <Text style={styles.eloDetalhe}>
                {elo.versao} · {elo.steps_m === null ? 'steps ?' : `${elo.steps_m}M steps`}
              </Text>
              {elo.resultado ? <Text style={styles.eloResultado}>{elo.resultado}</Text> : null}
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.secao}>
        Herdaram deste run{descendentes > 0 ? ` · ${descendentes} descendente${descendentes === 1 ? '' : 's'} no total` : ''}
      </Text>
      {filhos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum run herdou deste ainda.</Text>
      ) : (
        filhos.map((filho) => (
          <Pressable
            key={filho.run_id}
            onPress={() => onSelecionar(filho.run_id)}
            accessibilityRole="button"
            style={styles.filho}
          >
            <Text style={styles.filhoTexto}>
              {filho.versao} · {filho.run_id} →
            </Text>
          </Pressable>
        ))
      )}

      <Pressable
        onPress={() => onRegistrarFilho(atual.run_id)}
        accessibilityRole="button"
        style={styles.botao}
      >
        <Text style={styles.botaoTexto}>Registrar run herdando deste</Text>
      </Pressable>
    </ScrollView>
  );
}

function formatarSteps(milhoes: number) {
  return `${Number(milhoes.toFixed(2))}M`;
}

const styles = StyleSheet.create({
  conteudo: { padding: 16, paddingBottom: 40 },
  voltar: { paddingVertical: 6, marginBottom: 8 },
  voltarTexto: { color: cores.destaque, fontSize: 15, fontWeight: '600' },
  titulo: { fontSize: 22, fontWeight: '700', color: cores.texto },
  subtitulo: { color: cores.textoFraco, marginTop: 2 },
  resultado: { color: cores.texto, marginTop: 8, fontSize: 14 },
  modelo: { color: cores.textoFraco, marginTop: 4, fontSize: 12 },
  resumo: {
    backgroundColor: cores.cartao,
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  resumoTexto: { fontSize: 20, fontWeight: '700', color: cores.destaque },
  resumoDetalhe: { color: cores.textoFraco, marginTop: 4 },
  secao: { marginTop: 22, marginBottom: 8, fontWeight: '700', color: cores.texto, fontSize: 15 },
  elo: { flexDirection: 'row' },
  trilho: { width: 22, alignItems: 'center' },
  ponto: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  pontoAtual: { width: 16, height: 16, borderRadius: 8, marginTop: 2 },
  linhaTrilho: { flex: 1, width: 2, backgroundColor: cores.borda, marginVertical: 2 },
  eloCorpo: { flex: 1, paddingBottom: 14, paddingLeft: 6 },
  eloTitulo: { color: cores.texto, fontWeight: '600' },
  eloTituloAtual: { color: cores.destaque },
  eloDetalhe: { color: cores.textoFraco, fontSize: 12, marginTop: 1 },
  eloResultado: { color: cores.texto, fontSize: 12, marginTop: 2 },
  vazio: { color: cores.textoFraco },
  filho: { paddingVertical: 8 },
  filhoTexto: { color: cores.destaque, fontWeight: '600' },
  botao: {
    marginTop: 24,
    backgroundColor: cores.destaque,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: '700' },
});
