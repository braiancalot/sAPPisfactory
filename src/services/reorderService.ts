import database from "@db/index";
import Factory from "@db/model/Factory";
import GlobalSource from "@db/model/GlobalSource";
import ProductionLine from "@db/model/ProductionLine";

type Orderable = Factory | ProductionLine | GlobalSource;

export async function updatePositions<T extends Orderable>(items: T[]) {
  await database.write(async () => {
    const updates = items.map((item, index) =>
      item.prepareUpdate((record: any) => {
        record.position = index;
      })
    );
    await database.batch(...updates);
  });
}
