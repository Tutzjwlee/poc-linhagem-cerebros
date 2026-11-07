import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FormNovoRun } from './components/FormNovoRun';
import { LinhagemView } from './components/LinhagemView';
import { ListaRuns } from './components/ListaRuns';
import { cores } from './components/cores';
import { migrarSeNecessario } from './db/migracao';

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="linhagem.db" onInit={migrarSeNecessario}>
        <SafeAreaView style={styles.tela} edges={['top', 'bottom']}>
          <StatusBar style="dark" />
          <Tela />
        </SafeAreaView>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}

function Tela() {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  // null = formulário fechado; string = aberto, com esse pai já preenchido.
  const [paiDoForm, setPaiDoForm] = useState<string | null>(null);
  const [versaoDosDados, setVersaoDosDados] = useState(0);

  useEffect(() => {
    const assinatura = BackHandler.addEventListener('hardwareBackPress', () => {
      if (paiDoForm !== null) {
        setPaiDoForm(null);
        return true;
      }
      if (selecionado !== null) {
        setSelecionado(null);
        return true;
      }
      return false;
    });
    return () => assinatura.remove();
  }, [paiDoForm, selecionado]);

  function aoRegistrar(runId: string) {
    setPaiDoForm(null);
    setVersaoDosDados((v) => v + 1);
    setSelecionado(runId);
  }

  return (
    <View style={styles.tela}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Linhagem dos cérebros</Text>
        {paiDoForm === null ? (
          <Pressable onPress={() => setPaiDoForm(selecionado ?? '')} accessibilityRole="button" style={styles.novo}>
            <Text style={styles.novoTexto}>+ Run</Text>
          </Pressable>
        ) : null}
      </View>

      {paiDoForm !== null ? (
        <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <FormNovoRun paiInicial={paiDoForm} onRegistrado={aoRegistrar} onCancelar={() => setPaiDoForm(null)} />
          </ScrollView>
        </KeyboardAvoidingView>
      ) : selecionado !== null ? (
        <LinhagemView
          runId={selecionado}
          onSelecionar={setSelecionado}
          onVoltar={() => setSelecionado(null)}
          onRegistrarFilho={setPaiDoForm}
        />
      ) : (
        <ListaRuns versaoDosDados={versaoDosDados} onSelecionar={setSelecionado} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: cores.cartao,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  titulo: { fontSize: 19, fontWeight: '700', color: cores.texto },
  novo: { backgroundColor: cores.destaque, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  novoTexto: { color: '#fff', fontWeight: '700' },
});
