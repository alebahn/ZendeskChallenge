import { question, keyInSelect } from 'readline-sync';
import { SearchableCollectionCollection, SearchableCollection, Searchable } from './model';

enum ControlStatus {
  quit = 'quit',
  back = 'back',
}

function isControllStatus(value: unknown): value is ControlStatus {
  if (typeof value === 'string') {
    return (value in ControlStatus);
  }
  return false;
}

export class SearchView {
  private searchables: SearchableCollectionCollection;

  public constructor(searchables: SearchableCollectionCollection) {
    this.searchables = searchables;
  }

  public run() {
    SearchView.showIntro();
    while (this.searchCollections() !== ControlStatus.quit);
  }

  private static showIntro() {
    console.log('Welcome to Zendesk Search.');
    console.log('\tType "back" at any prompt to go to go back.');
    console.log('\tType "quit" at any prompt to go to quit.');
  }

  private searchCollections(): ControlStatus {
    const searchable = this.selectCollection();
    if (isControllStatus(searchable)) {
      return searchable;
    }
    let controlStatus: ControlStatus | 'continue';
    do {
      controlStatus = SearchView.searchCollection(searchable);
    }
    while (controlStatus === 'continue');
    return controlStatus;
  }

  private selectCollection(): SearchableCollection | ControlStatus {
    const searchableKeys = Object.keys(this.searchables);
    const collectionIndex = keyInSelect(searchableKeys, 'Select a collection to search: ', { cancel: 'Quit' });
    if (collectionIndex === -1) {
      return ControlStatus.quit;
    }
    const collectionName = searchableKeys[collectionIndex];
    return this.searchables[collectionName];
  }

  private static searchCollection(searchable: SearchableCollection): ControlStatus | 'continue' {
    const field = SearchView.selectField(searchable);
    if (isControllStatus(field)) {
      return field;
    }
    const query = SearchView.getSearchQuery();
    if (isControllStatus(query)) {
      return query;
    }
    const results = searchable.search(field, query);
    SearchView.displayResults(results);
    return 'continue';
  }

  private static selectField(searchable: SearchableCollection): string | ControlStatus {
    const options = searchable.searchableKeys;
    const optionsPlus = options.concat([ControlStatus.quit, ControlStatus.back]);
    console.log('Please select from the following:');
    console.log('\t' + options.join(', '));
    console.log('or enter "quit" or "back".');
    return question('Select a field to search: ', {
      limit: optionsPlus,
      limitMessage: 'Invalid input',
    });
  }

  private static getSearchQuery(): string | ControlStatus {
    return question('Enter a search query: ');
  }

  private static displayResults(results: Searchable[]) {
    if (results.length === 0) {
      console.log('No results found for search.');
    } else {
      console.log(results);
    }
  }
}
