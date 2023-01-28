import * as model from "./model.js"
import recipeView from "./views/recipeView.js"
import searchView from "./views/searchView.js"
import resultView from "./views/resultView.js"
import paginationView from "./views/paginationView.js"
import bookmarkView from "./views/bookmarkView.js"
import addRecipeView from "./views/addRecipeView.js"
import { MODAL_CLOSE_SEC } from "./config"

import "core-js/stable"
import "regenerator-runtime"
import { async } from "regenerator-runtime"

// if (module.hot) {
// 	module.hot.accept()
// }

const controlRecipe = async function () {
	try {
		const id = window.location.hash.slice(1)
		if (!id) return

		// Update result view to mark selected search result
		resultView.update(model.getSearchResultPage())
		bookmarkView.update(model.state.bookmarks)

		// Render spinner
		recipeView.renderSpinner()

		// Loading recipe
		await model.loadRecipe(id)

		// Rendering recipe
		recipeView.render(model.state.recipe)
	} catch (err) {
		console.error(err)
		recipeView.renderError(err)
	}
}

const controlSearchResult = async function () {
	try {
		resultView.renderSpinner()

		// Get Search Query
		const query = searchView.getQuery()
		if (!query) return

		// Load Search Results
		await model.loadSearchResult(query)

		// Render Results
		resultView.render(model.getSearchResultPage())

		// Render initial pagination buttons
		paginationView.render(model.state.search)
	} catch (err) {
		throw err
	}
}

const controlPagination = function (goToPage) {
	model.state.search.page = goToPage

	// Load NEW Results
	resultView.render(model.getSearchResultPage(goToPage))

	// Render NEW pagination buttons
	paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
	// Update the recipe servings (in model state)
	model.updateServings(newServings)

	// Update the recipe view
	// recipeView.render(model.state.recipe)
	recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
	// Add/remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
	else if (model.state.recipe.bookmarked)
		model.deleteBookmark(model.state.recipe.id)

	// Update recipe view
	recipeView.update(model.state.recipe)

	// Render bookmarks
	bookmarkView.render(model.state.bookmarks)
}

const controlBookMark = function () {
	bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
	try {
		// Show loading spinner
		addRecipeView.renderSpinner()

		// Upload new recipe data
		await model.uploadRecipe(newRecipe)
		console.log(model.state.recipe)

		// Success message
		addRecipeView.renderMessage()

		// Render recipe
		recipeView.render(model.state.recipe)

		// Render bookmark view
		bookmarkView.render(model.state.bookmarks)

		// Change ID in URL
		window.history.pushState(null, "", `#${model.state.recipe.id}`)

		// Close form window
		setTimeout(function () {
			addRecipeView.toggleWindow()
		}, MODAL_CLOSE_SEC * 1000)
	} catch (err) {
		console.error(err)
		// addRecipeView.renderError(err.message)
	}
}

const init = function () {
	model.initBookmarks()

	// Publisher-Subscriber Pattern (Subscriber)
	bookmarkView.addHandlerRender(controlBookMark)
	recipeView.addHandlerRender(controlRecipe)
	recipeView.addHandlerUpdateServings(controlServings)
	recipeView.addHandlerAddBookmark(controlAddBookmark)
	searchView.addHandlerSearch(controlSearchResult)
	paginationView.addHandlerClick(controlPagination)
	addRecipeView.addHandlerUpload(controlAddRecipe)

	console.log("HELLO WORLD")
}

init()
