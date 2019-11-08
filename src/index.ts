import { readFileSync } from "fs";
import { SearchView } from "./view";
import { SearchableCollectionCollection, SearchableCollection, Searchable } from "./model";

function loadJSONCollections(searchableFiles : {[key : string] : string}) : SearchableCollectionCollection
{
    let results : SearchableCollectionCollection = {};
    for (var key in searchableFiles) {
        results[key] = new SearchableCollection(loadJSONCollection(searchableFiles[key]));
    }
    return results;
}

function loadJSONCollection(filename : string) : Searchable[]
{
    const jsonDataSet = readFileSync(filename);
    return JSON.parse(jsonDataSet.toString());
}

function main()
{
    const searchableFiles = {
        "Users": "./users.json",
        "Tickets": "./tickets.json",
        "Organizations": "./organizations.json"
    }

    const searchables = loadJSONCollections(searchableFiles);

    const searchView = new SearchView(searchables);

    searchView.run();
}

main();