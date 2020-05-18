import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { getRecipesCategory, getRecipesAll, getRecipesById } from "../../api";
export default class RecipeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      recipes: [],
      loadingCategory: false,
      loadingRecipe: false,
      selectedCategory: 0
    };
  }

  componentDidMount() {
    this.setState({ loadingCategory: true, loadingRecipe: true });
    getRecipesCategory()
      .then(res => {
        let temp = {
          id: 0,
          name: "All",
          restaurantID: null
        };
        let result = res.data;
        result.unshift(temp);
        this.setState({
          categories: result
        });
        getRecipesAll()
          .then(res => {
            this.setState({
              recipes: res.data,
              loadingCategory: false,
              loadingRecipe: false
            });
          })
          .catch(err => {
            console.log(err);
            this.setState({ loadingCategory: false });
          });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loadingCategory: false });
      });
  }

  onHandleCategory = (id, index) => {
    this.setState({ loadingRecipe: true, selectedCategory: index });
    if (id === 0) {
      getRecipesAll()
        .then(res => {
          this.setState({
            recipes: res.data,
            loadingRecipe: false
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loadingRecipe: false });
        });
    } else {
      getRecipesById(id)
        .then(res => {
          this.setState({
            recipes: res.data,
            loadingRecipe: false
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loadingRecipe: false
          });
        });
    }
  };

  handlePressItem = item => {
    this.props.navigation.navigate("RecipeItem", { data: item });
  };

  render() {
    const {
      loadingCategory,
      loadingRecipe,
      categories,
      recipes,
      selectedCategory
    } = this.state;
    if (loadingCategory) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={{ height: 80, marginTop: 40 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryContainer,
                    {
                      backgroundColor:
                        index === selectedCategory ? "#71e390" : "transparent"
                    }
                  ]}
                  onPress={() => this.onHandleCategory(item.id, index)}
                >
                  <Text
                    style={{
                      color: index === selectedCategory ? "white" : "black",
                      fontSize: 14
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {loadingRecipe ? (
            <ActivityIndicator size="small" />
          ) : (
            <ScrollView>
              {recipes.map((item, index) => (
                <TouchableOpacity
                  style={styles.recipeContainer}
                  key={index}
                  onPress={() => this.handlePressItem(item)}
                >
                  <Image
                    style={styles.recipeImage}
                    source={{ uri: item.image }}
                  />
                  <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  container: {
    padding: 20,
    flex: 1,
    flexDirection: "column"
  },
  categoryContainer: {
    borderRadius: 30,
    height: 50,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5
  },
  recipeContainer: {
    borderRadius: 10,
    backgroundColor: "#d6d5d2",
    marginVertical: 10
  },
  recipeImage: {
    borderRadius: 10,
    width: "100%",
    height: 200
  }
});
