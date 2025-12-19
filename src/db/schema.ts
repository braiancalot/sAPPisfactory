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
          name: "source_production_line_id",
          type: "string",
          isIndexed: true,
          isOptional: true,
        },
      ],
    }),
    tableSchema({
      name: "scale_groups",
      columns: [
        { name: "module_count", type: "number" },
        { name: "clock_speed_percent", type: "number" },
        { name: "somersloop_count", type: "number" },
        { name: "production_line_id", type: "string", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "collectibles",
      columns: [
        { name: "type", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "x", type: "number" },
        { name: "y", type: "number" },
        { name: "z", type: "number" },
        { name: "collected", type: "boolean" },
        { name: "icon", type: "string" },
      ],
    }),
  ],
});
