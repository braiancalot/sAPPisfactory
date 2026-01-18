import { ItemId } from "@data/item";
import database, { globalSourcesCollection } from "@db/index";
import { Q } from "@nozbe/watermelondb";

export async function addGlobalSource(item: ItemId, rate: number) {
  await database.write(async () => {
    const globalSources = await globalSourcesCollection
      .query(Q.sortBy("position", Q.desc), Q.take(1))
      .fetch();

    const maxPosition =
      globalSources.length > 0 ? globalSources[0].position : -1;

    await globalSourcesCollection.create((record) => {
      record.item = item;
      record.totalRatePerMin = rate;
      record.position = maxPosition + 1;
    });
  });
}
