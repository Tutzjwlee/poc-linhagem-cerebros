import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { mensagemDoErro, registrarRun } from '../db/consultas';
import { cores } from './cores';

type Props = {
  paiInicial: string;
  onRegistrado: (runId: string) => void;
  onCancelar: () => void;
};

export function FormNovoRun({ paiInicial, onRegistrado, onCancelar }: Props) {
  const db = useSQLiteContext();
  const [runId, setRunId] = useState('');
  const [versao, setVersao] = useState('');
  const [pai, setPai] = useState(paiInicial);
  const [steps, setSteps] = useState('');
  const [resultado, setResultado] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [gravando, setGravando] = useState(false);

  async function registrar() {
    const id = runId.trim();
    if (id === '' || versao.trim() === '') {
      setErro('Preencha o run-id e a versão.');
      return;
    }
    const stepsTexto = steps.trim().replace(',', '.');
    const stepsNumero = stepsTexto === '' ? null : Number(stepsTexto);
    if (stepsNumero !== null && (!Number.isFinite(stepsNumero) || stepsNumero < 0)) {
      setErro('Steps tem que ser um número em milhões (ex.: 1.5).');
      return;
    }

    setGravando(true);
    setErro(null);
    try {
      await registrarRun(db, {
        run_id: id,
        versao: versao.trim(),
        pai: pai.trim() === '' ? null : pai.trim(),
        steps_m: stepsNumero,
        resultado: resultado.trim(),
      });
      onRegistrado(id);
    } catch (e) {
      setErro(mensagemDoErro(e));
    } finally {
      setGravando(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Registrar run</Text>
      <Campo rotulo="Run-id" valor={runId} onChange={setRunId} exemplo="v7.4.6_teste_01" />
      <Campo rotulo="Versão" valor={versao} onChange={setVersao} exemplo="v7.4.6" />
      <Campo rotulo="Herda de (vazio = do zero)" valor={pai} onChange={setPai} exemplo="v7.4.5_ajustado_01" />
      <Campo rotulo="Steps (milhões)" valor={steps} onChange={setSteps} exemplo="1.5" teclado="decimal-pad" />
      <Campo rotulo="Resultado" valor={resultado} onChange={setResultado} exemplo="Caught 0.70" />

      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}

      <View style={styles.botoes}>
        <Pressable onPress={onCancelar} style={[styles.botao, styles.botaoSecundario]} accessibilityRole="button">
          <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={registrar}
          disabled={gravando}
          style={[styles.botao, gravando && { opacity: 0.6 }]}
          accessibilityRole="button"
        >
          <Text style={styles.botaoTexto}>{gravando ? 'Gravando…' : 'Registrar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

type CampoProps = {
  rotulo: string;
  valor: string;
  onChange: (texto: string) => void;
  exemplo: string;
  teclado?: 'default' | 'decimal-pad';
};

function Campo({ rotulo, valor, onChange, exemplo, teclado = 'default' }: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={exemplo}
        placeholderTextColor="#9AA3AD"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={teclado}
        style={styles.input}
        accessibilityLabel={rotulo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: cores.cartao,
    margin: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: { fontSize: 17, fontWeight: '700', color: cores.texto, marginBottom: 6 },
  campo: { marginTop: 8 },
  rotulo: { color: cores.textoFraco, fontSize: 12, marginBottom: 3 },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    color: cores.texto,
  },
  erro: { color: cores.erro, marginTop: 10, fontWeight: '600' },
  botoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 },
  botao: { backgroundColor: cores.destaque, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  botaoTexto: { color: '#fff', fontWeight: '700' },
  botaoSecundario: { backgroundColor: 'transparent', borderWidth: 1, borderColor: cores.borda },
  botaoSecundarioTexto: { color: cores.texto, fontWeight: '600' },
});
