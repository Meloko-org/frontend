import { View, Image, Text } from "react-native";
import { CrewMember } from "../../types/API";
import TextHeading3 from "../utils/texts/Heading3";
import TextBody1 from "../utils/texts/Body1";

type CrewMemberProps = {
  crewMember: CrewMember;
};

export default function CrewMemberCard({ crewMember }: CrewMemberProps) {
  console.log(crewMember);

  return (
    <View className="mb-5">
      <View className="flex flex-row">
        <View className="w-1/2 bg-primary">
          <Image
            source={
              crewMember.photo
                ? { uri: crewMember.photo }
                : require("../../assets/icon.png")
            }
            className="rounded-lg border border-primary w-24 h-24"
            alt={`photo du membre ${crewMember.forname}`}
            resizeMode="cover"
            style={{
              width: "100%",
            }}
          />
        </View>
        <View className="w-1/2 pl-2">
          <View>
            <TextHeading3>{crewMember.forname}</TextHeading3>
          </View>
          <View className="bg-primary pt-1 pb-2">
            <Text className="text-white font-bold text-sm/5 text-center">
              {crewMember.role}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-2">
        <TextBody1 centered>{crewMember.description}</TextBody1>
      </View>
    </View>
  );
}
