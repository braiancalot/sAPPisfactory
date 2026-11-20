export type RawRecord = Record<string, any> & { id: string };
export type DemoTables = Record<string, RawRecord[]>;

// Ajustes sobre o save real para que a demo mostre os estados de alerta.
// No save original tudo terminou equilibrado, sem déficit nem insumo sem origem.
export function applyDemoTweaks(source: DemoTables): DemoTables {
  const tables: DemoTables = JSON.parse(JSON.stringify(source));

  const factoryByName = (prefix: string) =>
    tables.factories.find((f) => f.name.startsWith(prefix))!;

  const lineIn = (factoryPrefix: string, outputItem: string) =>
    tables.production_lines.find(
      (l) =>
        l.factory_id === factoryByName(factoryPrefix).id &&
        l.output_item === outputItem
    )!;

  // Minério de ferro e cobre estavam como 9999 ("infinito"). Troca por taxas críveis.
  const sourceRates: Record<string, number> = {
    iron_ore: 2700,
    copper_ore: 2160,
  };
  for (const gs of tables.global_sources) {
    if (sourceRates[gs.item] !== undefined) {
      gs.total_rate_per_min = sourceRates[gs.item];
    }
  }

  // Déficit: Deserto com uma fundição de aço a menos.
  const dsSteel = lineIn("DS ", "steel_ingot");
  const dsSteelGroup = tables.scale_groups.find(
    (g) => g.production_line_id === dsSteel.id
  )!;
  dsSteelGroup.module_count = 3;

  // Aviso: combustível de foguete da Cratera Azul sem origem definida.
  const caFuel = lineIn("CA ", "packaged_rocket_fuel");
  const fuelInput = tables.production_line_inputs.find(
    (i) => i.production_line_id === caFuel.id && i.input_item === "rocket_fuel"
  )!;
  fuelInput.source_type = null;
  fuelInput.global_source_id = null;

  // Aviso: aço do Gerador de campo magnético sem origem. Na demo ele é
  // associado de volta ao aço do Deserto, o que gera o déficit de -30.
  const dsGenerator = lineIn("DS ", "magnetic_field_generator");
  const steelInput = tables.production_line_inputs.find(
    (i) =>
      i.production_line_id === dsGenerator.id && i.input_item === "steel_ingot"
  )!;
  steelInput.source_type = null;
  steelInput.source_production_line_id = null;

  return tables;
}
