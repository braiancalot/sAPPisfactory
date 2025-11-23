import { Model } from "@nozbe/watermelondb";
import { text, writer } from "@nozbe/watermelondb/decorators";

export default class Factory extends Model {
  static table = "factories";

  @text("name") name!: string;

  @writer async updateName(newName: string) {
    await this.update((factory) => {
      factory.name = newName;
    });
  }

  @writer async delete() {
    await this.markAsDeleted();
  }
}
