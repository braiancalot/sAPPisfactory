import database, { factoriesCollection } from "@db/index";

export async function addFactory(name: string) {
  await database.write(async () => {
    await factoriesCollection.create((record) => {
      record.name = name;
    });
  });
}
