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

  await test.step("Je vois les badges des donateurs", async () => {
    await page.getByRole("button", { name: "Donateurs" }).click();
    await expect(page.getByRole("heading", { name: "Donateurs" })).toBeVisible();
    await expect(
      page.locator("li").filter({ hasText: "Jean Petit" }).getByText("Or", { exact: true }),
    ).toBeVisible();
  });

  await test.step("Je filtre par badge", async () => {
    await page.getByLabel("Filtrer par badge").selectOption("or");
    await expect(page.getByText("Jean Petit")).toBeVisible();
    await expect(page.getByText("Amélie Rousseau")).toHaveCount(0);
  });

  await test.step("Je filtre les donateurs ayant atteint le plafond anti-spam", async () => {
    await page.getByLabel("Filtrer par badge").selectOption("tous");
    await page.getByText("Plafond atteint uniquement").click();
    await expect(page.getByText("Nadia Haddad")).toBeVisible();
    await expect(page.getByText("Jean Petit")).toHaveCount(0);
  });

  await test.step("Je cible une communication sur un badge", async () => {
    await page.getByRole("button", { name: "Plan de comm" }).click();
    await page.getByRole("combobox").nth(2).selectOption("or");
    await expect(page.getByText(/destinataire\(s\)/).first()).toBeVisible();
  });
});
