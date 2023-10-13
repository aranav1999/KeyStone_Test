import { config, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  password,
  text,
  relationship,
  timestamp,
  select,
} from "@keystone-6/core/fields";

import { withAuth, session } from "./auth";
import { document } from "@keystone-6/fields-document";

const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      age: text({ validation: { isRequired: false } }),
      posts: relationship({ ref: "Scheme.author", many: true }),
      password: password({ validation: { isRequired: true } }),
    },
  }),
  Scheme: list({
    access: allowAll,
    fields: {
      title: text(),
      publishedAt: timestamp(),
      author: relationship({
        ref: "User.posts",
        // ui: {
        //   displayMode: "cards",
        //   cardFields: ["name", "email"],
        //   inlineEdit: { fields: ["name", "email"] },
        //   linkToItem: true,
        //   inlineCreate: { fields: ["name", "email"] },
        // },
      }),
      status: select({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" },
      }),
      content: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
      }),
    },
  }),
};

export default config(
  withAuth({
    db: {
      provider: "postgresql",
      url: "postgres://sqbzjvgd:aG9sNwh7vgfGh7dcfhEQm8DX4Rj3XoCR@cornelius.db.elephantsql.com/sqbzjvgd",
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    server: {
      cors: { origin: ["http://localhost:3000"], credentials: true },
    },
  })
);
