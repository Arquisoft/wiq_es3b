const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/play-classic.feature');

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
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (req.method() === "OPTIONS") {
          req.respond({
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "*",
            },
          });
        } else if (req.url().includes("/questions")) {
          req.respond({
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            contentType: "application/json",
            body: JSON.stringify(
              {
                question: "question",
                incorrects: [
                  "answer 1",
                  "answer 2",
                  "answer 3"
                ],
                correct: "correct",
              },
            ),
          });
        } else {
          req.continue();
        }
      });

      
  });

  test('The user is going to play classic mode', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "play-classic-user"
      password = "defaultpassword"
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I fill the data in the form, press submit, press Classic Mode button and play game', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toFill('input[name="confirmPassword"]', password);
        
        await expect(page).toClick('button.btn', {text: "Sign Up"});
    

        await expect(page).toClick('button.btn', { text: 'Classic Game' });
        for(let i = 0; i <10; i++) {
                await page.waitForSelector('ul li span');
                await expect(page).toClick('ul li span');
                await page.waitForSelector('.botoneraPreguntas div', { visible: true, enabled: true });
                await expect(page).toClick('.botoneraPreguntas div');
        }

    });

    then('A Game Over message should be shown in the screen', async () => {
      await page.waitForSelector('p', { text: 'Game Over' });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});