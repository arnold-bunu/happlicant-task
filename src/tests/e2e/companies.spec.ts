import { test, expect } from "@playwright/test";

test.describe("Companies Page", () => {
  test("opens and closes the Add Company modal", async ({ page }) => {
    await page.goto("http://localhost:3000/companies");

    await page.getByRole("button", { name: "Add Company" }).first().click(); // add cmopany on click

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    const closeButton = page.getByRole("button", { name: /close|cancel/i }); // test modal closes

    await closeButton.first().click();

    await expect(modal).not.toBeVisible();
  });
});
