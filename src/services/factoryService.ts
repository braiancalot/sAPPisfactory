import database, { factoriesCollection } from "@db/index";
import { Q } from "@nozbe/watermelondb";

export async function addFactory(name: string) {
  await database.write(async () => {
    const factories = await factoriesCollection
      .query(Q.sortBy("position", Q.desc), Q.take(1))
      .fetch();

    const maxPosition = factories.length > 0 ? factories[0].position : -1;

    await factoriesCollection.create((record) => {
      record.name = name;
      record.position = maxPosition + 1;
    });
  });
}
