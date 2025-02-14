import { expect, test } from "playwright-test-coverage";

test("diner cannot access franchise or admin dashboard", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "d@jwt.com", password: "diner" };
    const loginRes = {
      user: {
        id: 2,
        name: "pizza diner",
        email: "d@jwt.com",
        roles: [
          {
            role: "diner",
          },
        ],
      },
      token: "token abc",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise/**", async (route) => {
    const franchiseRes = {
      message: "unauthorized",
    };

    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes, status: 401 });
  });

  await page.route("*/**/api/order", async (route) => {
    const orderRes = {
      dinerId: 2,
      orders: [],
      page: 1,
    };

    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: orderRes });
  });

  await page.goto("/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "So you want a piece of the pie?",
  );
  await expect(page.getByRole("alert")).toContainText(
    "If you are already a franchisee, pleaseloginusing your franchise account",
  );
  await expect(page.getByRole("main").locator("img")).toBeVisible();
  await page.getByRole("link", { name: "pd" }).click();
  await expect(
    page.getByRole("img", { name: "Employee stock photo" }),
  ).toBeVisible();
  await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");
  await expect(page.getByRole("main")).toContainText("pizza diner");
  await expect(page.getByRole("main")).toContainText("d@jwt.com");
  await expect(page.getByRole("main")).toContainText("diner");
  await expect(page.locator("#navbar-dark")).not.toContainText("Admin");
});
