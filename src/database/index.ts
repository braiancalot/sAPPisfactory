import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./model/schema";
import migrations from "./model/migrations";

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
  modelClasses: [],
});

export default database;
