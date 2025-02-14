import { test, expect } from "playwright-test-coverage";

test("about page looks as expected including images", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("main")).toContainText("The secret sauce");
  await expect(page.getByRole("main")).toContainText(
    "At JWT Pizza, our amazing employees are the secret behind our delicious pizzas. They are passionate about their craft and spend every waking moment dreaming about how to make our pizzas even better. From selecting the finest ingredients to perfecting the dough and sauce recipes, our employees go above and beyond to ensure the highest quality and taste in every bite. Their dedication and attention to detail make all the difference in creating a truly exceptional pizza experience for our customers. We take pride in our team and their commitment to delivering the best pizza in town.",
  );
  await expect(page.getByRole("main")).toContainText(
    "Our talented employees at JWT Pizza are true artisans. They pour their heart and soul into every pizza they create, striving for perfection in every aspect. From hand-stretching the dough to carefully layering the toppings, they take pride in their work and are constantly seeking ways to elevate the pizza-making process. Their creativity and expertise shine through in every slice, resulting in a pizza that is not only delicious but also a work of art. We are grateful for our dedicated team and their unwavering commitment to delivering the most flavorful and satisfying pizzas to our valued customers.",
  );
  await expect(page.getByRole("main")).toContainText("Our employees");
  await expect(page.getByRole("main")).toContainText(
    "JWT Pizza is home to a team of pizza enthusiasts who are truly passionate about their craft. They are constantly experimenting with new flavors, techniques, and ingredients to push the boundaries of traditional pizza-making. Their relentless pursuit of perfection is evident in every bite, as they strive to create a pizza experience that is unparalleled. Our employees understand that the secret to a great pizza lies in the details, and they leave no stone unturned in their quest for pizza perfection. We are proud to have such dedicated individuals on our team, as they are the driving force behind our reputation for exceptional quality and taste.",
  );
  await expect(page.getByRole("main")).toContainText(
    "At JWT Pizza, our employees are more than just pizza makers. They are culinary artists who are deeply passionate about their craft. They approach each pizza with creativity, precision, and a genuine love for what they do. From experimenting with unique flavor combinations to perfecting the cooking process, our employees are constantly pushing the boundaries of what a pizza can be. Their dedication and expertise result in pizzas that are not only delicious but also a reflection of their passion and commitment. We are grateful for our talented team and the incredible pizzas they create day in and day out.",
  );
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Brian$/ })
      .getByRole("img"),
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Anna$/ })
      .getByRole("img"),
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Maria$/ })
      .getByRole("img"),
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^James$/ })
      .getByRole("img"),
  ).toBeVisible();
  await expect(page.getByRole("main").getByRole("img").first()).toBeVisible();
});
