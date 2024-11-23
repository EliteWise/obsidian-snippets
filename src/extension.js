"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = require('fs');
const path = require('path');
function activate(context) {
    let snippetsFolderPath = '';
    console.log('Congratulations, your extension "obsidian-snippets" is now active!');
    const disposable = vscode.commands.registerCommand('obsidian-snippets.setup', () => {
        vscode.window.showOpenDialog({ canSelectFolders: true, canSelectMany: false, canSelectFiles: false, openLabel: 'Select your Obsidian Vault' }).then(folderUri => {
            if (folderUri && folderUri[0]) {
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
        const editor = vscode.window.activeTextEditor;
        const selection = editor?.selection;
        const codeSelected = editor?.document.getText(selection);
        const mdFile = snippetsFolderPath + path.basename(`${editor?.document.fileName}.md`);
        console.log(mdFile);
        fs.writeFileSync(mdFile, `\`\`\`${codeSelected}\`\`\``);
        const openedMdFile = vscode.workspace.openTextDocument(vscode.Uri.file(mdFile));
        openedMdFile.then(mdFile => {
            vscode.window.showTextDocument(mdFile);
        });
    };
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('obsidian-snippets.copy', copySnippetCommand));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map