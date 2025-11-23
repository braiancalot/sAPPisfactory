import { ItemId } from "@data/item";
import database, { globalSourcesCollection } from "@db/index";

export async function addGlobalSource(item: ItemId, rate: number) {
  await database.write(async () => {
    await globalSourcesCollection.create((record) => {
      record.item = item;
      record.totalRatePerMin = rate;
    });
  });
}
