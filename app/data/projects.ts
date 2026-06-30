import type { Project } from '~/types/project'

export const projects: Project[] = [
  {
    slug: 'torres-do-atlantico',
    title: 'Torres do Atlântico',
    location: 'Orla marítima',
    status: 'Em construção',
    description:
      'Empreendimento de alto padrão com vista permanente para o mar, unidades de 2 e 3 suítes e área de lazer completa.',
    longDescription:
      'As Torres do Atlântico representam uma oportunidade exclusiva de investimento e moradia na orla. O projeto conta com fachada contemporânea, plantas inteligentes com integração de ambientes, acabamentos premium e infraestrutura pensada para conforto e valorização patrimonial. Stefanny Gutierres acompanha pessoalmente a curadoria comercial deste empreendimento, conectando compradores qualificados à incorporadora responsável pela obra.',
    deadline: '2026-12-31',
    progress: 67,
    featured: true,
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    floorPlanImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Vista mar', '2 e 3 suítes', 'Lazer completo', 'Vagas duplas'],
  },
  {
    slug: 'reserva-jardins',
    title: 'Reserva Jardins',
    location: 'Bairro planejado',
    status: 'Pronto para morar',
    description:
      'Condomínio fechado com casas amplas, áreas verdes e segurança 24h em região de alta valorização.',
    longDescription:
      'Reserva Jardins oferece qualidade de vida em ambiente residencial tranquilo. As unidades disponíveis passam por avaliação comercial criteriosa antes de serem apresentadas aos interessados. A consultoria de vendas conduz todo o processo de apresentação, visitas e encaminhamento à documentação junto à incorporadora.',
    deadline: '2025-06-30',
    progress: 100,
    featured: false,
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    floorPlanImage:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Casas amplas', 'Segurança 24h', 'Área verde', 'Entrega imediata'],
  },
  {
    slug: 'vista-corporate',
    title: 'Vista Corporate',
    location: 'Centro financeiro',
    status: 'Lançamento',
    description:
      'Salas comerciais e studios para investimento em polo empresarial consolidado, com alta demanda locatícia.',
    longDescription:
      'Vista Corporate é indicado para investidores que buscam renda com salas comerciais em localização estratégica. Stefanny Gutierres atua na consultoria comercial, apresentando condições, prazos e documentação do empreendimento de forma transparente, sem intermediar como corretora.',
    deadline: '2027-08-15',
    progress: 32,
    featured: false,
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    floorPlanImage:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Studios e salas', 'Centro financeiro', 'Alta locação', 'Lançamento'],
  },
]
