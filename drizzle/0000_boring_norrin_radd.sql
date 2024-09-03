CREATE TABLE IF NOT EXISTS "LeadsList" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"phone_number" varchar(15),
	"email" varchar(255),
	"city" varchar(255),
	"configuration" varchar(255),
	"project_name" varchar(255),
	"budget" varchar(255),
	"possession" varchar(255),
	"requirement" varchar(255),
	"lead_source" varchar(255),
	"status" varchar(50) NOT NULL,
	"comments" varchar(1024),
	"follow_up_date" date,
	"created_at" date DEFAULT '2024-08-26'
);
