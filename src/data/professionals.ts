
export interface Professional {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  specialty: string;
  experience: string;
  location: string;
  services: number;
  badges: string[];
  joinDate: string;
  description: string;
  stats: {
    services: number;
    rating: number;
    years: number;
  };
  inactiveReason?: string;
  inactiveSince?: string;
}

export const activeProfessionals: Professional[] = [
  {
    id: 1,
    name: "Ana Costa",
    avatar: "👩‍💼",
    phone: "(11) 99999-0001",
    rating: 4.9,
    specialty: "Limpeza Residencial",
    experience: "3 anos",
    location: "São Paulo - SP",
    services: 156,
    badges: ["Pontual", "Confiável"],
    joinDate: "2021-03-15",
    description: "Especialista em limpeza residencial com foco em qualidade e pontualidade. Experiência com todos os tipos de residências.",
    stats: {
      services: 156,
      rating: 4.9,
      years: 3
    }
  },
  {
    id: 2,
    name: "Carla Lima",
    avatar: "👩‍🔧",
    phone: "(11) 99999-0002",
    rating: 4.7,
    specialty: "Limpeza Comercial",
    experience: "5 anos",
    location: "São Paulo - SP",
    services: 203,
    badges: ["Experiente", "Comercial"],
    joinDate: "2019-08-20",
    description: "Profissional experiente em limpeza comercial, trabalha com empresas de todos os portes.",
    stats: {
      services: 203,
      rating: 4.7,
      years: 5
    }
  },
  {
    id: 3,
    name: "Rita Souza",
    avatar: "👩‍🎨",
    phone: "(11) 99999-0003",
    rating: 4.8,
    specialty: "Limpeza Pós-Obra",
    experience: "4 anos",
    location: "São Paulo - SP",
    services: 89,
    badges: ["Pós-Obra", "Especialista"],
    joinDate: "2020-12-10",
    description: "Especialista em limpeza pós-obra, trabalha com construtoras e reformas residenciais.",
    stats: {
      services: 89,
      rating: 4.8,
      years: 4
    }
  },
  {
    id: 4,
    name: "Maria Santos",
    avatar: "👩‍💻",
    phone: "(11) 99999-0004",
    rating: 4.6,
    specialty: "Limpeza Geral",
    experience: "2 anos",
    location: "São Paulo - SP",
    services: 78,
    badges: ["Versátil", "Eficiente"],
    joinDate: "2022-01-30",
    description: "Profissional versátil que atende diversos tipos de serviços de limpeza com excelência.",
    stats: {
      services: 78,
      rating: 4.6,
      years: 2
    }
  }
];

export const inactiveProfessionals: Professional[] = [
  {
    id: 5,
    name: "Joana Silva",
    avatar: "👩‍⚕️",
    phone: "(11) 99999-0005",
    rating: 4.3,
    specialty: "Limpeza Residencial",
    experience: "1 ano",
    location: "São Paulo - SP",
    services: 34,
    badges: ["Iniciante"],
    joinDate: "2023-06-15",
    description: "Profissional em início de carreira, com dedicação e vontade de aprender.",
    stats: {
      services: 34,
      rating: 4.3,
      years: 1
    },
    inactiveReason: "Licença maternidade",
    inactiveSince: "2024-01-10"
  },
  {
    id: 6,
    name: "Paula Oliveira",
    avatar: "👩‍🏫",
    phone: "(11) 99999-0006",
    rating: 4.5,
    specialty: "Limpeza Comercial",
    experience: "6 anos",
    location: "São Paulo - SP",
    services: 267,
    badges: ["Veterana", "Confiável"],
    joinDate: "2018-04-12",
    description: "Profissional experiente que decidiu fazer uma pausa na carreira.",
    stats: {
      services: 267,
      rating: 4.5,
      years: 6
    },
    inactiveReason: "Pausa voluntária",
    inactiveSince: "2023-12-20"
  }
];
