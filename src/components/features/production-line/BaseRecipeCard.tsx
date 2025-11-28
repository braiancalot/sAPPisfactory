import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  LayoutAnimationConfig,
  LinearTransition,
} from "react-native-reanimated";

import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";

import { withObservables } from "@nozbe/watermelondb/react";
import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";

import { getItemData, ItemId } from "@data/item";
import { addProductionLineInput } from "@services/productionLineService";

import Card from "@ui/Card";
import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";
import Text from "@ui/Text";
import Button from "@ui/Button";
import PressableCard from "@ui/PressableCard";
import MenuSheet, { MenuItem } from "@ui/MenuSheet";

import AddInputModal from "@features/production-line/AddInputModal";
import EditOutputSheet from "@features/production-line/EditOutputSheet";
import EditInputSheet from "@features/production-line/EditInputSheet";
import InputRow from "@features/production-line/InputRow";
import AssociateInputSourceSheet, {
  SourceType as SourceTypes,
} from "@features/production-line/AssociateInputSourceSheet";

import { SourceType } from "@features/production-line/AssociateInputSourceSheet";
import { router } from "expo-router";

type ExternalProps = {
  productionLine: ProductionLine;
};

type Props = ExternalProps & {
  inputs: ProductionLineInput[];
};

type MenuContext =
  | { type: "output" }
  | { type: "input"; data: ProductionLineInput }
  | null;

function BaseRecipeCard({ productionLine, inputs }: Props) {
  const [addInputModalVisible, setAddInputModalVisible] = useState(false);
  const [menuContext, setMenuContext] = useState<MenuContext>(null);

  const { dismissAll } = useBottomSheetModal();

  const menuSheetRef = useRef<BottomSheetModal>(null);
  const editOutputSheetRef = useRef<BottomSheetModal>(null);
  const editInputSheetRef = useRef<BottomSheetModal>(null);
  const associateInputSourceSheetRef = useRef<BottomSheetModal>(null);

  const outputItemData = getItemData(productionLine.outputItem);

  function handleOpenAddInputModal() {
    setAddInputModalVisible(true);
  }

  function handlePressOutput() {
    setMenuContext({ type: "output" });
    menuSheetRef.current?.present();
  }

  function handleInputRowAction(input: ProductionLineInput) {
    if (!input.sourceType) {
      setMenuContext({ type: "input", data: input });
      setTimeout(() => associateInputSourceSheetRef.current?.present(), 100);
      return;
    }

    if (input.sourceType === SourceType.PRODUCTION_LINE) {
      router.push(`/production-line/${input.sourceProductionLine.id}`);
    } else if (input.sourceType === SourceType.GLOBAL_SOURCE) {
      router.push("/global-sources");
    }
  }

  function handlePressInput(input: ProductionLineInput) {
    setMenuContext({ type: "input", data: input });
    menuSheetRef.current?.present();
  }

  async function handleRequestEditOutputRate() {
    dismissAll();
    setTimeout(() => editOutputSheetRef.current?.present(), 100);
  }

  async function handleRequestEditInputRate() {
    dismissAll();
    setTimeout(() => editInputSheetRef.current?.present(), 100);
  }

  async function handleRequestAssociateSource() {
    dismissAll();
    setTimeout(() => associateInputSourceSheetRef.current?.present(), 100);
  }

  function handleCloseAddInputModal() {
    setAddInputModalVisible(false);
  }

  function handleCancelAll() {
    dismissAll();
  }

  async function handleUpdateOutputRate(newRate: number) {
    await productionLine.updateOutputBaseRate(newRate);
    dismissAll();
  }

  async function handleUpdateInputRate(newRate: number) {
    if (menuContext?.type === "input" && menuContext.data) {
      await menuContext.data.updateInputBaseRate(newRate);
      dismissAll();
    }
  }

  async function handleAssociateInputSource(id: string, type: SourceType) {
    const inputToUpdate =
      menuContext?.type === "input" ? menuContext.data : null;

    if (!inputToUpdate) return;

    if (type === SourceTypes.GLOBAL_SOURCE) {
      await inputToUpdate.associateGlobalSource(id);
    } else if (type === SourceTypes.PRODUCTION_LINE) {
      await inputToUpdate.associateProductionLine(id);
    }

    dismissAll();
  }

  async function handleAddInput(item: ItemId, rate: number) {
    await addProductionLineInput(productionLine, item, rate);
  }

  async function handleDeleteInput() {
    if (menuContext?.type === "input" && menuContext.data) {
      await menuContext.data.delete();
      dismissAll();
    }
  }

  const menuOptions = useMemo((): MenuItem[] => {
    if (!menuContext) return [];

    if (menuContext.type === "output") {
      return [
        {
          label: "Editar taxa base de produção",
          icon: "edit",
          onPress: () => handleRequestEditOutputRate(),
        },
      ];
    }

    if (menuContext.type === "input") {
      return [
        {
          label: "Associar origem",
          icon: "link",
          onPress: () => handleRequestAssociateSource(),
        },
        {
          label: "Editar taxa base de consumo",
          icon: "edit",
          onPress: () => handleRequestEditInputRate(),
        },
        {
          label: "Excluir ingrediente",
          icon: "delete",
          isDestructive: true,
          onPress: () => handleDeleteInput(),
        },
      ];
    }

    return [];
  }, [menuContext]);

  return (
    <LayoutAnimationConfig skipEntering>
      <Card>
        <View className="flex-row items-center justify-between">
          <Text variant="title" className="text-text-secondary">
            Receita base
          </Text>
        </View>

        <View className="mt-lg mb-xs px-xs">
          <Text variant="caption" className="text-text-tertiary uppercase">
            Produzindo
          </Text>
        </View>

        <PressableCard onPress={handlePressOutput}>
          <View className="flex-row items-center gap-md justify-between py-xs">
            <View className="flex-row items-center gap-lg flex-1">
              <Item icon={outputItemData.icon} size="lg" />

              <Text
                variant="subhead"
                className="text-text-primary flex-wrap flex-1"
                numberOfLines={2}
              >
                {outputItemData.name}
              </Text>
            </View>

            <RateDisplay value={productionLine.outputBaseRate} size="md" />
          </View>
        </PressableCard>

        <View className="mt-lg mb-xs px-xs">
          <Text variant="caption" className="text-text-tertiary uppercase">
            Ingredientes ({inputs.length})
          </Text>
        </View>

        <View className="gap-xs">
          {inputs.map((input) => (
            <InputRow
              key={input.id}
              input={input}
              onPress={handlePressInput}
              onAction={handleInputRowAction}
            />
          ))}
        </View>

        <Animated.View
          layout={LinearTransition.springify().damping(250)}
          className="mt-xs w-full"
        >
          <Button
            variant="ghost"
            title="Adicionar ingrediente"
            icon="add"
            size="sm"
            onPress={handleOpenAddInputModal}
          />
        </Animated.View>
      </Card>

      <MenuSheet ref={menuSheetRef} options={menuOptions} />

      <EditOutputSheet
        ref={editOutputSheetRef}
        productionLine={productionLine}
        onCancel={handleCancelAll}
        onConfirm={handleUpdateOutputRate}
      />

      <EditInputSheet
        ref={editInputSheetRef}
        input={menuContext?.type === "input" ? menuContext.data : null}
        onCancel={handleCancelAll}
        onConfirm={handleUpdateInputRate}
      />

      <AssociateInputSourceSheet
        ref={associateInputSourceSheetRef}
        input={menuContext?.type === "input" ? menuContext.data : null}
        excludedLineId={productionLine.id}
        onCancel={handleCancelAll}
        onSelect={handleAssociateInputSource}
      />

      <AddInputModal
        visible={addInputModalVisible}
        onClose={handleCloseAddInputModal}
        onAdd={handleAddInput}
      />
    </LayoutAnimationConfig>
  );
}

const enhance = withObservables(["productionLine"], ({ productionLine }) => ({
  productionLine,
  inputs: productionLine.inputs,
}));

export default enhance(BaseRecipeCard) as React.ComponentType<ExternalProps>;
