import { trainBayesClassifier, evaluateBayesQuestion, trainRNN, evaluateRNNQuestion } from './question-classifier';
import { QuestionType } from '@newscience/interfaces';

describe('RNN classifier', () => {
  beforeAll(async () => {
    await trainRNN()
    expect(true).toEqual(true)
  })
  it('should', async() => {
    expect(await evaluateRNNQuestion('hello?')).toEqual(QuestionType.BAD)
  })
})

// describe('bayes classifier', () => {
//   // Train classifier
//   beforeAll(() => {
//     expect(trainBayesClassifier()).toEqual('question-classifier');
//   })
//   it('should work', () => {
//     expect(evaluateBayesQuestion('what do you like?`')).toEqual(QuestionType.BAD)
//   })
// });
