import { expect, test } from "playwright-test-coverage";
let callCountGet = 0;
test("creating a store as a franchisee works", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "f@jwt.com", password: "franchisee" };
    const loginRes = {
      user: {
        id: 3,
        name: "pizza franchisee",
        email: "f@jwt.com",
        roles: [
          {
            role: "franchisee",
          },
        ],
      },
      token: "token abc",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise/3", async (route) => {
    callCountGet++;
    const newStore = {
      id: 9,
      name: "Test Store",
      totalRevenue: 0,
    };
    const franchiseRes = [
      {
        id: 1,
        name: "pizzaPocket",
        admins: [
          {
            id: 3,
            name: "pizza franchisee",
            email: "f@jwt.com",
          },
        ],
        stores: [
          {
            id: 1,
            name: "SLC",
            totalRevenue: 0,
          },
        ],
      },
    ];

    if (callCountGet % 2 === 0) {
      franchiseRes[0].stores.push(newStore);
    }
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/franchise/1/store", async (route) => {
    const storeReq = {
      id: "",
      name: "Test Store",
    };
    const storeRes = {
      id: 9,
      franchiseId: 1,
      name: "Test Store",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeRes });
  });

  await page.route("*/**/api/franchise/1/store/9", async (route) => {
    const storeRes = {
      message: "store deleted",
    };
    expect(route.request().method()).toBe("DELETE");
    await route.fulfill({ json: storeRes });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("f@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("franchisee");
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForResponse("*/**/api/auth");

  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "Everything you need to run an JWT Pizza franchise. Your gateway to success.",
  );
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("Test Store");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.locator("tbody")).toContainText("Test Store");
  await page
    .getByRole("row", { name: "Test Store 0 ₿ Close" })
    .getByRole("button")
    .click();
  await expect(page.getByRole("main")).toContainText(
    "Are you sure you want to close the pizzaPocket store Test Store ? This cannot be restored. All outstanding revenue will not be refunded.",
  );
  await expect(page.getByRole("heading")).toContainText("Sorry to see you go");
  await expect(page.getByRole("list")).toContainText("close-store");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.locator("tbody")).not.toContainText("Test Store");
});
