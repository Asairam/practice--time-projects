import { Injectable } from '@angular/core';

@Injectable()
export class MailTemplateService {

    constructor(
	) { }
	
	editorConfig =  {
		editable: true,
		spellcheck: true,
		height: '30rem',
		minHeight: '10rem',
		placeholder: 'Enter text here...',
		defaultParagraphSeparator: '',
		defaultFontName: '',
		defaultFontSize: '',
		fonts: [
		  { class: 'arial', name: 'Arial' },
		  { class: 'times-new-roman', name: 'Times New Roman' },
		  { class: 'calibri', name: 'Calibri' },
		  { class: 'comic-sans-ms', name: 'Comic Sans MS' }
		],
		customClasses: [
		  {
			name: 'quote',
			class: 'quote',
		  },
		  {
			name: 'redText',
			class: 'redText'
		  },
		  {
			name: 'titleText',
			class: 'titleText',
			tag: 'h1',
		  },
		],
		uploadUrl: 'v1/image',
		sanitize: true,
		toolbarPosition: 'top',
	  };

}