import { zValidator } from "@hono/zod-validator";
import { clsx } from "clsx";
import { Hono } from "hono";
import invariant from "tiny-invariant";
import { z } from "zod";
import { db, getLatestProducts } from "./db";
import { Product, productsSchema } from "./db/schema";
import { priceFormat } from "./price-format";

type ProductListOwnProps = {
  products: Product[];
  className?: string;
};

function ProductList(props: ProductListOwnProps) {
  return (
    <div id="product-list">
      <h2 class="text-xl font-semibold text-gray-700">
        Latest {props.products.length} products
      </h2>

      <ul class={clsx("mt-4 text-lg text-gray-500", props.className)}>
        {props.products.length === 0 ? (
          <li class="italic">No products yet</li>
        ) : (
          props.products.map((product) => (
            <li>
              {product.name} {priceFormat.format(Number(product.price))}
              {/* <form action="/api/delete-product" method="POST">
                <input type="hidden" name="id" value={product.id} />
                <button type="submit">Delete</button>
              </form> */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function NewProductForm() {
  return (
    <form
      id="new-product-form"
      hx-post="/api/new-product"
      hx-trigger="submit"
      hx-swap="outerHTML"
      hx-target="#product-list"
      hx-indicator="#new-product-indicator"
      class="grid max-w-xs grid-cols-1 gap-y-6"
      _="on submit target.reset()"
    >
      <label class="grid gap-1">
        <div>Name</div>
        <div class="relative">
          <input
            type="text"
            name="name"
            required=""
            class="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Product name"
            pattern=".{3,}"
            x-model="name"
          />
        </div>
      </label>

      <label class="grid gap-1">
        <div>Price</div>
        <div class="relative">
          <input
            type="number"
            name="price"
            required=""
            class="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            step="0.01"
            min="0.01"
            pattern="^\d+(?:\.\d{1,2})?$"
            placeholder="420.69"
            x-model="price"
          />
          <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transform text-gray-400">
            $
          </span>
        </div>
      </label>

      <button
        type="submit"
        class="flex items-center justify-center gap-x-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        x-bind:disabled="!name || !price || submitting"
      >
        <span>Add product</span>

        <div
          id="new-product-indicator"
          class="hidden htmx-request:block"
          role="status"
        >
          <svg
            aria-hidden="true"
            class="mr-2 h-5 w-5 animate-spin fill-blue-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </button>
    </form>
  );
}

function BuiltWith() {
  return (
    <div>
      <h2 class="text-xl font-semibold text-gray-700">Built with</h2>

      <ul class="mt-4 max-w-xs list-outside space-y-4 text-gray-500">
        <li>
          {/* Bun */}
          <details>
            <summary>
              <a
                href="https://bun.sh/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://bun.sh/
              </a>
            </summary>
          </details>
        </li>

        <li>
          {/* Hono */}
          <details>
            <summary>
              <a
                href="https://hono.dev/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://hono.dev/
              </a>
            </summary>
          </details>
        </li>

        <li>
          {/* Turso */}
          <details>
            <summary>
              <a
                href="https://turso.tech/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://turso.tech/
              </a>
            </summary>
          </details>
        </li>

        <li>
          {/* HTMX */}
          <details>
            <summary>
              <a
                href="https://htmx.org/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://htmx.org/
              </a>
            </summary>

            <p class="text-xs font-light">
              Used to handle the form submission HTTP. ⚡️
            </p>
          </details>
        </li>

        <li>
          {/* HyperScript */}
          <details>
            <summary>
              <a
                href="https://hyperscript.org/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://hyperscript.org/
              </a>
            </summary>

            <p class="text-xs font-light">
              Used to handle the form submission HTTP. ⚡️
            </p>
          </details>
        </li>

        <li>
          {/* TailwindCSS */}
          <details>
            <summary>
              <a
                href="https://tailwindcss.com/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://tailwindcss.com/
              </a>
            </summary>

            <p class="text-xs font-light">Used to style the page.</p>
          </details>
        </li>

        <li>
          {/* Drizzle ORM/Kit */}
          <details>
            <summary>
              <a
                href="https://drizzle.team/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://drizzle.team/
              </a>
            </summary>

            <p class="text-xs font-light">
              "Professional developers" creating an ORM as well as a DBMS Kit.
              Yet TBD whether it's a good idea to use it in production. 🤷‍♂️
            </p>
          </details>
        </li>

        <li>
          {/* Resend */}
          <details>
            <summary>
              <a
                href="https://resend.com/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://resend.com/
              </a>
            </summary>

            <p class="text-xs font-light">
              I receive an email when a new product has been added. Keeping an
              eye on you 👀
            </p>
          </details>
        </li>

        <li>
          {/* React Email */}
          <details>
            <summary>
              <a
                href="https://react.email/"
                class="text-blue-500 underline visited:text-purple-500"
              >
                https://react.email/
              </a>
            </summary>

            <p class="text-xs font-light">
              Used to create the email template being sent to me
            </p>
          </details>
        </li>
      </ul>
    </div>
  );
}

function Layout(props: { children?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width" />
        <title>Product List</title>

        <script
          src="https://unpkg.com/htmx.org@1.9.2"
          integrity="sha384-L6OqL9pRWyyFU3+/bjdSri+iIphTN/bvYyM37tICVyOJkWZLpP2vGn6VUEXgzg6h"
          crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>

        <link rel="stylesheet" href="/public/style.css" />
      </head>

      {props.children}
    </html>
  );
}

const server = new Hono()
  .get("/public/*", async (ctx) => {
    return await (ctx.env?.ASSETS as any).fetch(ctx.req.url);
  })
  .get("/", async (context) => {
    const products = await getLatestProducts();

    return context.html(
      <Layout>
        <body class="grid min-h-screen place-items-center bg-gray-50 px-6 py-12">
          <div class="w-full max-w-2xl space-y-8">
            <div>
              <h1 class="text-2xl font-bold">Product List</h1>

              <p class="max-w-[65ch] text-xs font-light text-gray-500">
                (H)ono + (T)urso + (H)TMX = HTH Stack. A simple product list
                with a form to add new products. The form is submitted via HTMX
                and the new product is added to the list without a page reload.
              </p>

              <a
                href="https://github.com/CasperEngl/hth-product-list/"
                rel="noopener noreferrer"
                target="_blank"
                class="mt-2 block text-blue-500 underline visited:text-purple-500 hover:text-blue-600"
              >
                https://github.com/CasperEngl/hth-product-list/
              </a>
            </div>

            <div class="grid items-start gap-x-12 gap-y-16 lg:grid-cols-2">
              <ProductList products={products} />

              <NewProductForm />
            </div>

            <BuiltWith />
          </div>
        </body>
      </Layout>,
    );
  })
  .post(
    "/api/new-product",
    zValidator(
      "form",
      z.object({
        name: z.string().min(3),
        price: z.string().regex(/^\d+(?:\.\d{1,2})?$/),
      }),
    ),
    async (context) => {
      const formData = await context.req.formData();

      const name = formData.get("name");
      const price = formData.get("price");

      invariant(name, "Missing name");
      invariant(price, "Missing price");

      await db
        .insert(productsSchema)
        .values({
          name: String(name),
          price: Number(price),
        })
        .run();

      const products = await getLatestProducts();

      return context.html(<ProductList products={products} />);
    },
  );

export default server;
