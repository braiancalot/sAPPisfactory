import { ItemId } from "@data/item";
import database, { productionLinesCollection } from "@db/index";
import Factory from "@db/model/Factory";

export async function addProductionLine(
  factory: Factory,
  item: ItemId,
  rate: number
) {
  await database.write(async () => {
    await productionLinesCollection.create((record) => {
      record.outputItem = item;
      record.outputBaseRate = rate;
      record.factory.set(factory);
    });
  });
}
