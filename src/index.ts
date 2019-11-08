import { readFileSync } from 'fs';
import { SearchView } from './view';
import { SearchableCollectionCollection, SearchableCollection, Searchable } from './model';

const searchableFiles = {
  Users: './users.json',
  Tickets: './tickets.json',
  Organizations: './organizations.json',
};

function loadJSONCollection(filename: string): Searchable[] {
  const jsonDataSet = readFileSync(filename);
  return JSON.parse(jsonDataSet.toString());
}

function loadJSONCollections(files: { [key: string]: string }): SearchableCollectionCollection {
  const results: SearchableCollectionCollection = {};
  Object.keys(searchableFiles).forEach((key) => {
    results[key] = new SearchableCollection(loadJSONCollection(files[key]));
  });
  return results;
}

function main() {
  const searchables = loadJSONCollections(searchableFiles);

  const searchView = new SearchView(searchables);

  searchView.run();
}

main();
