// scripts/seed.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";

async function seed() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.log("[AVISO] DATABASE_URL nao configurada.");
    process.exit(0);
  }

  const sql = neon(DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("[SEED] Iniciando seed Nestle Frota Leve...");

  // 1. Settings
  console.log("[SEED] Inserindo configuracoes...");
  await db.insert(schema.settings).values([
    { key: "ai_model", value: "google/gemini-2.5-flash" },
    { key: "publish_time", value: "07:00" },
    { key: "podcast_time", value: "07:30" },
    { key: "articles_per_day", value: 1 },
    { key: "category_proportions", value: { seguranca: 40, direcao: 35, cultura: 25 } },
    { key: "article_days", value: [false, true, true, true, true, true, false] },
    { key: "podcast_days", value: [false, true, false, true, false, true, false] },
  ]).onConflictDoNothing();

  // 2. Sources
  console.log("[SEED] Inserindo fontes...");
  await db.insert(schema.sources).values([
    { name: "ONSV - Maio Amarelo", url: "https://www.onsv.org.br", category: "seguranca", active: true },
    { name: "PRF - Policia Rodoviaria Federal", url: "https://www.gov.br/prf", category: "seguranca", active: true },
    { name: "CONTRAN", url: "https://www.gov.br/contran", category: "seguranca", active: true },
    { name: "DENATRAN", url: "https://www.gov.br/senatran", category: "direcao", active: true },
    { name: "Portal do Transito", url: "https://www.portaldotransito.com.br", category: "geral", active: true },
  ]).onConflictDoNothing();

  // 3. Articles
  console.log("[SEED] Inserindo artigos...");
  const articlesData = [
    {
      title: "Condicoes adversas: como preparar sua frota leve para dirigir na chuva",
      slug: "condicoes-adversas-frota-leve-chuva-2026-03-25",
      summary: "Dirigir sob chuva forte e uma das situacoes mais perigosas para motoristas de frota leve. Confira as melhores praticas para manter a seguranca.",
      content: `## Dirigir na chuva exige preparo\n\nCondicoes adversas como chuva forte, neblina e ventos laterais sao responsaveis por uma parcela significativa dos acidentes envolvendo frotas leves no Brasil.\n\n### Principais riscos\n\n- **Aquaplanagem**: pneus perdem contato com o asfalto em poças d'agua\n- **Visibilidade reduzida**: chuva intensa diminui drasticamente o campo de visao\n- **Frenagem comprometida**: distancia de frenagem aumenta em ate 50% no molhado\n\n### Boas praticas\n\n1. Reduza a velocidade em pelo menos 20% ao dirigir na chuva\n2. Mantenha distancia segura do veiculo a frente (o dobro do normal)\n3. Acenda os farois - nunca use pisca-alerta em movimento\n4. Verifique regularmente pneus, palhetas e sistema de freios\n5. Evite frenagens bruscas e mudancas de faixa repentinas\n\n### Maio Amarelo e a prevencao\n\nA campanha Maio Amarelo reforça que a maioria dos acidentes em condicoes adversas poderia ser evitada com preparo e atencao. Cada motorista faz a diferenca.`,
      category: "seguranca",
      imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80",
      imageSource: "pixabay",
      audioUrl: null,
      sources: [{ url: "https://www.onsv.org.br", title: "Direcao em condicoes adversas", site: "ONSV" }],
      status: "published",
      aiModel: "google/gemini-2.5-flash",
    },
    {
      title: "Direcao economica: como reduzir custos e aumentar a seguranca da frota",
      slug: "direcao-economica-custos-seguranca-frota-2026-03-24",
      summary: "A direcao economica nao so reduz o consumo de combustivel, mas tambem diminui o risco de acidentes. Entenda como aplicar na sua frota leve.",
      content: `## O que e direcao economica\n\nA direcao economica e um conjunto de tecnicas que otimiza o consumo de combustivel e reduz o desgaste do veiculo, ao mesmo tempo que promove uma conducao mais segura.\n\n### Tecnicas essenciais\n\n- **Aceleracao suave**: evite arrancadas bruscas\n- **Uso correto das marchas**: troque a marcha entre 2.000 e 2.500 RPM\n- **Antecipacao**: leia o transito a frente para evitar frenagens desnecessarias\n- **Velocidade constante**: use o piloto automatico quando possivel\n- **Motor desligado**: em paradas acima de 30 segundos, desligue o motor\n\n### Resultados comprovados\n\nEmpresas que implementam programas de direcao economica reportam:\n\n1. Reducao de 15% a 25% no consumo de combustivel\n2. Queda de 30% nos custos de manutencao\n3. Reducao de 40% nos acidentes de transito\n4. Menos multas por excesso de velocidade\n\n### Tecnologias embarcadas\n\nSistemas de telemetria e sensores modernos auxiliam o motorista com alertas em tempo real sobre padroes de conducao, tornando a direcao economica mais acessivel.`,
      category: "direcao",
      imageUrl: "https://images.unsplash.com/photo-1449965408869-ebd3fee7827f?w=800&q=80",
      imageSource: "pixabay",
      audioUrl: null,
      sources: [{ url: "https://www.portaldotransito.com.br", title: "Direcao economica e segura", site: "Portal do Transito" }],
      status: "published",
      aiModel: "google/gemini-2.5-flash",
    },
    {
      title: "Sonolencia ao volante: o perigo silencioso que mata mais que alcool",
      slug: "sonolencia-volante-perigo-silencioso-2026-03-23",
      summary: "Estudos mostram que dirigir com sono e tao perigoso quanto dirigir alcoolizado. Saiba como identificar os sinais e proteger sua equipe.",
      content: `## O perigo da sonolencia\n\nA sonolencia ao volante e responsavel por 20% dos acidentes fatais em rodovias brasileiras, segundo dados da PRF. Para motoristas de frota leve que fazem rotas longas de distribuicao, o risco e ainda maior.\n\n### Sinais de alerta\n\n- Bocejos frequentes e olhos pesados\n- Dificuldade em manter a faixa\n- Esquecimento dos ultimos quilometros percorridos\n- Piscadas longas e cabeca pendendo\n- Irritabilidade e inquietacao\n\n### O que a empresa pode fazer\n\n1. **Escalas adequadas**: respeitar os tempos de descanso obrigatorios\n2. **Ambiente de descanso**: oferecer locais para cochilos de 20 minutos\n3. **Treinamento**: ensinar motoristas a reconhecer sinais de fadiga\n4. **Tecnologia**: sistemas de monitoramento de fadiga por camera\n5. **Cultura**: encorajar motoristas a reportar quando estao cansados\n\n### A regra de ouro\n\n> Se sentir sono, pare o veiculo em local seguro e descanse. Nenhuma entrega vale mais que uma vida.`,
      category: "seguranca",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      imageSource: "pixabay",
      audioUrl: null,
      sources: [{ url: "https://www.gov.br/prf", title: "Estatisticas de acidentes por sonolencia", site: "PRF" }],
      status: "published",
      aiModel: "google/gemini-2.5-flash",
    },
    {
      title: "Manobras de risco: as situacoes mais perigosas para frota leve em areas urbanas",
      slug: "manobras-risco-frota-leve-areas-urbanas-2026-03-22",
      summary: "Baliza, re, conversoes e ultrapassagens. Conheca as manobras que mais causam acidentes em frota leve e como treinar sua equipe.",
      content: `## Manobras que exigem atencao redobrada\n\nEm areas urbanas, motoristas de frota leve enfrentam diariamente situacoes que exigem habilidade e atencao maxima. Vans e utilitarios tem pontos cegos maiores que carros de passeio.\n\n### Top 5 manobras de risco\n\n1. **Re em vias movimentadas**: responsavel por 35% dos sinistros de frota leve\n2. **Conversao a esquerda**: o cruzamento mais perigoso em intersecoes\n3. **Ultrapassagem em via simples**: risco de colisao frontal\n4. **Estacionamento em fila dupla**: exposicao ao transito\n5. **Acesso a garagens e docas**: espaco restrito com pedestres\n\n### Treinamento pratico\n\nA melhor forma de prevenir acidentes em manobras e o treinamento pratico regular:\n\n- Simulacoes em areas controladas\n- Uso de cameras de re e sensores\n- Acompanhamento de instrutor\n- Feedback baseado em telemetria\n\n### Empatia no transito\n\nLembre-se: ao redor do seu veiculo sempre ha pedestres, ciclistas e motociclistas. A empatia no transito salva vidas.`,
      category: "cultura",
      imageUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&q=80",
      imageSource: "pixabay",
      audioUrl: null,
      sources: [{ url: "https://www.onsv.org.br", title: "Manobras seguras em areas urbanas", site: "ONSV" }],
      status: "published",
      aiModel: "google/gemini-2.5-flash",
    },
    {
      title: "Empatia e colaboracao: o lema do Maio Amarelo 2026 na pratica",
      slug: "empatia-colaboracao-maio-amarelo-2026-2026-03-21",
      summary: "O Maio Amarelo 2026 traz como tema central a empatia no transito. Entenda como aplicar esse conceito na gestao da sua frota leve.",
      content: `## Maio Amarelo 2026: Empatia salva vidas\n\nO movimento Maio Amarelo completa mais um ano com uma mensagem poderosa: a empatia no transito e a chave para reduzir acidentes. Para frotas leves de distribuicao, isso significa repensar a relacao com todos os usuarios da via.\n\n### O que e empatia no transito\n\n- Se colocar no lugar do pedestre que espera para atravessar\n- Entender que o ciclista tem o mesmo direito a via\n- Respeitar o motociclista que esta entre os veiculos\n- Dar passagem quando alguem precisa\n\n### Acoes praticas para frotas\n\n1. **Campanhas internas**: promova o tema Maio Amarelo com sua equipe\n2. **Adesivos nos veiculos**: sinalize que sua frota apoia a seguranca\n3. **Metas de zero acidentes**: estabeleca e monitore\n4. **Reconhecimento**: premie motoristas com melhor desempenho\n5. **Dialogo aberto**: crie canais para relato de quase-acidentes\n\n### Numeros que importam\n\n- 33 mil mortes no transito por ano no Brasil\n- 60% envolvem motociclistas e pedestres\n- A maioria poderia ser evitada com mais atencao e empatia`,
      category: "cultura",
      imageUrl: "https://images.unsplash.com/photo-1532939163844-547f958e91b4?w=800&q=80",
      imageSource: "pixabay",
      audioUrl: null,
      sources: [{ url: "https://www.onsv.org.br/maioamarelo", title: "Maio Amarelo 2026", site: "ONSV" }],
      status: "published",
      aiModel: "google/gemini-2.5-flash",
    },
    {
      title: "Conducao segura em diferentes terrenos: da cidade ao campo",
      slug: "conducao-segura-diferentes-terrenos-2026-03-20",
      summary: "Motoristas de frota leve frequentemente transitam entre asfalto, estrada de terra e areas rurais. Cada terreno exige tecnicas diferentes.",
      content: `## Adaptando a conducao ao terreno\n\nFrotas leves de distribuicao muitas vezes precisam sair do asfalto perfeito e enfrentar estradas de terra, cascalho e ate lama. A tecnica de conducao precisa mudar em cada situacao.\n\n### Asfalto urbano\n\n- Atencao a pedestres e ciclistas\n- Respeitar limites de velocidade (geralmente 40-60 km/h)\n- Cuidado com buracos e lombadas\n\n### Estrada de terra\n\n- Reduza a velocidade para 40-50% do limite do asfalto\n- Mantenha distancia maior (poeira reduz visibilidade)\n- Evite frenagens bruscas (risco de derrapagem)\n- Segure o volante com firmeza\n\n### Vias nao pavimentadas com lama\n\n- Use marchas baixas e tracao constante\n- Nao acelere demais (as rodas patinam)\n- Siga as trilhas ja formadas\n- Se atolar, nao insista - peca ajuda\n\n### Checklist pre-viagem\n\n1. Verifique pressao e estado dos pneus\n2. Confirme que os freios estao em dia\n3. Leve ferramentas basicas e triangulo\n4. Informe a central sobre a rota planejada`,
      category: "direcao",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      imageSource: "pixabay",
      audioUrl: null,
      sources: [{ url: "https://www.portaldotransito.com.br", title: "Conducao em diferentes terrenos", site: "Portal do Transito" }],
      status: "published",
      aiModel: "google/gemini-2.5-flash",
    },
  ];

  for (const article of articlesData) {
    await db.insert(schema.articles).values(article as typeof schema.articles.$inferInsert).onConflictDoNothing();
  }

  // 4. Subscribers
  console.log("[SEED] Inserindo assinantes...");
  await db.insert(schema.subscribers).values([
    { email: "rolf@nestle.com.br" },
    { email: "seguranca@nestle.com.br" },
    { email: "frotaleve@nestle.com.br" },
  ]).onConflictDoNothing();

  console.log("[SEED] Concluido com sucesso!");
  console.log("   - 6 artigos (Maio Amarelo / Frota Leve)");
  console.log("   - 5 fontes");
  console.log("   - 7 configuracoes");
  console.log("   - 3 assinantes");
}

seed().catch(console.error);
