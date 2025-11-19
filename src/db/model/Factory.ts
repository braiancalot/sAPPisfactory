import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export default class Factory extends Model {
  static table = "factories";

  @text("name") name!: string;
}
