import React, { useContext, useRef, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import { View, TouchableWithoutFeedback, Text, Dimensions } from "react-native";
import { ThemeContext } from "styled-components";
import { useSelector } from "react-redux";
import { getOptionsPrice, restaurantSelector } from "../store/selectors";
import { Image } from "react-native-expo-image-cache";
import { Alert } from "react-native";
import { Bubble } from "./parts/Bubble";
import { Proxima, ProximaBold } from "./styled/Text";
import { toPrice } from "../utils";

function ProductItem(props: any) {
  const theme = useContext(ThemeContext);
  const {
    id,
    category,
    name,
    description,
    image,
    price,
    summery,
    disabled,
    special_price,
    paid,
    date2,
    margin30,
    restaurantID
  } = props;
  const restaurant = useSelector(restaurantSelector(restaurantID));
  const navigation = useNavigation();

  const amount =
    useSelector(state => state.cart.itemsByID?.[id]?.amount) ??
    (props?.amount || null);
  const options =
    useSelector(state => state.cart.itemsByID?.[id]?.options) ?? props?.options;

  const optionsPrice =
    (!paid
      ? getOptionsPrice(options)
      : options?.reduce((sum, val) => (sum += val.price), 0) || 0) || 0;

  if (summery === true) {
    return (
      <TouchableWithoutFeedback
        disabled={!!disabled ? disabled : false}
        onPress={() =>
          navigation.navigate("Product", { ...props, amount, options })
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
            borderBottomWidth: 1
          }}
        >
          <ProximaBold size={24} color={theme.color.blue}>
            {!!amount && `${amount}x `}
          </ProximaBold>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              flex: 1,
              padding: 10
            }}
          >
            {/* <ProximaBold color={theme.color.blue}>{restaurant.name}</ProximaBold> */}
            <ProximaBold
              size={20}
              align="left"
              adjustsFontSizeToFit
              numberOfLines={2}
              style={{ marginBottom: 5, width: "90%" }}
            >
              {name}
            </ProximaBold>
            {!paid && (
              <Proxima size={12} align="left">
                {description}
              </Proxima>
            )}
            {paid && (
              <View style={{ flexDirection: "column" }}>
                {options?.map((item: any, index: number) => (
                  <Proxima key={item.text} color="grey">
                    • {item.text} {item.price > 0 && `($ ${item.price})`}
                  </Proxima>
                ))}
              </View>
            )}
          </View>
          <ProximaBold size={16}>
            ${toPrice(Number(price) + Number(optionsPrice))}
          </ProximaBold>
          {/* <Text style={{ fontSize: 16, marginLeft: 30 }}>edit</Text> */}
        </View>
      </TouchableWithoutFeedback>
    );
  }
  if (props?.bubble) {
    return (
      <TouchableWithoutFeedback
        disabled={!!disabled ? disabled : false}
        onPress={() =>
          navigation.navigate("TopLevel", {
            screen: "Product",
            params: { ...props, amount, options }
          })
        }
      >
        <View style={{ flexDirection: "row" }}>
          {!!amount && (
            <View
              style={{
                height: "80%",
                width: 8,
                backgroundColor: theme.color.blue,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20
              }}
            />
          )}
          <Bubble bottom>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {!!image && (
                  <Image
                    transitionDuration={600}
                    {...{ uri: image, cache: "force-cache", intensity: 10 }}
                    style={{
                      width: 65,
                      height: 65,
                      resizeMode: "cover",
                      borderRadius: 7
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-around",
                    flex: 1,
                    paddingHorizontal: 10,
                    alignItems: "flex-start"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      padding: 0,
                      alignContent: "flex-end"
                    }}
                  >
                    <ProximaBold
                      size={18}
                      align="left"
                      adjustsFontSizeToFit
                      numberOfLines={2}
                      style={{
                        fontFamily: "ProximaNova-Bold",
                        marginBottom: 5,
                        flexWrap: "wrap",
                        alignSelf: "flex-start"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: theme.color.blue,
                          textAlign: "left"
                        }}
                      >
                        {!!amount && `${amount}x `}
                      </Text>
                      {name}
                    </ProximaBold>
                  </View>
                  {!paid && !!description && (
                    <Proxima size={12} align="left">
                      {description}
                    </Proxima>
                  )}
                  {paid && (
                    <View style={{ flexDirection: "column" }}>
                      {options?.map((item: any, index: number) => (
                        <Proxima key={item.text} color="grey">
                          • {item.text} {item.price > 0 && `($ ${item.price})`}
                        </Proxima>
                      ))}
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 16, fontFamily: "ProximaNova-Bold" }}>
                  ${toPrice(Number(price) + Number(optionsPrice))}
                </Text>
              </View>
            </View>
          </Bubble>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  if (props?.square) {
    return (
      <View style={{ width: Dimensions.get("screen").width }}>
        <TouchableWithoutFeedback
          disabled={!!disabled ? disabled : false}
          onPress={() =>
            navigation.navigate("TopLevel", {
              screen: "Product",
              params: { ...props, amount, options }
            })
          }
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              padding: 20,
              shadowColor: "black",
              shadowOffset: { height: 9 },
              shadowOpacity: 0.1,
              elevation: 4,
              marginBottom: 20,
              borderRadius: 10
            }}
          >
            {!!image && (
              <Image
                {...{ uri: image }}
                style={{
                  width: 65,
                  height: 65,
                  resizeMode: "cover",
                  borderRadius: 7
                }}
              />
            )}
            <Text
              style={{
                fontFamily: "ProximaNova-Bold",
                color: theme.color.blue,
                fontSize: 18,
                textAlign: "center"
              }}
            >
              {name}
            </Text>
            <Text
              style={{ textAlign: "center", fontFamily: "ProximaNova-Light" }}
            >
              {description}
            </Text>
            <Text style={{ fontSize: 16, fontFamily: "Gilroy-Bold" }}>
              $ {toPrice(Number(price) + Number(optionsPrice))}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback
      disabled={!!disabled ? disabled : false}
      onPress={() =>
        navigation.navigate("TopLevel", {
          screen: "Product",
          params: { ...props, amount, options }
        })
      }
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: margin30 ? 20 : 0,
          alignItems: "center",
          flex: 1
        }}
      >
        {!!amount && (
          <View
            style={{
              height: "80%",
              width: 5,
              backgroundColor: theme.color.blue,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20
            }}
          />
        )}
        <View
          style={{
            marginHorizontal: margin30 ? 30 : 0,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          {!!image && (
            <Image
              {...{ uri: image, cache: "force-cache" }}
              style={{
                width: 65,
                height: 65,
                resizeMode: "cover",
                borderRadius: 7
              }}
            />
          )}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              flex: 1,
              padding: 10,
              alignItems: "flex-start"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                padding: 0,
                alignContent: "flex-end"
              }}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={2}
                style={{
                  fontFamily: "ProximaNova-Bold",
                  fontSize: 18,
                  fontWeight: "500",
                  marginBottom: 5,
                  textAlign: "left",
                  flexWrap: "wrap",
                  alignSelf: "flex-start"
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: theme.color.blue,
                    textAlign: "left"
                  }}
                >
                  {!!amount && `${amount}x `}
                </Text>
                {name}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                textAlign: "left",
                color: "rgba(0,0,0,.8)",
                fontFamily: "ProximaNova-Reg"
              }}
            >
              {!paid
                ? description
                : options?.length > 0
                ? options?.map(
                    (item, index) =>
                      item.text + `${index + 1 !== options.length ? ", " : ""}`
                  )
                : description}
            </Text>
          </View>
          <Text style={{ fontSize: 16, fontFamily: "Gilroy-Bold" }}>
            $ {toPrice(Number(price) + Number(optionsPrice))}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default React.memo(ProductItem);
