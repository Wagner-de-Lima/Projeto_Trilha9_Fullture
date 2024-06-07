import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: API_KEY,
          }
        });
        setCategories(response.data.genres);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchCategories();

    fetchRecentMoviesByCategory('');
  }, []);

  const searchMovies = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: API_KEY,
          query: searchTerm
        }
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    }
  };

  const fetchRecentMoviesByCategory = async (categoryId) => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: API_KEY,
          sort_by: 'release_date.desc',
          with_genres: categoryId
        }
      });
      setMovies(response.data.results.slice(0, 10));
    } catch (error) {
      console.error('Erro ao buscar filmes recentes:', error);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetails(item)}>
      <View style={styles.movieContainer}>
        <Image
          style={styles.poster}
          source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
        />
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const navigateToDetails = async (movie) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
        params: {
          api_key: API_KEY,
        }
      });
      navigation.navigate('Details', {
        title: movie.title,
        synopsis: movie.overview,
        rating: movie.vote_average,
        poster: response.data.poster_path
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pesquisar..."
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <Button title="Search" onPress={searchMovies} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ marginRight: 10, fontSize: 16, fontWeight: 'bold' }}>Categorias:</Text>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => fetchRecentMoviesByCategory(item.id)}>
              <Text style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 10 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ marginTop: 5 }}
        />
      </View>
      <View style={styles.moviesContainer}>
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  moviesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  poster: {
    width: 100,
    height: 150,
  },
});

export default Home;
  