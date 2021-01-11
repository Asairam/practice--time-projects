import { environment } from '../../environments/environment'; // environment
import { isArray } from 'util';
export const BASE_URL = environment;
export const DAYS_IN_THIS_MONTH = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
export const BUYER_PASTDETAILS = [
    { 'name': 'Day', 'value': 1 },
    { 'name': 'Week', 'value': 7 },
    { 'name': 'Month', 'value': DAYS_IN_THIS_MONTH },
    { 'name': 'Year', 'value': 365 }
];
export const AUC_TYPE = [ // do not change this order
    { 'name': 'Forward', value: 'forward' },
    { 'name': 'Reverse', value: 'reverse' }
];
export const MIN_BID = [
    { name: "Amount", ID: "amount" },
    { name: "Percentage", ID: "percentage" }
];

export const BIDINFOSUPPLIER = [{ key: 0, name: "Price and Rank", value: "Price and Rank", description: "Suppliers will see the Price Per Unit and Rank of all the bids visible to them at the designated level(s)." },
{ key: 1, name: "Rank", value: "Rank", description: "Suppliers will only see the Rank of all the bids visible to them at the designated level(s)." },
{ key: 2, name: "Price", value: "Price", description: "Suppliers will only see the Price Per Unit for all the bids visible to them at the designated level(s)." },
{ key: 3, name: "L1 Rank Only", value: "Top Rank Only", description: "" }]

export const BESTBIDINFO = [{ key: 0, value: "Best Cost Outcome", description: "Best bid information shown to suppliers will be based on selecting the best bid for every item." },
{ key: 1, value: "Single Source at every level", description: "Best bid information shown to suppliers will be based on selecting the best single supplier for every item and lot, and for the entire event." }
]

export const ONEVALUE = {
    currency: "INR"
}

export const IMAGE_URL = environment["rauction"];

export const EXTENDAUCTION = [{ key: 0, value: "Any bid" }, { key: 1, value: "Leading bid" }]

export const AUCTIONSTATUS = {
    CO: "Closed", CL: "Cancelled", PA: "Paused", DR: "Draft", PD: "Pending", AW: "Awarded",
    OP: "Open", PB: "Published", DL: "Deleted", IN: "Invited", SP: "Suspend", AC: "Accepted", RJ: "Rejected", BD: "Bidded"
}

export const supplierShown = { price: "price", rank: "rank", both: "price and rank", topRank:"L1 Rank Only" };
export const supplierShownInfo = ["Price", "Rank", "Price and Rank"];


export const ATTACHMENTTYPE_OPTION = [
    { id: 1, value: 'Technical Documents' },
    { id: 2, value: 'Commercial Documents' },
    { id: 3, value: 'Material Requisition for Quotation' },
    { id: 4, value: 'Bills of Quantities' },
    { id: 5, value: 'Others' }
];

export const FILE_EXT_TYPE = [
    'xlsx',
    'xls',
    'doc',
    'docx',
    'pdf',
    'jpeg',
    'png',
    'jpg',
    'zip'
];


export const IMAGE_TYPE = ['jpeg', 'jpg', 'png'];

export const DECIMAL_PLACES = [0, 1, 2, 3, 4, 5];
export const crudOpe = [{ 'name': 'Edit', 'bol': true }, { 'name': 'Delete', 'bol': true }];
export const crudPreBid = [{ 'name': 'Preliminary Bid', 'bol': true }, { 'name': 'Delete', 'bol': false }];

export const ACTIVITY_STATUS = ['A', 'B'];
export const ROLE_ACCESS_CONTROL = { buyer: 'buyer', restricted_buyer: 'restricted_buyer', supplier: 'supplier',customer:'customer',both_supplier:'supplier,customer', both: 'buyer,restricted_buyer', all: 'buyer,restricted_buyer,supplier,customer' };

export const dateTimeFilter = (date1, date2) => {
    const diffMs = (date1 - date2); // milliseconds between now & Christmas
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    const diffSeconds = (((diffMs % 86400000) % 3600000) / 60000) * 60; //seconds    
    return { 'days': diffDays, 'hours': diffHrs, 'minutes': diffMins, 'seconds': diffSeconds }; 
}

export const SEARCH_SUPPLIERFROM = [
    {role:"vendor", name: "Supplier", ID: "0" },
    {role:"customer", name: "Customer", ID: "2" },
    {role:"both", name: "Guest", ID: "1" },
];

export const DATATYPES = (value) => {
    let dataTypes = ['string', 'number', 'boolean', 'undefined'];
    return dataTypes.some(x => x == typeof value);
}

export const playAudio = () => {
    let audio = new Audio();
    audio.src = environment.rauction + 'assets/notification sound.mp3';
    audio.load();
    audio.play();
}

export const chatAudio = function() {
    let audio2 = new Audio();
    audio2.src = environment.rauction + 'assets/chat_notification.mp3';
    audio2.load();
    audio2.play();
}

export const participantSearch = { register: "Search Suppliers Here", unRegister: "Search Guest Here", customer: "Search Customers Here" }

export const customFieldVisibility = [
    { val: false, name: 'Buyer Write/Supplier No View', }
    , { val: true, name: 'Buyer Write/ Supplier View' }
];

const calculateTotalLandedA = (...data) => {
    return (data[0] * data[1] * data[2]) * (1 + (data[3] / 100));
}

const calculateTotalLandedB = (...item) => {
    return calculateItemWeightValue(item[0], item[1], item[3]) * item[2];
}

export const unitPrice = (...rest) => {
    return ((rest[0]) - Number((((rest[1] / 100) * rest[2]) / rest[5]).toFixed(rest[6]))) / ((1 + (rest[3] / 100)) * rest[4]);
}

export const convertCurrency = (...rest) => {
    return (rest[0] * rest[1]) / rest[2];
}

export const calculateItemWeight = (...data) => {
    let itemData = [];
    data[1].forEach(lot => {
        lot.items.forEach(item => {
            let bids = item.bids.filter(x => x.data.bidderID === data[2]);
            if (bids.length > 0) {
                bids.forEach(bid => {
                    // if (bid.data.bidderID === data[2]) {
                    itemData.push({ bestBid: bid.data.baseCost, minimumDesiredQuantity: item.minimumDesiredQuantity });
                    // }
                })
            }
        })
    });

    if (itemData.length > 0) {
        let allItem = itemData.map(x => x.bestBid * x.minimumDesiredQuantity).reduce((a, b) => a + b);
        return ((data[0].bestBid * data[0].minimumDesiredQuantity) / allItem);
    }
    return 0;
}

export const calculateItemWeightByBuyer = (...data) => {
    let itemData = [];
    data[1].forEach(lot => {
        lot.items.forEach(item => {
            if (item.bestBid) {
                itemData.push({ bestBid: item.bestBid, minimumDesiredQuantity: item.minimumDesiredQuantity });
            }
        })
    });
    if (itemData.length > 0) {
        let allItem = itemData.map(x => x.bestBid * x.minimumDesiredQuantity).reduce((a, b) => a + b);
        return ((data[0].bestBid * data[0].minimumDesiredQuantity) / allItem);
    }
    return 0;
}

export const calculateItemWeightValue = (...item) => {
    let itemData = [];
    if (!(item[2])) {
        item[1].forEach(lot => {
            let items = [...lot.items];
            items.forEach(items => {
                if (items["baseCost"] || items["itemsBestBid"] || items["itemsBestBidPrimary"]) {
                    items.bestBid = items["baseCost"] ? items["baseCost"] : items["itemsBestBidPrimary"] ? items["itemsBestBidPrimary"] : items["itemsBestBid"];
                    itemData.push({ ...items })
                }
            });
        });
    }
    else {
        itemData = item[1];
    }
    if (itemData.length > 0) {
        let allItem = itemData.map(x => x.bestBid * x.minimumDesiredQuantity).reduce((a, b) => a + b);
        return (((item[0]["itemsBestBidPrimary"] ? item[0]["itemsBestBidPrimary"] : item[0]["baseCost"] ? item[0]["baseCost"] : item[0]["itemsBestBid"] ? item[0]["itemsBestBid"] : item[0].bestBid) * item[0].minimumDesiredQuantity) / allItem);
    }
    return 0;
}

export const calculateTotalLandedCost = (AF, MF, [...items], { ...item }, foreign, itemArray = false, decimalPlace = null) => {
    let totalA = Number(calculateTotalLandedA(item["itemsBestBidPrimary"] ? item["itemsBestBidPrimary"] : item["baseCost"] ? item["baseCost"] : item["itemsBestBid"] ? item["itemsBestBid"] : item.bestBid, item.minimumDesiredQuantity, foreign, MF).toFixed(decimalPlace));
    let totalB = Number(calculateTotalLandedB(item, items, AF, itemArray).toFixed(decimalPlace));
    let totalLanded = Number((totalA + totalB).toFixed(decimalPlace));
    let landedUnit = Number((totalA + totalB).toFixed(decimalPlace)) / item.minimumDesiredQuantity;
    return ({ landedUnit: landedUnit, totalLanded: totalLanded });
}

export const filterCustomField = [{ id: '', value: '--Select--' }, { id: 'customFieldID', value: 'Custom Field ID' }, { id: 'fieldName', value: 'Custom Field Name' }];

export const filterItem = [{ id: '', value: '--Select--' }, { id: 'itemName', value: 'Item Name' },
/*{ id: 'itemID', value: 'Item ID' },*/ { id: 'itemCode', value: 'Item Code' },
{ id: 'minimumDesiredQuantity', value: 'Quantity' },
{ id: 'startPrice', value: 'Start Price' }, { id: 'historicalCost', value: 'Historical Cost' }]
export const filterParticipant = [{ id: '', value: '--Select--' }, { id: 'supplierName1', value: 'Supplier Name' },
{ id: 'supplierID', value: 'Supplier ID' },
{ id: 'supplierEmailId', value: 'Supplier Email ID' }]
export const filterHost = [{ id: '', value: '--Select--' }, { id: 'employeeName', value: 'Host Name' },
{ id: 'employeeMail', value: 'Email ID' }]
export const filterAllAuction = [{ id: 'createdAt', value: 'Created Date' }, { id: 'auctionID', value: 'Auction ID' },
{ id: 'auctionName', value: 'Auction Name' }, { id: 'type', value: 'Auction Type' },
{ id: 'company', value: 'Organiztion Unit' }, { id: 'createdBy', value: 'Created By' },{ id: 'rfqNo', value: 'RFQ No' }]

export const sorting = (arr, prop, type) => {
    if (type === 'ascending') {
        arr.sort(
            function (a, b) {
                if (a[prop] < b[prop]) {
                    return -1;
                } else if (a[prop] > b[prop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    } else {
        arr.sort(
            function (a, b) {
                if (a[prop] > b[prop]) {
                    return -1;
                } else if (a[prop] < b[prop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
}

export const twoLevelSorting = (arr, level1Prop, level1Type, level2Prop, level2Type) => {
    if(level1Prop && level2Prop) {
        // Lot level sort
        sorting(arr, level1Prop, level1Type === 'asc' ? 'ascending' : 'descending');
        // Item level sort ascending
        if (level2Type === 'asc') { 
            arr.sort(function (a, b) {
                if (a[level2Prop] < b[level2Prop]  && a[level1Prop] == b[level1Prop]) {
                    return -1;
                } else if (a[level2Prop] > b[level2Prop]  && a[level1Prop] == b[level1Prop]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        //Item level sort descending
        if (level2Type === 'desc') { 
            arr.sort(function (a, b) {
                if (a[level2Prop] > b[level2Prop] && a[level1Prop] == b[level1Prop]) {
                    return -1;
                } else if (a[level2Prop] < b[level2Prop]  && a[level1Prop] == b[level1Prop]) {
                    return 1;
                } else {
                    return 0;
                }
            })
        }
        return;
    }

    if(level1Prop && !level2Prop) {
        sorting(arr, level1Prop, level1Type === 'asc' ? 'ascending' : 'descending');
        lotlevelSortOnOriginalSequence(arr, level1Prop);
        return;
    }

    if(!level1Prop && level2Prop) {
        sorting(arr, level2Prop, level2Type === 'asc' ? 'ascending' : 'descending');
        return;
    }

    if(!level1Prop && !level2Prop) {
        sortOnOriginalSequence(arr, level2Type);
        return
    }
}

export const sortOnOriginalSequence = (arr, sortOrder) => {
    // ascending
    if (sortOrder === 'asc') { 
        arr.sort(function (a, b) {
            if (a.sequenceNumberOriginal < b.sequenceNumberOriginal) {
                return -1;
            } else if (a.sequenceNumberOriginal > b.sequenceNumberOriginal) {
                return 1;
            } else {
                return 0;
            }
        })
    } else {
        arr.sort(function (a, b) {
            if (a.sequenceNumberOriginal > b.sequenceNumberOriginal) {
                return -1;
            } else if (a.sequenceNumberOriginal < b.sequenceNumberOriginal) {
                return 1;
            } else {
                return 0;
            }
        })
    }
    
}
export const lotlevelSortOnOriginalSequence = (arr, level1Prop) => {
    // ascending
    arr.sort(function (a, b) {
        if (a.sequenceNumberOriginal < b.sequenceNumberOriginal && a[level1Prop] == b[level1Prop]) {
            return -1;
        } else if (a.sequenceNumberOriginal > b.sequenceNumberOriginal && a[level1Prop] == b[level1Prop]) {
            return 1;
        } else {
            return 0;
        }
    })
}
export const BUYER_SAVINGS = [{ key: 0, value: "Preliminary Bid", id: 100, "totalValue": 0, savingFilter:'preliminary' }, { key: 1, value: "Initial Bid", id: 101, "totalValue": 0, savingFilter:'initial' }, { key: 2, value: "Historical Bid", id: 102, "totalValue": 0, savingFilter:'historical' }];

export const GLOBAL_SEARCH_SELECTOR = [{ key: 'All', value: 'all' }, { key: 'Auction ID', value: 'auctionID' }, { key: 'Auction Name', value: 'auctionName' }, { key: 'Auction Description', value: 'auctionDescription' }, { key: 'Auction Status', value: 'auctionStatus' }, { key: 'Item Name', value: 'itemName' }, { key: 'Item Code', value: 'itemCode' }, { key: 'Item Description', value: 'itemDescription' }, { key: 'Vendor Code', value: 'vendorcode' }, { key: 'Vendor Name', value: 'vendorName' }, { key: 'Cohost Name', value: 'cohostName' }];


export const percentageRange = (event: KeyboardEvent) => {
    if (event.target["value"] >= 0 && event.target["value"] <= 100) {
        return false;
    }
    return true;
}

export const SWIPER_SLIDER = {
    slidesPerView: 3,
    spaceBetween: 15,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    breakpoints: {
        1024: {
            slidesPerView: 3,
            spaceBetween: 15,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 15,
        },
        640: {
            slidesPerView: 1,
            spaceBetween: 15,
        },
        320: {
            slidesPerView: 1,
            spaceBetween: 10,
        }
    }
}

//Start Editable for republish remark
let objArray=["currency","attachmentList","customFieldData"];
let idArray=["docFileId","customFieldID"];
let notRequire=["republishRequired","primaryCurrencyNew","isTemplate","auctionID","auctionStatus","isTemplate","remark"]
let flag=false;
const compareArrayData = (oldData, newData,key) => {
    if (!flag) {
        if (key == objArray[0]) {
            let result = newData.filter(firstArrayItem =>
                !oldData.some(
                    secondArrayItem => firstArrayItem[key] === secondArrayItem[key]
                )
            );
            if (result.length > 0) {
                flag = true;
            }
        }
        else if ((key == objArray[1] || key == objArray[2]) && !flag) {
            let keyData = idArray.find(x => Object.keys(newData[0]).some(y => x == y));
            newData.forEach(element => {
                if (!flag) {
                    let oldItem = oldData.filter(x => x[keyData] == element[keyData]);
                    if (oldItem.length > 0) {
                        compareData(element, oldItem[0],true);
                    }
                    else {
                        flag = true;
                    }
                }
            });

        }
    }
    return flag;
}

export const compareData = (newData = null, oldData = null,otherSource=false) => {
    if (!otherSource)
        flag = false;
    Object.keys(newData).forEach(key => {
        if (!(notRequire.some(x => x == key))) {
            if (!flag) {
                if (oldData && oldData.hasOwnProperty(key)) {
                    if (typeof newData[key] == 'object') {
                        if (isArray(newData[key])) {
                            if ((oldData[key].length != newData[key].length)) {
                                flag = true;
                            }
                            else {
                                if (newData[key].length > 0) {
                                    flag = compareArrayData(oldData[key], newData[key],key)
                                }
                            }
                        }
                        else if (newData[key] instanceof Date) {
                            if (new Date(oldData[key]).getTime() !== newData[key].getTime()) {
                                flag = true;
                            }
                        }
                        else if(newData[key] instanceof Object){
                            flag = compareData(oldData[key], newData[key],true);
                        }
                        else {
                            flag = checkData(oldData[key], newData[key]);
                        }
                    }
                    else {
                        flag = checkData(oldData[key], newData[key]);
                    }
                }
                else{
                    flag=true;
                }
            }
            else {
                return flag;
            }

            if (flag)
                console.log(key)
        }                
    });
    return flag;
}

const checkData = (oldData, newData) => {
    if (!(String(oldData) === String(newData)))
        return true;
    return false;
}
//End