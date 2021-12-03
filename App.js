import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { getDatabase, ref, onValue, set } from "firebase/database";
import styles from "./Style";
import "./Firebase";
const Game = (props) => {
  const [currScore, setCurrScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [outcome, setOutcome] = useState("");

  const db = getDatabase();
  const reference = ref(db);

  useEffect(() => {
    onValue(
      reference,
      (snapshot) => {
        if (snapshot.val() !== null) {
          setHighScore(snapshot.val().highest);
          setCurrScore(snapshot.val().current);
        }
      }
      // { onlyOnce: true }
    );
  }, []);

  const storeData = (highScore, currScore) => {
    set(reference, {
      highest: highScore,
      current: currScore,
    });
  };

  const playGame = (playerChoice) => {
    let choiceArr = ["rock", "paper", "scissors"];

    const comChoice = choiceArr[Math.floor(Math.random() * 3)];

    if (
      (playerChoice === "paper" && comChoice === "rock") ||
      (playerChoice === "rock" && comChoice === "scissors") ||
      (playerChoice === "scissors" && comChoice === "paper")
    ) {
      setOutcome("You Won!");
      if (currScore + 1 > highScore) {
        setCurrScore(currScore + 1);
        setHighScore(currScore + 1);
        storeData(currScore + 1, currScore + 1);
      } else {
        setCurrScore(currScore + 1);
        storeData(highScore, currScore + 1);
      }
    } else if (
      (playerChoice === "rock" && comChoice === "paper") ||
      (playerChoice === "scissors" && comChoice === "rock") ||
      (playerChoice === "paper" && comChoice === "scissors")
    ) {
      setOutcome("You Lose!");
      setCurrScore(0);
      storeData(highScore, 0);
    } else {
      setOutcome("You Tied!");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 50, marginTop: 50 }}>
        High score: {highScore}
      </Text>
      <View style={styles.gameChoiceContainer}>
        <Pressable
          style={styles.gameChoiceButton}
          onPress={() => playGame("rock")}
        >
          <Text style={styles.buttonText}>⚪</Text>
        </Pressable>
        <Pressable
          style={styles.gameChoiceButton}
          onPress={() => playGame("paper")}
        >
          <Text style={styles.buttonText}>📜</Text>
        </Pressable>
        <Pressable
          style={styles.gameChoiceButton}
          onPress={() => playGame("scissors")}
        >
          <Text style={styles.buttonText}>✂️</Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 50 }}>Current score: {currScore}</Text>

      <Text style={{ fontSize: 25 }}>{outcome}</Text>
    </View>
  );
};

export default Game;
