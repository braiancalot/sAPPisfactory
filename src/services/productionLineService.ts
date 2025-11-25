import { ItemId } from "@data/item";
import database, {
  productionLineInputsCollection,
  productionLinesCollection,
} from "@db/index";
import Factory from "@db/model/Factory";
import ProductionLine from "@db/model/ProductionLine";

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

export async function addProductionLineInput(
  productionLine: ProductionLine,
  item: ItemId,
  rate: number
) {
  await database.write(async () => {
    await productionLineInputsCollection.create((record) => {
      record.inputItem = item;
      record.inputBaseRate = rate;
      record.productionLine.set(productionLine);
    });
  });
}
