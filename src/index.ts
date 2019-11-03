import { readFileSync } from "fs";
import { SearchView } from "./view";

console.log("Hello World!");

const usersJson = readFileSync("./users.json");
const users = JSON.parse(usersJson.toString());
const ticketsJson = readFileSync("./users.json");
const tickets = JSON.parse(ticketsJson.toString());
const organizationsJson = readFileSync("./tickets.json");
const organizations = JSON.parse(organizationsJson.toString());

const searchView = new SearchView(users, tickets, organizations);
searchView.run();
