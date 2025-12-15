import { useSelector } from "react-redux";
import { NetworksData, ShopData, SocialNetworkData } from "../types/API";

export function useCanPost(): boolean {
  const shopStore = useSelector(
    (state: { shop: ShopData }) => state.shop?.value,
  );

  if (!shopStore) {
    console.log("shopStore not defined");
  }

  const socials: NetworksData = shopStore.socials;

  if (!socials) return false;

  return Object.values(socials).some(
    (network) => network?.connected === true && network.isEnabled === true,
  );
}
