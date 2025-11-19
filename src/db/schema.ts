import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "global_sources",
      columns: [
        { name: "item", type: "string", isIndexed: true },
        { name: "total_rate_per_min", type: "number" },
      ],
    }),
    tableSchema({
      name: "factories",
      columns: [{ name: "name", type: "string" }],
    }),
  ],
});
