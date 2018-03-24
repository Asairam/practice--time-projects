import {Pipe,PipeTransform  } from '@angular/core';
@Pipe({
	name:'fullTextSearch'
})

export class FilterPipe  implements PipeTransform {
	transform(items:any[],searchText:string):any[]{
		console.log(items)
		console.log(searchText)
		 if(!items) return [];
         if(!searchText) return items
	     	return items.filter( it => {
	     		console.log(it)
			      return it.name.toLowerCase().includes(searchText) || it.id.toLowerCase().includes(searchText) || it.age.toLowerCase().includes(searchText);
			 });
	}
}