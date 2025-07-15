import { useSelector } from "react-redux";
import { NetworksData, ShopData, SocialNetworkData } from "../types/API";

export function useCanPost(): boolean {
  const shopStore = useSelector(
    (state: { shop: ShopData }) => state.shop?.value,
  );

  const socials: NetworksData = shopStore.socials;

  if (!socials) return false;

  return Object.values(socials).some(
    (network) => network?.connected === true && network.isEnabled === true,
  );
}
