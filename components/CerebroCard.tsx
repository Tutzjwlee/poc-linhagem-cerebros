import { StyleSheet, Text, View } from 'react-native';
import type { DadosDoCerebro } from '../db/tipos';
import { cores } from './cores';

type Props = { cerebro: DadosDoCerebro };

export function CerebroCard({ cerebro }: Props) {
  const c = cerebro;
  const metricas = [
    c.captura !== null ? `captura ${decimal(c.captura)}` : null,
    c.cobertura !== null ? `cobertura ${decimal(c.cobertura)}` : null,
    c.reward !== null ? `reward ${decimal(c.reward, 1)}` : null,
  ].filter((m) => m !== null);

  return (
    <View style={styles.cartao}>
      <Text style={styles.titulo}>Cérebro (dos logs do PC)</Text>
      {c.entradas_total !== null ? (
        <Linha rotulo="Entradas" valor={`${c.entradas_total} números (${c.entradas_formato})`} />
      ) : null}
      {c.acoes !== null ? <Linha rotulo="Saídas" valor={`${c.acoes} ações contínuas`} /> : null}
      {c.camadas !== null && c.neuronios !== null ? (
        <Linha
          rotulo="Rede"
          valor={`${c.camadas} camadas de ${c.neuronios}${c.parametros !== null ? ` · ${milhares(c.parametros)} pesos` : ''}`}
        />
      ) : null}
      {c.horas_treino !== null ? (
        <Linha
          rotulo="Treino"
          valor={[
            `${decimal(c.horas_treino, 1)} h`,
            c.learning_rate !== null ? `learning rate ${c.learning_rate}` : null,
            c.gamma !== null ? `gamma ${c.gamma}` : null,
          ]
            .filter((t) => t !== null)
            .join(' · ')}
        />
      ) : null}
      {metricas.length > 0 ? <Linha rotulo="No fim" valor={metricas.join(' · ')} /> : null}
      {c.arquivo_onnx !== null ? <Linha rotulo="Arquivo" valor={c.arquivo_onnx} /> : null}
      <Text style={styles.nota}>“No fim” = média dos últimos 100 mil steps do TensorBoard.</Text>
    </View>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

// Formatação à mão: não dá para contar com Intl completo no Hermes do Expo Go.
function decimal(valor: number, casas = 2) {
  return valor.toFixed(casas).replace('.', ',');
}

function milhares(valor: number) {
  return String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: { fontWeight: '700', color: cores.texto, fontSize: 15, marginBottom: 6 },
  linha: { flexDirection: 'row', paddingVertical: 3 },
  rotulo: { width: 72, color: cores.textoFraco, fontSize: 13 },
  valor: { flex: 1, color: cores.texto, fontSize: 13 },
  nota: { color: cores.textoFraco, fontSize: 11, marginTop: 6 },
});
