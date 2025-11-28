import { Model, Query } from "@nozbe/watermelondb";
import { children, text, writer } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import ProductionLine from "./ProductionLine";

export default class Factory extends Model {
  static table = "factories";

  static associations: Associations = {
    production_lines: { type: "has_many", foreignKey: "factory_id" },
  };

  @text("name") name!: string;

  @children("production_lines") productionLines!: Query<ProductionLine>;

  @writer async updateName(newName: string) {
    await this.update((factory) => {
      factory.name = newName;
    });
  }

  @writer async delete() {
    const lines = await this.productionLines.fetch();

    for (const line of lines) {
      await this.callWriter(() => line.delete());
    }

    await this.destroyPermanently();
  }
}
