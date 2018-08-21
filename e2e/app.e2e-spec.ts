import { ChatExamplePage } from './app.po';

describe('chat-example App', function() {
  let page: ChatExamplePage;

  beforeEach(() => {
    page = new ChatExamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
