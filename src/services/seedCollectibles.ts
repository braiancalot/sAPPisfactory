import { CollectibleType } from "@db/model/Collectible";
import rawData from "../data/collectibles.json";
import database, { collectiblesCollection } from "@db/index";

export async function seedCollectibles() {
  const count = await collectiblesCollection.query().fetchCount();
  if (count > 0) {
    return;
  }

  console.log("Starting collectibles seed...");

  await database.write(async () => {
    const batchOperations: ReturnType<
      typeof collectiblesCollection.prepareCreate
    >[] = [];

    rawData.forEach((item: any) => {
      const record = collectiblesCollection.prepareCreate((collectible) => {
        collectible.type = item.type;
        collectible.name = item.name;
        collectible.x = item.x;
        collectible.y = item.y;
        collectible.z = item.z;
        collectible.collected = false;
        collectible.icon = item.icon;
      });

      batchOperations.push(record);
    });

    if (batchOperations.length > 0) {
      await database.batch(batchOperations);
      console.log(`${batchOperations.length} collectibles inserted!`);
    }
  });
}
