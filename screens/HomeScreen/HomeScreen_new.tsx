import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Picker
} from "react-native";
import BottomOrderItem from "../../components/BottomOrderItem";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { priceSelector, itemsAmountSelector } from "../../store/selectors";
import {
  getProductsAll,
  getSchools,
  getProducts,
  getRecipesCategory
} from "../../api";

export default function HomeScreenNew({ navigation }) {
  const showCart = useSelector(state => state.cart.items).length;
  const cartPrice = useSelector(priceSelector);
  const itemAmount = useSelector(itemsAmountSelector);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loadingRes, setLoadRes] = useState(false);
  const [loadingSchool, setLoadSchool] = useState(false);
  const [loadingFood, setLoadFood] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const user = useSelector(state => state.auth.user);
  useEffect(() => {
    setLoadRes(true);
    getRecipesCategory()
      .then(res => {
        setCategories(res.data);
        setLoadRes(false);
        getFood(res.data[0].id);
      })
      .catch(err => {
        console.log(err);
        setLoadRes(false);
      });
  }, []);

  function getFood(id) {
    setLoadFood(true);
    setSelectedCategory(id);
    getProducts(id)
      .then(res => {
        setFoods(res.data);
        setLoadFood(false);
      })
      .catch(err => console.log(err));
  }

  function getProductAll() {
    setLoadFood(true);
    setSelectedCategory(0);
    getProductsAll()
      .then(res => {
        setFoods(res.data);
        setLoadFood(false);
      })
      .catch(err => {
        console.log(err);
        setLoadFood(false);
      });
  }
  if (loadingRes) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={{ paddingTop: 40 }}>
          {/* <TouchableWithoutFeedback
              onPress={() => Alert.alert("school.name, school.address")}
            > */}
          <View
            style={{
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 10,
                alignItems: "center",
                backgroundColor: "#f05d4a",
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                padding: 10,
                marginBottom: 20
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5
                }}
              >
                <Feather name="chevron-down" color="pink" size={20} />
              </View>
              <Text
                style={{
                  width: 150,
                  height: 20,
                  color: "white",
                  fontSize: 16,
                  fontFamily: "ProximaNova-Bold"
                }}
              >
                {user.address}
              </Text>
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </View>
        <ScrollView style={styles.mainContainer}>
          <View style={styles.adContainer}>
            <View
              style={{
                width: "30%",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Ionicons name="md-checkmark" size={25} color="#f0b64a" />
              <Text style={{ color: "white", fontSize: 16 }}>
                Hygienically Packed safely Delivered.
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text style={{ color: "white", fontSize: 12, marginRight: 5 }}>
                  How it works
                </Text>
                <Ionicons name="md-play" size={10} color="white" />
              </TouchableOpacity>
            </View>
            <Image
              style={{
                width: 100,
                height: 160,
                position: "absolute",
                right: 20,
                bottom: 0
              }}
              source={{
                uri:
                  "https://firebasestorage.googleapis.com/v0/b/sportify-api.appspot.com/o/images.jpg?alt=media&token=d00420d3-c611-4456-a04d-3509b7d89734"
              }}
            />
          </View>
          <View style={styles.searchContainer}>
            <Ionicons name="md-search" size={20} />
            <TextInput
              value={category}
              placeholder="Search Category"
              placeholderTextColor="grey"
              onChange={text => this.setState({ category: text })}
              style={{ marginLeft: 10 }}
            />
          </View>
          <View>
            <Text style={{ color: "grey", marginVertical: 10 }}>
              CATEGORIES
            </Text>
            <ScrollView horizontal={true}>
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.itemContainer,
                    {
                      borderColor:
                        selectedCategory === index + 1 ? "pink" : "transparent"
                    }
                  ]}
                  onPress={() => getFood(item.id)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                  />
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "grey", marginVertical: 10 }}>
              MIN 30% OFF
            </Text>
            <TouchableOpacity
              style={{ color: "red" }}
              onPress={() => getProductAll()}
            >
              <Text>See All</Text>
            </TouchableOpacity>
          </View>
          {loadingFood ? (
            <ActivityIndicator />
          ) : (
            <View>
              {foods.map((item, index) => (
                <View key={index} style={styles.detailItemContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.detailImg}
                    />

                    <View style={{ marginLeft: 10 }}>
                      <Text>{item.name}</Text>
                      <Text>{item.category}</Text>
                      <Text>{item.price}$</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 3,
                      backgroundColor: "pink",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Ionicons name="ios-add" size={15} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        {showCart > 0 && (
          <View style={{ position: "absolute", width: "100%", bottom: 0 }}>
            <BottomOrderItem
              text={itemAmount + " Items in Cart"}
              price={cartPrice}
              handlePress={() =>
                navigation.navigate("TopLevel", { screen: "Basket" })
              }
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0b64a"
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  mainContainer: {
    padding: 20,
    backgroundColor: "rgba(241,243,244,1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  adContainer: {
    padding: 20,
    backgroundColor: "#f05d4a",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 150,
    width: "100%",
    marginBottom: 20
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "lightgrey",
    borderRadius: 5,
    alignItems: "center",
    padding: 10
  },
  itemContainer: {
    backgroundColor: "white",
    width: 100,
    height: 100,
    padding: 5,
    borderRadius: 5,
    margin: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent"
  },
  categoryImage: {
    width: "100%",
    height: "85%",
    borderRadius: 5
  },
  normalTxt: {
    fontSize: 12
  },
  detailItemContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    height: 100,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  detailImg: {
    width: 100,
    height: "100%",
    borderRadius: 20
  }
});
