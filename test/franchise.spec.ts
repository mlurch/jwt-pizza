import { test, expect } from "playwright-test-coverage";

let getCallCount = 0;

test("create and close franchise with login", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 1,
        name: "常用名字",
        email: "a@jwt.com",
        roles: [
          {
            role: "admin",
          },
        ],
      },
      token: "token abc",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    let franchiseRes;
    let franchiseReq;
    if (route.request().method() === "GET") {
      getCallCount++;
      const extra = {
        id: 17,
        name: "Test Franchise",
        admins: [
          {
            id: 3,
            name: "pizza franchisee",
            email: "f@jwt.com",
          },
        ],
        stores: [],
      };
      franchiseRes = [
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
      if (getCallCount % 2 === 0) {
        franchiseRes.push(extra);
      }
      expect(route.request().method()).toBe("GET");
    } else {
      franchiseReq = {
        stores: [],
        id: "",
        name: "Test Franchise",
        admins: [
          {
            email: "f@jwt.com",
          },
        ],
      };
      franchiseRes = {
        stores: [],
        id: 17,
        name: "Test Franchise",
        admins: [
          {
            email: "f@jwt.com",
            id: 3,
            name: "pizza franchisee",
          },
        ],
      };
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
    }
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/franchise/17", async (route) => {
    const franchiseRes = {
      message: "franchise deleted",
    };
    expect(route.request().method()).toBe("DELETE");
    await route.fulfill({ json: franchiseRes });
  });

  await page.goto("/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Enter");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();

  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("Test Franchise");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("f@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByRole("table")).toContainText("Test Franchise");

  await expect(page.getByRole("table")).toContainText("pizza franchisee");
  await page
    .getByRole("row", { name: "Test Franchise pizza" })
    .getByRole("button")
    .click();
  await expect(page.getByRole("main")).toContainText(
    "Are you sure you want to close the Test Franchise franchise? This will close all associated stores and cannot be restored. All outstanding revenue will not be refunded.",
  );
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByRole("table")).not.toContainText("Test Franchise");
});
