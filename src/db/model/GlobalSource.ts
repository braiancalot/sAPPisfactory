import { Model } from "@nozbe/watermelondb";
import { field, writer } from "@nozbe/watermelondb/decorators";

import { ItemId } from "@data/item";

export default class GlobalSource extends Model {
  static table = "global_sources";

  @field("item") item!: ItemId;
  @field("total_rate_per_min") totalRatePerMin!: number;

  @writer async updateRate(newRate: number) {
    await this.update((globalSource) => {
      globalSource.totalRatePerMin = newRate;
    });
  }

  @writer async delete() {
    await this.markAsDeleted();
  }
}
