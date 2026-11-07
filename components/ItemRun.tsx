import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Run } from '../db/tipos';
import { corDaLinha, cores } from './cores';

type Props = {
  run: Run;
  onPress: (runId: string) => void;
};

export function ItemRun({ run, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(run.run_id)}
      style={({ pressed }) => [styles.item, pressed && styles.pressionado]}
      accessibilityRole="button"
      accessibilityLabel={`Run ${run.run_id}, versão ${run.versao}`}
    >
      <View style={[styles.versao, { backgroundColor: corDaLinha(run.linha) }]}>
        <Text style={styles.versaoTexto}>{run.versao}</Text>
      </View>
      <View style={styles.corpo}>
        <Text style={styles.runId}>{run.run_id}</Text>
        <Text style={styles.herda}>{run.pai ? `herda de ${run.pai}` : 'do zero'}</Text>
      </View>
      <Text style={styles.steps}>{run.steps_m === null ? '?' : `${run.steps_m}M`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },
  pressionado: { backgroundColor: '#E9EDF2' },
  versao: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, minWidth: 58, alignItems: 'center' },
  versaoTexto: { color: '#fff', fontWeight: '700', fontSize: 12 },
  corpo: { flex: 1, marginLeft: 10 },
  runId: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  herda: { color: cores.textoFraco, fontSize: 12, marginTop: 2 },
  steps: { color: cores.textoFraco, fontSize: 13, fontVariant: ['tabular-nums'] },
});
