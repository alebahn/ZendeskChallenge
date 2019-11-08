import { BasicOptions } from 'readline-sync';
import { SearchableCollectionCollection, SearchableCollection, Searchable } from './model';

/**
 * Represents possible menu options besides individual selections
 */
enum ControlStatus {
  quit = 'quit',
  back = 'back',
}

/**
 * Determine if the value passed is a control value vs a data value
 * @param value the value to check against the ControlStatus enum
 */
function isControllStatus(value: unknown): value is ControlStatus {
  if (typeof value === 'string') {
    return (value in ControlStatus);
  }
  return false;
}

// interface to facilitate mocking
export interface UI
{
  question(query?: any, options?: BasicOptions): string;
  keyInSelect(items: string[], query?: any, options?: BasicOptions): number;
  log(message?: any, ...optionalParams: any[]): void
}

export class SearchView {
  private ui : UI;

  /**
   * Crate a UI to enable the user to search trhough data using a CLI
   * @param ui an iterface implementing functions needed to be able to interact with the CLI
   */
  public constructor(ui : UI) {
    this.ui = ui;
  }

  /**
   * Start the UI. Returns when user quits.
   * @param searchables the collections to expose to the user to search through
   */
  public run(searchables: SearchableCollectionCollection) {
    this.showIntro();
    while (this.searchCollections(searchables) !== ControlStatus.quit);
  }

  private showIntro() {
    this.ui.log('Welcome to Zendesk Search.');
    this.ui.log('\tType "back" at any prompt to go to go back.');
    this.ui.log('\tType "quit" at any prompt to go to quit.');
  }

  private searchCollections(searchables : SearchableCollectionCollection): ControlStatus {
    const searchable = this.selectCollection(searchables);
    if (isControllStatus(searchable)) {
      return searchable;
    }
    let controlStatus: ControlStatus | 'continue';
    do {
      controlStatus = this.searchCollection(searchable);
    }
    while (controlStatus === 'continue');
    return controlStatus;
  }

  private selectCollection(searchables : SearchableCollectionCollection): SearchableCollection | ControlStatus {
    const searchableKeys = Object.keys(searchables);
    const collectionIndex = this.ui.keyInSelect(searchableKeys, 'Select a collection to search: ', { cancel: 'Quit' });
    if (collectionIndex === -1) {
      return ControlStatus.quit;
    }
    const collectionName = searchableKeys[collectionIndex];
    return searchables[collectionName];
  }

  private searchCollection(searchable: SearchableCollection): ControlStatus | 'continue' {
    const field = this.selectField(searchable);
    if (isControllStatus(field)) {
      return field;
    }
    const query = this.getSearchQuery();
    if (isControllStatus(query)) {
      return query;
    }
    const results = searchable.search(field, query);
    this.displayResults(results);
    return 'continue';
  }

  private selectField(searchable: SearchableCollection): string | ControlStatus {
    const options = searchable.searchableKeys;
    const optionsPlus = options.concat([ControlStatus.quit, ControlStatus.back]);
    this.ui.log('Please select from the following:');
    this.ui.log(`\t${options.join(', ')}`);
    this.ui.log('or enter "quit" or "back".');
    return this.ui.question('Select a field to search: ', {
      limit: optionsPlus,
      limitMessage: 'Invalid input',
    });
  }

  private getSearchQuery(): string | ControlStatus {
    return this.ui.question('Enter a search query: ');
  }

  private displayResults(results: Searchable[]) {
    if (results.length === 0) {
      this.ui.log('No results found for search.');
    } else {
      this.ui.log('Search Results:\n');
      results.forEach((result) => {
        Object.keys(result).forEach((key) => {
          this.ui.log(`${key}:`, result[key]);
        });
        this.ui.log();
      });
    }
  }
}
