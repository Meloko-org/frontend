import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useDispatch } from "react-redux";
import { updateProduct, setProducts } from "../../reducers/shop";

import { SheetManager } from "react-native-actions-sheet";
import saveImageLocally from "../../helpers/ImageHelpers";

import {
  CreateBulkStockPayload,
  CreateClassicStockPayload,
  CreateStockPayload,
  ProductData,
  StockData,
  TagData,
  UpdateBulkStockPayload,
  UpdateClassicStockPayload,
  UpdateStockPayload,
} from "../../types/API";

import { handleSheetFlow } from "../../helpers/sheetHelpers";
import stocksTools from "../../modules/stocksTools";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  NativeViewGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";

import { TextInput, View, Text, Image } from "react-native";
import TopBar from "../../components/TopBar";
import SecondaryButton from "../../components/utils/buttons/Secondary";
import TextBody1 from "../../components/utils/texts/Body1";
import PrimaryButton from "../../components/utils/buttons/Primary";
import IconButton from "../../components/utils/buttons/Icon";
import SelectableTag from "../../components/utils/badges/SelectableTag";
import InputTextarea from "../../components/utils/inputs/Textarea";
import TextHeading3 from "../../components/utils/texts/Heading3";
import InputText from "../../components/utils/inputs/Text";
import ImageUploader from "../../components/utils/ImageUploader";
import Spinner from "../../components/utils/Spinner";
import SimpleInputText from "../../components/utils/inputs/SimpleText";
import globalTools from "../../modules/globalTools";

type FromProducerTab = BottomTabScreenProps<ProducerTabParamList, "StocksEdit">;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingStocksEdit"
>;

type Props = FromProducerTab | FromRootStack;

export default function StocksEditScreen({ navigation, route }: Props) {
  const {
    from,
    backLabel,
    screenTitle,
    category,
    family,
    stockData,
    productData,
    onboarding,
  } = route.params || {};

  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const [newProductMode, setNewProductMode] = useState<boolean>(false);
  const [isBulk, setBulk] = useState<boolean | undefined>(false);
  const [familyId, setFamilyId] = useState<string | undefined>();

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // variables adapted
  const [nameAdapted, setNameAdapted] = useState<string>();
  const [familyAdpated, setFamilyAdpated] = useState<string>();
  const [imageAdapted, setImageAdapted] = useState<string>();

  const [productCustomName, setProductCustomName] = useState<
    string | undefined
  >("");
  const [weightPerUnit, setWeightPerUnit] = useState<string | undefined>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState<string | undefined>("");
  const [pricePerKilo, setPricePerKilo] = useState<string>("");
  const [origin, setOrigin] = useState<string | undefined>("");
  const [format, setFormat] = useState<string | undefined>("");
  const [portion, setPortion] = useState<string | undefined>("");
  const [bestBeforeDate, setBestBeforeDate] = useState<string | undefined>("");
  const [image, setImage] = useState<string | null>(null);
  const [tags, setTags] = useState<TagData[] | undefined>([]);

  const [suggestedTags, setSuggestedTags] = useState<TagData[] | undefined>([]);
  const [remaingingTags, setRemainingTags] = useState<TagData[] | undefined>(
    [],
  );
  const initialTagIdsRef = useRef<string[]>([]);

  // gestion des erreurs
  const [errors, setErrors] = useState({
    productCustomName: false,
    price: false,
    stock: false,
    weightPerUnit: false,
    pricePerKilo: false,
  });

  const fetchAndManageTags = async (
    familyId: string | undefined,
    existingTags?: TagData[],
  ) => {
    console.log("S-EDIT family :", familyId);
    const tagResponse = await stocksTools.getSuggestedTags(familyId);
    if (!tagResponse.success) {
      console.log("impossible de récupérer les tags suggérés.");
    }
    setSuggestedTags(tagResponse.data?.suggestedTags ?? []);
    setRemainingTags(tagResponse.data?.remainingTags ?? []);

    // on stocke les ids des tags initiaux pour future comparaison hasChanges
    const initial = (existingTags ?? []).map((t) => t._id);
    initialTagIdsRef.current = initial;

    setTags(existingTags ?? []);
  };

  useEffect(() => {
    if (!stockData && !productData) return;

    const family = stockData?.product.family ?? productData?.family;
    const bulk = family?.productsTypes.includes("bulk");

    setFamilyId(family?._id);
    setBulk(bulk);

    if (productData) {
      const emptyTags: TagData[] = [];
      fetchAndManageTags(family?._id, emptyTags);
    } else if (stockData) {
      fetchAndManageTags(family?._id, stockData?.tags ?? []);
    }

    if (productData) {
      // mode création

      if (bulk) {
        setPrice("");
        setStock(0);
        setDescription("");
        setWeightPerUnit(
          productData.weight.measurement + " " + productData.weight.unit,
        );
        setNameAdapted(productData.name);
        setFamilyAdpated(productData.family.name);
        setImageAdapted(productData.image);
      } else {
        setPrice("");
        setStock(0);
        setProductCustomName("");
        setPricePerKilo("");
        setOrigin("");
        setFormat("");
        setPortion("");
        setBestBeforeDate("");
        setDescription("");
        setWeightPerUnit("");
        setImage(null);
      }
    } else if (stockData) {
      // mode modification

      if (bulk) {
        setPrice((stockData.price / 100).toString());
        setStock(stockData.stockTotal);
        setWeightPerUnit(
          stockData.product.weight.measurement +
            " " +
            stockData.product.weight.unit,
        );
        setNameAdapted(stockData.product.name);
        setFamilyAdpated(stockData.product.family.name);
        setImageAdapted(stockData.product.image);
      } else {
        setPrice((stockData.price / 100).toString());
        setStock(stockData.stockTotal);
        setProductCustomName(stockData.productCustomName);
        setPricePerKilo(stockData.pricePerKilo.toString());
        setOrigin(stockData.origin);
        setFormat(stockData.format);
        setPortion(stockData.portion);
        setBestBeforeDate(stockData.bestBeforeDate);
        setDescription(stockData.description);
        setWeightPerUnit(stockData.weightPerUnit);
        setImage(stockData.image);
      }
    }
  }, [stockData?._id, productData?._id]);

  const isTagSelected = (tagId: string) => {
    return tags?.some((t) => t._id === tagId);
  };

  const toggleTag = (tag: TagData) => {
    const cur = tags ?? [];
    // détermine si le tag cliqué fait déjà partie des tags
    const isSelected = cur.some((t) => t._id === tag._id);
    // on ajoute ou on supprime le tag en fonction de isSelected
    const newTags = isSelected
      ? cur.filter((t) => t._id !== tag._id)
      : [...cur, tag];
    // on met à jourle state
    setTags(newTags);
    // on crée les tableaux d'ids: les ids initiaux et les ids redéfinis de tags
    const newIds = newTags.map((t) => ({ _id: t._id }));
    const initialIds = initialTagIdsRef.current.map((r) => ({ _id: r }));
    // on compare les deux tableaux
    const equalsInitial = globalTools.arraysEqualById(newIds, initialIds);
    // on met à jour le state hasChanges en fonciton
    setHasChanges(!equalsInitial);
  };

  const handleQuantityChange = async (change: number) => {
    console.log("handle quantity :", change);
    let newStock = Number(stock) + change;

    if (newStock < 0) {
      newStock = 0;
    }

    setStock(newStock);
    setErrors((prev) => ({
      ...prev,
      stock: false,
    }));
    setHasChanges(true);
  };

  const checkErrors = () => {
    const newErrors: Record<string, boolean> = {};

    /* Vérification des champs pour tout type de produit */

    if (!price) {
      newErrors.price = true;
    }

    if (isNaN(stock)) {
      setStock(0);
      newErrors.stock = true;
    }

    if (!stock || stock === 0) {
      newErrors.stock = true;
    }

    /* Vérification des champs pour type de produit classic */

    if (!isBulk) {
      if (!productCustomName) {
        newErrors.productCustomName = true;
      }

      if (!pricePerKilo) {
        newErrors.pricePerKilo = true;
      }

      if (!weightPerUnit) {
        newErrors.weightPerUnit = true;
      }
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length > 0;
  };

  const handleSaveProduct = async () => {
    setSaveLoading(true);

    let numPrice;
    let numPricePerKilo;

    const hasErrors = checkErrors();

    if (hasErrors) {
      SheetManager.show("alert", {
        payload: {
          message: "Vérifez les champs entourés en rouge",
          alertType: "error",
        },
      });
      setSaveLoading(false);
      setHasChanges(false);
      return;
    }

    numPrice = parseFloat(price.replace(",", "."));
    if (!isBulk) {
      numPricePerKilo = parseFloat(pricePerKilo.replace(",", "."));
    }

    const token = await getToken();
    let createValues: CreateStockPayload | undefined;
    let updateValues: UpdateStockPayload | undefined;

    // si on est dans le cas d'un produit vrac
    if (isBulk) {
      if (productData) {
        // si création d'un produit
        createValues = {
          product: productData,
          price: numPrice,
          stockTotal: stock,
          description,
          tags,
        } as CreateBulkStockPayload;
      } else {
        // si modification d'un produit
        updateValues = {
          _id: stockData?._id,
          product: stockData?.product,
          price: numPrice,
          stockTotal: stock,
          description,
          tags,
        } as UpdateBulkStockPayload;
      }

      // si on est dans le cas d'un produit classic
    } else {
      if (!productCustomName) {
        SheetManager.show("alert", {
          payload: {
            message: "Le nom du produit n'est pas indiqué.",
            alertType: "warning",
          },
        });
        setSaveLoading(false);
        return;
      }

      if (productData) {
        // si création d'un produit
        createValues = {
          product: productData,
          productCustomName,
          price: numPrice,
          stockTotal: stock,
          pricePerKilo: numPricePerKilo,
          weightPerUnit,
          origin,
          format,
          portion,
          bestBeforeDate,
          description,
          image,
          tags,
        } as CreateClassicStockPayload;
      } else {
        // si modification d'un produit
        updateValues = {
          _id: stockData?._id,
          product: stockData?.product,
          productCustomName,
          price: numPrice,
          stockTotal: stock,
          pricePerKilo: numPricePerKilo,
          weightPerUnit,
          origin,
          format,
          portion,
          bestBeforeDate,
          description,
          image,
          tags,
        } as UpdateClassicStockPayload;
      }
    }

    let stockResponse;
    let message;

    if (createValues) {
      stockResponse = await stocksTools.createStocks(token, createValues);
      message = "Produit créé.";
    } else if (updateValues) {
      stockResponse = await stocksTools.updateStocks(token, updateValues);
      message = "Produit modifié.";
    }

    setSaveLoading(false);

    if (!stockResponse?.success) {
      SheetManager.show("alert", {
        payload: {
          message: stockResponse?.message!,
          alertType: "error",
        },
      });
      setHasChanges(false);
      return;
    }

    dispatch(setProducts(stockResponse.data!));

    SheetManager.show("alert", {
      payload: {
        message: message!,
        alertType: "success",
      },
    });

    if (onboarding) {
      (navigation as FromRootStack["navigation"]).navigate("OnboardingStocks", {
        // from: "Onboarding***",
        backLabel: "Retour " + (isBulk ? "aux catégories" : "au choix"),
        screenTitle: "STOCKS\n" + (family ? family : category),
        category: category!,
        family: family,
        onboarding: true,
      });
    } else {
      (navigation as FromProducerTab["navigation"]).navigate("Stocks", {
        // from: "***",
        backLabel: "Retour " + (isBulk ? "aux catégories" : "au choix"),
        screenTitle: "STOCKS\n" + (family ? family : category),
        category: category!,
        family: family,
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const canDelete = await SheetManager.show("confirm", {
      payload: {
        message: "Confirmez la suppression du produit:",
        alertType: "warning",
      },
    });

    if (canDelete) {
      setIsDeleting(true);
      const token = await getToken();
      const deleteResponse = await stocksTools.deleteStocks(token, id);

      if (!deleteResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: deleteResponse.message!,
            alertType: "error",
          },
        });
        setIsDeleting(false);
        return;
      }

      dispatch(setProducts(deleteResponse.data!));
      setIsDeleting(false);

      await handleSheetFlow({
        sheet: "alert",
        payload: {
          message: "Produit supprimé.",
          alertType: "success",
        },
        onAfter: async (action) => {
          if (onboarding) {
            (navigation as FromRootStack["navigation"]).navigate(
              "OnboardingStocks",
              {
                // from: "Onboarding***",
                backLabel:
                  "Retour " + (stockData ? "au choix" : "aux catégories"),
                screenTitle: "STOCKS\n" + (family ? family : category),
                category: category!,
                family: family,
                onboarding: true,
              },
            );
          } else {
            (navigation as FromProducerTab["navigation"]).navigate("Stocks", {
              // from: "***",
              backLabel:
                "Retour " + (stockData ? "au choix" : "aux catégories"),
              screenTitle: "STOCKS\n" + (family ? family : category),
              category: category!,
              family: family,
            });
          }
        },
      });
    }
  };

  const handleImageSelected = async (uri: string) => {
    const savedUri = await saveImageLocally(uri, "productImages/");
    if (savedUri) {
      console.log("image sauvée");
      setImage(savedUri);
    }
  };

  // console.log("STOCKEDIT errors:", errors);

  // console.log("STOCKEDIT onboarding :", onboarding);
  // console.log(
  //   "suggested :",
  //   suggestedTags?.map((t) => t.name),
  // );
  // console.log(
  //   "remaining :",
  //   remaingingTags?.map((t) => t.name),
  // );
  // console.log(
  //   "tags :",
  //   tags?.map((t) => t.name),
  // );

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <TopBar
        backLabel={backLabel || "Retour aux stocks"}
        screen={
          from || (onboarding ? "OnboardingStockCategories" : "StockCategories")
        }
        label={screenTitle || ""}
        screenParams={{
          category: category,
          family: family,
          onboarding,
        }}
        extraClasses="mt-2"
      />

      <ScrollView>
        <View className="bg-lightbg dark:bg-darkbg p-3">
          <View className="mb-3">
            {!isBulk ? (
              <View className="flex flex-row items-center">
                <View className="flex-none w-1/4">
                  <View className="rounded-lg w-[90px] h-[90px]">
                    <ImageUploader
                      label="PHOTO"
                      size={90}
                      defaultUri={stockData?.image}
                      onImageSelected={handleImageSelected}
                      mediaTypes={["images", "livePhotos"]}
                      message={`Choisisssez une image\nou prenez une photo.`}
                    />
                  </View>
                </View>
                <View className="grow w-3/4 pl-1">
                  <InputText
                    label="NOM DU PRODUIT"
                    placeholder="Saisissez le nom de votre produit"
                    value={productCustomName}
                    twoLines={true}
                    onChangeText={(value: string) => {
                      setProductCustomName(value);
                      if (errors.productCustomName && value.trim() !== "") {
                        setErrors((prev) => ({
                          ...prev,
                          productCustomName: false,
                        }));
                      } else if (!hasChanges) {
                        setHasChanges(true); // activation du bouton de sauvegarde
                      }
                    }}
                    showError={errors.productCustomName}
                    height="h-[90px]"
                  />
                </View>
              </View>
            ) : (
              <View className="flex flex-row">
                <View className="flex-none">
                  <Image
                    source={
                      imageAdapted
                        ? { uri: imageAdapted }
                        : require("../../assets/icon.png")
                    }
                    className="rounded-xl w-20 h-20 mr-3"
                    alt={`Illustration du produit ${nameAdapted}`}
                    resizeMode="stretch"
                    width={96}
                    height={64}
                  />
                </View>
                <View className="flex shrink">
                  <TextHeading3 extraClasses="text-wrap">
                    {familyAdpated + " " + nameAdapted}
                  </TextHeading3>
                </View>
              </View>
            )}
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">VENDU PAR</TextBody1>
            </View>
            {isBulk ? (
              <View className="flex flex-row justify-end w-36 mr-2">
                <Text className="font-bold text-xl text-secondary dark:text-lightbg">
                  {weightPerUnit}
                </Text>
              </View>
            ) : (
              <SimpleInputText
                placeholder="ex: 100gr"
                value={weightPerUnit}
                height="h-[50px]"
                textClasses=" text-right pr-1 text-xl"
                onChangeText={(value: string) => {
                  setWeightPerUnit(value);
                  if (errors.weightPerUnit && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, weightPerUnit: false }));
                  } else if (!hasChanges) {
                    setHasChanges(true); // activation du bouton de sauvegarde
                  }
                }}
                showError={errors.weightPerUnit}
              />
            )}
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">PRIX</TextBody1>
            </View>
            <View className="flex flex-row justify-end items-center mr-2">
              <SimpleInputText
                value={price}
                height="h-[50px]"
                textClasses=" text-right pr-1 text-xl"
                extraClasses="w-24"
                onChangeText={(value: string) => {
                  setPrice(value);
                  if (errors.price && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, price: false }));
                  } else if (!hasChanges) {
                    setHasChanges(true); // activation du bouton de sauvegarde
                  }
                }}
                showError={errors.price}
                keyboardType="decimal-pad"
              />
              <Text className="font-bold text-xl text-secondary dark:text-lightbg ml-2">
                €
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">QUANTITÉ</TextBody1>
            </View>
            <View className="flex flex-row items-center justify-end w-48 my-3">
              <IconButton
                iconName="minus"
                iconColor="#ffffff"
                extraClasses="bg-primary px-2 ml-2"
                size={30}
                onPressFn={() => handleQuantityChange(-1)}
              />
              <View className="flex flex-row justify-center w-32">
                <SimpleInputText
                  value={stock?.toString() ?? ""}
                  height="h-[50px]"
                  extraClasses="mx-2 w-24"
                  textClasses=" text-center pr-1 text-xl"
                  onChangeText={(value: string) => {
                    setStock(Number(value));
                    if (errors.stock && value.trim() !== "") {
                      setErrors((prev) => ({ ...prev, stock: false }));
                    } else if (!hasChanges) {
                      setHasChanges(true); // activation du bouton de sauvegarde
                    }
                  }}
                  showError={errors.stock}
                  keyboardType="decimal-pad"
                />
              </View>
              <IconButton
                iconName="plus"
                iconColor="#ffffff"
                extraClasses="bg-primary px-2"
                size={30}
                onPressFn={() => handleQuantityChange(+1)}
              />
            </View>
          </View>

          <InputTextarea
            label="DESCRIPTION"
            placeholder="Saisir une description"
            value={description}
            onChangeText={(value: string) => {
              setDescription(value);
              setHasChanges(true);
            }}
            extraClasses="mb-5 h-64"
            numberOfLines={9}
          />

          {!isBulk && (
            <>
              <View className="flex flex-row items-center space-x-2 mb-1">
                <View className="flex-1">
                  <TextBody1 extraClasses="font-bold">PRIX AU KILO</TextBody1>
                </View>
                <View className="flex flex-row justify-end items-center mr-2">
                  <SimpleInputText
                    value={pricePerKilo}
                    height="h-[50px]"
                    textClasses=" text-right pr-1 text-xl"
                    extraClasses="w-24"
                    onChangeText={(value: string) => {
                      setPricePerKilo(value);
                      if (errors.pricePerKilo && value.trim() !== "") {
                        setErrors((prev) => ({ ...prev, pricePerKilo: false }));
                      } else if (!hasChanges) {
                        setHasChanges(true); // activation du bouton de sauvegarde
                      }
                    }}
                    showError={errors.pricePerKilo}
                    keyboardType="decimal-pad"
                  />
                  <Text className="font-bold text-xl text-secondary dark:text-lightbg ml-2">
                    €
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center space-x-2 mb-1">
                <View className="flex-1">
                  <TextBody1 extraClasses="font-bold">ORIGINE</TextBody1>
                </View>
                <SimpleInputText
                  value={origin}
                  height="h-[50px]"
                  textClasses=" text-right pr-1 text-xl"
                  extraClasses="w-60"
                  onChangeText={(value: string) => setOrigin(value)}
                />
              </View>

              <View className="flex flex-row items-center space-x-2 mb-1">
                <View className="flex-1">
                  <TextBody1 extraClasses="font-bold">FORMAT</TextBody1>
                </View>
                <SimpleInputText
                  placeholder="ex: sous-vide"
                  value={format}
                  height="h-[50px]"
                  textClasses=" text-right pr-1 text-xl"
                  extraClasses="w-60"
                  onChangeText={(value: string) => setFormat(value)}
                />
              </View>

              <View className="flex flex-row items-center space-x-2 mb-1">
                <View className="flex-1">
                  <TextBody1 extraClasses="font-bold">PORTION</TextBody1>
                </View>
                <SimpleInputText
                  placeholder="ex: 1 personne"
                  value={portion}
                  height="h-[50px]"
                  textClasses=" text-right pr-1 text-xl"
                  extraClasses="w-60"
                  onChangeText={(value: string) => setPortion(value)}
                />
              </View>

              <View className="flex flex-row items-center space-x-2 mb-1">
                <View className="flex-1">
                  <TextBody1 extraClasses="font-bold">{`DLC A\nRECEPTION`}</TextBody1>
                </View>
                <SimpleInputText
                  placeholder="ex: 3 jours minimum"
                  value={bestBeforeDate}
                  height="h-[50px]"
                  textClasses=" text-right pr-1 text-xl"
                  extraClasses="w-60"
                  onChangeText={(value: string) => setBestBeforeDate(value)}
                />
              </View>
            </>
          )}

          <TextBody1 extraClasses="font-bold mt-5 mb-2">
            TAGS SUGGÉRÉS
          </TextBody1>
          <View className="flex flex-row flex-wrap">
            {!suggestedTags ? (
              <Spinner />
            ) : (
              suggestedTags?.map((tag) => (
                <SelectableTag
                  key={tag._id}
                  tag={tag}
                  onPressFn={() => toggleTag(tag)}
                  extraClasses="mr-2 mb-2"
                  selected={isTagSelected(tag._id)}
                />
              ))
            )}
          </View>
          <TextBody1 extraClasses="font-bold mt-5 mb-2">
            TOUS LES TAGS
          </TextBody1>
          <View className="flex flex-row flex-wrap">
            {!remaingingTags ? (
              <Spinner />
            ) : (
              remaingingTags?.map((tag) => (
                <SelectableTag
                  key={tag._id}
                  tag={tag}
                  onPressFn={() => toggleTag(tag)}
                  extraClasses="mr-2 mb-2"
                  selected={isTagSelected(tag._id)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View className="flex flex-row px-3 py-2 bg-lightbg dark:bg-darkbg">
        {!newProductMode && (
          <>
            <View className="w-1/6">
              <IconButton
                iconName="trash"
                iconFamily="FontAwesome5Icon"
                iconColor="white"
                onPressFn={() => handleDeleteProduct(stockData?._id!)}
                size={25}
                extraClasses="bg-danger h-14 mr-1"
              />
            </View>
            <View className="w-2/6">
              <SecondaryButton
                label={`Dupliquer\nproduit`}
                extraClasses="h-14 mr-1"
                textClasses="text-sm"
                onPressFn={() => {}}
                disabled={false}
                isLoading={false}
              />
            </View>
          </>
        )}

        <View
          className={`${newProductMode ? "flex flex-row justify-center w-full" : "w-3/6"}`}
        >
          <PrimaryButton
            label="Sauvegarder"
            disabled={!hasChanges || isSaveLoading}
            onPressFn={handleSaveProduct}
            isLoading={isSaveLoading}
            extraClasses="h-14"
          />
        </View>
      </View>

      {isDeleting && (
        <View className="absolute inset-0 opacity-70 w-full h-full bg-black top-9">
          <View className="flex justify-center items-center h-full">
            <Spinner />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
