import { supplementInfo } from './supplement-info';

describe('supplementInfo', () => {
  it('should work', () => {
    const suppInfo = supplementInfo('Acorus calamus')
    console.log(suppInfo)
    // expect(supplementInfo()).toEqual('supplement-info');
  });
});
