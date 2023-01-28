import { API_URL, API_KEY, RES_PER_PAGE } from "./config"
import { getJSON, sendJSON } from "./helpers"

import { async } from "regenerator-runtime"

export const state = {
	recipe: {},
	search: {
		query: "",
		result: [],
		page: 1,
		resultPerPage: RES_PER_PAGE,
	},
	bookmarks: [],
}

export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}/${id}?key=${API_KEY}`)
		state.recipe = data.data.recipe
		if (state.bookmarks.some(bookmark => bookmark.id === id)) {
			state.recipe.bookmarked = true
		} else {
			state.recipe.bookmarked = false
		}
	} catch (err) {
		throw err
	}
}

export const loadSearchResult = async function (query) {
	try {
		const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`)
		state.search.query = query
		state.search.page = 1
		state.search.result = data.data.recipes.map(recipe => {
			return {
				id: recipe.id,
				title: recipe.title,
				image_url: recipe.image_url,
				publisher: recipe.publisher,
			}
		})
	} catch (err) {
		throw err
	}
}

export const getSearchResultPage = function (page = state.search.page) {
	state.search.page = page
	const start = (page - 1) * state.search.resultPerPage
	const end = page * state.search.resultPerPage
	return state.search.result.slice(start, end)
}

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach(ing => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings
	})
	state.recipe.servings = newServings
}

const persistBookmarks = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
	// Add bookmark
	state.bookmarks.push(recipe)

	// Mark current recipe as bookmark
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
	persistBookmarks()
}

export const deleteBookmark = function (id) {
	// Delete bookmark from array
	const index = state.bookmarks.findIndex(bookmark => bookmark.id === id)
	state.bookmarks.splice(index, 1)

	// Mark current recipe as NOT bookmark
	if (id === state.recipe.id) state.recipe.bookmarked = false
	persistBookmarks()
}

export const initBookmarks = function () {
	const storage = localStorage.getItem("bookmarks")

	if (storage) state.bookmarks = JSON.parse(storage)
}

export const uploadRecipe = async function (recipeData) {
	try {
		const ingredients = Object.entries(recipeData)
			.filter(
				entry => entry[0].startsWith("ingredient") && entry[1] !== "",
			)
			.map(ing => {
				const ingArr = ing[1].replaceAll(" ", "").split(",")
				if (ingArr.length !== 3)
					throw new Error(
						"Wrong ingredient format! Please use the correct format!",
					)

				const [quantity, unit, description] = ingArr
				return {
					quantity: quantity ? Number(quantity) : 0,
					unit: unit ?? "",
					description: description ?? "",
				}
			})

		const recipe = {
			title: recipeData.title,
			source_url: recipeData.sourceUrl,
			image_url: recipeData.image,
			publisher: recipeData.publisher,
			cooking_time: Number(recipeData.cookingTime),
			servings: Number(recipeData.servings),
			ingredients,
		}
		const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe)
		state.recipe = data.data.recipe
		addBookmark(state.recipe)
	} catch (err) {
		throw err
	}
}
