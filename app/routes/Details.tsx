import React from 'react';
import { View, Text, Button, Image } from 'react-native';

const Details = ({ route, navigation }) => {
  const { title, synopsis, rating, poster } = route.params;
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster}`;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={{ uri: posterUrl }}
        style={{ width: 200, height: 300}}
      />
      <Text>Titulo: {title}</Text>
      <Text>Sinopse: {synopsis}</Text>
      <Text>Nota: {rating}</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default Details;
  