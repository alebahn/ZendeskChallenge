import * as TypeMoq from 'typemoq';
import { BasicOptions } from 'readline-sync';
import { SearchView, UI } from '../view';
import { SearchableCollectionCollection, SearchableCollection } from '../model';

class MockUI implements UI {
  public question(query?: any, options?: BasicOptions): string {
    return '';
  }

  public keyInSelect(items: string[], query?: any, options?: BasicOptions): number {
    return 0;
  }

  public log(message?: any, ...optionalParams: any[]): void { }
}

describe('view', function () {
  it('shows menu and lets user quit', function (done) {
    const mockUI = TypeMoq.Mock.ofType(MockUI);
    const fooMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const barMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const mockSearchableCollection = {
      foo: fooMock.object,
      bar: barMock.object,
    };
    mockUI.setup((ui) => ui.keyInSelect(TypeMoq.It.isValue(['foo', 'bar']), TypeMoq.It.isAny(), TypeMoq.It.isValue({ cancel: 'Quit' })))
      .returns(() => -1);

    const view = new SearchView(mockUI.object);
    view.run(mockSearchableCollection);

    barMock.verify((searchables) => searchables.search(TypeMoq.It.isAny(), TypeMoq.It.isAny()),
      TypeMoq.Times.never());

    done();
  });
  it('lets user select second collection then quit', function (done) {
    const mockUI = TypeMoq.Mock.ofType(MockUI);
    const fooMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const barMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const mockSearchableCollection = {
      foo: fooMock.object,
      bar: barMock.object,
    };

    mockUI.setup((ui) => ui.keyInSelect(TypeMoq.It.isValue(['foo', 'bar']), TypeMoq.It.isAny(), TypeMoq.It.isValue({ cancel: 'Quit' })))
      .returns(() => 1);
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isValue({
      limit: ['id', 'name', 'quit', 'back'],
      limitMessage: 'Invalid input',
    })))
      .returns(() => 'quit');
    barMock.setup((searchables) => searchables.searchableKeys).returns(() => ['id', 'name']);

    const view = new SearchView(mockUI.object);
    view.run(mockSearchableCollection);

    mockUI.verify((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isValue({
      limit: ['id', 'name', 'quit', 'back'],
      limitMessage: 'Invalid input',
    })), TypeMoq.Times.once());

    done();
  });
  it('lets user quit from query string', function (done) {
    const mockUI = TypeMoq.Mock.ofType(MockUI);
    const fooMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const barMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const mockSearchableCollection = {
      foo: fooMock.object,
      bar: barMock.object,
    };

    mockUI.setup((ui) => ui.keyInSelect(TypeMoq.It.isValue(['foo', 'bar']), TypeMoq.It.isAny(), TypeMoq.It.isValue({ cancel: 'Quit' })))
      .returns(() => 1);
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isValue({
      limit: ['id', 'name', 'quit', 'back'],
      limitMessage: 'Invalid input',
    })))
      .returns(() => 'name');
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
      .returns(() => 'quit');
    barMock.setup((searchables) => searchables.searchableKeys).returns(() => ['id', 'name']);

    const view = new SearchView(mockUI.object);
    view.run(mockSearchableCollection);

    barMock.verify((searchables) => searchables.search(TypeMoq.It.isAny(), TypeMoq.It.isAny()),
      TypeMoq.Times.never());

    done();
  });
  it('lets user search for string and calls search', function (done) {
    const mockUI = TypeMoq.Mock.ofType(MockUI);
    const fooMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const barMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const mockSearchableCollection = {
      foo: fooMock.object,
      bar: barMock.object,
    };

    mockUI.setup((ui) => ui.keyInSelect(TypeMoq.It.isValue(['foo', 'bar']), TypeMoq.It.isAny(), TypeMoq.It.isValue({ cancel: 'Quit' })))
      .returns(() => 1);
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isValue({
      limit: ['id', 'name', 'quit', 'back'],
      limitMessage: 'Invalid input',
    })))
      .returns(() => 'name');
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
      .returns(() => 'Sphen');
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isValue({
      limit: ['id', 'name', 'quit', 'back'],
      limitMessage: 'Invalid input',
    })))
      .returns(() => 'quit');
    barMock.setup((searchables) => searchables.searchableKeys).returns(() => ['id', 'name']);
    barMock.setup((searchables) => searchables.search(TypeMoq.It.isValue('name'), TypeMoq.It.isValue('Sphen')))
      .returns(() => [{ id: 5, name: 'dummy' }]);

    const view = new SearchView(mockUI.object);
    view.run(mockSearchableCollection);

    barMock.verify((searchableCollection) => searchableCollection.search(TypeMoq.It.isValue('name'), TypeMoq.It.isValue('Sphen')),
      TypeMoq.Times.once());

    done();
  });
  it('lets user search for string and shows empty result', function (done) {
    const mockUI = TypeMoq.Mock.ofType(MockUI);
    const fooMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const barMock = TypeMoq.Mock.ofType(SearchableCollection, undefined, true, []);
    const mockSearchableCollection = {
      foo: fooMock.object,
      bar: barMock.object,
    };

    mockUI.setup((ui) => ui.keyInSelect(TypeMoq.It.isValue(['foo', 'bar']), TypeMoq.It.isAny(), TypeMoq.It.isValue({ cancel: 'Quit' })))
      .returns(() => 1);
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isValue({
      limit: ['id', 'name', 'quit', 'back'],
      limitMessage: 'Invalid input',
    })))
      .returns(() => 'name');
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
      .returns(() => 'Sphen');
    mockUI.setup((ui) => ui.question(TypeMoq.It.isAny(), TypeMoq.It.isValue({
      limit: ['id', 'name', 'quit', 'back'],
      limitMessage: 'Invalid input',
    })))
      .returns(() => 'quit');
    barMock.setup((searchables) => searchables.searchableKeys).returns(() => ['id', 'name']);
    barMock.setup((searchables) => searchables.search(TypeMoq.It.isValue('name'), TypeMoq.It.isValue('Sphen')))
      .returns(() => []);

    const view = new SearchView(mockUI.object);
    view.run(mockSearchableCollection);

    mockUI.verify((ui) => ui.log(TypeMoq.It.isValue('No results found for search.')), TypeMoq.Times.once());

    done();
  });
});
