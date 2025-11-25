import { Model, Relation } from "@nozbe/watermelondb";
import {
  field,
  immutableRelation,
  relation,
  writer,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

import { ItemId } from "@data/item";
import ProductionLine from "./ProductionLine";
import GlobalSource from "./GlobalSource";

export default class ProductionLineInput extends Model {
  static table = "production_line_inputs";

  static associations: Associations = {
    production_lines: { type: "belongs_to", key: "production_line_id" },
    global_sources: { type: "belongs_to", key: "global_source_id" },
    production_lines_sources: {
      type: "belongs_to",
      key: "source_production_line_id",
    },
  };

  @field("input_item") inputItem!: ItemId;
  @field("input_base_rate") inputBaseRate!: number;
  @field("source_type") sourceType!: "GLOBAL_SOURCE" | "PRODUCTION_LINE";

  @immutableRelation("production_lines", "production_line_id")
  productionLine!: Relation<ProductionLine>;

  @immutableRelation("global_sources", "global_source_id")
  globalSource!: Relation<GlobalSource>;

  @immutableRelation("production_lines", "source_production_line_id")
  sourceProductionLine!: Relation<ProductionLine>;

  @writer async delete() {
    await this.markAsDeleted();
  }
}
