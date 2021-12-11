/*
 * Simon Says Game Main Screen
 * author:
 * Simon 'intenceC' Katznelson
*/

// TODO add listener on navigation.pop() to properly unmount object
//=================================================================
//=================================================================
// Dependencies
 import './global.js'

 let styles = require('./cmn.js');

 import
     Tone
     from  "react-native-tone-android";

 import
        {
    increment,
    decrement,
    setVal,
    setIdx,
    store
        }
    from './eRedux.js'

 import {
     applyMiddleware,
	 createStore,
	 combineReducers
        }
	 from 'redux';

 import {
     widthPercentageToDP  as wp,
     heightPercentageToDP as hp
        }
	 from 'react-native-responsive-screen';

 import * as React from 'react';
 import {
	NavigationContainer 
        }
	from '@react-navigation/native';

 import {
	createNativeStackNavigator 
        }
	from '@react-navigation/native-stack';

 import type {
	 Node
             }
	from 'react';

  import  {
      useState
    }
    from 'react';

 import {
  Button, 
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  AppRegistry
        }
  from 'react-native';

 import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
        }
  from 'react-native/Libraries/NewAppScreen';

 import {
  createStackNavigator,
        }
  from 'react-navigation-stack';

 import {
	withNavigation
		} from 'react-navigation';

 import
    AsyncStorage
    from '@react-native-async-storage/async-storage';
//=================================================================
//=================================================================
 let tick = 0;
 let que  = 0;
 let btn  = ['a', 'c', 'd', 'b'];
 let tone = [700, 500, 400, 600];
 let usrQue = [];
 let botQue = [];
 let queIdx = 0;
 let inCue  = 0;
 let outCue = 0;
 let playIt = 0;
 let text = '';
 let eText = '';
//==================================================================
//==================================================================

const toneGen = (frequency)  =>  {
//                 (Hz)
  const duration   = 150; // ms
  Tone.play(frequency, duration);
}

const  storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
      } catch (e) {         console.log(e);
   }
}

const  clean = () =>  {
    clearInterval(playIt);
	tick   = 0;
	que    = 0; 
    inCue  = 0;
    queIdx = 0;
    outCue = 0;
    playIt = 0;
    queIdx = 0;
}
//=================================================================
//=================================================================
// Game Module

export default
class mainScreen extends React.Component {

 constructor() {
    super();
    this.state = {
    output: "Press a Button to Start", info: "",
    values: {}, key: 0, btnA: 0, btnB: 0, btnC: 0, btnD: 0,
    name: '', sendText: '', page: 0, isStarted: false, modalVisible: false, txtVal: ''
    }
   this.togOn = 0;
   this.botAtPlay = 0;
   this.pTick;
 }

//=================================================================
//=================================================================
componentWillUnmount() {
   clearInterval(this.pTick);
}


btnTog(key, dir)    {
      switch(key) {
          case 'a':
            this.setState({ btnA: dir });
              break;
          case 'b':
            this.setState({ btnB: dir });
              break;
          case 'c':
            this.setState({ btnC: dir });
              break;
          case 'd':
            this.setState({ btnD: dir });
              break;
      }

        if(dir && this.state.isStarted) 
		 for(let i = 0; i < 4; i++) 
          if(key == btn[i])
		   toneGen(tone[i]);
}

//=================================================================
//=================================================================
gameStop() {
    this.setState({ output: `   YOUR SCORE:   ${ global.Score - 4 }` });
    this.state.isStarted = false;
    clearInterval(this.pTick);
    clearInterval(playIt);
	tick   = 0;
	que    = 0; 
    inCue  = 0;
    queIdx = 0;
    outCue = 0;
    playIt = 0;
    queIdx = 0;
}

gameInit() {
 if(this.state.isStarted == true)
 return;
 clearInterval(playIt);

 this.setState({ output: `...game running! ` });
 inCue  = 0;
 queIdx = 0;
 this.state.isStarted = true;

  for(let y = 0; y < 4; y++) {
  let randKey = Math.floor((Math.random() * 4));
  botQue[++queIdx] = randKey;

 }
 this.playSeq();
}
/* */

playSeq() {
let t = 0;

  playIt = setInterval(() => {
    if(t++ == 5) {
       t = 0;
  for(let y = 0; y < 4; y++)
  this.btnTog(btn[y], 0);
    if(inCue > queIdx) {
    inCue = 0;
    outCue = 0;
    clearInterval(playIt);
       }
     } else
    if(t == 2) {
  this.btnTog(btn[botQue[inCue++]], 1);

    }
 },
   100);
}

playerRec(key) {
  if(this.botAtPlay == 1)
    return;

  usrQue[outCue] = key;

  if( outCue > 0 && usrQue[outCue] !== btn[botQue[outCue + 1]] ) {
    global.Score = queIdx;
    store.dispatch(setVal());
    this.state.isStarted = false;
    this.setState({ modalVisible: true });
  }
  console.log('usrkey :' + usrQue[outCue] + ' botkey :' + btn[botQue[outCue + 1]]);

  if(outCue == queIdx - 1) {
  outCue = 0;
  this.botAtPlay = 1;
  this.simonPlays();
  }
  outCue++;
}
/**/
simonPlays() {
 if(this.state.isStarted == false)
    return;
 // update info screen
  this.setState({ output: `...game running! Score: ${ queIdx - 3 }` });
  if(this.botAtPlay == 1) {
  let randKey = Math.floor((Math.random() * 4));
  botQue[++queIdx] = randKey;

  this.playSeq();
  this.botAtPlay = 0;
 }
}

//=================================================================
//=================================================================
    /*    Running Lights   */
    /*  15ms tick routine  */
  pTick = setInterval(() => {
  tick = tick++ > 10 ? 0 : tick;

  if(tick == 10) {
      this.btnTog(btn[que], 0);
      que = que++ > 3 ? 0 : que;

    } else
  if(tick == 0) {
      this.btnTog(btn[que], 1);
    }
      if(this.state.isStarted == true) {
      clearInterval(this.pTick);
      for(let i = 0; i < 3; i++)
         this.btnTog(btn[i], 0);
     }
  },
    15);

//=================================================================

tOut = () => setTimeout(() => {
      clearTimeout(this.tOut);
      clean();
      this.props.navigation.navigate("Score Table");
  },
    350); 
//=================================================================
//=================================================================

  buttonStyle = (clr) => {
    return  Object.assign( {}, styles.buttonGame, 
    { backgroundColor: clr } );
  };
//=================================================================
//=================================================================

  render() {
  return (
    <View   style = { styles.container }>
    <View>

    <ScrollView
    ref = { ref => this.scrollView = ref }
    onContentSizeChange = {(contentWidth, contentHeight) => {
    this.scrollView.scrollToEnd({ animated: true });
	 }
	}
    style = {styles.output} nestedScrollEnabled = { true }>

   <Text  style = { styles.full }>
   { this.state.output === "" ? "" : this.state.output }
   </Text>
   </ScrollView>
{/**/}
     <View   style = { styles.line }> 
     <TouchableHighlight
     activeOpacity = { 0.8 }
     underlayColor = "#FFBF00"
     onPress = { () => {
      this.gameInit(),
      this.playerRec('a'),
      toneGen(700),
      console.log("yellow");

     }}
     style = { this.buttonStyle(this.state.btnA ? "#FFBF00" : "#FCF3CF") }
	  >
      <Text style = { styles.buttonText }></Text>
     </TouchableHighlight>

   <TouchableHighlight
     activeOpacity = { 0.8 }
     underlayColor = "#0000FF"
     style = { this.buttonStyle(this.state.btnB ? "#0000FF" : "#AED6F1") }
     onPress = { () => {
         this.gameInit(),
         this.playerRec('b'),
         toneGen(600),
       console.log("blue");
    }
	   }
          >
     <Text style = {styles.buttonText}></Text>
 </TouchableHighlight>
 </View>

 <View style = { styles.line } >
      <TouchableHighlight
     activeOpacity = { 0.8 }
     underlayColor = "#FF0000"
        style = { this.buttonStyle(this.state.btnC ? "#FF0000" : "#FADBD8") }

        onPress = { () => {
            this.gameInit(),
            this.playerRec('c'),
            toneGen(500),
            console.log("red");
        }}>
        <Text style = {styles.buttonText}></Text>
      </TouchableHighlight>

      <TouchableHighlight
     activeOpacity = { 0.8 }
     underlayColor = "#00FF00"
        style = { this.buttonStyle(this.state.btnD ? "#00FF00" : "#DAF7A6") }

        onPress = { () => {
        this.gameInit(),
        this.playerRec('d'),
        console.log("green"),
        toneGen(400)
     }}>
        <Text style = {styles.buttonText}></Text>
      </TouchableHighlight>
 </View>
      
      <TouchableHighlight
      underlayColor = "#FFF"
	  style = { styles.buttonGameX }
        onPress = { () => {
        this.gameInit(); 
        } }>
      <Text style = {styles.buttonText}>
			{ this.state.isStarted ? 'PLAY!' : 'Hit To Start!' }
	  </Text>
      </TouchableHighlight>

        <View style = { styles.view }>
        <Modal transparent = { true }
          visible = { this.state.modalVisible }
          >
          <View style = { styles.view }>
            <View style = { styles.modalView }>
              <Text style = { styles.modalText }>{ `Your Score: ${(global.Score - 4).toString()}`}</Text>

                <TextInput
                style = { styles.modalText }
                placeholder = "Enter your Name!"
                onChangeText = { text => eText = text }
                defaultValue = { text }/>

                              <TouchableHighlight
                style = {{ ...styles.buttonGameX, backgroundColor: "#2196F3" }}
                onPress = { () => {
                global.Idx = store.getState().reducer.idx;
                global.Idx = (global.Idx == 0) ? 1 : global.Idx;
                global.Idx = global.Idx++ > 9 ? 1 : global.Idx;
                store.dispatch(setIdx());
                eText = eText == '' ? 'Player_' + global.Idx.toString() : eText;
                storeData('_name' + global.Idx.toString(),  eText);
                storeData('_key' +  global.Idx.toString(),  (global.Score - 4).toString());
                global.fillScr = 1;
                eText = '';
                this.setState({ modalVisible: false });
                this.tOut();
                    }}>
                <Text style = { styles.buttonText }> Confirm </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style = {{ ...styles.buttonGameX, backgroundColor: "#2196F3" }}
                onPress = {() => {
                   global.fillScr = 1;
                   this.setState({ modalVisible: false });
                   this.tOut();
				   }}>
                <Text style = { styles.buttonText }> Cancel </Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>

      </View>

  </View>
 </View>
    );
  }
}
//=================================================================
//=================================================================

