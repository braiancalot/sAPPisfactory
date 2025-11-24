import { Model, Relation } from "@nozbe/watermelondb";
import {
  field,
  immutableRelation,
  relation,
  writer,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

import { ItemId } from "@data/item";
import Factory from "./Factory";

export default class ProductionLine extends Model {
  static table = "production_lines";

  static associations: Associations = {
    factories: { type: "belongs_to", key: "factory_id" },
  };

  @field("output_item") outputItem!: ItemId;
  @field("output_base_rate") outputBaseRate!: number;

  @immutableRelation("factories", "factory_id") factory!: Relation<Factory>;

  @writer async delete() {
    await this.markAsDeleted();
  }
}
