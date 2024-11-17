// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "obsidian-snippets" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('obsidian-snippets.setup', () => {
		vscode.window.showOpenDialog({ canSelectFolders: true, canSelectMany: false, canSelectFiles: false, openLabel: 'Select your Obsidian Vault' }).then(folderUri => {
			if(folderUri && folderUri[0]) {
				const obsidianPath = folderUri[0].path;
				const config = vscode.workspace.getConfiguration();
				config.update('obsidian-snippets.path', obsidianPath, vscode.ConfigurationTarget.Global).then(() => {
					console.log('Updated config');
				});
				const obsidianPathPersistant = config.get('obsidian-snippets.path');
				console.log(obsidianPathPersistant);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
