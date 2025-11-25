import { Model, Query } from "@nozbe/watermelondb";
import { children, field, writer } from "@nozbe/watermelondb/decorators";

import { ItemId } from "@data/item";
import { Associations } from "@nozbe/watermelondb/Model";
import ProductionLineInput from "./ProductionLineInput";

export default class GlobalSource extends Model {
  static table = "global_sources";

  static associations: Associations = {
    production_line_inputs: {
      type: "has_many",
      foreignKey: "global_source_id",
    },
  };

  @field("item") item!: ItemId;
  @field("total_rate_per_min") totalRatePerMin!: number;

  @children("production_line_inputs")
  consumingInputs!: Query<ProductionLineInput>;

  @writer async updateRate(newRate: number) {
    await this.update((globalSource) => {
      globalSource.totalRatePerMin = newRate;
    });
  }

  @writer async delete() {
    await this.markAsDeleted();
  }
}
