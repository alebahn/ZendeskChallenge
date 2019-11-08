import { readFileSync } from "fs";
import { type } from "os";

export interface SearchableCollectionCollection
{
    [key : string] : SearchableCollection
}

interface Index
{
    [field: string]: { [query: string]: number[] }
}

export class SearchableCollection
{
    constructor(dataSet : Searchable[])
    {
        this.dataSet = dataSet;
        this.searchableKeys = this.collectKeys();
        this.index = this.buildIndex();
    }

    private collectKeys() : string[]
    {
        var searchableKeys = new Set<string>();
        for (var searchable of this.dataSet)
        {
            searchableKeys = new Set([...searchableKeys,...Object.keys(searchable)]);
        }
        return [...searchableKeys];
    }

    private buildIndex() : Index
    {
        const index : Index = {};
        for (var field of this.searchableKeys)
        {
            index[field] = this.buildFieldIndex(field);
        }
        return index;
    }

    private buildFieldIndex(field : string) : {[query : string] : number[]}
    {
        const index : {[query : string] : number[]} = {};
        for (let i=0; i<this.dataSet.length; ++i)
        {
            const searchable = this.dataSet[i];
            const value = searchable[field];
            if (typeof value === "string")
            {
                new Set(value.split(" ")).forEach(piece => this.addToIndex(index,piece,i));
            }
            else if (Array.isArray(value))
            {
                for (let elem of value)
                {
                    this.addToIndex(index,elem.toString(),i);
                }
            }
            else if (value == null)
            {
                this.addToIndex(index,"",i);
                this.addToIndex(index,"null",i);
            }
            else
            {
                this.addToIndex(index,value.toString(),i);
            }
        }
        return index;
    }

    private addToIndex(index : {[query : string] : number[]}, key : string, value : number) : void
    {
        if (index[key])
        {
            index[key].push(value);
        }
        else
        {
            index[key] = [value];
        }
    }

    public search(field : string, query : string) : Searchable[]
    {
        const pieces = new Set(query.split(" "));
        let resultIds : number[] | null = null;
        for (let piece of pieces)
        {
            const intermediateResult = this.index[field][piece];
            if (!intermediateResult)
            {
                break;
            }
            if (resultIds)
            {
                resultIds = this.intersectAscendingLists(resultIds,intermediateResult);
            }
            else
            {
                resultIds = intermediateResult;
            }
            //if there are no results, there will never be any results
            if (resultIds.length === 0)
            {
                break;
            }
        }
        if (resultIds)
        {
            return resultIds.map(searchableId => this.dataSet[searchableId]);
        }
        return [];
    }

    private intersectAscendingLists(listA : number[], listB : number[])
    {
        let posA=0;
        let posB=0;
        let listOut : number[] = [];
        while (posA < listA.length && posB < listB.length)
        {
            if (listA[posA] < listB[posB])
            {
                ++posA;
            }
            else if (listA[posA] > listB[posB])
            {
                ++posB;
            }
            else    //they are equal
            {
                listOut.push(listA[posA]);
                ++posA;
                ++posB;
            }
        }
        return listOut;
    }

    private dataSet : Searchable[];
    public readonly searchableKeys : string[];
    private index : Index;
}

export interface Searchable
{
    [key : string] : any;
}