"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "name",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});
var sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var import_fields_document = require("@keystone-6/fields-document");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      age: (0, import_fields.text)({ validation: { isRequired: false } }),
      posts: (0, import_fields.relationship)({ ref: "Scheme.author", many: true }),
      password: (0, import_fields.password)({ validation: { isRequired: true } })
    }
  }),
  Scheme: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)(),
      publishedAt: (0, import_fields.timestamp)(),
      author: (0, import_fields.relationship)({
        ref: "User.posts"
        // ui: {
        //   displayMode: "cards",
        //   cardFields: ["name", "email"],
        //   inlineEdit: { fields: ["name", "email"] },
        //   linkToItem: true,
        //   inlineCreate: { fields: ["name", "email"] },
        // },
      }),
      status: (0, import_fields.select)({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" }
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" }
      }),
      content: (0, import_fields_document.document)({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ]
      })
    }
  })
};
var keystone_default = (0, import_core.config)(
  withAuth({
    db: {
      provider: "postgresql",
      url: "postgres://sqbzjvgd:aG9sNwh7vgfGh7dcfhEQm8DX4Rj3XoCR@cornelius.db.elephantsql.com/sqbzjvgd"
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data
    },
    server: {
      cors: { origin: ["http://localhost:3000"], credentials: true }
    }
  })
);
//# sourceMappingURL=config.js.map
