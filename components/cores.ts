export const cores = {
  fundo: '#F4F5F7',
  cartao: '#FFFFFF',
  texto: '#1B1F24',
  textoFraco: '#5C6670',
  borda: '#DDE1E6',
  destaque: '#2F5D8A',
  erro: '#B3261E',
  ok: '#2E7D4F',
};

// Uma cor por linha de agente, para o elo mostrar de que linha veio.
export function corDaLinha(linha: string) {
  if (linha === 'Seeker') return '#5E4B8B';
  return linha === 'GraphExplorer' ? '#8A5A2F' : '#2F5D8A';
}
