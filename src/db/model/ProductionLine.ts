import { Model, Q, Query, Relation } from "@nozbe/watermelondb";
import {
  children,
  field,
  immutableRelation,
  writer,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

import { ItemId } from "@data/item";
import Factory from "./Factory";
import ProductionLineInput from "./ProductionLineInput";
import ScaleGroup from "./ScaleGroup";

export default class ProductionLine extends Model {
  static table = "production_lines";

  static associations: Associations = {
    factories: { type: "belongs_to", key: "factory_id" },
    production_line_inputs: {
      type: "has_many",
      foreignKey: "production_line_id",
    },
    scale_groups: {
      type: "has_many",
      foreignKey: "production_line_id",
    },
  };

  @field("output_item") outputItem!: ItemId;
  @field("output_base_rate") outputBaseRate!: number;

  @immutableRelation("factories", "factory_id") factory!: Relation<Factory>;

  @children("production_line_inputs")
  inputs!: Query<ProductionLineInput>;

  @children("scale_groups")
  scaleGroups!: Query<ScaleGroup>;

  @writer async updateOutputBaseRate(newRate: number) {
    await this.update((productionLine) => {
      productionLine.outputBaseRate = newRate;
    });
  }

  @writer async delete() {
    await this.inputs.destroyAllPermanently();
    await this.scaleGroups.destroyAllPermanently();

    const usingInputs = await this.collection.database.collections
      .get<ProductionLineInput>("production_line_inputs")
      .query(Q.where("source_production_line_id", this.id))
      .fetch();

    for (const input of usingInputs) {
      await this.callWriter(() => input.clearSourceProductionLineReference());
    }

    await this.destroyPermanently();
  }
}
