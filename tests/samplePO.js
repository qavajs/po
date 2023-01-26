const { $, $$ } = require('../src/register');

class MultipleComponent {
    selector = '.list-components li';

    ChildItem = $('div');
}

class SingleComponent {
    selector = '.container';

    ChildItem = $('.child-item');
    IgnoreHierarchyItem = $('.list-components > li:first-child', { ignoreHierarchy: true });
}

class AsyncComponent {
    selector = '#async-list-components';

    ChildItems = $$('li');
}

class Level2Elements {
    selector = 'ul.level2';

    ListItems = $$('li > span');
}

class Level1Elements {
    selector = 'ul.level1';

    Level2Elements = $$(new Level2Elements());
}

class NotExistingComponent {
    selector = 'not-exist';

    Item = $('div');
    Items = $$('li > span');
}

class ComponentWithoutSelector {
    SingleElement = $('.single-element');
    List = $$('.list li');
}

class App {
    SingleElement = $('.single-element');
    List = $$('.list li');
    SingleComponent = $(new SingleComponent());
    MultipleComponents = $$(new MultipleComponent());
    AsyncComponent = $(new AsyncComponent());
    Level1Elements = $(new Level1Elements());
    NotExistingComponent = $(new NotExistingComponent());
    ComponentWithoutSelector = $(new ComponentWithoutSelector());
    ComponentsWithoutSelector = $$(new ComponentWithoutSelector());
}

module.exports = new App();
