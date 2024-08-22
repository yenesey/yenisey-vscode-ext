const vscode = require('vscode');


/**
 * returns function that needs to be called @timesToCall times in @milliseconds interval to perform @actionFunc
 */
function timesToCallBeforeAction(timesToCall, milliseconds, actionFunc) {
	let push = 0
	let start = 0
	let elapsed = 0
	return function() {
		elapsed = Date.now() - start
		if (elapsed > milliseconds) {
			start = Date.now()
			push = 0
		}	
		push = push + 1
		if (push >= timesToCall) {
			push = 0
			if (elapsed < milliseconds) {
				actionFunc()
			}
		}
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	let disposable = vscode.commands.registerCommand('tripleKeypressCloseEditor', timesToCallBeforeAction(3, 3000, () => {
		if (vscode.window.visibleTextEditors.length	>= 1) {
			vscode.commands.executeCommand("workbench.action.closeActiveEditor")
		} else {
			vscode.commands.executeCommand("workbench.action.closeWindow")
		}
	}))
	context.subscriptions.push(disposable)

	disposable = vscode.commands.registerCommand('toggleTextCase', () => {
		const editor = vscode.window.activeTextEditor
		if (editor) {
			const document = editor.document;
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel
					let word = document.getText(range)
					let firstIsLower = word.substr(0,1) == word.substr(0,1).toLowerCase()
					let lastIsLower  = word.substr(word.length-1,1) == word.substr(word.length-1,1).toLowerCase()
					if (firstIsLower && lastIsLower) {
						word = word.substr(0,1).toUpperCase() + word.substr(1, word.length-1)
					} else if (!firstIsLower && lastIsLower) {
						word = word.toUpperCase()
					} else {
						word = word.toLowerCase()
					}
					editBuilder.replace(range, word);
				})
			}) // apply the (accumulated) replacement(s) (if multiple cursors/selections)
		}
		
	})
	context.subscriptions.push(disposable)
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
