import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { listarRuns } from '../db/consultas';
import type { Run } from '../db/tipos';
import { ItemRun } from './ItemRun';
import { cores } from './cores';

type Props = {
  // Muda a cada run registrado, para a lista reler o banco.
  versaoDosDados: number;
  onSelecionar: (runId: string) => void;
};

export function ListaRuns({ versaoDosDados, onSelecionar }: Props) {
  const db = useSQLiteContext();
  const [runs, setRuns] = useState<Run[] | null>(null);

  useEffect(() => {
    let ativo = true;
    listarRuns(db).then((lidos) => {
      if (ativo) setRuns(lidos);
    });
    return () => {
      ativo = false;
    };
  }, [db, versaoDosDados]);

  return (
    <FlatList
      data={runs ?? []}
      keyExtractor={(run) => run.run_id}
      renderItem={({ item }) => <ItemRun run={item} onPress={onSelecionar} />}
      ListHeaderComponent={
        runs ? <Text style={styles.contagem}>{runs.length} runs · toque num run para ver a linhagem</Text> : undefined
      }
      ListEmptyComponent={<Text style={styles.vazio}>{runs === null ? 'Abrindo o banco…' : 'Nenhum run.'}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  contagem: { color: cores.textoFraco, paddingHorizontal: 12, paddingVertical: 8, fontSize: 12 },
  vazio: { color: cores.textoFraco, padding: 16 },
});
