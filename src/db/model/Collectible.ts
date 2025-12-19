import { Model } from "@nozbe/watermelondb";
import { field, writer } from "@nozbe/watermelondb/decorators";

export enum CollectibleType {
  MERCE_SPHERE = "mercer_sphere",
  SOMERSLOOP = "somersloop",
  HARD_DRIVE = "hard_drive",
}

export default class Collectible extends Model {
  static table = "collectibles";

  @field("type") type!: CollectibleType;
  @field("name") name!: string;
  @field("x") x!: number;
  @field("y") y!: number;
  @field("z") z!: number;
  @field("collected") collected!: boolean;
  @field("icon") icon!: string;

  @writer async toggleCollected() {
    await this.update((item) => {
      item.collected = !item.collected;
    });
  }
}
