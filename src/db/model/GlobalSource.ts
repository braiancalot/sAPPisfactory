import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class GlobalSource extends Model {
  static table = "global_sources";

  @field("item") item: string;
  @field("total_rate_per_min") totalRatePerMin: number;
}
