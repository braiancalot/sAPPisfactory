import { useState, useEffect, forwardRef } from "react";
import { View } from "react-native";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { Q } from "@nozbe/watermelondb";

import Text from "@ui/Text";
import Input from "@ui/Input";
import Button from "@ui/Button";
import ItemPicker from "@ui/ItemPicker";
import BottomSheet from "@ui/BottomSheet";

import { ItemId } from "@data/item";
import { parsePtBrNumber } from "src/utils/numberFormat";
import { productionLinesCollection } from "@db/index";
import ProductionLineInput from "@db/model/ProductionLineInput";

type Props = {
  onAdd: (
    item: ItemId,
    rate: number,
    inputs?: { item: ItemId; rate: number }[]
  ) => Promise<void>;
};

const AddProductionLineSheet = forwardRef<BottomSheetModal, Props>(
  ({ onAdd }, ref) => {
    const { dismissAll } = useBottomSheetModal();
    const [rate, setRate] = useState("");
    const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);
    const [hasExistingLine, setHasExistingLine] = useState(false);
    const [existingOutputRate, setExistingOutputRate] = useState(0);
    const [existingInputs, setExistingInputs] = useState<
      { item: ItemId; rate: number }[]
    >([]);

    useEffect(() => {
      if (!selectedItemId) {
        setHasExistingLine(false);
        setExistingInputs([]);
        setExistingOutputRate(0);
        return;
      }

      let cancelled = false;

      async function fetchExisting() {
        const lines = await productionLinesCollection
          .query(Q.where("output_item", selectedItemId!))
          .fetch();

        if (cancelled) return;

        if (lines.length > 0) {
          const line = lines[0];
          setHasExistingLine(true);
          setExistingOutputRate(line.outputBaseRate);

          const inputs: ProductionLineInput[] = await line.inputs.fetch();
          if (!cancelled) {
            setExistingInputs(
              inputs.map((i) => ({ item: i.inputItem, rate: i.inputBaseRate }))
            );
          }
        } else {
          setHasExistingLine(false);
          setExistingInputs([]);
          setExistingOutputRate(0);
        }
      }

      fetchExisting();

      return () => {
        cancelled = true;
      };
    }, [selectedItemId]);

    function handleDismiss() {
      setSelectedItemId(null);
      setRate("");
      setHasExistingLine(false);
      setExistingInputs([]);
      setExistingOutputRate(0);
    }

    async function handleAdd() {
      if (!selectedItemId || !rate) return;

      await onAdd(selectedItemId, parsePtBrNumber(rate));
    }

    async function handleReplicate() {
      if (!selectedItemId) return;

      await onAdd(selectedItemId, existingOutputRate, existingInputs);
      dismissAll();
    }

    const isValid = selectedItemId !== null && !!rate;

    return (
      <BottomSheet
        ref={ref}
        title="Adicionar linha de produção"
        onConfirm={handleAdd}
        onDismiss={handleDismiss}
        confirmDisabled={!isValid}
      >
        <ItemPicker
          selectedItemId={selectedItemId}
          onSelect={setSelectedItemId}
          label="Item produzido"
        />

        {hasExistingLine && (
          <View className="bg-surface-3 border border-border rounded-lg p-md gap-sm">
            <Text variant="caption" className="text-text-secondary">
              Este item já é produzido em outra linha
            </Text>
            <Button
              title="Replicar receita"
              icon="content-copy"
              variant="info"
              size="sm"
              onPress={handleReplicate}
            />
          </View>
        )}

        <Input
          label="Taxa base de produção (por minuto)"
          placeholder="60"
          numeric
          defaultValue=""
          onChangeValue={setRate}
          useBottomSheet
        />

        <Text variant="caption" className="text-text-tertiary">
          Inputs (ingredientes) são definidos na tela da linha de produção.
        </Text>
      </BottomSheet>
    );
  }
);

export default AddProductionLineSheet;
