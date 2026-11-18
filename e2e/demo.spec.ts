import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je choisis le responsable communication", async () => {
    await expect(page.getByRole("heading", { name: "Qui êtes-vous ?" })).toBeVisible();
    await page.getByRole("button", { name: /Claire Dubois/ }).click();
  });

  await test.step("Je vois le plan de comm", async () => {
    await expect(page.getByRole("heading", { name: "Plan de comm" })).toBeVisible();
    await expect(page.getByText("Semaine du").first()).toBeVisible();
  });

  await test.step("J'ajoute une communication", async () => {
    await page.getByPlaceholder("Contenu de la communication").fill("Invitation à l'événement annuel");
    await page.locator('input[type="date"]').first().fill("2026-12-15");
    await page.getByRole("button", { name: "Ajouter" }).click();
    await expect(page.getByText("Invitation à l'événement annuel")).toBeVisible();
  });

  await test.step("Je déplace une communication", async () => {
    const champDate = page
      .locator("li", { hasText: "Invitation à l'événement annuel" })
      .locator('input[type="date"]');
    await champDate.fill("2026-12-20");
    await expect(page.getByText("Semaine du 2026-12-14")).toBeVisible();
  });
});
