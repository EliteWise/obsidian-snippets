import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

export function activate(context: vscode.ExtensionContext) {

	const openFileText = 'Open File in VS Code?';

	const getPath = () => {
		let config = vscode.workspace.getConfiguration();
		return config.get('obsidian-snippets.path');
	}

	const manageSnippetsFolder = async (snippetsFolderPath: string) => {
		const folderExist = await fs.promises.access(snippetsFolderPath).then(() => true).catch(() => false);

		if(!folderExist) {
			await fs.promises.mkdir(snippetsFolderPath);
		}
	}

	const setupCommand = async () => {
		vscode.window.showInformationMessage('Setting up Obsidian path...');
		const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectMany: false, canSelectFiles: false, openLabel: 'Select your Obsidian Vault' });

		if(!folderUri?.[0]) {return;}

		const config = vscode.workspace.getConfiguration();
		await config.update('obsidian-snippets.path', folderUri[0].path.replace('/C:', ''), vscode.ConfigurationTarget.Global);
		const obsidianPathPersistant = String(config.get('obsidian-snippets.path'));
		const snippetsFolderPath = path.join(obsidianPathPersistant, 'Snippets');

		await manageSnippetsFolder(snippetsFolderPath);
	};

	const disposable = vscode.commands.registerCommand('obsidian-snippets.setup', async () => {
		await setupCommand();
	}); 

	const copySnippetCommand = async () => {
		let folderPath = getPath();

		if(!folderPath) {
			try {
				await setupCommand();
				const newFolderPath = getPath();
				folderPath = newFolderPath
			} catch (error) {
				console.error(error);
			}
			
		}

		const snippetsFolderPath = path.join(folderPath, 'Snippets');

		await manageSnippetsFolder(snippetsFolderPath);

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		const selection: vscode.Selection | undefined = editor?.selection;
		const codeSelected: string | undefined = editor?.document.getText(selection);

		const fileExtension = path.extname(editor?.document.fileName).slice(1);
		const currentDate = new Date().toISOString().split('T')[0];
		const mdFile = path.join(snippetsFolderPath, path.basename(`${editor?.document.fileName}`) + '-' + currentDate + '.md');
		
		const exists = await fs.promises.access(mdFile).then(() => true).catch(() => false);

		try {
			if (exists) {
				await fs.appendFile(mdFile, `\n\n\`\`\`${fileExtension}\n${codeSelected}\n\`\`\``, (err: any) => err && console.log(err));
			} else {
				await fs.writeFile(mdFile, `\`\`\`${fileExtension}\n${codeSelected}\n\`\`\``, (err: any) => err && console.log(err));
			}
		} catch (error) {
			console.log('Error appending/copying snippet:', error);
		}

		const action = await vscode.window.showInformationMessage(
			'Snippet copied to Obsidian!',
			openFileText,
		);

		if (action === openFileText) {
			try {
				const openedMdFile = await vscode.workspace.openTextDocument(vscode.Uri.file(mdFile));
				await vscode.window.showTextDocument(openedMdFile);
			} catch (error) {
				console.log(error);
			}
		}
	};

	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('obsidian-snippets.copy', copySnippetCommand));
}

export function deactivate() {}
