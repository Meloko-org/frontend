import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../types/Navigation";

import { updateUser } from "../reducers/user";
import { ProducerState, setProducerData } from "../reducers/producer";
import { setShopData, ShopState } from "../reducers/shop";

import userTools from "../modules/userTools";
import producerTools from "../modules/producerTools";
import shopTools from "../modules/shopTools";

type Navigation = ReturnType<typeof useNavigation>;

export const useUserRedirect = (navigation: Navigation) => {
  const { isSignedIn, getToken } = useAuth();
  const dispatch = useDispatch();

  const producerStore = useSelector(
    (state: { producer: ProducerState }) => state.producer.value,
  );
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const fetchAndStoreData = async () => {
    const token = await getToken();

    // user data
    const user = await userTools.getUserInfos(token);
    if (user) {
      dispatch(updateUser(user));
    }

    // producer data
    const producer = await producerTools.getProducerInfos(token);
    if (producer && !("message" in producer)) {
      dispatch(setProducerData(producer));

      // shop data
      const shop = await shopTools.getShopInfos(token, producer._id);
      if (shop && !("message" in shop)) {
        dispatch(setShopData(shop));
      }
    }
  };

  const redirectProducer = () => {
    if (!producerStore) {
      navigation.navigate("ProducerProfile");
    } else if (!shopStore) {
      navigation.navigate("Shop");
    } else {
      navigation.navigate("Business Center");
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchAndStoreData();
    }
  }, [isSignedIn]);

  return { redirectProducer, fetchAndStoreData };
};
