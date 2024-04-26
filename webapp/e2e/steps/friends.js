const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/friends.feature');

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
    await page.setViewport({ width: 1080, height: 980 });

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
      
  });

  test('The user is going to add a friend', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "add-friend-user"
      password = "defaultpassword"
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I fill the data in the form, press submit, press Friends and adds a friend', async () => {
        await page.waitForSelector('input[name="username"]');
        await expect(page).toFill('input[name="username"]', username);

        await page.waitForSelector('input[name="password"]');
        await expect(page).toFill('input[name="password"]', password);

        await page.waitForSelector('input[name="confirmPassword"]');
        await expect(page).toFill('input[name="confirmPassword"]', password);

        await page.waitForSelector('button.btn');
        await expect(page).toClick('button.btn', { text: '' });

        await page.waitForSelector('div a');
        await expect(page).toClick('div a', { text: 'Friends' });

        await page.waitForSelector('.searchForm input');
        await expect(page).toFill('.searchForm input', 'defaultuser');

        await page.waitForSelector('button.btn');
        await expect(page).toClick('button.btn', { text: '' });

    });

    then('The friend will be added', async () => {
        await expect(page).toMatchElement('.tableFriends', { text: 'defaultuser' });
    });
  })
  test('The user is going to remove a friend', ({given,when,then}) => {

    given('A registered user with one friend', async () => {
    });

    when('I am in Friends page and select the friend to remove', async () => {
        await page.waitForSelector('.tableFriends button.btn');
        await expect(page).toClick('.tableFriends button.btn', { text: 'Delete friend' });

    });

    then("The friend will be removed from the user's friend list", async () => {
        await expect(page).not.toMatchElement('.tableFriends', { text: 'defaultuser' });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});