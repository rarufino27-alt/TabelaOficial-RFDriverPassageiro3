/* ============================================================
   Referências cruzadas: palavra-chave → versículos relacionados.
   Não geramos versículos aleatórios — só os mapeados ao tema.
   ============================================================ */

const MAP: Record<string, string[]> = {
  graça: ["Efésios 2:8-9", "Tito 2:11", "Romanos 5:20-21", "2 Coríntios 12:9"],
  fé: ["Hebreus 11:1", "Romanos 10:17", "Gálatas 2:20", "Tiago 2:17"],
  esperança: ["Romanos 15:13", "Lamentações 3:22-23", "Jeremias 29:11", "1 Pedro 1:3"],
  amor: ["1 João 4:7-8", "1 Coríntios 13:4-7", "João 13:34-35", "Romanos 5:8"],
  salvação: ["Atos 4:12", "Romanos 10:9-10", "Efésios 2:8-9", "João 14:6"],
  santidade: ["1 Pedro 1:15-16", "Hebreus 12:14", "Romanos 12:1-2", "Levítico 11:44"],
  paz: ["Filipenses 4:6-7", "João 14:27", "Isaías 26:3", "Salmos 29:11"],
  juízo: ["Hebreus 4:12", "Romanos 14:12", "Eclesiastes 12:14", "Mateus 12:36"],
  obediência: ["João 14:15", "Tiago 1:22", "Deuteronômio 11:1", "1 Samuel 15:22"],
  oração: ["Filipenses 4:6", "1 Tessalonicenses 5:17", "Mateus 6:6", "Tiago 5:16"],
  alegria: ["Filipenses 4:4", "Salmos 16:11", "Neemias 8:10", "João 15:11"],
  vida: ["João 10:10", "João 14:6", "Romanos 6:23", "Colossenses 3:3-4"],
  caminho: ["Salmos 1:1-3", "Provérbios 3:5-6", "Mateus 7:13-14", "João 14:6"],
  pastor: ["Salmos 23:1", "João 10:11", "Ezequiel 34:11-12", "1 Pedro 5:4"],
  espírito: ["João 14:26", "Romanos 8:14", "Gálatas 5:22-23", "Atos 1:8"],
  cristo: ["Colossenses 1:15-20", "Hebreus 1:1-3", "Filipenses 2:5-11", "João 1:14"],
};

export function getCrossReferences(keywords: string[], limit = 5): string[] {
  const found: string[] = [];
  const lower = keywords.map((k) =>
    k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
  );
  for (const [family, refs] of Object.entries(MAP)) {
    const norm = family.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.some((k) => k === norm || k.startsWith(norm) || norm.startsWith(k))) {
      for (const r of refs) if (!found.includes(r)) found.push(r);
    }
  }
  if (found.length === 0) {
    found.push("Romanos 12:2", "Provérbios 3:5-6", "Salmos 119:105");
  }
  return found.slice(0, limit);
}
