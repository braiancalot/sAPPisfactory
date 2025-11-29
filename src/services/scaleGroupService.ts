import database, { scaleGroupsCollection } from "@db/index";
import ProductionLine from "@db/model/ProductionLine";

export async function addScaleGroup(productionLine: ProductionLine) {
  await database.write(async () => {
    await scaleGroupsCollection.create((record) => {
      record.moduleCount = 1;
      record.clockSpeedPercent = 100;
      record.somersloopCount = 0;
      record.productionLine.set(productionLine);
    });
  });
}
