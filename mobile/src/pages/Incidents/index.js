import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import api from "../../services/api";
import Styles from "./styles";
import logoImg from "../../assets/logo.png";

export default function Incidents() {
  const navigation = useNavigation();

  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  function navigateToDetail(incident) {
    navigation.navigate("Detail", { incident });
  }

  async function loadIncident() {
    if (loading) return;

    if (total > 0 && incidents.length === total) return;

    try {
      setLoading(true);

      const response = await api.get(`/incidents?page=${page}`);

      setIncidents([...incidents, ...response.data]);
      setTotal(response.headers["x-total-count"]);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de casos");
    }
  }

  useEffect(() => {
    loadIncident();
  }, []);

  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <Image source={logoImg} />
        <Text style={Styles.headerText}>
          Total de <Text style={Styles.headerTextBold}>{total} casos</Text>.
        </Text>
      </View>

      <Text style={Styles.title}>Bem-vindo!</Text>
      <Text style={Styles.description}>
        Escolha um dos casos abaixo e salve o dia.
      </Text>

      <FlatList
        style={Styles.incidentsList}
        data={incidents}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncident}
        onEndReachedThreshold={0.3}
        renderItem={({ item: incident }) => (
          <View style={Styles.incident}>
            <Text style={Styles.incidentProperty}>ONG: </Text>
            <Text style={Styles.incidentValue}>{incident.name}</Text>

            <Text style={Styles.incidentProperty}>CASO: </Text>
            <Text style={Styles.incidentValue}>{incident.title}</Text>

            <Text style={Styles.incidentProperty}>VALOR: </Text>
            <Text style={Styles.incidentValue}>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(incident.value)}
            </Text>

            <TouchableOpacity
              style={Styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={Styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
