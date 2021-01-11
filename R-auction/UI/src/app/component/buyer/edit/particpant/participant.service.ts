import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { CommonService } from 'src/app/commonService/common.service';
import { Workbook } from 'exceljs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ParticipantService {
    translateSer: any;
    
    constructor(private common: CommonService) {
        this.common.translateSer('ITEM_MSG').subscribe(async (text: string) => {
            this.translateSer = text;
        });
    }

    // start download excel

    public supplierExportAsExcelFile(json: any[], excelFileName: string, headersArray: any[]) {
        return new Promise((resolve, reject) => {
            // let alpha = this.getChar();
            //Excel Title, Header, Data
            const header = headersArray;
            const data = json;
            //Create workbook and worksheet
            let workbook = new Workbook();
            let worksheet = workbook.addWorksheet(excelFileName);
            worksheet.protect('Ril@1995', { selectUnlockedCells: true })
            //Add Header Row
            let headerRow = worksheet.addRow(header);
            // Cell Style : Fill and Border
            headerRow.eachCell((cell, number) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF00' },
                    bgColor: { argb: 'FF0000FF' }
                }
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            })
            // Add Data and Conditional Formatting
            data.forEach((element, i) => {
                let eachRow = [];
                headersArray.forEach((headers, ind) => {
                    eachRow.push(element[headers])
                })
                //   if (element.isDeleted === "Y") {
                //     let deletedRow = worksheet.addRow(eachRow);
                //     deletedRow.eachCell((cell, number) => {
                //       cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
                //     })
                //   } else {
                worksheet.addRow(eachRow);
                //   }

            })
            worksheet.views = [
                { state: 'frozen', xSplit: 6 }
            ];
            worksheet.getColumn(1).width = 5;
            worksheet.getColumn(2).width = 15;
            worksheet.getColumn(3).width = 30;
            worksheet.getColumn(4).width = 25;
            worksheet.getColumn(5).width = 17;
            worksheet.getColumn(6).width = 15;
            this.getCellVali(worksheet, data, headersArray);
            // worksheet.addRow([]);
            //Generate Excel File with given name
            workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], { type: EXCEL_TYPE });
                FileSaver.saveAs(blob, excelFileName + '_export' + EXCEL_EXTENSION);
                resolve();
            })
        });
    }

    getCellVali(worksheet, data, headersArray) {
        let msg = '';
        var row;
        let msg1 = "Please enter valid number.";
        data.forEach((element, i) => {
            headersArray.forEach((headers, ind) => {
                if (7 <= (ind + 1)) {
                    worksheet.getColumn(ind + 1).protection = { locked: false }
                    worksheet.getColumn(ind + 1).width = 25;
                    if (i == 0) {
                        msg = "Can't change name.";
                        // check participant cells in headers
                        getcells(ind, i, 1);
                        if (i === data.length - 1) { // if single item this condition will work
                            msg = msg1;
                            getcells(ind, i, 2);
                            getFormula(ind, i, 2)
                        }
                    } else {
                        msg = msg1;
                        //check participant amount cells 
                        getcells(ind, i, 1);
                        getFormula(ind, i, 1)
                        if (i === data.length - 1) { // this condition will check last row in excel
                            getcells(ind, i, 2);
                            getFormula(ind, i, 2)
                        }
                    }
                }
            })
        })

        function getcells(index, i, num) {
            row = worksheet.getRow(i + num);
            row.getCell(index + 1).dataValidation = {
                type: 'whole',
                operator: 'notEqual',
                showErrorMessage: true,
                formulae: [''],
                errorStyle: 'error',
                error: msg
            };
        }

        function getFormula(index, i, num) {
            row = worksheet.getRow(i + num);
            row.getCell(index + 1).dataValidation = {
                type: 'whole',
                operator: 'greaterThanOrEqual',
                showErrorMessage: true,
                formulae: [0],
                errorStyle: 'error',
                error: msg
            };
        }

    }
    // end download excel

    checkPriliminaryFileExtAndName(event) {
        let file1 = event.target.files[0]
        let nameArr1 = file1.name.split('.')
        let fileExt1 = nameArr1[nameArr1.length - 1];
        if (!['xlsx', 'xls'].includes(fileExt1.toLowerCase())) {
            return { file: file1, extensionValid: false, formData: null };
        }
        let formData1 = new FormData();
        formData1.append('sampleFile', file1);
        return { file: file1, extensionValid: true, formData: formData1 };
    }
    fileUpload(e, aucId) {
        return new Promise((resolve, reject) => {
            var files = e.target.files, f = files[0];
            var reader = new FileReader();
            reader.onload = (event: any) => {
                var data = new Uint8Array(event.target.result);
                var workbook = XLSX.read(data, { type: 'array' });
                var sheet_name_list = workbook.SheetNames;
                sheet_name_list.forEach((y) => {
                    if (y == "Preliminary_" + aucId) {
                        var worksheet: any = workbook.Sheets[y];
                        var headers = {};
                        var data = [];
                        for (let z in worksheet) {
                            if (z[0] === '!') continue;
                            //parse out the column, row, and value
                            var tt = 0;
                            for (var i = 0; i < z.length; i++) {
                                let tmp: any = z[i];
                                if (!isNaN(tmp)) {
                                    tt = i;
                                    break;
                                }
                            };
                            var col = z.substring(0, tt);
                            var row = parseInt(z.substring(tt));
                            var value = worksheet[z].v;

                            //store header names
                            if (row == 1 && value) {
                                headers[col] = value;
                                continue;
                            }

                            if (!data[row]) data[row] = {};
                            data[row][headers[col]] = value;
                        }
                        //drop those first two rows which are empty
                        data.shift();
                        data.shift();
                        for (let head in headers) {
                            data.forEach(ele => {
                                let prop = headers[head];
                                if (!ele[prop]) {
                                    ele[prop] = '';
                                }
                            })
                        }
                        resolve(data);
                    } else {
                        reject('Please upload valid excel file.');
                    }
                });
            };
            reader.readAsArrayBuffer(f);
        });
    }
}