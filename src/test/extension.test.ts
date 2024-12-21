import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as extension from '../extension';

suite('Extension Test Suite', async () => {
	vscode.window.showInformationMessage('Start all tests.');

	suiteSetup(async () => {
		await vscode.extensions.getExtension('EliteWise.obsidian-snippets')?.activate();
	});

	test('Path should be registered in workspace global settings', async () => {
		const config = vscode.workspace.getConfiguration();
		const selected_path = '/testpath';

		await config.update('obsidian-snippets.path', selected_path, vscode.ConfigurationTarget.Global);
		const path = config.get('obsidian-snippets.path');
		
		assert.strictEqual(path, selected_path);
	});

	test('Copy command should be present at extension initialisation', async () => {
		const command = 'obsidian-snippets.copy';
		const allCommands = await vscode.commands.getCommands(true);

		const copyCommandExists = allCommands.includes(command);
		assert.ok(copyCommandExists);
	});
});
