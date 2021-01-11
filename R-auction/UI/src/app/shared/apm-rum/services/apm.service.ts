import { init as initApm } from '@elastic/apm-rum';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, fromEvent, merge } from 'rxjs';
import { timeInterval, filter } from 'rxjs/operators';

var apm: any;

@Injectable({
    providedIn: 'root'
})

export class APMService {
    private info = {};
    geoApiUrl: any;
    apmConstants: any;
    serverUrl: any;
    serviceName: any;
    initialPageLoadName: any;
    application: any;
    component_name: any;
    platform: any;
    sub_platform: any;
    environmentVariable: any;
    userName: any;
    constructor(private router: Router, private http: HttpClient) {
        if (!sessionStorage.sessionId) {
            sessionStorage.sessionId = this.makeRandom(75, '');
        }
        else {
            let diffInMs = (+Date.now().toString()) - (+sessionStorage.sessionId.split('_')[1]);
            const diffInHours = (((diffInMs / 1000) / 60) / 60);
            if (diffInHours > 8) {
                sessionStorage.sessionId = this.makeRandom(75, '');
            }
        }
    }

    initializeApm(environment: any, transactionNamesConstant) {
        //in environment file below are the variables are mandatory and example given with sample values
        //apmUrl - http://apmrumdev.ril.com:8200
        //geoApiUrl: 'http://geoapi-geoapo.apps.us-east-1.starter.openshift-online.com/',
        //serviceName: "DT_AJ_DirectTaxUI",
        //initialPageLoadName: "DirectTax",
        //application: "DT",
        //component_name: "DT_AJ_DirectTaxUI",
        //platform: "FMS"
        //APM Constant is seperate from environment file. need to create as per project need
        //APMCONST = apmTransactionName: {'/masters/entity': 'Masters, Entity'}
        //'/masters/entity' - route of the page including
        //Masters - represents creating custom transaction which is TRANSACTION TYPE
        //Entity - represents creating custom transaction name which lies under transaction type.
        apm = initApm({
            // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
            serviceName: environment.serviceName,
            // Set the version of your application
            // Used on the APM Server to find the right sourcemap
            serviceVersion: '',
            // Set custom APM Server URL (default: http://localhost:8200)
            serverUrl: environment.apmUrl
            // distributedTracingOrigins: ['http://localhost:8080'],
        });
        this.serverUrl = environment.apmUrl;
        this.setInitialPageLoadName(environment.initialPageLoadName);
        this.setConstant(transactionNamesConstant);
        this.application = environment.application;
        this.component_name = environment.component_name;
        this.platform = environment.platform;
        this.sub_platform = environment.sub_platform;
        this.geoApiUrl = environment.geoApiUrl;
        this.environmentVariable = environment;
        this.refreshData();
        this.registerTimer();
    }

    getAPM(): any {
        return apm;
    }


    apiLogging(obj, data = null, params = null) {
        let currentUrl = this.router.url.split(';')[0];
        let urlKey = this.apmConstants[currentUrl];
        if (urlKey == undefined) {
            return obj;
        }
        let apiTransactionName = urlKey.split(',')[0];
        let apiCallName = urlKey.split(',')[1];
        var transaction = this.getAPM().startTransaction(apiCallName, apiTransactionName, {
            managed: true
        });
        if (params && params != "") {
            transaction.addLabels({ 'queryParameters': JSON.stringify(params) });
        }
        if (data && data != "") {
            transaction.addLabels({ 'inputData': JSON.stringify(data) });
        }
        transaction.addLabels({ 'sessionId': sessionStorage.sessionId });
        transaction.addLabels({ application: this.application });
        transaction.addLabels({ component_name: this.component_name });
        transaction.addLabels({ platform: this.platform });
        transaction.addLabels({ sub_platform: this.sub_platform });
        transaction.addLabels({ component_type: 'UI-API' });
        transaction.addLabels({ user_id: this.userName });

        return Observable.create(observer => {
            obj.subscribe((response: any) => {
                transaction.addLabels({ log_type: 'INFO' });
                transaction.addLabels({ 'output': JSON.stringify(response) });
                transaction.addLabels({ is_error: 'false' });
                transaction.end();
                observer.next(response);
                observer.complete();
            }, (error: any) => {
                transaction.addLabels({ log_type: 'ERROR' });
                transaction.addLabels({ 'output': JSON.stringify(error) });
                transaction.addLabels({ 'error_code': error.status });
                transaction.addLabels({ 'error_message': error.message });
                transaction.addLabels({ is_error: 'true' });
                transaction.end();
                observer.error(error);
                observer.complete();
            });

        });
    }

    setInitialPageLoadName(pageName: string) {
        this.getAPM().setInitialPageLoadName(pageName);
    }

    setUserContext(userId: string, userName: string, email: string) {
        this.userName = userName;
        this.getAPM().setUserContext({
            'id': userId,
            'username': userName,
            'email': email
        });
    }

    setConstant(obj: any) {
        this.apmConstants = obj;
    }

    getConstant() {
        return this.apmConstants;
    }

    setServerUrl(url: string) {
        this.serverUrl = url;
    }

    getServerUrl() {
        return this.serverUrl;
    }

    makeRandom(lengthOfCode: number, value: string = null) {
        let pattern = Date.now().toString() + "abcdefghijklmnopqrstuvwxyzElPaNiLlOABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let possible = value == null ? pattern : value + pattern;
        let text = "";
        for (let i = 0; i < lengthOfCode; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text + '_' + Date.now().toString();
    }

    getEnvironmentVariable() {
        return this.environmentVariable;
    }

    refreshData() {
        let that = this;
        this.getPublicIP();
        if (navigator.geolocation) {
            try {
                navigator.geolocation.getCurrentPosition(function (position) {
                    that.info['locationData'] = position;
                }, function () {
                    that.info['locationData'] = 'Not available'
                });
            }
            catch (e) {
                console.log(e);
            }

        } else {
            // Browser doesn't support Geolocation
            that.info['locationData'] = 'Not available'
            console.log('position not available');
        }

        this.info['timeOpened'] = new Date();
        var split = new Date().toString().split("(");
        this.info['timezone'] = split[1] ? split[1].replace(')', '') : 'undefined';
        this.info['referrer'] = document.referrer;
        this.info['browserName'] = this.getBrowser();
        this.info['browserEngine'] = navigator.product;
        this.info['browserVersion1a'] = navigator.appVersion;
        this.info['browserVersion1b'] = navigator.userAgent;
        this.info['browserLanguage'] = navigator.language;
        this.info['browserOnline'] = navigator.onLine;
        this.info['javaEnabled'] = navigator.javaEnabled();
        this.info['cookieEnabled'] = navigator.cookieEnabled;
        this.info['cookies'] = document.cookie;
        this.info['localStorage'] = localStorage;
        this.info['sessionStorage'] = JSON.stringify(sessionStorage);
        this.info['device'] = this.isMobile() ? 'mobile' : 'desktop';
        this.info['resolution'] = window.screen.width * window.devicePixelRatio + "x" + window.screen.height * window.devicePixelRatio;
        this.info['operatingSystem'] = this.isMobile() ? this.getMobileOperatingSystem() : navigator.platform;
        var findIP = new Promise(r => {
            try {
                var w = window,
                    a = new (w['RTCPeerConnection'] || w['mozRTCPeerConnection'] || w['webkitRTCPeerConnection'])({ iceServers: [] }),
                    b = () => { };
                a.createDataChannel("");
                a.createOffer(c => a.setLocalDescription(c, b, b), b);
                a.onicecandidate = c => {
                    try {
                        c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)
                    } catch (e) { }
                }
            }
            catch (e) {
                console.log('IP local failed - ', e);
                r('not found');
            }
        })
        /*Usage example*/
        findIP.then(ip => that.info['localip'] = ip).catch(e => console.error(e));

    }

    getInfo() {
        return this.info;
    }


    private getBrowser() {

        // Firefox 1.0+
        var isFirefox = this.isFirefox();

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = this.isSafari();

        // Internet Explorer 6-11
        var isIE = this.isIE();

        // Edge 20+
        var isEdge = !isIE && !!window['StyleMedia'];

        // Chrome 1 - 71
        var isChrome = !!window['chrome'] && (!!window['chrome'].webstore || !!window['chrome'].runtime);

        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window['CSS'];

        //Opera
        var isOpera = this.isOpera();

        if (isOpera)
            return 'Opera';
        if (isFirefox)
            return 'Firefox';
        if (isSafari)
            return 'Safari 3.0+';
        if (isIE)
            return 'Internet Explorer 6-11';
        if (isEdge)
            return 'Edge 20+';
        if (isChrome)
            return 'Chrome';
        if (isBlink)
            return 'Blink';
    }
    private isOpera(): boolean {
        return (!!window['opr'] && !!window['opr'].addons) || !!window['opera'] || navigator.userAgent.indexOf(' OPR/') >= 0;
    }

    private isFirefox(): boolean {
        //noinspection TypeScriptUnresolvedVariable
        return ("InstallTrigger" in window) || typeof window['InstallTrigger'] !== 'undefined';
    }

    private isSafari(): boolean {
        return /constructor/i.test(String(window['HTMLElement'])) || ((p): boolean => {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || window['safari'].pushNotification);
    }

    private isIE(): boolean {
        return /*@cc_on!@*/false || !!window.document['documentMode'];
    }

    getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window['opera'];

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window['MSStream']) {
            return "iOS";
        }

        return "unknown";
    }

    isMobile() {
        let userAgent = navigator.userAgent || navigator.vendor || window['opera'];
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent))
            return true;
        return false;
    }
    logLoadTime() {
        this.info['apploadTime'] = (Date.now() - window['timerStart']) / 1000;
    }

    registerTimer() {

        const events = [
            'click',
            'scroll',
            'keyup',
            'wheel',
            'mousemove'
        ];
        const eventStreams = events.map((ev) => fromEvent(document, ev));
        const allEvents$ = merge(...eventStreams);
        let that = this;
        allEvents$
            .pipe(
                timeInterval(),
                filter(i => i.interval > 1000)
            )
            .subscribe(
                i => {
                    that.logIdleTime(i.interval / 1000);
                }
            );

        //Time on a route

        this.router.events.pipe(
            filter(ev => ev instanceof NavigationStart),
            timeInterval()
        )
            .subscribe(
                i => {
                    that.logRouteChange(i);
                    this.log('route');
                }
            );
        this.router.events.subscribe(route => {
            if (route instanceof NavigationStart) {
                this.info['lastRouteChange'] = { from: this.router.url, to: route.url };
                this.info['lastStartingRoute'] = this.router.url;
                this.info['lastEndingRoute'] = route.url;
            }
        })
    }

    logIdleTime(interval) {
        let currentPath = this.router.url;
        this.info['lastIdleTime'] = {
            'route': currentPath,
            'time': interval
        }
    }

    logRouteChange(event) {
        let currentPath = this.router.url;
        let interval = event.interval / 1000;
        // this.info['lastTimeSpentOnRoute'] = {
        //     'route': currentPath,
        //     'time': interval
        // }
        this.info['lastTimeSpentOnRoute'] = {
            'time': interval
        }
    }

    logClick(el) {
        let currentPath = this.router.url;
        let labelName = el.label;
        if (el.nocount) {
            if (!this.info['clickOnRoute'])
                this.info['clickOnRoute'] = {};
            if (!this.info['clickOnRoute'][currentPath])
                this.info['clickOnRoute'][currentPath] = {};
            if (this.info['clickOnRoute'][currentPath][labelName]) {
                this.info['clickOnRoute'][currentPath][labelName] = {
                    'type': labelName,
                    'count': this.info['clickOnRoute'][currentPath][labelName].count,
                    'lastValue': el.value
                }
            }
            else {
                this.info['clickOnRoute'][currentPath][labelName] = {
                    'type': labelName,
                    'count': 0,
                    'lastValue': el.value
                }
            }
        }
        else {
            if (!this.info['clickOnRoute'])
                this.info['clickOnRoute'] = {};
            if (!this.info['clickOnRoute'][currentPath])
                this.info['clickOnRoute'][currentPath] = {};
            if (this.info['clickOnRoute'][currentPath][labelName]) {
                this.info['clickOnRoute'][currentPath][labelName] = {
                    'type': labelName,
                    'count': this.info['clickOnRoute'][currentPath][labelName].count + 1,
                    'lastValue': el.value
                }
            }
            else {
                this.info['clickOnRoute'][currentPath][labelName] = {
                    'type': labelName,
                    'count': 1,
                    'lastValue': el.value
                }
            }
            this.info['lastClick'] = el;
            this.info['lastClickType'] = el.type;
            this.info['lastClickLabel'] = el.label;
            this.info['lastClickValue'] = el.value;
            this.log('click');
        }
    }

    logHover(el) {
        this.info['lastHover'] = el;
        this.log('hover');
    }

    log(type = 'default') {
        this.info['latestPerformanceObj'] = window.performance.toJSON().timing;
        var transactionEvent = this.getAPM().startTransaction(type.toUpperCase(), 'Logging', {
            managed: true
        });
        transactionEvent.addLabels({ type, timeZone: this.info['timezone'] });
        transactionEvent.addLabels({ type, lastClick: JSON.stringify(this.info['lastClick']) });
        transactionEvent.addLabels({ type, lastClickType: JSON.stringify(this.info['lastClickType']) });
        transactionEvent.addLabels({ type, lastClickLabel: JSON.stringify(this.info['lastClickLabel']) });
        transactionEvent.addLabels({ type, lastClickValue: JSON.stringify(this.info['lastClickValue']) });
        transactionEvent.addLabels({ type, referrer: JSON.stringify(this.info['referrer']) });
        transactionEvent.addLabels({ type, browserName: JSON.stringify(this.info['browserName']) });
        transactionEvent.addLabels({ type, browserEngine: JSON.stringify(this.info['browserEngine']) });
        transactionEvent.addLabels({ type, browserVersion1a: JSON.stringify(this.info['browserVersion1a']) });
        transactionEvent.addLabels({ type, browserVersion1b: JSON.stringify(this.info['browserVersion1b']) });
        transactionEvent.addLabels({ type, browserLanguage: JSON.stringify(this.info['browserLanguage']) });
        transactionEvent.addLabels({ type, browserOnline: JSON.stringify(this.info['browserOnline']) });
        transactionEvent.addLabels({ type, javaEnabled: JSON.stringify(this.info['javaEnabled']) });
        transactionEvent.addLabels({ type, cookieEnabled: JSON.stringify(this.info['cookieEnabled']) });
        transactionEvent.addLabels({ type, cookies: JSON.stringify(this.info['cookies']) });
        transactionEvent.addLabels({ type, device: JSON.stringify(this.info['device']) });
        transactionEvent.addLabels({ type, resolution: JSON.stringify(this.info['resolution']) });
        transactionEvent.addLabels({ type, operatingSystem: JSON.stringify(this.info['operatingSystem']) });
        transactionEvent.addLabels({ type, locationData: JSON.stringify(this.info['locationData']) });
        transactionEvent.addLabels({ type, clickOnRoute: JSON.stringify(this.info['clickOnRoute']) });
        transactionEvent.addLabels({ type, lastRouteChange: JSON.stringify(this.info['lastRouteChange']) });
        transactionEvent.addLabels({ type, lastStartingRoute: JSON.stringify(this.info['lastStartingRoute']) });
        transactionEvent.addLabels({ type, lastEndingRoute: JSON.stringify(this.info['lastEndingRoute']) });
        transactionEvent.addLabels({ type, ipbasedLocationData: JSON.stringify(this.info['ipbasedLocationData']) });
        transactionEvent.addLabels({ type, city: JSON.stringify(this.info['city']) });
        transactionEvent.addLabels({ type, country: JSON.stringify(this.info['country']) });
        transactionEvent.addLabels({ type, latlong: JSON.stringify(this.info['latlong']) });
        transactionEvent.addLabels({ type, lat: JSON.stringify(this.info['lat']) });
        transactionEvent.addLabels({ type, long: JSON.stringify(this.info['long']) });
        transactionEvent.addLabels({ type, accuracy: JSON.stringify(this.info['accuracy']) });
        transactionEvent.addLabels({ type, publicIp: JSON.stringify(this.info['publicIp']) });
        transactionEvent.addLabels({ type, latestPerformanceObj: JSON.stringify(this.info['latestPerformanceObj']) });
        transactionEvent.addLabels({ type, lastTimeSpentOnRoute: JSON.stringify(this.info['lastTimeSpentOnRoute']) });
        transactionEvent.addLabels({ type, lastIdleTime: JSON.stringify(this.info['lastIdleTime']) });
        transactionEvent.addLabels({ type, sessionId: sessionStorage.sessionId });
        transactionEvent.addLabels({ type, application: this.application });
        transactionEvent.addLabels({ type, component_name: this.component_name });
        transactionEvent.addLabels({ type, platform: this.platform });
        transactionEvent.addLabels({ type, sub_platform: this.sub_platform });
        transactionEvent.addLabels({ type, component_type: 'UI' });
        transactionEvent.addLabels({ type, log_type: 'INFO' });
        transactionEvent.addLabels({ type, is_error: 'false' });
        transactionEvent.addLabels({ type, user_id: this.userName == undefined ? 'Not Applied' : this.userName });

        console.log(type, this.info);
        this.http.get(this.geoApiUrl, { responseType: 'json' }).subscribe((res: any) => {
            transactionEvent.end();
        }, (error: any) => {
        })
    }

    //API Calls

    getPublicIP() {
        this.http.get(this.geoApiUrl, { responseType: 'json' }).subscribe((res: any) => {
            if (res.data) {
                this.info['publicIp'] = res.data.ip;
                this.info['ipbasedLocationData'] = {
                    'city': res.data.location.city,
                    'country': res.data.location.country,
                    'latlong': res.data.location.ll,
                    'accuracy': res.data.location.area
                }
                this.info['city'] = res.data.location.city;
                this.info['country'] = res.data.location.country;
                this.info['latlong'] = res.data.location.ll;
                this.info['lat'] = res.data.location.ll[0];
                this.info['long'] = res.data.location.ll[1];
                this.info['accuracy'] = res.data.location.area;

            }
        }, (error: any) => {
            console.log('GEOIP failed');
        })
    }

    getUserName() {
        return this.userName == undefined ? 'Not Applied' : this.userName;
    }
}