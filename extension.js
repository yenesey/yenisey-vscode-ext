const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	//console.log('Congratulations, your extension "yenisey" is now active!')

	let command = vscode.commands.registerCommand
	//let editorCommand = vscode.commands.registerTextEditorCommand
	let push = 0
	let start = 0
	let elapsed = 0

	let subs = command('tripleKeypressCloseEditor', function () {
		elapsed = Date.now() - start
		if (elapsed > 3000) {
			start = Date.now()
			push = 0
		}	
		push = push + 1
		if (push >= 3) {
			push = 0
			if (elapsed < 3000) {
				if (vscode.window.visibleTextEditors.length	>= 1) {
					vscode.commands.executeCommand("workbench.action.closeActiveEditor")
				} else {
					vscode.commands.executeCommand("workbench.action.closeWindow")
				}
			}
		}
	})

	context.subscriptions.push(subs)
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
