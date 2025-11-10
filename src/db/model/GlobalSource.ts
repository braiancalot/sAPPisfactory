import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

import { ItemId } from "@data/item";
export default class GlobalSource extends Model {
  static table = "global_sources";

  @field("item") item!: ItemId;
  @field("total_rate_per_min") totalRatePerMin!: number;
}
