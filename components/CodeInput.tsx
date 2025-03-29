import { View, TextInput } from "react-native";
import { useState, useRef, useEffect } from "react";
import SingleNumber from "./utils/inputs/SingleNumber";

type CodeInputProps = {
  onCodeChange: (code: string) => void;
};

export default function CodeInput({ onCodeChange }: CodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [hasBeenFocused, setHasBeenFocused] = useState<boolean[]>(
    Array(6).fill(false),
  );
  const inputsRef = useRef<Array<TextInput | null>>(Array(6).fill(null));

  // Focus automatique au montage
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  // Fonction appelée quand un chiffre est saisi
  const handleChange = (index: number, digit: string) => {
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    onCodeChange(newCode.join(""));

    const newFocusState = [...hasBeenFocused];
    newFocusState[index] = true;
    setHasBeenFocused(newFocusState);

    // Passer au champ suivant
    if (digit !== "" && index < 5) {
      setFocusedIndex(index + 1);
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Fonction appelée quand on supprime un chiffre
  const handleBackspace = (index: number) => {
    if (index > 0) {
      // modification du code
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      setFocusedIndex(index - 1);
      // donne le focus à l'élément précédent
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex flex-row space-x-2">
      {code.map((digit, index) => (
        <SingleNumber
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          value={digit}
          onChange={(text) => handleChange(index, text)}
          onBackspace={() => handleBackspace(index)}
          isFocused={focusedIndex === index}
          hasBeenFocused={hasBeenFocused[index]}
          extraClasses="mr-1"
        />
      ))}
    </View>
  );
}
