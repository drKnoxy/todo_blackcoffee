// Generated by CoffeeScript 1.4.0
var TodoItem, TodoList, TodoListView, TodoView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TodoItem = (function(_super) {

  __extends(TodoItem, _super);

  function TodoItem() {
    return TodoItem.__super__.constructor.apply(this, arguments);
  }

  TodoItem.prototype.defaults = {
    description: 'Empty todo...',
    status: 'incomplete'
  };

  TodoItem.prototype.toggleStatus = function() {
    if (this.get('status' === 'incomplete')) {
      this.set('status', 'complete');
    } else {
      this.set('status', 'incomplete');
    }
    return console.log("i'd save here");
  };

  return TodoItem;

})(Backbone.Model);

TodoView = (function(_super) {

  __extends(TodoView, _super);

  function TodoView() {
    return TodoView.__super__.constructor.apply(this, arguments);
  }

  TodoView.prototype.tagName = 'li';

  TodoView.prototype.className = 'todo';

  TodoView.prototype.template = _.template('<h3 class="<%= status%>">\n	<input type="checkbox" \n	<% if( status === \'complete\' ) print(\'checked="checked"\') %>/>\n	<%= description %>\n</h3>');

  TodoView.prototype.initialize = function() {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    return this.model.on('hide', this.remove, this);
  };

  TodoView.prototype.events = {
    'change input': 'toggleStatus'
  };

  TodoView.prototype.render = function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  };

  TodoView.prototype.remove = function() {
    return this.$el.remove();
  };

  TodoView.prototype.toggleStatus = function() {
    return this.model.toggleStatus();
  };

  return TodoView;

})(Backbone.View);

TodoList = (function(_super) {

  __extends(TodoList, _super);

  function TodoList() {
    return TodoList.__super__.constructor.apply(this, arguments);
  }

  TodoList.prototype.model = TodoItem;

  TodoList.prototype.initialize = function() {
    return this.on('remove', this.hideModel);
  };

  TodoList.prototype.hideModel = function(model) {
    return model.trigger('hide');
  };

  return TodoList;

})(Backbone.Collection);

TodoListView = (function(_super) {

  __extends(TodoListView, _super);

  function TodoListView() {
    return TodoListView.__super__.constructor.apply(this, arguments);
  }

  TodoListView.prototype.initialize = function() {
    this.collection.on('add', this.addOne, this);
    return this.collection.on('reset', this.addAll, this);
  };

  TodoListView.prototype.tagName = 'ul';

  TodoListView.prototype.render = function() {
    return this.addAll();
  };

  TodoListView.prototype.addOne = function(todoItem) {
    var todoView;
    todoView = new TodoView({
      model: todoItem
    });
    return this.$el.append(todoView.render().el);
  };

  TodoListView.prototype.addAll = function() {
    this.collection.forEach(this.addOne, this);
    return this;
  };

  return TodoListView;

})(Backbone.View);

$(function() {
  var todos;
  window.todoList = new TodoList();
  todos = [
    {
      description: 'Pick up milk',
      status: 'incomplete'
    }, {
      description: 'Open that milk',
      status: 'incomplete'
    }, {
      description: 'Drink that milk',
      status: 'incomplete'
    }
  ];
  todoList.reset(todos);
  window.todoListView = new TodoListView({
    collection: todoList
  });
  todoListView.render();
  $('body').html(todoListView.el);
});