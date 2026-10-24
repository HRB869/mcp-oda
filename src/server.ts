/**
 * The MCP tool set, built fresh per request (stateless transport) on top of
 * one shared Oda session. Trimmed from upstream mcp-oda to what a weekly
 * family shop needs; saved-list editing and the CLI are gone.
 *
 * There is deliberately no checkout, no slot selection and no payment.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createRequire } from "node:module";
import { summarizeCartMutation } from "./oda-client.js";
import type { OdaSession } from "./session.js";

const { version } = createRequire(import.meta.url)("../package.json");

function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function createMcpServer(session: OdaSession): McpServer {
  const server = new McpServer({ name: "oda", version });

  // Every tool runs through withAuth, so an expired Oda session is renewed
  // transparently and the caller only sees real errors.
  const run = <T>(fn: (client: OdaSession["client"]) => Promise<T>) =>
    session.withAuth(fn);

  server.registerTool(
    "check_login",
    {
      description:
        "Whether the service is logged in to Oda, and as whom. Use when something looks wrong; not needed before normal calls.",
    },
    async () => {
      await session.ensureLoggedIn();
      return jsonResult(session.getStatus());
    },
  );

  // --- Products and cart ---

  server.registerTool(
    "products_search",
    {
      description:
        "Search Oda's catalogue (Norwegian terms work best, e.g. 'lettmelk', 'kjøttdeig'). Returns products with id, name, price, availability and any discount. Use the id with product_add_to_cart / cart_add_many.",
      inputSchema: {
        query: z.string(),
        page: z.number().int().positive().optional(),
      },
    },
    async ({ query, page }) =>
      jsonResult(await run((c) => c.searchProducts(query, page))),
  );

  server.registerTool(
    "cart_get_contents",
    {
      description:
        "The current cart: totals and every line, with recipe grouping noted per line.",
    },
    async () => jsonResult(await run((c) => c.getCartContents())),
  );

  server.registerTool(
    "product_add_to_cart",
    {
      description:
        "Add one product to the cart by product id (relative: adds to whatever is there). Returns cart totals and the product's lines.",
      inputSchema: {
        id: z.number().int().positive(),
        count: z.number().int().positive().optional(),
      },
    },
    async ({ id, count }) => {
      const cart = await run((c) => c.addToCart(id, count));
      return jsonResult(summarizeCartMutation(cart, id));
    },
  );

  server.registerTool(
    "cart_add_many",
    {
      description:
        "Add many products to the cart in one call (relative quantities). Preferred for filling a weekly shop: pass the whole list once. Returns the resulting cart totals and line count.",
      inputSchema: {
        items: z
          .array(
            z.object({
              product_id: z.number().int().positive(),
              quantity: z.number().int().positive(),
            }),
          )
          .min(1)
          .max(200),
      },
    },
    async ({ items }) => {
      const cart = await run((c) => c.addManyToCart(items));
      return jsonResult({
        label_text: cart.label_text,
        product_quantity_count: cart.product_quantity_count,
        display_price: cart.display_price,
        lines: cart.items.length,
      });
    },
  );

  server.registerTool(
    "cart_set_quantity",
    {
      description:
        "Set the ABSOLUTE quantity of a product in the cart (0 removes it). Counts all lines for the product, recipe lines included.",
      inputSchema: {
        id: z.number().int().positive(),
        quantity: z.number().int().min(0),
      },
    },
    async ({ id, quantity }) => {
      const cart = await run((c) => c.setCartQuantity(id, quantity));
      return jsonResult(summarizeCartMutation(cart, id));
    },
  );

  server.registerTool(
    "cart_remove_item",
    {
      description:
        "Remove a quantity of a product from the cart by product id (default 1).",
      inputSchema: {
        id: z.number().int().positive(),
        count: z.number().int().positive().optional(),
      },
    },
    async ({ id, count }) => {
      const cart = await run((c) => c.removeFromCart(id, count));
      return jsonResult(summarizeCartMutation(cart, id));
    },
  );

  server.registerTool(
    "cart_clear",
    {
      description:
        "Remove everything from the cart. Destructive: only after the user has explicitly asked to clear the cart in this conversation.",
      inputSchema: {
        confirmation: z
          .literal("CLEAR CART")
          .describe(
            "Must be exactly CLEAR CART; provide it only after explicit confirmation from the user in this conversation.",
          ),
      },
    },
    async () => {
      await run((c) => c.clearCart());
      return textResult("Cart cleared");
    },
  );

  server.registerTool(
    "cart_get_recommendations",
    {
      description:
        "Oda's own suggestions for the current cart (things people usually add). Read-only; may be empty when the cart is empty.",
      inputSchema: {
        limit: z.number().int().min(1).max(50).optional(),
        exclude_in_cart: z.boolean().optional(),
      },
    },
    async ({ limit, exclude_in_cart }) =>
      jsonResult(
        await run((c) =>
          c.getCartRecommendations({ limit, excludeInCart: exclude_in_cart }),
        ),
      ),
  );

  // --- History ---

  server.registerTool(
    "purchases_get_frequent",
    {
      description:
        "Most frequently bought products across recent orders, with how many orders each appeared in. Read-only. Good for finding the household's staples.",
      inputSchema: {
        limit: z.number().int().min(1).max(50).optional(),
        max_orders: z.number().int().min(1).max(100).optional(),
      },
    },
    async ({ limit, max_orders }) =>
      jsonResult(await run((c) => c.getFrequentProducts(limit, max_orders))),
  );

  server.registerTool(
    "orders_get_recent",
    {
      description:
        "Recent orders, newest first, each with its line items (product id, name, quantity, recipe grouping if any). Read-only. Use to see what was bought together, e.g. to reconstruct the family's usual dinners. Default 20 orders; each order is one request to Oda, so keep max_orders modest.",
      inputSchema: {
        max_orders: z.number().int().min(1).max(100).optional(),
      },
    },
    async ({ max_orders }) =>
      jsonResult(await run((c) => c.getRecentOrders(max_orders))),
  );

  // --- Saved lists (read, and add a whole list to the cart) ---

  server.registerTool(
    "saved_lists_get_all",
    {
      description: "The account's saved Oda shopping lists with counts. Read-only.",
    },
    async () => jsonResult(await run((c) => c.getSavedLists())),
  );

  server.registerTool(
    "saved_lists_get_details",
    {
      description:
        "Products and quantities in one saved list (id from saved_lists_get_all). Read-only.",
      inputSchema: { id: z.number().int().positive() },
    },
    async ({ id }) => jsonResult(await run((c) => c.getSavedListDetails(id))),
  );

  server.registerTool(
    "saved_list_add_to_cart",
    {
      description:
        "Add every product and quantity from a saved list to the cart. Changes the cart: only after the user has confirmed that list in this conversation.",
      inputSchema: {
        id: z.number().int().positive(),
        confirmation: z
          .literal("ADD SAVED LIST TO CART")
          .describe(
            "Must be exactly ADD SAVED LIST TO CART; provide it only after explicit confirmation from the user in this conversation.",
          ),
      },
    },
    async ({ id }) => {
      await run((c) => c.addSavedListToCart(id));
      return textResult("Saved list added to cart");
    },
  );

  // --- Recipes ---

  server.registerTool(
    "recipes_search",
    {
      description:
        "Search Oda's recipes (optionally by filter ids returned by a previous search).",
      inputSchema: {
        query: z.string().optional(),
        page: z.number().int().positive().optional(),
        filter_ids: z.array(z.string()).optional(),
      },
    },
    async ({ query, page, filter_ids }) =>
      jsonResult(await run((c) => c.searchRecipes(query, page, filter_ids))),
  );

  server.registerTool(
    "recipes_get_details",
    {
      description:
        "A recipe's ingredients (with product ids where Oda links them), portions and steps.",
      inputSchema: { id: z.number().int().positive() },
    },
    async ({ id }) => jsonResult(await run((c) => c.getRecipeDetails(id))),
  );

  server.registerTool(
    "recipe_add_to_cart",
    {
      description:
        "Add an Oda recipe's ingredients to the cart for a number of portions. Lines are grouped under the recipe in the cart.",
      inputSchema: {
        id: z.number().int().positive(),
        portions: z.number().int().positive(),
      },
    },
    async ({ id, portions }) => {
      await run((c) => c.addRecipeToCart(id, portions));
      return textResult("Recipe added to cart");
    },
  );

  server.registerTool(
    "recipe_remove_from_cart",
    {
      description: "Remove a recipe and its ingredients from the cart.",
      inputSchema: { id: z.number().int().positive() },
    },
    async ({ id }) => {
      await run((c) => c.removeRecipeFromCart(id));
      return textResult("Recipe removed from cart");
    },
  );

  // --- Delivery (read-only) ---

  server.registerTool(
    "delivery_get_slots",
    {
      description:
        "Upcoming delivery slots by day with prices and ordering deadlines. Read-only: nothing can be booked or paid through this service.",
    },
    async () => jsonResult(await run((c) => c.getDeliverySlots())),
  );

  return server;
}
