/** Local command catalog. Answers are static strings. No network. */

export const COMMANDS = [
  {
    name: 'help',
    lines: [
      'Commands: help, about, experience, skills, projects, fleetpilot, transaction-risk, open-source, writing, resume, contact, clear.',
      'Click a suggestion or type a name. This catalog is on the page. It does not call an API.',
    ],
  },
  {
    name: 'about',
    lines: [
      'Senior Backend & Platform Engineer.',
      'I build backend systems that remain reliable under load—from high-volume APIs and third-party integrations to distributed workflows and AI-assisted operational tools.',
      '9+ years · Based in Nigeria · Remote worldwide · UTC+1.',
    ],
  },
  {
    name: 'experience',
    lines: [
      'Yakili — Senior Backend Engineer.',
      'Turing — AI Engineer (Part-time Contract) | May 2023–October 2025',
      'Paid software-engineering AI training and model evaluation, including reviewing model-generated code, reproducing failures, validating solutions, and providing structured technical feedback.',
      'Mews — integrations and incident investigation.',
      'Flexkeeping — high-volume APIs and testing.',
      'Aardvark — Python microservices and AWS delivery.',
      'OpenTeams — Django, data processing and Go.',
      'JuiceServe — distributed EV-charging systems.',
    ],
    links: [{ href: '/#experience', label: 'Experience on the home page' }],
  },
  {
    name: 'skills',
    lines: [
      'Python, Go, TypeScript, JavaScript, PHP, Java, C#, SQL, Bash, React, PostgreSQL, AWS, Docker, Redis, and RabbitMQ.',
    ],
    links: [{ href: '/cv/', label: 'CV' }],
  },
  {
    name: 'projects',
    lines: [
      'FleetPilot — a simulated fleet control plane. The provider is fake and in-process.',
      'Commerce Operations Console — a portfolio sample for failed-order investigation. It is not the incident-investigation workflow.',
      'pressly/goose pull request 1157 — an open contribution, not a maintainer role. UTF-16 behaviour is unchanged.',
    ],
    links: [{ href: '/projects/', label: 'Projects' }],
  },
  {
    name: 'fleetpilot',
    lines: [
      'FleetPilot reconciles desired state in PostgreSQL with a fake in-process provider. It does not boot a machine or call a cloud API.',
      'The case study covers the lock, retries, and the rolling update. The Dayo and Ayo note is the writing page.',
    ],
    links: [
      { href: '/case-studies/fleetpilot/', label: 'Case study' },
      { href: '/writing/fleetpilot-reconciliation/', label: 'Writing' },
      { href: 'https://github.com/chrisuzor/fleetpilot', label: 'Repository' },
    ],
  },
  {
    name: 'transaction-risk',
    lines: [
      'Every row is synthetic. Transaction risk is a logistic-regression baseline with a frozen threshold, a drift check, and an HTTP API.',
      'It is not live traffic and it does not use a real cardholder.',
    ],
    links: [
      { href: '/case-studies/transaction-risk/', label: 'Case study' },
      { href: 'https://github.com/chrisuzor/transaction-risk', label: 'Repository' },
    ],
  },
  {
    name: 'open-source',
    lines: [
      'pressly/goose pull request 1157 is open. It is a contribution, not a maintainer role.',
      'It strips one leading UTF-8 BOM before a SQL migration directive. UTF-16 behaviour stays unchanged. The pull request is not merged.',
    ],
    links: [
      { href: '/open-source/', label: 'Open source' },
      { href: 'https://github.com/pressly/goose/pull/1157', label: 'Pull request 1157' },
    ],
  },
  {
    name: 'writing',
    lines: [
      'Two FleetPilot notes.',
      'Desired state, one lock, and a short retry.',
      'Why a retry has to be safe to repeat: waits of 100 ms, 200 ms, 400 ms, and 800 ms, then dead on the fifth provider failure. The apply is safe to repeat.',
    ],
    links: [
      { href: '/writing/', label: 'Writing' },
      { href: '/writing/fleetpilot-reconciliation/', label: 'Desired state, one lock, and a short retry' },
      { href: '/writing/retries-need-idempotency/', label: 'Why a retry has to be safe to repeat' },
    ],
  },
  {
    name: 'resume',
    lines: ['The CV page has the summary, technologies, and highlights. The PDF is the public CV.'],
    links: [
      { href: '/cv/', label: 'CV' },
      { href: '/christopher-uzochukwu-cv-public.pdf', label: 'Download CV' },
    ],
  },
  {
    name: 'contact',
    lines: ['Email christopheruzochukwu8@gmail.com.', 'Abuja, Nigeria · UTC+1.'],
    links: [{ href: '/contact/', label: 'Contact' }],
  },
  {
    name: 'clear',
    lines: [],
    clear: true,
  },
];

const ALIASES = {
  cv: 'resume',
  résumé: 'resume',
  'transaction risk': 'transaction-risk',
  transactionrisk: 'transaction-risk',
  'open source': 'open-source',
  opensource: 'open-source',
  goose: 'open-source',
};

export const COMMAND_NAMES = COMMANDS.map((command) => command.name);

const HELP = COMMANDS.find((command) => command.name === 'help');

export function normalizeCommand(raw) {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/^\//, '')
    .replace(/\s+/g, ' ');
}

export function parseCommand(raw) {
  const echo = String(raw ?? '');
  const normalized = normalizeCommand(raw);
  if (!normalized) {
    return {
      type: 'empty',
      command: '',
      echo,
      lines: ['Enter a command. Type help to list them.'],
      links: [],
    };
  }
  const name = ALIASES[normalized] || normalized;
  const command = COMMANDS.find((item) => item.name === name);
  if (!command) {
    return {
      type: 'unknown',
      command: normalized,
      echo,
      lines: [
        `No command “${normalized}”.`,
        HELP.lines[0],
      ],
      links: [],
    };
  }
  if (command.clear) {
    return { type: 'clear', command: command.name, echo, lines: [], links: [] };
  }
  return {
    type: 'ok',
    command: command.name,
    echo,
    lines: command.lines,
    links: command.links || [],
  };
}
