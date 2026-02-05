export const MAINTENANCE_TYPES = {
  OLEO: "OLEO",
  FILTRO_OLEO: "FILTRO_OLEO",
  FILTRO_AR: "FILTRO_AR",
  FILTRO_COMBUSTIVEL: "FILTRO_COMBUSTIVEL",
  FILTRO_AC: "FILTRO_AC",
  CORREIA_DENTADA: "CORREIA_DENTADA",
  CORREIA_ALTERNADOR: "CORREIA_ALTERNADOR",
  VELAS: "VELAS",
  CABOS_VELA: "CABOS_VELA",
  PASTILHA_FREIO: "PASTILHA_FREIO",
  DISCO_FREIO: "DISCO_FREIO",
  FLUIDO_FREIO: "FLUIDO_FREIO",
  FLUIDO_ARREFECIMENTO: "FLUIDO_ARREFECIMENTO",
  FLUIDO_DIRECAO: "FLUIDO_DIRECAO",
  OLEO_CAMBIO: "OLEO_CAMBIO",
  SUSPENSAO: "SUSPENSAO",
  AMORTECEDOR: "AMORTECEDOR",
  BATERIA: "BATERIA",
  PNEUS: "PNEUS",
  ALINHAMENTO: "ALINHAMENTO",
  BALANCEAMENTO: "BALANCEAMENTO",
  AR_CONDICIONADO: "AR_CONDICIONADO",
  EMBREAGEM: "EMBREAGEM",
  CUSTOM: "CUSTOM",
} as const;

export type MaintenanceType = (typeof MAINTENANCE_TYPES)[keyof typeof MAINTENANCE_TYPES];

export function isValidMaintenanceType(value: string): value is MaintenanceType {
  return Object.values(MAINTENANCE_TYPES).includes(value as MaintenanceType);
}

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  OLEO: "Óleo do motor",
  FILTRO_OLEO: "Filtro de óleo",
  FILTRO_AR: "Filtro de ar",
  FILTRO_COMBUSTIVEL: "Filtro de combustível",
  FILTRO_AC: "Filtro do ar-condicionado",
  CORREIA_DENTADA: "Correia dentada",
  CORREIA_ALTERNADOR: "Correia do alternador",
  VELAS: "Velas de ignição",
  CABOS_VELA: "Cabos de vela",
  PASTILHA_FREIO: "Pastilhas de freio",
  DISCO_FREIO: "Discos de freio",
  FLUIDO_FREIO: "Fluido de freio",
  FLUIDO_ARREFECIMENTO: "Fluido de arrefecimento",
  FLUIDO_DIRECAO: "Fluido de direção",
  OLEO_CAMBIO: "Óleo do câmbio",
  SUSPENSAO: "Suspensão",
  AMORTECEDOR: "Amortecedores",
  BATERIA: "Bateria",
  PNEUS: "Pneus",
  ALINHAMENTO: "Alinhamento",
  BALANCEAMENTO: "Balanceamento",
  AR_CONDICIONADO: "Ar-condicionado",
  EMBREAGEM: "Embreagem",
  CUSTOM: "Personalizado",
};
