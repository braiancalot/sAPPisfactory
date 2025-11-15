import { View } from "react-native";
import { useState } from "react";

import { ItemId } from "src/data/item";

import Card from "@ui/Card";
import PressableCard from "@ui/PressableCard";
import Modal from "@ui/Modal";
import Input from "@ui/Input";
import Button from "@ui/Button";
import ConfirmDialog from "@ui/ConfirmDialog";
import FAB from "@ui/FAB";
import RateDisplay from "@ui/RateDisplay";
import ItemBadge from "@ui/ItemBadge";
import ItemPicker from "@ui/ItemPicker";
import ScrollScreenContainer from "@ui/ScrollScreenContainer";
import Text from "@ui/Text";

export default function FactoriesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);

  function handlePress() {
    setModalVisible(true);
  }

  function handleLongPress() {
    setConfirmDialogVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  function handleCloseConfirmDialog() {
    setConfirmDialogVisible(false);
  }

  function handleConfirm() {
    console.log("Confirm");
  }

  function handleCancel() {
    console.log("Cancel");
    handleCloseConfirmDialog();
  }

  function handleSelectItem(itemId: ItemId) {
    setSelectedItemId(itemId);
  }

  return (
    <>
      <ScrollScreenContainer withFAB>
        <View className="gap-2xl">
          <View className="gap-md border border-border w-full p-md rounded-md">
            <Input
              placeholder="Siderúrgica"
              label="Nome"
              value=""
              onChangeValue={() => {}}
            />

            <Input
              label="Taxa de produção (por minuto)"
              placeholder="Ex: 780,5"
              numeric
              value=""
              onChangeValue={() => {}}
            />

            <Input
              label="Item"
              placeholder="Ex.: Minério de Ferro"
              error="Selecione um item."
              value=""
              onChangeValue={() => {}}
            />
          </View>

          <View className="gap-md border border-border w-full p-md rounded-md">
            <Card>
              <Text variant="subhead" className="text-text-primary">
                Factories Screen
              </Text>
            </Card>

            <PressableCard onPress={handlePress} onLongPress={handleLongPress}>
              <Text variant="subhead" className="text-text-primary">
                Factories Screen
              </Text>
            </PressableCard>
          </View>

          <View className="gap-md border border-border w-full p-md flex-row items-baseline justify-between rounded-md">
            <RateDisplay value={0} size="sm" />
            <RateDisplay value={-180} size="md" />
            <RateDisplay value={2180.5} size="lg" />
          </View>

          <View className="gap-md border border-border w-full p-md rounded-md">
            <ItemBadge itemId="iron_ore" size="sm" />
            <ItemBadge itemId="copper_ore" size="md" />
            <ItemBadge itemId="limestone" size="lg" />
          </View>

          <View className="gap-md border border-border w-full p-md rounded-md">
            <Button onPress={() => {}} variant="primary" title="Adicionar" />
            <Button
              onPress={() => {}}
              variant="primary"
              title="Adicionar"
              disabled
            />
            <Button onPress={() => {}} variant="secondary" title="Cancelar" />
            <Button onPress={() => {}} variant="info" title="Detalhes" />
            <Button onPress={() => {}} variant="danger" title="Excluir" />
            <Button onPress={() => {}} variant="ghost" title="Voltar" />
          </View>

          <View className="gap-md border border-border w-full p-md rounded-md">
            <ItemPicker
              label="Item"
              selectedItemId={selectedItemId}
              onSelect={handleSelectItem}
            />

            <Input
              placeholder="Siderúrgica"
              label="Nome"
              value=""
              onChangeValue={() => {}}
            />
          </View>
        </View>
      </ScrollScreenContainer>

      <FAB onPress={() => {}} />

      <Modal
        visible={modalVisible}
        onClose={handleCloseModal}
        title="Adicionar fonte"
      >
        <View className="gap-lg">
          <Input
            label="Item"
            placeholder="Ex.: Minério de Ferro"
            value=""
            onChangeValue={() => {}}
          />

          <Input
            label="Taxa de produção (por minuto)"
            placeholder="Ex: 780,5"
            numeric
            value=""
            onChangeValue={() => {}}
          />
        </View>

        <View className="mt-xl flex-row gap-lg">
          <Button
            onPress={handleCloseModal}
            variant="secondary"
            title="Cancelar"
            fullWidth
          />
          <Button
            onPress={handlePress}
            variant="primary"
            title="Adicionar"
            fullWidth
          />
        </View>
      </Modal>

      <ConfirmDialog
        visible={confirmDialogVisible}
        title="Excluir fábrica?"
        message="Tem certeza que deseja excluir a fábrica? Todas as linhas de produção serão excluídas."
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
