import { Model, Relation } from "@nozbe/watermelondb";
import {
  field,
  immutableRelation,
  writer,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

import ProductionLine from "./ProductionLine";

export default class ScaleGroup extends Model {
  static table = "scale_groups";

  static associations: Associations = {
    production_lines: { type: "belongs_to", key: "production_line_id" },
  };

  @field("module_count") moduleCount!: number;
  @field("clock_speed_percent") clockSpeedPercent!: number;
  @field("somersloop_count") somersloopCount!: number;

  @immutableRelation("production_lines", "production_line_id")
  productionLine!: Relation<ProductionLine>;

  @writer async updateClockSpeed(newClock: number) {
    await this.update((group) => {
      group.clockSpeedPercent = newClock;
    });
  }

  @writer async updateModuleCount(newCount: number) {
    await this.update((group) => {
      group.moduleCount = newCount;
    });
  }

  @writer async updateSomersloopCount(newCount: number) {
    await this.update((group) => {
      group.somersloopCount = newCount;
    });
  }

  @writer async delete() {
    await this.destroyPermanently();
  }
}
