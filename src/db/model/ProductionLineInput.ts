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
  };

  @field("input_item") inputItem!: ItemId;
  @field("input_base_rate") inputBaseRate!: number;
  @field("source_type") sourceType!: "GLOBAL_SOURCE" | "PRODUCTION_LINE" | null;

  @immutableRelation("production_lines", "production_line_id")
  productionLine!: Relation<ProductionLine>;

  @relation("global_sources", "global_source_id")
  globalSource!: Relation<GlobalSource>;

  @relation("production_lines", "source_production_line_id")
  sourceProductionLine!: Relation<ProductionLine>;

  @writer async updateInputBaseRate(newRate: number) {
    await this.update((productionLineInput) => {
      productionLineInput.inputBaseRate = newRate;
    });
  }

  @writer async associateGlobalSource(id: string) {
    await this.update((productionLineInput) => {
      productionLineInput.sourceType = "GLOBAL_SOURCE";
      productionLineInput.globalSource.id = id;
      productionLineInput.sourceProductionLine.id = null;
    });
  }

  @writer async associateProductionLine(id: string) {
    await this.update((productionLineInput) => {
      productionLineInput.sourceType = "PRODUCTION_LINE";
      productionLineInput.sourceProductionLine.id = id;
      productionLineInput.globalSource.id = null;
    });
  }

  @writer async clearGlobalSourceReference() {
    await this.update((record) => {
      record.sourceType = null;
      record.globalSource.id = null;
    });
  }

  @writer async clearSourceProductionLineReference() {
    await this.update((record) => {
      record.sourceType = null;
      record.sourceProductionLine.id = null;
    });
  }

  @writer async delete() {
    await this.destroyPermanently();
  }
}
