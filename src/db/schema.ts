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
    tableSchema({
      name: "production_lines",
      columns: [
        { name: "output_item", type: "string", isIndexed: true },
        { name: "output_base_rate", type: "number" },
        { name: "factory_id", type: "string", isIndexed: true },
      ],
    }),
  ],
});
