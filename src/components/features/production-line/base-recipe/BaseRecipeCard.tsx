import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { View } from "react-native";

import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";

import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";

import { ItemId } from "@data/item";
import { addProductionLineInput } from "@services/productionLineService";

import Card from "@ui/Card";
import Text from "@ui/Text";
import Button from "@ui/Button";
import MenuSheet, { MenuItem } from "@ui/MenuSheet";

import AddInputModal from "@features/production-line/AddInputModal";
import EditInputSheet from "@features/production-line/EditInputSheet";
import OutputCard from "@features/production-line/base-recipe/OutputCard";
import AssociateInputSourceSheet, {
  SourceType as SourceTypes,
} from "@features/production-line/AssociateInputSourceSheet";
import { SourceType } from "@features/production-line/AssociateInputSourceSheet";
import InputList from "@features/production-line/base-recipe/InputList";

type Props = {
  productionLine: ProductionLine;
};

export default function BaseRecipeCard({ productionLine }: Props) {
  const { dismissAll } = useBottomSheetModal();

  const [addInputModalVisible, setAddInputModalVisible] = useState(false);
  const [selectedInput, setSelectedInput] =
    useState<ProductionLineInput | null>(null);

  const menuSheetRef = useRef<BottomSheetModal>(null);
  const editInputSheetRef = useRef<BottomSheetModal>(null);
  const associateInputSourceSheetRef = useRef<BottomSheetModal>(null);

  function handleOpenAddInputModal() {
    setAddInputModalVisible(true);
  }

  const handleInputAction = useCallback((input: ProductionLineInput) => {
    if (!input.sourceType) {
      setSelectedInput(input);
      setTimeout(() => associateInputSourceSheetRef.current?.present(), 100);
      return;
    }

    if (input.sourceType === SourceType.PRODUCTION_LINE) {
      router.push(`/production-line/${input.sourceProductionLine.id}`);
    } else if (input.sourceType === SourceType.GLOBAL_SOURCE) {
      router.push("/global-sources");
    }
  }, []);

  const handleInputPress = useCallback((input: ProductionLineInput) => {
    setSelectedInput(input);
    menuSheetRef.current?.present();
  }, []);

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

  async function handleUpdateInputRate(newRate: number) {
    if (selectedInput) {
      await selectedInput.updateInputBaseRate(newRate);
      dismissAll();
    }
  }

  async function handleAssociateInputSource(id: string, type: SourceType) {
    if (!selectedInput) return;

    if (type === SourceTypes.GLOBAL_SOURCE) {
      await selectedInput.associateGlobalSource(id);
    } else if (type === SourceTypes.PRODUCTION_LINE) {
      await selectedInput.associateProductionLine(id);
    }

    dismissAll();
  }

  async function handleAddInput(item: ItemId, rate: number) {
    await addProductionLineInput(productionLine, item, rate);
  }

  async function handleDeleteInput() {
    if (selectedInput) {
      await selectedInput.delete();
      dismissAll();
    }
  }

  const menuOptions: MenuItem[] = [
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

  return (
    <Card className="p-md">
      <View className="flex-row items-center justify-between px-xs">
        <Text variant="title" className="text-text-secondary">
          Receita
        </Text>
      </View>

      <View className="mt-lg mb-xs px-xs">
        <Text variant="caption" className="text-text-tertiary uppercase">
          Produção
        </Text>
      </View>

      <OutputCard productionLine={productionLine} />

      <View className="mt-lg mb-xs px-xs">
        <Text variant="caption" className="text-text-tertiary uppercase">
          Ingredientes
        </Text>
      </View>

      <InputList
        productionLine={productionLine}
        onInputAction={handleInputAction}
        onInputPress={handleInputPress}
      />

      <View className="mt-xs w-full">
        <Button
          variant="ghost"
          title="Adicionar ingrediente"
          icon="add"
          size="sm"
          onPress={handleOpenAddInputModal}
        />
      </View>

      <MenuSheet ref={menuSheetRef} options={menuOptions} />

      <EditInputSheet
        ref={editInputSheetRef}
        input={selectedInput}
        onCancel={handleCancelAll}
        onConfirm={handleUpdateInputRate}
      />

      <AssociateInputSourceSheet
        ref={associateInputSourceSheetRef}
        input={selectedInput}
        excludedLineId={productionLine.id}
        onCancel={handleCancelAll}
        onSelect={handleAssociateInputSource}
      />

      <AddInputModal
        visible={addInputModalVisible}
        onClose={handleCloseAddInputModal}
        onAdd={handleAddInput}
      />
    </Card>
  );
}
