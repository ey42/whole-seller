import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, varchar, decimal, pgEnum, primaryKey, integer } from "drizzle-orm/pg-core";


export const roleEnum = pgEnum('role', ['admin', 'user', 'intermediate'])
export const statusEnum = pgEnum('status', ['pending', 'success', 'failed'])

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  userRole: roleEnum('user_role').default('user').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
    
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const profile = pgTable("profile",{
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id).notNull(),
  woreda: text("woreda"),
  kebele: text("kebele"),
  subCity: text('sub_city').notNull(),
  shopName: text("shop_name"),
  TIN: text("TIN").notNull().unique(),
  phoneNumber: text('phone_number').notNull(),
  image: text("image")
},
(table) => [index("profile_userId_idx").on(table.userId),index("profile_subCity_idx").on(table.subCity)])

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    passwordResetToken: text("password_reset_token"),
    passwordResetTokenExpires: timestamp("password_reset_token_expires"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const productCategory = pgTable("category",{
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  image: text("image").notNull(),
  name: varchar("name",{length: 50}).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updateAt: timestamp("update_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
})

export const product = pgTable("product", {
  id: text("productId").primaryKey(),
  userId: text("user_id").references(() => user.id).notNull(),
  image: text("image").notNull(),
  name: varchar("name", {length: 50}).notNull(),
  description: text("description").notNull(),
  price: decimal('price', {precision: 10, scale: 2}).notNull(),
  categoryId: text('catagory_id').references(() => productCategory.id),
  stockOuantity: integer('stock_quantity').notNull(),
  like: integer('like'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updateAt: timestamp("update_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  type: text('type').notNull()
}, (table) => [index('catagory_id_idx').on(table.categoryId)])

export const order = pgTable("order",{
  id: text("id").primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  status: statusEnum('order_status').default('pending'),
  totalProduct: decimal('total_product'),
  totalPrice: decimal('total_price'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
  .defaultNow()
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull(),
}, 
(t) => [index("order_user_index").on(t.userId)])

export const orderItem = pgTable("order_item",{
  orderId: text("order_id").references(() => order.id).notNull(),
  productId: text("product_id").references(() => product.id).notNull(),
  categoryId: text("category_id").references(() => productCategory.id).notNull(),
  quantity: decimal('quantity').notNull(),
  unitPrice: decimal('unit_price').notNull(),
  comment: text("text")
}, (t) => [
  primaryKey({columns: [t.orderId, t.productId]}),
  index("order_index_orderItem").on(t.orderId)
])

export const message = pgTable("message",{
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  userId: text('user_id').references(() => user.id).notNull(),
  AdminId: text('admin_id').references(() => user.id),
  image: text('image'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  view: boolean().default(false),
  updatedAt: timestamp("updated_at")
  .defaultNow()
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull(),
})

export const notification = pgTable("notification", {
  id: text("id").primaryKey(),
  adminId: text("admin_id").references(() => user.id).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  view: boolean().default(true),
  updatedAt: timestamp("updated_at")
  .defaultNow()
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull(),
})

// relations

export const profileRelation = relations(profile, ({one}) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id]
  })
}))

export const notificationRelations = relations(notification, ({one}) => ({
  user: one(user, {
    fields: [notification.adminId],
    references: [user.id]
  })
}))

export const productCategoryRelations = relations(productCategory, ({many, one}) => ({
  products: many(product),
  orders: many(order),
  user: one(user, {
    fields: [productCategory.userId],
    references: [user.id]
  })

}))

 export const productRelation = relations(product, ({one, many}) => ({
  productCategory: one(productCategory, {
    fields: [product.categoryId],
    references: [productCategory.id]
  }),
  user: one(user, {
    fields: [product.userId],
    references: [user.id]
  }),
  orderItems: many(orderItem)
 }))

 export const orderRelations = relations(order, ({one, many}) =>({
  user: one(user, {
    fields: [order.userId],
    references: [user.id]
  }),
  orderItems: many(orderItem)
 }))

 export const orderItemRelations = relations(orderItem, ({one}) => ({
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id]
  }),
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id]
  }),
  category: one(productCategory, {
    fields: [orderItem.categoryId],
    references: [productCategory.id]
  })
 }))

 export const messageRelations = relations(message, ({one}) => ({
  user: one(user, {
    fields: [message.userId],
    references: [user.id]
  }),
  admin: one(user, {
    fields: [message.AdminId],
    references: [user.id]
  })
 }))

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  orders: many(order),
  messages: many(message),
  notifications: many(notification),
  products: many(product),
  productCategorys: many(productCategory),
  profile: one(profile, {
    fields: [user.id],
    references: [profile.userId]
  })
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
