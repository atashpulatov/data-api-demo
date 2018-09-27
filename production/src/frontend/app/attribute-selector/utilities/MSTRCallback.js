
export default class MSTRCallback {
    constructor(parameter) {
        this.query = window.location.search.substr(1).split('&');
        this.parameter = this.getQueryStringValue(parameter);
    }

    get data() {
        try {
            return JSON.parse(decodeURI(atob(this.parameter)));
        } catch (error) {
            return;
        }
    }

    getQueryStringValue(key) {
        let result;
        let temp = [];
        const {query} = this;

        for (let index = 0; index < query.length; index++) {
            temp = query[index].split('=');
            if (temp[0] === key) {
                result = decodeURIComponent(temp[1]);
            };
        }
        return result;
    }
}
