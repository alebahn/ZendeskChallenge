/**
 * List of collections that can be searched through
 */
export interface SearchableCollectionCollection {
  [key: string]: SearchableCollection
}

interface Index {
  [field: string]: SubIndex
}

class SubIndex {
  public add(key: string, value: number) {
    if (this.data[key]) {
      this.data[key].push(value);
    } else {
      this.data[key] = [value];
    }
  }

  public get(query: string): number[] {
    return this.data[query];
  }

  private data: { [query: string]: number[] } = {};
}

/**
 * Collection of objects whose attributes can be searched
 * through by providing strings that are in the attributes.
 */
export class SearchableCollection {
  /**
   * Create a new searchable collection of objects from a list of objects
   * @param dataSet a list of objects to allow for searching
   */
  constructor(dataSet: Searchable[]) {
    this.dataSet = dataSet;
    this.searchableKeys = this.collectKeys();
    this.index = this.buildIndex();
  }

  /**
   * Determines the union of all attributes in the searchable objects
   */
  private collectKeys(): string[] {
    let searchableKeys = new Set<string>();
    this.dataSet.forEach((searchable) => {
      searchableKeys = new Set([...searchableKeys, ...Object.keys(searchable)]);
    });
    return [...searchableKeys];
  }

  /**
   * Creates the index to use when performing the search
   */
  private buildIndex(): Index {
    const index: Index = {};
    this.searchableKeys.forEach((field) => {
      index[field] = this.buildFieldIndex(field);
    });
    return index;
  }

  /**
   * Indexes a specific field of the objects
   * @param field the field to index
   */
  private buildFieldIndex(field: string): SubIndex {
    const index = new SubIndex();
    for (let i = 0; i < this.dataSet.length; i += 1) {
      const searchable = this.dataSet[i];
      const value = searchable[field];
      if (typeof value === 'string') {
        new Set(value.split(' ')).forEach((piece) => index.add(piece, i));
      } else if (Array.isArray(value)) {
        value.forEach((elem) => {
          index.add(elem.toString(), i);
        });
      } else if (value == null) {
        index.add('', i);
        index.add('null', i);
      } else {
        index.add(value.toString(), i);
      }
    }
    return index;
  }

  /**
   * Search through this collection for objects whose field matches the given query.
   * @param field the field to search through in each object
   * @param query a string representing the data to look for.
   * Can be several fields separated by spaces. Each word
   * would then need to be found in the object to match.
   * An empty string or "null" can be provided to find
   * objects that don't have that value defined.
   */
  public search(field: string, query: string): Searchable[] {
    const pieces = new Set(query.split(' '));
    let resultIds: number[] | null = null;
    for (const piece of pieces) {
      const intermediateResult = this.index[field].get(piece);
      if (!intermediateResult) {
        break;
      }
      if (resultIds) {
        resultIds = SearchableCollection.intersectAscendingLists(resultIds, intermediateResult);
      } else {
        resultIds = intermediateResult;
      }
      // if there are no results, there will never be any results
      if (resultIds.length === 0) {
        break;
      }
    }
    if (resultIds) {
      return resultIds.map((searchableId) => this.dataSet[searchableId]);
    }
    return [];
  }

  /**
   * Utility function to calculate the intersection of two lists of numbers
   * @param listA the first list to intersect
   * @param listB the second list to intersect
   */
  private static intersectAscendingLists(listA: number[], listB: number[]) {
    let posA = 0;
    let posB = 0;
    const listOut: number[] = [];
    while (posA < listA.length && posB < listB.length) {
      if (listA[posA] < listB[posB]) {
        posA += 1;
      } else if (listA[posA] > listB[posB]) {
        posB += 1;
      } else { // they are equal
        listOut.push(listA[posA]);
        posA += 1;
        posB += 1;
      }
    }
    return listOut;
  }

  private dataSet: Searchable[];

  public readonly searchableKeys: string[];

  private index: Index;
}

/**
 * A simplification of an object as an index from strings to any type
 */
export interface Searchable {
  [key: string]: any;
}
