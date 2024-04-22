const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/close-session.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is going to close the session', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "pablo2"
      password = "pabloasw"
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I fill the data in the form, press submit and press Logout button', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      
      await expect(page).toClick('button.btn', { text: '' });

      await expect(page).toClick('button.perfilButton', { text: '' });

      await expect(page).toClick('li', { text: 'Logout' });
    });

    then('A title message should be shown in the screen', async () => {
        await expect(page).toMatchElement("h1.titleLoginRegister", { text: "" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});