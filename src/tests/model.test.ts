import { SearchableCollection, Searchable } from "../model";
import { expect } from "chai";

describe("model",function(){
    it('searches for string and doesn\'t find a result', function(done) {
        const data = [
            {id: 1, name: "foo"},
            {id: 2, name: "bar"}
        ]
        const searchables = new SearchableCollection(data);
        const result = searchables.search("name","baz");
        const expected = Array<Searchable>();
        expect(result).to.eql(expected);
        done();
    });
    it('searches for string and finds single result', function(done) {
        const data = [
            { id: 1, name: "foo" },
            { id: 2, name: "bar" }
        ];
        const searchables = new SearchableCollection(data);
        const result = searchables.search("name","bar");
        const expected = [{ id: 2, name: "bar" }]
        expect(result).to.eql(expected);
        done();
    });
    it('searches for string and finds two results', function(done) {
        const data = [
            { id: 1, name: "foo" },
            { id: 2, name: "bar" },
            { id: 3, name: "foo" }
        ];
        const searchables = new SearchableCollection(data);
        const result = searchables.search("name","foo");
        const expected = [
            { id: 1, name: "foo" },
            { id: 3, name: "foo" }
        ];
        expect(result).to.eql(expected);
        done();
    });
    it('searches for word in string and finds a result', function(done) {
        const data = [
            { id: 1, msg: "I love ice cream" },
            { id: 2, msg: "I hate ice cream" }
        ];
        const searchables = new SearchableCollection(data);
        const result = searchables.search("msg","love");
        const expected = [
            { id: 1, msg: "I love ice cream" }
        ];
        expect(result).to.eql(expected)
        done();
    });
    it('searches for a word in a list and finds a result', function(done) {
        const data = [
            { id: 1, keys: ["foo", "bar"] },
            { id: 2, keys: ["baz", "bid"] },
        ];
        const searchables = new SearchableCollection(data);
        const result = searchables.search("keys","bid");
        const expected = [
            { id: 2, keys: ["baz", "bid"] }
        ];
        expect(result).to.eql(expected);
        done();
    });
    it('searches for undefined and finds a result', function(done) {
        const data = [
            { id: 1, message: "How do you do?" },
            { id: 2 },
            { id: 3, message: "My name is Sue!" }
        ];
        const searchables = new SearchableCollection(data);
        const result = searchables.search("message","");
        const expected = [{ id: 2 }];
        expect(result).to.eql(expected);
        done();
    });
    it('searches for multiple words and finds a result', function(done) {
        const data = [
            { id: 1, message: "How much wood" },
            { id: 2, message: "could a woodchuck chuck" },
            { id: 3, message: "if a woodchuck could chuck wood" }
        ];
        const searchables = new SearchableCollection(data);
        const result = searchables.search("message", "woodchuck if");
        const expected = [{ id: 3, message: "if a woodchuck could chuck wood" }]
        expect(result).to.eql(expected);
        done();
    });
    it('searches for multiple words and finds a result (reversed)', function(done) {
        const data = [
            { id: 1, message: "How much wood" },
            { id: 2, message: "could a woodchuck chuck" },
            { id: 3, message: "if a woodchuck could chuck wood" }
        ];
        const searchables = new SearchableCollection(data);
        const result = searchables.search("message", "if woodchuck");
        const expected = [{ id: 3, message: "if a woodchuck could chuck wood" }]
        expect(result).to.eql(expected);
        done();
    });
    it('searches for multiple tags and doesn\'t find a result', function(done) {
        const data = [
            { id: 1, tags: ["ayy","bee"]},
            { id: 2, tags: ["ayy","cee"]}
        ]
        const searchables = new SearchableCollection(data);
        const result = searchables.search("tags","bee cee");
        const expected = new Array<Searchable>();
        expect(result).to.eql(expected);
        done();
    });
})