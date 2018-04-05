import {getToken} from './githubToken';
import {toggleFilteredFiles, askGithubToken} from './uiHelpers';
import getRelevantFiles from './getRelevantFiles';

const buttonId = 'codeowners-btn'
let buttonToggle = true
const getButtonText = (numOfFiles) => buttonToggle ? `Show my files (${numOfFiles})` : 'Show all files'

const buttonExists = () => {
    const exists = !!document.getElementById(buttonId)
    console.log('button exists?', exists)
    return exists
}
const removeButton = () => {
    const btn = document.getElementById(buttonId)
    console.log('button being removed...', btn)
    btn.remove();
}


const createButton = () => {
    const button = document.createElement('button');
    button.id = buttonId
    button.className = 'diffbar-item btn btn-sm btn-secondary codeowners-btn';
    button.innerHTML = getButtonText('...');
    return button
}

const getCodeownersButton = async (prUrl) => {
    if (!getToken()) askGithubToken()
    
    let files = await getRelevantFiles(prUrl);
    const button = createButton();
    
    button.innerHTML = getButtonText(files.length);
    button.onclick = () => {
        if (getToken()) {
            buttonToggle = !buttonToggle 
            button.innerHTML = getButtonText(files.length);
            toggleFilteredFiles(files);
        } else {
            askGithubToken();
        }
    };

    return button;
};

const injectButton = async (prUrl) => {
    
    const codeownersButton = await getCodeownersButton(prUrl)
    const container = document.querySelector(
        '#files_bucket > div.pr-toolbar.js-sticky.js-sticky-offset-scroll > div > div.float-right.pr-review-tools',
    );
    container.insertBefore(codeownersButton, container.firstChild);
};


export default injectButton;
