import { pgTable, serial, varchar, date } from "drizzle-orm/pg-core";

// Define the leads table schema
const LeadsList = pgTable('LeadsList', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }),
    phone_number: varchar('phone_number', { length: 15 }),
    email: varchar('email', { length: 255 }),
    city: varchar('city', { length: 255 }),
    configuration: varchar('configuration', { length: 255 }),
    project_name: varchar('project_name', { length: 255 }),
    budget: varchar('budget', { length: 255 }),
    possession: varchar('possession', { length: 255 }),
    requirement: varchar('requirement', { length: 255 }),
    lead_source: varchar('lead_source', { length: 255 }),
    status: varchar('status', { length: 50 }),
    comments: varchar('comments', { length: 1024 }),
    follow_up_date: date('follow_up_date'),
    follow_up_status: varchar('follow_up_status', { length: 50 }).default('To be followed up'),
    created_at: date('created_at').default(new Date()),
});

export { LeadsList };
