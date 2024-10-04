import React, { useState, useEffect } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { View, Text, StyleSheet } from "react-native";
import TextBody2 from "./utils/texts/Body2";
import ButtonIcon from "./utils/buttons/Icon";

type TimeSlotProps = {
  data: string[];
  extraClasses?: string;
  trash?: boolean | undefined;
  onSelectStart?: (selectedItem: string) => void;
  onSelectEnd?: (selectedItem: string) => void;
  onPressPlus?: () => void;
  onPressDel?: () => void;
  defaultStartByIndex: string;
  defaultEndByIndex: string;
};

export default function TimeSlot(props: TimeSlotProps): JSX.Element {
  const [trash, setTrash] = useState<boolean | undefined>(false);

  useEffect(() => {
    setTrash(props.trash);
  }, []);

  return (
    <View className={`${props.extraClasses}`}>
      <View className="flex flex-row">
        <View className="px-2">
          <View>
            <TextBody2 centered={true} extraClasses="my-1">
              Ouverture
            </TextBody2>
          </View>
          <View>
            <SelectDropdown
              data={props.data}
              onSelect={(selectedItem, index) => {
                props.onSelectStart && props.onSelectStart(selectedItem);
              }}
              // defaultValueByIndex=
              defaultValue={props.defaultStartByIndex} // use default value by index or default value
              renderButton={(selectedItem, isOpen) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem || "Select"}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>
        </View>
        <View className="px-2">
          <View>
            <TextBody2 centered={true} extraClasses="my-1">
              Fermeture
            </TextBody2>
          </View>
          <View>
            <SelectDropdown
              data={props.data}
              onSelect={(selectedItem, index) => {
                props.onSelectEnd && props.onSelectEnd(selectedItem);
              }}
              // defaultValueByIndex=
              defaultValue={props.defaultEndByIndex} // use default value by index or default value
              renderButton={(selectedItem, isOpen) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem || "Select"}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>
        </View>
        <View className="flex justify-end h-20 px-2">
          <ButtonIcon
            iconName="plus"
            extraClasses="w-10 mb-1 bg-primary"
            onPressFn={props.onPressPlus}
          />
          {trash && (
            <ButtonIcon
              iconName="trash"
              extraClasses="w-10 bg-danger"
              onPressFn={props.onPressDel}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 130,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
    textAlign: "center",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    height: 150,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B1BDC8",
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
    textAlign: "center",
  },
});
