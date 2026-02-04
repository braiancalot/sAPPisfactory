import { ItemId } from "@data/item";
import database, {
  productionLineInputsCollection,
  productionLinesCollection,
} from "@db/index";
import Factory from "@db/model/Factory";
import ProductionLine from "@db/model/ProductionLine";
import { Q } from "@nozbe/watermelondb";

export async function addProductionLine(
  factory: Factory,
  item: ItemId,
  rate: number
) {
  await database.write(async () => {
    const productionLines = await productionLinesCollection
      .query(Q.sortBy("position", Q.desc), Q.take(1))
      .fetch();

    const maxPosition =
      productionLines.length > 0 ? productionLines[0].position : -1;

    await productionLinesCollection.create((record) => {
      record.outputItem = item;
      record.outputBaseRate = rate;
      record.factory.set(factory);
      record.position = maxPosition + 1;
    });
  });
}

export async function addProductionLineWithInputs(
  factory: Factory,
  item: ItemId,
  rate: number,
  inputs: { item: ItemId; rate: number }[]
) {
  await database.write(async () => {
    const productionLines = await productionLinesCollection
      .query(Q.sortBy("position", Q.desc), Q.take(1))
      .fetch();

    const maxPosition =
      productionLines.length > 0 ? productionLines[0].position : -1;

    const newLine = await productionLinesCollection.create((record) => {
      record.outputItem = item;
      record.outputBaseRate = rate;
      record.factory.set(factory);
      record.position = maxPosition + 1;
    });

    for (const input of inputs) {
      await productionLineInputsCollection.create((record) => {
        record.inputItem = input.item;
        record.inputBaseRate = input.rate;
        record.productionLine.set(newLine);
      });
    }
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
