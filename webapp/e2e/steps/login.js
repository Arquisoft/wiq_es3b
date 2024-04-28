const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

      
  });

  test('Login', ({given,when,then}) => {
    
        let username;
        let password;

        given('A registered user', async () => {
        username = "defaultuser"
        password = "defaultpassword"
        });

        when('I fill the data in the form, press submit', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            expect(page).toClick('button.btn')

        

        });
        then('The user must be logged', async () => {
            await page.waitForFunction(() => localStorage.getItem('sessionData') !== null);
            const sessionData = await page.evaluate(() => localStorage.getItem('sessionData'));
            expect(sessionData).toContain('token');

        })
    });

  afterAll(async ()=>{
    browser.close()
  })

});