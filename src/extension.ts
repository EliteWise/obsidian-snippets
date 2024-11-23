import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

export function activate(context: vscode.ExtensionContext) {

	let snippetsFolderPath: string = '';

	console.log('Congratulations, your extension "obsidian-snippets" is now active!');

	const disposable = vscode.commands.registerCommand('obsidian-snippets.setup', () => {
		vscode.window.showOpenDialog({ canSelectFolders: true, canSelectMany: false, canSelectFiles: false, openLabel: 'Select your Obsidian Vault' }).then(folderUri => {
			if(folderUri && folderUri[0]) {
				const obsidianPath = folderUri[0].path;
				const config = vscode.workspace.getConfiguration();
				config.update('obsidian-snippets.path', obsidianPath, vscode.ConfigurationTarget.Global);
				const obsidianPathPersistant = String(config.get('obsidian-snippets.path')).replace('/C:', '');
				snippetsFolderPath = obsidianPathPersistant + '/Snippets/';
				if (!fs.existsSync(snippetsFolderPath)) {
					fs.mkdirSync(snippetsFolderPath);
					console.log('Snippets folder created!');
				}
				
			}
		});
	});

	const copySnippetCommand = () => {
		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		const selection: vscode.Selection | undefined = editor?.selection;
		const codeSelected: string | undefined = editor?.document.getText(selection);

		const fileExtension = path.extname(editor?.document.fileName).slice(1);
		const currentDate = new Date().toISOString().split('T')[0];

		const mdFile = snippetsFolderPath + currentDate + '-' + path.basename(`${editor?.document.fileName}.md`);
		console.log(mdFile);
		fs.writeFileSync(mdFile, `\`\`\`${fileExtension}\n${codeSelected}\n\`\`\``);

		const openedMdFile = vscode.workspace.openTextDocument(vscode.Uri.file(mdFile));
		openedMdFile.then(mdFile => {
			vscode.window.showTextDocument(mdFile);
		});
	};

	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('obsidian-snippets.copy', copySnippetCommand));
}

export function deactivate() {}
