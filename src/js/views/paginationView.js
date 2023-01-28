import View from "./View"

import icons from "url:../../img/icons.svg"

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination")

	addHandlerClick = function (handler) {
		this._parentElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--inline")
			if (!btn) return

			const goToPage = Number(btn.dataset.goto)
			handler(goToPage)
		})
	}

	_generateMarkup = function () {
		const numPages = this._data.result.length / this._data.resultPerPage
		const curPage = this._data.page

		// Page 1, and there are other pages
		if (curPage === 1 && numPages > 1) {
			return this._generateMarkupBtn("next", curPage)
		}

		// Last page
		if (curPage !== 1 && curPage === Math.ceil(numPages)) {
			return this._generateMarkupBtn("prev", curPage)
		}

		// Other middle pages
		if (curPage < numPages) {
			return (
				this._generateMarkupBtn("prev", curPage) +
				this._generateMarkupBtn("next", curPage)
			)
		}

		// Page 1, NO other pages
		return ""
	}

	_generateMarkupBtn = function (dir, page) {
		if (dir === "prev") {
			return `
				<button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
					<svg class="search__icon">
						<use href="${icons}#icon-arrow-left"></use>
					</svg>
					<span>Page ${page - 1}</span>
				</button>
			`
		}

		if (dir === "next") {
			return `
				<button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
					<span>Page ${page + 1}</span>
					<svg class="search__icon">
						<use href="${icons}#icon-arrow-right"></use>
					</svg>
				</button>
			`
		}
	}
}

export default new PaginationView()
