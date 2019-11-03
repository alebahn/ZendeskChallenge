import { Organization, Ticket, User } from "./model";

export class SearchView
{
    private users: User[];
    private tickets: Ticket[];
    private organizations: Organization[];

    public constructor(users : User[], tickets : Ticket[], organizations : Organization[])
    {
        this.users = users;
        this.tickets = tickets;
        this.organizations = organizations;
    }

    public run()
    {
        console.log(this.users[0]._id);
    }
}   