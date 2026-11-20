import database from "@db/index";
import schema from "@db/schema";

import { applyDemoTweaks } from "@services/demoTweaks";

export const isDemoSeedEnabled = process.env.EXPO_PUBLIC_DEMO_SEED === "1";

export async function seedDemo() {
  if (!isDemoSeedEnabled) return;

  const factoryCount = await database.get("factories").query().fetchCount();
  if (factoryCount > 0) return;

  const save = require("../data/demo/demoSave.json");
  const tables = applyDemoTweaks(save.tables);

  await database.write(async () => {
    const operations = Object.keys(schema.tables).flatMap((tableName) =>
      (tables[tableName] ?? []).map((raw) =>
        database.get(tableName).prepareCreateFromDirtyRaw(raw)
      )
    );

    await database.batch(operations);
  });
}
