import { expect, test } from "playwright-test-coverage";

test("logout works as expected", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() === "DELETE") {
      const logoutRes = {
        message: "logout successful",
      };
      await route.fulfill({ json: logoutRes });
    } else {
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
    }
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await expect(page.getByRole("button", { name: "Order now" })).toBeVisible();
  await expect(page.getByRole("main").getByRole("img")).toBeVisible();
  await expect(page.getByRole("main")).toContainText(
    "Pizza is an absolute delight that brings joy to people of all ages. The perfect combination of crispy crust, savory sauce, and gooey cheese makes pizza an irresistible treat. At JWT Pizza, we take pride in serving the web's best pizza, crafted with love and passion. Our skilled chefs use only the finest ingredients to create mouthwatering pizzas that will leave you craving for more. Whether you prefer classic flavors or adventurous toppings, our diverse menu has something for everyone. So why wait? Indulge in the pizza experience of a lifetime and visit JWT Pizza today!",
  );
  await expect(page.getByRole("main")).toContainText(
    "Pizza has come a long way since its humble beginnings. From its origins in Italy to becoming a global sensation, pizza has captured the hearts and taste buds of people worldwide. It has become a symbol of comfort, celebration, and togetherness. At JWT Pizza, we understand the magic of pizza and strive to deliver an unforgettable dining experience. Our cozy ambiance, friendly staff, and delectable pizzas create the perfect setting for a memorable meal. Whether you're dining with family, friends, or enjoying a solo pizza night, Pizza Shop is the place to be.",
  );
  await expect(page.getByRole("main")).toContainText(
    "Pizza is not just a food; it's an experience. The aroma of freshly baked pizza, the sight of melted cheese stretching with every bite, and the explosion of flavors in your mouth - it's a sensory journey like no other. At JWT Pizza, we believe in the power of pizza to bring people together. Our inviting atmosphere and warm hospitality make every visit a special occasion. Whether you're celebrating a birthday, anniversary, or simply craving a delicious meal, JWT Pizza is here to make your experience extraordinary. Join us and discover the magic of pizza at its finest.",
  );
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.locator("#navbar-dark")).toContainText("Login");
  await expect(page.locator("#navbar-dark")).not.toContainText("Logout");
});
