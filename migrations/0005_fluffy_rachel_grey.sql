CREATE TABLE "reminders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_brands" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" text NOT NULL,
	"logo_url" varchar(500),
	"verified" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_models" (
	"id" uuid PRIMARY KEY NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_catalogs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"model_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"version" varchar(100),
	"engine" varchar(50),
	"fuel" text,
	"transmission" text,
	"source" text DEFAULT 'MANUAL' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"catalog_id" uuid NOT NULL,
	"type" text NOT NULL,
	"custom_type_name" varchar(100),
	"interval_km" integer,
	"interval_months" integer,
	"description" varchar(200) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vehicles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"catalog_id" uuid,
	"license_plate" varchar(7) NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"state" text NOT NULL,
	"nickname" varchar(50),
	"color" varchar(30),
	"renavam" varchar(11),
	"year" integer NOT NULL,
	"current_km" integer,
	"photo_url" varchar(500),
	"sold_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_maintenance_overrides" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_vehicle_id" uuid NOT NULL,
	"maintenance_type" text NOT NULL,
	"custom_type_name" varchar(100),
	"custom_interval_km" integer,
	"custom_interval_months" integer,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_vehicle_id" uuid NOT NULL,
	"reminder_id" uuid,
	"maintenance_type" text NOT NULL,
	"custom_type_name" varchar(100),
	"completed_at" date NOT NULL,
	"km_at_completion" integer,
	"cost" numeric(10, 2),
	"notes" text,
	"service_provider" varchar(200),
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vehicle_brands" ADD CONSTRAINT "vehicle_brands_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_brand_id_vehicle_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."vehicle_brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_catalogs" ADD CONSTRAINT "vehicle_catalogs_model_id_vehicle_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vehicle_models"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_catalogs" ADD CONSTRAINT "vehicle_catalogs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_templates" ADD CONSTRAINT "maintenance_templates_catalog_id_vehicle_catalogs_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."vehicle_catalogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vehicles" ADD CONSTRAINT "user_vehicles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vehicles" ADD CONSTRAINT "user_vehicles_catalog_id_vehicle_catalogs_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."vehicle_catalogs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_maintenance_overrides" ADD CONSTRAINT "user_maintenance_overrides_user_vehicle_id_user_vehicles_id_fk" FOREIGN KEY ("user_vehicle_id") REFERENCES "public"."user_vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_history" ADD CONSTRAINT "maintenance_history_user_vehicle_id_user_vehicles_id_fk" FOREIGN KEY ("user_vehicle_id") REFERENCES "public"."user_vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_history" ADD CONSTRAINT "maintenance_history_reminder_id_reminders_id_fk" FOREIGN KEY ("reminder_id") REFERENCES "public"."reminders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_vehicle_brands_name_type" ON "vehicle_brands" USING btree ("name","type");--> statement-breakpoint
CREATE INDEX "idx_vehicle_brands_type" ON "vehicle_brands" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_vehicle_brands_name" ON "vehicle_brands" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_vehicle_brands_verified" ON "vehicle_brands" USING btree ("verified");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_vehicle_models_brand_name" ON "vehicle_models" USING btree ("brand_id","name");--> statement-breakpoint
CREATE INDEX "idx_vehicle_models_brand_id" ON "vehicle_models" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_models_name" ON "vehicle_models" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_vehicle_models_type" ON "vehicle_models" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_vehicle_catalogs_model_year_version" ON "vehicle_catalogs" USING btree ("model_id","year","version");--> statement-breakpoint
CREATE INDEX "idx_vehicle_catalogs_model_id" ON "vehicle_catalogs" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_catalogs_year" ON "vehicle_catalogs" USING btree ("year");--> statement-breakpoint
CREATE INDEX "idx_vehicle_catalogs_model_year" ON "vehicle_catalogs" USING btree ("model_id","year");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_maintenance_templates_catalog_type" ON "maintenance_templates" USING btree ("catalog_id","type","custom_type_name");--> statement-breakpoint
CREATE INDEX "idx_maintenance_templates_catalog_id" ON "maintenance_templates" USING btree ("catalog_id");--> statement-breakpoint
CREATE INDEX "idx_maintenance_templates_type" ON "maintenance_templates" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_user_vehicles_user_id" ON "user_vehicles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_vehicles_status" ON "user_vehicles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_user_vehicles_license_plate" ON "user_vehicles" USING btree ("license_plate");--> statement-breakpoint
CREATE INDEX "idx_user_vehicles_deleted_at" ON "user_vehicles" USING btree ("deleted_at") WHERE "user_vehicles"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_user_vehicles_user_active" ON "user_vehicles" USING btree ("user_id") WHERE "user_vehicles"."deleted_at" IS NULL AND "user_vehicles"."status" = 'ACTIVE';--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_maintenance_overrides" ON "user_maintenance_overrides" USING btree ("user_vehicle_id","maintenance_type","custom_type_name");--> statement-breakpoint
CREATE INDEX "idx_user_maintenance_overrides_vehicle" ON "user_maintenance_overrides" USING btree ("user_vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_maintenance_history_vehicle" ON "maintenance_history" USING btree ("user_vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_maintenance_history_completed" ON "maintenance_history" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "idx_maintenance_history_type" ON "maintenance_history" USING btree ("maintenance_type");--> statement-breakpoint
CREATE INDEX "idx_maintenance_history_reminder" ON "maintenance_history" USING btree ("reminder_id") WHERE "maintenance_history"."reminder_id" IS NOT NULL;