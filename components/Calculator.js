import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Button from './Button';
import { evaluate } from 'mathjs';
import { useNavigation } from '@react-navigation/native';
const Calculator = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showExtra, setShowExtra] = useState(false);
  const [angleMode, setAngleMode] = useState('radians'); // Default to radians
  const [history, setHistory] = useState([]);

  const handlePress = (value) => {
    if (value === '=') {
      try {
        const result = evaluate(parseInput(input)).toString();
        setOutput(formatOutput(result));
        setHistory([...history, `${input} = ${result}`]); // Corrected template literals
      } catch (e) {
        setOutput('Syntax Error');
      }
    } else if (value === 'C') {
      setInput('');
      setOutput('');
    } else if (value === '⌫') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const handleFunction = (func) => {
    switch (func) {
      case '√':
        setInput(input + 'sqrt(');
        break;
      case '^':
        setInput(input + '^');
        break;
      case 'log':
        setInput(input + 'log10(');
        break;
      case 'ln':
        setInput(input + 'log(');
        break;
      case 'sin':
        setInput(input + 'sin(');
        break;
      case 'cos':
        setInput(input + 'cos(');
        break;
      case 'tan':
        setInput(input + 'tan(');
        break;
      case 'deg':
        setAngleMode('degrees');
        break;
      case 'rad':
        setAngleMode('radians');
        break;
      default:
        handlePress(func);
        break;
    }
  };

  // Convert degrees to radians if angleMode is set to degrees
  const parseInput = (input) => {
    if (angleMode === 'degrees') {
      return input
        .replace(/sin\(([^)]+)\)/g, (_, angle) => `sin(${degreesToRadians(angle)})`)
        .replace(/cos\(([^)]+)\)/g, (_, angle) => `cos(${degreesToRadians(angle)})`)
        .replace(/tan\(([^)]+)\)/g, (_, angle) => `tan(${degreesToRadians(angle)})`);
    }
    return input;
  };

  const degreesToRadians = (degrees) => {
    const angle = parseFloat(degrees);
    if (isNaN(angle)) return '0';
    return angle * (Math.PI / 180);
  };

  const formatOutput = (output) => {
    const num = parseFloat(output);
    if (isNaN(num)) return output;

    // Remove unnecessary decimal places
    if (Number.isInteger(num)) {
      return num.toString();
    } else {
      return Number(num.toFixed(8)).toString(); // Use fixed precision and remove trailing zeros
    }
  };

  const buttons = [
    ['C', '⌫', '√', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '^', '='],
    ['(', ')', 'ln', 'sin'],
    ['cos', 'tan', 'log', 'deg']
  ];

  const getFontSize = (text) => {
    const length = text.length;
    if (length < 10) return 40;
    if (length < 20) return 30;
    return 20;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Calculator</Text>
      <TextInput
        style={styles.input}
        value={input}
        placeholder="0"
        placeholderTextColor="#888"
        editable={false}
        numberOfLines={1}
        ellipsizeMode="tail"
      />
      <Text style={[styles.output, { fontSize: getFontSize(output) }]} numberOfLines={1} ellipsizeMode="tail">
        {output}
      </Text>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {buttons.slice(0, 5).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((btn) => (
              <Button
                key={btn}
                title={btn}
                onPress={() => btn.match(/[√^loglnsincostan]/) ? handleFunction(btn) : handlePress(btn)}
                style={btn === '=' ? styles.equalButton : {}}
              />
            ))}
          </View>
        ))}
        {showExtra && buttons.slice(5).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((btn) => (
              <Button
                key={btn}
                title={btn}
                onPress={() => btn.match(/[√^loglnsincostan]/) ? handleFunction(btn) : handlePress(btn)}
                style={btn === '=' ? styles.equalButton : {}}
              />
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.toggleButton} onPress={() => setShowExtra(!showExtra)}>
          <Text style={styles.toggleButtonText}>{showExtra ? 'Hide' : 'Show'} Extra Operators</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyButton} onPress={() => {
          // Use appropriate navigation function
           navigation.navigate('History', { history });
        }}>
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
        <View style={styles.modeContainer}>
          <TouchableOpacity style={styles.modeButton} onPress={() => handleFunction('deg')}>
            <Text style={styles.modeButtonText}>Degrees</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton} onPress={() => handleFunction('rad')}>
            <Text style={styles.modeButtonText}>Radians</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    fontSize: 40,
    textAlign: 'right',
    width: '100%',
    maxWidth: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  output: {
    textAlign: 'right',
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    color: 'blue',
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow buttons to wrap
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  equalButton: {
    backgroundColor: '#4caf50',
  },
  toggleButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  toggleButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modeButton: {
    width: '48%',
    padding: 15,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    borderRadius: 5,
  },
  modeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  historyButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f39c12',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  historyButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Calculator;
