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
    tableSchema({
      name: "production_line_inputs",
      columns: [
        { name: "input_item", type: "string", isIndexed: true },
        { name: "input_base_rate", type: "number" },
        { name: "production_line_id", type: "string", isIndexed: true },
        { name: "source_type", type: "string" },
        {
          name: "global_source_id",
          type: "string",
          isIndexed: true,
          isOptional: true,
        },
        {
          name: "source_production_source_id",
          type: "string",
          isIndexed: true,
          isOptional: true,
        },
      ],
    }),
  ],
});
