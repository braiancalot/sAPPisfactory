import { getIconByItemId } from "../assets/iconMapper";
import { ImageSourcePropType } from "react-native";

export const ITEM_DATABASE = {
  // --- TIER 0 & 1: O Início (Ferro, Cobre, Calcário) ---
  iron_ore: {
    name: "Minério de ferro",
    icon: getIconByItemId("iron_ore"),
  },
  iron_ingot: {
    name: "Lingote de ferro",
    icon: getIconByItemId("iron_ingot"),
  },
  iron_plates: {
    name: "Chapa de ferro",
    icon: getIconByItemId("iron_plates"),
  },
  iron_rod: {
    name: "Barra de ferro",
    icon: getIconByItemId("iron_rod"),
  },
  screws: {
    name: "Parafuso",
    icon: getIconByItemId("screws"),
  },
  reinforced_iron_plate: {
    name: "Chapa de ferro reforçada",
    icon: getIconByItemId("reinforced_iron_plate"),
  },
  copper_ore: {
    name: "Minério de cobre",
    icon: getIconByItemId("copper_ore"),
  },
  copper_ingot: {
    name: "Lingote de cobre",
    icon: getIconByItemId("copper_ingot"),
  },
  wire: {
    name: "Fio",
    icon: getIconByItemId("wire"),
  },
  cables: {
    name: "Cabo",
    icon: getIconByItemId("cables"),
  },
  copper_sheet: {
    name: "Chapa de cobre",
    icon: getIconByItemId("copper_sheet"),
  },
  copper_powder: {
    name: "Pó de cobre",
    icon: getIconByItemId("copper_powder"),
  },
  limestone: {
    name: "Calcário",
    icon: getIconByItemId("limestone"),
  },
  concrete: {
    name: "Concreto",
    icon: getIconByItemId("concrete"),
  },

  // --- TIER 2: Montagem de Peças ---
  rotor: {
    name: "Rotor",
    icon: getIconByItemId("rotor"),
  },
  modular_frame: {
    name: "Armação modular",
    icon: getIconByItemId("modular_frame"),
  },
  smart_plating: {
    name: "Chapa avançada inteligente",
    icon: getIconByItemId("smart_plating"),
  },

  // --- TIER 3 & 4: Carvão e Aço ---
  coal_ore: {
    name: "Carvão",
    icon: getIconByItemId("coal_ore"),
  },
  steel_ingot: {
    name: "Lingote de aço",
    icon: getIconByItemId("steel_ingot"),
  },
  steel_beam: {
    name: "Viga de aço",
    icon: getIconByItemId("steel_beam"),
  },
  steel_pipe: {
    name: "Tubo de aço",
    icon: getIconByItemId("steel_pipe"),
  },
  encased_steel_beam: {
    name: "Viga de industrial revestida",
    icon: getIconByItemId("encased_steel_beam"),
  },
  stator: {
    name: "Estator",
    icon: getIconByItemId("stator"),
  },
  engine: {
    name: "Motor",
    icon: getIconByItemId("engine"),
  },
  modular_engine: {
    name: "Motor modular",
    icon: getIconByItemId("modular_engine"),
  },
  versatile_framework: {
    name: "Estrutura versátil",
    icon: getIconByItemId("versatile_framework"),
  },
  automated_wiring: {
    name: "Fiação automatizada",
    icon: getIconByItemId("automated_wiring"),
  },

  // --- Caterium e Eletrônicos Básicos ---
  caterium_ore: {
    name: "Minério de caterium",
    icon: getIconByItemId("caterium_ore"),
  },
  caterium_ingot: {
    name: "Lingote de caterium",
    icon: getIconByItemId("caterium_ingot"),
  },
  quick_wire: {
    name: "Fio veloz",
    icon: getIconByItemId("quick_wire"),
  },
  ai_limiter: {
    name: "Limitador de IA",
    icon: getIconByItemId("ai_limiter"),
  },
  circuit_board: {
    name: "Placa de circuito",
    icon: getIconByItemId("circuit_board"),
  },
  high_speed_connector: {
    name: "Conector de alta velocidade",
    icon: getIconByItemId("high_speed_connector"),
  },

  // --- TIER 5 & 6: Petróleo e Manufatura Pesada ---
  plastic: {
    name: "Plástico",
    icon: getIconByItemId("plastic"),
  },
  rubber: {
    name: "Borracha",
    icon: getIconByItemId("rubber"),
  },
  polymer_resin: {
    name: "Resina de polímero",
    icon: getIconByItemId("polymer_resin"),
  },
  petroleum_coke: {
    name: "Coque de petróleo",
    icon: getIconByItemId("petroleum_coke"),
  },
  fabric: {
    name: "Tecido",
    icon: getIconByItemId("fabric"),
  },
  heavy_modular_frame: {
    name: "Armação modular pesada",
    icon: getIconByItemId("heavy_modular_frame"),
  },
  computer: {
    name: "Computador",
    icon: getIconByItemId("computer"),
  },
  adaptive_control_unit: {
    name: "Unidade de controle adaptável",
    icon: getIconByItemId("adaptive_control_unit"),
  },

  // --- Quartzo e Exploração ---
  raw_quartz: {
    name: "Quartzo bruto",
    icon: getIconByItemId("raw_quartz"),
  },
  quartz_crystal: {
    name: "Cristal de quartzo",
    icon: getIconByItemId("quartz_crystal"),
  },
  silica: {
    name: "Sílica",
    icon: getIconByItemId("silica"),
  },
  crystal_oscillator: {
    name: "Oscilador de cristal",
    icon: getIconByItemId("crystal_oscillator"),
  },
  power_shard: {
    name: "Estilhaço de energia",
    icon: getIconByItemId("power_shard"),
  },

  // --- Enxofre ---
  sulfur: {
    name: "Enxofre",
    icon: getIconByItemId("sulfur"),
  },

  // --- TIER 7: Alumínio e Baterias ---
  bauxite: {
    name: "Bauxita",
    icon: getIconByItemId("bauxite"),
  },
  aluminium_scrap: {
    name: "Sucata de alumínio",
    icon: getIconByItemId("aluminium_scrap"),
  },
  aluminium_ingot: {
    name: "Lingote de alumínio",
    icon: getIconByItemId("aluminium_ingot"),
  },
  aluminium_casing: {
    name: "Caixote de alumínio",
    icon: getIconByItemId("aluminium_casing"),
  },
  aluminium_sheet: {
    name: "Chapa de alumínio",
    icon: getIconByItemId("aluminium_sheet"),
  },
  heat_sink: {
    name: "Dissipador de calor",
    icon: getIconByItemId("heat_sink"),
  },
  cooling_system: {
    name: "Sistema de refrigeração",
    icon: getIconByItemId("cooling_system"),
  },
  radio_control_unit: {
    name: "Unidade de controle de rádio",
    icon: getIconByItemId("radio_control_unit"),
  },
  fused_modular_frame: {
    name: "Armação modular fundida",
    icon: getIconByItemId("fused_modular_frame"),
  },
  battery: {
    name: "Bateria",
    icon: getIconByItemId("battery"),
  },
  turbo_motor: {
    name: "Motor turbo",
    icon: getIconByItemId("turbo_motor"),
  },
  supercomputer: {
    name: "Supercomputador",
    icon: getIconByItemId("supercomputer"),
  },
  assembly_director_system: {
    name: "Sistema diretor de montagem",
    icon: getIconByItemId("assembly_director_system"),
  },

  // --- Líquidos e Gases
  water: {
    name: "Água",
    icon: getIconByItemId("water"),
  },
  crude_oil: {
    name: "Petróleo",
    icon: getIconByItemId("crude_oil"),
  },
  heavy_oil_residue: {
    name: "Resíduo pesado de petróleo",
    icon: getIconByItemId("heavy_oil_residue"),
  },
  fuel: {
    name: "Combustível",
    icon: getIconByItemId("fuel"),
  },
  liquid_biofuel: {
    name: "Biocombustível líquido",
    icon: getIconByItemId("liquid_biofuel"),
  },
  liquid_turbo_fuel: {
    name: "Turbocombustível",
    icon: getIconByItemId("liquid_turbo_fuel"),
  },
  alumina_solution: {
    name: "Solução de alumina",
    icon: getIconByItemId("alumina_solution"),
  },
  sulfuric_acid: {
    name: "Ácido sulfúrico",
    icon: getIconByItemId("sulfuric_acid"),
  },
  nitric_acid: {
    name: "Ácido nítrico",
    icon: getIconByItemId("nitric_acid"),
  },
  dissolved_silica: {
    name: "Solução de sílica",
    icon: getIconByItemId("dissolved_silica"),
  },
  nitrogen_gas: {
    name: "Gás nitrogênio",
    icon: getIconByItemId("nitrogen_gas"),
  },
  rocket_fuel: {
    name: "Combustível de foguete",
    icon: getIconByItemId("rocket_fuel"),
  },
  ionized_fuel: {
    name: "Combustível ionizado",
    icon: getIconByItemId("ionized_fuel"),
  },
  dark_matter_residue: {
    name: "Resíduo de Matéria escura",
    icon: getIconByItemId("dark_matter_residue"),
  },
  excited_photonic_matter: {
    name: "Matéria fotônica energizada",
    icon: getIconByItemId("excited_photonic_matter"),
  },

  // --- TIER 8: Nuclear ---
  uranium_ore: {
    name: "Urânio",
    icon: getIconByItemId("uranium_ore"),
  },
  encased_steel_cell: {
    name: "Célula de urânio revestida",
    icon: getIconByItemId("nuclear_cell"),
  },
  electromagnetic_control_rod: {
    name: "Barra de controle eletromagnética",
    icon: getIconByItemId("electromagnetic_control_rod"),
  },
  non_fissile_uranium: {
    name: "Urânio não físsil",
    icon: getIconByItemId("non_fissile_uranium"),
  },
  plutonium_pellet: {
    name: "Pastilha de plutônio",
    icon: getIconByItemId("plutonium_pellet"),
  },
  encased_plutonium_cell: {
    name: "Célula de plutônio revestida",
    icon: getIconByItemId("encased_plutonium_cell"),
  },
  magnetic_field_generator: {
    name: "Gerador de campo magnético",
    icon: getIconByItemId("magnetic_field_generator"),
  },
  thermal_propulsion_rocket: {
    name: "Foguete de propulsão térmica",
    icon: getIconByItemId("thermal_propulsion_rocket"),
  },
  nuclear_pasta: {
    name: "Pasta nuclear",
    icon: getIconByItemId("nuclear_pasta"),
  },

  // --- TIER 9: Tecnologias Quânticas e Alienígenas (1.0) ---
  sam_ore: {
    name: "Minério de MAE",
    icon: getIconByItemId("sam_ore"),
  },
  reanimated_sam: {
    name: "MAE reanimada",
    icon: getIconByItemId("reanimated_sam"),
  },
  sam_fluctuator: {
    name: "Flutuador de MAE",
    icon: getIconByItemId("sam_fluctuator"),
  },
  diamonds: {
    name: "Diamantes",
    icon: getIconByItemId("diamonds"),
  },
  time_crystal: {
    name: "Cronocristal",
    icon: getIconByItemId("time_crystal"),
  },
  dark_matter_crystal: {
    name: "Cristal de matéria escura",
    icon: getIconByItemId("dark_matter_crystal"),
  },
  ficsite_ingot: {
    name: "Lingote de ficsita",
    icon: getIconByItemId("ficsite_ingot"),
  },
  ficsite_trigon: {
    name: "Trígono de ficsita",
    icon: getIconByItemId("ficsite_trigon"),
  },
  singularity_cell: {
    name: "Célula de singularidade",
    icon: getIconByItemId("singularity_cell"),
  },
  neural_quantum_processor: {
    name: "Processador quântico neural",
    icon: getIconByItemId("neural_quantum_processor"),
  },
  superposition_oscillator: {
    name: "Oscilador de superposição",
    icon: getIconByItemId("superposition_oscillator"),
  },
  ficsonium_cell: {
    name: "Ficsônio",
    icon: getIconByItemId("ficsonium_cell"),
  },
  ficsonium_fuel_rod: {
    name: "Barra de combustível de ficsônio",
    icon: getIconByItemId("ficsonium_fuel_rod"),
  },
  ai_expansion_server: {
    name: "Servidor de expansão de IA",
    icon: getIconByItemId("ai_expansion_server"),
  },
  ballistic_warp_drive: {
    name: "Motor de dobra balístico",
    icon: getIconByItemId("ballistic_warp_drive"),
  },
  biochemical_sculptor: {
    name: "Escultor bioquímico",
    icon: getIconByItemId("biochemical_sculptor"),
  },
};

export type ItemId = keyof typeof ITEM_DATABASE;

export type Item = {
  id: ItemId;
  name: string;
  icon: ImageSourcePropType;
};

export const ITEM_LIST: Item[] = (
  Object.entries(ITEM_DATABASE) as [ItemId, Omit<Item, "id">][]
).map(([id, data]) => ({ id, ...data }));

export function getItemData(itemId: ItemId | undefined): Omit<Item, "id"> {
  return itemId
    ? ITEM_DATABASE[itemId]
    : { name: "Desconhecido", icon: getIconByItemId("default") };
}
