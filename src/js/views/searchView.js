import View from "./View"

class SearchView extends View {
	_parentElement = document.querySelector(".search")

	getQuery = function () {
		const query = this._parentElement.querySelector(".search__field").value
		this._clearInput()
		return query
	}

	addHandlerSearch = function (handler) {
		this._parentElement.addEventListener("submit", function (e) {
			e.preventDefault()
			handler()
		})
	}

	_clearInput = function () {
		this._parentElement.querySelector(".search__field").value = ""
	}
}

export default new SearchView()
