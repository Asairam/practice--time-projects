export class EmailTemplate {

    mailStyle = ` <meta charset="utf-8">
        <meta content="IE=edge" http-equiv="X-UA-Compatible">
        <meta content="width=device-width,initial-scale=1" name="viewport">
        <title>Email </title>
        <style>
            p{padding:0px; margin: 0;}
            .regular{ margin: 10px 0; }
            .spacer{ width:100%; height: 10px;}
            .alternate{ color:#676767; font-weight: 600;}
            .list { margin: 0; padding: 5px 5px 5px 25px;}
            .list-item{ list-style-type: circle; padding-bottom: 3px;}
            .list-item-none{ list-style-type: none; padding-bottom: 3px;}
            .spacertop{margin-top:5px;}
            .label{ font-weight:bold; }
            .value{ }
            .left-spacer{ margin-left:90px;}
            .link{color:#5a09dc; text-decoration: none; cursor: pointer;}
            .note{color: #171717;}
            .dnr{font-weight: bold;font-size: 12px; color: #7b7b7b;}
        </style>`;

    inviteRemark(company) {
        return `
            You have been invited to participate in the Auction event as a co-host for 
            <span class="alternate update company"  contenteditable="false">${company}</span> as per following details,
         `;
    };

    inviteRemarkSup(company) {
        return `
            You have been invited to participate in the Auction event for 
            <span class="alternate update company"  contenteditable="false">${company}</span> as per following details,
         `;
    };

    republishRemark(company, auctionId, remark) {
        return `
            The Auction ${auctionId} for <span class="alternate update company"  contenteditable="false">${company}</span> is republished for your reacceptance with following remarks from host:
                <ul class="list" >
                    <li class="list-item update" contenteditable="false">
                        <span class="label" > Remarks:- </span> <span class="value remarkabale" contenteditable="false">${remark}</span>
                    </li>
                </ul>
            <div class="spacer"></div>`;
    };

    republishRemarkHost(company, auctionId, remark) {
        return `
            The Auction ${auctionId} for <span class="alternate update company"  contenteditable="false">${company}</span> is republished with following remarks from host:
                <ul class="list" >
                    <li class="list-item update" contenteditable="false">
                        <span class="label" > Remarks:- </span> <span class="value remarkabale" contenteditable="false">${remark}</span>
                    </li>
                </ul>
            <div class="spacer"></div>`;
    };

    noteSup() {
        return `
        <div class="spacer"></div>
        <b> Note : </b>
        <ul class="list" >
            <li class="list-item" contenteditable="false">
                All rights ( Pre & Post E-bid) reserved with Reliance, Reliance is not bound for placement of
                order on Bid Winner at the Bid Winners E-bid price ( further negotiation may be done if the Reliance budgeted target
                price shall be not achieved).
            </li>
            <li class="list-item" contenteditable="false">
                If the auction invitation is already accepted from your side , kindly reaccept it.
            </li>
            <li class="list-item" contenteditable="false">
                If the auction invitation is not yet accepted or declined from your side, kindly accept or decline it.
            </li>
        </ul>`;
    }

    noteHost() {
        return `
        <div class="spacer"></div>
        <b> Note : </b>
        <ul class="list" >
            <li class="list-item" contenteditable="false">
                If the auction invitation is already accepted from your side , kindly reaccept it.
            </li>
            <li class="list-item" contenteditable="false">
                If the auction invitation is not yet accepted or declined from your side, kindly accept or decline it.
            </li>
        </ul>`;
    }

    hostMailTemplate(obj) {
        return `
        <!DOCTYPE html> 
        <html>
            <head>
                ${this.mailStyle}
            </head>    
            <body>
                <div class="regular">
                    Dear Sir/Madam, <div class="spacer"></div>
                    <div class="" >
                    <div class="update remark" contenteditable="false">
                    ${this.inviteRemark(obj.company_name)}
                    </div>   
                    <div class="update round" contenteditable="false"></div> 
                    <ul class="list" >
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction Name:- </span> <span class="value name" contenteditable="false">${obj.name}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction Type :- </span> <span   class="value type" contenteditable="false">${obj.type.toUpperCase()}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction Description  :- </span><span  class="value description" contenteditable="false">${obj.description}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Business Unit :- </span><span class="value business"  contenteditable="false">${obj.businessUnit.toUpperCase()}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label"  > Auction Start Date & Time:- </span>
                                <span class="value start"  contenteditable="false">${(obj.sTime && obj.startDate) ? (obj.startDate.getDate() + '/' + (obj.startDate.getMonth() + 1) + '/' + obj.startDate.getFullYear() + ' ' + (obj.sTime ? obj.sTime : '')) : ''}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction End Date & Time:- </span>
                                <span class="value end"  contenteditable="false">${(obj.eTime && obj.endDate) ? (obj.endDate.getDate() + '/' + (obj.endDate.getMonth() + 1) + '/' + obj.endDate.getFullYear() + ' ' + (obj.eTime ? obj.eTime : '')) : ''}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="spacer"></div>    
                    <div class="">
                    <div class="update" contenteditable="false">
                        <span class="label" contenteditable="false"> Login Link :- </span>
                        <a class="link login" contenteditable="false" href="${obj.applicationUrl}" target="_blank">${obj.applicationUrl}</a>    
                       </div> <ul class="list">
                            <li class="list-item-none">
                                Kindly login using this e-mail ID on the above link, preferably using Google Chrome.If your using
                                 R-Auction for the first time, kindly generate your password using ‘Forgot Password’ on the login screen.
                            </li>
                        </ul>
                    </div>
                   
                    <div class="spacer"></div>
                    <div class="" >
                        <div>For any queries related to Auction, feel free to contact Auction Author</div>
                        <ul class="list">
                            <li class="list-item">
                                <span class="label">  P&C Buyer:-  </span>
                                <span class="value">${obj.Fname} ${obj.Lname}</span>
                            </li>
                            <li class="list-item">
                                <span class="label"> Buyer Email Id:- </span>
                                <span class="value"><a class="link" href="mailto:${obj.org_name.email}" > ${obj.org_name.email} </a> </span>
                            </li>
                            <li class="list-item"> 
                                <span class="label"> Buyer contact no :- </span>
                                <span class="value">${obj.org_name.mobile} </span>
                            </li>
                        </ul>
                    </div>  
                    <div class="spacer"></div>    
                    <div class="dnr"> This is system generated e-mail. Please do not reply. </div>
                </div>
            </body>    
        </html>
        `;
    }

    supplierMailtemplate(obj) {
        return `
        <!DOCTYPE html> 
        <html>
            <head>
            ${this.mailStyle}
            </head>
            <body>
                <div class="regular">
                    Dear Sir/Madam,
                    <div class="spacer"></div>
                    <div class="" >
                    <div class="update remark" contenteditable="false">
                    ${this.inviteRemarkSup(obj.company_name)}
                    </div> 
                    <div class="update round" contenteditable="false"></div>  
                        <ul class="list">
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction Name:- </span>
                                <span class="value name" contenteditable="false">${obj.name}</span>  
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction Type :- </span>
                                <span class="value type" contenteditable="false">${obj.type.toUpperCase()}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction Description  :- </span>
                                <span class="value description"  contenteditable="false" >${obj.description}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Business Unit :- </span>
                                <span class="value business" contenteditable="false"  >${obj.businessUnit.toUpperCase()}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction Start Date & Time:- </span>
                                <span class="value start" contenteditable="false" >${(obj.sTime && obj.startDate) ? (obj.startDate.getDate() + '/' + (obj.startDate.getMonth() + 1) + '/' + obj.startDate.getFullYear() + ' ' + (obj.sTime ? obj.sTime : '')) : ''}</span>
                            </li>
                            <li class="list-item update" contenteditable="false">
                                <span class="label" > Auction End Date & Time:- </span>
                                <span class="value end" contenteditable="false" >${(obj.eTime && obj.endDate) ? (obj.endDate.getDate() + '/' + (obj.endDate.getMonth() + 1) + '/' + obj.endDate.getFullYear() + ' ' + (obj.eTime ? obj.eTime : '')) : ''}</span>
                            </li>
                        </ul>
                    </div>  
                    <div class="spacer"></div>  
                    <div class="">
                    <div class="update" contenteditable="false">
                    <span class="label" contenteditable="false"> Login Link :- </span>
                    <a class="link login" contenteditable="false" href="${obj.applicationUrl}" target="_blank">${obj.applicationUrl}</a>    
                   </div> 
                        <ul class="list">
                            <li class="list-item-none">
                                Kindly login using this e-mail ID on the above link, preferably using Google Chrome.If your
                                using R-Auction for the first time, kindly generate your password using ‘Forgot Password’ on the login screen.
                            </li>
                            <li class="list-item-none">
                            </li>
                        </ul>
                    </div>
                    <div class="spacer"></div>
                    <div class="" >
                        <div>For any queries related to Auction, feel free to contact Auction Author</div>  
                        <ul class="list">
                            <li class="list-item">
                                <span class="label">  P&C Buyer:-  </span>
                                <span class="value">${obj.fname}  ${obj.lname}</span>
                            </li>
                            <li class="list-item">
                                <span class="label"> Buyer Email Id:- </span>
                                <span class="value"><a class="link" href="mailto:${obj.org_name.email}"> ${obj.org_name.email}</a></span>
                            </li>
                            <li class="list-item">
                                <span class="label"> Buyer contact no :- </span>
                                <span class="value"> ${obj.org_name.mobile}</span>
                            </li>
                        </ul>
                    </div>
                   
                    <div class="update note">
                        <b>Note : </b>All rights ( Pre & Post E-bid) reserved with Reliance, Reliance is not bound for placement of
                        order on Bid Winner at the Bid Winners E-bid price ( further negotiation may be done if the Reliance budgeted target
                        price shall be not achieved).
                    </div>
                    <div class="spacer"></div>  
                    <div class="dnr"> This is system generated e-mail. Please do not reply. </div>
    
                </div>
            </body>
        </html>
        `;
    }

    roundAucName(round) {
        return `
            <ul class="list" style="padding: 0px 5px 0px 25px;">
                    <li class="list-item update" contenteditable="false">
                        <span class="label" > Round Name:- </span> <span class="value remarkabale" contenteditable="false">${round}</span>
                    </li>
                </ul>`;
    };

    calendarTitleView(element) {
        // let start = new Date(element.startDate);
        // let end = new Date(element.endDate);
        // let sDate = (start.getMonth()+1) + '/' + start.getDate() + '/' + start.getFullYear();
        // let eDate = (end.getMonth()+1) + '/' + end.getDate() + '/' + end.getFullYear();
        return `${element.auctionID}/${element.auctionName}<br/>`;
    }

}
