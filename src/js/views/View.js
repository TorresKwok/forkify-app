import icons from "url:../../img/icons.svg"

export default class View {
	_data

	/**
	 * Render the received object to the DOM
	 * @param {Object | Object[]} data the data to be rendered (e.g. recipe)
	 * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
	 * @returns {undefined | string} A markup string is returned if render=false
	 * @this {Object} View instance
	 * @author Torres Kwok
	 * @todo Finish implementation
	 */
	render = function (data, render = true) {
		if (!data || (Array.isArray(data) && !data.length))
			return this.renderError()

		this._data = data
		const markup = this._generateMarkup()

		if (!render) return markup

		this._clear()
		this._parentElement.insertAdjacentHTML("afterbegin", markup)
	}

	update = function (data) {
		if (!data || (Array.isArray(data) && !data.length)) return

		this._data = data
		const newMarkup = this._generateMarkup()
		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup)

		const newElements = Array.from(newDOM.querySelectorAll("*"))
		const curElements = Array.from(
			this._parentElement.querySelectorAll("*"),
		)

		newElements.forEach((newEl, i) => {
			const curEl = curElements[i]
			// Update texts
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ""
			) {
				curEl.textContent = newEl.textContent
			}

			// Update attributes
			if (!newEl.isEqualNode(curEl)) {
				Array.from(newEl.attributes).forEach(attr =>
					curEl.setAttribute(attr.name, attr.value),
				)
			}
		})
	}

	// Render Spinner
	renderSpinner = function () {
		const markup = `
		<div class="spinner">
			<svg>
				<use href="${icons}#icon-loader"></use>
			</svg>
		</div>
		`
		this._clear()
		this._parentElement.insertAdjacentHTML("afterbegin", markup)
	}

	// Render Success Message
	renderMessage(msg = this._message) {
		const markup = `
		<div class="message">
			<div>
				<svg>
					<use href="${icons}#icon-smile"></use>
				</svg>
			</div>
			<p>${msg}</p>
		</div>
	`
		this._clear()
		this._parentElement.insertAdjacentHTML("afterbegin", markup)
	}

	// Render Error
	renderError(msg = this._errorMessage) {
		const markup = `
			<div class="error">
				<div>
					<svg>
						<use href="${icons}#icon-alert-triangle"></use>
					</svg>
				</div>
				<p>${msg}</p>
			</div>
		`
		this._clear()
		this._parentElement.insertAdjacentHTML("afterbegin", markup)
	}

	_clear = function () {
		this._parentElement.innerHTML = ""
	}
}
