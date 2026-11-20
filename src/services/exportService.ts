import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import database from "@db/index";
import schema from "@db/schema";

export async function exportDatabaseAsJson() {
  const tables: Record<string, unknown[]> = {};

  for (const tableName of Object.keys(schema.tables)) {
    const records = await database.get(tableName).query().fetch();
    tables[tableName] = records.map((record) => record._raw);
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: schema.version,
    tables,
  };

  const fileUri = `${FileSystem.cacheDirectory}sappisfactory-export.json`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload));

  await Sharing.shareAsync(fileUri, {
    mimeType: "application/json",
    dialogTitle: "Exportar dados",
  });
}
