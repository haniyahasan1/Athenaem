export type Article = {
  title: string;
  url: string;
  abstract: string;
  source: string;
  publishedAt: string;
};

const FIELD_QUERIES: Record<string, string> = {
  chem_eng: 'chemical engineering',
  civil_eng: 'civil engineering structural',
  elec_eng: 'electrical engineering electronics',
  mech_eng: 'mechanical engineering',
  soft_eng: 'software engineering computer systems',
  biomed_eng: 'biomedical engineering medical devices',
  env_eng: 'environmental engineering water treatment',
  mechatronics: 'mechatronics robotics automation',
  cs: 'computer science',
  medicine: 'medicine clinical health',
  biology: 'biology life sciences',
  psychology: 'psychology behavior',
  neuroscience: 'neuroscience brain',
  physics: 'physics',
  math: 'mathematics',
  chemistry: 'chemistry',
  astronomy: 'astronomy astrophysics space',
  environment: 'environmental science climate',
  kinesiology: 'kinesiology exercise sport',
  arts: 'art design visual culture',
  music: 'music acoustics',
  literature: 'literature writing language',
  architecture: 'architecture urban design',
  philosophy: 'philosophy ethics',
  history: 'history society culture',
  economics: 'economics finance',
  business: 'business management',
  law: 'law legal policy',
  polisci: 'political science governance',
  social: 'social science sociology',
  anthropology: 'anthropology culture',
  linguistics: 'linguistics language',
  education: 'education learning',
  sociology: 'sociology society',
};

export async function fetchArticlesForInterest(
  fieldId: string,
  subTopic?: string
): Promise<Article[]> {
  const query = subTopic ?? FIELD_QUERIES[fieldId] ?? fieldId;
  return fetchFromCrossRef(query);
}

async function fetchFromCrossRef(query: string): Promise<Article[]> {
  const encoded = encodeURIComponent(query);
  const mailto = process.env.CONTACT_EMAIL ?? '';
  const url = `https://api.crossref.org/works?query=${encoded}&rows=20&sort=published&order=desc&filter=from-pub-date:2020${mailto ? `&mailto=${mailto}` : ''}`;

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    console.error('CrossRef error:', res.status, await res.text());
    return [];
  }

  const data = await res.json();
  const items: CrossRefItem[] = data.message?.items ?? [];
  console.log(`CrossRef returned ${items.length} results for "${query}"`);

  return items
    .filter((p) => p.title?.[0] && p.URL)
    .map((p) => {
      const dateParts = p.published?.['date-parts']?.[0];
      const publishedAt = dateParts ? dateParts.join('-') : '';
      return {
        title: p.title[0],
        abstract: p.abstract ?? 'No abstract available.',
        url: p.URL,
        source: p['container-title']?.[0] ?? 'CrossRef',
        publishedAt,
      };
    });
}

type CrossRefItem = {
  title: string[];
  URL: string;
  abstract?: string;
  published?: { 'date-parts': number[][] };
  'container-title'?: string[];
};
