import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations";
import GlobalSource from "./model/GlobalSource";
import Factory from "./model/Factory";
import ProductionLine from "./model/ProductionLine";
import ProductionLineInput from "./model/ProductionLineInput";
import ScaleGroup from "./model/ScaleGroup";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: false,
  onSetUpError: (error) => {
    console.error("Database failed to load:", error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [
    GlobalSource,
    Factory,
    ProductionLine,
    ProductionLineInput,
    ScaleGroup,
  ],
});

export default database;

export const globalSourcesCollection =
  database.get<GlobalSource>("global_sources");

export const factoriesCollection = database.get<Factory>("factories");

export const productionLinesCollection =
  database.get<ProductionLine>("production_lines");

export const productionLineInputsCollection = database.get<ProductionLineInput>(
  "production_line_inputs"
);

export const scaleGroupsCollection = database.get<ScaleGroup>("scale_groups");
