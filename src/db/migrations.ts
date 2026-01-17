import {
  addColumns,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: "factories",
          columns: [{ name: "position", type: "number" }],
        }),
        addColumns({
          table: "production_lines",
          columns: [{ name: "position", type: "number" }],
        }),
        addColumns({
          table: "global_sources",
          columns: [{ name: "position", type: "number" }],
        }),
      ],
    },
  ],
});
