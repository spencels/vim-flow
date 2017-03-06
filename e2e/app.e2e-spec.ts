import { AngularFlowPage } from './app.po';

describe('angular-flow App', () => {
  let page: AngularFlowPage;

  beforeEach(() => {
    page = new AngularFlowPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
