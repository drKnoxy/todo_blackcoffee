# running this script with coffee -cwb

class TodoItem extends Backbone.Model
	defaults:
		description: 'Empty todo...'
		status: 'incomplete'

	toggleStatus: ->
		if @get 'status' is 'incomplete' then @set 'status','complete'
		else @set 'status','incomplete'

		console.log "i'd save here"
		#@save()

class TodoView extends Backbone.View

	tagName: 'li'

	className: 'todo'

	# Template written in underscore templating
	template: _.template '''
		<h3 class="<%= status%>">
			<input type="checkbox" 
			<% if( status === 'complete' ) print('checked="checked"') %>/>
			<%= description %>
		</h3>
	'''

	initialize: ->
		@model.on 'change', @render, @
		@model.on 'destroy', @remove, @
		@model.on 'hide', @remove, @

	events:
		'change input': 'toggleStatus'
	
	render: ->
		@$el.html @template( @model.toJSON() )
		return @ # for chaining

	remove: ->
		@$el.remove()

	toggleStatus: ->
		@model.toggleStatus()



class TodoList extends Backbone.Collection
	model: TodoItem
	initialize: ->
		@on 'remove', @hideModel

	hideModel: (model) ->
		model.trigger 'hide'



class TodoListView extends Backbone.View
	initialize: ->
		@collection.on 'add', @addOne, @
		@collection.on 'reset', @addAll, @

	tagName: 'ul'

	render: ->
		@addAll()

	addOne: (todoItem) ->
		todoView = new TodoView model: todoItem
		@$el.append todoView.render().el

	addAll: ->
		@collection.forEach( @addOne, @ )
		return @ # for chaining

# Get ready
$ ->
	# Model
	#window.todoItem = new TodoItem()

	# View
	# window.todoView = new TodoView
	# 	model: todoItem

	# Collection
	window.todoList = new TodoList()

	# Rendering
	todos = [
		{ description: 'Pick up milk', status: 'incomplete' }
		{ description: 'Open that milk', status: 'incomplete' }
		{ description: 'Drink that milk', status: 'incomplete' }
	]

	todoList.reset todos 

	# Collection View
	# when we initialize a view we set its model/collection
	window.todoListView = new TodoListView
		collection: todoList

	# Rendering
	todoListView.render()
	$('body').html todoListView.el

	return #end ready