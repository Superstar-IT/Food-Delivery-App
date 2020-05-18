import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector, batch } from "react-redux";

const RecipeItemScreen = props => {
  const { navigation } = props;
  navigation.setOptions({
    headerShown: false
  });

  const [others, setOthers] = useState({
    difficulty: "easy",
    pre: 20,
    cook: 5
  });

  const [ingredients, setIngredients] = useState([]);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    let ingredients_temp = props.route.params.data.ingredients;
    ingredients_temp.forEach(element => {
      element.selected = false;
    });
    setIngredients(ingredients_temp);
  }, []);

  const handleIngredienets = (item, index) => {
    let temp = item;
    temp.selected = !item.selected;
    const result = [...ingredients];
    result[index] = temp;
    setIngredients([...result]);
  };

  function calculateSelected() {
    let amount = 0;
    let price = 0;
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].selected === true) {
        amount++;
        price = price + ingredients[i].price;
      }
    }
    return { amount, price };
  }

  function handleAddCart() {
    dispatch({
      type: "ADD_TO_CART_NEW",
      payload: {
        ...props.route.params.data,
        amount: calculateSelected().amount,
        price: calculateSelected().price,
        extra: "",
        options: false
      }
    });
    navigation.goBack();
  }
  const { data } = props.route.params;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Ionicons name="md-arrow-back" size={30} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22 }}>{data.name}</Text>
        <Ionicons name="md-cloud-upload" size={30} />
      </View>
      <View style={styles.itemContainer}>
        <Image source={{ uri: data.image }} style={styles.img} />
      </View>
      <Text style={styles.normalTxt}>{data.description}</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.titleTxt}>Ingredients</Text>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={{ width: "70%" }}>
            {ingredients.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.smallItemContainer}
                onPress={() => handleIngredienets(item)}
              >
                <View
                  style={[
                    styles.checkBox,
                    {
                      backgroundColor: item.selected ? "#91f261" : "lightgrey"
                    }
                  ]}
                >
                  <Ionicons
                    name="md-checkmark"
                    size={20}
                    color={item.selected ? "white" : "lightgrey"}
                  />
                </View>
                <Text style={styles.normalTxt}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ width: "30%" }}>
            <View style={styles.smallItemContainer}>
              <Ionicons
                name="md-stats"
                size={20}
                color="grey"
                style={styles.icon}
              />
              <Text style={styles.normalTxt}>{others.difficulty}</Text>
            </View>
            <View style={styles.smallItemContainer}>
              <Ionicons
                name="md-alarm"
                size={20}
                color="grey"
                style={styles.icon}
              />
              <Text style={styles.normalTxt}>{others.pre}</Text>
            </View>
            <View style={styles.smallItemContainer}>
              <Ionicons
                name="md-flame"
                size={20}
                color="grey"
                style={styles.icon}
              />
              <Text style={styles.normalTxt}>{others.cook}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.titleTxt}>Instructions</Text>
        <Text style={styles.normalTxt}>{data.instruction}</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => handleAddCart()}>
        <Ionicons name="md-cart" color="white" size={30} />
        <Text style={styles.addBtnTxt}>
          ADD {calculateSelected().amount} INGREDIENTS TO CART
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white"
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20
  },
  itemContainer: {
    marginVertical: 10
  },
  smallItemContainer: {
    flexDirection: "row",
    marginVertical: 3,
    alignItems: "center"
  },
  checkBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 15
  },
  img: {
    width: "100%",
    height: 250,
    borderRadius: 10
  },
  titleTxt: {
    fontSize: 20,
    color: "#91f261",
    marginVertical: 5
  },
  normalTxt: {
    fontSize: 16
  },
  icon: {
    marginRight: 10
  },
  addBtn: {
    backgroundColor: "#91f261",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 10,
    marginBottom: 40
  },
  addBtnTxt: {
    color: "white",
    fontSize: 14,
    marginLeft: 20
  }
});

export default RecipeItemScreen;
