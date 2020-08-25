import { QuestionType } from '@newscience/interfaces'
import * as natural from 'natural'
import * as tf from '@tensorflow/tfjs-node'
import { goodQs, badFirstDateQs, boringQs, dumbThingsQs } from './question-lists';
import { layers, tensor1d } from '@tensorflow/tfjs-node';
const bayesClassifier = new natural.BayesClassifier();
const RNNModel = tf.sequential()

function processQuestion(unprocessed: string): string {
  const lowerCase = unprocessed.toLowerCase()
  return natural.PorterStemmer.stem(lowerCase)
}


/*
  Bayes Classifier
*/
function addDocumentsToBayes(questions: string[], questionType: QuestionType) {
  questions.map(question => bayesClassifier.addDocument(processQuestion(question), questionType.toString()));
}

export function trainBayesClassifier(): string {
  addDocumentsToBayes(goodQs.slice(0, 100), QuestionType.GOOD)
  addDocumentsToBayes(badFirstDateQs, QuestionType.BAD)
  addDocumentsToBayes(boringQs, QuestionType.BAD)
  addDocumentsToBayes(dumbThingsQs, QuestionType.BAD)
  bayesClassifier.train()
  return 'question-classifier';
}

export function evaluateBayesQuestion(question: string): QuestionType {
  return parseInt(bayesClassifier.classify(processQuestion(question))) as QuestionType
}

/*
  RNN Classifier
*/

function addDocumentsToRNN() {
}

function questionsToTensor(questions: string[]){
  return questions.filter(q => q.length >= 20).map(q => {
    const firstTen = q.split('').slice(0, 20).map(char => char.charCodeAt(0))
    return tf.tensor1d(firstTen)
  })
}

export async function trainRNN(): Promise<string> {
  const goodQsTensors = questionsToTensor(goodQs)
  // RNNModel.add(tf.layers.lstm({units: 10, inputShape: goodQsTensors[0].shape, activation: 'relu', returnSequences: true}))
  RNNModel.add(tf.layers.dense({units: 10, inputShape: goodQsTensors[0].shape, activation: 'softmax', name: 'inputBoy'}))
  RNNModel.add(tf.layers.dropout({rate: 0.2}))
  RNNModel.add(tf.layers.dense({units: 1, activation: 'softmax', name: 'innerBoy'}))
  // RNNModel.add(tf.layers.dropout({rate: 0.2}))
  RNNModel.compile({loss: tf.losses.meanSquaredError, optimizer: new tf.AdamOptimizer(0.1, 1, 1)})
  const yAxis = goodQsTensors.map(i => tf.scalar(QuestionType.GOOD))
  await RNNModel.fit(tf.stack(goodQsTensors), tf.stack(yAxis))
  // for (let i = 0; i < goodQsTensors.length; i++) {
  //   // for (let x = 0; x < goodQsTensors[i].length; x++) {
  //     await RNNModel.fit(goodQsTensors[i], tf.tensor1d([QuestionType.GOOD]))
  //   // }
  // }
  return ''
}

export async function evaluateRNNQuestion(question: string): Promise<QuestionType> {
  const ret = await RNNModel.predict(tf.tensor(question.split('').map(char => char.charCodeAt(0))))
  console.log(ret)
  return QuestionType.BAD
}

/*
  // 100,000 is just an estimate
  // RNNModel.add(tf.layers.embedding({inputDim: 100000, outputDim: 64}))
  // RNNModel.add(tf.layers.bidirectional({ layer: tf.layers.lstm({units: 64}) as tf.layers.RNN})) //???
  RNNModel.add(tf.layers.embedding({inputDim: 256, outputDim: 32, }))
  RNNModel.add(tf.layers.simpleRNN({ units: 1, inputDim: 32, activation: 'tanh', useBias: true, }))
  // RNNModel.add(layers.dense({ units: 1, inputDim: 1 }))
  console.log(RNNModel.summary())
  RNNModel.compile({optimizer: 'rmsprop', loss: tf.losses.meanSquaredError})
  // TODO clean up with helper function
  // console.log(questionsToTensor(goodQs).toString())
  const goodQsTensors = questionsToTensor(goodQs)
  for (let i = 0; i < goodQsTensors.length; i++) {
    for (let x = 0; x < goodQsTensors[i].length; x++) {
      await RNNModel.trainOnBatch(goodQsTensors[i][x], tf.tensor1d([QuestionType.GOOD]))
    }
  }
  // await RNNModel.fit(, tf.tensor1d([QuestionType.GOOD]))
  // await RNNModel.fit(questionsToTensor(badFirstDateQs), tf.tensor1d([QuestionType.BAD]))
  // await RNNModel.fit(questionsToTensor(boringQs), tf.tensor1d([QuestionType.BAD]))
  // await RNNModel.fit(questionsToTensor(boringQs), tf.tensor1d([QuestionType.BAD]))
  return ''*/