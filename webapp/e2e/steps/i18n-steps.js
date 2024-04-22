const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/i18n.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 10 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is going to try different languages', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "pablo3"
      password = "pabloasw"
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I fill the data in the form, press submit and press langugae button', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      
      await expect(page).toClick('button.btn', { text: '' });

      await expect(page).toMatchElement("span", { text: "Classic Game" });

      await expect(page).toClick('button.menuLeft', { text: '' });

      await expect(page).toClick('div.languageButton', { text: '' });

      await expect(page).toClick('li', { text: 'Spanish' });
    });

    then('A Classic Game message should be shown in different languages', async () => {

        await expect(page).toMatchElement("span", { text: "Juego Clásico" });

        await expect(page).toClick('div.languageButton', { text: '' });
        await expect(page).toClick('li', { text: 'Italiano' });
        await expect(page).toMatchElement("span", { text: "Gioco Classico" });

        await expect(page).toClick('div.languageButton', { text: '' });
        await expect(page).toClick('li', { text: 'Francese' });
        await expect(page).toMatchElement("span", { text: "Jeu classique" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});