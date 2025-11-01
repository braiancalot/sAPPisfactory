import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations";
import GlobalSource from "./model/GlobalSource";

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
  modelClasses: [GlobalSource],
});

export default database;

export const globalSourcesCollection =
  database.get<GlobalSource>("global_sources");
