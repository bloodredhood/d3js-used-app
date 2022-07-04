import './App.css';
import { useEffect } from 'react';
import { words } from "./components/words"
import * as d3 from "d3"
import rd3 from 'react-d3-library'

function App() {



  useEffect(() => {

    const numberOfRow = 780

    const neededWords = []
    words.forEach(word => {
    // !!!!! ВАЖНО !!!!! разница в длине не должна превышать 4 символов, минимальная длина не больше 11 символов - дальше ячейки становятся очень маленькими для букв и добавлять цвета новые (11-15(только одно слово такой длины) - 10 слов)(10-14 - 9 слов)(9-13 - 8 слов) и т.д. на уменьшение. Не вижу смысла в случае такой схемы менять количество слов, следует придумать новые схемы расположения слов в матрице
      if (word.length >= 10 && word.length <= 14) {
        neededWords.push(word)
      }
    })
    //console.log(neededWords)

    const randomWords = (arr) => {
      const result = []
      const getRandomNum = (max) => {
        return Math.floor(Math.random() * (max - 1) + 1)
      }
      const arrForClip = [...arr]
      const shortestWord = arr.reduce((a, b) => (a.length <= b.length ? a : b))
      for (let i = 0; i < arr.length; i++) {
        if (result.length < shortestWord.length - 1) {
          const word = arrForClip[getRandomNum(arrForClip.length)]
          result.push(word)
          arrForClip.splice(arrForClip.indexOf(word), 1)
        }
      }
      return result
    }

    const someWords = randomWords(neededWords)
    console.log(someWords)

    const wordLines = someWords.map((word, index) => {
      //создаем на основе массива условно-случайных слов новый массив, хранящий в виде объектов слова с разделитями '' для внедрения их в массив-матрицу
      return ({
        letters: word.split(''),
        //массив, в котором элементами-строками переданы буквы, включая места выталкивания букв '' между буквами
        startCoord: { x: 0, y: 0 },
        //место в матрице согласно координатам, где разположена первая буква
        horisontal: (index % 2) ? false : true, //каждое нечетное будет вертикальным
        //проверка на направление слова в матрице: четные горизонтальные
        index: index,
        //положение слова во входном условно-случнайном массиве
        coords: [],
        //сюда прилетает массив с объектами точек пересечения
        breakersNum: 0
      })
    })

    //wordLines будет базой данных для построения приложения. Нужно каким-тообразом наполнитть динамически данные о координанах
    //нужно составить схему расположения координат слов, построение конец => начало
    wordLines.forEach((line, idx) => {
      if (wordLines.length % 2 === 0) {
        line.breakersNum = Math.floor((wordLines.length - idx) / 2)
      } else if (wordLines.length % 2 !== 0) {
        line.breakersNum = Math.floor((wordLines.length - idx) / 2)
      }
    })



    const breakerFunc = (arr, breakersNum) => {

      const spaceStep = [2, 4, 6, 8];
      let maxBreakerNum = Math.floor(wordLines.length / 2)
      let placeChanger = maxBreakerNum - breakersNum

      let firstSpace = (arr, breakNum, placeChan) => {

        if (breakNum === 0) {
          return arr;
        }

        if (wordLines.length % 2 === 0) {
          arr.splice(Math.floor((arr.length - (breakNum - 1)) / 2 + placeChan), 0, '')
        } else if (wordLines.length % 2 !== 0) {
          arr.splice(Math.ceil((arr.length - (breakNum - 1)) / 2 + placeChan), 0, '')
        }

      };

      let multiSpaceAdd = (arr, breakNum, step) => {
        if (breakNum === 0 && breakNum === 1) {
          return arr;
        }
        const spaceAdd = (array, count) => {
          array.splice(arr.indexOf("") + count, 0, "");
        };
        for (let i = 0; i < breakNum; i++) {
          spaceAdd(arr, step[i]);
        }
      };

      firstSpace(arr, breakersNum, placeChanger);
      multiSpaceAdd(arr, breakersNum, spaceStep);
      //увеличивем кол-во координат на 1  

      //console.log(arr)
      return arr
    };

    wordLines.forEach(line => {
      line.letters = breakerFunc(line.letters, line.breakersNum)
    })
    console.log(wordLines)

    wordLines.forEach(line => {
      if (line.horisontal) {//если слово распологается горизонтально

        line.startCoord.x = Math.floor((numberOfRow / 2 - Math.ceil(line.letters.length / 2))) + 1
        //сверху отступ размером в половину слова
        line.startCoord.y = Math.floor(numberOfRow / 2) + (line.index - (Math.ceil(someWords.length / 2)))
        //задаем стартовую координату по х и у
        line.coords = line.letters.map((item, index) => {
          return [line.startCoord.x + index * 50, line.startCoord.y]
          //назначаем массив-координаты каждой букве в зависимости от положения первого символа и направления слова
        })
  
  
        // console.log(data)
      }
      else {//если слово распологается вертикально
        line.startCoord.x = Math.floor(numberOfRow / 2) + (line.index - (Math.ceil(someWords.length / 2))) // стоит пересмотреть фиксированное значение
        line.startCoord.y = Math.floor((numberOfRow / 2 - Math.ceil(line.letters.length / 2)))
        //задаем стартовую координату по х и у
        line.coords = line.letters.map((item, index) => {
          return [line.startCoord.x, line.startCoord.y + index * 50]
          //назначаем массив-координаты каждой букве в зависимости от положения первого символа и направления слова
        })
  
      }
    })
   


    //d3js начинается тут

    const canvas = rd3.select('div')

    //в атрибутах будет коодината первой точки относительно верхней левой точки канваса
    const word0 = canvas
      .append('circle')
      .data(wordLines[0])
      .attr('r', 40)
      .attr('cx', 50)
      .attr('cy', 50)
    const word1 = canvas
      .append('circle')
      .data(wordLines[1])
      .attr()
      .attr()
      .attr()
    const word2 = canvas
      .append('circle')
      .data(wordLines[2])
      .attr()
      .attr()
      .attr()
    const word3 = canvas
      .append('circle')
      .data(wordLines[3])
      .attr()
      .attr()
      .attr()
    const word4 = canvas
      .append('circle')
      .data(wordLines[4])
      .attr()
      .attr()
      .attr()
    const word5 = canvas
      .append('circle')
      .data(wordLines[5])
      .attr()
      .attr()
      .attr()
    const word6 = canvas
      .append('circle')
      .data(wordLines[6])
      .attr()
      .attr()
      .attr()
    const word7 = canvas
      .append('circle')
      .data(wordLines[7])
      .attr()
      .attr()
      .attr()
    const word8 = canvas
      .append('circle')
      .data(wordLines[8])
      .attr()
      .attr()
      .attr()
    const word9 = canvas
      .append('circle')
      .data(wordLines[9])
      .attr()
      .attr()
      .attr()


  }, [])

  return (
    <div >
      <svg id="canvas" height="1080px" width="780px" className="App canvas"></svg>
    </div>
  );
}

export default App;
